// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // Do not match api routes, static files, images
  matcher: ['/', '/(tr|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
