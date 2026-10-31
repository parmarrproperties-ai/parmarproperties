import { pageMetadata } from '@/site/lib/seo';

export const metadata = pageMetadata({
  title: 'Mumbai Luxury Property Market Insights & Buyer Guides',
  description:
    'Research and guides on South Mumbai real estate: micro-market price trends, penthouse buying, NRI property purchase and capital gains structuring, from the Parmar Properties advisory desk.',
  path: '/market-intelligence',
});

export default function MarketIntelligenceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
