import type { MetadataRoute } from 'next';

import { ALLOW_INDEXING, absoluteUrl } from '@/site/lib/seo';

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
        disallow: ['/admin', '/api/', '/ads-manager', '/ppc-preview/', '/compare', '/saved', '/*/project'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
