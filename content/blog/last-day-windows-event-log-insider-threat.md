---
slug: "last-day-windows-event-log-insider-threat"
title: "The Last Day: an insider threat hiding in two Windows event logs"
date: "2026-10-18"
category: "ctf"
tags:
  - "CTF"
  - "Forensics"
  - "Windows"
  - "Event Logs"
  - "Incident Response"
  - "31 Nights of r00t"
excerpt: "A routine offboarding turned into an after-hours RDP session, staged finance files, and an archive uploaded to a personal sync domain. Seven questions, two EVTX exports."
---

![The Last Day — an insider threat in EVTX](/images/blog/last-day-windows-event-log-insider-threat/hero.png)

HR flagged it as routine: an employee's last day, standard offboarding. Then the on-call analyst noticed file access to folders the employee had no reason to touch, well after they would normally have gone home.

You get two log exports from the host. That is it. No disk image, no memory dump, no endpoint agent console. Just Windows event logs, which means the investigation is about knowing which event IDs tell which part of the story.

This was the first challenge of **31 Nights of r00t**, and it set the tone: 400 points, seven questions, and a lot of small details that punish shallow reading.

![Seven questions, all solved](/images/blog/last-day-windows-event-log-insider-threat/solved-questions.jpg)

## What is in the exports

The ZIP contains two channels:

- `Microsoft-Windows-Sysmon%4Operational.evtx` — 25 records
- `Security.evtx` — 53 records

Two things to know before you parse anything:

1. The Security channel is a **composite export**. It carries events from two hosts: `WKSTN-14` for the 2026 incident, and `HR-ADMIN01` for the September 2020 offboarding paperwork.
2. The Sysmon channel holds several attack fragments stitched together, so the timestamps are not globally consistent. Read them per record.

That is a deliberate trap. If you assume one host and one timeline, you will answer question 6 wrong.

## Parsing EVTX

