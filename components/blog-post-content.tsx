import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import type { BlogPost } from "@/lib/blog-types";
import { CopyButton } from "@/components/copy-button";
import { CATEGORY_LABEL, formatDate } from "@/components/post-row";

function textOf(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement(node)) {
    return textOf((node.props as { children?: React.ReactNode }).children);
  }
  return "";
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
          // eslint-disable-next-line @next/next/no-img-element
          <img src={typeof src === "string" ? src : undefined} alt={alt || ""} loading="lazy" decoding="async" />
        ),
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
        <div className="prose-article">
          <Markdown content={post.content} />
        </div>

        {post.tags.length > 0 && (
          <ul className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6" aria-label="Tags">
            {post.tags.map((tag) => (
              <li key={tag} className="tag">{tag}</li>
            ))}
          </ul>
        )}
      </div>

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
