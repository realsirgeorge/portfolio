---
slug: "picoctf-transformation"
title: "picoCTF Transformation: Unpacking Two Bytes From One Unicode Char"
date: "2025-10-12"
category: "ctf"
tags:
  - "CTF"
  - "Reverse Engineering"
  - "picoCTF"
  - "Encoding"
excerpt: "The encoder packs two ASCII characters into one 16-bit Unicode character. A right shift and a mask reverse it cleanly."
readTime: "3 min"
featured: false
---

### Transformation

Author: madStacks

Description

```
I wonder what this really is... enc ''.join([chr((ord(flag[i]) << 8) + ord(flag[i + 1])) for i in range(0, len(flag), 2)])
```

enc = 灩捯䍔䙻ㄶ形楴獟楮獴㌴摟潦弸彥ㄴㅡて㝽

![picoCTF Transformation: Unpacking Two Bytes From One Unicode Char — figure 1](/images/blog/picoctf-transformation/figure1.png)

# PicoCTF Reverse Engineering Challenge Write-up: Transformation

## Challenge Information

```
Challenge Name: Transformation
Author: madStacks
Category: Reverse Engineering
Flag: picoCTF{16_bits_inst34d_of_8_e1411a0f7}
```

## Challenge Description

I wonder what this really is... enc

Encoding Algorithm:

```
python
''.join([chr((ord(flag[i]) << 8) + ord(flag[i + 1])) for i in range(0, len(flag), 2)])
```

Encoded String:

灩捯䍔䙻ㄶ形楴獟楮獴㌴摟潦弸彥ㄴㅡて㝽

## Understanding the Encoding

### Breaking Down the Algorithm

The encoding takes pairs of ASCII characters and combines them into single Unicode characters:

```
python
chr((ord(flag[i]) << 8) + ord(flag[i + 1]))
```

## Step-by-step process:

```
ord(flag[i]) - Get ASCII value of first character (e.g., 'p' = 112 = 0x70)
<< 8 - Left shift by 8 bits (multiply by 256, moves to high byte)
ord(flag[i + 1]) - Get ASCII value of second character (e.g., 'i' = 105 = 0x69)
Add them together: (0x70 << 8) + 0x69 = 0x7069
chr(0x7069) - Convert to Unicode character: '灩'
```

### Visual Representation

Original:  'p'     'i'

```
ASCII:     0x70    0x69
Combine:   0x70 << 8 = 0x7000
0x7000 + 0x69 = 0x7069
Result:    chr(0x7069) = '灩'
```

The encoding essentially packs two 8-bit characters into one 16-bit character.

## Solution: Reversing the Transformation

To decode, we need to reverse the process:

Get the Unicode value of each encoded character

Extract the high byte (first original character): value >> 8

```
Extract the low byte (second original character): value & 0xFF
```

Combine all characters to get the flag

### Decoding Algorithm

For each encoded character:

```
Encoded: '灩' = 0x7069
High byte: 0x7069 >> 8 = 0x70 = 'p'
Low byte:  0x7069 & 0xFF = 0x69 = 'i'
```

Result: 'pi'

## Implementation

### Method 4: CyberChef

Go to https://gchq.github.io/CyberChef/

```
use the MAGIC recipe
```

## Key Concepts

### Character Encoding

ASCII: 7-bit encoding (0-127), extended to 8-bit (0-255)

Unicode: 16-bit+ encoding supporting international characters

This challenge exploits the fact that ASCII characters fit in 8 bits

### Byte Packing

The encoding demonstrates byte packing: combining multiple small values into larger ones

Common in data compression

Network protocols

Binary file formats

Memory optimization

### Why This Works

ASCII characters use values 0-127 (7 bits)

Extended ASCII uses 0-255 (8 bits)

Unicode supports 0-65535 (16 bits)

Two 8-bit characters fit perfectly in one 16-bit Unicode character

## Real-World Applications

This type of transformation is used in:

Data Compression: Packing multiple values into fewer bytes

Network Protocols: Combining header fields

Binary File Formats: Efficient storage of structured data

Steganography: Hiding data in plain sight

Malware Obfuscation: Making code harder to analyze

## Difficulty Rating

Easy - This challenge teaches fundamental bit manipulation and character encoding concepts. The encoding algorithm is provided, making it straightforward to reverse.

## Key Takeaways

Bit shifting is reversible - << 8 can be undone with >> 8

Character encoding matters - Understanding ASCII vs Unicode is crucial

Byte manipulation is common - High/low byte extraction is a fundamental skill

Read the algorithm carefully - The challenge gives you the encoding, just reverse it

Multiple tools work - Choose the tool you're most comfortable with

## Related Concepts

Bit manipulation

Character encoding (ASCII, Unicode, UTF-8)

Bitwise operations (shift, AND, OR)

Byte packing and unpacking

Endianness (big-endian vs little-endian)

Data serialization

## Flag Meaning

```
picoCTF{16_bits_inst34d_of_8_e1411a0f7}
```

The flag itself is a hint about the technique: "16 bits instead of 8" - referring to how two 8-bit ASCII characters were combined into one 16-bit Unicode character!
