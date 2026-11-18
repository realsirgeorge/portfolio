---
slug: "blackgate-watch-dns-tunnel-forensics"
title: "BlackGate Watch: three DNS queries were enough"
date: "2026-10-25"
category: "ctf"
tags:
  - "CTF"
  - "Network Forensics"
  - "DNS"
  - "Threat Hunting"
  - "31 Nights of r00t"
excerpt: "Amid 1,300 DNS lookups, three queries to one relay domain carried a hex-encoded flag in sequence-numbered labels. The hard part was not decoding it — it was copying it correctly."
---

![BlackGate Watch — a small DNS tunnel in a lot of noise](/images/blog/blackgate-watch-dns-tunnel-forensics/hero.png)

This is a nice counterpoint to Packet Whisperer. Both are DNS exfiltration challenges, but this one is tiny: three queries, hex instead of base64, and a sequence number in the label.

The capture, `dns_tunnel.pcap`, has around 1,300 DNS frames amid otherwise normal enterprise traffic — GitHub, Outlook, Teams queries as noise. If you sort by volume, the tunnel is invisible. If you filter by domain, it is three lines.

## The filter

```
$ tshark -r dns_tunnel.pcap -T fields -e dns.qry.name \
    -Y 'dns.qry.name contains "relay"' | sort
```

Three queries, with a very clear structure:

```
000.723030747b646e735f74756e6e336c73.relay.blackgate-watch.net
001.5f63347272795f6d3072335f7468346e.relay.blackgate-watch.net
002.5f717533723133737d.relay.blackgate-watch.net
```

`<seq>.<hexpayload>.relay.blackgate-watch.net`. The sequence numbers tell you the order, which matters because DNS responses can arrive out of order and `sort` on the full string happens to work here but would not in general.

The payloads are hex. Chunk them in sequence order and decode:

```python
chunks = {
    "000": "723030747b646e735f74756e6e336c73",
    "001": "5f63347272795f6d3072335f7468346e",
    "002": "5f717533723133737d",
}
data = ''.join(chunks[k] for k in sorted(chunks))
print(bytes.fromhex(data).decode())
```

```
r00t{dns_tunn3ls_c4rry_m0r3_th4n_qu3r13s}
```

"DNS tunnels carry more than queries." Indeed.

![Sort, concatenate, decode](/images/blog/blackgate-watch-dns-tunnel-forensics/flow.png)

## The transcription trap

I submitted the flag once and got an HTTP 400. The decode printed `qu3r13s`, and I had typed `qu3ri3s` from memory. One character. The platform rejected it, I re-read the output, fixed it, and it was accepted.

This is a silly mistake, but it is also a real one. In a report, a single wrong character in a flag, a hash, or an IP address can make the finding unreproducible. The rule I now follow: **copy from the tool output, never retype**. If I have to type it, I paste it into a scratch file and diff.

It is especially tempting with leetspeak flags, because your brain autocorrects `qu3r13s` to a familiar word. The flag is designed to be un-guessable; do not help it along.

## Why sequence numbers in the label are a good design

The `<seq>` prefix gives the decoder an explicit order, which makes the tunnel robust to packet reordering. It also gives the analyst an easy sort key. In a real exfil tool, you would see something like `<seq>.<chunk>.<domain>` or base32-encoded data with a session ID.

The domain `relay.blackgate-watch.net` is the other tell: a dedicated subdomain for the tunnel, separate from the organisation's normal domain. A passive DNS or proxy log would show it as a new domain with a small number of high-entropy queries.

## Detection notes

- **Filter by domain, not by volume.** The tunnel is three queries in 1,300. Volume-based detection would miss it entirely.
- **Look at label structure.** `<digits>.<hex>` is a machine-generated pattern. Normal hostnames do not look like that.
- **Sort by sequence.** If the labels carry an order, use it; do not trust capture order.
- **Copy decoded output verbatim.** The flag is the evidence; a typo is a failed finding.
- **Check the parent domain's registration age.** A newly registered domain carrying enterprise traffic is a strong signal.

For a real network, DNS logging plus a query-name entropy score would catch this. You do not need full packet capture for the detection, only for the payload recovery.

## What I would do differently

I would write the decoder to output the flag to a file, then copy from the file, rather than copying from the terminal. Terminal output is easy to misread, especially when the font renders `1` and `l` similarly.

I would also enumerate the label structure before decoding: split on `.`, check which component is numeric, which is hex, and which is the domain. That makes the reconstruction robust to a different number of chunks.

## Further reading

- [RFC 1035 — Domain names](https://www.rfc-editor.org/rfc/rfc1035)
- [MITRE ATT&CK T1071.004 — DNS](https://attack.mitre.org/techniques/T1071/004/)
- [Zeek DNS logging](https://docs.zeek.org/en/master/logs/dns.html)
- [Passive DNS (background)](https://www.circl.lu/services/passive-dns/)

Next: RSA where the public exponent was almost as large as the modulus.
