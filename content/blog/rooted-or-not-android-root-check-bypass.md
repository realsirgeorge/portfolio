---
slug: "rooted-or-not-android-root-check-bypass"
title: "Rooted or Not? The root check was never the lock"
date: "2026-10-02"
category: "ctf"
tags:
  - "CTF"
  - "Android"
  - "Mobile Security"
  - "Reverse Engineering"
  - "31 Nights of Cyber"
excerpt: "A 1.6 KB DEX, a root check that only tests one file path, and a flag obfuscated with an arithmetic keystream. No emulator required."
---

![Rooted or Not? — static analysis versus a client-side root check](/images/blog/rooted-or-not-android-root-check-bypass/hero.png)

I had the emulator open before I even looked at the APK. Old habit. Root detection, Frida, `adb shell`, the whole ritual — because that is what "the app hides its flag behind a root check" usually means.

Then I listed the archive contents and felt a little silly.

```
$ unzip -l vaultapp.apk
     1896  AndroidManifest.xml
     1656  classes.dex
      326  META-INF/ANDROIDD.SF
     1221  META-INF/ANDROIDD.RSA
      199  META-INF/MANIFEST.MF
```

One DEX. No native libraries. No resources. No `assets/`. The entire application is 1,656 bytes of Dalvik bytecode. There is nothing here to run — there is only something to read.

## Read the app before you run it

[jadx](https://github.com/skylot/jadx) turns the DEX back into Java in one command:

```
$ jadx -d jadx vaultapp.apk
$ find jadx/sources -name '*.java'
jadx/sources/com/example/vaultapp/MainActivity.java
jadx/sources/com/example/vaultapp/RootCheck.java
```

`MainActivity.onCreate` is the whole story:

```java
protected void onCreate(Bundle bundle) {
    super.onCreate(bundle);
    if (RootCheck.isDeviceRooted()) {
        Log.d("VaultApp", "Root detected - access denied");
    } else {
        Log.d("VaultApp", RootCheck.unlockDebugFlag());
    }
}
```

And `isDeviceRooted()` is:

```java
public static boolean isDeviceRooted() {
    return new File("/system/bin/su").exists();
}
```

That is it. One hard-coded path. Not a SafetyNet attestation, not Play Integrity, not a kernel check — one `File.exists()` on `/system/bin/su`.

My first thought was: *okay, so I rename `su` and the flag prints to logcat*. That would work. But then I read `unlockDebugFlag()` and realised I did not need to run anything at all.

![From decompilation to inverting constants](/images/blog/rooted-or-not-android-root-check-bypass/flow.png)

## The "encryption" was a for-loop

The flag is stored as a byte array and XORed with a keystream derived from a constant seed:

```java
private static final int SEED = 90;

private static byte[] deriveKey(int length) {
    byte[] bArr = new byte[length];
    for (int i = 0; i < length; i++) bArr[i] = (byte)(SEED + (i * 7));
    return bArr;
}

public static String unlockDebugFlag() {
    byte[] enc = ENCODED_FLAG, key = deriveKey(enc.length), out = new byte[enc.length];
    for (int i = 0; i < enc.length; i++) out[i] = (byte)(enc[i] ^ key[i]);
    return new String(out);
}
```

So the keystream is just `k[i] = (90 + 7i) mod 256`. Not a cipher. A multiplication table.

Java bytes are signed, which is the only real gotcha. Mask with `& 0xff` before XOR or you will spend twenty minutes wondering why half the characters are wrong — ask me how I know.

```python
enc = [40,81,88,27,13,14,-16,-65,-26,-88,-61,-8,-102,-37,-120,-81,
       -77,-94,-23,-84,-71,-113,-115,-117,54,122,99,36,109,122,88,91,
       9,30,43,39,101,62,15,22]

key = [(90 + 7 * i) & 0xff for i in range(len(enc))]
print(''.join(chr((e & 0xff) ^ k) for e, k in zip(enc, key)))
```

```
r00t{st4t1c_4n4lys1s_byp4ss3s_th3_ch3ck}
```

"Aha." The flag literally says static analysis bypasses the check. The challenge was not about rooting a device. It was about noticing that the check never gates the secret in the first place.

## The root-check bypass table (for completeness)

I did eventually run the bypass, out of curiosity, and because it belongs in a write-up that claims to cover the topic:

| Attack | How it works |
|---|---|
| Rename or remove `su` | the check only tests one hard-coded path |
| Frida hook | `Java.use('java.io.File').exists.implementation = () => false` |
| Smali patch | flip the branch in `onCreate` |
| Static analysis | the flag is a compile-time constant; the check never executes |

Each one works. None of them is the "intended" solution, which is a nice bit of design: the challenge name is the hint. *Rooted or not?* It does not matter.

If you are learning mobile testing, the relevant references are the [OWASP Mobile Application Security Testing Guide](https://mas.owasp.org/MASTG/) and the [MASVS](https://mas.owasp.org/MASVS/). The root-detection controls live under MASVS-RESILIENCE, and the guide is explicit that they are **deterrents**, not security boundaries. A local boolean cannot protect a local secret.

## What I would have done differently

I would have decompiled first and skipped the emulator entirely. It cost me maybe ten minutes, but the bigger lesson is procedural: **match the tool to the weakest link.** Here the weakest link was storage — a constant in the DEX — not runtime protection. Reaching for Frida before reading the code is how you spend an afternoon instrumenting a function that does not matter.

Also: `unzip -p app.apk classes.dex | strings` would have found this. I like jadx because it gives you the logic and the context, but it is worth remembering that DEX string tables are plaintext.

## If you are building the app

- Never ship secrets as constants. DEX is trivially decompiled, and an arithmetic XOR is not encryption.
- Root detection must be paired with **server-side enforcement**. A client-side gate only stops users who were not trying.
- If a value must live on the device, derive it at runtime from a server-issued, per-user secret, or use the [Android Keystore](https://developer.android.com/privacy-and-security/keystore) with hardware-backed keys.
- Add a secret-scanning step to the mobile pipeline. If a string matches `r00t{`, `flag{`, or an API-key pattern, fail the build.

## Further reading

- [OWASP MASTG — Android anti-reversing and root detection](https://mas.owasp.org/MASTG/)
- [jadx decompiler](https://github.com/skylot/jadx)
- [Android Keystore system](https://developer.android.com/privacy-and-security/keystore)
- [Frida](https://frida.re/docs/android/) for the dynamic path, when you actually need it

Day three was a fintech app with a "secure" API key. Reader, it was a `public static final String`.
