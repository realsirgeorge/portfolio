import type { Metadata } from "next";
import { PageHeader, SectionHeading } from "@/components/page-header";
import { LabDiagram } from "@/components/lab-diagram";
import { LAB_COMPONENTS, LAB_DISCIPLINE, LAB_THESIS } from "@/lib/lab-data";

export const metadata: Metadata = {
  title: "The Lab",
  description:
    "A built environment with a thesis: a hard boundary between where offensive work happens and where anything public-facing lives.",
  alternates: { canonical: "/infrastructure" },
};

const ZONE_LABEL: Record<string, string> = {
  orchestration: "Orchestration",
  offensive: "Private zone",
  boundary: "Boundary",
  public: "Public zone",
  host: "Host",
};

export default function InfrastructurePage() {
  return (
    <>
      <PageHeader
        eyebrow="The Lab"
        title="Offensive work and public publishing, separated by design"
        standfirst={<p>{LAB_THESIS}</p>}
      />

      <section className="container-page" aria-label="Architecture diagram">
        <LabDiagram />
        <p className="mt-3 text-sm text-muted-foreground md:hidden">
          The diagram scrolls sideways on small screens.
        </p>
      </section>

      <section className="container-page pt-16 sm:pt-24">
        <SectionHeading index="01" title="Why the boundary comes first" />
        <p className="max-w-3xl text-[1.0625rem] leading-[1.75] text-foreground/85">
          Anyone can list hardware. The part worth explaining is the separation
          the setup is designed to enforce, because that is the part that
          survives a mistake. Offensive work runs in a zone that is assumed to
          be contaminated. Publishing runs in a zone that is assumed to be
          reachable by anyone. The git airlock connects them, in one direction
          only, and every other component here either serves that separation
          or is downstream of it.
        </p>
      </section>

      <section className="container-page pt-16 sm:pt-24">
        <SectionHeading index="02" title="Components" />
        <ul className="grid gap-x-10 md:grid-cols-2">
          {LAB_COMPONENTS.map((component) => (
            <li key={component.id} className="reveal border-t border-border py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl text-foreground">{component.name}</h3>
                <span className="tag">{ZONE_LABEL[component.zone]}</span>
              </div>
              <p className="mt-1 text-sm text-primary">{component.role}</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">{component.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pt-16 sm:pt-24">
        <SectionHeading index="03" title="Operational discipline" />
        <ul className="grid gap-x-10 md:grid-cols-2">
          {LAB_DISCIPLINE.map((item) => (
            <li key={item.heading} className="reveal border-t border-border py-6">
              <h3 className="font-display text-xl text-foreground">{item.heading}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
