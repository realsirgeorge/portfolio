import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { KIND_LABEL, type Engagement } from "@/lib/portfolio-data";
import { SeverityBar } from "@/components/severity-bar";

/**
 * One engagement as an editorial row: kind and client on the left, the title
 * and summary in the middle, the strongest real figure on the right.
 */
export function EngagementRow({
  engagement,
  index,
}: {
  engagement: Engagement;
  index?: number;
}) {
  const lead = engagement.figures[0];

  return (
    <li className="reveal border-t border-border">
      <Link
        href={`/work/${engagement.slug}`}
        className="group grid gap-4 py-8 sm:py-10 md:grid-cols-12 md:gap-8"
      >
        <div className="md:col-span-3">
          <p className="eyebrow">
            {index !== undefined && (
              <span className="mono-num mr-3 text-foreground/60">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
            {KIND_LABEL[engagement.kind]}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{engagement.client}</p>
        </div>

        <div className="md:col-span-6">
          <h3 className="font-display text-2xl leading-snug text-foreground transition-colors group-hover:text-primary sm:text-[1.75rem]">
            {engagement.title}
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">{engagement.summary}</p>
          {engagement.findings && (
            <div className="mt-5 max-w-sm">
              <SeverityBar findings={engagement.findings} />
            </div>
          )}
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground">
            Read the case study
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>

        {lead && (
          <div className="md:col-span-3 md:text-right">
            <p className="figure-num text-4xl leading-none text-foreground sm:text-5xl">
              {lead.value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{lead.label}</p>
          </div>
        )}
      </Link>
    </li>
  );
}
