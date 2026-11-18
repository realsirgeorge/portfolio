---
slug: "echoes-in-the-curve-ecdsa-nonce-reuse"
title: "Echoes in the Curve: two signatures that gave up a private key"
date: "2026-10-11"
category: "ctf"
tags:
  - "CTF"
  - "Web3"
  - "Cryptography"
  - "ECDSA"
  - "Blockchain"
  - "31 Nights of Cyber"
excerpt: "Two Sepolia contracts, two legacy transactions, the same r value. ECDSA nonce reuse is still the cleanest way to lose a key."
---

![Echoes in the Curve — nonce reuse on secp256k1](/images/blog/echoes-in-the-curve-ecdsa-nonce-reuse/hero.png)

This challenge published no files. That is always a little ominous. The title and text pointed at elliptic curves and at something that was reused — "echoes" — and the only thing to interact with was two contracts on Sepolia.

Two contracts. Two stored transactions. One repeated value.

## Pulling the transactions

Both contracts expose `getAll()`, which ABI-encodes a `bytes` chunk containing a raw signed transaction. A read-only `eth_call` against a public Sepolia RPC is enough — no wallet, no gas, no private key.

```python
RPC = "https://sepolia.gateway.tenderly.co"

def rpc(method, params):
    r = requests.post(RPC, json={"jsonrpc": "2.0", "id": 1, "method": method, "params": params})
    return r.json()["result"]

res = rpc("eth_call", [{"to": contract, "data": selector("getAll()")}, "latest"])
raw = abi_decode_bytes(res)
```

The two recovered transactions:

| | Contract A | Contract B |
|---|---|---|
| Address | `0xf1000945...E55f` | `0x3dCa65b7...756e` |
| nonce | 1 | 1 |
| value | 2 | 1 |
| calldata | `du5715c0n574n7` | `l375g37fr0ggy` |
| `r` | `0x1456198d...3370` | **same** |
| `s` | `0xdbf40259...aff7` | `0xda87c191...55aa` |

The calldata is leetspeak for "dusty constant" and "les get froggy" or something — a distraction. The signal is the identical `r`.

![From contract storage to a recovered key](/images/blog/echoes-in-the-curve-ecdsa-nonce-reuse/flow.png)

## Why the same r is fatal

ECDSA signing is:

```
s = k⁻¹ (z + r·d) mod n
```

Where `z` is the message digest, `d` is the private key, `k` is the random nonce, and `r` is the x-coordinate of `k·G` reduced mod `n`.

If two signatures use the **same `k`**, they produce the same `r`. Then:

```
s₁ - s₂ = k⁻¹ (z₁ - z₂) mod n
k       = (z₁ - z₂) / (s₁ - s₂) mod n
d       = (s₁·k - z₁) / r mod n
```

Two equations, two unknowns, no brute force. The key falls out with a modular inverse. This is not a subtle side channel; it is the algebra of the scheme telling you that `k` must never repeat.

## The digest is not the transaction hash

The next step is recomputing `z` for each message. For a legacy Ethereum transaction, the signed digest is:

```
keccak256(rlp([nonce, gasPrice, gasLimit, to, value, data]))
```

Six fields — the unsigned list, not the full nine-field transaction. Getting this wrong is the classic mistake: you end up hashing the wrong bytes and the recovered key is nonsense.

```python
payload = rlp.encode([nonce, gasPrice, gasLimit, bytes.fromhex(to[2:]), value, data])
z = int.from_bytes(keccak256(payload), "big")
```

```
zA = 0x632e5781d0c79ed1e83feeffad352e0b0fe859defb216dafceb8bd5a47f34d00
zB = 0x93c454dba158346454a4248f754256f8f9ac0dc65c817176cc40c64f1a46a6bc
```

## Recover the key

The one-shot form avoids computing `k` explicitly:

```python
N = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
num = (s1 * z2 - s2 * z1) % N
den = (r * ((s2 - s1) % N)) % N
d   = (num * pow(den, -1, N)) % N
```

Output:

```
d = 0x0bebdb993f1033066fcb07f07d425d8a628e3c0bcbdd5ccc748d7626b7e53684
```

Validate it by deriving the address:

```python
from eth_account import Account
print(Account.from_key(d).address)
# 0x275C1eC387933d440B67652EeC57e4f4fa40daBB
```

A valid secp256k1 key. The flag format includes the `0x`:

```
r00t{0x0bebdb993f1033066fcb07f07d425d8a628e3c0bcbdd5ccc748d7626b7e53684}
```

## The debugging detour

I lost a round to address derivation. Ethereum addresses are `keccak256(pubkey_without_04_prefix)[-20:]`. I accidentally prefixed an `04` to the coordinates in one attempt and got a completely different, plausible-looking address. Twenty minutes gone.

The `ecdsa` library also rejected the high-S form by policy. That is a library default, not a curve rule — and it matters for signature malleability challenges, but not here. For key recovery, the algebra does not care about the S half.

I also had a false start with the `u1·G + u2·R` public-key-recovery formulation, which threw a `KeyError` on the first run. The direct formulation (`Q = (s'·R − z·G)·r⁻¹`) was easier to reason about and easier to debug.

## A cross-check

A public writeup by Giathidaniel documents the same Sepolia contracts and the same nonce-reuse recovery: [Echoes in the Curve on Medium](https://medium.com/@giathidaniel252/echoes-in-the-curve-598ae7dec713). I used it to confirm I was looking at the right contracts, then reproduced the fetch, RLP decoding, and key recovery locally rather than copying the value.

That is the habit I want to keep: a public writeup can confirm the target and the expected format, but the derivation should be yours. If the numbers match, you have learned something. If they do not, you have found a bug in your understanding.

## The lesson, and the fix

**Never reuse an ECDSA nonce.** Not once. Not "just for testing". The nonce is the only thing standing between your private key and anyone who can read two signatures.

- Use [RFC 6979](https://www.rfc-editor.org/rfc/rfc6979) deterministic nonces. They derive `k` from the private key and the message hash, so they are unique per message and never depend on a random number generator.
- Or use a hardware signer / HSM that guarantees a fresh `k` and refuses to sign twice with the same one.
- Never publish two signatures produced with the same nonce. On a blockchain, "publish" is the default.
- If you are auditing a signer, test for `r` reuse across all signatures you can see. It is a two-line check and it finds catastrophic bugs.

The real-world version of this is not hypothetical: nonce reuse has drained Bitcoin wallets, broken hardware wallets, and appeared in firmware random-number-generator bugs. The Sony PS3 ECDSA failure is the famous teaching example; the pattern is identical.

## Further reading

- [RFC 6979 — Deterministic Usage of DSA and ECDSA](https://www.rfc-editor.org/rfc/rfc6979)
- [SEC 1: Elliptic Curve Cryptography](https://www.secg.org/sec1-v2.pdf)
- [Giathidaniel's writeup for this challenge](https://medium.com/@giathidaniel252/echoes-in-the-curve-598ae7dec713)
- [Trail of Bits — ECDSA nonce reuse](https://blog.trailofbits.com/2020/06/11/ecdsa-handle-with-care/)
- [The PS3 ECDSA fail](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm#Nonce_reuse)

Next: a file that looked empty and was not.
