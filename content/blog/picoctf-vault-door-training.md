---
slug: "picoctf-vault-door-training"
title: "picoCTF vault-door-training: Reading the Flag Out of Java Source"
date: "2025-10-09"
category: "ctf"
tags:
  - "CTF"
  - "Reverse Engineering"
  - "picoCTF"
  - "Java"
excerpt: "The vault's password check is right there in the Java source. Read the comparison and the flag falls out."
readTime: "1 min"
featured: false
---

### vault-door-training

Author: Mark E. Haase

Description

Your mission is to enter Dr. Evil's laboratory and retrieve the blueprints for his Doomsday Project. The laboratory is protected by a series of locked vault doors. Each door is controlled by a computer and requires a password to open. Unfortunately, our undercover agents have not been able to obtain the secret passwords for the vault doors, but one of our junior agents obtained the source code for each vault's computer! You will need to read the source code for each level to figure out what the password is for that vault door. As a warmup, we have created a replica vault in our training facility.

The source code for the training vault is here: VaultDoorTraining.java

```
The source code reveals the fragmented flag as shown below;
```

![picoCTF vault-door-training: Reading the Flag Out of Java Source — figure 1](/images/blog/picoctf-vault-door-training/figure1.png)
