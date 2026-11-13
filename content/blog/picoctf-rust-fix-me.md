---
slug: "picoctf-rust-fix-me"
title: "picoCTF rust fix me: Repairing a Broken XOR Decryptor"
date: "2025-10-08"
category: "ctf"
tags:
  - "CTF"
  - "Reverse Engineering"
  - "picoCTF"
  - "Rust"
excerpt: "A Rust program that XOR-decrypts the flag won't compile. Fixing the missing crate and the commented-out unsafe block gets it running."
readTime: "1 min"
featured: false
---

![picoCTF rust fix me: Repairing a Broken XOR Decryptor — figure 1](/images/blog/picoctf-rust-fix-me/figure1.png)

1. downloaded the tar.gz Archive 
2. extracted the archive to get the files

![picoCTF rust fix me: Repairing a Broken XOR Decryptor — figure 2](/images/blog/picoctf-rust-fix-me/figure2.png)

3. cat the main.rs file to view the Rust file and see what it may have

![picoCTF rust fix me: Repairing a Broken XOR Decryptor — figure 3](/images/blog/picoctf-rust-fix-me/figure3.png)

## Step-by-Step Fix

### 🛠️ 1. Import Missing Crate

```
The code uses xor_cryptor::XORCryptor, but this crate isn’t standard in Rust.
Check Cargo.toml. If xor_cryptor isn’t in [dependencies], add:
[dependencies]
```

xor-crypt = "0.1.1"

If xor_cryptor is a custom module, you’ll need to include its file locally and ensure it’s referenced properly (mod xor_cryptor; instead of use).

### ⚠️ 2. Fix Unsafe Block

You commented out the unsafe block here:

```
// unsafe {
```

## ...

```
// }
But Rust requires unsafe { ... } to use:
let decrypted_slice = std::slice::from_raw_parts(decrypted_ptr, decrypted_len);
```

## ✅ Fix:
Uncomment the unsafe block:

```
unsafe {
let decrypted_slice = std::slice::from_raw_parts(decrypted_ptr, decrypted_len);
borrowed_string.push_str(&String::from_utf8_lossy(decrypted_slice));
}
```

![picoCTF rust fix me: Repairing a Broken XOR Decryptor — figure 4](/images/blog/picoctf-rust-fix-me/figure4.png)

### 4. Compile and Run

```
cargo build
cargo run
```

![picoCTF rust fix me: Repairing a Broken XOR Decryptor — figure 5](/images/blog/picoctf-rust-fix-me/figure5.png)

failed
