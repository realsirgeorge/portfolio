---
slug: "picoctf-webdecode"
title: "picoCTF WebDecode: Base64 in an About Page Attribute"
date: "2025-09-26"
category: "ctf"
tags:
  - "CTF"
  - "Web Security"
  - "picoCTF"
excerpt: "Inspecting files the page includes, not just the page itself, turns up a Base64 attribute on the About page that decodes to the flag."
readTime: "1 min"
featured: false
---

## 🔍 Challenge Breakdown

### 📘 Description Summary:

"Do you know how to use the web inspector?"

## ✅ This indicates you'll need to:

Inspect HTML, JS, or other client-side assets.

Not just the visible page — but also referenced files like .js, .css, etc.

## 💡 Hint Breakdown:

"Use the web inspector on other files included by the web page."

![picoCTF WebDecode: Base64 in an About Page Attribute — figure 1](/images/blog/picoctf-webdecode/figure1.png)

This suggests:

Look at the Network tab or Sources panel in DevTools.

Check for included JavaScript files (often a common place to hide flags).

The flag may be encoded — likely base64, hex, or reversed.

There was nothing there so I started to navigate

Found the About page

![picoCTF WebDecode: Base64 in an About Page Attribute — figure 2](/images/blog/picoctf-webdecode/figure2.png)

this is intresting

![picoCTF WebDecode: Base64 in an About Page Attribute — figure 3](/images/blog/picoctf-webdecode/figure3.png)

![picoCTF WebDecode: Base64 in an About Page Attribute — figure 4](/images/blog/picoctf-webdecode/figure4.png)
