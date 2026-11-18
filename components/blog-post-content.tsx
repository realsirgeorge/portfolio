import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import type { BlogPost } from "@/lib/blog-types";
import { CopyButton } from "@/components/copy-button";
import { CATEGORY_LABEL, formatDate } from "@/components/post-row";
import { getAllTags, tagToSlug } from "@/lib/tags";
import { KNIGHT_LABS } from "@/lib/site";

function textOf(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement(node)) {
    return textOf((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Top-level (##) headings, ignoring fenced code. */
function extractHeadings(markdown: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  let fenced = false;
  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    const match = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const text = match[1].replace(/[*_`]/g, "").trim();
    const id = headingId(text);
    if (text && id) headings.push({ id, text });
  }
  return headings;
}

/** Server-rendered markdown. Raw HTML in posts is not rendered (no rehype-raw). */
function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre: ({ children }) => {
          const codeEl = React.Children.toArray(children).find(
            (c): c is React.ReactElement => React.isValidElement(c)
          );
          const props = (codeEl?.props ?? {}) as { className?: string; children?: React.ReactNode };
          const language = /language-([\w-]+)/.exec(props.className || "")?.[1] ?? "text";
          const code = textOf(props.children).replace(/\n$/, "");
          return (
            <div className="not-prose my-7 overflow-hidden rounded-lg border border-white/10 bg-[#0b0e10] text-[#e6e1d6]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-1.5">
                <span className="font-mono text-xs text-[#a7a297]">{language}</span>
                <CopyButton text={code} />
              </div>
              <pre className="overflow-x-auto p-4">{children}</pre>
            </div>
          );
        },
        a: ({ href, children }) => {
          const external = !!href && /^https?:\/\//.test(href);
          return (
            <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {children}
            </a>
          );
        },
        img: ({ src, alt }) => (
          // Post images live on the runtime volume or public/; dimensions are unknown.
          <img src={typeof src === "string" ? src : undefined} alt={alt || ""} loading="lazy" decoding="async" />
        ),
        h2: ({ children }) => {
          const text = textOf(children);
          return (
            <h2 id={headingId(text)} className="scroll-mt-24">
              {children}
            </h2>
          );
        },
        h3: ({ children }) => {
          const text = textOf(children);
          return (
            <h3 id={headingId(text)} className="scroll-mt-24">
              {children}
            </h3>
          );
        },
        table: ({ children }) => (
          <div className="overflow-x-auto">
            <table>{children}</table>
          </div>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export function BlogPostContent({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const headings = extractHeadings(post.content);
  // Only link tags that have a substantive archive; one-post tags stay plain.
  const archiveTags = new Set(
    getAllTags()
      .filter((t) => t.count >= 2)
      .map((t) => t.slug)
  );

  return (
    <article>
      <header className="container-prose pt-10 pb-10 sm:pt-14">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All writing
        </Link>
        <p className="eyebrow eyebrow-accent rise mt-10">
          {CATEGORY_LABEL[post.category] ?? post.category} ·{" "}
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readTime}
        </p>
        <h1 className="rise rise-2 mt-4 font-display text-[2.25rem] leading-[1.1] text-foreground sm:text-5xl">
          {post.title}
        </h1>
        {post.excerpt && <p className="rise rise-3 lede mt-6">{post.excerpt}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
          <p className="text-sm text-muted-foreground">
            By <Link href="/about" className="link-quiet text-foreground">George Wanyoike</Link>
          </p>
          <CopyButton
            label="Copy link"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          />
        </div>
      </header>

      <div className="container-prose">
        {headings.length >= 3 && (
          <nav aria-labelledby="toc-heading" className="mb-10 border-y border-border py-5">
            <p id="toc-heading" className="eyebrow mb-3">
              In this post
            </p>
            <ol className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="prose-article">
          <Markdown content={post.content} />
        </div>

        {post.tags.length > 0 && (
          <ul className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6" aria-label="Tags">
            {post.tags.map((tag) => (
              <li key={tag}>
                {archiveTags.has(tagToSlug(tag)) ? (
                  <Link
                    href={`/blog/tag/${tagToSlug(tag)}`}
                    className="tag transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {tag}
                  </Link>
                ) : (
                  <span className="tag">{tag}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className="container-prose mt-16 border-t border-border pt-8" aria-labelledby="author-heading">
        <p id="author-heading" className="eyebrow eyebrow-accent">
          About the author
        </p>
        <p className="mt-3 max-w-2xl font-display text-xl leading-snug text-foreground">
          George Wanyoike (&ldquo;Sir G&rdquo;) is a security practitioner in Nairobi. He
          runs full-scope audits, owns and operates an ISP, and founded Knight Labs.
        </p>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          Client work is anonymised by contract. The methodology, the tooling and
          the mistakes are documented here so the next person does not have to
          rediscover them.
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm">
          <Link href="/about" className="link-quiet text-foreground">About George</Link>
          <Link href="/work" className="link-quiet text-foreground">Engagements</Link>
          <a href={KNIGHT_LABS.url} rel="noopener" className="link-quiet text-foreground">
            Knight Labs
          </a>
          <Link href="/contact" className="link-quiet text-foreground">Get in touch</Link>
        </div>
      </aside>

      {related.length > 0 && (
        <aside className="container-prose mt-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="eyebrow mb-2">Related</h2>
          <ul>
            {related.map((r) => (
              <li key={r.slug} className="border-t border-border">
                <Link href={`/blog/${r.slug}`} className="group block py-5">
                  <p className="font-display text-xl leading-snug text-foreground group-hover:text-primary">{r.title}</p>
                  <p className="eyebrow mt-1.5">
                    {CATEGORY_LABEL[r.category] ?? r.category} · {r.readTime}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
