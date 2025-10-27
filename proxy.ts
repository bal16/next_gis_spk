import { NextResponse, type NextRequest } from 'next/server';
import { getUserSession } from '@/lib/auth/session'; 

const authPath = '/auth';
const adminRoot = '/admin';
const userHome = '/';
const adminPaths = [adminRoot, '/admin/settings'];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const { isAuthenticated, isAdmin, error } = await getUserSession(request);

  const isAuthPath = path.startsWith(authPath);
  const isAccessingAdminPath = adminPaths.some(p => path.startsWith(p));
  const isPublicPath = isAuthPath || path === userHome;


  if (error === 'invalid_token') {
    const response = NextResponse.redirect(new URL(authPath, request.url));
    response.cookies.delete('session-token');
    return response;
  }

  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL(authPath, request.url));
  }

  if (isAuthenticated && !isAdmin && isAccessingAdminPath) {
    return NextResponse.redirect(new URL(`${userHome}?error=unauthorized`, request.url));
  }

  if (isAuthenticated && isAuthPath) {
    const redirectUrl = isAdmin ? adminRoot : userHome;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // if (isAuthenticated && isAdmin && path === userHome) {
  //   return NextResponse.redirect(new URL(adminRoot, request.url));
  // }

  return NextResponse.next();
}

// Config matcher Anda (tetap sama)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|styles).*)'],
};