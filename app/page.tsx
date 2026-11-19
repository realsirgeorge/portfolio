import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { TerminalWindow } from "@/components/terminal-window";
import { EngagementRow } from "@/components/engagement-row";
import { SectionHeading } from "@/components/page-header";
import { PostRow } from "@/components/post-row";
import { ENGAGEMENTS, PROFILE, PROOF_POINTS, ROLES } from "@/lib/portfolio-data";
import { KNIGHT_LABS } from "@/lib/site";
import { SERVICE_LINES } from "@/lib/knight-labs";
import { getAllBlogPosts } from "@/content/blog";

// Re-read the blog volume periodically so admin uploads show up here.
export const revalidate = 300;

/* Every line below is drawn from real engagement data. */
const terminalLines = [
  { type: "command" as const, content: "whoami", delay: 700 },
  { type: "output" as const, content: "george_wanyoike — breaks systems, then builds them", delay: 400 },
  { type: "command" as const, content: "cat engagements/university-audit", delay: 600 },
  { type: "output" as const, content: "full-scope audit under NDA", delay: 250 },
  { type: "output" as const, content: "authorization, perimeter, legacy binary, interviews", delay: 250 },
  { type: "output" as const, content: "method published; findings withheld", delay: 250 },
  { type: "command" as const, content: "tailscale status --net anga", delay: 600 },
  { type: "output" as const, content: "anga-networks   online   multi-site", delay: 200 },
  { type: "output" as const, content: "RouterOS API    ok       9 workflows", delay: 200 },
];

const BREAKS = [
  "Full-scope audits: reconnaissance, exploitation and client reporting under NDA",
  "Authorization flaws: IDOR, BOLA, broken object property level authorization",
  "Legacy binary analysis where there is no source and no vendor",
  "Perimeter and firewall assessment, with CVE research against live versions",
];

const BUILDS = [
  "Uptime monitoring with a state machine that absorbs transient failures",
  "ISP provisioning automation over the RouterOS REST API",
  "Zero-trust remote access across a production estate",
  "Commercial full-stack delivery, with authorization written in from the start",
];

