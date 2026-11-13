# 🛡️ George Wanyoike Njoroge — Portfolio & Blog

A modern, secure portfolio and blog platform built with Next.js 16, featuring an admin panel for content management, markdown-based blog posts, and comprehensive security implementations.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=flat-square&logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)

## ✨ Features

### 🎨 Portfolio Showcase
- **Landing** — the overlap thesis plus an evidence ledger: three sourced
  figures, each linking to the engagement that produced it
- **`/work`** — engagement index and per-engagement case studies, generated
  from `lib/portfolio-data.ts`, grouped by audit / research / build / operations
- **`/infrastructure`** — "The Lab", with an inline SVG architecture diagram
  centred on the one-directional git airlock
- **`/library`** — built tooling (`csosec`, `scripter`, `agent-forge`),
  working toolchain, and engagement standards
- **`/about`** — background, capabilities, certifications, contact
- **`/resume`** — full CV with PDF download
- **Dark/Light Theme** with a shared token system in `app/globals.css`

> **Content rule.** Client identities are anonymized by contract. Never
> reintroduce client names, hostnames, or engagement reference numbers into
> public pages, even if they appear elsewhere in this repository. Where a case
> study feels thin, add technical depth — not attribution. See the header
> comment in `lib/portfolio-data.ts`.

### 🧱 Content Architecture
- `lib/portfolio-data.ts` — engagements, proof points, roles, profile
- `lib/lab-data.ts` — lab components, tooling, toolchain, standards
- Pages read from these modules; there is no per-page content duplication
- `/projects` and `/skills` are permanently redirected to `/work` and `/about`

### 📝 Blog System
- **Dual Format Support**: TypeScript and Markdown blog posts
- **Markdown Features**: YAML frontmatter, GitHub Flavored Markdown (GFM)
- **Pagination**: Configurable posts per page with URL state management
- **Filtering**: By category, tags, and featured posts
- **Related Posts**: Automatic suggestions based on tags
- **Reading Time**: Automatic calculation
- **SEO Optimized**: Meta tags, Open Graph, structured data

### 🔐 Admin Panel
- **Secure Authentication**: Password-based with HTTP-only cookies
- **Blog Management**: Upload, preview, and delete markdown posts
- **Live Preview**: Real-time markdown rendering with syntax highlighting
- **Drag & Drop**: File upload with validation
- **Post List**: View all posts with metadata
- **Session Management**: Secure token-based sessions with HMAC signing

### 🛡️ Security Features
- **OWASP Top 10 Compliance**: Comprehensive security implementations
- **Input Validation**: Server-side validation for all inputs
- **CSRF Protection**: Secure session tokens
- **XSS Prevention**: Content sanitization
- **Security Headers**: Configured in Next.js
- **No Fallback Values**: All credentials must be explicitly provided
- **Constant-Time Comparison**: Protection against timing attacks
- **Environment Validation**: Startup checks for required variables

### 🚀 Performance & Optimization
- **Docker Support**: Multi-stage builds for production
- **Standalone Output**: Optimized Next.js build
- **Image Optimization**: AVIF and WebP formats
- **Compression**: Gzip enabled
- **Health Checks**: API endpoint for monitoring
- **Non-root User**: Security-first container configuration

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **npm** or **pnpm**
- **Docker** (optional, for containerized deployment)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd cyberstories
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Setup

Create environment files from templates:

```bash
# Docker configuration (safe to commit)
cp .env.example .env

# Next.js secrets (DO NOT commit)
cp .env.local.example .env.local
```

Edit `.env.local` with your secure values:

```bash
# Generate a secure password
ADMIN_PASSWORD=your_secure_password_here

# Generate a session secret (minimum 32 characters)
SESSION_SECRET=$(openssl rand -hex 32)

# Session duration (7 days = 604800 seconds)
SESSION_DURATION=604800

# Admin user ID
ADMIN_USER_ID=admin
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

### 5. Access Admin Panel

Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and use your configured password.

## 📁 Project Structure

```
cyberstories/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel pages
│   │   ├── login/               # Login page
│   │   └── page.tsx             # Admin dashboard
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin API endpoints
│   │   │   ├── login/          # Authentication
│   │   │   ├── logout/         # Session termination
│   │   │   ├── upload-blog/    # Blog post upload
│   │   │   ├── delete-blog/    # Blog post deletion
│   │   │   └── list-posts/     # Post listing
│   │   ├── blog/               # Blog API endpoints
│   │   │   ├── posts/          # Paginated posts
│   │   │   └── related/        # Related posts
│   │   └── health/             # Health check endpoint
│   ├── blog/                   # Blog pages
│   │   ├── [slug]/            # Dynamic blog post pages
│   │   └── page.tsx           # Blog listing page
│   ├── contact/               # Contact page
│   ├── projects/              # Projects showcase
│   ├── resume/                # Resume/CV page
│   ├── skills/                # Skills & certifications
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
├── components/                # React components
│   ├── ui/                   # shadcn/ui components
│   ├── blog-list.tsx         # Blog listing component
│   ├── blog-post-content.tsx # Blog post display
│   ├── navigation.tsx        # Site navigation
│   ├── footer.tsx            # Site footer
│   └── ...                   # Other components
├── content/                  # Content files
│   └── blog/                # Blog posts
│       ├── _TEMPLATE.md     # Markdown template
│       ├── *.md            # Markdown posts
│       ├── *.ts            # TypeScript posts (legacy)
│       └── index.ts        # Blog aggregator
├── lib/                     # Utility libraries
│   ├── env.ts              # Environment variable management
│   ├── session.ts          # Session management
│   ├── blog-loader.ts      # Markdown blog loader
│   ├── input-validator.ts  # Input validation utilities
│   └── utils.ts            # General utilities
├── public/                  # Static assets
│   ├── images/             # Image files
│   └── ...                 # Other static files
├── .env                    # Docker configuration (safe to commit)
├── .env.local             # Next.js secrets (DO NOT commit)
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
├── next.config.mjs        # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Configuration

