// Session management utilities
// Stateless, HMAC-signed session tokens in an HTTP-only cookie.
//
// Token format: <id>.<expiresAtUnixSeconds>.<hmacSha256(id.expiresAt)>
// - The expiry is inside the signed payload, so a stolen cookie stops working
//   at expiry even if the browser ignores Max-Age.
// - Logout adds the token id to an in-memory revocation list until it expires.
//   (Single-container deployment; a restart clears the list, and rotating
//   SESSION_SECRET invalidates every outstanding session.)

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHmac, timingSafeEqual } from 'crypto';
import { getSessionSecret, getSessionDuration, getAdminPassword, getAdminUserId } from './env';

export const SESSION_COOKIE_NAME = 'admin_session';

interface SessionData {
  authenticated: boolean;
  userId: string;
  expiresAt: number;
}

const revoked = new Map<string, number>(); // token id -> expiresAt (ms)

function pruneRevoked(now = Date.now()) {
  for (const [id, exp] of revoked) {
    if (exp <= now) revoked.delete(id);
  }
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length || !/^[0-9a-f]+$/.test(a)) return false;
  return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
}

/** Verify a raw cookie value. Returns the token id and expiry, or null. */
export function verifySessionValue(value: string | undefined | null): { id: string; expiresAt: number } | null {
  if (!value) return null;
  let secret: string;
  try {
    secret = getSessionSecret();
  } catch {
    return null;
  }

  const parts = value.split('.');
  if (parts.length !== 3) return null;
  const [id, expStr, signature] = parts;
  if (!/^[0-9a-f]{64}$/.test(id) || !/^\d{1,12}$/.test(expStr)) return null;

  if (!safeEqualHex(signature, sign(`${id}.${expStr}`, secret))) return null;

  const expiresAt = Number(expStr) * 1000;
  const now = Date.now();
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return null;

  pruneRevoked(now);
  if (revoked.has(id)) return null;

  return { id, expiresAt };
}

/** Create a signed session token. */
export function createSession(): string {
  const id = randomBytes(32).toString('hex');
  const exp = Math.floor(Date.now() / 1000) + getSessionDuration();
  return `${id}.${exp}.${sign(`${id}.${exp}`, getSessionSecret())}`;
}

/** Get session from request cookie. */
export function getSession(request: NextRequest): SessionData | null {
  const verified = verifySessionValue(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!verified) return null;
  return {
    authenticated: true,
    userId: getAdminUserId() ?? 'admin',
    expiresAt: verified.expiresAt,
  };
}

/** Revoke the session carried by this request, if any. */
export function revokeSession(request: NextRequest): void {
  const verified = verifySessionValue(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (verified) revoked.set(verified.id, verified.expiresAt);
}

/** Set session cookie in response. */
export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: getSessionDuration(),
    path: '/',
  });
}

/** Clear session cookie. */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

/**
 * Verify password against the environment variable.
 * Both sides are HMAC'd first so the comparison is constant-time and does not
 * leak the password length.
 */
export function verifyPassword(password: string): boolean {
  let adminPassword: string;
  try {
    adminPassword = getAdminPassword();
  } catch {
    return false;
  }
  const key = randomBytes(32);
  const a = createHmac('sha256', key).update(password, 'utf8').digest();
  const b = createHmac('sha256', key).update(adminPassword, 'utf8').digest();
  return timingSafeEqual(a, b);
}

// ---------------------------------------------------------------------------
// Login throttling (in-memory, per client IP)
// ---------------------------------------------------------------------------

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; first: number }>();

export function clientIp(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Seconds until the client may try again, or 0 if not locked out. */
export function loginRetryAfter(ip: string): number {
  const entry = failures.get(ip);
  if (!entry) return 0;
  const elapsed = Date.now() - entry.first;
  if (elapsed > WINDOW_MS) {
    failures.delete(ip);
    return 0;
  }
  return entry.count >= MAX_FAILURES ? Math.ceil((WINDOW_MS - elapsed) / 1000) : 0;
}

export function recordLoginFailure(ip: string): void {
  const now = Date.now();
  const entry = failures.get(ip);
  if (!entry || now - entry.first > WINDOW_MS) {
    failures.set(ip, { count: 1, first: now });
  } else {
    entry.count += 1;
  }
  if (failures.size > 10_000) {
    for (const [key, value] of failures) {
      if (now - value.first > WINDOW_MS) failures.delete(key);
    }
  }
}

export function clearLoginFailures(ip: string): void {
  failures.delete(ip);
}

/**
 * Validate environment variables on startup
 * Re-exports from env.ts for backward compatibility
 */
export { validateEnvironment } from './env';
