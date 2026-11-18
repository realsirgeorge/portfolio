---
slug: "secure-app-hardcoded-api-key-apk"
title: "Secure App: the API key was in the string table"
date: "2026-10-03"
category: "ctf"
tags:
  - "CTF"
  - "Android"
  - "Mobile Security"
  - "Secrets Management"
  - "31 Nights of Cyber"
excerpt: "A fintech app claimed its API key was secure. It was a public static final String, and strings found it without a decompiler."
---

![Secure App — a hard-coded key in a 1 KB DEX](/images/blog/secure-app-hardcoded-api-key-apk/hero.png)

The challenge description was doing a lot of work: *"A fintech app claims its API key is secure. Find it."*

Claims are funny things. I have seen "secure" mean mTLS with certificate pinning, and I have seen it mean a key in `strings`. This one was the second kind.

## Two classes and a constant

The APK is 4.7 KB total. The DEX is 1,092 bytes. That is not an app, that is a hello-world with a logo.

```
$ unzip -l secureapp.apk
     1900  AndroidManifest.xml
     1092  classes.dex
      META-INF/...
```

[jadx](https://github.com/skylot/jadx) decompiled it to two classes:

```java
package com.example.secureapp;

public class ApiConfig {
    public static final String API_KEY = "r00t{h4rdc0d3d_s3cr3ts_4r3_n3v3r_s4f3}";
    public static final String BACKEND_URL = "https://api.secureapp-backend.example.com/v1";
}
```

```java
public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        Log.d("SecureApp", ApiConfig.API_KEY);
    }
}
```

That is the entire application. The flag is both the API key and a plain string literal, and the app helpfully logs it on startup.

I laughed. Then I felt a small pang of recognition, because I have seen this exact pattern in real code reviews — a "temporary" key committed with a comment that says *TODO: move to backend*.

![From APK to DEX string table](/images/blog/secure-app-hardcoded-api-key-apk/flow.png)

## You do not even need jadx

This is the part worth internalising: an APK is a ZIP, and a DEX string table is not encrypted. You can skip the decompiler entirely.

```
$ unzip -p secureapp.apk classes.dex | strings | grep r00t
r00t{h4rdc0d3d_s3cr3ts_4r3_n3v3r_s4f3}
```

Two seconds. No tooling beyond `unzip` and `strings`, both of which are already on the box. That is the finding, in its entirety.

And look — no obfuscation. No ProGuard, no R8, no string encryption, no native library. Even with R8, a `public static final String` is not safe; it has to exist in memory at runtime, and an attacker with the APK and a debugger wins eventually. Obfuscation raises the cost. It does not change the category of the bug.

## Why this is a real vulnerability class, not a CTF gag

Hard-coded secrets are one of the most common mobile findings, and they sit squarely in [OWASP MASVS-STORAGE](https://mas.owasp.org/MASVS/05-MASVS-STORAGE/). The [MASTG](https://mas.owasp.org/MASTG/) has test cases for exactly this: credentials in the binary, credentials in shared storage, credentials in logs.

Impact depends entirely on what the key can *do*:

- A **client** key with server-side scoping (package name, signing-certificate hash, rate limits) is annoying if leaked, but contained.
- A **server** key — payment processor, cloud storage, an AI provider — is a breach. The attacker does not need your app; they need your bill.

The challenge is deliberately the simple version, but the reasoning scales. Ask: *if I paste this key into curl from my laptop, what happens?* If the answer is "I can spend money", the key should not be in the APK.

## Remediation that actually holds

- **Do not embed secrets in client binaries.** Put them behind a backend-for-frontend (BFF) that authenticates the user and makes the privileged call server-side.
- If a public client identifier is unavoidable (OAuth client IDs are the classic example), scope it per app, restrict it by package name **and** signing-certificate hash, and rotate it on a schedule.
- Use the [Android Keystore](https://developer.android.com/privacy-and-security/keystore) for per-device secrets. `static final String` is not a keystore.
- Add secret scanning to CI. [gitleaks](https://github.com/gitleaks/gitleaks) and [TruffleHog](https://github.com/trufflesecurity/trufflehog) both catch key patterns and high-entropy strings before they reach `main`.
- Rotate anything that has already shipped. You cannot un-ship an APK; you can invalidate the key.

## The bit I got wrong

Honestly? Nothing dramatic. I expected to need jadx, and jadx was enough. The only moment of doubt was wondering whether the flag was the *key* or somewhere else in the app — the description says "find the API key", and the key is literally the flag, so the challenge is almost too kind.

The more useful takeaway is about triage order. When you get an APK, the first three commands should be:

```bash
unzip -l app.apk          # what is in here?
unzip -p app.apk classes.dex | strings | head -200
jadx -d out app.apk       # now read the logic
```

That order finds the cheap stuff first. If the secret is in the string table, you are done in under a minute. If it is not, you have learned something about the app's complexity before you commit to deeper analysis.

## Further reading

- [OWASP MASVS-STORAGE](https://mas.owasp.org/MASVS/05-MASVS-STORAGE/)
- [OWASP MASTG](https://mas.owasp.org/MASTG/)
- [gitleaks](https://github.com/gitleaks/gitleaks) and [TruffleHog](https://github.com/trufflesecurity/trufflehog)
- [Android Keystore system](https://developer.android.com/privacy-and-security/keystore)

Next up was a pcap where the payload was empty and the data was still leaving. That one took me a lot longer.
