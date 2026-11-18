---
slug: "session-cache-memory-forensics-xor-keys"
title: "Session Cache: eighteen records in five megabytes of memory"
date: "2026-10-29"
category: "ctf"
tags:
  - "CTF"
  - "Forensics"
  - "Memory Analysis"
  - "Binary Formats"
  - "31 Nights of r00t"
excerpt: "A browser memory dump, a partial format spec, and per-record XOR keys derived from predictable IDs. The checksum made structure recovery a game of guess-and-verify."
---

![Session Cache — carving records out of a memory dump](/images/blog/session-cache-memory-forensics-xor-keys/hero.png)

Memory forensics has a reputation for being hard. Sometimes it is: you need Volatility, symbol tables, and a lot of patience. Sometimes it is a structured blob with a marker and a checksum, and the work is mostly arithmetic.

This one was the second kind. `memdump.bin` is 5 MB of browser-process memory. Somewhere inside is a cache of session records.

The zip ships `FORMAT_SPEC.txt`, which gives you most of the format:

- Marker `SESSCACHE_v2`, then a 4-byte little-endian record count, then fixed-size records.
- Each record: plain `record_id`, plain `timestamp`, an **obfuscated username**, an **obfuscated session_token**, and a plain trailing checksum = sum of the decoded username+token bytes mod 2³².
- Obfuscation: per-record XOR keystream derived from the record's own id: `key_byte(id, i) = ((id * 2654435761 + i*40503) & 0xFFFFFFFF) & 0xFF`.

What it does **not** give you: the field sizes, the record stride, or where the obfuscated region starts. That is the forensic part.

## Find the marker

A marker search is the easiest way in:

```
SESSCACHE_v2
```

After the marker, the bytes are:

```
00 00 00 00 | 12 00 00 00 | e8 03 00 00 | 80 0e 80 69
```

That is a 4-byte zero (padding or version), then **count = 18**, then `id = 1000`, `ts = 1770000000`. The timestamp is in the same epoch family as the Beacon CHECKINs — a CTF-generator tell.

![Recovering the record layout](/images/blog/session-cache-memory-forensics-xor-keys/flow.png)

## Guess the stride, verify with the checksum

Scan for valid `<u32 id, u32 ts>` pairs with `id` in `[900, 2000]` and `ts` in `[1.7e9, 1.8e9]`. That found exactly 18 hits with a **constant stride of 76 bytes**:

```
rec: id(u32) ts(u32) obfuscated(64) checksum(u32)   = 4 + 4 + 64 + 4 = 76
```

The checksum is the key to confidence. For each candidate record, decode the 64-byte field with the derived keystream and check that the checksum matches. If it does, the layout is right. If not, try a different offset or size.

```python
def key_byte(record_id, i):
    return ((record_id * 2654435761 + i * 40503) & 0xFFFFFFFF) & 0xFF

def decode(record):
    rid, ts, blob, checksum = record
    out = bytes(b ^ key_byte(rid, i) for i, b in enumerate(blob))
    return out
```

All 18 records passed. Usernames (`hyamamoto`, `rpatel`, `kwilliams`, …) and tokens (`sess_<32hex>`) decoded to clean ASCII.

## The odd record

Record 11 (`record_id=1077`, user `fibrahim`) is the odd one out. Its "session_token" is not a token:

```
r00t{x0r_k3ys_d3r1v3d_fr0m_1ds_4r3nt_3n0ugh}
```

"XOR keys derived from IDs aren't enough." The challenge announcing its own lesson, again. It is a nice bit of design: the flag is inside the data you are already decoding, not in a separate stage.

## Why per-record keys from IDs are weak

`id * 2654435761` is Knuth's multiplicative hash constant (`0x9E3779B1`). It is a fine way to spread keys across a table. It is not a way to keep them secret.

If the attacker knows the record ID — and it is stored in plaintext right there — they can regenerate the keystream. The obfuscation is a speed bump, not a lock. The same applies to any scheme where the "key" is derived from a value stored next to the ciphertext.

The fix for a real system: derive the key from a secret (a KMS key, a hardware-backed key, a per-user secret) and use an AEAD construction. Then a memory dump does not hand over the plaintext; it hands over ciphertext that is useless without the key.

## The forensic technique

The transferable skill here is **guess-and-verify structure recovery**:

1. Find a marker.
2. Read the obvious fields around it.
3. Hypothesise a record layout.
4. Use a self-consistency check (checksum, magic, length, timestamp range) to validate the hypothesis.
5. Iterate.

This works on proprietary formats, memory dumps, and malformed files. The checksum is a gift: it turns a search problem into a validation problem.

Two things I would add for a real investigation:

- **Timeline the records.** `ts = 1770000000` is 2026-02-02; the records may tell you when a session was created, not just what it contained.
- **Cross-reference the usernames.** If the dump is from a compromised host, the session tokens may still be valid. Treat them as credentials and rotate them.

## What tripped me up

The padding before the count. The spec says "marker, then a 4-byte count", but the actual bytes have a 4-byte zero first, then the count. If you assume the count is at offset 0 of the tail, you get zero records and conclude the format is wrong.

The lesson: **sanity-check neighbouring values.** A count of 0 followed by a plausible `id = 1000` is a contradiction. Try the next 4 bytes before you give up on the layout.

## Further reading

- [Volatility 3](https://github.com/volatilityfoundation/volatility3) — for real memory forensics
- [Knuth multiplicative hashing](https://en.wikipedia.org/wiki/Hash_function#Multiplicative_hashing)
- [Python `struct` documentation](https://docs.python.org/3/library/struct.html)
- [NIST SP 800-38D — authenticated encryption](https://csrc.nist.gov/pubs/sp/800/38/d/final)

Last one: an industrial control network, a PLC, and four clients behaving very differently.
