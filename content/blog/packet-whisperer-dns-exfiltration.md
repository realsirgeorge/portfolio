---
slug: "packet-whisperer-dns-exfiltration"
title: "Packet Whisperer: a ZIP file rebuilt from DNS queries"
date: "2026-10-13"
category: "ctf"
tags:
  - "CTF"
  - "Network Forensics"
  - "DNS"
  - "Exfiltration"
  - "Wireshark"
  - "31 Nights of Cyber"
excerpt: "Twenty-six DNS queries carried base64 chunks of an encrypted-looking ZIP. Join the labels, decode once, and the flag is inside."
---

![Packet Whisperer — DNS as an exfiltration channel](/images/blog/packet-whisperer-dns-exfiltration/hero.png)

DNS is the one protocol that almost every network allows out. That is exactly why it is a favourite exfiltration channel: you do not need to punch a hole in the firewall, you just need a resolver and a domain you control.

This capture is 1,279 packets over 963 seconds. Twenty-six of them are DNS. The rest is TCP noise.

## The minority protocol is the channel

```console
$ capinfos chall.pcap
Number of packets:   1279
Capture duration:    963.497675 seconds

$ tshark -r chall.pcap -q -z io,phs
frame  1279
  eth  1279
    ip 1279
      tcp 1253
      udp   26
        dns 26
```

1,253 TCP packets versus 26 DNS packets. In an exfiltration challenge, the protocol that is *underrepresented* is usually the one doing the work. Normal traffic is the noise floor; the channel is the anomaly.

```console
$ tshark -r chall.pcap -Y dns -T fields -e dns.qry.name -e dns.txt
UEsDBAoAAAAAAHKRelsO8+wGGwAAABsAAAAIABwA.hackerman.com
ZmxhZy50eHRVVAkAA6cYJ2mnGCdpdXgLAAEE\n6AM.hackerman.com
AAAToAwAAcjAwdHsxdHNfNGx3NHk1X0ROU19yMWd.hackerman.com
...
AAUEsFBgAAAAACAAIAnQAAAMgAAAAAAA==.hackerman.com
```

Three immediate tells:

1. `UEsDBAo` is the base64 of `PK\x03\x04` — the ZIP magic. That is the beginning of a ZIP file, encoded.
2. One label contains `ZmxhZy50eHQ`, which decodes to `flag.txt`.
3. The last label ends in `AA==`, which is base64 padding.

The TXT answers are all the same decoy: `v=spf1 -all`. That is a plausible-looking SPF record, which is the point — if you only look at the responses, nothing seems wrong.

![Reassembling the base64 stream](/images/blog/packet-whisperer-dns-exfiltration/flow.png)

## Rebuild the stream

The exfil tool split the base64 into labels, and some labels are line-wrapped with literal `\n` markers. The naive per-label decode fails because the base64 chunks are split **mid-quad** — a four-character group can span two labels. Decode each label separately and you get garbage at the boundaries.

The correct reconstruction: concatenate the labels in query order, strip the `\n` markers and the `.hackerman.com` suffix, then pad once at the end.

```python
import base64

raw = open('labels.txt').read()
s = ''.join(l.strip() for l in raw.splitlines())
s = s.replace('\\\\n', '').replace('\\n', '')
data = base64.b64decode(s + '=' * (-len(s) % 4))
open('recovered.bin', 'wb').write(data)
```

```console
$ file recovered.bin
recovered.bin: Zip archive data, made by v3.0 UNIX

$ unzip -l recovered.bin
      27  2025-11-26 18:11   flag.txt
      40  2025-11-26 18:12   notes.txt
```

The archive contains two files. `notes.txt` says:

```
Some random data, you are close though
```

Another decoy, this time inside the ZIP. The flag is in the sibling file:

```console
$ cat extracted/flag.txt
r00t{1ts_4lw4y5_DNS_r1ght}
```

"It's always DNS" is an ops joke that doubles as a security lesson. DNS is allowed, logged inconsistently, and rarely inspected at the query-name level.

## Why DNS exfiltration survives

- **DNS is almost always allowed outbound.** Blocking it breaks everything.
- **Query names are not usually inspected.** Firewalls see UDP/53 and let it through.
- **Responses can be plausible.** Here, every TXT answer was a valid-looking SPF record.
- **Volume is low.** Twenty-six queries over 16 minutes is not a traffic spike.
- **The channel is resilient.** If one resolver is blocked, the malware uses another.

The signatures in this capture are textbook:

- High-entropy subdomains (base64 alphabet) under one parent domain.
- Labels around 50 characters, right at the practical DNS label limit (63 bytes per [RFC 1035](https://www.rfc-editor.org/rfc/rfc1035)).
- A burst of queries with identical, plausible TXT answers.
- One destination resolver carrying all of it.

## Detection and blocking

- **Entropy scoring on query labels.** Base64 and hex look different from normal hostnames. A simple Shannon-entropy threshold catches most of it.
- **Per-domain query volume.** A workstation querying one parent domain 26 times in 16 minutes is odd if that domain is not a business dependency.
- **NXDOMAIN ratio.** Exfil domains often return NXDOMAIN for the tunnel labels because there is no real zone behind them.
- **Response-size and answer-type anomalies.** TXT answers carrying arbitrary data, especially long ones, are suspicious.
- **DNS over a monitored resolver** with RPZ or a similar policy engine. "Block all DNS" is not a control; it is an outage.
- **Passive DNS and Zeek logs.** Zeek's `dns.log` gives you query names, answers, and timing without full packet capture — enough for this class of detection.

## The mistake I avoided

`strings chall.pcap | grep r00t` would have found nothing, because the flag never exists in plaintext on the wire. It is base64 inside DNS labels, inside a ZIP. That is the point of the challenge.

The other tempting shortcut — decoding each label independently — also fails. The chunks are split mid-quad. Joining first and padding once is the only reliable reconstruction. I have seen this same bug in real decoders: they assume each DNS label is a self-contained unit, and then wonder why the first and last bytes of every chunk are wrong.

## Further reading

- [RFC 1035 — Domain Names: Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035)
- [MITRE ATT&CK T1071.004 — DNS application layer protocol](https://attack.mitre.org/techniques/T1071/004/)
- [MITRE ATT&CK T1048 — Exfiltration Over Alternative Protocol](https://attack.mitre.org/techniques/T1048/)
- [Zeek DNS log documentation](https://docs.zeek.org/en/master/logs/dns.html)
- [Wireshark display filter reference](https://www.wireshark.org/docs/dfref/)

Next: an audio file where the flag was drawn in the spectrum, and I read it wrong the first time.
