import { pageMetadata } from '@/site/lib/seo';

export const metadata = pageMetadata({
  title: 'South Mumbai Neighbourhood Guides: Worli, Malabar Hill, Prabhadevi & More',
  description:
    'Compare Mumbai micro-markets for luxury homes: price ranges, rates per sq ft, lifestyle and key enclaves in Worli, Malabar Hill, Prabhadevi, Lower Parel, Sewri and more.',
  path: '/locations',
});

export default function LocationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
