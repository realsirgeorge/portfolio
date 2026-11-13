---
slug: "picoctf-pie-control-flow-hijack"
title: "picoCTF PIE: Control-Flow Hijack With Relative Offsets"
date: "2025-10-10"
category: "ctf"
tags:
  - "CTF"
  - "Binary Exploitation"
  - "picoCTF"
  - "PIE"
excerpt: "A PIE binary hands you the runtime address of main and asks where to jump. Compute the offset to win() and redirect execution."
readTime: "2 min"
featured: true
---

# Write-up: Exploiting PIE Challenge (rescue-float from picoCTF)

## 📌 Challenge Overview

Challenge Name: Unknown (remote binary execution)
Category: Binary Exploitation
CTF: picoCTF
Goal: Trigger the win() function remotely to print the contents of flag.txt.

## 🧾 Description Provided by the CTF

Can you try to get the flag? Beware we have PIE!
Connect to the program with netcat:

![picoCTF PIE: Control-Flow Hijack With Relative Offsets — figure 1](/images/blog/picoctf-pie-control-flow-hijack/figure1.png)

```
nc rescued-float.picoctf.net 64434
```

Additionally, we were provided:

A source code file: vuln.c

A compiled binary: vuln

Once connected to the program we have

![picoCTF PIE: Control-Flow Hijack With Relative Offsets — figure 2](/images/blog/picoctf-pie-control-flow-hijack/figure2.png)

### Step 1: Review the Source Code

![picoCTF PIE: Control-Flow Hijack With Relative Offsets — figure 3](/images/blog/picoctf-pie-control-flow-hijack/figure3.png)

The binary prints the address of main().

It asks the user for an address to jump to manually.

If you enter the address of win(), the program will call it!

So, this is a manual control-flow hijack challenge.

## Step 2: Confirm PIE is Enabled

![picoCTF PIE: Control-Flow Hijack With Relative Offsets — figure 4](/images/blog/picoctf-pie-control-flow-hijack/figure4.png)

✅ PIE (Position Independent Executable) is enabled, so all addresses shift at runtime — we must work with relative offsets.

Step 3: Load into GDB

I used to gdb tool for this one

![picoCTF PIE: Control-Flow Hijack With Relative Offsets — figure 5](/images/blog/picoctf-pie-control-flow-hijack/figure5.png)

Since the binary is stripped, we don’t have named functions — but we can still disassemble manually.

## Step 4: Find Address of main()

Command inside GDB:

![picoCTF PIE: Control-Flow Hijack With Relative Offsets — figure 6](/images/blog/picoctf-pie-control-flow-hijack/figure6.png)

## Extracted Addresses:

```
main starts at: 0x133d
Last instruction of main is at: 0x1408
```

Step 5: Find Address of win()

![picoCTF PIE: Control-Flow Hijack With Relative Offsets — figure 7](/images/blog/picoctf-pie-control-flow-hijack/figure7.png)

Perfect! Now we have both addresses:

```
So, win() starts at 0x12a7
```

Function Addresses

These are relative virtual addresses (PIE mode), and the base will shift at runtime.

Step 6: Calculate Offset to Win

Offset = main - win

```
= 0x133d - 0x12a7 = 0x96
therefore;
win = main – 0x96
```

Step 7: Connect to Remote Server again to get the runtime address of main()

results

```
Address of main: 0x5e5a71af433d
Enter the address to jump to, ex => 0x12345:
```

This is the runtime address of main(), due to PIE.

## Step 8: Calculate Runtime Address of win()

```
We subtract our known offset (0x96) from the provided main address:
0x5e5a71af433d - 0x96 = 0x5e5a71af42a7
```

## Step 9: Exploit!

Send the address:

![picoCTF PIE: Control-Flow Hijack With Relative Offsets — figure 8](/images/blog/picoctf-pie-control-flow-hijack/figure8.png)

## Lessons Learned

PIE binaries require relative offsets, not absolute addresses.

Even stripped binaries can be reversed using disassembly and string search.

Exploiting a control-flow hijack doesn’t always require buffer overflows — it can be direct pointer redirection.

```
gdb, find, and disas are your best friends in these cases.
```
