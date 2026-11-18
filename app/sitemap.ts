import type { MetadataRoute } from "next";
import { ENGAGEMENTS } from "@/lib/portfolio-data";
import { getAllBlogPosts } from "@/content/blog";
import { SITE_URL } from "@/lib/site";
import { getAllTags } from "@/lib/tags";

// Rebuilt on request so posts uploaded through the admin appear without a deploy.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/work", "/knight-labs", "/about", "/blog", "/open-for-work", "/library", "/resume", "/contact"];

  return [
    {
      url: `${SITE_URL}/blog/series/31-nights`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...pages.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...ENGAGEMENTS.map((e) => ({
      url: `${SITE_URL}/work/${e.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...getAllBlogPosts().map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...getAllTags().filter((tag) => tag.count >= 2).map((tag) => ({
      url: `${SITE_URL}/blog/tag/${tag.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
