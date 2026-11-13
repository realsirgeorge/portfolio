import Link from "next/link";
import { Github, Linkedin, Mail, Terminal } from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";

const footerLinks = [
  {
    title: "Work",
    links: [
      { href: "/work", label: "Engagements" },
      { href: "/infrastructure", label: "The Lab" },
      { href: "/library", label: "Library" },
    ],
  },
  {
    title: "More",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/about", label: "About" },
      { href: "/resume", label: "Resume" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

const socialLinks = [
  { href: PROFILE.github, icon: Github, label: "GitHub" },
  { href: PROFILE.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: `mailto:${PROFILE.email}`, icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded border border-primary/50 flex items-center justify-center bg-primary/10">
                <Terminal className="w-4 h-4 text-primary" />
              </div>
              <span className="font-mono text-sm text-foreground">
                george@security
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              {PROFILE.thesis} Full-lifecycle offensive engagements, a
              production ISP in Kenya, and a published methodology.
            </p>
            <p className="text-muted-foreground font-mono text-xs">
              {PROFILE.location}
            </p>
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="p-2 rounded-md border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} {PROFILE.name}
          </p>
          <p className="text-xs text-muted-foreground font-mono max-w-lg">
            {"// Engagements run under signed agreement. Client identities anonymized."}
          </p>
        </div>
      </div>
    </footer>
  );
}
