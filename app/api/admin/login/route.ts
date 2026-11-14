// Login API endpoint
// POST /api/admin/login

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyPassword,
  createSession,
  setSessionCookie,
  clientIp,
  loginRetryAfter,
  recordLoginFailure,
  clearLoginFailures,
} from '@/lib/session';

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const retryAfter = loginRetryAfter(ip);
  if (retryAfter > 0) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    const password = body && typeof body === 'object' ? (body as { password?: unknown }).password : undefined;

    if (!password || typeof password !== 'string' || password.length > 1024) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (!verifyPassword(password)) {
      recordLoginFailure(ip);
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    clearLoginFailures(ip);
    const response = NextResponse.json({ success: true, message: 'Login successful' });
    setSessionCookie(response, createSession());
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
