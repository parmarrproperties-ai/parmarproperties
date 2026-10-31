'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/site/components/layout/Navbar';
import { Footer } from '@/site/components/layout/Footer';

/** PPC landing pages (/<slug>/project) and /ads-manager render without the site nav and footer. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname() || '';
  const bare = path.endsWith('/project') || path.startsWith('/ads-manager') || path.startsWith('/ppc-preview');
  if (bare) return <main className="flex-1">{children}</main>;
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
