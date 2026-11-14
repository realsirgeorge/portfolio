// Upload blog post API endpoint
// POST /api/admin/upload-blog

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { InputValidator } from '@/lib/input-validator';
import { slugExists } from '@/lib/blog-loader';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export async function POST(request: NextRequest) {
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
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const content = formData.get('content') as string | null;

    let markdownContent: string;

    // Get content from file or direct input
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.md')) {
        return NextResponse.json(
          { error: 'File must be a .md file' },
          { status: 400 }
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File exceeds maximum size (5MB)' },
          { status: 413 }
        );
      }

      // Read file content
      const arrayBuffer = await file.arrayBuffer();
      markdownContent = Buffer.from(arrayBuffer).toString('utf-8');
    } else if (content) {
      markdownContent = content;
    } else {
      return NextResponse.json(
        { error: 'Either file or content is required' },
        { status: 400 }
      );
    }

    // Validate markdown content structure
    const contentValidation = InputValidator.validateMarkdownContent(markdownContent);
    if (!contentValidation.valid) {
      return NextResponse.json(
        { error: contentValidation.error },
        { status: 400 }
      );
    }

    // Parse frontmatter
    let frontmatter;
    try {
      const parsed = matter(markdownContent);
      frontmatter = parsed.data;
    } catch {
      return NextResponse.json(
        { error: 'Invalid YAML frontmatter' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!frontmatter.slug || !frontmatter.title || !frontmatter.date || !frontmatter.category) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, date, category' },
        { status: 400 }
      );
    }

    // Validate slug
    const slugValidation = InputValidator.validateSlug(frontmatter.slug);
    if (!slugValidation.valid) {
      return NextResponse.json(
        { error: slugValidation.error },
        { status: 400 }
      );
    }

    // Check if slug already exists
    if (slugExists(frontmatter.slug)) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    // Validate category
    const categoryValidation = InputValidator.validateCategory(frontmatter.category);
    if (!categoryValidation.valid) {
      return NextResponse.json(
        { error: categoryValidation.error },
        { status: 400 }
      );
    }

    // Validate date
    const dateValidation = InputValidator.validateDate(frontmatter.date);
    if (!dateValidation.valid) {
      return NextResponse.json(
        { error: dateValidation.error },
        { status: 400 }
      );
    }

    // Ensure blog directory exists
    if (!fs.existsSync(BLOG_DIR)) {
      fs.mkdirSync(BLOG_DIR, { recursive: true });
    }

    // Sanitize filename
    const filename = InputValidator.sanitizeFilename(`${frontmatter.slug}.md`);
    const filePath = path.join(BLOG_DIR, filename);

    // Save file
    fs.writeFileSync(filePath, markdownContent, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Blog post uploaded successfully',
      filename,
      slug: frontmatter.slug,
    });
  } catch (error) {
    console.error('Upload blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

