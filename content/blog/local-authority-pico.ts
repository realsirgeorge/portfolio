import type { BlogPost } from "@/lib/blog-types";

const post: BlogPost = {
  slug: "local-authority-ctf-walkthrough",
  title: "Local Authority CTF: Client-Side Authentication Bypass",
  date: "2024-12-28",
  category: "ctf",
  tags: ["CTF", "Web Security", "Client-Side", "Authentication Bypass"],
  excerpt:
    "Complete walkthrough of the Local Authority CTF challenge demonstrating how client-side authentication can be exploited to capture the flag.",
  readTime: "12 min",
  featured: false,
  content: `
## Introduction

The Local Authority CTF challenge asks: **"How is the password checked on this website? Can you get the flag?"** This walkthrough demonstrates a critical vulnerability in client-side authentication.

---

## Initial Reconnaissance

### Landing Page Analysis

Upon visiting the challenge website, we're greeted with a login page.

![Login page interface](/images/blog/local-authority/figure1.png)

### Source Code Inspection

Initial inspection of the page source reveals nothing particularly interesting at first glance, though we can identify that the site uses PHP.

![Initial source code view](/images/blog/local-authority/figure2.png)

---

## Discovery Phase

### Testing Default Credentials

I attempted to log in using "admin" as both the username and password, which predictably failed.

![Failed login attempt with admin/admin](/images/blog/local-authority/figure3.png)

### Revealing the Authentication Logic

After the failed login attempt, the source page now revealed the password handling section - a significant security oversight that exposes the authentication mechanism.

![Password handling code revealed in source](/images/blog/local-authority/figure4.png)

---

## Code Analysis

### What the Code Does

The client-side authentication logic performs the following operations:

- **filter(string)**: Checks every character in the input string and returns true only if every character is alphanumeric (0-9, A-Z, a-z). If any character falls outside these ranges, it returns false.

- **Credentials**: \`window.username\` and \`window.password\` are set to "admin".

- **Validation Flow**: The code runs the filter on both username and password. If both pass validation, it calls \`checkPassword(window.username, window.password)\`.

- **Success Handler**: If \`checkPassword(...)\` returns a truthy value, the code displays "Log In Successful", sets a hidden input value to a hash, and submits a hidden admin form. Otherwise, it shows "Log In Failed".

- **Filter Failure**: If the filter fails, it displays "Illegal character..." message.

### Identified Vulnerabilities

#### 1. Undeclared Variables - Accidental Globals

Variables including \`filterPassed\`, \`cc\`, \`usernameFilterPassed\`, \`passwordFilterPassed\`, and \`loggedIn\` are not declared with var/let/const. This makes them global variables that can be read and modified from the browser console or other scripts.

**Consequence**: The authentication flow can be trivially tampered with from the client-side.

#### 2. Client-Side Validation Only

The character filter runs exclusively in the browser. If server-side authentication relies on this, the server must re-validate. Without server-side validation, authentication can be completely bypassed client-side.

#### 3. Redundant/Misleading Logic

The \`filterPassed\` variable is set to true at the top of the function and again inside the allowed-branch, making that assignment unnecessary. The function could simply return false on a failing character and return true after the loop completes.

#### 4. Potentially Insecure checkPassword Usage

We don't see the \`checkPassword\` implementation in the revealed code. If \`checkPassword\` is client-side instead of server-side, secrets and hashes are exposed and can be bypassed or replaced entirely.

#### 5. Auto-Submitting Hidden Form with Fixed Hash

The code sets \`adminFormHash\` to a fixed value before submission. If that value grants privileges server-side, it's trivial to fake by calling the same DOM manipulation from the console.

#### 6. UI Feedback Leakage

Telling users exactly that characters are illegal may help attackers craft inputs. While a smaller issue, it's worth noting from a defense-in-depth perspective.

---

## Exploitation

### Bypassing Authentication

Since the application trusts client-side values, I forcefully submitted the admin form with the existing hash value directly from the browser console.

![Console commands showing form submission](/images/blog/local-authority/figure5.png)

### Capturing the Flag

The exploitation was successful, and the server responded with the flag.

![Flag displayed on screen](/images/blog/local-authority/figure5.png)

---

## Why the Exploit Worked

### Step-by-Step Breakdown

#### 1. The Page Trusted a Client-Supplied Value

The site's client-side script set \`adminFormHash\` to the constant **"2196812e91c29df34f5e217cfd639881"** when it determined login succeeded. By writing that same value into the form input manually, we reproduced the exact POST payload the site would send after a "legitimate" login.

#### 2. Submitting the Form Sent the Hash to the Server

Calling \`form.submit()\` performs the same HTTP POST the page would execute normally. The server received a request containing \`adminFormHash=2196812e...\` (plus any other fields and cookies).

#### 3. The Server Accepted the Hash as Proof

The server's authorization logic apparently trusted the presence and value of that hash, or accepted the POST uncritically, to grant admin access or respond with the flag. In essence, the server treated a client-provided, static value as an authentication token or proof-of-login.

#### 4. No Server-Side Re-Validation

Because we could forge the same POST and retrieve the flag, the server was not verifying credentials (username/password) or signing/validating the token with a secret that the server keeps private.

### Root Vulnerability

**Client-side-only authentication with trust in a client-supplied token.** 

The server relied on an input value provided by the browser instead of issuing and validating a server-side secret or session.

### Why This is Trivially Exploitable

- Anyone can edit DOM inputs in DevTools or send the same POST with curl/fetch
- The hash is static and predictable - no randomness, no server signature, no expiry
- Global client-side variables and the lack of server checks make it possible to fake the entire authentication flow

### Automation Potential

An attacker could easily automate this exploit by:

- Using \`fetch()\` to POST the same form fields directly (without browser navigation) and capture the response containing the flag
- Using curl or Python requests to send the same parameters if you know the form action and required cookies/headers

---

## Secure Fixes and Mitigations

### Actionable Security Improvements

#### 1. Server Must Be Authoritative

Never trust client-supplied tokens as proof of authentication. Authenticate on the server and issue a server-controlled session or signed token.

#### 2. Use Server-Generated, Tamper-Proof Tokens

If you need to send something to the client:

- Issue a session cookie (HttpOnly, Secure, SameSite) after successful login. The server checks the cookie for every privileged request.
- Or use signed tokens (HMAC or JWT with server-only secret). On each request, validate signature and expiry server-side.

#### 3. Don't Accept Static, Client-Provided "Hash" Fields

If the server must accept a client-provided value, it must validate it cryptographically (HMAC with server secret), check expiry/nonces, and tie it to a session.

#### 4. Server-Side Validation of Inputs and State

Re-run any character checks or other validation on the server. Client-side checks are only for user experience enhancement.

#### 5. CSRF Protection & Binding Tokens to Session

If a form grants admin actions, require a CSRF token that is generated server-side per session and validated on submit.

#### 6. Least Privilege & Logging

Don't return sensitive flags in obvious responses. Log attempts to submit forged tokens and alert on anomalies.

### Secure Implementation Example

**Concept:**

\`\`\`text
User logs in → server verifies credentials → server creates session id S123 
and issues Set-Cookie: session=S123; HttpOnly; Secure.

Server stores: session S123 → is_admin = true

Later, a POST to /admin is authorized only by checking session cookie 
server-side. Any client-supplied adminFormHash is ignored or treated 
as non-authoritative.
\`\`\`

---

## Detection and Forensics

### Monitoring Recommendations

- Look for POSTs that supply the admin hash but come from different IPs or without proper session cookies - treat those as forgeries
- Alert on repeated submissions of the same static hash
- Implement rate limiting on authentication endpoints
- Log all authentication attempts with timestamps and source IPs

---

## Key Takeaways

**TL;DR**: The exploit succeeded because the server trusted a predictable, client-controlled field (\`adminFormHash\`) as proof of admin login.

**Fix**: Move trust to the server - issue and validate server-side session tokens, use signed tokens (HMAC/JWT), implement CSRF tokens, and always re-check authorization server-side.

---

## Conclusion

This CTF challenge perfectly demonstrates why client-side authentication is fundamentally insecure. Any security control that can be manipulated by the user should never be trusted. Authentication and authorization must always be validated on the server, using cryptographically secure methods that cannot be forged or predicted by an attacker.

The lesson here extends beyond CTF challenges - many real-world applications have fallen victim to similar vulnerabilities by trusting client-side validation or using predictable tokens for authentication.
  `,
};

export default post;