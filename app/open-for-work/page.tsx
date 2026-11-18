import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Briefcase, MapPin, Network, ShieldCheck } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/page-header";
import { KNIGHT_LABS, SITE_URL } from "@/lib/site";
import { PROFILE } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Open for work",
  description:
    "George Wanyoike runs two operations: Knight Labs, a Nairobi cybersecurity practice, and Anga Networks, a neighbourhood ISP. Security assessments, network builds, and the work he is open to next.",
  keywords: [
    "George Wanyoike open for work",
    "cybersecurity Nairobi",
    "penetration testing Kenya",
    "network engineer Nairobi",
    "Knight Labs",
    "Anga Networks",
  ],
  alternates: { canonical: "/open-for-work" },
  openGraph: {
    type: "profile",
    title: "Open for work — George Wanyoike",
    description:
      "A cybersecurity practice and an ISP, run from Nairobi. What I do, where I do it, and how to start a conversation.",
    url: `${SITE_URL}/open-for-work`,
  },
};

const workplaces = [
  {
    id: "knight-labs",
    index: "01",
    kind: "The security practice",
    name: "Knight Labs",
    role: "Founder and lead assessor",
    href: KNIGHT_LABS.url,
    hrefLabel: "knightlabs.co.ke",
    summary:
      "A Nairobi cybersecurity practice for organisations that hold money, health records or children's data and have no security team of their own. Every proposal and every report is reviewed by me personally.",
    facts: [
      { label: "Who it serves", value: "SACCOs, clinics, schools, property managers, growing corporates" },
      { label: "Service lines", value: "Assess · Test · Audit · Advise · Respond" },
      { label: "Based", value: "Nairobi, Kenya — on-site and remote" },
    ],
    body: [
      "Knight Labs is the commercial half of my work. It takes the methods documented across this site — full-scope audits, hands-on application and network testing, structured reviews against the Data Protection Act and sector expectations — and offers them to Kenyan organisations that need a named, accountable practitioner rather than a ticket queue.",
      "The practice is deliberately small. Scopes are tight, reports are written in plain language first with technical depth underneath, and critical exposure is escalated the day it is found, not saved for the final deliverable. The free Quick-Start brief is a four-question intake that produces a one-page sector-specific starting point without any system access.",
    ],
    tags: ["Security audits", "Penetration testing", "DPA 2019 readiness", "vCISO", "Incident response"],
    links: [
      { label: "The practice", href: KNIGHT_LABS.url },
      { label: "Services", href: KNIGHT_LABS.services },
      { label: "Free Quick-Start", href: KNIGHT_LABS.quickStart },
    ],
    icon: ShieldCheck,
  },
  {
    id: "anga-networks",
    index: "02",
    kind: "The ISP",
    name: "Anga Networks",
    role: "Founder and operator",
    href: PROFILE.anga,
    hrefLabel: "Anga Networks website",
    summary:
      "Neighbourhood internet across Nairobi: apartments, malls, schools and hotspot zones. Free installation, same-day connection, and multiple upstream providers blended so one outage does not take a building offline.",
    facts: [
      { label: "Coverage", value: "Nairobi and surrounding areas" },
      { label: "Built on", value: "MikroTik RouterOS, LACP 802.3ad, Starlink, Tailscale" },
      { label: "Operations", value: "n8n automation, M-Pesa billing, WhatsApp notifications" },
    ],
    body: [
      "Anga Networks is the operational half. I own and run an ISP with paying residential and business customers, which means every architectural opinion has an uptime bill attached to it. The estate runs MikroTik and RouterOS across multiple sites, with 802.3ad link aggregation in production, field-deployed Starlink and wireless distribution, and a purpose-built management platform built on n8n, the RouterOS REST API and Evolution API for customer messaging.",
      "This is also where the security work gets tested against reality. Remote access moved from Twingate to a Tailscale overlay with MagicDNS and subnet routing — a zero-trust design sized for an operator who cannot justify enterprise tooling. The automation layer deliberately uses Google Sheets as its datastore, because right-sizing infrastructure to the operation you actually have beats copying the architecture of a company a hundred times your size.",
    ],
    tags: ["MikroTik", "Starlink", "Network design", "n8n automation", "Zero-trust access"],
    links: [{ label: "Anga Networks", href: PROFILE.anga }],
    icon: Network,
  },
] as const;

