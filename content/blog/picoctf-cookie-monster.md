---
slug: "picoctf-cookie-monster"
title: "picoCTF Cookie Monster: Base64 in a Session Cookie"
date: "2025-10-04"
category: "ctf"
tags:
  - "CTF"
  - "Web Security"
  - "picoCTF"
  - "Cookies"
excerpt: "A login form that ignores the password and trusts a Base64-encoded cookie instead. Decoding it hands you the flag."
readTime: "1 min"
featured: true
---

# 🍪 Cookie Monster - Web Exploitation Challenge

## Challenge Description

Cookie Monster has hidden his top-secret cookie recipe somewhere on his website. As an aspiring cookie detective, your mission is to uncover this delectable secret. Can you outsmart Cookie Monster and find the hidden recipe?

## 🕵️ Step-by-Step Walkthrough

### 1. Landing Page

After accessing the challenge URL, we’re greeted with a login form requesting a Username and Password.

![picoCTF Cookie Monster: Base64 in a Session Cookie — figure 1](/images/blog/picoctf-cookie-monster/figure1.png)

### 2. Submitting Login Info

When arbitrary login details were entered, we were redirected to an Access Denied page. However, a hint was given:

"Cookie Monster says: 'Me no need password. Me just need cookies!'"

Hint: Have you checked your cookies lately?

![picoCTF Cookie Monster: Base64 in a Session Cookie — figure 2](/images/blog/picoctf-cookie-monster/figure2.png)

### 3. Inspecting Cookies

Opening the browser developer tools and navigating to the Application → Cookies tab, we found a cookie named:

![picoCTF Cookie Monster: Base64 in a Session Cookie — figure 3](/images/blog/picoctf-cookie-monster/figure3.png)

### 4. Decoding the Cookie

Using the built-in checkbox “Show URL-decoded” in the browser revealed a clean Base64 string.

We then copied this value and headed over to CyberChef to decode it using the From Base64 operation.

![picoCTF Cookie Monster: Base64 in a Session Cookie — figure 4](/images/blog/picoctf-cookie-monster/figure4.png)

### 5. The Secret Recipe Revealed!

After decoding, we got the flag:

```
picoCTF{c00k1e_m0nster_l0ves_c00kies_4736F6CB}
```

## 🏁 Final Flag

```
picoCTF{c00k1e_m0nster_l0ves_c00kies_4736F6CB}
```

## 🧠 Takeaways

Always inspect cookies when given hints about them.

Look for Base64-encoded data in cookies or URLs.

Tools like CyberChef make decoding quick and visual.

![picoCTF Cookie Monster: Base64 in a Session Cookie — figure 5](/images/blog/picoctf-cookie-monster/figure5.png)
