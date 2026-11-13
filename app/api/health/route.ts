// Health check endpoint for Docker healthcheck
// GET /api/health

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { status: 'healthy', timestamp: new Date().toISOString() },
    { status: 200 }
  );
}

