---
slug: "picoctf-intro-to-burp"
title: "picoCTF Intro to Burp: Dropping a Field to Skip the OTP"
date: "2025-09-30"
category: "ctf"
tags:
  - "CTF"
  - "Web Security"
  - "picoCTF"
  - "Burp Suite"
excerpt: "Intercepting the request in Burp and removing the OTP field entirely bypasses the second factor. Server-side trust, missing."
readTime: "1 min"
featured: false
---

1. Challenge

![picoCTF Intro to Burp: Dropping a Field to Skip the OTP — figure 1](/images/blog/picoctf-intro-to-burp/figure1.png)

2, Form to capture

![picoCTF Intro to Burp: Dropping a Field to Skip the OTP — figure 2](/images/blog/picoctf-intro-to-burp/figure2.png)

3. Captured form with several details

![picoCTF Intro to Burp: Dropping a Field to Skip the OTP — figure 3](/images/blog/picoctf-intro-to-burp/figure3.png)

4. After fowarding, I got

![picoCTF Intro to Burp: Dropping a Field to Skip the OTP — figure 4](/images/blog/picoctf-intro-to-burp/figure4.png)

5.I tried sending a random OTP

![picoCTF Intro to Burp: Dropping a Field to Skip the OTP — figure 5](/images/blog/picoctf-intro-to-burp/figure5.png)

6. I then removed the otp field and the flag was revealed

![picoCTF Intro to Burp: Dropping a Field to Skip the OTP — figure 6](/images/blog/picoctf-intro-to-burp/figure6.png)
