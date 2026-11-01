import { notFound, redirect } from 'next/navigation';

import { categoriesFor, isSegmentKind, segmentPath } from '@/lib/segments';

/** /locations/worli/residential goes to the first category, /locations/worli/residential/buy. */
export default async function LocationKindPage(props: { params: Promise<{ slug: string; kind: string }> }) {
  const { slug, kind } = await props.params;
  if (!isSegmentKind(kind)) notFound();
  redirect(segmentPath(slug.toLowerCase(), kind, categoriesFor(kind)[0].slug));
}
