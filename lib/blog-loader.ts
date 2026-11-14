// Blog loader for markdown files
// Supports both .md (new) and .ts (legacy) blog posts
// SERVER-ONLY: This file uses Node.js fs module and must only be imported in server components/API routes

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BlogPost } from './blog-types';
import { InputValidator } from './input-validator';

// Ensure this module is only used on the server
if (typeof window !== 'undefined') {
  throw new Error('blog-loader.ts is server-only and cannot be imported in client components');
}

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

/**
 * Calculate read time from content (words / 200)
 */
function calculateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min`;
}

/**
 * Parse markdown file and convert to BlogPost
 */
function parseMarkdownFile(filePath: string, filename: string): BlogPost | null {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Extract slug from filename (remove .md extension)
    const slug = filename.replace(/\.md$/, '');
    
    // Validate required fields
    if (!data.slug || !data.title || !data.date || !data.category) {
      console.warn(`Skipping ${filename}: Missing required fields`);
      return null;
    }
    
    // Validate slug matches filename
    if (data.slug !== slug) {
      console.warn(`Skipping ${filename}: Slug mismatch (frontmatter: ${data.slug}, filename: ${slug})`);
      return null;
    }
    
    // Validate category
    const categoryValidation = InputValidator.validateCategory(data.category);
    if (!categoryValidation.valid) {
      console.warn(`Skipping ${filename}: ${categoryValidation.error}`);
      return null;
    }
    
    // Validate date
    const dateValidation = InputValidator.validateDate(data.date);
    if (!dateValidation.valid) {
      console.warn(`Skipping ${filename}: ${dateValidation.error}`);
      return null;
    }
    
    // Build BlogPost object
    const post: BlogPost = {
      slug: data.slug,
      title: data.title,
      date: data.date,
      category: data.category as BlogPost['category'],
      tags: Array.isArray(data.tags) ? data.tags : [],
      excerpt: data.excerpt || '',
      readTime: data.readTime || calculateReadTime(content),
      featured: data.featured === true,
      content: content.trim(),
      draft: data.draft === true || data.published === false,
    };
    
    return post;
  } catch (error) {
    console.error(`Error parsing ${filename}:`, error);
    return null;
  }
}

/**
 * Get all blog posts from markdown files
 */
export function getAllBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];
  
  if (!fs.existsSync(BLOG_DIR)) {
    console.warn('Blog directory does not exist:', BLOG_DIR);
    return posts;
  }
  
  const files = fs.readdirSync(BLOG_DIR);
  
  for (const file of files) {
    // Only process .md files
    if (!file.endsWith('.md')) {
      continue;
    }
    
    // Skip template file
    if (file.startsWith('_')) {
      continue;
    }
    
    const filePath = path.join(BLOG_DIR, file);
    const stat = fs.statSync(filePath);
    
    // Skip directories
    if (!stat.isFile()) {
      continue;
    }
    
    const post = parseMarkdownFile(filePath, file);
    if (post) {
      posts.push(post);
    }
  }
  
  // Sort by date (newest first)
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get a single blog post by slug
 */
export function getBlogPost(slug: string): BlogPost | undefined {
  const posts = getAllBlogPosts();
  return posts.find((post) => post.slug === slug);
}

/**
 * Get paginated blog posts with filtering
 */
export interface PaginatedBlogPosts {
  posts: BlogPost[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    limit: number;
  };
}

export function getPaginatedBlogPosts(
  page: number = 1,
  limit: number = 10,
  category?: string,
  searchQuery?: string
): PaginatedBlogPosts {
  let posts = getAllBlogPosts();
  
  // Apply category filter
  if (category && category !== 'all') {
    posts = posts.filter((post) => post.category === category);
  }
  
  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    posts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }
  
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

/**
 * Check if a slug already exists
 */
export function slugExists(slug: string): boolean {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  return fs.existsSync(filePath);
}

