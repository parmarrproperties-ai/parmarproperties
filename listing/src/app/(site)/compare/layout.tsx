import type { Metadata } from 'next';

import { NOINDEX } from '@/site/lib/seo';

// Personal, browser-only list: never indexed.
export const metadata: Metadata = { title: 'Compare Properties', robots: NOINDEX };

export default function ComparePropertiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
