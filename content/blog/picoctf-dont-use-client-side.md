---
slug: "picoctf-dont-use-client-side"
title: "picoCTF don't-use-client-side: Reconstructing a Client-Checked Password"
date: "2025-10-03"
category: "ctf"
tags:
  - "CTF"
  - "Web Security"
  - "picoCTF"
  - "Client-Side"
excerpt: "The password is validated four characters at a time in JavaScript. Read the checks in order and the flag reassembles itself."
readTime: "1 min"
featured: false
---

dont-use-client-side

Next Challenge:

dont-use-client-side Author: Alex Fulton/Danny Description Can you break into this super secure portal? - http://fickle-tempest.picoctf.net:63828 Additional details will be available after launching your challenge instance.

Hints Never trust the client

![picoCTF don't-use-client-side: Reconstructing a Client-Checked Password — figure 1](/images/blog/picoctf-dont-use-client-side/figure1.png)

![picoCTF don't-use-client-side: Reconstructing a Client-Checked Password — figure 2](/images/blog/picoctf-dont-use-client-side/figure2.png)

![picoCTF don't-use-client-side: Reconstructing a Client-Checked Password — figure 3](/images/blog/picoctf-dont-use-client-side/figure3.png)

Perfect! This is a classic client-side validation vulnerability. The JavaScript is checking the password piece by piece, and we can reconstruct it!

## Analysis

The code splits the password into chunks of 4 characters (split = 4) and checks each segment:

```
After reconstruction:

split = 4;
checkpass.substring(0, split) == 'pico'           // Characters 0-4
checkpass.substring(split, split*2) == 'CTF{'     // Characters 4-8
checkpass.substring(split*2, split*3) == 'no_c'   // Characters 8-12
checkpass.substring(split*3, split*4) == 'lien'   // Characters 12-16
checkpass.substring(split*4, split*5) == 'ts_p'   // Characters 16-20
checkpass.substring(split*5, split*6) == 'lz_2'   // Characters 20-24
checkpass.substring(split*6, split*7) == 'eb02'   // Characters 24-28
checkpass.substring(split*7, split*8) == 'b45}'   // Characters 28-32

Reconstructing the Flag
```

Let's piece it together in order:

Position 0-4: pico

```
Position 4-8: CTF{
```

Position 8-12: no_c

Position 12-16: lien

Position 16-20: ts_p

Position 20-24: lz_2

Position 24-28: eb02

```
Position 28-32: b45}
Flag: picoCTF{no_clients_plz_2eb02b45}
```

## Verify It

You can either:

Enter it in the form and click verify (you'll get "Password Verified")

Test in browser console:

javascript

```
document.getElementById("pass").value = "picoCTF{no_clients_plz_2eb02b45}";
verify();
```

The flag message is clear: "no_clients_plz" - never trust client-side validation! 🎯

![picoCTF don't-use-client-side: Reconstructing a Client-Checked Password — figure 4](/images/blog/picoctf-dont-use-client-side/figure4.png)
