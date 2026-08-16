import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Only check and route on the root path "/"
  if (pathname === '/') {
    // If user explicitly chose Universal or passed ?stay=1 / ?universal=1
    if (searchParams.has('universal') || searchParams.has('stay')) {
      const res = NextResponse.next();
      res.cookies.set('monsoon_pref_city', 'universal', { path: '/', maxAge: 60 * 60 * 24 * 30 });
      return res;
    }

    // Check if user has an explicit preference stored in cookie
    const userPref = req.cookies.get('monsoon_pref_city')?.value?.toLowerCase();
    if (userPref === 'universal') {
      return NextResponse.next();
    }

    // Extract geo city from edge headers (Vercel, Cloudflare, CloudFront, etc.)
    const vercelCity = req.headers.get('x-vercel-ip-city');
    const cfCity = req.headers.get('cf-ipcity');
    const cloudfrontCity = req.headers.get('cloudfront-viewer-city');
    const geoCity = (req as any).geo?.city;
    
    const detectedCity = (vercelCity || cfCity || cloudfrontCity || geoCity || userPref || '').toLowerCase().trim();

    if (detectedCity.includes('kolkata') || detectedCity.includes('calcutta')) {
      return NextResponse.redirect(new URL('/kolkata', req.url));
    }
    if (detectedCity.includes('bangalore') || detectedCity.includes('bengaluru')) {
      return NextResponse.redirect(new URL('/bangalore', req.url));
    }
    if (detectedCity.includes('mumbai') || detectedCity.includes('bombay')) {
      return NextResponse.redirect(new URL('/mumbai', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
