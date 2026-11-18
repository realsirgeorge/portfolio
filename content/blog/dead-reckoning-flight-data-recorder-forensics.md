---
slug: "dead-reckoning-flight-data-recorder-forensics"
title: "Dead Reckoning: finding ghost entries in a flight recorder"
date: "2026-10-19"
category: "ctf"
tags:
  - "CTF"
  - "Forensics"
  - "Binary Analysis"
  - "Reverse Engineering"
  - "31 Nights of r00t"
excerpt: "A corrupted flight log, injected ghost entries, and a decoy validator that confidently confirmed the wrong flag. Physics was the only honest witness."
---

![Dead Reckoning — reconstructing a flight path from a corrupted log](/images/blog/dead-reckoning-flight-data-recorder-forensics/hero.png)

This one had everything: a binary format spec, a physics formula, a decoy validator, and a "helpful" analyst shortcut that was deliberately wrong. It is the most elaborate challenge I solved in the event, and the one I enjoyed most.

The premise: a SkyTrack-7 flight data recorder log has 39 entries. A known firmware fault (Advisory SA-019) injects "ghost" entries. Reconstruct the true flight path using dead-reckoning physics — compare each entry's reported position against where the aircraft could physically be, given heading, speed, and elapsed time. Ghost entries violate aerodynamics.

Files:

| File | Purpose |
|------|---------|
| `fdr-spec.txt` | binary format spec (header, entry, trailer, CSUM4, flags) |
| `aircraft-manual.txt` | Cessna 172S performance envelope + spherical-Earth DR formula |
| `fdr.bin` | 39-entry flight log (1,158 bytes) |
| `check` | official scoring binary (stripped ELF) |
| `validator` | "formula" validator — the decoy |

## Parse the log

The header is big-endian: magic `FD 52 44 52`, version 1, aircraft `SKTK7`, `BASE_EPOCH = 1741000000` (2025-03-03 11:06:40 UTC), `N_ENTRIES = 39`.

Each 28-byte entry holds an epoch delta, latitude/longitude × 10⁶, altitude, heading × 10, speed in knots, flags, and a float64 `INSTR_ERROR`.

```python
import struct

d = open('fdr.bin', 'rb').read()
n = struct.unpack('>I', d[22:26])[0]
entries = []
for i in range(n):
    t, la, lo, alt, h10, spd, fl = struct.unpack('>iiiHHHH', d[26+i*28:26+i*28+20])
    entries.append(dict(i=i, dt=t, lat=la/1e6, lon=lo/1e6, alt=alt, hdg=h10/10, spd=spd))
```

The CSUM4 nibble-XOR over bytes 0..15 validates for **every** entry. That is the first hint that checksums are not enough: SA-019 ghost entries are generated *after* checksum computation, so a clean checksum says nothing about authenticity.

## Dead reckoning

The manual gives the spherical-Earth formula. For each entry, predict the position from the previous accepted fix:

```python
dist = v_kts * 1.852 * dt / 3600          # km
phi2 = asin(sin(phi1) * cos(dist/R) + cos(phi1) * sin(dist/R) * cos(theta))
lam2 = lam1 + atan2(sin(theta) * sin(dist/R) * cos(phi1),
                    cos(dist/R) - sin(phi1) * sin(phi2))
```

Authentic fixes march down the HKNW → HKMO route (Nairobi Wilson → Mombasa Moi) at roughly **16.2 km per 300 s** — exactly 105 knots — with per-segment DR error mostly **under 0.4 km**.

The ghosts stand out immediately:

- backward jumps to the Nairobi area (`≈ −1.2°, 36.5–36.8°`) inserted at 900 s, 1800 s, and 2700 s, with DR errors of 110–180 km;
- duplicated or out-of-cadence timestamps (`Δt = 0`, 60, 120, 240, 840 s instead of ≈300 s), with DR errors of 2–10 km;
- several ghosts carrying non-zero `INSTR_ERROR` (283–595 m) — but so do some otherwise plausible entries.

Segment excerpt:

```
0->1   dt=300s  move=16.205km  DRerr=0.038km
1->2   dt=300s  move=16.213km  DRerr=0.262km
6->7   dt=300s  move=93.712km  DRerr=110.225km   <- ghost jump
17->18 dt=300s  move=164.778km DRerr=179.892km   <- ghost jump
20->21 dt=300s  move=16.202km  DRerr=0.154km
37->38 dt=300s  move=16.204km  DRerr=0.056km
```

