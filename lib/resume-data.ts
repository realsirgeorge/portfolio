/**
 * Resume content. Facts only: everything here comes from the CV, the previous
 * resume page, or the Knight Labs platform. Client names stay anonymised.
 */

export const EXPERIENCE: {
  title: string;
  company: string;
  program?: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
}[] = [
  {
    title: "Founder",
    company: "Knight Labs",
    location: "Nairobi, Kenya",
    // TODO(owner): add the month and year Knight Labs was founded.
    period: "Present",
    description:
      "Founded and lead a cybersecurity practice for SACCOs, clinics, schools, property managers and growing corporates, offering assessment, testing, audit, advisory and incident response. Personally review every proposal and every report.",
    achievements: [
      "Five service lines: Assess, Test, Audit, Advise and Respond",
      "Four engagement tiers, from a one-off health check to a virtual CISO retainer",
    ],
    technologies: ["Security Assessment", "Penetration Testing", "IT Audit", "Advisory", "Incident Response"],
  },
  {
    title: "Digital Platforms Assurance",
    company: "Kenya Airport Parking Services",
    location: "Nairobi, Kenya",
    period: "March 2026 – Present",
    description:
      "Own security assurance and quality engineering across the organization's digital platform estate: mobile and web penetration testing, digital QA for the KAPS App, and systems auditing on production infrastructure. Scope has expanded into secure development and IoT work.",
    achievements: [
      "Conduct mobile application penetration testing on the KAPS App, covering static analysis, runtime instrumentation, local data storage review and API-layer authorization testing",
      "Perform web application penetration testing against administrative and customer-facing platforms, focusing on access control, authentication flows and business logic abuse",
      "Own digital quality assurance for the KAPS App across release cycles, including regression testing and pre-release verification",
      "Conduct systems auditing across production infrastructure and produce findings with prioritized remediation guidance",
      "Identified and drove remediation of a client-side credential handling weakness on a production administrative platform, tracing root cause to a missing response projection layer between the API and client state",
      "Performed revenue assurance analysis across transaction records, quantifying material losses from category misclassification and isolating the primary source for management action",
      "Architected an availability monitoring platform on Cloudflare Workers and Firebase Realtime Database, using multi-state confirmation to suppress false-positive alerting across core endpoints and over thirty remote worksites",
      "Assessed an internally developed serverless platform, identified access-control rule misconfigurations, and supplied corrected rule definitions to the development team",
      "Expanded scope into secure development and IoT, including security-weighted platform evaluation for edge AI hardware deployments",
    ],
    technologies: [
      "Mobile Application Security",
      "Web Penetration Testing",
      "Systems Auditing",
      "Digital QA",
      "Serverless Security",
      "Cloudflare Workers",
      "IoT",
    ],
  },
  {
    title: "Founder and Operator",
    company: "Anga Networks",
    location: "Nairobi, Kenya",
    // TODO(owner): the PDF CV says January 2024; confirm the start month.
    period: "April 2024 – Present",
    description:
      "Own and operate an ISP running MikroTik and RouterOS infrastructure across multiple sites in Kenya, carrying real uptime obligations for paying residential and business customers. Responsible for the network, the automation layer, the commercial side, and the on-call.",
    achievements: [
      "Deployed LACP 802.3ad link aggregation across multiple interfaces for bandwidth aggregation",
      "Built an ISP management platform with n8n as the orchestration layer, the RouterOS REST API for device control, and Evolution API for WhatsApp customer notifications — nine workflows, with the activity logger shipped as an importable n8n package",
      "Chose Google Sheets as a deliberately lightweight database, right-sized to the operation rather than over-built",
      "Migrated the estate from Twingate to Tailscale, configuring MagicDNS and subnet routers for zero-trust remote access",
      "Field-deployed Starlink backhaul and wireless distribution systems across sites",
      "Reduced installation turnaround and minimized downtime through proactive monitoring and signal optimization",
    ],
    technologies: [
      "MikroTik RouterOS",
      "LACP 802.3ad",
      "n8n Orchestration",
      "Evolution API",
      "Tailscale / MagicDNS",
      "Starlink & Wireless Distribution",
    ],
  },
  {
    title: "Information Security Intern",
    company: "National Commission for Science, Technology and Innovation",
    program: "Presidential DigitaLent Program - ICT Authority",
    location: "Nairobi, Kenya",
    // TODO(owner): the PDF CV says January 2025 – December 2025; confirm which is right.
    period: "January 2025 – January 2026",
    description:
      "Monitor network uptime, system integrity, and user access logs to ensure secure and reliable IT operations. Execute hardware servicing, repairs, and network configurations to maintain optimal system performance.",
    achievements: [
      "Conduct network infrastructure assessments, hardware audits, and support firewall review planning",
      "Manage controlled penetration testing initiatives",
      "Operate and maintain audio-visual systems and other technologies during meetings",
      "Perform routine system maintenance including application troubleshooting, workstation resets, and peripheral setup",
      "Document weekly technical reports to ensure activity traceability and support management decision-making",
      "Assisted in developing organizational IT policy (AUT) and Business Process Reengineering documents",
    ],
    technologies: [
      "Network Security",
      "Penetration Testing",
      "Firewall Configuration",
      "System Administration",
      "Hardware Maintenance",
    ],
  },
  {
    title: "Quality Control Technician (Intern)",
    company: "JKUAT Industrial Park Ltd.",
    location: "Nairobi, Kenya",
    period: "July 2023 – September 2023",
    description:
      "Conducted real-time quality inspections on the Taifa Tablet assembly line, examining internal components and identifying defective parts to prevent faulty units from reaching production.",
    achievements: [
      "Performed warranty repairs and diagnostics on Taifa Tablets and IT devices",
      "Troubleshot hardware issues and restored optimal performance",
      "Supported secure data sanitization protocols for end-of-life devices",
      "Ensured compliance with organizational disposal policies",
    ],
    technologies: [
      "Hardware Diagnostics",
      "Quality Control",
      "Data Sanitization",
      "Device Repair",
    ],
  },
  {
    title: "Internal Attaché",
    company: "JKUAT ICT LABS – JKUAT Main Campus",
    location: "Nairobi, Kenya",
    period: "May 2022 – August 2022",
    description:
      "Diagnosed and resolved network infrastructure issues across campus, maintaining seamless connectivity for faculty and students.",
    achievements: [
      "Performed routine maintenance on lab hardware including workstations, switches, and routers",
      "Ensured network reliability through proactive maintenance",
      "Configured and deployed new devices according to organizational standards and security requirements",
      "Troubleshot workstation issues and provided timely technical support",
      "Contributed to reduced system downtime",
    ],
    technologies: [
      "Network Infrastructure",
      "Cisco Equipment",
      "System Configuration",
      "Technical Support",
    ],
  },
];

