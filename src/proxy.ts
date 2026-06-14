import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from "jose"

const locales = ['en', 'ar']
const defaultLocale = 'ar'

const secretKey = process.env.JWT_SECRET || "reef-super-secret-key-for-development-only";
const encodedKey = new TextEncoder().encode(secretKey);

// Protected routes that mandate a valid JWT
const protectedPaths = ['/profile', '/listings/create']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Core Locale Routing Logic
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
  }

  const currentLocale = locales.find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) || defaultLocale;
  
  // 2. JWT Protection Logic
  const isProtected = protectedPaths.some((p) => pathname.includes(p))
  
  if (isProtected) {
    const sessionCookie = request.cookies.get("reef_session")?.value;
    const loginUrl = new URL(`/${currentLocale}/login`, request.url);
    
    if (!sessionCookie) return NextResponse.redirect(loginUrl);

    try {
      await jwtVerify(sessionCookie, encodedKey, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(loginUrl); // Expired or malformed token
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}
