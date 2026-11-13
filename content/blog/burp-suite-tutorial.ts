import type { BlogPost } from "@/lib/blog-types";

const post: BlogPost = {
  slug: "burp-suite-tutorial",
  title: "Mastering Burp Suite: Web Application Testing Guide",
  date: "2024-12-28",
  category: "tutorial",
  tags: ["Burp Suite", "Web Security", "Tools", "Tutorial"],
  excerpt:
    "Learn how to effectively use Burp Suite for web application security testing, from basic interception to advanced scanning techniques.",
  readTime: "15 min",
  featured: false,
  content: `
## Introduction to Burp Suite

Burp Suite is the industry-standard tool for web application security testing. This guide covers essential features and techniques.

## Setting Up Your Environment

### Configuring the Proxy

1. Open Burp Suite and go to Proxy > Options
2. Ensure the proxy listener is running on 127.0.0.1:8080
3. Configure your browser to use this proxy

### Installing the CA Certificate

\`\`\`bash
# Navigate to http://burp in your browser
# Download and install the CA certificate
\`\`\`

## Key Features

### Proxy Tab

The Proxy tab allows you to intercept and modify HTTP/HTTPS traffic:

\`\`\`
Intercept > Forward/Drop requests
HTTP History > View all traffic
WebSockets > Monitor WebSocket communications
\`\`\`

### Repeater

Use Repeater to manually modify and resend requests:

1. Right-click any request > Send to Repeater
2. Modify parameters
3. Click Send to see the response

### Intruder

Intruder is powerful for automated attacks:

\`\`\`
Attack Types:
- Sniper: Single payload set
- Battering Ram: Same payload, all positions
- Pitchfork: Multiple payload sets, parallel
- Cluster Bomb: All combinations
\`\`\`

### Scanner (Professional)

The automated scanner can identify:
- SQL Injection
- XSS
- CSRF
- And many more vulnerabilities

## Best Practices

1. Always get proper authorization
2. Start with passive scanning
3. Document all findings
4. Verify automated results manually
  `,
};

export default post;
