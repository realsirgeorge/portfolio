import type { Severity } from "@/lib/portfolio-data";

/**
 * Findings by severity. Severity colour appears here and nowhere else,
 * so a red mark always means the same thing.
 */

const ORDER: Severity[] = ["critical", "high", "medium", "low"];

const BAR: Record<Severity, string> = {
  critical: "bg-sev-critical",
  high: "bg-sev-high",
  medium: "bg-sev-medium",
  low: "bg-sev-low",
};

const TEXT: Record<Severity, string> = {
  critical: "text-sev-critical",
  high: "text-sev-high",
  medium: "text-sev-medium",
  low: "text-sev-low",
};

export function SeverityBar({
  findings,
  showLegend = true,
}: {
  findings: Record<Severity, number>;
  showLegend?: boolean;
}) {
  const total = ORDER.reduce((sum, key) => sum + findings[key], 0);
  if (total === 0) return null;

  return (
    <div>
      <div
        className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={ORDER.map((k) => `${findings[k]} ${k}`).join(", ")}
      >
        {ORDER.map((key) =>
          findings[key] > 0 ? (
            <span
              key={key}
              className={BAR[key]}
              style={{ width: `${(findings[key] / total) * 100}%` }}
            />
          ) : null
        )}
      </div>
      {showLegend && (
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
          {ORDER.map((key) =>
            findings[key] > 0 ? (
              <span key={key} className="text-muted-foreground">
                <span className={`figure-num font-bold ${TEXT[key]}`}>
                  {findings[key]}
                </span>{" "}
                {key}
              </span>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
