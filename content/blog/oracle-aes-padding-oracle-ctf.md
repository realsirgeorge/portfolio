---
slug: "oracle-aes-padding-oracle-ctf"
title: "Oracle: a padding oracle that kept its key in plain sight"
date: "2026-10-01"
category: "ctf"
tags:
  - "CTF"
  - "Cryptography"
  - "Reverse Engineering"
  - "AES"
  - "31 Nights of Cyber"
excerpt: "A stripped binary, two decoy flags, and an AES-128 key sitting at the end of .rodata. The lesson was not how to attack a padding oracle — it was how not to ship one."
featured: true
---

![Oracle — a padding oracle with the key in .rodata](/images/blog/oracle-aes-padding-oracle-ctf/hero.png)

The first thing I did was run `strings`. Which, as it turns out, was exactly what the challenge wanted me to do.

```
$ strings oracle | grep r00t
r00t{ORACLE_FAKE_TH3_P4DD1NG_IS_NOT_H3RE}
```

Uhm. That is a flag, and it is also telling me it is not the flag. "Oracle fake, the padding is not here." Cute. I sat there for a second, slightly offended, and then moved on. Good challenges do that — they punish the reflex.

This was day one of **31 Nights of Cyber**: a crypto/reversing lab called **Oracle**, 150 points, with four files:

```
oracle           ELF 64-bit PIE, stripped, 14 KB
validator        ELF 64-bit PIE, stripped
check            ELF 64-bit PIE, stripped
ciphertext.bin   64 bytes
ciphertext2.bin  80 bytes
```

The brief was one line: *the oracle will answer any question. Recover the flag from the provided artifacts.*

## First contact: a program that only answers in exit codes

Running it produced nothing useful:

```
$ ./oracle ciphertext.bin        ; echo $?
0
$ ./oracle --mode 2 ciphertext.bin ; echo $?
1
$ ./oracle                       ; echo $?
1
```

No usage text, no output, no error message. Just zero or one. Ah — okay. It is not a program that *tells* you things. It is a program that *judges* things.

A binary whose entire observable behaviour is a single bit is, almost by definition, an oracle. And given the challenge name, a padding oracle was the obvious guess. The interesting part was going to be figuring out what it was validating, and where the key lived.

## The aha: read the disassembly, not the strings

