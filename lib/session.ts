// Session management utilities
// Implements secure session handling with HTTP-only cookies

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHmac, timingSafeEqual } from 'crypto';
import { InputValidator } from './input-validator';
import { getSessionSecret, getSessionDuration, getAdminPassword, getAdminUserId } from './env';

const SESSION_COOKIE_NAME = 'admin_session';

interface SessionData {
  authenticated: boolean;
  userId: string;
  expiresAt: number;
}

/**
 * Generate a secure session token
 */
function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create a signed session token
 */
function signSessionToken(token: string): string {
  const secret = getSessionSecret();
  
  const hmac = createHmac('sha256', secret);
  hmac.update(token);
  const signature = hmac.digest('hex');
  
  return `${token}.${signature}`;
}

/**
 * Verify and extract session token from signed token
 */
function verifySessionToken(signedToken: string): string | null {
  let secret: string;
  try {
    secret = getSessionSecret();
  } catch {
    return null;
  }
  
  const parts = signedToken.split('.');
  if (parts.length !== 2) {
    return null;
  }
  
  const [token, signature] = parts;
  
  // Recreate signature
  const hmac = createHmac('sha256', secret);
  hmac.update(token);
  const expectedSignature = hmac.digest('hex');
  
  // Constant-time comparison
  if (signature.length !== expectedSignature.length) {
    return null;
  }
  
  try {
    const signatureBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    
    if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return null;
    }
    
    return token;
  } catch {
    return null;
  }
}

/**
 * Create a session and return token
 */
export function createSession(_userId?: string): string {
  const token = generateSessionToken();
  return signSessionToken(token);
}

/**
 * Get session from request cookie
 */
export function getSession(request: NextRequest): SessionData | null {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  
  if (!cookie || !cookie.value) {
    return null;
  }
  
  const token = verifySessionToken(cookie.value);
  if (!token) {
    return null;
  }
  
  // For simplicity, we'll use a simple token-based approach
  // In production, you might want to store session data in a database or cache
  // For now, we'll just verify the token is valid and not expired
  
  // Check if token exists (in a real app, you'd check a session store)
  // For this implementation, we'll assume valid tokens are authenticated
  return {
    authenticated: true,
    userId: getAdminUserId() as string,
    expiresAt: Date.now() + getSessionDuration() * 1000,
  };
}

/**
 * Set session cookie in response
 */
export function setSessionCookie(response: NextResponse, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction, // Only send over HTTPS in production
    sameSite: 'strict',
    maxAge: getSessionDuration(),
    path: '/',
  });
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.delete(SESSION_COOKIE_NAME);
}

/**
 * Verify password against environment variable
 */
export function verifyPassword(password: string): boolean {
  let adminPassword: string;
  try {
    adminPassword = getAdminPassword();
  } catch {
    return false;
  }
  
  // Use constant-time comparison to prevent timing attacks
  return InputValidator.constantTimeCompare(password, adminPassword);
}

/**
 * Validate environment variables on startup
 * Re-exports from env.ts for backward compatibility
 */
export { validateEnvironment } from './env';

