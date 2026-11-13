import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, ExternalLink, ShieldCheck } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SeverityBar } from "@/components/severity-bar";
import { ENGAGEMENTS, KIND_LABEL, getEngagement } from "@/lib/portfolio-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ENGAGEMENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const engagement = getEngagement(slug);
  if (!engagement) return { title: "Not found" };
  return { title: engagement.title, description: engagement.summary };
}

export default async function EngagementPage({ params }: Props) {
  const { slug } = await params;
  const engagement = getEngagement(slug);
  if (!engagement) notFound();

  const index = ENGAGEMENTS.findIndex((e) => e.slug === slug);
  const next = ENGAGEMENTS[(index + 1) % ENGAGEMENTS.length];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main" className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/work"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors font-mono mb-8 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            back to engagements
          </Link>

          {/* Header */}
          <div className="mb-8">
            <p className="text-primary font-mono text-sm tracking-wider mb-2">
              {`// ${KIND_LABEL[engagement.kind]} — ${engagement.client}`}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
              {engagement.title}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {engagement.standfirst}
            </p>
            {engagement.external && (
              <a
                href={engagement.external.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-5 text-sm text-primary hover:underline font-mono cursor-pointer"
              >
                {engagement.external.label}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Figures */}
          <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {engagement.figures.map((figure) => (
                <div key={figure.label}>
                  <div
                    className="figure-num text-2xl sm:text-3xl font-bold"
                    style={{
                      color: figure.tone
                        ? `var(--sev-${figure.tone})`
                        : "var(--primary)",
                    }}
                  >
                    {figure.value}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-1.5 leading-snug">
                    {figure.label}
                  </p>
                </div>
              ))}
            </div>

            {engagement.findings && (
              <div className="mt-6 pt-6 border-t border-border/50 max-w-md">
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono">{">"}</span>
                  Findings by severity
                </p>
                <SeverityBar findings={engagement.findings} />
              </div>
            )}
          </div>

          {/* Authorization */}
          {engagement.authorization && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 mb-10 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Authorization
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {engagement.authorization}
                </p>
              </div>
            </div>
          )}

          {/* Body */}
          <div className="space-y-10">
            {engagement.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 flex items-start gap-2">
                  <span className="text-primary font-mono shrink-0">{">"}</span>
                  {section.heading}
                </h2>
                {section.body && (
                  <p className="text-muted-foreground leading-relaxed">
                    {section.body}
                  </p>
                )}
                {section.items && (
                  <ul className="mt-4 space-y-2">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="text-muted-foreground leading-relaxed flex items-start gap-2"
                      >
                        <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Stack */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-primary font-mono">{">"}</span>
              Tools and platforms
            </p>
            <div className="flex flex-wrap gap-2">
              {engagement.stack.map((item) => (
                <span
                  key={item}
                  className="px-2 py-1 text-xs font-mono rounded bg-muted text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Next */}
          <Link
            href={`/work/${next.slug}`}
            className="group mt-12 block rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <p className="text-xs text-muted-foreground font-mono mb-1">
              {"// next engagement"}
            </p>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              {next.title}
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </p>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
