import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/about',
  '/contact',
  '/terms',
  '/',
  '/category',
  '/category/:cid',
  '/terms-and-conditions',
  '/privacy-policy',
  '/shipping-policy',
  '/return-policy',
  '/return-form',
  '/product/:pname',
  '/product',
];


export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static assets, API routes, and public pages
  if (
    pathname.startsWith('/_next') || // Next.js JS/CSS
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/api') ||   // API routes
    PUBLIC_PATHS.includes(pathname) || // public pages
    pathname.startsWith('/images/') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Auth check for protected routes
  const token = req.cookies.get('session')?.value;
  console.log('this is a token', token);

  if (!token) {
    // Redirect to login if unauthenticated
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // All other requests are allowed
  return NextResponse.next();
}
