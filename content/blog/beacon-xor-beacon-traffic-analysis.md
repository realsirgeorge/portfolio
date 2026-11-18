---
slug: "beacon-xor-beacon-traffic-analysis"
title: "Beacon: a six-byte XOR key and a sixty-second heartbeat"
date: "2026-10-27"
category: "ctf"
tags:
  - "CTF"
  - "Network Forensics"
  - "Malware Analysis"
  - "XOR"
  - "31 Nights of r00t"
excerpt: "A botnet check-in disguised as random bytes. The ciphertexts shared a prefix, which is not encryption — that is XOR with a repeating key."
---

![Beacon — six bytes of key, one heartbeat](/images/blog/beacon-xor-beacon-traffic-analysis/hero.png)

The scenario: a suspected botnet infection. `beacon.pcap` is traffic from the affected host. Something is checking in with someone it should not be.

The capture is mostly decoy: 1,300 mainstream DNS queries (GitHub, Outlook, Teams), TLS to various 52.x cloud ranges, NTP. The kind of noise that makes a volume-based alert useless.

One TCP conversation stands out:

```
10.60.4.112:39281 <-> 91.242.87.19:4444   (port 4444!)
```

Yes, port 4444 again. In this event, port 4444 is the "this is probably C2" flag, but the interesting part is the payload.

The session has four client pushes (33, 33, 33, 35 bytes) and one server response (44 bytes). The bytes look random, except that the first 25 bytes are **identical across three client frames**.

## Ciphertext equality means plaintext equality

If two ciphertexts are identical at the same offsets, and the encryption is a stream cipher that restarts its keystream per message, then the plaintexts are identical at those offsets. That is not a guess; it is arithmetic.

```
C1 = P1 ⊕ K
C2 = P2 ⊕ K
C1 == C2  =>  P1 == P2
```

So the bot is sending the same check-in message three times. That is the first structural clue: this is not a real cipher. It is XOR with a repeating key, restarting at each message.

## Find the key period

For each candidate key length `L`, count positions `j` where `c[j] ^ c[j+L]` looks like letter-vs-letter XOR (the result is < 0x20 for lowercase/lowercase, or in a narrow range). The period with the strongest signal wins.

For all five packets, the peak was **L = 6**. A six-byte repeating XOR key.

![The attack path](/images/blog/beacon-xor-beacon-traffic-analysis/flow.png)

## Narrow the key

For each residue class mod 6, test every key byte candidate and keep the ones that make *every* byte in that column printable ASCII across all five packets. That left 25–28 survivors per residue, clustered in six tight bands (0x2x, 0xax, 0x4x, 0xex, 0xcx, 0x0x).

The key bytes are not ASCII, which is why hill-climbing on English quadgrams struggled. The plaintext is leetspeak, not prose. That is a recurring theme in this event: language models are trained on English, and CTF flags are not English.

## The crib

`r00t{` placed at every offset of the 44-byte server packet. Each placement fixes five of the six key bytes; the remaining residue has at most 26 candidates.

Offset **9** worked:

```
<garbage>r00t{...}
```

The unknown residue-2 byte shifts only positions 2, 8, 14, 20, 26, 32, 38. Cross-plaintext relations finish it:

- `p[38] == p[32]` because `c[38] == c[32]`
- `p[20] ^ p[14] = 0x01`
- `p[26] = p[14] ^ 0x4a`

Those constraints pin the phrase uniquely:

```
0x54 k2 ->  TASK:ack:r00t{x0r_k3ys_h4t3_kn0wn_pl41nt3xt}
```

Final key: `37 a2 54 e3 c7 02`.

## Decrypt everything

All five packets decode cleanly:

```
CHECKIN:host-7734:1770000000:idle
CHECKIN:host-7734:1770000060:idle
CHECKIN:host-7734:1770000120:idle
CHECKIN:host-7734:1770000180:active
TASK:ack:r00t{x0r_k3ys_h4t3_kn0wn_pl41nt3xt}
```

A 60-second heartbeat drone that flips to `active`, then receives a task from the operator. The flag rides in the task acknowledgement.

This is a nice little malware narrative: check in, wait for instructions, acknowledge. If you were writing detection for this, the periodicity (60 seconds) and the fixed destination are the signals, not the payload contents.

## Why the analysis order mattered

My first attempt was crib-dragging the pair `srv ⊕ cli1` and scoring bigrams. It produced mediocre scores because the plaintext is leet, not English. The productive move was structural: find the key period from ciphertext equality, then use the flag prefix as a crib.

That order is general:

1. **Classify the cipher.** Repeating XOR, stream cipher, block cipher? Ciphertext equality tells you a lot.
2. **Find the period.** Statistical tests on byte differences are cheap.
3. **Use known plaintext.** Flags, headers, protocol constants. `r00t{` is five bytes of free key.
4. **Enforce consistency.** Decrypt *all* messages, not just the one with the flag.

The last point is the one I keep relearning. A partial decode that looks like a flag is a hypothesis. A full decrypt that produces coherent check-ins and a task acknowledgement is evidence.

## Defensive notes

- **Beaconing detection:** periodic connections to the same destination with consistent sizes. A 60-second interval is a strong signal.
- **Destination reputation:** `91.242.87.19:4444` is not a normal enterprise destination.
- **Payload entropy:** high entropy on a plaintext protocol is suspicious, but do not rely on it; XOR with a short key has low entropy.
- **Full packet capture:** flow records would show the connection but not the payload. For malware analysis, you need the bytes.

## Further reading

- [MITRE ATT&CK T1071 — Application Layer Protocol](https://attack.mitre.org/techniques/T1071/)
- [MITRE ATT&CK T1571 — Non-Standard Port](https://attack.mitre.org/techniques/T1571/)
- [XOR and repeating-key ciphers (background)](https://en.wikipedia.org/wiki/XOR_cipher)
- [Wireshark follow-TCP-stream](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowTCPSection.html)

Next: a WebAssembly module that was hiding a tiny virtual machine.
