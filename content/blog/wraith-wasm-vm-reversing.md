---
slug: "wraith-wasm-vm-reversing"
title: "Wraith: reading a WebAssembly module's tiny virtual machine"
date: "2026-10-28"
category: "ctf"
tags:
  - "CTF"
  - "Reverse Engineering"
  - "WebAssembly"
  - "Binary Analysis"
  - "31 Nights of r00t"
excerpt: "A 2 KB WASM module exported one function, check_flag. Inside was a stack VM with eight opcodes, a 331-byte program, and an off-by-one that meant one character was never checked."
---

![Wraith — a stack VM inside a WebAssembly module](/images/blog/wraith-wasm-vm-reversing/hero.png)

WASM challenges are fun because the tooling is so good. `wasm2wat` turns the module into readable text, and `wasmtime` or Node lets you run it without a browser. You get the best of both worlds: source-like output and a real execution environment.

This module is 2 KB. It exports `check_flag(ptr) -> i32` and imports only `env.js_print_ok` and `env.js_print_fail`. That is a very small surface area, which means the logic is probably in the code, not in the imports.

## Look at the module

```
$ file wraith.wasm
WebAssembly (wasm) binary version 0x1 (MVP module)
```

A string dump shows only the import names, so there is no helpful symbol or debug section. Time to disassemble:

```
$ wasm2wat wraith.wasm -o wraith.wat
```

`check_flag` is about 715 lines of WAT. Most of that is a load loop, unrolled twice by the compiler. The interesting part is what the loop loads.

![The VM's structure](/images/blog/wraith-wasm-vm-reversing/flow.png)

## Three stages

The function does three things:

1. **Length scan** — walks the input looking for the NUL terminator, clamps the length to 64.
2. **Program load** — `frame[i] = rodata[1040+i] ^ rodata[1024 + (i & 3)]` for `i ≤ 330`. That is a 331-byte bytecode program XORed with a 4-byte repeating key (`90 63 09 d2`).
3. **Stack VM** — `frame+340` is a 64-byte data stack, `frame+404` is the stack pointer (initialised to −1), `frame+408` is a halt flag, `frame+412` is the result.

`check_flag` returns OK if and only if the final result is non-zero.

Dispatch is a `br_table` on `byte - 65`, so the opcodes are ASCII letters `A` through `H`, plus two specials:

| byte | mnemonic | effect | pc step |
|------|----------|--------|---------|
| 65 `A` | PUSHI | push `prog[pc+1]` | +2 |
| 66 `B` | PUSHIN | push `input[prog[pc+1]]` (0 if out of range) | +2 |
| 67 `C` | XOR | `st[sp-1] ^= st[sp]` | +1 |
| 68 `D` | ADDI | `st[sp] += prog[pc+1]` (masked) | +2 |
| 69 `E` | ROL | `st[sp] = rol8(st[sp], prog[pc+1] & 7)` | +2 |
| 70 `F` | CMP | push `1 if st[sp-1] == st[sp] else 0` | +1 |
| 71 `G` | AND | `st[sp-1] &= st[sp]` | +1 |
| 72 `H` | HALT | pop → result; OK iff non-zero | exit |
| 173 `0xad` | NOP2 | skip next byte | +2 |
| 222 `0xde` | NOP1 | — | +1 |

The pc strides are the subtle part. Operand-consuming ops jump past the interpreter's default +2 advance; operand-free ops fall through at +1. If you transcribe this wrong, the program desynchronises and every result looks like noise.

## Dump the program from the live instance

You *can* parse the WAT's escaped string, but it is error-prone. The better move is to instantiate the module in Node and read `memory[1024..1372)` directly:

```python
PROG = bytes(blob[i] ^ key[i & 3] for i in range(331))
```

The decoded program is beautifully regular. For each character index `i = 0..28`:

```
de 42 i 41 k1 43 45 r 41 k2 46
```

Which the VM executes as:

```
res_i = (rol8(flag[i] ^ k1_i, r_i) == k2_i)
```

Then `ad 00`, 27 × `AND`, then `HALT`.

And here is the quirk: **29 comparison results but only 27 ANDs.** Combining leaves two elements on the stack, and `HALT` pops the top — which holds the AND of `res_1..res_28`. `res_0` is never consulted.

Classic off-by-one in the glue code. It does not matter, because `flag[0]` is `'r'` anyway, but it is gold for a reverser: it tells you which checks the author *meant* to enforce versus which actually run.

## Invert it

Each constraint is a bijection over bytes, so you do not need a search:

```
flag[i] = ror8(k2_i, r_i) ^ k1_i
```

29 lookups later:

```
r00t{w4sm_vm_byp4ss_unl0ck3d}
```

Native verification: re-instantiate the untouched module in Node, call `check_flag` with the candidate, and watch `js_print_ok` fire. Wrong characters return 0 and `js_print_fail`.

## What made this tractable

- **`wasm2wat` is a gift.** You are reading structured text, not hex.
- **The dispatch table is explicit.** A `br_table` on `byte - 65` tells you the opcode alphabet immediately.
- **The program is tiny.** 331 bytes, regular block structure, no jumps. You can decode it by hand.
- **The live instance is the source of truth.** Parsing escaped strings from WAT is a great way to introduce a bug. Dumping memory from a running module is not.

I also added an `(import "env" "js_progress")` hook after the dispatch to confirm the program really executed and to check the pc strides while transcribing semantics. That is the WASM equivalent of `printf` debugging, and it is much faster than staring at the WAT.

## The lesson

When a challenge ships a VM, decode the **bytecode**, not just the interpreter. The interpreter tells you the instruction set; the program tells you the constraints. Inverting the constraints is usually a few lines of algebra, because the author has to make the check deterministic.

And read the counts. 29 comparisons vs 27 ANDs is the kind of detail that separates "I got the flag" from "I understand the challenge".

## Further reading

- [WebAssembly specification](https://webassembly.github.io/spec/)
- [wabt — WebAssembly Binary Toolkit](https://github.com/WebAssembly/wabt)
- [wasmtime](https://wasmtime.dev/)
- [WebAssembly text format](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format)

Next: eighteen session records in five megabytes of browser memory.
