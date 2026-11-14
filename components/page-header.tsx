import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Opening block for an inner page: eyebrow, serif title, standfirst. */
export function PageHeader({
  eyebrow,
  title,
  standfirst,
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  standfirst?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("container-page pt-14 pb-12 sm:pt-20 sm:pb-16", className)}>
      {eyebrow && <p className="eyebrow eyebrow-accent rise">{eyebrow}</p>}
      <h1 className="rise rise-2 mt-4 max-w-4xl font-display text-[2.5rem] leading-[1.08] text-foreground sm:text-6xl">
        {title}
      </h1>
      {standfirst && (
        <div className="rise rise-3 lede mt-6 max-w-3xl">{standfirst}</div>
      )}
      {children && <div className="rise rise-4 mt-8">{children}</div>}
    </header>
  );
}

/** Section heading with an optional editorial index ("01"). */
export function SectionHeading({
  index,
  title,
  note,
  className,
  id,
}: {
  index?: string;
  title: ReactNode;
  note?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("mb-8 border-t border-rule pt-6 sm:mb-10", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
        {index && <span className="eyebrow mono-num shrink-0 sm:w-12">{index}</span>}
        <div className="min-w-0">
          <h2 id={id} className="font-display text-[1.75rem] leading-tight text-foreground sm:text-[2.125rem]">
            {title}
          </h2>
          {note && <p className="mt-2 max-w-2xl text-muted-foreground">{note}</p>}
        </div>
      </div>
    </div>
  );
}
