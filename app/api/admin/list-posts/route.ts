// List posts API endpoint
// GET /api/admin/list-posts

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getAllBlogPosts as getMarkdownPosts } from '@/lib/blog-loader';
import { getAllBlogPosts as getAllPosts } from '@/content/blog';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession(request);
    if (!session || !session.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all posts (both .ts and .md)
    const allPosts = getAllPosts({ includeDrafts: true });
    
    // Get markdown posts to identify which posts are markdown
    const markdownPosts = getMarkdownPosts();
    const markdownSlugs = new Set(markdownPosts.map(p => p.slug));

    // Return metadata only (no full content)
    const postsMetadata = allPosts.map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      category: post.category,
      tags: post.tags,
      featured: post.featured,
      excerpt: post.excerpt,
      readTime: post.readTime,
      draft: post.draft === true,
      isMarkdown: markdownSlugs.has(post.slug), // Flag to indicate if post is markdown
    }));

    return NextResponse.json({
      posts: postsMetadata,
      total: postsMetadata.length,
    });
  } catch (error) {
    console.error('List posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

