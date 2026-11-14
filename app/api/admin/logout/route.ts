// Logout API endpoint
// POST /api/admin/logout

import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, revokeSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    revokeSession(request);
    const response = NextResponse.json({ success: true, message: 'Logout successful' });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
