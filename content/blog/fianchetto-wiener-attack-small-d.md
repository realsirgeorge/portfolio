---
slug: "fianchetto-wiener-attack-small-d"
title: "Fianchetto: when e is almost as large as N"
date: "2026-10-26"
category: "ctf"
tags:
  - "CTF"
  - "Cryptography"
  - "RSA"
  - "Number Theory"
  - "31 Nights of r00t"
excerpt: "A 2048-bit RSA modulus with a 2045-bit public exponent. That shape is not random — it is the fingerprint of a small private exponent, and Wiener's attack eats it."
---

![Fianchetto — small d, huge e](/images/blog/fianchetto-wiener-attack-small-d/hero.png)

The challenge file is a bare RSA triple:

- `N` — a 2048-bit modulus
- `e` — a 2045-bit exponent, almost as large as `N`
- `c` — the ciphertext

No hints beyond the title, "Fianchetto". In chess, a fianchetto is a bishop developed to the long diagonal — a slow, positional move. I am not sure the metaphor helps unless you know that the attack is about continued fractions, which are also a long diagonal of sorts.

The technical tell is the exponent. In a normal RSA key, `e` is 65537. An `e` that is nearly the size of `N` is not normal, and it has a specific cause.

## Why e is huge

RSA key generation picks `d`, then computes `e = d⁻¹ mod φ(N)`. If `d` is small, `e` ends up large — roughly the size of `φ(N)`, which is the size of `N`. So a 2045-bit `e` over a 2048-bit `N` is the signature of a **small private exponent**.

That is exactly the case [Wiener's attack](https://en.wikipedia.org/wiki/Wiener%27s_attack) was designed for. The theorem: if `d < (1/3)·N^(1/4)`, the private exponent can be recovered from the continued-fraction expansion of `e/N`.

For a 2048-bit `N`, `N^(1/4)` is 512 bits, so the bound is around 510 bits. The actual `d` here was **160 bits** — comfortably inside it.

![Continued fractions and Vieta's formula](/images/blog/fianchetto-wiener-attack-small-d/flow.png)

## The attack

The idea is that `e/φ(N)` is very close to `k/d` for some integer `k`, and `k/d` appears among the convergents of the continued fraction of `e/N`. So you enumerate convergents and test each one.

```python
import math

def cf(x, y):
    while y:
        a, x, y = x // y, y, x % y
        yield a

def convergents(seq):
    p0, q0, p1, q1 = 0, 1, 1, 0
    for a in seq:
        p0, p1 = p1, a * p1 + p0
        q0, q1 = q1, a * q1 + q0
        yield p1, q1

for k, d in convergents(cf(e, N)):
    if k == 0 or (e * d - 1) % k:
        continue
    phi = (e * d - 1) // k
    s = N - phi + 1              # p + q
    disc = s * s - 4 * N         # (p - q)^2
    t = math.isqrt(disc)
    if t * t == disc:
        p = (s + t) // 2
        q = (s - t) // 2
        if p * q == N:
            print("factored", p, q)
            break
```

The Vieta check is the elegant part: for a candidate `φ`, `p + q = N - φ + 1`, and `(p - q)² = (p + q)² - 4N`. If that discriminant is a perfect square and `p·q == N`, you have the factors. No trial division, no Coppersmith, no lattice.

Once you have `p` and `q`:

```python
d = pow(e, -1, (p - 1) * (q - 1))
m = pow(c, d, N)
print(m.to_bytes((m.bit_length() + 7) // 8, "big").decode())
```

```
r00t{w13n3rs_4tt4ck_br34ks_sm4ll_d}
```

"Wiener's attack breaks small d." The challenge is not subtle about its lesson.

## When Wiener fails

If `d` is slightly larger than the bound, Wiener's continued fractions are not enough. Then you move to:

- **Boneh–Durfee** (1999), a lattice attack that extends the bound to roughly `N^0.292` using Coppersmith's method. It is significantly more code and needs LLL.
- **Partial key exposure** attacks, if you know some bits of `d`.
- **Common modulus / shared prime** checks, if you have multiple keys.

For this challenge, Wiener was enough, which is why the exponent shape is such a strong hint. A CTF that wants Boneh–Durfee will usually tell you something about the lattice, or give you a `d` that is just above the Wiener bound.

## What this taught me about RSA

- **Key generation matters more than key size.** A 2048-bit modulus with a 160-bit `d` is broken. The modulus size is not a security parameter on its own.
- **Anomalous exponents are a fingerprint.** `e = 65537` is the default for a reason; anything else deserves a second look.
- **Continued fractions are a sharp tool.** They solve a class of "small secret" problems that look intractable until you see the approximation.

If you generate RSA keys, use a well-audited library and let it pick `e`, `d`, `p`, and `q`. Do not implement key generation yourself, and do not try to "optimise" `d` for speed. A small `d` makes decryption faster and the key insecure.

## The debugging bit

I initially used `e/φ(N)` in the continued fraction instead of `e/N`. That is the "textbook" formulation, but you do not know `φ(N)` — that is the point. Using `e/N` works because the approximation error is small enough; the convergents still contain `k/d`.

The other gotcha: `math.isqrt` is exact integer square root. Using `math.sqrt` and comparing floats fails for 2048-bit numbers. If you take one thing from this post, let it be that.

## Further reading

- [Wiener's attack (Wikipedia)](https://en.wikipedia.org/wiki/Wiener%27s_attack)
- [Boneh, "Twenty years of attacks on the RSA cryptosystem"](https://crypto.stanford.edu/~dabo/papers/RSA-survey.pdf)
- [Boneh–Durfee, "Cryptanalysis of RSA with private key d less than N^0.292"](https://link.springer.com/chapter/10.1007/3-540-48910-X_1)
- [NIST SP 800-56B — RSA key generation](https://csrc.nist.gov/pubs/sp/800/56/b/r2/final)

Next: a botnet beacon that used a six-byte XOR key.
