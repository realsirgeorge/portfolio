// Related posts API endpoint
// GET /api/blog/related?slug=post-slug&limit=3

import { NextRequest, NextResponse } from 'next/server';
import { getRelatedPosts } from '@/content/blog';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const limit = parseInt(searchParams.get('limit') || '3', 10);

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const relatedPosts = getRelatedPosts(slug, limit);

    return NextResponse.json({
      posts: relatedPosts,
    });
  } catch (error) {
    console.error('Related posts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

