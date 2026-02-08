// middleware.ts (simplified example)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('session')?.value;
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/cart'];

  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    // Redirect to login page if unauthenticated
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Allow access to other routes
  return NextResponse.next();
}
