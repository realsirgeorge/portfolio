import Link from "next/link";
import type { BlogPost } from "@/lib/blog-types";

export const CATEGORY_LABEL: Record<string, string> = {
  ctf: "CTF writeup",
  security: "Security",
  tutorial: "Tutorial",
  network: "Network",
};

export function formatDate(date: string, style: "long" | "short" = "long"): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: style === "long" ? "long" : "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** One post as an editorial row. Server-rendered. */
export function PostRow({ post }: { post: BlogPost }) {
  return (
    <li className="reveal border-t border-border">
      <Link href={`/blog/${post.slug}`} className="group grid gap-3 py-7 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-3">
          <p className="eyebrow">
            <time dateTime={post.date}>{formatDate(post.date, "short")}</time>
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {CATEGORY_LABEL[post.category] ?? post.category} · {post.readTime}
          </p>
        </div>
        <div className="md:col-span-9">
          <h3 className="font-display text-xl leading-snug text-foreground transition-colors group-hover:text-primary sm:text-2xl">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 leading-relaxed text-muted-foreground">{post.excerpt}</p>
          )}
        </div>
      </Link>
    </li>
  );
}
