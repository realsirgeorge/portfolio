import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { LabDiagram } from "@/components/lab-diagram";
import { LAB_COMPONENTS, LAB_DISCIPLINE, LAB_THESIS } from "@/lib/lab-data";

export const metadata: Metadata = {
  title: "The Lab",
  description:
    "A built environment with a thesis: a hard boundary between where offensive work happens and where anything public-facing lives.",
};

const ZONE_LABEL: Record<string, string> = {
  orchestration: "orchestration",
  offensive: "private zone",
  boundary: "boundary",
  public: "public zone",
  host: "host",
};

export default function InfrastructurePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main" className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="The Lab"
            comment="Offensive work and public publishing, separated by design"
            standfirst={LAB_THESIS}
          />

          <LabDiagram />

          <section className="mt-12 mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="text-primary font-mono">{">"}</span>
              Why the boundary comes first
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              Anyone can list hardware. The part worth explaining is the
              separation the setup is designed to enforce, because that is the
              part that survives a mistake. Offensive work runs in a zone that
              is assumed to be contaminated. Publishing runs in a zone that is
              assumed to be reachable by anyone. The git airlock is what
              connects them, in one direction only, and every other component
              here either serves that separation or is downstream of it.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="text-primary font-mono">{">"}</span>
              Components
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {LAB_COMPONENTS.map((component) => (
                <div
                  key={component.id}
                  className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {component.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {component.role}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-mono rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                      {ZONE_LABEL[component.zone]}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {component.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="text-primary font-mono">{">"}</span>
              Operational discipline
            </h2>
            <div className="space-y-6 max-w-3xl">
              {LAB_DISCIPLINE.map((item) => (
                <div
                  key={item.heading}
                  className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6"
                >
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.heading}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
