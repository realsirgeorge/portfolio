---
slug: "picoctf-crack-the-gate"
title: "picoCTF Crack the Gate: ROT13 Comments and a Dev-Bypass Header"
date: "2025-10-05"
category: "ctf"
tags:
  - "CTF"
  - "Web Security"
  - "picoCTF"
  - "Auth Bypass"
excerpt: "A ROT13 comment in the page source reveals a debug header, X-Dev-Access, that walks straight past authentication."
readTime: "5 min"
featured: true
---

### Crack the Gate 1

Author: Yahaya Meddy

Description

We’re in the middle of an investigation. One of our persons of interest, ctf player, is believed to be hiding sensitive data inside a restricted web portal. We’ve uncovered the email address he uses to log in: ctf-player@picoctf.org. Unfortunately, we don’t know the password, and the usual guessing techniques haven’t worked. But something feels off... it’s almost like the developer left a secret way in. Can you figure it out?The website is running here. Can you try to log in?

Hints

A common trick is to rotate each letter by 13 positions in the alphabet.

Developers sometimes leave notes in the code; but not always in plain text.

![picoCTF Crack the Gate: ROT13 Comments and a Dev-Bypass Header — figure 1](/images/blog/picoctf-crack-the-gate/figure1.png)

![picoCTF Crack the Gate: ROT13 Comments and a Dev-Bypass Header — figure 2](/images/blog/picoctf-crack-the-gate/figure2.png)

1. Went Through the source page and saw the following

That's ROT13 encoding. Let me decode it for you:

Original:

```
<!-- ABGR: Wnpx - grzcbenel olcnff: hfr urnqre "K-Qri-Npprff: lrf" -->
```

Decoded (ROT13):

```
<!-- NOTE: Jack - temporary bypass: use header "X-Dev-Access: yes" -->
So the hint is telling you to add a custom HTTP header X-Dev-Access: yes to your request to bypass some restriction. This is a common CTF technique where developers leave debug/development access methods in production code.
```

In that case I crafted the payload below and run it on the website console

![picoCTF Crack the Gate: ROT13 Comments and a Dev-Bypass Header — figure 3](/images/blog/picoctf-crack-the-gate/figure3.png)

And that is how I got the flag.

# PicoCTF Web Challenge Write-up: Developer Bypass

## Challenge Information

```
Challenge Name: [Challenge Name]
Category: Web Exploitation
Points: [Points]
Flag: picoCTF{bur4_f0tc4_3e21b3d3}
```

## Challenge Description

We're in the middle of an investigation. One of our persons of interest, ctf player, is believed to be hiding sensitive data inside a restricted web portal. We've uncovered the email address he uses to log in: ctf-player@picoctf.org. Unfortunately, we don't know the password, and the usual guessing techniques haven't worked. But something feels off... it's almost like the developer left a secret way in. Can you figure it out?

## Initial Reconnaissance

Upon visiting the challenge URL, we're presented with a simple login form asking for an email and password. The description hints at a "secret way in" left by the developer, suggesting we should look for hidden information or backdoors.

## Step 1: Source Code Analysis

The first step in any web challenge is to examine the page source. Right-clicking and selecting "View Page Source" (or pressing Ctrl+U) reveals the HTML:

## Step 2: Discovering the Hidden Comment

Two HTML comments immediately stand out:

html

```
<!-- ABGR: Wnpx - grzcbenel olcnff: hfr urnqre "K-Qri-Npprff: lrf" -->
<!-- Remove before pushing to production! -->
```

The second comment is a red flag: "Remove before pushing to production!" This suggests the developers left debugging code in the production environment.

The first comment contains what appears to be encoded text. The gibberish pattern suggests a simple substitution cipher.

## Step 3: ROT13 Decoding

The encoding pattern matches ROT13, a simple Caesar cipher that rotates each letter by 13 positions in the alphabet. ROT13 is commonly used to obscure spoilers or hints, and is trivial to decode.

Encoded text:

ABGR: Wnpx - grzcbenel olcnff: hfr urnqre "K-Qri-Npprff: lrf"

Decoded text (ROT13):

```
NOTE: Jack - temporary bypass: use header "X-Dev-Access: yes"
Perfect! We've discovered a developer bypass mechanism. The application accepts a custom HTTP header X-Dev-Access: yes to bypass authentication.
```

## Step 4: Understanding the Login Mechanism

From the JavaScript code, we can see:

The form submits to /login endpoint via POST

It sends JSON data with email and password fields

On success, the response contains a flag field

The Content-Type is application/json

## Step 5: Exploiting the Bypass

We need to send a POST request to /login with:

```
The custom header: X-Dev-Access: yes
```

JSON body with the known email: ctf-player@picoctf.org

Any password (the bypass should ignore it)

### Solution Method 1: Browser Console (Used)

Open the browser's Developer Tools (F12), navigate to the Console tab, and execute:

## Step 6: Capturing the Flag

The server responds with:

![picoCTF Crack the Gate: ROT13 Comments and a Dev-Bypass Header — figure 4](/images/blog/picoctf-crack-the-gate/figure4.png)

## Vulnerability Analysis

This challenge demonstrates several real-world security issues:

### 1. Security Through Obscurity

The developers attempted to hide the bypass mechanism using ROT13 encoding. This is a fundamentally flawed approach - ROT13 provides zero cryptographic security and is easily decoded.

### 2. Debug Code in Production

```
The X-Dev-Access header represents debug/development functionality left in production code. This is a common mistake that can lead to authentication bypasses, information disclosure, or privilege escalation.
```

### 3. Information Disclosure

Sensitive information (the bypass mechanism) was left in HTML comments that are visible to anyone viewing the page source. Comments should never contain security-sensitive information.

### 4. Custom Authentication Headers

Implementing custom authentication schemes using HTTP headers is risky. If not properly secured, these can be easily manipulated by attackers.

## Key Takeaways

Always check the source code - HTML comments, JavaScript, and CSS can contain valuable information

Recognize common encodings - ROT13, Base64, and hex encoding are frequently used in CTFs

Understand HTTP headers - Custom headers can be added to modify request behavior

Developer tools are powerful - Browser consoles allow direct API interaction

Real-world relevance - This challenge mirrors actual vulnerabilities found in production applications

## Mitigation Recommendations

For developers:

Remove ALL debug code before deploying to production

Use proper feature flags and environment-based configurations

Never rely on obscurity (encoding, comments) for security

Implement proper authentication and authorization mechanisms

Conduct code reviews to catch development artifacts

Use automated scanning to detect comments with sensitive keywords

## Tools Used

Web Browser (Chrome/Firefox Developer Tools)

Browser Console

ROT13 decoder (or manual decoding)

## Difficulty Rating

Beginner - This challenge teaches fundamental web exploitation concepts: source code analysis, common encoding schemes, and HTTP header manipulation.
