// Delete blog post API endpoint
// DELETE /api/admin/delete-blog

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import fs from 'fs';
import path from 'path';
import { InputValidator } from '@/lib/input-validator';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession(request);
    if (!session || !session.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { slug } = body;

    // Validate slug is provided
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Validate slug format
    const slugValidation = InputValidator.validateSlug(slug);
    if (!slugValidation.valid) {
      return NextResponse.json(
        { error: slugValidation.error },
        { status: 400 }
      );
    }

    // Construct file path (only delete .md files, not legacy .ts files)
    const filename = `${slug}.md`;
    const filePath = path.join(BLOG_DIR, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Verify it's a file (not a directory)
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    // Verify it's a .md file (prevent deletion of other files)
    if (!filePath.endsWith('.md')) {
      return NextResponse.json(
        { error: 'Can only delete markdown blog posts' },
        { status: 400 }
      );
    }

    // Prevent deletion of template file
    if (filename.startsWith('_')) {
      return NextResponse.json(
        { error: 'Cannot delete template files' },
        { status: 403 }
      );
    }

    // Delete the file
    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
      slug,
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    
    // Handle specific file system errors
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

