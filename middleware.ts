import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'gotxring_admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
