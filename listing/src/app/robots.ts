import type { MetadataRoute } from 'next';

import { BASE_PATH } from '@/lib/base-path';
import { ALLOW_INDEXING, absoluteUrl } from '@/site/lib/seo';

// Crawlers only read robots.txt at the domain root, which the main site serves.
// The main site copies these rules; this file is kept for the app's own vercel.app address.

export default function robots(): MetadataRoute.Robots {
  // Staging/preview: keep every crawler out until NEXT_PUBLIC_ALLOW_INDEXING=true.
  if (!ALLOW_INDEXING) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/ads-manager', '/ppc-preview/', '/compare', '/saved', '/*/project'].map(
          (p) => BASE_PATH + p,
        ),
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
