---
slug: "kenya-dpa-sacco-it-team"
title: "What Kenya's Data Protection Act Means for a SACCO's IT Team"
date: "2026-11-13"
category: "security"
tags:
  - "Data Protection Act"
  - "Kenya"
  - "SACCO"
  - "Compliance"
  - "Security Operations"
excerpt: "The Data Protection Act 2019 is usually read by lawyers and board secretaries. Most of what it asks for is delivered by the IT team. A practitioner's reading of where the work actually lands."
readTime: "7 min"
featured: false
draft: true
reviewNote: "Draft for owner review before publishing. Check statutory references against the current Act and ODPC guidance. Not legal advice."
---

## The Act is a legal document. The work is technical.

When a SACCO talks about the Data Protection Act 2019, the conversation usually starts in the boardroom: registration with the Office of the Data Protection Commissioner, a privacy notice on the website, a clause in the member application form. Those matter. But almost every obligation that actually reduces risk to members ends up on the desk of whoever runs the SACCO's systems.

A SACCO holds exactly the kind of data the Act was written for: national ID numbers, phone numbers, next-of-kin details, salary and guarantor information, loan histories, and the mobile money trail that ties them together. If that data leaks, the harm to members is direct and personal. This post is a practitioner's reading of what the Act means in practice for the IT team. It is not legal advice, and it is no substitute for reading the Act and the ODPC's own guidance.

## 1. You cannot protect what you have not mapped

The Act's principles are familiar: collect personal data for a specified, lawful purpose, collect no more than you need, keep it accurate, keep it no longer than necessary, and keep it secure. Every one of those principles assumes you know where the data is.

In most SACCOs it lives in more places than anyone expects:

- The core banking or SACCO management system.
- Spreadsheets exported from it for reports, reconciliations and loan committee packs.
- Email inboxes, where scanned IDs and payslips arrive as attachments.
- Shared drives and personal cloud storage used to "just send the file quickly".
- WhatsApp groups used by field officers and branch staff.
- Backups, including old ones nobody has tested or deleted.

A data inventory does not need to be a consultancy deliverable. A table listing each system, what personal data it holds, who can access it, where it is backed up and when it should be deleted is enough to start. It is also the document you will want in your hand on the day something goes wrong.

## 2. "Appropriate safeguards" is a technical requirement

The Act requires data protection by design and by default: appropriate technical and organisational measures, built into how systems are set up rather than bolted on later. For an IT team, that translates into controls you can name and check:

- **Access control.** Staff see the member records their role needs, not the whole database. Accounts are personal, not shared, and are removed the day someone leaves.
- **Strong authentication.** Multi-factor authentication on email, the core system's administrative accounts, remote access and the firewall. Shared credentials are a recurring finding; the university audit on this site found a consumer-grade router with shared credentials serving an entire department.
- **Network segmentation.** The teller workstation, the guest Wi-Fi and the CCTV recorder should not share one flat network. A single compromised device should not reach everything.
- **Encryption.** Laptops and backup media encrypted, and member data moving over the internet protected in transit.
- **Logging.** Enough logging to answer the question "who accessed this member's record, and when?" after the fact.
- **Tested backups.** A backup that has never been restored is a hope, not a control.

None of this is exotic. It is the same baseline a penetration tester checks first, and it is where many real breaches start.

## 3. Your vendors are part of your compliance

Many SACCOs run their core system as a hosted service, outsource IT support, and use third parties for SMS, mobile money integration and card services. Under the Act, an organisation that processes personal data on your behalf is a data processor, and the SACCO remains responsible for choosing processors that protect that data properly.

For the IT team that means:

- Knowing which vendors can reach member data, and how (VPN, remote desktop tools, shared admin accounts).
- Making sure contracts say what the vendor may and may not do with the data, and how they will tell you about an incident.
- Removing vendor access that is no longer needed. Remote support tools left installed and permanently connected are a common way in.

## 4. Breach response is measured in hours

The Act requires a data controller to notify the Data Commissioner of a personal data breach within 72 hours of becoming aware of it, where the breach creates a real risk of harm to the people affected, and to inform those people too. Seventy-two hours is very little time if the first question is "who do we call?".

A SACCO does not need a large incident response capability. It needs a short plan that answers, in advance:

1. Who decides that an incident is a personal data breach.
2. Who is called first, internally and externally, including the IT vendor.
3. How evidence is preserved before systems are rebuilt.
4. Who drafts the notification to the Commissioner, and who approves it.
5. How members are told, in plain language.

Run it once as a tabletop exercise. The gaps show up quickly, and they are much cheaper to find on a quiet afternoon.

## 5. New systems need a risk assessment first

The Act expects a data protection impact assessment before processing that is likely to result in a high risk to people's rights and freedoms. For a SACCO, the obvious triggers are a new member mobile app, a core banking migration, biometric registration, or moving member data to a new cloud provider.

From the IT side, the useful part of an impact assessment is the technical review it forces: what data flows where, what an attacker would see if they intercepted the app's traffic, how authorization is enforced on member accounts. Authorization flaws, where one member can see another's records by changing an identifier, are a common serious finding; in the university audit on this site, the critical findings clustered around exactly that. They are far cheaper to fix before launch than after.

## 6. Members have rights, and the requests reach IT

Members can ask to access the personal data held about them, to have it corrected, and in some circumstances to have it deleted or to object to how it is used. The front office receives the request; the IT team has to find the data across every system in the inventory from step 1. If that inventory does not exist, every request becomes a manual search.

## Where to start

If this feels like a lot, start small and in this order:

1. Build the data inventory.
2. Turn on multi-factor authentication for email and administrative access.
3. Write the one-page breach plan and rehearse it.
4. Review which vendors can reach member data.
5. Check the safeguards above against what you actually have.

A structured gap assessment against the Act is a sensible way to turn that list into a prioritised plan. It is one of the services we offer at [Knight Labs](https://knightlabs.co.ke), but the list above is useful whoever does the work, including your own team.

*This article is a practitioner's summary, not legal advice. Read the Data Protection Act 2019 and the Office of the Data Protection Commissioner's published guidance for the authoritative position.*
