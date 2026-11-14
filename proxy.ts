// Gate the admin UI on the server. The admin API routes enforce the session
// themselves; this only stops the dashboard shell being served to visitors
// without a valid, unexpired, correctly signed session cookie.

import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionValue } from '@/lib/session';

export function proxy(request: NextRequest) {
  const valid = verifySessionValue(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!valid) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export const config = {
  matcher: ['/admin'],
};
