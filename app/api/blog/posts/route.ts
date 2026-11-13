// Blog posts API endpoint
// GET /api/blog/posts?page=1&category=ctf&search=query

import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, getPaginatedBlogPosts } from '@/content/blog';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    // Get paginated posts
    const { posts, pagination } = getPaginatedBlogPosts(
      page,
      10, // 10 posts per page
      category && category !== 'all' ? category : undefined,
      search || undefined
    );

    // Get all posts for featured section
    const allPosts = getBlogPosts(
      category && category !== 'all' ? category : undefined,
      search || undefined
    );
    const featuredPosts = allPosts.filter((post) => post.featured);

    return NextResponse.json({
      posts,
      featuredPosts: featuredPosts.slice(0, 2),
      pagination,
      totalPosts: allPosts.length,
    });
  } catch (error) {
    console.error('Blog posts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

