import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";
import { KNIGHT_LABS } from "@/lib/site";

const COLUMNS = [
  {
    title: "Practice",
    links: [
      { href: "/work", label: "Work" },
      { href: "/infrastructure", label: "The Lab" },
      { href: "/library", label: "Library" },
      { href: "/blog", label: "Writing" },
    ],
  },
  {
    title: "Person",
    links: [
      { href: "/about", label: "About" },
      { href: "/resume", label: "Resume" },
      { href: "/contact", label: "Contact" },
      { href: "/knight-labs", label: "Knight Labs" },
    ],
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer data-site-footer className="mt-24 border-t border-border bg-card/60">
      <div className="container-page grid gap-12 py-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="font-display text-2xl leading-snug text-foreground sm:text-[1.75rem]">
            {PROFILE.thesis}
          </p>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted-foreground">
            Security practitioner in Nairobi. Founder of{" "}
            <Link href="/knight-labs" className="link-quiet text-foreground">
              Knight Labs
            </Link>
            , where business enquiries are handled.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={KNIGHT_LABS.quickStart} className="btn btn-accent text-sm" rel="noopener">
              Start with Knight Labs
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="md:col-span-2">
            <h2 className="eyebrow mb-4">{col.title}</h2>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[0.9375rem] text-foreground/85 hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="md:col-span-2">
          <h2 className="eyebrow mb-4">Elsewhere</h2>
          <ul className="space-y-2.5 text-[0.9375rem]">
            <li>
              <a href={PROFILE.linkedin} rel="noopener noreferrer" target="_blank" className="text-foreground/85 hover:text-foreground">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={PROFILE.github} rel="noopener noreferrer" target="_blank" className="text-foreground/85 hover:text-foreground">
                GitHub
              </a>
            </li>
            <li>
              <a href={KNIGHT_LABS.url} rel="noopener" className="text-foreground/85 hover:text-foreground">
                knightlabs.co.ke
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">
            © {year} {PROFILE.name}
          </p>
          <p className="font-mono">
            Engagements run under signed agreement. Client identities stay anonymised.
          </p>
        </div>
      </div>
    </footer>
  );
}