### Environment Variables

#### `.env` - Docker Configuration (Safe to Commit)
```bash
PORT=3000
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
HOSTNAME=0.0.0.0
```

#### `.env.local` - Application Secrets (Never Commit)
```bash
ADMIN_PASSWORD=           # Your secure admin password
SESSION_SECRET=           # Random 32+ character string
SESSION_DURATION=         # Session duration in seconds
ADMIN_USER_ID=           # Admin user identifier
```

### Next.js Configuration

Key configurations in `next.config.mjs`:
- **Standalone Output**: Optimized for Docker
- **Image Optimization**: AVIF/WebP support
- **Security Headers**: HSTS, X-Frame-Options, CSP, etc.
- **Compression**: Enabled for production

## 📝 Creating Blog Posts

### Using Markdown (Recommended)

1. Access the admin panel at `/admin/login`
2. Upload a markdown file or use the built-in editor
3. Include YAML frontmatter:

```markdown
---
title: Your Post Title
description: A brief description of your post
date: 2026-02-01
author: Your Name
category: Cybersecurity
tags: [security, tutorial, guide]
featured: true
readTime: 10 min read
---

# Your Content Here

Write your blog post content using markdown...
```

### Template File

Use `content/blog/_TEMPLATE.md` as a starting point for new posts.

## 🐳 Docker Deployment

### Build and Run with Docker Compose

```bash
# Build the image
docker-compose build

# Start the container
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app

# Stop the container
docker-compose down
```

### Health Check

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"ok"}
```

## 🚢 Deployment

### Coolify Deployment

1. **Push your code** to Git (`.env.local` is automatically ignored)

2. **Configure environment variables** in Coolify:
   - `ADMIN_PASSWORD` - Your secure admin password
   - `SESSION_SECRET` - Your session secret (32+ characters)
   - `SESSION_DURATION` - Session duration in seconds
   - `ADMIN_USER_ID` - Admin user ID

3. **Deploy** - Coolify will:
   - Build your Docker image
   - Inject environment variables
   - Handle SSL/TLS with Let's Encrypt
   - Provide reverse proxy automatically

### Manual Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npm run type-check
```

### Adding New Features

1. **New Pages**: Add to `app/` directory
2. **New Components**: Add to `components/` directory
3. **New API Routes**: Add to `app/api/` directory
4. **New Blog Posts**: Upload via admin panel or add to `content/blog/`

## 🔒 Security

### Best Practices Implemented

- ✅ **No Hardcoded Credentials**: All secrets from environment
- ✅ **No Fallback Values**: Application fails if variables missing
- ✅ **Input Validation**: Server-side validation for all inputs
- ✅ **CSRF Protection**: Secure session tokens
- ✅ **XSS Prevention**: Content sanitization
- ✅ **Security Headers**: Comprehensive header configuration
- ✅ **HTTP-Only Cookies**: Session cookies not accessible via JavaScript
- ✅ **Constant-Time Comparison**: Protection against timing attacks
- ✅ **Non-Root Container**: Docker runs as unprivileged user

### Security Checklist

- [ ] Change default admin password
- [ ] Use strong session secret (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Keep dependencies updated
- [ ] Review security headers
- [ ] Monitor application logs
- [ ] Backup blog content regularly

## 📊 Monitoring

### Health Check Endpoint

```bash
GET /api/health
```

Returns:
```json
{"status":"ok"}
```

### Docker Health Status

```bash
docker-compose ps
```

Healthy container shows: `Up X minutes (healthy)`

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **gray-matter** - YAML frontmatter parser
- **react-markdown** - Markdown renderer
- **Lucide Icons** - Icon library
- **Sonner** - Toast notifications

## 📞 Support

For issues, questions, or contributions:

- 📧 Email: [Your Email]
- 🐛 Issues: [GitHub Issues]
- 💬 Discussions: [GitHub Discussions]

## 🗺️ Roadmap

- [ ] Multi-user support
- [ ] Comment system
- [ ] Search functionality
- [ ] RSS feed
- [ ] Newsletter integration
- [ ] Analytics dashboard
- [ ] Content versioning
- [ ] Image upload for blog posts

---

**Built with ❤️ for the cybersecurity community**

---

## 📝 Author

**George Wanyoike Njoroge**

Cybersecurity and networking professional with excellent academic credentials and relevant certifications from ISC², Cisco, Huawei, Microsoft, and Cyber Shujaa. Active participant in Hack The Box (HTB), picoCTF, TryHackMe, and organized CTF competitions.

For more information, visit the [Resume](/resume) page or download the CV.

---

*This README was written by George Wanyoike Njoroge*

