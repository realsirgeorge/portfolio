// This file aggregates all blog posts from individual files
// Supports both .ts (legacy) and .md (new) blog posts
// To add a new blog post, either:
// 1. Create a new .md file in this directory (recommended)
// 2. Create a new .ts file and import it here

import type { BlogPost } from "@/lib/blog-types";
import { getAllBlogPosts as getMarkdownPosts, getBlogPost as getMarkdownPost } from "@/lib/blog-loader";

// Import all legacy TypeScript blog posts
import thmBlueWriteup from "./thm-blue-writeup";
import htbLameWalkthrough from "./htb-lame-walkthrough";
import zeroTrustArchitectureGuide from "./zero-trust-architecture-guide";
import burpSuiteTutorial from "./burp-suite-tutorial";
import networkSegmentationStrategies from "./network-segmentation-strategies";
import incidentResponsePlaybook from "./incident-response-playbook";
import localAuthorityPico from "./local-authority-pico";

// Legacy TypeScript posts
const legacyPosts: BlogPost[] = [
  thmBlueWriteup,
  htbLameWalkthrough,
  zeroTrustArchitectureGuide,
  burpSuiteTutorial,
  networkSegmentationStrategies,
  incidentResponsePlaybook,
  localAuthorityPico,
];

// Get all posts (merge legacy .ts and new .md posts).
// Drafts (frontmatter `draft: true`) are excluded unless includeDrafts is set,
// which only the authenticated admin listing does.
export function getAllBlogPosts(options: { includeDrafts?: boolean } = {}): BlogPost[] {
  const markdownPosts = getMarkdownPosts().filter(
    (p) => options.includeDrafts || !p.draft
  );
  
  // Merge both sources, avoiding duplicates by slug
  const allPosts = [...legacyPosts];
  const existingSlugs = new Set(legacyPosts.map(p => p.slug));
  
  for (const mdPost of markdownPosts) {
    if (!existingSlugs.has(mdPost.slug)) {
      allPosts.push(mdPost);
    }
  }
  
  // Sort by date (newest first)
  return allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Export for backward compatibility
export const blogPosts: BlogPost[] = getAllBlogPosts();

// Helper function to get a single post by slug
// Checks both legacy .ts posts and new .md posts
export function getBlogPost(slug: string): BlogPost | undefined {
  // First check legacy posts
  const legacyPost = legacyPosts.find((post) => post.slug === slug);
  if (legacyPost) {
    return legacyPost;
  }
  
  // Then check markdown posts (drafts are never served publicly)
  const post = getMarkdownPost(slug);
  return post && !post.draft ? post : undefined;
}

// Helper function to get posts with optional filtering
// Supports pagination via getPaginatedBlogPosts from blog-loader
export function getBlogPosts(
  category?: string,
  searchQuery?: string
): BlogPost[] {
  const allPosts = getAllBlogPosts();
  let posts = [...allPosts];

  if (category && category !== "all") {
    posts = posts.filter((post) => post.category === category);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    posts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Sort by date, newest first
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Pagination interface
export interface PaginatedBlogPosts {
  posts: BlogPost[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    limit: number;
  };
}

// Pagination function that works with all posts (both .ts and .md)
export function getPaginatedBlogPosts(
  page: number = 1,
  limit: number = 10,
  category?: string,
  searchQuery?: string
): PaginatedBlogPosts {
  let posts = getBlogPosts(
    category && category !== 'all' ? category : undefined,
    searchQuery || undefined
  );
  
  // Calculate pagination
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  
  // Get paginated posts
  const paginatedPosts = posts.slice(startIndex, endIndex);
  
  return {
    posts: paginatedPosts,
    pagination: {
      currentPage,
      totalPages,
      totalPosts,
      limit,
    },
  };
}

// Get all unique tags from all posts
export function getAllTags(): string[] {
  const tags = new Set<string>();
  const allPosts = getAllBlogPosts();
  for (const post of allPosts) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

// Get related posts based on tags
export function getRelatedPosts(
  currentSlug: string,
  limit: number = 3
): BlogPost[] {
  const currentPost = getBlogPost(currentSlug);
  if (!currentPost) return [];

  const allPosts = getAllBlogPosts();
  const otherPosts = allPosts.filter((post) => post.slug !== currentSlug);

  // Score posts by number of matching tags
  const scoredPosts = otherPosts.map((post) => {
    const matchingTags = post.tags.filter((tag) =>
      currentPost.tags.includes(tag)
    ).length;
    const sameCategory = post.category === currentPost.category ? 1 : 0;
    return {
      post,
      score: matchingTags * 2 + sameCategory,
    };
  });

  // Sort by score and return top N
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}