[python-evtx](https://github.com/williballenthin/python-evtx) is the standard library for this. Render every record to XML, then read the `TimeCreated` and `<Data Name=...>` values.

```python
import Evtx.Evtx as evtx
import re

with evtx.Evtx('Security.evtx') as log:
    for rec in log.records():
        xml = rec.xml()
        if 'r00t{' in xml:
            print(re.search(r'r00t\{[^}]+\}', xml).group(0))
```

That last snippet is the shortcut for the final flag, but it is not the investigation. Work the story first.

## Questions 1–2: the after-hours logon

The `WKSTN-14` timeline starts with the log being cleared at `23:30:00` (EID 1102). Then:

- `23:47:12` — **EID 4624**, `LogonType: 10` (RemoteInteractive / RDP), `TargetUserName: n.wanjiru`, `SubjectUserName: user01`, `IpAddress: 203.0.113.77`.
- `23:56:00` — four **EID 4663** file-access audit records in the name of `n.wanjiru`, against `C:\Shares\Finance\Q3_Client_Contracts.xlsx`, `C:\Shares\Finance\Client_Master_List.xlsx`, the Firefox `logins.json`, and the Chrome `Login Data`. All touched by `C:\Users\Defau1t\wsus.exe`.
- `23:56:05` — the Security log is cleared again.

So:

1. The account is `n.wanjiru`.
2. The logon came from `203.0.113.77`.

The masquerading binary is a nice detail: `C:\Users\Defau1t\wsus.exe` — a fake user profile (`Defau1t` with a one) and a Windows Update process name. That is the kind of thing an analyst should note even though the questions do not ask for it. It suggests the attacker had local access first, then used RDP from outside.

![The challenge completed, 400 points](/images/blog/last-day-windows-event-log-insider-threat/solved-challenge.jpg)

## Questions 3–5: staging, archive, destination

The Sysmon export tells the exfiltration story:

- **EID 11** (FileCreate): `explorer.exe` creates `F:\Staging\ClientExports_Raw.xlsx`. That is the staging folder.
- **EID 1** (ProcessCreate): `7z.exe` with `CommandLine: 7z.exe a -p client_exports_final.7z F:\Staging\*`. The process is a renamed binary — its version metadata still says `cscript.exe`.
- **EID 3** (NetworkConnect): `7z.exe` opens a TCP connection to `vault-personal-sync.io:443` (`DestinationPortName: https`).

Answers:

3. `F:\Staging`
4. `client_exports_final.7z`
5. `vault-personal-sync.io`

The `-p` flag means the archive is password-protected. So even if you capture the upload, you need the password to read it. In this challenge, you do not need it — the exfil destination is enough — but in a real investigation, the password becomes a key question.

## Question 6: which timestamp?

This is the trap. The EID 3 records carry two different times:

- `UtcTime`: `2020-08-02 16:24:59.242`
- `TimeCreated` / SystemTime as exported: `2026-09-14 00:07:22`

The expected answer is the **event's own creation time in the supplied export**: `2026-09-14 00:07:22`. The `UtcTime` belongs to the original upstream sample that the fragment was taken from. This is the hazard of composite logs: the record's internal fields and its export metadata can disagree.

The lesson is bigger than the challenge: when two timestamps disagree, state which one you are using and why. That is the difference between an investigation and a guess.

## Question 7: what the offboarding paperwork left behind

The final question points at the account-deactivation records. On `HR-ADMIN01`, the Security log holds a run of **EID 4725** (account disabled) events generated by `it.admin` against `j.omondi`, `s.achieng`, `p.mutua`, `l.karanja`, `d.njoroge`, and `n.wanjiru`.

Every one of those events uses the normal `SubjectUserName: it.admin` — except the record for `n.wanjiru`, where the `SubjectUserName` field has been replaced with the flag:

```
r00t{th3_l4st_d4y_1ns1d3r_thr34t}
```

A scan of all `<Data>` values, or a raw `strings` sweep of the EVTX, surfaces it immediately. It is a fun hiding place: not encrypted, not obfuscated, just in a field that an analyst might skim past because it is supposed to contain the same value in every record.

## The full answer table

| # | Question | Answer |
|---|---|---|
| 1 | Account that logged on late | `r00t{n.wanjiru}` |
| 2 | Source IP | `r00t{203.0.113.77}` |
| 3 | Staging folder | `r00t{F:\Staging}` |
| 4 | Archive filename | `r00t{client_exports_final.7z}` |
| 5 | Destination domain | `r00t{vault-personal-sync.io}` |
| 6 | Upload time | `r00t{2026-09-14 00:07:22}` |
| 7 | Left in the paperwork | `r00t{th3_l4st_d4y_1ns1d3r_thr34t}` |

## What makes this a good DFIR exercise

The challenge is realistic in the ways that matter:

- **Logs are cleared.** Twice. That is normal attacker behaviour, and it is why centralised logging exists.
- **Living-off-the-land binaries.** Renamed `7z.exe` with misleading metadata. A hash-based allowlist would catch it; a name-based one would not.
- **Credential stores are targeted.** Firefox `logins.json` and Chrome `Login Data` are the first things an insider grabs before leaving.
- **Exfiltration looks like sync.** `vault-personal-sync.io` on 443 is designed to blend into ordinary cloud traffic.
- **The paperwork matters.** HR and IT logs are part of the incident, not an afterthought.

If you are building detection for this:

- Alert on **EID 1102** (log cleared) and **EID 104** (log cleared via wevtutil). Both are high-signal.
- Alert on **EID 4624 LogonType 10** from unexpected source IPs, especially outside business hours.
- Alert on **EID 4663** access to credential stores (`logins.json`, `Login Data`, `Protected/`, browser profile paths).
- Alert on **large archive creation** followed by a network connection from the same process.
- Forward logs off-host in real time. Event log clearing is only effective if the only copy is local.

## What tripped me up

The composite hosts. I started building a single timeline, noticed `HR-ADMIN01` events interleaved with `WKSTN-14` events, and had to restart with a per-host model. That is the kind of mistake that makes you answer a question with the wrong host's data.

The second trap was the timestamp. I initially used `UtcTime` because it is the field closest to the network event, then re-read the question and realised it wanted the export's creation time. Two plausible answers, one correct.

## Further reading

- [python-evtx](https://github.com/williballenthin/python-evtx)
- [Windows Security event 4624 (logon)](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4624)
- [Windows Security event 4725 (account disabled)](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4725)
- [Sysmon documentation](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon)
- [MITRE ATT&CK — Indicator Removal: Clear Windows Event Logs (T1070.001)](https://attack.mitre.org/techniques/T1070/001/)

Next: a flight data recorder with ghosts in it.
