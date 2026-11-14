/**
 * Knight Labs, as described on this site.
 *
 * Mirrors the firm's own service catalogue (Knight Labs platform,
 * src/content/catalogue.ts). Pricing is excluded by design: the firm does not
 * publish prices. If the catalogue changes there, update it here.
 */

export const SECTORS = [
  {
    key: "sacco",
    name: "SACCOs",
    headline: "Protect member savings, data and trust.",
    compliance: "SASRA prudential and ICT risk expectations, and the Data Protection Act 2019",
  },
  {
    key: "clinic",
    name: "Clinics and hospitals",
    headline: "Keep patient records private and systems running.",
    compliance: "the Data Protection Act 2019 (health data is sensitive personal data) and the Digital Health Act 2023",
  },
  {
    key: "school",
    name: "Schools",
    headline: "Safeguard learner data and keep teaching online.",
    compliance: "the Data Protection Act 2019, including its rules on processing children's data",
  },
  {
    key: "property",
    name: "Property managers",
    headline: "Secure tenant data, payments and access systems.",
    compliance: "the Data Protection Act 2019 for tenant records, CCTV and access-control data",
  },
  {
    key: "business",
    name: "Growing businesses",
    headline: "Practical security for growing Kenyan businesses.",
    compliance: "the Data Protection Act 2019 and ODPC registration duties",
  },
] as const;

export const SERVICE_LINES = [
  {
    key: "assess",
    name: "Assess",
    services: ["External attack surface review", "Security health check", "Data Protection Act gap assessment"],
    fit: "First-time buyers",
  },
  {
    key: "test",
    name: "Test",
    services: [
      "Web and mobile app pentest",
      "Network and Wi-Fi pentest",
      "Cloud and Microsoft 365 configuration review",
      "Phishing simulation",
    ],
    fit: "Firms with apps or exposed systems",
  },
  {
    key: "audit",
    name: "Audit",
    services: ["IT and systems audit", "ISO 27001 readiness", "SASRA ICT audit for SACCOs", "ODPC compliance audit"],
    fit: "Regulated sectors",
  },
  {
    key: "advise",
    name: "Advise",
    services: ["Virtual CISO", "Policy writing", "Incident response planning", "Staff awareness training"],
    fit: "Firms with no security lead",
  },
  {
    key: "respond",
    name: "Respond",
    services: ["Incident response retainer", "Breach support"],
    fit: "Firms that want a safety net",
  },
] as const;

export const TIERS = [
  { name: "Essentials", type: "Entry offer", includes: "One-off health check and a priority roadmap" },
  { name: "Professional", type: "Project", includes: "Scoped pentest or audit, report walkthrough, one retest" },
  {
    name: "Assured",
    type: "Annual retainer",
    includes: "Quarterly reviews, continuous attack surface monitoring, policy upkeep, advisory line",
  },
  { name: "Enterprise Lite", type: "Annual retainer for larger SMEs", includes: "Virtual CISO and compliance programme management" },
] as const;