One entry (index 19) even fails CSUM4 while remaining positionally plausible. That is the second hint: integrity must be judged from the physics, not from a single field.

![The challenge solved — 400 points](/images/blog/dead-reckoning-flight-data-recorder-forensics/solved-challenge.jpg)

## The trap in the spec

The spec's §3.2 and §7 recommend filtering on `INSTR_ERROR == 0.0`. That is the "analyst shortcut" mentioned in the brief, and it is wrong. It removes healthy fixes and keeps corrupt ones, because the ghost generator does not set `INSTR_ERROR` consistently.

This is a lovely piece of challenge design. The documentation is not lying about the format; it is giving you advice that assumes a well-behaved recorder. The SA-019 fault violates that assumption. If you follow the advice without checking it against the data, you get a plausible-looking but incorrect path.

**Lesson:** documentation describes intent. Data describes reality. When they disagree, trust the data and note the discrepancy.

## The two binaries

Both `check` and `validator` read one line from stdin, strip CR/LF, decode a 4-byte-rolling-XOR obfuscated string into a stack buffer seeded with `'r'`, and `strcmp` it against the input.

```
out[0] = 'r'
out[i] = encoded[i] ^ key[i % 4]      # i = 1 .. len-1
```

`check` uses key `00 45 26 47`; `validator` uses `DE C0 AD BE`. Each contains its own hard-coded target, and they disagree:

| Binary | Embedded answer |
|--------|-----------------|
| `validator` (decoy) | `r00t{d34d_r3ck0n_1ab642e244ba3ce22d7d78968c0c901e}` |
| `check` (official) | `r00t{d34d_r3ck0n_2bb5989ca909476c23e75ba6ad05c64b}` |

The decoy is confident:

```
$ echo 'r00t{d34d_r3ck0n_1ab642e244ba3ce22d7d78968c0c901e}' | ./validator
VALID
Formula verified: r00t{d34d_r3ck0n_1ab642e244ba3ce22d7d78968c0c901e}
Submit to ./check for official scoring.

$ echo 'r00t{d34d_r3ck0n_1ab642e244ba3ce22d7d78968c0c901e}' | ./check
WRONG
```

That is a nasty little ritual: the decoy validates itself, then tells you to submit to the binary that rejects it. If you stop at the first "VALID", you lose.

The official binary accepts the real flag:

```
$ echo 'r00t{d34d_r3ck0n_2bb5989ca909476c23e75ba6ad05c64b}' | ./check
CORRECT
Flag: r00t{d34d_r3ck0n_2bb5989ca909476c23e75ba6ad05c64b}
```

![The official flag captured](/images/blog/dead-reckoning-flight-data-recorder-forensics/solved-flags.jpg)

## The solver snippet

```python
key = bytes.fromhex('00452647')
enc = bytes.fromhex(
    '727516337b211573641a5474632e16295f774425357c1e7e63241f7739711171637715223770442636244277352610736238'
)
flag = 'r' + ''.join(chr(enc[i] ^ key[i % 4]) for i in range(1, len(enc)))
print(flag)
# r00t{d34d_r3ck0n_2bb5989ca909476c23e75ba6ad05c64b}
```

## What I took away

- **Physics is a validator.** In a corrupted log, the constraints of the physical world are often the most reliable signal you have.
- **Checksums are not authenticity.** A checksum detects accidental corruption; it does not detect deliberate injection after the fact.
- **Documentation can be a trap.** The spec's advice was wrong for this fault. Verify assumptions against the data.
- **Read the scoring binary, but do not trust it blindly.** Two binaries, two answers. That pattern repeated across the whole event (Nexus, Janus), and it is a good reminder that a "validator" is just another piece of evidence.

## Further reading

- [Great-circle navigation and dead reckoning](https://en.wikipedia.org/wiki/Dead_reckoning)
- [python-evtx and binary parsing](https://github.com/williballenthin/python-evtx)
- [Cessna 172S performance data (FAA POH)](https://www.faa.gov/)
- [Ghidra](https://ghidra-sre.org/) for the stripped binaries

Next: a container where every labelled field was a lie.
