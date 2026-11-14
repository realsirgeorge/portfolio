/**
 * Single source of truth for portfolio content.
 *
 * DISCLOSURE RULE: client identities are anonymized by contract. Never
 * reintroduce client names, hostnames, or engagement reference numbers for
 * NDA work, even if they appear elsewhere in this repository. Where a case
 * study feels thin, add technical depth — not attribution.
 *
 * The one exception is the Blazin Ice build, which is named with permission
 * and carries its contract reference openly.
 */

export type Severity = "critical" | "high" | "medium" | "low";

export type EngagementKind = "audit" | "research" | "build" | "operations";

export interface Figure {
  /** The number itself, pre-formatted. */
  value: string;
  /** What the number counts. */
  label: string;
  /** Severity tint — reserved for finding counts only. */
  tone?: Severity;
}

export interface Section {
  heading: string;
  body?: string;
  items?: string[];
}

export interface Engagement {
  slug: string;
  title: string;
  kind: EngagementKind;
  /** Anonymized descriptor, never a name. */
  client: string;
  /** One line, used on the index. */
  summary: string;
  /** Opening paragraph on the detail page. */
  standfirst: string;
  authorization?: string;
  figures: Figure[];
  findings?: Record<Severity, number>;
  sections: Section[];
  stack: string[];
  /** Shown on the index as the reason this engagement is on the site. */
  whyItMatters: string;
  external?: { href: string; label: string };
  featured?: boolean;
}

export const PROFILE = {
  name: "George Wanyoike Njoroge",
  alias: "Sir G",
  location: "Nairobi, Kenya",
  // TODO(owner): confirm george@knight-labs.co is still a live mailbox. The firm's
  // published domain is knightlabs.co.ke; the site now shows emailAlt for
  // personal contact and routes business mail to hello@knightlabs.co.ke.
  email: "george@knight-labs.co",
  emailAlt: "realsirgeorge@gmail.com",
  phone: "+254 707 853 938",
  linkedin: "https://www.linkedin.com/in/george-wanyoike/",
  github: "https://github.com/realsirgeorge/",
  anga: "https://realsirgeorge.github.io/anga-networks-website/",
  thesis: "I build the systems I break.",
  /** The landing page's opening statement, from the brief. */
  statement:
    "I audit learning institutions and run an ISP. I find the IDORs, then I write the authorization layer that closes them. I break the edge device, then I specify the one that replaces it. The lab where I do offensive work is separated from the lab that publishes it by an airlock I built myself.",
} as const;

export const ROLES = [
  {
    title: "Founder",
    org: "Knight Labs",
    detail:
      "A Nairobi cybersecurity practice for SACCOs, clinics, schools, property managers and growing corporates. Assessment, testing, audit, advisory and incident response, with every proposal and report reviewed personally.",
    href: "/knight-labs",
  },
  {
    title: "Digital Platforms Assurance",
    org: "National airport parking services operator",
    detail:
      "Owns digital QA for the mobile application, runs mobile and web penetration testing across the organization's platforms, and audits production infrastructure. Scope has recently widened into development and IoT work.",
  },
  {
    title: "Founder and Operator",
    org: "Anga Networks",
    detail:
      "An ISP running MikroTik and RouterOS infrastructure across multiple sites in Kenya. Owned and operated, with real uptime obligations to paying customers.",
    href: PROFILE.anga,
  },
  {
    title: "Chief Security Officer, independent",
    org: "Authorized testing and bug bounty research",
    detail:
      "Runs penetration tests, bug bounty research, and security audits under signed agreements, partnering with Spookie Labs Inc. on selected engagements.",
  },
] as const;

/** Training academies and skilling programs (mod 7). */
export const PROGRAMS = [
  {
    name: "Cyber Shujaa",
    org: "Serianu, USIU-Africa & Microsoft ADC",
    detail:
      "A Kenyan cybersecurity skilling program that trained me on the Security Engineer track, alongside the Microsoft Africa Development Center.",
  },
  {
    name: "ICT Authority Smart Academy",
    org: "Government of Kenya — ICT Authority",
    detail:
      "The government's digital and cybersecurity skills program under the Training 20 Million Citizens initiative, covering information security, cyber resilience, and digital-risk fundamentals.",
  },
  {
    name: "Huawei ICT Academy",
    org: "Huawei",
    detail:
      "Datacom networking training that led to the HCIA-Datacom certification — routing, switching, and enterprise network fundamentals.",
  },
  {
    name: "Cisco Networking Academy",
    org: "Cisco NetAcad",
    detail:
      "Where my Cisco track came from: CCNA, CyberOps Associate, Network Defence, and Endpoint Security.",
  },
] as const;

