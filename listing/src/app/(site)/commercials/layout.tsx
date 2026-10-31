import { pageMetadata } from '@/site/lib/seo';

export const metadata = pageMetadata({
  title: 'Commercial Offices & Retail Spaces for Sale and Lease in Mumbai',
  description:
    'Grade-A office floors, corporate HQ spaces and premium retail for sale and lease in BKC, Lower Parel, Worli and South Mumbai, advised by Parmar Properties since 1981.',
  path: '/commercials',
});

export default function CommercialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
