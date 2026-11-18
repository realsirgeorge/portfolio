---
slug: "quickline-ctr-nonce-reuse-many-time-pad"
title: "Quickline: four memos, one keystream"
date: "2026-10-22"
category: "ctf"
tags:
  - "CTF"
  - "Cryptography"
  - "Stream Ciphers"
  - "Cryptanalysis"
  - "31 Nights of r00t"
excerpt: "Four 'lightweight encrypted memos' from a logistics company shared a CTR keystream. With four messages under one key, the cipher collapses into a solvable word puzzle."
---

![Quickline — a many-time pad](/images/blog/quickline-ctr-nonce-reuse-many-time-pad/hero.png)

The zip contains one file: `memos.json`. Four "lightweight encrypted memos" from a logistics company, each with a reference, a ciphertext, and a length.

| ref | length |
|---|---|
| SHIP-2291 | 299 |
| INV-0447 | 231 |
| SCHED-118 | 199 |
| ACCESS-09 | 165 |

No key. No nonce. Just four ciphertexts and a description. That is enough, if the implementation reused something it should not have.

## Rule out the obvious

The first guess is repeating-key XOR. Test it with an index of coincidence: for each candidate key length, split the ciphertext into columns and compute the IC of each column. If the key repeats, the columns are single-byte XORs and the IC is around 0.066 (English). If not, the columns look random and the IC stays near 0.038.

The column ICs looked random. So it is not a short repeating XOR key.

But XORing any two ciphertexts produced bytes in the ASCII-letter XOR ranges — the classic signature of two plaintexts encrypted with the **same keystream**. That is a stream cipher with a reused key/IV. In CTR mode, that happens when the nonce is not fresh: every memo is `plaintext ⊕ keystream` with the same keystream.

Four messages under one keystream is a **four-time pad**. At each position, only a handful of bytes make *all four* plaintexts plausible text. That is a much stronger constraint than a two-time pad, and it turns cryptanalysis into a crossword.

![The crib-drag and the constraint solve](/images/blog/quickline-ctr-nonce-reuse-many-time-pad/flow.png)

## Crib dragging

The first crib was `" the "` at offset 9 of ACCESS-09. Apply the resulting keystream fragment to the other three memos at the same offset:

- SHIP decoded to `hipme` → `SHIPME…`
- SCHED decoded to `hedul` → `Schedul…`
- INV decoded to ` reco` → `Inventory Recon…`

That is a clean anchor. From there, more cribs fell out: `override code`, `night shift`, `do not share`, `rotate`, `paperwork`, `through`, ` Monday through Wednesday`. Positions 80, 93, and 99 were forced because the charset-restricted candidate set only had one option.

A trigram plus word beam over candidate keys converged almost everywhere — except the band from 78 to 109, where the text was too dense with leetspeak to score well.

## The breakthrough

The flag itself was the crib. The body of a `r00t{...}` flag is (usually) `[a-z0-9_]` with `_` separators. If you assume that, you can place `r00t{` at offset 72 of ACCESS-09 and immediately pin six keystream bytes.

Cross-check the same keystream against the other memos:

- SHIP decodes to `perwo` — inside "paperwork"
- SCHED decodes to `nday ` — the end of "…day"
- INV decodes to `esolv` — inside "resolved"

All four are plausible. The keystream fragment is correct, and the rest of the band falls out by hand.

The recovered plaintexts are all clean English:

- **SHIP-2291:** "Notice: Shipment ship D2291 delayed at the Mombasa port during customs paperwork. Revised ETA is now Thursday next week…"
- **INV-0447:** "Inventory reconciliation for bay 4 completed. Discrepancy in 3 pallets resolved — found misfiled under bay 4…"
- **SCHED-118:** "Driver schedule change, for next week: Amara covers the northern route Monday through Wednesday, Otieno takes over Thursday…"
- **ACCESS-09:** "Reminder: The ??:e override code for the night shift access cycle is `r00t{ctr_m0d3_n33ds_4_fr3sh_n0nc3}` … do not share outside the ops group, rotate…"

The flag is embedded verbatim in the access memo:

```
r00t{ctr_m0d3_n33ds_4_fr3sh_n0nc3}
```

It leet-decodes to "CTR mode needs a fresh nonce" — the challenge announcing its own lesson.

## The solver, in pieces

```python
# 1. confirm multi-time pad
def x(a, b):
    return bytes(p ^ q for p, q in zip(a, b))

# x(c0, c1) bytes sit in letter-XOR ranges -> same keystream

# 2. crib-drag
k = bytes(c_ref[t+i] ^ crib[i] for i in range(len(crib)))   # keystream fragment

# 3. apply k to the other memos at the same offset
#    require printable / English at every position in every memo
```

The real work is step 3: scoring candidates against a language model and enforcing simultaneous plausibility. That is why four messages are easier than two — the constraint is multiplicative.

## Why CTR nonce reuse is catastrophic

CTR mode turns a block cipher into a stream cipher: `C = P ⊕ E_k(nonce ‖ counter)`. If the nonce repeats, the keystream repeats, and XORing two ciphertexts cancels it:

```
C1 ⊕ C2 = (P1 ⊕ K) ⊕ (P2 ⊕ K) = P1 ⊕ P2
```

You no longer need the key. You have the XOR of two plaintexts, and English text is redundant enough to recover both. With four messages, it is almost trivial.

The fix is one sentence: **never reuse a nonce with the same key**. Use a random 96-bit nonce per message (with a counter that cannot wrap), or a deterministic construction that guarantees uniqueness, such as a monotonic counter or an HKDF-derived per-message key. [NIST SP 800-38A](https://csrc.nist.gov/pubs/sp/800/38/a/final) and [RFC 5116](https://www.rfc-editor.org/rfc/rfc5116) both spell out the requirement.

AES-GCM has the same failure mode, plus authentication-key recovery: reuse a GCM nonce and you can recover the authentication key and forge messages. It is worse than confidentiality loss.

## What I learned

- **Index of coincidence first.** It distinguishes a repeating-key XOR from a stream cipher in seconds.
- **Multiple messages are a gift.** With N ≥ 3, joint plausibility prunes candidate keys ruthlessly.
- **The flag charset is a crib.** Assuming `r00t{` and `[a-z0-9_]` narrows the search more than any generic English model.
- **Beam search is not magic.** It converged except where the text was dense leetspeak. Manual constraint solving finished the job.

I also learned to be suspicious of the phrase "lightweight encrypted". In my experience it usually means "we implemented the mode ourselves and forgot the nonce".

## Further reading

- [NIST SP 800-38A — CTR mode](https://csrc.nist.gov/pubs/sp/800/38/a/final)
- [RFC 5116 — An Interface and Algorithms for Authenticated Encryption](https://www.rfc-editor.org/rfc/rfc5116)
- [NIST SP 800-38D — GCM and nonce reuse](https://csrc.nist.gov/pubs/sp/800/38/d/final)
- [Many-time pad (background)](https://en.wikipedia.org/wiki/One-time_pad#Exploiting_reuse_with_XOR)

Next: two builds of the same cipher that did not agree with each other.
