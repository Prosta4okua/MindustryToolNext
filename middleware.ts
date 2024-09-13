import { defaultLocale, Locale, locales } from '@/i18n/config';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  let locale = request.cookies.get('Next-Locale')?.value as string;

  if (!locale) {
    const headers = request.headers;
    const acceptedLanguages = headers
      .get('Accept-Language')
      ?.split(/[;\-,]/)
      .filter((lang) => lang) //
      .filter((lang) => locales.includes(lang.trim().toLowerCase() as Locale));

    locale = acceptedLanguages //
      ? acceptedLanguages[0]
      : defaultLocale;
  }

  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  const currentLocale = pathname.slice(1, 3);

  if (pathnameHasLocale && currentLocale === locale) return;

  request.cookies.set('Next-Locale', locale);
  request.nextUrl.pathname = pathnameHasLocale
    ? `/${locale}/${pathname.slice(4)}`
    : `/${locale}${pathname}`;

  console.log(request.cookies.toString());

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|assets|_next/image|favicon.ico|robots.txt|.*sitemap|ads).*)',
  ],
};
