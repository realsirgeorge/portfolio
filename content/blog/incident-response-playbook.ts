import type { BlogPost } from "@/lib/blog-types";

const post: BlogPost = {
  slug: "incident-response-playbook",
  title: "Building an Effective Incident Response Playbook",
  date: "2024-12-15",
  category: "security",
  tags: ["Incident Response", "Security Operations", "Playbook", "DFIR"],
  excerpt:
    "Step-by-step guide to creating and maintaining incident response playbooks for common security scenarios in your SOC.",
  readTime: "14 min",
  featured: true,
  content: `
## Introduction

An incident response playbook provides standardized procedures for handling security incidents. Well-designed playbooks reduce response time and ensure consistent handling.

## Playbook Structure

### 1. Incident Classification

\`\`\`yaml
severity_levels:
  critical: "Business-critical systems compromised"
  high: "Significant impact, sensitive data at risk"
  medium: "Limited impact, no data breach"
  low: "Minimal impact, easily contained"
\`\`\`

### 2. Response Phases

**Detection & Analysis**
- Validate the alert
- Determine scope and impact
- Classify the incident

**Containment**
- Short-term: Isolate affected systems
- Long-term: Apply patches, change credentials

**Eradication**
- Remove malware
- Close attack vectors
- Verify system integrity

**Recovery**
- Restore systems from clean backups
- Monitor for re-infection
- Return to normal operations

**Lessons Learned**
- Document timeline
- Identify improvements
- Update playbooks

## Sample Playbook: Ransomware

\`\`\`markdown
## Ransomware Response

### Immediate Actions (0-15 minutes)
1. Isolate affected systems from network
2. Preserve evidence (memory dump, disk image)
3. Notify incident response team

### Investigation (15-60 minutes)
1. Identify ransomware variant
2. Determine initial access vector
3. Scope the infection

### Containment
1. Block C2 communications
2. Reset compromised credentials
3. Scan for indicators of compromise
\`\`\`

## Key Metrics to Track

- Mean Time to Detect (MTTD)
- Mean Time to Respond (MTTR)
- Incidents by category
- False positive rate
  `,
};

export default post;
