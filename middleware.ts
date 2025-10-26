import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Daftar path publik (tidak perlu autentikasi)
const publicPaths = ['/','/login', '/register'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const token = request.cookies.get('session-token')?.value;

  const isPublicPath = publicPaths.some(publicPath =>
    path.startsWith(publicPath)
  );

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua path KECUALI:
     * - /api (rute API)
     * - /_next/static (file statis Next.js)
     * - /_next/image (optimalisasi gambar Next.js)
     * - /favicon.ico (file favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};