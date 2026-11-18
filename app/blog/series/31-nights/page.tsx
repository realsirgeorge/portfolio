import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PostRow } from "@/components/post-row";
import { getAllBlogPosts } from "@/content/blog";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "31 Nights: two CTFs, 28 writeups",
  description:
    "A full October of CTF writeups: 31 Nights of Cyber and 31 Nights of r00t. Cryptography, web exploitation, forensics, Android reversing and industrial protocols, documented end to end.",
  keywords: [
    "31 Nights of Cyber",
    "31 Nights of r00t",
    "CTF writeups",
    "capture the flag",
    "security writeups",
  ],
  alternates: { canonical: "/blog/series/31-nights" },
  openGraph: {
    type: "website",
    title: "31 Nights: two CTFs, 28 writeups",
    description:
      "A full October of CTF writeups — crypto, web, forensics, Android and ICS, documented end to end.",
    url: `${SITE_URL}/blog/series/31-nights`,
  },
};

export const dynamic = "force-dynamic";

const PARTS = [
  {
    key: "31 Nights of Cyber",
    title: "Act one — 31 Nights of Cyber",
    blurb:
      "Fifteen standard challenges: padding oracles, Android root checks, TCP covert channels, ECDSA malleability, a reentrancy vault, prototype pollution, DNS exfiltration and a shell blocklist that lost to printf.",
  },
  {
    key: "31 Nights of r00t",
    title: "Act two — 31 Nights of r00t",
    blurb:
      "Thirteen event challenges, many with decoy validators: Windows event logs, ghost flight-recorder entries, a WASM virtual machine, Wi-Fi beacons, memory forensics and a Modbus intrusion.",
  },
] as const;

export default function SeriesPage() {
  const posts = getAllBlogPosts();
  const parts = PARTS.map((part) => ({
    ...part,
    posts: posts
      .filter((post) => post.tags.includes(part.key))
      .sort((a, b) => a.date.localeCompare(b.date)),
  })).filter((part) => part.posts.length > 0);

  const total = parts.reduce((sum, part) => sum + part.posts.length, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/blog/series/31-nights#page`,
    url: `${SITE_URL}/blog/series/31-nights`,
    name: "31 Nights: two CTFs, 28 writeups",
    description:
      "A full October of CTF writeups across cryptography, web exploitation, forensics, Android reversing and industrial protocols.",
    isPartOf: { "@type": "Blog", "@id": `${SITE_URL}/blog#blog`, url: `${SITE_URL}/blog` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts
        .filter((post) => PARTS.some((part) => post.tags.includes(part.key)))
        .map((post, index) => ({
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
        eyebrow="Series"
        title="31 Nights: two CTFs, 28 writeups"
        standfirst={
          <p>
            Every October I try to do a challenge a night. This year I did two
            events back to back — {total} writeups in total, all documented here
            with the dead ends included. The flags are long dead; the technique
            is not.
          </p>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/blog" className="btn btn-ghost">
            All writing
          </Link>
          <a href="/feed.xml" className="btn btn-ghost">
            RSS
          </a>
        </div>
      </PageHeader>

      <div className="container-page space-y-20 pb-8">
        {parts.map((part, index) => (
          <section key={part.key} aria-labelledby={`part-${index}`}>
            <div className="border-t border-rule pt-6">
              <p className="eyebrow mono-num">{String(index + 1).padStart(2, "0")}</p>
              <h2 id={`part-${index}`} className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
                {part.title}
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{part.blurb}</p>
              <p className="eyebrow mt-4">{part.posts.length} writeups</p>
            </div>
            <ol className="mt-6 border-b border-border">
              {part.posts.map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </ol>
          </section>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
