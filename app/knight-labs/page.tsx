import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/page-header";
import { SECTORS, SERVICE_LINES, TIERS } from "@/lib/knight-labs";
import { KNIGHT_LABS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Knight Labs",
  description:
    "Knight Labs is the Nairobi cybersecurity practice founded and led by George Wanyoike, working with SACCOs, clinics, schools, property managers and growing corporates.",
  alternates: { canonical: "/knight-labs" },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: KNIGHT_LABS.name,
  url: KNIGHT_LABS.url,
  email: KNIGHT_LABS.email,
  founder: { "@id": `${SITE_URL}/#person` },
  areaServed: "KE",
  address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
};

const PRINCIPLES = [
  {
    title: "Authorised, in writing, every time",
    body: "Testing starts after a signed agreement and agreed rules of engagement. Non-destructive by default.",
  },
  {
    title: "Findings stay out of the sales system",
    body: "Client vulnerabilities, evidence and reports are handled outside the firm's public and customer-facing platform. A breach of the website must never become a breach of a client.",
  },
  {
    title: "Critical exposure is escalated immediately",
    body: "If live personal data is exposed, the client hears about it on discovery, not in the final report.",
  },
  {
    title: "Reports a board can act on",
    body: "Plain language first, technical depth underneath, and a prioritised roadmap rather than a list of everything that could be better.",
  },
];

export default function KnightLabsPage() {
  return (
    <>
      <PageHeader
        eyebrow="The firm"
        title={<>Knight Labs</>}
        standfirst={
          <p>
            Knight Labs is the Nairobi cybersecurity practice I founded and lead.
            It takes the methods documented on this site and offers them to
            organisations that hold sensitive data but have no security team of
            their own. Every proposal and every report is reviewed by me
            personally.
          </p>
        }
      >
        <div className="flex flex-wrap gap-3">
          <a href={KNIGHT_LABS.quickStart} rel="noopener" className="btn btn-accent">
            Get a free tailored brief
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a href={KNIGHT_LABS.url} rel="noopener" className="btn btn-ghost">
            Visit knightlabs.co.ke
          </a>
        </div>
      </PageHeader>

      <section className="container-page">
        <SectionHeading
          index="01"
          title="Who it is for"
          note="Organisations that are trusted with other people's money, health records or children's data, and are expected to protect them."
        />
        <ul className="grid gap-x-10 md:grid-cols-2">
          {SECTORS.map((sector) => (
            <li key={sector.key} className="reveal border-t border-border py-6">
              <h3 className="font-display text-2xl text-foreground">{sector.name}</h3>
              <p className="mt-2 text-foreground/90">{sector.headline}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Mapped to {sector.compliance}.
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pt-20 sm:pt-28">
        <SectionHeading
          index="02"
          title="What the firm does"
          note="Five service lines, from a first health check to an incident response retainer."
        />
        <ol className="border-b border-border">
          {SERVICE_LINES.map((line, i) => (
            <li key={line.key} className="reveal grid gap-4 border-t border-border py-8 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-4">
                <p className="eyebrow mono-num">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-3xl text-foreground">{line.name}</h3>
                <p className="mt-2 text-sm text-primary">{line.fit}</p>
              </div>
              <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 md:col-span-8 md:pt-7">
                {line.services.map((service) => (
                  <li key={service} className="leading-relaxed text-muted-foreground">
                    {service}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-muted-foreground">
          Full descriptions are on{" "}
          <a href={KNIGHT_LABS.services} rel="noopener" className="link-quiet text-foreground">
            the Knight Labs services page
          </a>
          .
        </p>
      </section>

      <section className="container-page pt-20 sm:pt-28">
        <SectionHeading
          index="03"
          title="How engagements are packaged"
          note="Every engagement is scoped and quoted individually. There is no public price list."
        />
        <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => (
            <li key={tier.name} className="bg-card p-6">
              <p className="eyebrow">{tier.type}</p>
              <h3 className="mt-3 font-display text-2xl text-foreground">{tier.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tier.includes}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pt-20 sm:pt-28">
        <SectionHeading index="04" title="How the firm works" />
        <ul className="grid gap-x-10 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="reveal border-t border-border py-6">
              <h3 className="font-display text-xl text-foreground">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
          The thinking behind these is visible in my own{" "}
          <Link href="/work" className="link-quiet text-foreground">case studies</Link> and in{" "}
          <Link href="/library" className="link-quiet text-foreground">the methodology library</Link>.
        </p>
      </section>

      <section className="container-page pt-20 sm:pt-28">
        <div className="panel-inverse grid gap-8 p-7 sm:p-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow !text-inverse-accent">Start here</p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
              A tailored starting point in about a minute.
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-inverse-foreground/85">
              The Quick-Start asks your sector, your main concern and your size,
              and sends back a short brief: the common risks for organisations
              like yours, the compliance angle, and a sensible first engagement.
              It is free.
            </p>
          </div>
          <div className="flex flex-col justify-end gap-3 md:col-span-5">
            <a href={KNIGHT_LABS.quickStart} rel="noopener" className="btn bg-inverse-foreground text-inverse hover:opacity-90">
              Open the Quick-Start
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={`mailto:${KNIGHT_LABS.email}`} className="btn border border-inverse-foreground/30 hover:border-inverse-foreground">
              {KNIGHT_LABS.email}
            </a>
            <a href={KNIGHT_LABS.contact} rel="noopener" className="text-center text-sm text-inverse-muted underline underline-offset-4">
              Other ways to reach the firm
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
    </>
  );
}
