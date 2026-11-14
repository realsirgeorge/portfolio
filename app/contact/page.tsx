import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PROFILE } from "@/lib/portfolio-data";
import { KNIGHT_LABS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "How to reach George Wanyoike. Business and security engagements go to Knight Labs; personal, community and research conversations come here.",
  alternates: { canonical: "/contact" },
};

const PERSONAL = [
  { label: "Email", value: PROFILE.emailAlt, href: `mailto:${PROFILE.emailAlt}` },
  { label: "LinkedIn", value: "george-wanyoike", href: PROFILE.linkedin, external: true },
  { label: "GitHub", value: "@realsirgeorge", href: PROFILE.github, external: true },
  { label: "Phone", value: PROFILE.phone, href: `tel:${PROFILE.phone.replace(/[^+0-9]/g, "")}` },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Two doors, depending on why you are here"
        standfirst={
          <p>
            Security work for an organisation is scoped, contracted and
            delivered by Knight Labs, so it goes to the firm. Everything else
            comes to me.
          </p>
        }
      />

      <div className="container-page grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="business" className="panel-inverse flex flex-col p-7 sm:p-10">
          <p className="eyebrow !text-inverse-accent">For organisations</p>
          <h2 id="business" className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            Business enquiries
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-inverse-foreground/85">
            Penetration tests, audits, Data Protection Act readiness, advisory
            and incident response. Start with the Quick-Start for a free brief
            tailored to your sector, or write to the firm directly.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={KNIGHT_LABS.quickStart} rel="noopener" className="btn bg-inverse-foreground text-inverse hover:opacity-90">
              Open the Quick-Start
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={`mailto:${KNIGHT_LABS.email}`} className="btn border border-inverse-foreground/30 hover:border-inverse-foreground">
              {KNIGHT_LABS.email}
            </a>
          </div>
          <p className="mt-auto pt-8 text-sm text-inverse-muted">
            Responsible disclosure and security contacts for the firm are on{" "}
            <a href={KNIGHT_LABS.trust} rel="noopener" className="underline underline-offset-4">
              the Knight Labs trust page
            </a>
            .
          </p>
        </section>

        <section aria-labelledby="personal" className="panel flex flex-col p-7 sm:p-10">
          <p className="eyebrow">For everything else</p>
          <h2 id="personal" className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-4xl">
            Personal and community
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
            Research, CTFs, writing, speaking invitations, and conversations
            with other practitioners.
          </p>
          <dl className="mt-8">
            {PERSONAL.map((item) => (
              <div key={item.label} className="flex flex-col gap-1 border-t border-border py-4 sm:flex-row sm:items-baseline sm:justify-between">
                <dt className="eyebrow">{item.label}</dt>
                <dd>
                  <a
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="link-quiet text-[1.0625rem] text-foreground"
                  >
                    {item.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-muted-foreground">
            Based in {PROFILE.location}.
          </p>
          {/* TODO(owner): if you publish a PGP key, add its real fingerprint and a
              /pgp.asc download here. The previous page showed a placeholder
              fingerprint, which has been removed. */}
        </section>
      </div>
    </>
  );
}
