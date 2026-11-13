// Login API endpoint
// POST /api/admin/login

import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession, setSessionCookie } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Verify password
    const isValid = verifyPassword(password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create session
    const sessionToken = createSession();
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
    });

    // Set session cookie
    setSessionCookie(response, sessionToken);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