export const EDUCATION = [
  {
    degree: "B.Sc. Computer Technology",
    institution: "Jomo Kenyatta University of Agriculture and Technology (JKUAT)",
    period: "2020 – 2024",
    details: "Graduated with Second Class Upper Division",
  },
];

export const RESUME_PROGRAMS = [
  {
    name: "Cyber Shujaa",
    org: "Serianu, USIU-Africa & Microsoft ADC",
    detail:
      "Cybersecurity skilling program — completed the Security Engineer track alongside the Microsoft Africa Development Center.",
  },
  {
    name: "ICT Authority Smart Academy",
    org: "Government of Kenya — ICT Authority",
    detail:
      "Digital and cybersecurity skills under the Training 20 Million Citizens initiative: information security, cyber resilience, and digital-risk fundamentals.",
  },
  {
    name: "Huawei ICT Academy",
    org: "Huawei",
    detail:
      "Datacom networking training leading to HCIA-Datacom — routing, switching, and enterprise network fundamentals.",
  },
  {
    name: "Cisco Networking Academy",
    org: "Cisco NetAcad",
    detail:
      "Source of the Cisco track: CCNA, CyberOps Associate, Network Defence, and Endpoint Security.",
  },
];

export const CERTIFICATIONS = [
  {
    name: "CC",
    fullName: "Certified in Cybersecurity",
    issuer: "ISC²",
    year: "2024",
  },
  {
    name: "SC-900",
    fullName: "Security, Compliance, and Identity Fundamentals",
    issuer: "Microsoft",
    year: "2024",
  },
  {
    name: "Security Engineer",
    fullName: "Cyber Shujaa Security Engineer",
    issuer: "Cyber Shujaa & Microsoft Africa Development Center",
    year: "2024",
  },
  {
    name: "HCIA",
    fullName: "Huawei Certified ICT Associate - Datacom",
    issuer: "Huawei ICT Academy",
    year: "2024",
  },
  {
    name: "CyberOps",
    fullName: "CyberOps Associate",
    issuer: "Cisco Networking Academy",
    year: "2024",
  },
  {
    name: "CCNA - Completion",
    fullName: "Cisco Certified Network Associate",
    issuer: "Cisco Networking Academy",
    year: "2024",
  },
  {
    name: "Endpoint Security",
    fullName: "Endpoint Security Specialist",
    issuer: "Cisco Networking Academy",
    year: "2025",
  },
  {
    name: "Network Defence",
    fullName: "Network Defence Specialist",
    issuer: "Cisco Networking Academy",
    year: "2025",
  },
];
