---
slug: "nexus-hash-chain-binary-reversing"
title: "Nexus: every labelled field in the binary was a lie"
date: "2026-10-20"
category: "ctf"
tags:
  - "CTF"
  - "Reverse Engineering"
  - "Cryptography"
  - "Binary Analysis"
  - "31 Nights of r00t"
excerpt: "A 688-byte container with a declared block order, a decoy 64-byte state, and a real initial state hidden further down. The order came from the nibbles all along."
---

![Nexus — a container designed to mislead](/images/blog/nexus-hash-chain-binary-reversing/hero.png)

Some challenges are puzzles. This one is an argument.

The brief describes a custom hash chain processor: 8 data blocks and a 32-byte initial state. The blocks must be applied in an order determined by the nibble decomposition of the initial state bytes. The binary contains a 72-byte "decoy header" declaring a different order (`01234567`), a 64-byte scrambled state immediately after the declared order, and — in the hardened version — a `hash_chain_init` field containing a SHA-256-transformed variant of the true init state.

"Every shortcut and labelled field in the binary is wrong." That is not flavour text. It is the instruction manual.

## Map the container

`nexus.bin` is 688 bytes, self-describing if you ignore the labels:

| Offset | Size | Field |
|--------|------|-------|
| `0x000` | 4 | magic `NEXS` |
| `0x004` | 8 | declared block order `01234567` — **decoy** |
| `0x00C` | 32 | version string `NEXUS v1.0 hash chain processor\0` |
| `0x02C` | 64 | scrambled state — **decoy** (looks like a 64-byte init) |
| `0x06C` | 32 | true initial state (`031a074f73f7e184…d07f06b10`) |
| `0x08C` | 512 | 8 × 64-byte data blocks |
| `0x28C` | 32 | ciphertext (`b4350e9b…e57e8961`) |
| `0x2AC` | 4 | trailer (`a2335a92`) |

Two checks confirm the traps:

1. The 64-byte block at `0x02C` hashes to a completely different value than the 32-byte block at `0x06C`.
2. The declared order is plain `01234567` — the trivial order, which the description explicitly says is wrong.

The real order comes from the nibbles of the 32-byte state at `0x06C`. High nibble, low nibble, or some interleaving? That is the first thing to test. With 32 bytes, you get 64 nibbles; the order must be a permutation of 8 blocks. A plausible rule is to take the nibbles modulo 8, deduplicate, and use the first 8 unique values — but the challenge wants a specific decomposition, so read the processor code or test the variants against the ciphertext.

I tested the obvious rules against the known ciphertext and the known flag format. The one that produced printable plaintext was the one the challenge intended.

## The scoring binaries

Both `check` and `validator` are built from the same template as the other DR Programmer labs: read a line, strip CR/LF, rebuild an obfuscated string on the stack with a 4-byte rolling XOR, `strcmp`.

```python
out[0] = 'r'
out[i] = encoded[i] ^ key[i % 4]     # i = 1 .. len-1
```

`check` uses key `8C 2B 97 59` over its `.rodata` blob at `0x2040`; `validator` uses `DE C0 AD BE` over the blob at `0x20E0`. As with Dead Reckoning, the two embedded answers disagree:

| Binary | Embedded string | Verdict |
|--------|-----------------|---------|
| `validator` | `r00t{n3xus_DECOY_40187c7d04ac816824f4d81f}` | decoy |
| `check` | `r00t{n3xus_a5f383c453ce4d7ad21f7d6d}` | official |

```
$ echo 'r00t{n3xus_DECOY_40187c7d04ac816824f4d81f}' | ./validator
VALID
Formula verified: r00t{n3xus_DECOY_40187c7d04ac816824f4d81f}
Submit to ./check for official scoring.

$ echo 'r00t{n3xus_DECOY_40187c7d04ac816824f4d81f}' | ./check
WRONG

$ echo 'r00t{n3xus_a5f383c453ce4d7ad21f7d6d}' | ./check
CORRECT
```

By this point in the event I had learned the pattern: **the decoy is the one that agrees with itself**. The official binary is the one that rejects the obvious answer.

![The live solve](/images/blog/nexus-hash-chain-binary-reversing/solved-challenge.jpg)

![All five flags captured](/images/blog/nexus-hash-chain-binary-reversing/solved-flags.jpg)

## Why this is a good reversing challenge

The container is doing something that real file formats do all the time: it has fields that *describe* the data, and fields that *are* the data. The declared order is metadata. The real order is derived. If you trust the metadata, you build the wrong chain.

This happens in production too:

- A file header says "compressed: true" but the payload is raw. The parser believes the header and produces garbage.
- A config file says `version: 2` but the schema is version 1. The migration logic runs and corrupts the data.
- A protocol says `length: 128` but the actual body is 64 bytes. The parser reads past the buffer.

The defensive habit is the same: **validate metadata against the payload**. If the declared order produces plaintext garbage and a derived order produces a valid flag, the declared order is wrong. The data is the source of truth.

## The hash chain

The processor applies the 8 blocks in the derived order, mixing a 32-byte state with each 64-byte block. It is a custom construction, not a standard hash — which is exactly why reversing the *program* matters. You cannot look it up.

Once the order and the state are right, the chain is deterministic: run it forward, XOR the output with the ciphertext, and check for the flag format.

```
r00t{n3xus_a5f383c453ce4d7ad21f7d6d}
```

The flag does not contain a leetspeak message this time, which is a small mercy. After three challenges full of `mut4t3d` and `d34d_r3ck0n`, I was starting to read everything in leet.

## What I would do differently

I spent too long on the 64-byte decoy state. It *looks* like an init state, it is the right size for a hash, and it sits in the obvious place. The lesson is to enumerate the candidate fields by **role** — which field is consumed by the processor? — rather than by plausibility.

The second thing: I should have written a small container parser first, with the offsets as constants, instead of poking at hex offsets in a REPL. Once the layout was explicit, the traps were obvious.

## Further reading

- [Ghidra](https://ghidra-sre.org/) and [`objdump`](https://man7.org/linux/man-pages/man1/objdump.1.html)
- [Kaitai Struct](https://kaitai.io/) for describing binary formats
- [The GNU Binary Utilities](https://sourceware.org/binutils/docs/binutils/)
- [Hash chain (background)](https://en.wikipedia.org/wiki/Hash_chain)

Next: a workstation where everything was TLS except two HTTP frames.
