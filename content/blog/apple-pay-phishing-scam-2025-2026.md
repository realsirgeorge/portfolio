---
slug: "apple-pay-phishing-scam-2025-2026"
title: "The Apple Pay Phishing Scam Stealing 2FA Codes in Real Time"
date: "2026-02-23"
category: "security"
tags:
  - "Phishing"
  - "Apple Pay"
  - "Social Engineering"
  - "Vishing"
  - "2FA Bypass"
excerpt: "A coordinated phishing campaign is targeting Apple users with fake fraud alerts designed to steal Apple ID credentials and bypass two-factor authentication in real time. Here is how the attack works and how to protect yourself."
readTime: "3 min"
featured: false
---

# The Apple Pay Phishing Scam Stealing 2FA Codes in Real Time

> **TL;DR** — A coordinated phishing campaign is sending Apple users convincing fake "blocked transaction" emails. If you call the number inside, scammers trigger a real Apple ID login attempt and steal the verification code straight from you over the phone — bypassing 2FA in real time.

---

## What Is Happening?

Since late 2025 to early 2026, security researchers at Malwarebytes and AppleInsider have been tracking a coordinated phishing campaign targeting Apple Pay users. The attack combines two techniques; email phishing and voice phishing (vishing); to steal Apple ID credentials and payment information through psychological pressure rather than technical exploits.

The campaign has been flagged across major cybersecurity outlets including Malwarebytes, Macworld, TechRadar, and Cybernews; indicating it is widespread and actively targeting millions of Apple users.

---

## How the Attack Works — Step by Step

### Stage 1: The Email

![The Email](https://blog.flock.com/hs-fs/hubfs/What%20is%20Business%20Email.png)


The victim receives an email that looks indistinguishable from official Apple communications. It features:

- The correct Apple logo and clean, professional formatting
- A fabricated "Case ID" and timestamp to appear legitimate
- A subject line designed to cause immediate alarm; typically claiming a high-value Apple Pay purchase has been attempted
- An urgent call to action; contact "Apple Billing & Fraud Prevention" immediately or the charge will go through

Researchers have documented two common fake transaction amounts used in the campaign; a $279.99 Apple Gift Card purchase and a $1,157.07 receipt mimicking a 2025 MacBook Air M4. The specific dollar amounts are chosen deliberately; large enough to cause panic, plausible enough to seem real.

![Redflag](/images/blog/apple-pay-phishing-scam-2025-2026/figure1.png)

> **Red flag:** Apple never sends fraud alerts via email asking you to call a number. Genuine Apple Pay decline notifications arrive as push notifications in the Wallet app; not in your inbox.


### Stage 2: The Call (Vishing)

![The Call](https://www.fastpasscorp.com/wp-content/uploads/2022/07/vishing-phone-graphic-1.png)

If the victim calls the number, they are not connected to Apple. They reach a scammer operating a scripted fake support centre.

The call is carefully designed to lower the victim's guard. It begins with innocent-sounding verification questions; your name, the last four digits of your phone number, which Apple devices you own. This is deliberate: the more harmless information you confirm, the more legitimate the call feels.

Then comes the critical moment.

### Stage 3: The Real-Time 2FA Bypass

The scammer triggers a genuine Apple ID login attempt on the victim's real account. This causes Apple's system to send an authentic one-time verification code to the victim's phone.

Still on the call, the scammer asks the victim to read out the code; claiming it is needed to "confirm identity" or "fully secure the account." In reality, that code is being entered in real time to bypass the victim's two-factor authentication and take over their Apple ID.

Once inside, attackers have access to:

- Saved payment cards in Apple Wallet
- Purchase history and billing information
- iCloud data; photos, contacts, and documents
- The ability to lock the owner out of their own account

---

## Why This Campaign Is Effective

| Factor | Why It Works |
|---|---|
| **Brand trust** | Apple carries enormous credibility; users are conditioned to take Apple alerts seriously |
| **Urgency engineering** | The 24-hour window leaves victims no time to think or verify |
| **Authentic-looking emails** | Professional formatting and real Apple assets make detection difficult |
| **Real 2FA codes** | The verification code the victim reads out is genuinely from Apple; reinforcing the illusion of legitimacy |
| **Scripted social engineering** | The call follows a trust-building script before escalating to credential theft |

---

## How to Spot the Scam

Before you panic and call any number, check for these warning signs:

1. **Inspect the sender address** — Legitimate Apple emails come from `@apple.com` domains. Scam emails often use convincingly named but unrelated domains
2. **Search the phone number** — Scam numbers return unrelated results (health lines, addiction services); Apple numbers always link back to Apple-owned domains
3. **Check your Wallet app directly** — If a charge was genuinely attempted on Apple Pay, your Wallet app will show it; not an email
4. **Look up your purchase history** — Go to Settings > your name > Media & Purchases > View Account > Purchase History to verify any claimed transaction

---

## What to Do If You Have Already Called

If you engaged with this scam, act immediately:

- [ ] **Change your Apple ID password** at [appleid.apple.com](https://appleid.apple.com); not from any link in the email
- [ ] **Sign out of all active sessions** in Settings > Apple ID > scroll down to see all logged-in devices
- [ ] **Confirm 2FA is still enabled** and rotate your password again if you see any new login alerts
- [ ] **Check Apple Wallet** for any unfamiliar transactions or recently added cards
- [ ] **Contact your bank** to flag potential card compromise and dispute any unauthorised charges
- [ ] **Report the email** by forwarding it to `reportphishing@apple.com`

---

## The Golden Rules

Apple will **never**:
- Ask you to call a phone number from an unsolicited email to confirm fraud
- Request your 2FA verification code over the phone
- Set up fraud appointments via email
- Threaten to process a transaction unless you call within a specific timeframe

If an email creates panic and demands immediate action; slow down. That urgency is the weapon. Taking 60 seconds to verify through official channels can be the difference between a close call and a compromised account.

---

*Sources: Malwarebytes Blog, AppleInsider, Macworld, TechRadar, Cybernews, Apple Support. Last updated: February 23, 2026.*
