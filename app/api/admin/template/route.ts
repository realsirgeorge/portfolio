// Template API endpoint
// GET /api/admin/template
// Returns the blog post template file

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const templatePath = join(process.cwd(), 'content', 'blog', '_TEMPLATE.md');
    const templateContent = await readFile(templatePath, 'utf-8');
    
    return new NextResponse(templateContent, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error reading template:', error);
    return NextResponse.json(
      { error: 'Failed to load template' },
      { status: 500 }
    );
  }
}



