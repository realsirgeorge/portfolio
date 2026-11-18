---
slug: "sequence-break-tcp-isn-covert-channel"
title: "Sequence Break: data that left without a payload"
date: "2026-10-04"
category: "ctf"
tags:
  - "CTF"
  - "Network Forensics"
  - "TCP/IP"
  - "Covert Channels"
  - "31 Nights of Cyber"
excerpt: "Thirty-one unanswered SYNs, zero payload bytes, and a flag hidden in the low byte of the initial sequence number. This is what a header-level covert channel looks like."
---

![Sequence Break — a covert channel in TCP sequence numbers](/images/blog/sequence-break-tcp-isn-covert-channel/hero.png)

The brief said a host had made an unusually high number of outbound connection attempts to one external address. None of them completed a handshake. No payload was ever sent. Security suspected data still left the network.

Uhm. If no payload was sent, what exactly is left?

Turns out: quite a lot. The pcap is 193 packets, with unrelated background traffic and a handful of other failed connections thrown in. The first job was separating the signal from the noise.

## Find the one-sided conversations

```console
$ tshark -r capture.pcap \
    -Y "tcp.flags.syn==1 && tcp.flags.ack==0" \
    -T fields -e ip.dst -e tcp.dstport | sort | uniq -c | sort -rn
  31  45.33.22.11  4444
   3  23.94.61.10  3389
   3  203.0.113.10 80
   3  198.51.100.7 80
   3  185.220.101.7 23
   1  93.184.216.34 80
   1  91.219.237.5 8080
```

Thirty-one SYNs to one host on port `4444`, and no SYN-ACK back. The other clusters are one to three SYNs each — the "unrelated failed connections" from the brief. Counting alone gives you a hint, but it does not tell you *why* those thirty-one are different.

Port 4444 is a classic C2/meterpreter port, which is probably why it was chosen. It is also a red herring in the sense that the port does not matter; it just makes the traffic look like something you have seen before.

![Finding the channel, field by field](/images/blog/sequence-break-tcp-isn-covert-channel/flow.png)

## Check every field that could carry data

This is the part where I expected to find a tiny payload encoded in the IP ID or the window size. So I checked all of them:

| Field | Observation |
|---|---|
| payload | always empty (`Len=0`) |
| IP ID | `0x0001` on every packet — constant |
| TTL | 64 — constant |
| TCP window | 64240 — constant |
| TCP options | none |
| **TCP SEQ (ISN)** | **different on every SYN, high entropy** |

Everything that could plausibly carry a message was constant. Except one field: the initial sequence number.

An ISN is supposed to look random. [RFC 6528](https://www.rfc-editor.org/rfc/rfc6528) describes the algorithm: `ISN = M + F(localIP, localPort, remoteIP, remotePort, secret)`, where `F` is a keyed hash. "Looks random" is the entire point — it makes off-path TCP spoofing harder. So 31 seemingly random numbers is not, on its own, suspicious.

But only one of the four bytes was carrying ASCII.

## Extract the low byte

```
$ tshark -r capture.pcap -Y "ip.dst==45.33.22.11" -T fields -e tcp.seq_raw
882152562
1369072688
1707834160
...
```

```python
seqs = [882152562, 1369072688, 1707834160, ...]  # 31 values
flag = bytes(s & 0xff for s in seqs)
print(flag)
```

```
b'r00t{s3q_numb3r_c0v3rt_ch4nn3l}'
```

There it is. `r` is `0x72` = 114 = `882152562 & 0xff`. The other three bytes of each ISN are random padding, so the stream looks like ordinary "random ISN" traffic until you look at one byte position across 31 packets.

The sanity check is worth doing: try all four byte offsets and see which one produces structured text.

```
byte 0: b'r00t{s3q_numb3r_c0v3rt_ch4nn3l}'
byte 1: b'\x94d{/i\xdaf\xa0L\x1e\xcc\nSX\x85\x05\xdb'...'
byte 2: b'\x94\x9a\xcby\x86\x13\xd4,\x97"\xbd\xb8\xfeR\xa4...'
byte 3: b'4QeX\x8d\xcftt\x92\x81\xd3D\x8f\x90\xf5\xc03...'
```

Only byte 0 is printable ASCII. The flag format `r00t{...}` makes the answer self-validating, which is the nice thing about CTF flags: you always know when you have it.

## Why this is nastier than it sounds

A payload-based IDS never sees this. The SYN carries no application data. The connection never completes, so there is no session to inspect. You get a burst of failed connection attempts, which looks like a port scan or a misconfigured client.

The channel survives because network telemetry usually records **flows**, not full packets. NetFlow/IPFIX keeps byte counts, ports, flags, and timestamps. It does not keep the ISN. To see this, you need full packet capture or SYN-level metadata — for example, [Zeek](https://zeek.org/)'s `conn` and `tcp` logs, which can be configured to retain sequence numbers.

Practical detection:

- Baseline ISN byte entropy per source. Alert when the printable-ASCII fraction of the low byte is implausibly high.
- Treat repeated one-way SYN bursts to a single `dst:port` as beaconing, not as "failed connections".
- Correlate with DNS or TLS metadata. An exfil channel usually has a resolution or a certificate somewhere upstream.
- Keep packet capture long enough to investigate. If your retention is 24 hours and the beacon runs for a week, you will never see the pattern.

## What tripped me up

Nothing major on this one, but I did spend a few minutes assuming the IP ID was the channel because it was constant. Constant does not mean empty — it can mean "the field is deliberately normalised to hide the real channel." The trick was ordering the search by **field entropy**, not by protocol semantics: in 193 packets, exactly one header field varied in a non-random way per flow.

I also tried the source port first. It was boring. That is fine; cheap negative results are how you narrow the space.

## Fixes, if this were your network

- Egress filtering on the firewall: if a workstation has no business talking to `45.33.22.11:4444`, drop it. Most exfil channels die at a default-deny egress rule.
- If you cannot do default-deny, at least alert on one-way SYN bursts.
- Use a monitored DNS resolver, and log it.
- Assume the host is compromised once you find the channel. The network finding is the symptom; the persistence mechanism is the actual incident.

## Further reading

- [RFC 6528 — Defending against Sequence Number Attacks](https://www.rfc-editor.org/rfc/rfc6528)
- [RFC 793 — Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc793)
- [MITRE ATT&CK T1048 — Exfiltration Over Alternative Protocol](https://attack.mitre.org/techniques/T1048/)
- [Zeek network security monitor](https://zeek.org/)
- [Wireshark display filter reference](https://www.wireshark.org/docs/dfref/)

Day five was a lot friendlier: FTP, in the clear, with the password reused on the ZIP.
