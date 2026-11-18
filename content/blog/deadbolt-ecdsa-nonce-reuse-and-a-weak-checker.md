---
slug: "deadbolt-ecdsa-nonce-reuse-and-a-weak-checker"
title: "DeadBolt: the ECDSA gate was a decoration"
date: "2026-10-24"
category: "ctf"
tags:
  - "CTF"
  - "Cryptography"
  - "ECDSA"
  - "Python"
  - "31 Nights of r00t"
excerpt: "A checker promised to verify a recovered ECDSA private key before revealing the flag. The flag was a static byte array XORed with a six-byte key that was sitting in the source."
---

![DeadBolt — reading the verifier first](/images/blog/deadbolt-ecdsa-nonce-reuse-and-a-weak-checker/hero.png)

The challenge ships two files:

- `checker.py` — claims to verify a *recovered ECDSA private key* against a known secp256k1 public key, and only then decode and print the flag.
- `deadbolt.json` — the attestation material: two signatures/nonce data, presumably for the classic nonce-reuse recovery.

The intended path is textbook: two signatures under the same key with a repeated `k` let you recover the private key.

```
s1 - s2 = k⁻¹ (z1 - z2) mod n
k       = (z1 - z2) · (s1 - s2)⁻¹ mod n
d       = (s1·k - z1) · r⁻¹ mod n
```

Then the checker computes `dG` and compares it with `PUB_X/PUB_Y`. Lovely. Except.

## Read the verifier

I read `checker.py` first, which is a habit I picked up from too many "the gate is decorative" challenges.

The flag reveal is not keyed on the private key at all. It is a static byte array XORed with a fixed six-byte key:

```python
_ENC = [28, 26, 245, 229, 70, 233, 94, 68, 166, 162, 98, 245, 11, 95, 240, 244, 98,
        235, 93, 30, 174, 164, 98, 243, 6, 25, 154, 225, 79, 182, 24, 30, 177, 162,
        98, 236, 93, 83, 184]
_KEY = [110, 42, 197, 145, 61, 135]
```

`_KEY` is right there in the source. And even if it were not, the flag format `r00t{` leaks five of the six key bytes immediately:

```
key[0:5] = _ENC[0:5] XOR "r00t{"
```

Sweep the remaining byte over 256 options, filter for printable ASCII ending in `}`, and you get exactly one sensible candidate at `last = 0x87`:

```
r00t{n0nc3_reu5e_l34k5_th3_pr1v4t3_k3y}
```

Which leet-decodes to "nonce reuse leaks the private key" — confirming both the answer and the intended lesson, while the actual gate was irrelevant.

![The bypass path](/images/blog/deadbolt-ecdsa-nonce-reuse-and-a-weak-checker/flow.png)

## The solver

```python
_ENC = [28, 26, 245, 229, 70, 233, 94, 68, 166, 162, 98, 245, 11, 95, 240, 244, 98,
        235, 93, 30, 174, 164, 98, 243, 6, 25, 154, 225, 79, 182, 24, 30, 177, 162,
        98, 236, 93, 83, 184]

for last in range(256):
    k = [_ENC[i] ^ b"r00t{"[i] for i in range(5)] + [last]
    out = bytes(b ^ k[i % 6] for i, b in enumerate(_ENC))
    if out.startswith(b"r00t{") and out.endswith(b"}") and all(32 <= c < 127 for c in out):
        print(out.decode())
```

That is the whole solve. Ten lines, no elliptic curves.

## Why this is a good lesson anyway

The challenge is called DeadBolt and the flag is about nonce reuse, so the intended teaching is real. The shortcut does not invalidate it; it demonstrates a second, equally important lesson: **when a challenge ships a verifier, read the verifier.**

This happens in real code:

- A "licence check" that validates a signature, then decrypts the payload with a key derived from a constant.
- A "premium feature" gate that checks a boolean, while the premium data is in the same bundle.
- A "secure enclave" wrapper around a function that still takes the secret as an argument.

The gate is often decorative because the developer thought about the *check* and not about the *data flow*. The flag is not protected by the ECDSA verification; it is protected by six XOR bytes. Those are different threat models.

## If you want the intended path

The nonce-reuse algebra is in my [Echoes in the Curve post](/blog/echoes-in-the-curve-ecdsa-nonce-reuse), and it is the same two equations. The only difference here is that the challenge *tells* you the public key and asks you to verify the recovered `d` against it.

If I were solving this as a crypto exercise rather than a CTF, I would:

1. Parse `deadbolt.json`, extract the two signatures and their digests.
2. Confirm `r` is repeated.
3. Recover `k`, then `d`.
4. Verify `dG == PUB`.
5. Decrypt the flag with the verified key material.

The shortcut is faster, but the intended path is the one that teaches you why nonce reuse is fatal.

## The broader lesson

- **Read the verifier.** If the challenge (or the app) ships a checker, the answer is often in the checker's weaker branch.
- **Known prefixes break repeating-key XOR.** `r00t{`, `flag{`, `CTF{` — five bytes is enough to recover most of a six-byte key.
- **A gate is not a data-flow control.** Protecting the *check* does not protect the *payload*.

## Further reading

- [Echoes in the Curve — nonce reuse walkthrough](/blog/echoes-in-the-curve-ecdsa-nonce-reuse)
- [RFC 6979 — deterministic ECDSA](https://www.rfc-editor.org/rfc/rfc6979)
- [OWASP — Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [Python `secrets` module](https://docs.python.org/3/library/secrets.html)

Next: three DNS queries, one tunnel.