/** The three backed claims on the landing page. Each one links to its evidence. */
export const PROOF_POINTS = [
  {
    value: "34",
    unit: "findings",
    qualifier: "11 of them critical",
    claim: "A full-scope security audit of a learning institution, run under NDA.",
    href: "/work/university-security-audit",
  },
  {
    value: "1",
    unit: "ISP",
    qualifier: "owned and operated",
    claim:
      "Automated provisioning and zero-trust remote access across multiple Kenyan sites.",
    href: "/work/anga-networks",
  },
  {
    value: "1,701",
    unit: "lines",
    qualifier: "of engagement methodology",
    claim: "The process I run, encoded as a machine-executable reference.",
    href: "/library",
  },
] as const;

export const ENGAGEMENTS: Engagement[] = [
  {
    slug: "university-security-audit",
    title: "Full-scope security audit of a learning institution",
    kind: "audit",
    client: "A learning institution in Kenya",
    summary:
      "Seven in-scope subdomains, a perimeter firewall deep-dive, legacy binary analysis, and staff interviews.",
    standfirst:
      "The critical findings clustered around missing authorization rather than exotic vulnerabilities. That is the typical shape of a real audit, and it is worth saying out loud: the university was not undone by a novel exploit chain, it was undone by endpoints that never asked who was calling.",
    authorization:
      "Signed SLA and NDA. Authorized by system owners and school administration. Non-destructive rules of engagement throughout.",
    figures: [
      { value: "34", label: "findings, web and infrastructure" },
      { value: "11", label: "critical", tone: "critical" },
      { value: "16", label: "high", tone: "high" },
      { value: "14", label: "subdomains enumerated in recon" },
      { value: "66", label: "items in the preliminary inventory" },
    ],
    findings: { critical: 11, high: 16, medium: 5, low: 2 },
    sections: [
      {
        heading: "Scope came out of recon, not the other way round",
        body:
          "Reconnaissance went deliberately wider than the eventual test scope: fourteen subdomains surveyed and a 66-item preliminary inventory built before any deep-dive work began. I then triaged that inventory down to seven in-scope targets covering the public site, student portal, digital services, library system, examinations platform, e-learning platform, and an admissions system that recon itself surfaced. Broad passive enumeration first, then triage into a testable scope, rather than diving at the first interesting host.",
      },
      {
        heading: "Web application layer",
        items: [
          "An IDOR on admission letter downloads. The document identifier in the request path was predictable and never validated against the requesting session, exposing enumerable student PII at scale.",
          "A login endpoint that accepted default credentials.",
          "A medical records search interface reachable without authentication.",
          "Payment receipts accessible without authentication.",
          "Web conferencing boardrooms publicly linked and joinable.",
          "A service exposed over plain HTTP on a non-standard port.",
        ],
        body:
          "A five-step attack chain was confirmed against the digital services subdomain, chaining individually moderate issues into a materially worse outcome. CVE research was carried out against the specific Moodle and Laravel versions in use, rather than assuming a version implies a vulnerability.",
      },
      {
        heading: "Perimeter firewall deep-dive",
        body:
          "A separate 21-finding assessment of the perimeter firewall appliance produced the most serious infrastructure issues. The segmentation finding is the instructive one: a governance failure expressed as a network topology, and more consequential than any single CVE on the list.",
        items: [
          "CVE-2024-21762 (CVSS 9.6) present on the SSL-VPN component, running on vulnerable firmware.",
          "Both administrative accounts lacking two-factor authentication.",
          "Roughly 420 unauthenticated DHCP clients on the network.",
          "A flat, unsegmented network spanning medical, financial, and surveillance segments. One compromised host meant lateral reach into all three.",
        ],
      },
      {
        heading: "Legacy application analysis",
        body:
          "Static and dynamic analysis of a legacy ERP binary, started under Wine on Linux and finished on a purpose-built Windows VM where the compatibility layer fell short of completing SQL injection testing and access control verification. No source, no reachable vendor, and a binary that production depends on.",
      },
      {
        heading: "The human layer",
        body:
          "Structured interviews with network administration staff surfaced what no scanner would have found. The interview is a technical control, not a soft formality.",
        items: [
          "Physical network access available through unmanaged trunk ports.",
          "A consumer-grade router with shared credentials serving a department.",
          "No VPN in general use.",
          "Firewall configuration backups stored ad-hoc on consumer cloud storage.",
        ],
      },
      {
        heading: "Disclosure handling",
        body:
          "Critical PII exposures were reported to the institution immediately on discovery, ahead of the final report. Breaking the reporting rhythm when a finding warrants it is part of the job, not an exception to it.",
      },
    ],
    stack: [
      "Burp Suite",
      "Nmap",
      "CVSS 4.0",
      "Moodle",
      "Laravel",
      "Wine",
      "KVM/libvirt",
    ],
    whyItMatters:
      "My strongest single artifact. Full lifecycle, under NDA, with disclosure decisions I made in real time.",
    featured: true,
  },
  {
    slug: "client-side-credential-exposure",
    title: "Client-side credential exposure in a production admin platform",
    kind: "audit",
    client: "A national transport services operator",
    summary:
      "A state management library's persistence middleware was writing live credentials to browser storage.",
    standfirst:
      "A production administrative platform was persisting a live Firebase JWT, mobile money API credentials, and plaintext passwords into browser localStorage. No developer ever wrote a line of code to put secrets there.",
    figures: [
      { value: "CWE-522", label: "insufficiently protected credentials" },
      { value: "API3:2023", label: "OWASP broken object property level authz" },
    ],
    sections: [
      {
        heading: "Root cause",
        body:
          "There was no DTO or field-projection layer between the backend response and the client store. The API returned full record objects, the frontend hydrated its store with them, and the persistence middleware faithfully serialized the store to disk. Three individually reasonable decisions producing one serious exposure.",
      },
      {
        heading: "Why this is a class of bug, not a one-off",
        body:
          "Any stack that combines an ORM returning full models, an API without response shaping, and a persisted client store has the same exposure latent in it. The fix is architectural — introduce projection at the API boundary — not a patch applied to the storage call.",
      },
    ],
    stack: ["Firebase", "JWT", "Redux-style persistence", "OWASP API Top 10"],
    whyItMatters:
      "A reusable pattern finding. The interesting part is the middleware, not the client.",
    featured: true,
  },
  {
    slug: "firestore-rules-assessment",
    title: "Serverless Firestore misconfiguration assessment",
    kind: "audit",
    client: "An internal platform",
    summary:
      "Open collections, an unauthenticated admin dashboard, and rules that looked correct.",
    standfirst:
      "A penetration test of a Firebase-hosted internal platform surfaced open Firestore collections and an administrative dashboard reachable without authentication. The detail worth the whole writeup was subtler: allow list had been used where allow read was meant.",
    figures: [
      { value: "3", label: "classes of exposure confirmed" },
    ],
    sections: [
      {
        heading: "The rule that reads correctly and isn't",
        body:
          "The distinction between list and read permissions in Firestore rules is subtle enough that a ruleset can pass a casual review, behave correctly on the common path, and still permit direct document access the author believed was blocked. Rules are code, and they need the same adversarial reading as the application they protect.",
      },
      {
        heading: "Also found",
        items: [
          "Firestore collections readable without authentication.",
          "An administrative dashboard reachable without authentication.",
          "Incomplete security rules across several collection paths.",
        ],
      },
    ],
    stack: ["Firebase", "Firestore security rules", "Cloud Functions"],
    whyItMatters:
      "Serverless shifts the authorization boundary into a rules file. Most reviews still do not read it adversarially.",
  },
  {
    slug: "revenue-loss-analysis",
    title: "Revenue loss analysis through operational data",
    kind: "research",
    client: "Transport and parking operations",
    summary:
      "Vehicle category misclassification traced to a money figure a board could act on.",
    standfirst:
      "Not every security finding arrives through an exploit. Analysis across vehicle plate records identified a substantial revenue loss driven by category misclassification, reached entirely through data analysis.",
    figures: [
      { value: "KES 8.28M", label: "estimated revenue loss identified" },
      { value: "297+", label: "vehicle plate records analysed" },
      { value: "73%", label: "of the loss from a single submitter group" },
    ],
    sections: [
      {
        heading: "What the analysis found",
        body:
          "Vehicle category misclassification was the primary driver, and the loss was heavily concentrated: roughly 73 percent of the identified total traced back to one submitter group. Concentration like that changes the remediation from a systems problem into a controls-and-oversight problem.",
      },
      {
        heading: "Why it belongs in a security portfolio",
        body:
          "Assurance work that produces a financial finding is often more persuasive inside an organization than a CVSS 9.8, because it arrives in the unit the board already uses. Practitioners undersell this capability, and it is a real one.",
      },
    ],
    stack: ["Data analysis", "Operational auditing", "Controls review"],
    whyItMatters:
      "Breaks the stereotype that security work is only technical. I reached this one without exploitation.",
    featured: true,
  },
  {
    slug: "availability-monitoring",
    title: "Availability monitoring that does not cry wolf",
    kind: "build",
    client: "A multi-site platform",
    summary:
      "The same monitoring problem shipped twice, at radically different complexity levels.",
    standfirst:
      "A monitoring system people mute is worse than no monitoring at all. Both builds here are organized around one decision: a four-state machine instead of an up/down binary.",
    figures: [
      { value: "4", label: "states, not two" },
      { value: "30+", label: "Tier 2 worksites covered" },
      { value: "2", label: "implementations of one design" },
    ],
    sections: [
      {
        heading: "The state machine is the whole design",
        body:
          "HEALTHY, CONFIRMING_DOWN, DOWN, CONFIRMING_UP. The two confirming states exist purely to absorb transient failures before an alert fires. They are the difference between a monitoring system people trust and one they filter into a folder they never open.",
      },
      {
        heading: "The serverless build",
        body:
          "Cloudflare Workers with Firebase Realtime Database as the state store, covering Tier 1 core endpoints and more than thirty Tier 2 worksites.",
      },
      {
        heading: "The systemd build",
        body:
          "The same concept as a single-file Bash systemd service: parallel ping sweeps, JSON reported over HTTP on port 9000, and the speedtest worker decoupled so a slow bandwidth check never blocks liveness reporting.",
      },
      {
        heading: "What shipping it twice taught",
        body:
          "Building the same system at two very different weights is the fastest way to find out what it actually needs. The serverless version buys global vantage points and managed state. The Bash version proves how much of the rest was never load-bearing.",
      },
    ],
    stack: [
      "Cloudflare Workers",
      "Firebase RTDB",
      "Bash",
      "systemd",
      "JSON over HTTP",
    ],
    whyItMatters:
      "The build half of the thesis. Answers a finding with an operational system.",
  },
  {
    slug: "bug-bounty-research",
    title: "Bug bounty and independent research",
    kind: "research",
    client: "Public programs and self-directed work",
    summary:
      "Authorization flaws, passive-only findings, static source review, and CTF work.",
    standfirst:
      "Ongoing independent research across public bug bounty programs and self-directed review. Findings below are described by class, not by target.",
    figures: [
      { value: "10", label: "findings in one static source review" },
      { value: "3", label: "active platforms in rotation" },
    ],
    sections: [
      {
        heading: "Major online travel platform, via HackerOne",
        body:
          "Identified a BOLA/IDOR candidate on a cart identifier parameter and a passwordless authentication flow flagged as an account takeover candidate. Produced a structured recon summary and a continuity brief so the engagement could be resumed cleanly later. Writing handoff documentation for your future self is an underrated part of the methodology.",
      },
      {
        heading: "Regional mobility startup, passive reconnaissance only",
        body:
          "Cloudflare infrastructure mapping, certificate transparency log analysis, and identification of an email spoofing exposure caused by a missing MX record. A real finding produced without sending a single packet to the target.",
      },
      {
        heading: "Authentication template, static source review",
        body:
          "Ten findings, including a trust proxy misconfiguration, use of a non-cryptographic RNG for backup code generation, and token storage in localStorage. The RNG finding is the one that generalizes: random enough is not a security property.",
      },
      {
        heading: "Capture the flag",
        body:
          "A session hijacking challenge solved through a debug endpoint that leaked administrator session identifiers, confirmed by manual cookie manipulation. Debug endpoints surviving into production are a vulnerability class, not an accident. Active on Hack The Box, TryHackMe, and picoCTF.",
      },
    ],
    stack: ["HackerOne", "Burp Suite", "crt.sh", "Semgrep", "DNS tooling"],
    whyItMatters:
      "Continuous practice against targets that did not agree to be easy.",
  },
  {
    slug: "anga-networks",
    title: "Anga Networks",
    kind: "operations",
    client: "Owned and operated",
    summary:
      "An ISP on MikroTik and RouterOS across multiple Kenyan sites, with an automation layer built for it.",
    standfirst:
      "Running an ISP while doing security work means every security opinion has been paid for operationally. This is a business with paying customers and real uptime obligations, not a lab.",
    figures: [
      { value: "9", label: "workflows in the automation architecture" },
      { value: "802.3ad", label: "LACP link aggregation in production" },
    ],
    sections: [
      {
        heading: "Network engineering",
        body:
          "LACP 802.3ad link aggregation across multiple interfaces for bandwidth aggregation, plus field deployment of Starlink and wireless distribution systems across sites.",
      },
      {
        heading: "Operational automation",
        body:
          "A purpose-built ISP management platform with n8n as the orchestration layer, the RouterOS REST API for device control, Evolution API for WhatsApp customer notifications, and Google Sheets as a deliberately lightweight database. Nine workflows in the architecture, with the activity logger shipped as an importable n8n package.",
      },
      {
        heading: "Choosing Sheets over a real database",
        body:
          "A defensible call at this scale, and a deliberate one. Right-sizing infrastructure to the operation you actually have beats cargo-culting the architecture of a company a hundred times your size.",
      },
      {
        heading: "Secure remote access",
        body:
          "Migrated the estate from Twingate to Tailscale, with MagicDNS and subnet router configuration. A zero-trust overlay network sized for an operator who cannot justify enterprise tooling.",
      },
    ],
    stack: [
      "MikroTik RouterOS",
      "n8n",
      "Evolution API",
      "Tailscale",
      "Starlink",
      "LACP 802.3ad",
    ],
    whyItMatters:
      "My strongest answer to the charge that security people do not run production. I carry the pager for it.",
    external: { href: PROFILE.anga, label: "Anga Networks website" },
    featured: true,
  },
  {
    slug: "edge-ai-security",
    title: "Edge AI without the trust boundary fantasy",
    kind: "research",
    client: "IoT deployment evaluation",
    summary:
      "A comparative evaluation of edge AI compute platforms, extended into a security thesis.",
    standfirst:
      "Edge AI devices are unattended compute in physically hostile environments, and almost all of the deployment guidance ignores that. The hardware comparison is the foundation; the threat model is the point.",
    figures: [
      { value: "11", label: "pages of comparative platform evaluation" },
      { value: "5", label: "security criteria added to the scoring" },
    ],
    sections: [
      {
        heading: "The evaluation",
        body:
          "A formal comparative evaluation of edge AI compute platforms as alternatives to the NVIDIA Jetson Orin Nano, covering Rockchip RK3588-based boards, Raspberry Pi CM4/CM5, Hailo-8 accelerators, and industrial-tier system-on-modules from vendors including Toradex and Nodka. Scored across inference performance, thermal behaviour, power draw, industrial availability, and vendor support lifecycle.",
      },
      {
        heading: "Model theft at the edge",
        body:
          "A deployed inference device carries the model weights. Physical access to the board is access to the intellectual property. Secure boot and encrypted storage are the controls, and platforms differ sharply between what they offer and what they claim.",
      },
      {
        heading: "Accelerator supply chain trust",
        body:
          "Choosing between NPU vendors is also choosing whose closed firmware blob runs on your network. The useful evaluation criterion is what a platform lets you verify.",
      },
      {
        heading: "The unattended device threat model",
        body:
          "Parking lots, roadsides, remote sites. Tamper detection, exposed UART, JTAG and USB ports, and the question every deployment eventually faces: what happens when someone walks off with the enclosure.",
      },
      {
        heading: "The inference pipeline is attack surface",
        body:
          "Adversarial input against camera-fed models in the field. The sensor is an untrusted input channel like any other, and it is rarely treated as one.",
      },
    ],
    stack: [
      "Rockchip RK3588",
      "Raspberry Pi CM4/CM5",
      "Hailo-8",
      "NVIDIA Jetson",
      "ESP32",
      "Secure boot",
    ],
    whyItMatters:
      "Where my security practice, IoT work, and hardware evaluation meet. A genuinely underserved niche locally.",
  },
  {
    slug: "restaurant-assessment",
    title: "Security assessment of a restaurant's digital estate",
    kind: "audit",
    client: "A restaurant business",
    summary:
      "Website and online ordering, payment handling, and the network the till sits on — assessed as one connected surface.",
    standfirst:
      "Small hospitality businesses run more attack surface than they realize. This engagement looked at three surfaces a restaurant actually depends on, and at how they connect: the public site and its online ordering flow, the payment path, and the network that carries both.",
    figures: [
      { value: "3", label: "surfaces assessed as one system" },
      { value: "POS", label: "and mobile-money payment path reviewed" },
      { value: "1", label: "guest and till network, examined for shared trust" },
    ],
    sections: [
      {
        heading: "Website and online ordering",
        body:
          "The public site and its ordering flow are where a restaurant meets the internet, and where customer contact details and order data live. I reviewed the ordering path for the usual web weaknesses — authorization on order and account objects, input handling, and how session state is kept — because an ordering flow is a small e-commerce app whether or not anyone treats it as one.",
      },
      {
        heading: "Payment handling — card and mobile money",
        body:
          "Kenyan hospitality runs on mobile money as much as on cards, and both paths deserve the same scrutiny. The question I care about is where payment credentials and transaction data travel, what is stored versus passed through, and whether the integration leaks anything a customer or a passer-by on the same network could pick up.",
      },
      {
        heading: "The network the till sits on",
        body:
          "The most common restaurant finding is not a web bug at all: it is a flat network where the guest WiFi, the point-of-sale till, and the back office all share one segment and often one router password. One guest device should never be able to reach the till. Segmentation is the control, and it is usually the cheapest thing to fix and the most consequential to leave alone.",
      },
      {
        heading: "Why a small business is worth doing properly",
        body:
          "A restaurant is not a low-stakes target. It handles payment data, it holds customer contacts, and it runs on consumer-grade equipment installed by whoever was cheapest. The engagement was scoped to the surfaces that carry real risk rather than to a generic checklist, and reported in language the owner could act on without a security team to translate it.",
      },
    ],
    stack: [
      "Web application testing",
      "Payment / mobile-money review",
      "Network segmentation",
      "Guest WiFi",
      "Point of sale",
    ],
    whyItMatters:
      "Security work sized for a small business, not scaled down from an enterprise checklist. The value is in picking the three surfaces that matter.",
  },
  {
    slug: "blazin-ice",
    title: "Blazin Ice",
    kind: "build",
    client: "Synthetic ice facility",
    summary:
      "A full-stack commercial web build, delivered on a milestone schedule, built with a pentester's defaults.",
    standfirst:
      "A full-stack build for a synthetic ice facility under contract BLZ-WEB-2026-001. It is on this site because a findings list alone leaves an obvious question unanswered: can I build the thing I keep breaking.",
    figures: [
      { value: "11", label: "pages in the delivered site structure" },
      { value: "40/30/30", label: "milestone payment schedule" },
    ],
    sections: [
      {
        heading: "What was built",
        body:
          "A React frontend on a Node.js backend with MySQL, delivered across an eleven-page site structure under a formal contract with a defined scope and a staged payment schedule.",
      },
      {
        heading: "Security decisions made during an ordinary build",
        body:
          "A developer who spends the week finding IDORs in other people's applications writes authorization checks differently. Input handling, session management, credential storage, and dependency posture were deliberate decisions here rather than framework defaults — and each one cost minutes during the build rather than weeks during an incident.",
      },
      {
        heading: "The commercial side",
        body:
          "Scoping, contracting, staged delivery, and getting paid. Most technical portfolios are silent on this, and it is exactly what matters for senior or independent work.",
      },
      {
        heading: "What would be done differently",
        body:
          "The milestone structure tracked pages delivered rather than capability delivered, which front-loaded visible progress and pushed integration work into the final third. Scoping the next one by capability would smooth that out and give the client a more honest read on progress.",
      },
    ],
    stack: ["React", "Node.js", "MySQL"],
    whyItMatters:
      "Proof I ship production software and run engagements commercially, not just proof-of-concept code.",
  },
];

export function getEngagement(slug: string): Engagement | undefined {
  return ENGAGEMENTS.find((e) => e.slug === slug);
}

export const KIND_LABEL: Record<EngagementKind, string> = {
  audit: "Security audit",
  research: "Research",
  build: "Build",
  operations: "Operations",
};
