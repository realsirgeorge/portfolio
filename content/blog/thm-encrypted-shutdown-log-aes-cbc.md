---
slug: "thm-encrypted-shutdown-log-aes-cbc"
title: "Encrypted Shutdown Log: Reversing Sloppy AES-CBC"
date: "2025-06-28"
category: "ctf"
tags:
  - "CTF"
  - "Cryptography"
  - "TryHackMe"
  - "ICS"
  - "Forensics"
excerpt: "A static all-zero IV, a known passphrase, no salt, and no integrity check. AES-CBC is only as strong as the way it's used."
readTime: "1 min"
featured: true
---

# CTF Walkthrough: Encrypted Shutdown Log (AES-CBC Forensics)

## 🧠 Challenge Summary

Title: Encrypted Shutdown Log
Category: Cryptography / Forensics
Description (paraphrased):

Virelia's gateway vendor has “secured” maintenance logs by encrypting critical entries using AES-CBC. The encryption used:

A passphrase: VIRELIA-WATER-FAC

A fixed all-zero IV

No salt or integrity verification

The logs supposedly contain a shutdown command. Our job is to decrypt the file and extract the flag.

Given File: shutdown.log-1750934543756.enc
Objective: Decrypt the file and recover the flag.

## Initial Recon

The first thing we noticed was the poor cryptographic practice described in the prompt:

AES-CBC is secure only if used correctly — with random IVs, salting, and integrity mechanisms (e.g., HMAC or AES-GCM).

Using a static IV of all zeros and a fixed passphrase without a salt is a red flag. It means the encryption is deterministic and weak.

The passphrase is provided: VIRELIA-WATER-FAC

So it’s not a question of breaking AES — it’s about reversing a sloppy implementation.

## 🧰 Strategy

The prompt more or less handed us the keys — literally.

Plan of Attack:

Treat the passphrase as the key derivation input.

Use SHA-256 to derive a 256-bit AES key.

Use a 16-byte IV of all \x00 bytes (as stated).

Decrypt the file using AES in CBC mode.

Look for the shutdown command and the flag in plaintext.

Because no salt or HMAC was used, this is just textbook AES-CBC decryption — no brute-forcing needed.

![Encrypted Shutdown Log: Reversing Sloppy AES-CBC — figure 1](/images/blog/thm-encrypted-shutdown-log-aes-cbc/figure1.png)

![Encrypted Shutdown Log: Reversing Sloppy AES-CBC — figure 2](/images/blog/thm-encrypted-shutdown-log-aes-cbc/figure2.png)
