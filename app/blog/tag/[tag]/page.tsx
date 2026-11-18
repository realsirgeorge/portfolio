import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PostRow } from "@/components/post-row";
import { getTagBySlug } from "@/lib/tags";
import { SITE_URL } from "@/lib/site";

interface Props {
  params: Promise<{ tag: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: slug } = await params;
  const found = getTagBySlug(slug);
  if (!found) return { title: "Topic not found" };

  const title = `Posts tagged “${found.tag}”`;
  const description = `${found.posts.length} ${
    found.posts.length === 1 ? "post" : "posts"
  } on ${found.tag} by George Wanyoike — CTF writeups, security technique and network engineering notes.`;

  return {
    title,
    description,
    keywords: [found.tag, "George Wanyoike", "security writing", "CTF writeups"],
    alternates: { canonical: `/blog/tag/${slug}` },
    robots: found.posts.length >= 2 ? undefined : { index: false, follow: true },
    openGraph: { type: "website", title, description, url: `${SITE_URL}/blog/tag/${slug}` },
    twitter: { card: "summary", title, description },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag: slug } = await params;
  const found = getTagBySlug(slug);
  if (!found) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/blog/tag/${slug}#page`,
    url: `${SITE_URL}/blog/tag/${slug}`,
    name: `Posts tagged “${found.tag}”`,
    isPartOf: { "@type": "Blog", "@id": `${SITE_URL}/blog#blog`, url: `${SITE_URL}/blog` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: found.posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <PageHeader
        eyebrow="Topic"
        title={<>Posts tagged “{found.tag}”</>}
        standfirst={
          <p>
            {found.posts.length} {found.posts.length === 1 ? "post" : "posts"} filed under{" "}
            {found.tag}. Browse everything in the{" "}
            <Link href="/blog" className="link-quiet text-foreground">
              full archive
            </Link>
            .
          </p>
        }
      />
      <div className="container-page">
        <ol className="border-b border-border">
          {found.posts.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </ol>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
