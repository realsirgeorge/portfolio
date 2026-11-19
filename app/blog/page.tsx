import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PostRow, CATEGORY_LABEL, formatDate } from "@/components/post-row";
import { getBlogPosts, getAllBlogPosts } from "@/content/blog";
import { categories } from "@/lib/blog-types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Writing by George Wanyoike: lessons from engagements, CTF writeups, tooling posts and network engineering notes.",
  alternates: { canonical: "/blog" },
};

// Posts live on a runtime volume and can change without a rebuild.
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { category: rawCategory, q: rawQuery } = await searchParams;
  const category = categories.some((c) => c.value === rawCategory) ? rawCategory! : "all";
  const query = (rawQuery ?? "").slice(0, 100).trim();

  const posts = getBlogPosts(category === "all" ? undefined : category, query || undefined);
  const filtered = category !== "all" || query !== "";
  const featured = filtered ? [] : getAllBlogPosts().filter((p) => p.featured).slice(0, 2);
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const rest = posts.filter((p) => !featuredSlugs.has(p.slug));

  const hrefFor = (value: string) => {
    const params = new URLSearchParams();
    if (value !== "all") params.set("category", value);
    if (query) params.set("q", query);
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <>
      <PageHeader
        eyebrow="Writing"
        title="Notes from the work"
        standfirst={
          <p>
            Lessons from engagements, CTF writeups, tooling posts and network
            engineering notes. Client details are always removed.
          </p>
        }
      />

      <div className="container-page">
        <div className="flex flex-col gap-5 border-y border-border py-5 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Filter by category">
            <ul className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.value}>
                  <Link
                    href={hrefFor(c.value)}
                    aria-current={category === c.value ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm transition-colors",
                      category === c.value
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    )}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <form role="search" action="/blog" method="get" className="relative w-full md:w-72">
            {category !== "all" && <input type="hidden" name="category" value={category} />}
            <label htmlFor="blog-search" className="sr-only">Search writing</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="blog-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search titles and tags"
              maxLength={100}
              className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-[0.9375rem] text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
            />
          </form>
        </div>

        {featured.length > 0 && (
          <section aria-label="Featured" className="grid gap-px overflow-hidden border-b border-border md:grid-cols-2">
            {featured.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block py-10 md:pr-10 md:odd:border-r md:odd:border-border md:even:pl-10">
                <p className="eyebrow eyebrow-accent">Featured · {CATEGORY_LABEL[post.category] ?? post.category}</p>
                <h2 className="mt-3 font-display text-3xl leading-tight text-foreground group-hover:text-primary sm:text-[2.25rem]">
                  {post.title}
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <p className="eyebrow mt-4">
                  <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readTime}
                </p>
              </Link>
            ))}
          </section>
        )}

        {rest.length > 0 ? (
          <ol className="border-b border-border">
            {rest.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </ol>
        ) : (
          <div className="py-16">
            <p className="font-display text-2xl text-foreground">Nothing matches that yet.</p>
            <Link href="/blog" className="link-quiet mt-3 inline-block text-muted-foreground">
              Clear the filters
            </Link>
          </div>
        )}
        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
          {filtered ? " match" : " published"}.
        </p>
      </div>
    </>
  );
}
