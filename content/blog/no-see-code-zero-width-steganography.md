---
slug: "no-see-code-zero-width-steganography"
title: "No See Code: a flag you can read but cannot see"
date: "2026-10-12"
category: "ctf"
tags:
  - "CTF"
  - "Steganography"
  - "Forensics"
  - "Unicode"
  - "31 Nights of Cyber"
excerpt: "A 645-byte text file hid 207 invisible Unicode characters. Three codepoints, 7-bit ASCII, and one polarity trap."
---

![No See Code — zero-width characters in a text file](/images/blog/no-see-code-zero-width-steganography/hero.png)

The file is called `not_fl4g.txt`. It opens like this:

```
r00t{naah_not_the_flag}
```

That is 24 characters. The file is 645 bytes.

Uhm. Where are the other 621 bytes?

## The archive

```console
$ 7z l -slt no-see-code.zip
Path = no-see-code.zip
Type = zip
Physical Size = 330
----------
Path = not_fl4g.txt
Size = 645
Encrypted = +
Method = ZipCrypto Deflate
```

One encrypted file, 330-byte archive, ZipCrypto. So there are two problems: the archive is encrypted, and the plaintext is doing something strange.

ZipCrypto is old and weak. A known-plaintext attack is possible if you know part of the content, and a dictionary attack is cheap. The challenge is small enough that a themed candidate list makes sense:

```python
import zipfile
z = zipfile.ZipFile('no-see-code.zip')
z.read('not_fl4g.txt', pwd=b'secret123')   # success
```

`secret123`. Of course it is. The password is the weakest part of the "private" archive — as usual. If this were a real investigation, that would be a finding in itself. For now, it is the door.

![Cracking, inspecting, decoding](/images/blog/no-see-code-zero-width-steganography/flow.png)

## The text is longer than it looks

`cat` shows 24 visible characters. A hex dump tells a different story:

```
r \xe2\x80\x8b \xe2\x80\x8b 0 \xe2\x80\x8b 0 \xe2\x80\x8c t \xe2\x80\x8c { ...
```

Those `\xe2\x80\x8b` sequences are UTF-8 for `U+200B` — zero width space. The character census:

| Codepoint | Name | Count |
|---|---|---|
| `U+200B` | ZERO WIDTH SPACE | 106 |
| `U+200C` | ZERO WIDTH NON-JOINER | 75 |
| `U+200D` | ZERO WIDTH JOINER | 26 |

207 invisible characters. Twenty-six of them are `U+200D`, which gives 27 fields — a separator. Two remaining symbols for bits. That is a 7-bit ASCII encoder, with `U+200D` as the field delimiter.

This is a real technique, not just a CTF toy. Zero-width characters are used for watermarking text, for smuggling data past text-based DLP, and occasionally for prompt injection in LLM inputs. They are category `Cf` (format) in Unicode — "other, format" — which is exactly the category that most text pipelines ignore. The [Unicode character database](https://www.unicode.org/reports/tr44/#General_Category_Values) documents the category.

## The polarity trap

My first decoder was the obvious one:

```python
zw = ''.join(c for c in text if c in '\u200b\u200c\u200d')
fields = zw.split('\u200d')
flag = ''.join(chr(int(''.join('0' if c == '\u200b' else '1' for c in f), 2)) for f in fields if f)
```

That produced control characters. Garbage.

The mapping is inverted: **`U+200B` = 1, `U+200C` = 0**. With that:

```python
bits = ''.join('1' if c == '\u200b' else '0' for c in field)
```

First field `0001101` → inverted `1110010` → `0x72` → `r`. And the known prefix `r00t{` validates the whole mapping immediately. If you are doing any kind of decoding, the flag prefix is your free crib.

```
r00t{H1dd3n_1n_Pl41n_S1ght}
```

The flag is a pun on "hidden in plain sight", which is accurate: the message is literally in the file, just not in the glyphs you see.

## Why this works, and how to catch it

A human reading the file sees 24 characters. A byte-oriented tool sees 645 bytes. Everything in between — editors, diff tools, chat clients, copy-paste — may preserve or strip the invisible characters depending on their Unicode normalisation behaviour.

Detection hooks:

- Flag files containing `Cf` category characters at anomalous density. 207 format characters in a 645-byte text file is a screaming signal.
- Normalise (`NFKC`) and strip `Cf` on ingest for anything that will be re-published, indexed, or fed to a model.
- In a SOC, look for documents with unusual byte-to-character ratios, or with a large proportion of non-printing codepoints.
- For archives: ZipCrypto is not encryption you should trust. Use AES-256 (`7z -mhe=on`) and stop recycling passwords.

## The bit I nearly got wrong

I tried the intuitive mapping once, got control characters, and almost concluded the separator was wrong. The fix was not to stare harder at the bits; it was to **test both polarities against a known prefix**. `r00t{` is seven characters of free validation. Any decoder that produces it is right; any decoder that does not is wrong, regardless of how clever it looks.

That is a general principle I keep coming back to: when a decoding problem has a small discrete ambiguity (endianness, polarity, field order), enumerate the options and validate against a known-good fragment. Do not guess once and commit.

## Further reading

- [Unicode UAX #44 — General Category Values](https://www.unicode.org/reports/tr44/#General_Category_Values)
- [Unicode confusables and invisible characters](https://www.unicode.org/reports/tr36/)
- [ZIP format encryption weaknesses](https://en.wikipedia.org/wiki/ZIP_%28file_format%29#Encryption)
- [7-Zip AES-256 archive encryption](https://7-zip.org/7z.html)

Next: 1,279 packets, 26 of them DNS, and a ZIP file hiding in the query names.
