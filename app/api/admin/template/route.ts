// Template API endpoint
// GET /api/admin/template
// Returns the blog post template file (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  if (!getSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const templatePath = join(process.cwd(), 'content', 'blog', '_TEMPLATE.md');
    const templateContent = await readFile(templatePath, 'utf-8');
    return new NextResponse(templateContent, {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Error reading template:', error);
    return NextResponse.json({ error: 'Failed to load template' }, { status: 500 });
  }
}
