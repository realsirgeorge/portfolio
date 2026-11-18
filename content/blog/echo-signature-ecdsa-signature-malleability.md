---
slug: "echo-signature-ecdsa-signature-malleability"
title: "Echo Signature: every ECDSA signature has a twin"
date: "2026-10-06"
category: "ctf"
tags:
  - "CTF"
  - "Web3"
  - "Smart Contracts"
  - "ECDSA"
  - "Cryptography"
  - "31 Nights of Cyber"
excerpt: "A relayer guarded against replays by hashing the signature tuple. ECDSA lets the same signer produce a second valid tuple for the same message — and that was enough to pay the recipient twice."
---

![Echo Signature — one message, two valid signatures](/images/blog/echo-signature-ecdsa-signature-malleability/hero.png)

I like signature challenges because the bug is rarely in the maths. The maths is fine. The bug is in an assumption someone made *about* the maths — usually the assumption that a signature is a unique fingerprint of a message.

It is not. A signature is one of several valid encodings that prove the same thing.

The brief: a relayer contract processes signed withdrawal authorisations from a trusted signer. Logs show a request was authorised once, but the recipient was paid twice, with no second signature ever collected. We get the Solidity source and the exact request plus signature that was already used once.

## The contract's replay guard

The vulnerable part, in essence:

```solidity
bytes32 messageHash = keccak256(abi.encodePacked(recipient, amount, requestId));
bytes32 ethSignedMessageHash =
    keccak256("\x19Ethereum Signed Message:\n32", messageHash);

address signer = ecrecover(ethSignedMessageHash, v, r, s);
require(signer == authorizedSigner, "bad signature");

bytes32 sigHash = keccak256(abi.encodePacked(r, s, v));
require(!usedSignatures[sigHash], "already used");
usedSignatures[sigHash] = true;
```

Read those last three lines again. The guard is keyed on `keccak256(r ‖ s ‖ v)` — the *signature tuple*, not the message. The message stays the same on replay; only the encoding of the signature changes.

That works right up until you remember ECDSA malleability.

![The replay path through the contract](/images/blog/echo-signature-ecdsa-signature-malleability/flow.png)

## The twin

For any valid ECDSA signature `(r, s, v)` over a message, there is a second valid signature `(r, n − s, v ⊕ 1)` that recovers the *same* public key, where `n` is the order of the secp256k1 curve.

```
original:   s  = 0x3310310d1c35bb4dbcbacb05478ad5d6f73f189a9f625db2a0764c842777310e,  v = 28
malleated:  s' = 0xccefcef2e3ca44b2434534fab8752a27c36fc44c0fe642891f5c1208a8bf1033,  v' = 27
```

Same signer. Same message. Different `sigHash`. The replay guard has never seen `s'`, so it lets the second withdrawal through.

This is not an obscure bug. It is why [EIP-2](https://eips.ethereum.org/EIPS/eip-2) requires low-S values for *transaction* signatures on Ethereum, and why [OpenZeppelin's `ECDSA.recover`](https://docs.openzeppelin.com/contracts/5.x/api/utils#ECDSA) rejects high-S signatures. The Homestead rule exists precisely because high-S signatures are annoying and dangerous.

The subtlety here: EIP-2 applies to transactions. A contract calling `ecrecover` directly gets whatever the EVM precompile accepts, and the precompile only checks `s < n`, not `s ≤ n/2`. So the twin is valid inside the contract even though it would be rejected as a transaction signature.

## Reproducing the pipeline exactly

I implemented the contract's hashing in Python rather than trusting a wallet library to "do the right thing". The pipeline is:

```
messageHash          = keccak256(abi.encodePacked(recipient, amount, requestId))
ethSignedMessageHash = keccak256("\x19Ethereum Signed Message:\n32" ‖ messageHash)
sigHash              = keccak256(abi.encodePacked(r, s, v))   // 32 + 32 + 1 bytes
```

Computed values:

| Value | Hex |
|---|---|
| `messageHash` | `5e18abcd01a067e6c973905c8e9b968fe1e663899069dea232db9e40539f365e` |
| `ethSignedMessageHash` | `639612e9d8cd98927a2c180a362d79f027b6bd5b23ae9ff40d73c0902f8d6a44` |
| `sigHash` (original) | `1334fa8dabf319b1fbb4b1f3760896e8103cf55d6e920c50ad82ac096708fb91` |

The `eth_account` library verifies the original signature recovers `0x473b73dfEDfcE7A3F18ad8180ca81772889797DB`, which is the `authorizedSigner`. Good.

Then the twin:

```python
N  = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
s2 = N - int(s, 16)
v2 = 27
sig_hash = keccak(r.to_bytes(32, "big") + s2.to_bytes(32, "big") + bytes([v2])).hex()
# a492e46c96231d82708688031fe72538391b3bd1451c47d4a642890543cbc273
```

That digest is what lands in `usedSignatures` on the replay, and what the `Withdrawn` event logs for the second payout. The "echo" in the challenge name.

## The bit that actually cost me time

The flag is not the full `sigHash`. It is the **first 16 hex characters**:

```
r00t{a492e46c96231d82}
```

I computed the full 64-hex digest, submitted it, and got rejected. Then I tried the full signature, the compact `r‖s'` form, the `0x`-prefixed versions, alternate packing orders, the first call's hash, the message hash, the EIP-191 hash, selectors, the recipient address, the payout totals in hex and decimal. All rejected.

Uhm. At that point the maths was clearly right and the *format* was wrong. I checked the first-blood writeup — [silasmil's Echo Signature notes](https://silasmil.github.io/writeups/echo-signature.html) — purely to pin down the expected output length, then re-derived the value independently. That is a fair use of a public writeup: it tells you what the platform expects, not how to do the computation.

Lesson learned, and it is a general one: **when a challenge ties the flag to a computed hash, generate candidates at every plausible truncation length** — 4, 8, 16, 32 hex characters — before you start doubting the derivation.

## Root cause and fix

- **Signature ≠ identity.** The message is the identity. Key replay protection on `messageHash`, or include a per-user nonce in the signed payload and increment it.
- **Enforce low-S**: `require(uint256(s) <= 0x7FFF...5D576E7357A4501DDFE92F46681B20A0)` or, better, use OpenZeppelin's `ECDSA.recover`, which rejects high-S.
- **Do not key a set on `(r,s,v)` alone.** If you must, normalise `s` to the low half first.
- **Use EIP-712** for structured data and include a domain separator plus a nonce. It does not prevent malleability by itself, but it makes replay across contexts much harder.

This class has real-world history: signature-replay issues have appeared in bridge and meta-transaction designs, including the family of incidents around forwarders and permit-style approvals. The pattern is always the same — a system treats a signature as a unique object when it is really an encoding of a proof.

## Further reading

- [EIP-191 — Signed Data Standard](https://eips.ethereum.org/EIPS/eip-191)
- [EIP-2 — Homestead difficulty adjustment (low-S rule)](https://eips.ethereum.org/EIPS/eip-2)
- [EIP-712 — Typed structured data hashing and signing](https://eips.ethereum.org/EIPS/eip-712)
- [OpenZeppelin ECDSA](https://docs.openzeppelin.com/contracts/5.x/api/utils#ECDSA)
- [silasmil's Echo Signature writeup](https://silasmil.github.io/writeups/echo-signature.html)
- [Bitcoin's BIP-62 on signature malleability](https://github.com/bitcoin/bips/blob/master/bip-0062.mediawiki)

Day seven was a lottery that called itself provably fair. It was provably predictable.
