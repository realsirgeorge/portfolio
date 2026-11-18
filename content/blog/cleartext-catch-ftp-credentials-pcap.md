---
slug: "cleartext-catch-ftp-credentials-pcap"
title: "Cleartext Catch: FTP, a reused password, and 159 packets of noise"
date: "2026-10-05"
category: "ctf"
tags:
  - "CTF"
  - "Network Forensics"
  - "FTP"
  - "Wireshark"
  - "31 Nights of Cyber"
excerpt: "Six HTTP decoys, three trailing requests, and one passive FTP session carrying both a password and an encrypted archive. The password was the archive key too."
---

![Cleartext Catch — credentials and an archive in one pcap](/images/blog/cleartext-catch-ftp-credentials-pcap/hero.png)

This challenge is a good reminder that "encrypted" is a property of the *channel*, not of the file, and that people reuse passwords in ways that turn two low findings into one incident.

The brief: a packet capture from an internal audit. Was any sensitive file transferred across this segment in the clear? The capture is small — 159 packets, 32 seconds — and deliberately noisy.

## Triage before content

My first instinct with any pcap is to look at the protocol hierarchy, not to grep for the flag. `strings capture.pcap | grep r00t` is the expensive mistake here; the flag is inside an encrypted ZIP, so it does not exist in plaintext anywhere on the wire.

```console
$ capinfos capture.pcap
Number of packets:   159
Capture duration:    32.272731 seconds

$ tshark -r capture.pcap -q -z io,phs
frame  159
  eth  159
    arp    8
    ip   151
      udp    8   dns
      tcp  143
        http      18 frames  (data-text-lines 9)
        ftp       14 frames
        ftp-data   1 frame
```

`ftp-data` with **exactly one frame**. That is a giant arrow pointing at the answer. Everything else — the HTTP requests, the DNS chatter, the ARP — is set dressing.

![From protocol hierarchy to a carved archive](/images/blog/cleartext-catch-ftp-credentials-pcap/flow.png)

## Reconstruct the FTP conversation

FTP is a chatty protocol, which is great for forensics: the control channel tells you exactly what happened on the data channel.

```console
$ tshark -r capture.pcap -Y ftp -T fields \
    -e frame.number -e ftp.request.command -e ftp.request.arg -e ftp.response.code
86            220   FinCorp Internal FTP Service Ready
88  USER  employee13
90            331   Password required for employee13
92  PASS  Harbor_Fal12
94            230   User employee13 logged in
96  TYPE  I
98            200   Type set to I
100 PASV
102           227   Entering Passive Mode (10,20,0,5,200,5)
104 RETR  backup.zip
106           150   Opening BINARY mode data connection for backup.zip (245 bytes)
117           226   Transfer complete
```

So we have:

- Username `employee13`
- Password `Harbor_Fal12` — in the clear, on port 21
- A passive-mode transfer of `backup.zip`, 245 bytes

Two separate exposures already: the credential and the file. Neither required breaking any cryptography.

## Carve the file instead of reassembling it by hand

Passive FTP means the data connection is on a different port, negotiated in the `PASV` response (`200,5` → port `200 × 256 + 5 = 51205`). You *can* reassemble it by hand. You should not.

```console
$ mkdir out && tshark -r capture.pcap --export-objects ftp-data,out
$ ls -l out/
-rw-r--r-- 1 sirg sirg 245 out/backup.zip
```

One deterministic command, no scripting. `--export-objects` is one of those Wireshark features that feels like cheating until you remember that the point of a forensic tool is to save you from doing forensics by hand.

## The archive is encrypted. Try the password.

This is the moment the challenge becomes a lesson in credential reuse:

```console
$ unzip -l out/backup.zip
Archive:  out/backup.zip
  Length      Date    Time    Name
      105  2026-09-08 16:32   notice.txt

$ unzip -o -P Harbor_Fal12 out/backup.zip -d out/extracted
$ cat out/extracted/notice.txt
Internal backup - Q3 credentials rotation
Do not share outside IT.

flag: r00t{ftp_cr3ds_1n_pl41n_s1ght}
```

The FTP password *is* the ZIP password. Of course it is. In a real organisation, that is not a contrived CTF twist — it is Tuesday. People reuse the password they already have to protect the file they are already sending over the channel that already trusts them.

## The decoys, and why they work

```console
$ tshark -r capture.pcap -Y http -T fields -e http.host -e http.request.uri
decoy0.example.net  /page0.html
decoy1.example.net  /page1.html
...
trailing0.example.net /x0
trailing1.example.net /x1
trailing2.example.net /x2
```

All the HTTP bodies are the same 26-byte `OK` document. They exist to punish anyone who starts by dumping HTTP streams or grepping for `r00t`. There are six of them, plus three "trailing" requests after the FTP session, which is enough to make a naive content search noisy and slow.

I did not grep. Protocol triage first, content second. That is the whole discipline.

## What I would do differently

I got lucky here: the protocol hierarchy made the answer obvious in one command. The thing I would change is the order of the follow-up questions. Once I saw `employee13:Harbor_Fal12`, I went straight to the ZIP. A more thorough analyst would also ask:

- Is this credential valid anywhere else in the capture? (It is not, but check.)
- Did the same host authenticate to anything else?
- Is `10.20.0.5` an internal server or an attacker?
- Is `backup.zip` the only transfer, or is there a second session outside this 32-second window?

In a real incident, the pcap is a sample. The finding is a lead, not a conclusion.

## Defences that would have prevented this

- **FTPS or SFTP**, with certificate validation. Plain FTP should not exist on a modern network, and "it is internal" is not a control.
- **No credential reuse.** The FTP account password should not decrypt archives. Use a password manager and per-artifact keys.
- **DLP egress monitoring** for archive downloads. A 245-byte ZIP is small, but the pattern — `RETR *.zip` from an internal host — is detectable.
- **Network segmentation.** The audit segment should not be able to reach an FTP server with backup data on it.
- **Log and alert on clear-text protocols.** If port 21 is open, someone will eventually use it.

## Further reading

- [Wireshark `--export-objects` documentation](https://www.wireshark.org/docs/man-pages/tshark.html)
- [RFC 959 — File Transfer Protocol](https://www.rfc-editor.org/rfc/rfc959)
- [MITRE ATT&CK T1048 — Exfiltration Over Alternative Protocol](https://attack.mitre.org/techniques/T1048/)
- [ZIP encryption and its weaknesses](https://en.wikipedia.org/wiki/ZIP_%28file_format%29#Encryption)

Next: a smart contract that treated a signature as an identity, and a signature that had a twin.
