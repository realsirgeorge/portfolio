---
slug: "janus-mutated-stream-cipher-reversing"
title: "Janus: two builds, two faces, one flag"
date: "2026-10-23"
category: "ctf"
tags:
  - "CTF"
  - "Reverse Engineering"
  - "Cryptography"
  - "Binary Analysis"
  - "31 Nights of r00t"
excerpt: "Two stripped binaries with the same CLI produced different keystreams for the same seed and nonce. The flag belonged to the build that disagreed with itself."
---

![Janus — two faces of the same cipher](/images/blog/janus-mutated-stream-cipher-reversing/hero.png)

Janus is the Roman god of beginnings, endings, and doorways — usually depicted with two faces looking in opposite directions. The challenge ships two binaries with the same name pattern, the same CLI, and different behaviour. The metaphor is not subtle, and neither is the lesson.

Files:

| File | Size | Role |
|------|------|------|
| `janus` | 14,496 B | JANUS-20 encryptor build #1 |
| `janus2` | 14,496 B | JANUS-20 encryptor build #2 ("mutated") |
| `nonce.bin` | 12 B | all-zero nonce |
| `nonce2.bin` | 12 B | ASCII nonce `JANUS2026R00` |
| `ciphertext.bin` | 128 B | encrypted telemetry |
| `check` | 14,496 B | official scoring binary |
| `validator` | 14,504 B | decoy validator |

The CLI:

```
Usage: <bin> <hex32_seed> <hex24_nonce>
  (read plaintext from stdin, write ciphertext to stdout)
```

They are encrypt-only oracles. That means you cannot ask them to decrypt; you can only feed plaintext and observe ciphertext. For a stream cipher, that is still very useful: encrypt 16 zero bytes and you get the first 16 bytes of the keystream.

## Compare the keystreams

```console
$ head -c16 /dev/zero | ./janus  <seed0> <nonce0> | xxd
00000000: 87d8 52ac 8906 5a9b 7c24 4053 336e 9a09

$ head -c16 /dev/zero | ./janus2 <seed0> <nonce0> | xxd
00000000: 4a1b 8a60 2ae8 d5fb ec6a 932c ae5f 7c7c
```

Different. Same seed, same nonce, same input, different output. So there are two implementations, and the challenge's ciphertext was produced by one of them.

`janus` also ships an obvious fake flag as a plain string:

```
r00t{JANUS_FAKE_FLAGS_ARE_USEFUL_9a3f}
```

which `check` rejects, exactly as advertised. That is the first decoy.

## The scoring binaries

Both `check` and `validator` follow the same template as the other labs in this event: read a line, strip CR/LF, rebuild an obfuscated string on the stack with a 4-byte rolling XOR, `strcmp`.

```
out[0] = 'r'
out[i] = encoded[i] ^ key[i % 4]
```

`check` uses key `FF C6 A5 E2`; `validator` uses `DE C0 AD BE`. The embedded answers are different again:

| Binary | Embedded string | Verdict |
|--------|-----------------|---------|
| `janus` (plaintext) | `r00t{JANUS_FAKE_FLAGS_ARE_USEFUL_9a3f}` | fake |
| `validator` | `r00t{j4nus_3b7b37f6b7a101d85346750c}` | decoy |
| `check` | `r00t{j4nus_mut4t3d_38ccc984283584ae2f64853a}` | official |

```
$ echo 'r00t{j4nus_3b7b37f6b7a101d85346750c}' | ./validator
VALID
Formula verified: r00t{j4nus_3b7b37f6b7a101d85346750c}
Submit to ./check for official scoring.

$ echo 'r00t{j4nus_3b7b37f6b7a101d85346750c}' | ./check
WRONG

$ echo 'r00t{j4nus_mut4t3d_38ccc984283584ae2f64853a}' | ./check
CORRECT
Flag: r00t{j4nus_mut4t3d_38ccc984283584ae2f64853a}
```

The `mut4t3d` wording matches the two divergent keystreams. The flag belongs to the build that does *not* agree with the other face of Janus.

![Two binaries, one answer](/images/blog/janus-mutated-stream-cipher-reversing/solved-challenge.jpg)

![All four flags on the lab](/images/blog/janus-mutated-stream-cipher-reversing/solved-flags.jpg)

## The solver

```python
def decode(key_hex, enc_hex):
    key = bytes.fromhex(key_hex)
    enc = bytes.fromhex(enc_hex)
    return (b'r' + bytes(enc[i] ^ key[i % 4] for i in range(1, len(enc)))).decode()

print(decode('ffc6a5e2',
             '8df6959684ac918c8ab5fa8f8ab29196cca2fad1c7a5c681'
             'c6fe91d0c7f590dacba7c0d099f091dacaf5c49f'))
# r00t{j4nus_mut4t3d_38ccc984283584ae2f64853a}
```

## Do I need to reverse the cipher?

No. That is the slightly anticlimactic part. The scoring binary gives up the answer with a rolling XOR, so the actual JANUS-20 implementation is optional for solving.

But the *challenge design* is about the two builds. If you did want to reverse it, the differential is the interesting part: same seed, same nonce, different keystream means a constant, a rotation, or a state-initialisation difference. You do not need to recover the whole algorithm to see that the two binaries disagree; you only need one known-plaintext block each.

This is a useful technique in real reversing too. When you have two versions of a binary and one works, a **differential trace** — same input, compare output at each stage — is often faster than reading both disassemblies from scratch.

## What I would do differently

I trusted the decoy validator for a moment, because it printed "Formula verified" with such confidence. The fix is procedural: **never submit a flag from a validator; always cross-check with the official checker**, and if the two disagree, believe the one that rejects the obvious answer.

The second thing: I should have compared keystreams for both nonces, not just the zero nonce. A difference that only appears with `nonce2.bin` would tell you whether the mutation is in the nonce handling or the key schedule. That would have made the writeup a better reversing exercise.

## Further reading

- [Ghidra](https://ghidra-sre.org/)
- [radare2](https://rada.re/n/) and [rizin](https://rizin.re/)
- [Binary diffing with Diaphora](https://github.com/joxeankoret/diaphora)
- [Stream cipher (background)](https://en.wikipedia.org/wiki/Stream_cipher)

Next: an ECDSA challenge where the crypto was a decoration.
