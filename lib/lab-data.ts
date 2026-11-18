/**
 * The Library (tooling and standards) content.
 * Kept separate from engagement data because these are showcase pages,
 * not case studies.
 */

export interface Tool {
  name: string;
  scale: string;
  summary: string;
  detail: string;
}

export const LIBRARY_TOOLS: Tool[] = [
  {
    name: "csosec",
    scale: "1,701 lines across 5 files",
    summary: "Security operations, from scoping through reporting.",
    detail:
      "The full engagement lifecycle encoded as a machine-executable reference. Incorporates CVSS 4.0 scoring, CodeQL MRVA for variant analysis at scale, Semgrep for static analysis, and YARA-X. This is the methodology I actually run, written down in a form an agent can execute.",
  },
  {
    name: "scripter",
    scale: "667 lines",
    summary: "Bash and Python security scripting patterns.",
    detail:
      "The recurring shapes of automation in security work — recon pipelines, payload handling, log parsing, and the glue between them — captured once so they are not rewritten per engagement.",
  },
  {
    name: "agent-forge",
    scale: "Generator",
    summary: "Generates Claude Code subagent definitions on demand.",
    detail:
      "Produces subagent definition files with least-privilege tool access, including security gate logic for agents that will operate against live servers. Directly complements the Hermes architecture in the lab.",
  },
];

export const TOOLCHAIN: { group: string; tools: { name: string; use: string }[] }[] = [
  {
    group: "Offensive",
    tools: [
      { name: "Burp Suite", use: "Web and API testing, driven over MCP" },
      { name: "Nmap", use: "Service discovery and version enumeration" },
      { name: "Kali Linux", use: "The isolated attack platform" },
      { name: "CVSS 4.0", use: "Severity scoring on every finding" },
    ],
  },
  {
    group: "Static and variant analysis",
    tools: [
      { name: "Semgrep", use: "Static analysis across source trees" },
      { name: "CodeQL MRVA", use: "Variant analysis at scale" },
      { name: "YARA-X", use: "Pattern matching for malware and artifacts" },
    ],
  },
  {
    group: "Build and operate",
    tools: [
      { name: "n8n", use: "Workflow orchestration for the ISP platform" },
      { name: "Evolution API", use: "WhatsApp customer notifications" },
      { name: "MikroTik RouterOS", use: "ISP device control via REST API" },
      { name: "Tailscale", use: "Zero-trust overlay with MagicDNS" },
      { name: "KVM/libvirt", use: "Hypervisor for the lab" },
      { name: "Hugo", use: "Static publishing, agent-addressable" },
    ],
  },
];

export const STANDARDS = [
  "All security engagements operate under signed NDAs and within applicable law.",
  "Non-destructive rules of engagement by default.",
  "Immediate escalation on critical PII exposure, rather than waiting for the report cycle.",
  "Client identities stay out of public writeups. Where a case study needs weight, it gets technical depth instead of attribution.",
];
