import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { BlogPostContent } from "@/components/blog-post-content";
import { getBlogPost, getRelatedPosts } from "@/content/blog";
import { KNIGHT_LABS, SITE_URL } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

// Posts live on a runtime volume (admin uploads and deletions), so render on
// request rather than freezing them into the build.
export const dynamic = "force-dynamic";

/** Convention: /public/images/blog/<slug>/hero.png, generated per post. */
function heroImage(slug: string): string | null {
  const file = path.join(process.cwd(), "public", "images", "blog", slug, "hero.png");
  return fs.existsSync(file) ? `/images/blog/${slug}/hero.png` : null;
}

function isoDuration(readTime: string): string {
  const minutes = Number.parseInt(readTime, 10);
  return Number.isFinite(minutes) && minutes > 0 ? `PT${minutes}M` : "PT6M";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post not found" };

  const image = heroImage(post.slug);
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: "George Wanyoike", url: `${SITE_URL}/about` }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      siteName: "George Wanyoike",
      locale: "en_KE",
      publishedTime: post.date,
      authors: ["George Wanyoike"],
      tags: post.tags,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: post.title }]
        : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = heroImage(post.slug);
  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    abstract: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: image ? [`${SITE_URL}${image}`] : undefined,
    keywords: post.tags.join(", "),
    articleSection: post.category,
    inLanguage: "en-KE",
    wordCount,
    timeRequired: isoDuration(post.readTime),
    isAccessibleForFree: true,
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "George Wanyoike",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: KNIGHT_LABS.name,
      url: KNIGHT_LABS.url,
    },
    isPartOf: { "@type": "Blog", "@id": `${SITE_URL}/blog#blog`, url: `${SITE_URL}/blog` },
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Writing", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <BlogPostContent post={post} related={getRelatedPosts(post.slug, 3)} />
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped so post text cannot close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
