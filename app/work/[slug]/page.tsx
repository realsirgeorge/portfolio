import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { SeverityBar } from "@/components/severity-bar";
import { ENGAGEMENTS, KIND_LABEL, getEngagement } from "@/lib/portfolio-data";
import { KNIGHT_LABS } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ENGAGEMENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const engagement = getEngagement(slug);
  if (!engagement) return { title: "Not found" };
  return {
    title: engagement.title,
    description: engagement.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { title: engagement.title, description: engagement.summary, type: "article" },
  };
}

export default async function EngagementPage({ params }: Props) {
  const { slug } = await params;
  const engagement = getEngagement(slug);
  if (!engagement) notFound();

  const index = ENGAGEMENTS.findIndex((e) => e.slug === slug);
  const next = ENGAGEMENTS[(index + 1) % ENGAGEMENTS.length];
  const isClientWork = engagement.kind === "audit";

  return (
    <article>
      <header className="container-page pt-10 pb-12 sm:pt-14 sm:pb-16">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All work
        </Link>
        <p className="eyebrow eyebrow-accent rise mt-10">
          {KIND_LABEL[engagement.kind]} · {engagement.client}
        </p>
        <h1 className="rise rise-2 mt-4 max-w-4xl font-display text-[2.25rem] leading-[1.1] text-foreground sm:text-[3.5rem]">
          {engagement.title}
        </h1>
        <p className="rise rise-3 lede mt-6 max-w-3xl">{engagement.standfirst}</p>
        {engagement.external && (
          <a
            href={engagement.external.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            {engagement.external.label}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </header>

      {/* Figures */}
      <section aria-label="Key figures" className="border-y border-border bg-card/50">
        <div className="container-page py-10">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {engagement.figures.map((figure) => (
              <div key={figure.label}>
                <dt className="sr-only">{figure.label}</dt>
                <dd
                  className="figure-num text-4xl leading-none sm:text-5xl"
                  style={{ color: figure.tone ? `var(--sev-${figure.tone})` : "var(--foreground)" }}
                >
                  {figure.value}
                </dd>
                <dd className="mt-2 text-sm leading-snug text-muted-foreground">{figure.label}</dd>
              </div>
            ))}
          </dl>
          {engagement.findings && (
            <div className="mt-10 max-w-md">
              <p className="eyebrow mb-3">Findings by severity</p>
              <SeverityBar findings={engagement.findings} />
            </div>
          )}
        </div>
      </section>

      <div className="container-prose pt-14 sm:pt-20">
        {engagement.authorization && (
          <aside className="mb-12 flex gap-4 rounded-lg border border-border bg-card p-5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="eyebrow mb-1.5 text-foreground">Authorisation</p>
              <p className="leading-relaxed text-muted-foreground">{engagement.authorization}</p>
            </div>
          </aside>
        )}

        <div className="space-y-14">
          {engagement.sections.map((section, i) => (
            <section key={section.heading} className="reveal">
              <p className="eyebrow mono-num">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-display text-[1.75rem] leading-tight text-foreground sm:text-[2rem]">
                {section.heading}
              </h2>
              {section.body && (
                <p className="mt-4 text-[1.0625rem] leading-[1.75] text-foreground/85">{section.body}</p>
              )}
              {section.items && (
                <ul className="mt-5 space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-[1.0625rem] leading-relaxed text-foreground/85">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <p className="eyebrow mb-4">Tools and platforms</p>
          <ul className="flex flex-wrap gap-2">
            {engagement.stack.map((item) => (
              <li key={item} className="tag">{item}</li>
            ))}
          </ul>
        </div>

        {isClientWork && (
          <aside className="mt-12 rounded-lg border border-border bg-card p-6 sm:p-8">
            <p className="eyebrow">Need work like this?</p>
            <p className="mt-2 font-display text-2xl leading-snug text-foreground">
              Client engagements now run through Knight Labs.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={KNIGHT_LABS.quickStart} rel="noopener" className="btn btn-accent">
                Get a tailored brief
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link href="/knight-labs" className="btn btn-ghost">About the firm</Link>
            </div>
          </aside>
        )}

        <Link
          href={`/work/${next.slug}`}
          className="group mt-12 block border-t border-border pt-8"
        >
          <p className="eyebrow">Next</p>
          <p className="mt-2 flex items-center gap-3 font-display text-2xl text-foreground group-hover:text-primary">
            {next.title}
            <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </p>
        </Link>
      </div>
    </article>
  );
}
