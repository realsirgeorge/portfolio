---
slug: "picoctf-hashcrack"
title: "picoCTF hashcrack: MD5 to SHA-1 to SHA-256 With a Wordlist"
date: "2025-10-13"
category: "ctf"
tags:
  - "CTF"
  - "Cryptography"
  - "picoCTF"
  - "Hash Cracking"
excerpt: "Three hashes, three weak passwords. Secure hash functions do nothing when the input is password123."
readTime: "1 min"
featured: false
---

# picoCTF Writeup – hashcrack (Cryptography)

## 🧩 Challenge Description

A company stored a secret message on a server which got breached due to the admin using weakly hashed passwords. Can you gain access to the secret stored?

Tags: Cryptography, Hash Cracking
Difficulty: Easy

## 🧠 Objective

You are given access to a remote netcat server. The goal is to crack a sequence of hashes (MD5 → SHA-1 → SHA-256) using common passwords and retrieve the final flag.

## 📂 Files & Tools Used

No files provided

Tools:

netcat (nc)

hashcat or online hash lookup tools (crackstation, etc.)

## 🧪 Step-by-Step Solution

### Step 1: Connect to the server using nc

```
nc verbal-sleep.picoctf.net 55266
```

## 🖼️ Screenshot:

### Step 2: Crack the MD5 Hash

The server gives:

```
482c811da5d5b4bc6d497ffa98491e38
```

Use an online hash lookup or crack it with a wordlist.

Using Crackstation or hashcat, we find:

password123

## 🖼️ Full Interaction (MD5 → SHA1 → SHA256):

![picoCTF hashcrack: MD5 to SHA-1 to SHA-256 With a Wordlist — figure 1](/images/blog/picoctf-hashcrack/figure1.png)

### Step 3: Crack the SHA-1 Hash

Hash:

```
b7a875fc1ea228b9061041b7cec4bd3c52ab3ce3
```

Password:

letmein

![picoCTF hashcrack: MD5 to SHA-1 to SHA-256 With a Wordlist — figure 2](/images/blog/picoctf-hashcrack/figure2.png)

### Step 4: Crack the SHA-256 Hash

Hash:

```
916e8c6479b25082c9e467f1eb8e8eee6d6bdff965f9928310ad30a8d88697745
```

Password:

qwerty098

![picoCTF hashcrack: MD5 to SHA-1 to SHA-256 With a Wordlist — figure 3](/images/blog/picoctf-hashcrack/figure3.png)

## 🎯 Final Flag

After correctly entering the passwords for all three hashes, the server returns:

```
picoCTF{UseStr0nG_h@shEs_6PaSSwdS!_5b836723}
```

![picoCTF hashcrack: MD5 to SHA-1 to SHA-256 With a Wordlist — figure 4](/images/blog/picoctf-hashcrack/figure4.png)

## 🔐 Lesson Learned

Weak and common passwords are easily cracked even with secure hash functions.

Use password managers and strong, unique passwords.

Always salt and hash securely if implementing authentication.
