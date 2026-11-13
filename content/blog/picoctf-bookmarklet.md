---
slug: "picoctf-bookmarklet"
title: "picoCTF Bookmarklet: A Vigenere-Style Byte Cipher in JavaScript"
date: "2025-10-02"
category: "ctf"
tags:
  - "CTF"
  - "Web Security"
  - "picoCTF"
  - "Crypto"
excerpt: "A bookmarklet decrypts the flag with a repeating-key byte cipher. Understanding why the output looks like garbage is the real lesson."
readTime: "3 min"
featured: false
---

### Bookmarklet

Description

Why search for the flag when I can make a bookmarklet to print it for me?Browse here, and find the flag!

1. Landed to this page

![picoCTF Bookmarklet: A Vigenere-Style Byte Cipher in JavaScript — figure 1](/images/blog/picoctf-bookmarklet/figure1.png)

```
2. Had the following code:

        javascript:(function() {
var encryptedFlag = "àÒÆÞ¦È¬ëÙ£ÖÓÚåÛÑ¢ÕÓÓÇ¡¥Ìí";
var key = "picoctf";
var decryptedFlag = "";
for (var i = 0; i < encryptedFlag.length; i++) {
decryptedFlag += String.fromCharCode((encryptedFlag.charCodeAt(i) - key.charCodeAt(i % key.length) + 256) % 256);
}
alert(decryptedFlag);
})();
```

3. So I pasted it to the console tab to run it

![picoCTF Bookmarklet: A Vigenere-Style Byte Cipher in JavaScript — figure 2](/images/blog/picoctf-bookmarklet/figure2.png)

4. And we got the flag

![picoCTF Bookmarklet: A Vigenere-Style Byte Cipher in JavaScript — figure 3](/images/blog/picoctf-bookmarklet/figure3.png)

Notes:

## What algorithm is this?

```
It’s a Vigenère-style stream but applied to byte values (mod 256). If encryption is C[i] = (P[i] + K[i]) mod 256, then decryption is P[i] = (C[i] - K[i] + 256) mod 256. The key repeats every key.length bytes.
```

This is not cryptographically secure for serious use, but it’s common in CTFs and simple obfuscation.

## Why you saw weird characters (non-printable / replacement glyphs)

The algorithm operates on raw byte values (0–255). Many results fall outside printable ASCII (32–126).

JavaScript strings are UTF-16 code units; when you build a string containing byte values >127, the browser tries to interpret or display them in whatever encoding it uses, which can show weird glyphs or replacement characters.

The decrypted bytes may not represent valid UTF-8 text; they could be binary data or text encoded in a different single-byte encoding (e.g., Latin-1 / ISO-8859-1). That’s why you saw characters like  in the result.

## How to get a readable result reliably

Two practical approaches:

A. Convert decrypted bytes to a printable representation (hex or Base64)
This guarantees readability and avoids encoding issues.

Example (hex output):

```
(function() {
var encrypted = "àÒÆÞ¦È¬ëÙ£Ö�ÓÚåÛÑ¢ÕÓ�Ó�Ç¡�¥Ìí";
var key = "picoctf";
var bytes = [];
for (var i = 0; i < encrypted.length; i++) {
var val = (encrypted.charCodeAt(i) - key.charCodeAt(i % key.length) + 256) % 256;
bytes.push(val);
}
// Convert to hex string
var hex = bytes.map(b => ("0" + b.toString(16)).slice(-2)).join("");
```

alert(hex); // shows the decrypted bytes as hex

```
})();
```

B. If you expect UTF-8 plaintext, build a Uint8Array and decode it
(This works only if the decrypted bytes are valid UTF-8.)

```
(function() {
var encrypted = "àÒÆÞ¦È¬ëÙ£Ö�ÓÚåÛÑ¢ÕÓ�Ó�Ç¡�¥Ìí";
var key = "picoctf";
var bytes = new Uint8Array(encrypted.length);
for (var i = 0; i < encrypted.length; i++) {
bytes[i] = (encrypted.charCodeAt(i) - key.charCodeAt(i % key.length) + 256) % 256;
}
try {
var text = new TextDecoder("utf-8").decode(bytes);
alert(text);
```

## } catch (e) {

```
alert("Decoded bytes are not valid UTF-8");
}
})();
```

## How to encrypt with the same scheme

Encryption (inverse operation) is:

```
cipherByte = (plainByte + keyByte) % 256
```

So to create encryptedFlag from a plaintext you’d add key char codes rather than subtract.

## Security / practical notes

This is just obfuscation, not secure encryption. A repeating short key and byte-add/sub operations are vulnerable to frequency analysis and known-plaintext attacks.

For real confidentiality use standardized ciphers (AES-GCM, etc.) with safe key management.

For CTFs, this method is fine for simple hiding of a flag.

## TL;DR (one-line)

The script uses a repeating key ("picoctf") and per-character arithmetic (cipher - key + 256) % 256 to reconstruct plaintext bytes, then shows the result—some decrypted bytes are outside printable ASCII so the alert can contain weird characters. Use a hex/base64 conversion or TextDecoder if you need reliable readable output.
