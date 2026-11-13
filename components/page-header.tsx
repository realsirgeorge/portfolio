export function PageHeader({
  title,
  standfirst,
  meta,
  comment,
}: {
  title: string;
  standfirst: string;
  meta?: string;
  /** Short mono subtitle rendered as a code comment. */
  comment?: string;
}) {
  return (
    <div className="mb-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
        {title}
      </h1>
      {comment && (
        <p className="text-muted-foreground font-mono text-sm">
          {`// ${comment}`}
        </p>
      )}
      {meta && (
        <p className="text-muted-foreground font-mono text-xs mt-2">{meta}</p>
      )}
      <p className="text-muted-foreground leading-relaxed max-w-3xl mt-4">
        {standfirst}
      </p>
    </div>
  );
}