export default function HomePage() {
  const featured = ENGAGEMENTS.filter((e) => e.featured);
  const latest = getAllBlogPosts().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="container-page grid items-center gap-12 pt-14 pb-16 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pb-24">
        <div className="lg:col-span-7">
          <p className="eyebrow eyebrow-accent rise">
            Security practitioner · Founder, Knight Labs · Nairobi
          </p>
          <h1 className="rise rise-2 mt-5 font-display text-[2.75rem] leading-[1.02] text-foreground sm:text-7xl lg:text-[5.25rem]">
            I build the systems <em className="italic text-primary">I&nbsp;break.</em>
          </h1>
          <p className="rise rise-3 lede mt-7 max-w-xl">
            I&apos;m George Wanyoike, Sir G to most people. I run full-scope
            security audits, I own and operate an ISP, and I founded Knight Labs
            to bring the same practice to Kenyan organisations that hold
            sensitive data without a security team to guard it.
          </p>
          <div className="rise rise-4 mt-9 flex flex-wrap items-center gap-3">
            <Link href="/work" className="btn btn-primary">
              See the work
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/knight-labs" className="btn btn-ghost">
              Work with Knight Labs
            </Link>
            <Link href="/resume" className="link-quiet ml-1 px-2 py-2 text-[0.9375rem] text-muted-foreground hover:text-foreground">
              Resume
            </Link>
          </div>
        </div>

        <div className="rise rise-3 lg:col-span-5">
          <TerminalWindow
            lines={terminalLines}
            title="george@kali:~"
            interactive
            prompt="george@kali:~$"
          />
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Interactive. Type <span className="text-foreground">help</span> once the intro finishes.
          </p>
        </div>
      </section>

      {/* Proof */}
      <section aria-labelledby="proof-heading" className="border-y border-border bg-card/50">
        <h2 id="proof-heading" className="sr-only">Evidence</h2>
        <ul className="container-page grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {PROOF_POINTS.map((point) => (
            <li key={point.href}>
              <Link href={point.href} className="group block py-8 md:px-8 md:first:pl-0 md:last:pr-0 md:py-10">
                <p className="flex items-baseline gap-3">
                  <span className="figure-num text-5xl leading-none text-foreground sm:text-6xl">
                    {point.value}
                  </span>
                  <span className="eyebrow">{point.unit}</span>
                </p>
                <p className="mt-2 text-sm text-primary">{point.qualifier}</p>
                <p className="mt-3 leading-relaxed text-muted-foreground group-hover:text-foreground">
                  {point.claim}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Practice */}
      <section className="container-page pt-20 sm:pt-28">
        <SectionHeading index="01" title="The practice" />
        <div className="grid gap-12 md:grid-cols-12">
          <p className="reveal font-display text-2xl leading-snug text-foreground md:col-span-5 sm:text-[1.75rem]">
            Most security portfolios are a findings list or a project gallery.
            The work here sits in the overlap, and each half is why the other
            one is any good.
          </p>
          <div className="grid gap-10 sm:grid-cols-2 md:col-span-7">
            {[
              { title: "What I break", items: BREAKS },
              { title: "What I build", items: BUILDS },
            ].map((col) => (
              <div key={col.title} className="reveal">
                <h3 className="eyebrow mb-4 text-foreground">{col.title}</h3>
                <ul className="space-y-4">
                  {col.items.map((item) => (
                    <li key={item} className="border-t border-border pt-4 leading-relaxed text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="reveal mt-12 max-w-3xl leading-relaxed text-muted-foreground">
          {PROFILE.statement}
        </p>
      </section>

      {/* Selected work */}
      <section className="container-page pt-20 sm:pt-28">
        <SectionHeading
          index="02"
          title="Selected work"
          note="Client identities are anonymised by contract. The technical substance is not."
        />
        <ol className="border-b border-border">
          {featured.map((engagement, i) => (
            <EngagementRow key={engagement.slug} engagement={engagement} index={i} />
          ))}
        </ol>
        <Link href="/work" className="mt-8 inline-flex items-center gap-2 font-medium text-foreground hover:text-primary">
          All engagements
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      {/* Knight Labs */}
      <section aria-labelledby="kl-heading" className="container-page pt-20 sm:pt-28">
        <div className="panel-inverse reveal grid gap-10 p-7 sm:p-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow !text-inverse-accent">The firm</p>
            <h2 id="kl-heading" className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              Knight Labs
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-inverse-foreground/85">
              The practice on this site, offered to organisations. Knight Labs
              works with SACCOs, clinics, schools, property managers and growing
              corporates, and every proposal and report is reviewed by me.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={KNIGHT_LABS.quickStart} rel="noopener" className="btn bg-inverse-foreground text-inverse hover:opacity-90">
                Get a free tailored brief
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link href="/knight-labs" className="btn border border-inverse-foreground/30 hover:border-inverse-foreground">
                About the firm
              </Link>
            </div>
          </div>
          <ul className="lg:col-span-6">
            {SERVICE_LINES.map((line) => (
              <li key={line.key} className="flex items-baseline justify-between gap-6 border-t border-inverse-foreground/15 py-4">
                <span className="font-display text-2xl">{line.name}</span>
                <span className="text-right text-sm text-inverse-muted">{line.fit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Roles */}
      <section className="container-page pt-20 sm:pt-28">
        <SectionHeading index="03" title="Where the work happens now" />
        <ul className="grid gap-x-10 gap-y-10 md:grid-cols-2">
          {ROLES.map((role) => (
            <li key={role.title + role.org} className="reveal border-t border-border pt-5">
              <p className="eyebrow">{role.title}</p>
              <h3 className="mt-2 font-display text-2xl text-foreground">
                {"href" in role && role.href ? (
                  role.href.startsWith("/") ? (
                    <Link href={role.href} className="link-quiet">{role.org}</Link>
                  ) : (
                    <a href={role.href} target="_blank" rel="noopener noreferrer" className="link-quiet">
                      {role.org}
                    </a>
                  )
                ) : (
                  role.org
                )}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{role.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Writing */}
      {latest.length > 0 && (
        <section className="container-page pt-20 sm:pt-28">
          <SectionHeading index="04" title="Recent writing" note="Engagement lessons, CTF writeups and field notes." />
          <ol className="border-b border-border">
            {latest.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </ol>
          <Link href="/blog" className="mt-8 inline-flex items-center gap-2 font-medium text-foreground hover:text-primary">
            All writing
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      )}

      {/* Two doors */}
      <section className="container-page pt-20 sm:pt-28">
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
          <div className="bg-card p-8 sm:p-10">
            <p className="eyebrow">For organisations</p>
            <h2 className="mt-3 font-display text-3xl text-foreground">Security work goes through Knight Labs.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Assessments, penetration tests, audits, advisory and incident
              response are scoped, contracted and delivered by the firm.
            </p>
            <a href={KNIGHT_LABS.quickStart} rel="noopener" className="btn btn-accent mt-6">
              Start the Quick-Start
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <div className="bg-card p-8 sm:p-10">
            <p className="eyebrow">For everything else</p>
            <h2 className="mt-3 font-display text-3xl text-foreground">Talk to me directly.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Community, research, CTFs, writing, speaking invitations and the
              occasional good argument about network design.
            </p>
            <Link href="/contact" className="btn btn-ghost mt-6">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
