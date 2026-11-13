import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { EngagementRow } from "@/components/engagement-row";
import { ENGAGEMENTS, KIND_LABEL, type EngagementKind } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Security audits, research, builds, and operations. Client identities are anonymized by contract; the technical substance is not.",
};

const GROUP_ORDER: EngagementKind[] = ["audit", "research", "build", "operations"];

const GROUP_NOTE: Record<EngagementKind, string> = {
  audit: "Authorized testing under signed agreement",
  research: "Self-directed and bug bounty work",
  build: "Systems shipped, not prototyped",
  operations: "Production infrastructure with paying customers",
};

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main" className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Engagements"
            comment="Security audits, research, builds & operations"
            standfirst="Client identities are anonymized by contract and stay that way. Where a case study would be thin without a name, it gets more technical depth instead of attribution. Every figure below came out of the engagement it sits under."
          />

          {GROUP_ORDER.map((kind) => {
            const items = ENGAGEMENTS.filter((e) => e.kind === kind);
            if (items.length === 0) return null;
            return (
              <section key={kind} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <span className="text-primary font-mono">{">"}</span>
                    {KIND_LABEL[kind]}
                  </h2>
                  <span className="text-xs text-muted-foreground font-mono">
                    {`// ${GROUP_NOTE[kind]}`}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {items.map((engagement) => (
                    <EngagementRow
                      key={engagement.slug}
                      engagement={engagement}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
