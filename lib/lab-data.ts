/**
 * The Lab (infrastructure) and The Library (tooling) content.
 * Kept separate from engagement data because these are showcase pages,
 * not case studies.
 */

export interface LabComponent {
  id: string;
  name: string;
  zone: "orchestration" | "offensive" | "boundary" | "public" | "host";
  role: string;
  detail: string;
}

export const LAB_THESIS =
  "A hard boundary between where offensive work happens and where anything public-facing lives. Every component in this architecture exists to serve or enforce that separation.";

export const LAB_COMPONENTS: LabComponent[] = [
  {
    id: "hermes",
    name: "Hermes",
    zone: "orchestration",
    role: "Orchestration layer",
    detail:
      "A top-level orchestrator with Claude Code running beneath it as a gated execution tool. It answers the question everyone running AI agents against real infrastructure eventually hits: how do you give an agent enough capability to be useful without giving it unreviewed execution against production. The answer is to separate orchestration and authority from execution, and put a gate between them. Provider evaluation was part of the build, including OpenRouter's free tier and Kimi K2.6 assessed for multi-agent orchestration workloads.",
  },
  {
    id: "kali",
    name: "Kali attack VM",
    zone: "offensive",
    role: "The offensive zone",
    detail:
      "A Kali Linux virtual machine on KVM/libvirt. Isolated, purpose-built, and treated as contaminated by default. Nothing leaves it except through the airlock.",
  },
  {
    id: "windows-vm",
    name: "Windows analysis VMs",
    zone: "offensive",
    role: "Binary analysis",
    detail:
      "Purpose-built Windows virtual machines for legacy binary analysis, spun up when a compatibility layer falls short of completing the test.",
  },
  {
    id: "airlock",
    name: "The git airlock",
    zone: "boundary",
    role: "One-directional boundary",
    detail:
      "Content flows out of the private working zone into the public zone. Never back. This is the enforcement mechanism for the entire thesis, and the most distinctive single design decision in the setup. Anyone can list hardware; the boundary is the part worth explaining.",
  },
  {
    id: "hugo",
    name: "Hugo publishing layer",
    zone: "public",
    role: "Blog and reference library",
    detail:
      "Two Hugo static sites — a blog and a reference library — publishing through a custom hugo-mcp integration, so publishing is an agent-addressable operation rather than a manual build step.",
  },
  {
    id: "host",
    name: "Ubuntu host",
    zone: "host",
    role: "Services and remote access",
    detail:
      "Runs n8n, Evolution API, and Hermes. Reachable remotely over Tailscale with MagicDNS and subnet routing.",
  },
  {
    id: "hypervisor",
    name: "KVM/libvirt",
    zone: "host",
    role: "Virtualization",
    detail:
      "The hypervisor beneath the offensive zone. ESP32 development work for IoT prototyping sits alongside it on the bench.",
  },
];

export const LAB_DISCIPLINE = [
  {
    heading: "Encryption is a default, not a hardening step",
    body: "Full-disk and partition encryption is the baseline for any storage that touches engagement data. It is not something added when a job starts to look sensitive.",
  },
  {
    heading: "Recovery: rebuilding a destroyed EFI System Partition",
    body: "A Kali installation was recovered after its EFI System Partition was destroyed. Rebuilding the ESP, reinstalling GRUB, migrating /home to a 324GB partition, and recovering a root filesystem that had hit 100 percent capacity. Recovery stories show depth that clean architecture diagrams cannot, and they are honest about the fact that things break.",
  },
];

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