`oracle` is tiny — one function worth reading, around `0x10e0`. `objdump -d` was enough; I did not need to open Ghidra for this one, though [Ghidra](https://ghidra-sre.org/) would have been the next stop.

The logic, in order:

1. `fopen(argv[1], "rb")`, `fread` into a 0x1000 buffer.
2. Reject anything smaller than 32 bytes, or not a multiple of 16.
3. Copy **16 bytes from `.rodata` at `0x22d0`** into the key slot, then call the AES key schedule.
4. Decrypt the last ciphertext block, XOR it with the previous block.
5. Walk the last `pad` bytes and verify PKCS#7 padding (`0x01`–`0x10`).
6. Exit `0` if the padding is valid, `1` if not.

That is textbook CBC with a padding-validity oracle. [NIST SP 800-38A](https://csrc.nist.gov/pubs/sp/800/38/a/final) describes the mode; [RFC 5652](https://www.rfc-editor.org/rfc/rfc5652) describes the padding.

But step 3 is where the challenge accidentally gives itself away. A padding oracle has to know the key in order to answer questions. If the oracle is a local binary, the key is in the binary.

![The attack path, from decoy strings to a cross-checked flag](/images/blog/oracle-aes-padding-oracle-ctf/flow.png)

## The key was 16 bytes at the end of .rodata

```
22c0  cf8f8dab 9f98cd36 9889feab 544532ef   <- last round-key noise
22d0  686c6e09 45577b75 64696c67 6c6d6674   <- AES-128 key
```

```
key = 686c6e0945577b7564696c676c6d6674
```

Those bytes are ASCII-ish — `hln\tEW{udilglmft` — a hand-picked key rather than a random one. And they are consumed directly by the key-schedule call in the disassembly, so there was no ambiguity about what they were. That is the whole trick: the challenge cannot hide the key without also hiding the oracle's ability to answer.

Decrypting with OpenSSL:

```
$ openssl enc -d -aes-128-cbc \
    -K 686c6e0945577b7564696c676c6d6674 \
    -iv 00000000000000000000000000000000 \
    -in ciphertext.bin | xxd
00000000: 52a4 79f0 e0de b417 f521 66e3 a64d 0e50  R.y......!f..M.P
00000010: 7230 3074 7b30 7234 636c 335f 7034 6464  r00t{0r4cl3_p4dd
00000020: 316e 675f 3635 3132 6532 3531 6436 6532  1ng_6512e251d6e2
00000030: 3838 3834 6264 3562 3337 6130 7d         8884bd5b37a0}
```

The first 16 bytes are garbage because the IV is not the real IV. Everything from byte 16 onward is clean plaintext. The last three bytes of the raw 64-byte output were `0x03 0x03 0x03`, which OpenSSL strips automatically. If you have done CBC once, that pattern is familiar; if you have not, the takeaway is simply that the first block is the only one that needs the real IV.

## Cross-checking with `check`

I do not like submitting a flag I got from one path. `check` is the local scoring binary, and it holds the expected value XOR-obfuscated in `.rodata`, with a 4-byte key stored right next to it:

```
2020  157d8c3c                      <- XOR key
2040  674dbc48 6e4dfe08 7611bf63 …  <- flag, XOR 15 7d 8c 3c repeating
```

```python
key = bytes.fromhex("157d8c3c")
data = rodata[0x2040:]
print(bytes(b ^ key[i % 4] for i, b in enumerate(data)))
# b'<r00t{0r4cl3_p4dd1ng_6512e251d6e28884bd5b37a0}'
```

The leading `<` is a format marker. The flag matches the AES decryption byte for byte:

```
r00t{0r4cl3_p4dd1ng_6512e251d6e28884bd5b37a0}
```

`./check` agreed. `+150`.

## The decoy chain (why this was rated Medium)

This challenge is less about the oracle and more about not believing the first answer you find:

| Artifact | Apparent flag | Reality |
|---|---|---|
| `strings oracle` | `r00t{ORACLE_FAKE_TH3_P4DD1NG_IS_NOT_H3RE}` | dead string, never printed |
| `validator` `.rodata`, XOR `dec0adbe` | `r00t{0r4cl3_DECOY_770a6efabf29067703ae490a}` | decoy |
| `ciphertext.bin` + real key | `r00t{0r4cl3_p4dd1ng_6512e251d6e28884bd5b37a0}` | the real one |

`ciphertext2.bin` does not decrypt under the same key. It is the artifact for the *intended* attack — recovering its plaintext block by block through the exit-code oracle, roughly 16 × 256 queries per block. The key leak makes that unnecessary, which is a little bit of a shame. I would have liked to write the full oracle attack.

## What actually made the oracle dangerous

Strip away the CTF framing and you have a service that leaks one bit per request: *"the padding was valid"*. That is enough. [Serge Vaudenay's original padding-oracle paper](https://link.springer.com/chapter/10.1007/3-540-45708-9_14) is from 2002, and the attack still shows up in production because the leak can be a timing difference, a different error page, or a different HTTP status.

The fix is not "hide the error better" in the abstract. It is:

- **Encrypt-then-MAC**, and verify the MAC before you attempt decryption. Then a padding failure never becomes observable.
- Constant-time comparison for authentication tags.
- If you must expose a decryption service, make every failure look identical — same status, same body, same timing profile.
- Do not compile secrets into clients. A local oracle with an embedded key is just an obfuscated decryption tool.

That last point is the one this challenge really makes. Shipping an oracle as a binary with the key compiled in defeats the premise. If you need a decryption oracle, run it as a service and keep the key somewhere the caller cannot read.

## If I were defending this

- Treat exit codes, response times, and error templates as part of your attack surface. "No output" is still output.
- Add a test that mutates the last byte of a ciphertext and asserts the response is indistinguishable from a valid one.
- Keep decryption keys in a KMS or HSM, never in a shipped artifact. `strings` is not a threat model.
- If a challenge ships a `check` binary, assume the answer is in it, and use that as a cross-check — not as your only source.

## Further reading

- [NIST SP 800-38A — Recommendation for Block Cipher Modes of Operation](https://csrc.nist.gov/pubs/sp/800/38/a/final)
- [Vaudenay, "Security Flaws Induced by CBC Padding"](https://link.springer.com/chapter/10.1007/3-540-45708-9_14)
- [OpenSSL `enc` documentation](https://docs.openssl.org/master/man1/openssl-enc/)
- [Ghidra](https://ghidra-sre.org/) and [`objdump`](https://man7.org/linux/man-pages/man1/objdump.1.html)

Next time: an Android app that thinks a root check is a security boundary. (It is not.)
