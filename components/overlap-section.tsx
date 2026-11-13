import Link from "next/link";
import { Swords, Wrench, ExternalLink } from "lucide-react";
import { ROLES } from "@/lib/portfolio-data";

/**
 * The thesis made structural: most security portfolios are a findings list or
 * a project gallery. The overlap is the point.
 */

const BREAKS = [
  "Full-scope audits: recon, exploitation, client reporting under NDA",
  "Authorization flaws — IDOR, BOLA, broken object property level authz",
  "Legacy binary analysis where there is no source and no vendor",
  "Perimeter and firewall assessment, CVE research against live versions",
];

const BUILDS = [
  "Uptime monitoring with a state machine that absorbs transient failures",
  "ISP provisioning automation over the RouterOS REST API",
  "Zero-trust remote access across a production estate",
  "Commercial full-stack delivery, with authorization written in from the start",
];

export function OverlapSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Most security portfolios are half of this
          </h2>
          <p className="text-muted-foreground font-mono text-sm">
            {"// A findings list, or a project gallery. Rarely both."}
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-3xl mt-4">
            The work below sits in the overlap, and each half is why the other
            one is any good.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Swords className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                What he breaks
              </h3>
            </div>
            <ul className="space-y-3">
              {BREAKS.map((item) => (
                <li
                  key={item}
                  className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2"
                >
                  <span className="text-primary font-mono shrink-0">{">"}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                What he builds
              </h3>
            </div>
            <ul className="space-y-3">
              {BUILDS.map((item) => (
                <li
                  key={item}
                  className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2"
                >
                  <span className="text-accent font-mono shrink-0">{">"}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Current roles */}
        <div className="mt-14">
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <span className="text-primary font-mono">{">"}</span>
            Where the work happens now
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6"
              >
                <h4 className="font-semibold text-foreground">{role.title}</h4>
                <p className="text-xs text-primary font-mono mt-1 mb-3">
                  {"href" in role && role.href ? (
                    <Link
                      href={role.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {role.org}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : (
                    role.org
                  )}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {role.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
