---
slug: "picoctf-includes"
title: "picoCTF Includes: A Flag Split Across CSS and JS"
date: "2025-09-29"
category: "ctf"
tags:
  - "CTF"
  - "Web Security"
  - "picoCTF"
excerpt: "The flag is broken in two and hidden in the linked stylesheet and script. Read the included files, not just the page."
readTime: "1 min"
featured: false
---

Includes

Author: LT 'syreal' Jones

Description

Can you get the flag?

Additional details will be available after launching your challenge instance.

Hints

Is there more code than what the inspector initially shows?

1. Lanading Page

![picoCTF Includes: A Flag Split Across CSS and JS — figure 1](/images/blog/picoctf-includes/figure1.png)

2. This needed some more reading…

3. Inspecting the landing page

![picoCTF Includes: A Flag Split Across CSS and JS — figure 2](/images/blog/picoctf-includes/figure2.png)

4. We have tw directories – in this case files: script.css and Script.js. From the hint I’ll check the contents of each

A. Script.jss had

![picoCTF Includes: A Flag Split Across CSS and JS — figure 3](/images/blog/picoctf-includes/figure3.png)

B. Script.css had

![picoCTF Includes: A Flag Split Across CSS and JS — figure 4](/images/blog/picoctf-includes/figure4.png)

5. The two completes the flag

picoCTF{1nclu51v17y_1of2_f7w_2of2_b8f4b022}