const openTo = [
  {
    title: "Security assessments and audits",
    body: "Authorised, scoped testing of web, mobile, API and network estates, with a report your team can act on. Delivered through Knight Labs, under a signed agreement and agreed rules of engagement.",
    href: "/contact",
    cta: "Start a conversation",
  },
  {
    title: "Network builds and operations",
    body: "ISP-grade design and hands-on operations: MikroTik, wireless distribution, Starlink, link aggregation, and the automation that keeps a multi-site network observable. Delivered through Anga Networks.",
    href: PROFILE.anga,
    cta: "Visit Anga Networks",
  },
  {
    title: "Research and collaboration",
    body: "Selected bug bounty research, joint engagements, tooling, and CTF work. I publish the methodology — the 31 Nights of Cyber series on this site is the long version.",
    href: "/blog",
    cta: "Read the writeups",
  },
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/open-for-work#page`,
  url: `${SITE_URL}/open-for-work`,
  name: "Open for work — George Wanyoike",
  about: { "@id": `${SITE_URL}/#person` },
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: PROFILE.name,
    alternateName: PROFILE.alias,
    jobTitle: "Security practitioner; founder of Knight Labs and Anga Networks",
    worksFor: [
      {
        "@type": "Organization",
        name: KNIGHT_LABS.name,
        url: KNIGHT_LABS.url,
        email: KNIGHT_LABS.email,
        description:
          "A Nairobi cybersecurity practice serving SACCOs, clinics, schools, property managers and growing corporates.",
      },
      {
        "@type": "Organization",
        name: "Anga Networks",
        url: PROFILE.anga,
        description:
          "A neighbourhood internet service provider operating across Nairobi on MikroTik and RouterOS infrastructure.",
      },
    ],
    address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
  },
};

export default function OpenForWorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Open for work"
        title="Two operations, one practitioner"
        standfirst={
          <p>
            I run a cybersecurity practice and an ISP from Nairobi. One keeps
            organisations out of trouble; the other keeps buildings online. Both
            are mine, both have paying customers, and both are how I prefer to
            work: close to the system, accountable for the outcome.
          </p>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/contact" className="btn btn-accent">
            Start a conversation
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a href={KNIGHT_LABS.quickStart} rel="noopener" className="btn btn-ghost">
            Free Knight Labs brief
          </a>
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          Nairobi, Kenya · EAT (UTC+3) · remote across time zones
        </p>
      </PageHeader>

      <div className="container-page space-y-20 sm:space-y-28">
        {workplaces.map((place) => {
          const Icon = place.icon;
          return (
            <section key={place.id} id={place.id} aria-labelledby={`${place.id}-title`}>
              <SectionHeading
                index={place.index}
                title={
                  <span className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    {place.name}
                    <span className="tag">{place.kind}</span>
                  </span>
                }
                note={place.role}
              />
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <p className="font-display text-2xl leading-snug text-foreground sm:text-[1.75rem]">
                    {place.summary}
                  </p>
                  <div className="mt-6 space-y-4 text-[1.0625rem] leading-[1.75] text-foreground/85">
                    {place.body.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                    ))}
                  </div>
                  <ul className="mt-7 flex flex-wrap gap-2" aria-label={`${place.name} focus areas`}>
                    {place.tags.map((tag) => (
                      <li key={tag} className="tag">
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {place.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        rel="noopener"
                        className="btn btn-ghost text-sm"
                      >
                        {link.label}
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>

                <aside className="lg:col-span-5">
                  <div className="border-t border-rule pt-6">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-md border border-border text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <p className="eyebrow">At a glance</p>
                    </div>
                    <dl className="mt-6 space-y-5">
                      {place.facts.map((fact) => (
                        <div key={fact.label} className="border-t border-border pt-4">
                          <dt className="eyebrow">{fact.label}</dt>
                          <dd className="mt-2 leading-relaxed text-foreground/85">{fact.value}</dd>
                        </div>
                      ))}
                      <div className="border-t border-border pt-4">
                        <dt className="eyebrow">Where</dt>
                        <dd className="mt-2">
                          <a href={place.href} rel="noopener" className="link-quiet text-foreground">
                            {place.hrefLabel}
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </aside>
              </div>
            </section>
          );
        })}

        <section aria-labelledby="open-to">
          <SectionHeading
            index="03"
            title="What I'm open to"
            note="The short version. If your problem fits one of these, the conversation is easy."
          />
          <ul className="grid gap-x-10 md:grid-cols-3">
            {openTo.map((item, index) => (
              <li key={item.title} className="reveal border-t border-border py-6">
                <span className="eyebrow mono-num">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-xl text-foreground">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{item.body}</p>
                {item.href.startsWith("http") ? (
                  <a
                    href={item.href}
                    rel="noopener"
                    className="link-quiet mt-4 inline-flex items-center gap-1 text-sm text-foreground"
                  >
                    {item.cta}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="link-quiet mt-4 inline-flex items-center gap-1 text-sm text-foreground"
                  >
                    {item.cta}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="next-step" className="pb-8">
          <div className="border-t border-rule pt-8">
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-8">
                <p className="eyebrow eyebrow-accent">Next step</p>
                <h2 id="next-step" className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-4xl">
                  Tell me what you are trying to protect, or what you are trying to connect.
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                  Security work goes through Knight Labs; network work goes through
                  Anga Networks. If you are not sure which one you need, send one
                  message and I will point you at the right door.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
                <Link href="/contact" className="btn btn-accent">
                  Contact me
                  <Briefcase className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a href={KNIGHT_LABS.url} rel="noopener" className="btn btn-ghost">
                  Knight Labs
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
