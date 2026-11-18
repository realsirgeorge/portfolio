---
slug: "the-hunt-modbus-ics-forensics"
title: "The Hunt: finding an intruder in Modbus traffic"
date: "2026-10-30"
category: "ctf"
tags:
  - "CTF"
  - "Forensics"
  - "ICS"
  - "Modbus"
  - "Network Security"
  - "31 Nights of r00t"
excerpt: "Three thousand packets of Modbus/TCP, one PLC, four clients. With no authentication in the protocol, behaviour is the only attribution you get."
---

![The Hunt — behaviour as attribution in Modbus](/images/blog/the-hunt-modbus-ics-forensics/hero.png)

Industrial protocols are a different world. There is no login, no session, no TLS, and often no authentication at all. Modbus/TCP is a 1979 protocol that got a TCP wrapper and very little else. If you can reach the PLC, you can read and write its registers.

That is the context for **The Hunt**. Three questions:

1. What was the engineer IP?
2. What was the attacker IP?
3. What is the flag?

The capture is 3,703 packets over about nine minutes, all Modbus/TCP on port 502, with every client talking to one PLC at `172.28.0.10`.

## Confirm the protocol, then find the clients

```sh
tshark -r the_hunt.pcap -q -z io,phs
# only tcp -> mbtcp -> modbus

tshark -r the_hunt.pcap -q -z conv,ip
# four clients -> 172.28.0.10
```

Four clients. Grouping their requests by function code tells you who does what:

| Client | Requests | Role |
|--------|----------|------|
| `172.28.0.20` | FC3 read 5 registers + FC1 read coils, ~554× each | HMI / SCADA poller |
| `172.28.0.21` | FC3 read 3 registers, ~111× | historian / second poller |
| `172.28.0.30` | one FC3 read reg 10 (=600), then FC6 write reg 10 = 620 | **engineer** — read, then one small setpoint change |
| `172.28.0.66` | FC3 read 100 regs + FC1 coils (recon), FC5 toggle coil 2 twice, FC6 reg 4 = 70 then 40, FC16 write 28 regs at 20, FC6 reg 20 = 650 | **attacker** |

That table is the whole investigation. The pollers read continuously and never write. The engineer reads one value, writes one value, and leaves. The attacker maps the device, then writes repeatedly, including a block write that hides the flag.

![The engineer and the attacker in the timeline](/images/blog/the-hunt-modbus-ics-forensics/flow.png)

## The attacker timeline

| t (s) | Action |
|------:|--------|
| 150 | FC3 read registers 0–99, FC1 read coils — mapping the device |
| 180 | FC5 write coil 2 (pump or valve) |
| 195 | FC6 register 4 = 70 |
| 255 | FC6 register 4 = 40, FC5 coil 2 again |
| 330 | FC16 write 28 registers from address 20 — hides the flag |
| 450 | FC6 register 20 = 650 — overwrites the first value |

The FC16 write at t ≈ 330 s carries:

```
900,114,48,48,116,123,49,95,108,48,118,51,95,109,51,95,115,48,109,51,95,109,48,100,98,117,115,125
```

`900` is a believable setpoint used as a decoy. The rest are ASCII:

```
r00t{1_l0v3_m3_s0m3_m0dbus}
```

The flag already contains the `r00t{}` wrapper, so it is submitted as is.

## Why the engineer is not the attacker

The engineer's single write is a small setpoint change: read 600, write 620. That is a normal maintenance action — look at the current value, adjust it slightly. The attacker's pattern is completely different: reconnaissance, coil toggles, multiple register writes, a block write, then an overwrite to hide the evidence.

Behaviour is the attribution. In a protocol with no identity, you infer intent from the shape of the traffic.

That is a useful mindset for OT security. You cannot ask "who is this?" because Modbus does not tell you. You ask "what is this client doing, and does it match its role?"

## Defences for a real Modbus network

- **Segment the OT network.** The PLC should not be reachable from general IT, let alone from an unknown host.
- **Allow writes only from engineering workstations.** Use a firewall rule or a Modbus-aware gateway that permits FC5/6/15/16 only from a known source.
- **Alert on writes from unexpected sources.** Reads are normal; writes are events.
- **Baseline function-code profiles per client.** A poller that starts issuing FC16 is compromised.
- **Log and retain.** Modbus has no auth, so your only record is the network. Keep it.

Modbus Security (the newer spec) adds authentication and encryption, but the installed base is enormous and mostly legacy. In practice, you secure it with network architecture and monitoring, not with the protocol.

## What I learned

- **Protocol hierarchy first.** It confirmed there was nothing else in the capture, which narrowed the scope immediately.
- **Function codes tell a story.** FC3 is read; FC5/6/16 are writes. Group by client and the roles appear.
- **Decode block writes as ASCII.** Values in the 32–126 range are a giveaway, and a decoy setpoint (900) is a common trick to make the block look like real process data.
- **No auth means behaviour is the only evidence.** That is the defining constraint of ICS forensics.

## Further reading

- [Modbus Organization — specifications](https://modbus.org/specs.php)
- [MITRE ATT&CK for ICS](https://attack.mitre.org/matrices/ics/)
- [CISA — Modbus security guidance](https://www.cisa.gov/)
- [Wireshark Modbus dissector](https://www.wireshark.org/docs/dfref/m/mbtcp.html)
- [NIST SP 800-82 — Guide to OT Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final)

That is the series. Twenty-eight writeups, one very tired notebook, and a lot of respect for the people who do this on real networks with real consequences.
