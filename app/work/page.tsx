import type { Metadata } from "next";
import { PageHeader, SectionHeading } from "@/components/page-header";
import { EngagementRow } from "@/components/engagement-row";
import { ENGAGEMENTS, KIND_LABEL, type EngagementKind } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Security audits, research, builds and operations by George Wanyoike. Client identities are anonymised by contract; the technical substance is not.",
  alternates: { canonical: "/work" },
};

const GROUP_ORDER: EngagementKind[] = ["audit", "research", "build", "operations"];

const GROUP_NOTE: Record<EngagementKind, string> = {
  audit: "Authorised testing under signed agreement.",
  research: "Self-directed and bug bounty work.",
  build: "Systems shipped, not prototyped.",
  operations: "Production infrastructure with paying customers.",
};

const PLURAL: Record<EngagementKind, string> = {
  audit: "Security audits",
  research: "Research",
  build: "Builds",
  operations: "Operations",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Engagements, research and the things I run"
        standfirst={
          <p>
            Client identities are anonymised by contract and stay that way.
            Specific findings and financial figures remain with the client.
            Where a case study would be thin without a name, it gets more
            technical depth instead of attribution.
          </p>
        }
      />

      <div className="container-page space-y-20 sm:space-y-28">
        {GROUP_ORDER.map((kind, gi) => {
          const items = ENGAGEMENTS.filter((e) => e.kind === kind);
          if (items.length === 0) return null;
          return (
            <section key={kind} aria-label={KIND_LABEL[kind]}>
              <SectionHeading index={String(gi + 1).padStart(2, "0")} title={PLURAL[kind]} note={GROUP_NOTE[kind]} />
              <ol className="border-b border-border">
                {items.map((engagement) => (
                  <EngagementRow key={engagement.slug} engagement={engagement} />
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </>
  );
}
