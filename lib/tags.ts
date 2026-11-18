import { getAllBlogPosts } from "@/content/blog";
import type { BlogPost } from "@/lib/blog-types";

/** URL-safe tag slug: "Network Forensics" -> "network-forensics". */
export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface TagSummary {
  tag: string;
  slug: string;
  count: number;
}

/** Every tag used by a published post, most-used first. */
export function getAllTags(): TagSummary[] {
  const counts = new Map<string, { tag: string; count: number }>();
  for (const post of getAllBlogPosts()) {
    for (const tag of post.tags) {
      const slug = tagToSlug(tag);
      if (!slug) continue;
      const existing = counts.get(slug);
      if (existing) existing.count += 1;
      else counts.set(slug, { tag, count: 1 });
    }
  }
  return [...counts.entries()]
    .map(([slug, value]) => ({ slug, tag: value.tag, count: value.count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Resolve a slug back to the display tag and its posts. */
export function getTagBySlug(slug: string): { tag: string; posts: BlogPost[] } | null {
  const posts = getAllBlogPosts().filter((post) =>
    post.tags.some((tag) => tagToSlug(tag) === slug)
  );
  if (posts.length === 0) return null;
  const display = posts.flatMap((post) => post.tags).find((tag) => tagToSlug(tag) === slug);
  return display ? { tag: display, posts } : null;
}
