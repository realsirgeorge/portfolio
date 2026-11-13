// Logout API endpoint
// POST /api/admin/logout

import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/session';

export async function POST(_request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

    // Clear session cookie
    clearSessionCookie(response);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

