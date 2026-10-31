import type { Metadata } from 'next';
import { AdsManager } from '@/site/components/ppc/AdsManager';

export const metadata: Metadata = {
  title: { absolute: 'Ads Manager | Parmar Properties' },
  robots: { index: false, follow: false },
};

export default function AdsManagerPage() {
  return <AdsManager />;
}
