import Link from "next/link";
import { Shield, Network, Code, Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  KIND_LABEL,
  type Engagement,
  type EngagementKind,
} from "@/lib/portfolio-data";
import { SeverityBar } from "@/components/severity-bar";

const KIND_ICON: Record<EngagementKind, typeof Shield> = {
  audit: Shield,
  research: Search,
  build: Code,
  operations: Network,
};

/** One engagement, as a card. Leads with the strongest real figure. */
export function EngagementRow({ engagement }: { engagement: Engagement }) {
  const lead = engagement.figures[0];
  const Icon = KIND_ICON[engagement.kind];

  return (
    <Link
      href={`/work/${engagement.slug}`}
      className={cn(
        "group block rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/50 cursor-pointer",
        engagement.featured && "ring-1 ring-primary/20"
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                {engagement.title}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {engagement.client}
              </p>
            </div>
          </div>
          {engagement.featured && (
            <span className="px-2 py-1 text-xs font-mono bg-primary/10 text-primary rounded border border-primary/20 shrink-0">
              Featured
            </span>
          )}
        </div>

        {/* Headline figure */}
        {lead && (
          <div className="flex items-baseline gap-2 mb-4">
            <span className="figure-num text-3xl font-bold text-primary">
              {lead.value}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {lead.label}
            </span>
          </div>
        )}

        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {engagement.summary}
        </p>

        {engagement.findings && (
          <div className="mb-4">
            <SeverityBar findings={engagement.findings} />
          </div>
        )}

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {engagement.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs font-mono rounded bg-muted text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {engagement.stack.length > 4 && (
            <span className="px-2 py-1 text-xs font-mono rounded bg-muted text-muted-foreground">
              +{engagement.stack.length - 4}
            </span>
          )}
        </div>

        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
            <span className="text-primary font-mono shrink-0">{">"}</span>
            {engagement.whyItMatters}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-4 text-primary text-sm font-medium">
          <span className="font-mono text-xs">{KIND_LABEL[engagement.kind]}</span>
          <span className="ml-auto flex items-center">
            View case study
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
