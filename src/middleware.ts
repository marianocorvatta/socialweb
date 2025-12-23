import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitio (direct slug access)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitio).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Get base domain from environment (e.g., "vercel.app")
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'vercel.app';
  const appName = process.env.VERCEL_PROJECT_NAME || 'socialweb-wsp3';

  // Check if this is a subdomain request
  // Format: {subdomain}.vercel.app
  if (hostname.endsWith(`.${baseDomain}`) && !hostname.startsWith(`${appName}.`)) {
    // Extract subdomain
    const subdomain = hostname.replace(`.${baseDomain}`, '');

    // Rewrite to /sitio/[subdomain]
    url.pathname = `/sitio/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  // Not a subdomain - continue normally
  return NextResponse.next();
}
