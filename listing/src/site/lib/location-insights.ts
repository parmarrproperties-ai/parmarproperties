import type { Property } from '@/site/types/property';
import type { CommercialProperty } from '@/site/data/commercials';
import type { LocationInfo } from '@/site/lib/supabase/locations';
import type { InsightArticle } from '@/site/lib/supabase/insights';
import { BUSINESS } from '@/site/lib/seo';
import type { SegmentKind } from '@/lib/segments';

/**
 * Plain-language facts for a location / category page, worked out from the listings
 * that are actually published, so every page has its own content instead of a repeated template.
 */
export type Fact = { label: string; value: string };
export type Faq = { question: string; answer: string };

export interface SegmentSummary {
  /** e.g. "luxury collection residences" */
  phrase: string;
  paragraphs: string[];
  facts: Fact[];
  faqs: Faq[];
}

const PHRASES: Record<string, string> = {
  'residential/buy': 'flats for sale',
  'residential/new-launches': 'new launch flats',
  'residential/luxury-collection': 'ultra luxury flats',
  'commercial/buy': 'commercial properties for sale',
  'commercial/pre-lease': 'pre-lease commercial spaces',
  'commercial/rent': 'commercial spaces for rent',
};

const uniq = (items: (string | undefined | null)[]) =>
  Array.from(new Set(items.map((i) => (i ?? '').trim()).filter(Boolean)));

const list = (items: string[], max = 6) =>
  items.length <= max
    ? items.join(', ').replace(/, ([^,]*)$/, items.length > 1 ? ' and $1' : ', $1')
    : `${items.slice(0, max).join(', ')} and ${items.length - max} more`;

function priced<T extends { price: number; priceFormatted: string }>(items: T[]): T[] {
  return items.filter((i) => i.price > 0 && i.priceFormatted !== 'Price on Request').sort((a, b) => a.price - b.price);
}

/** "₹5.85 Cr to ₹22.23 Cr" (or one figure, or null when nothing is priced). */
function rangeText<T extends { price: number; priceFormatted: string }>(items: T[]): string | null {
  const p = priced(items);
  if (p.length === 0) return null;
  const lo = p[0].priceFormatted;
  const hi = p[p.length - 1].priceFormatted;
  return lo === hi ? lo : `${lo} to ${hi}`;
}

function areaText(areas: number[]): string | null {
  const a = areas.filter((n) => n > 0).sort((x, y) => x - y);
  if (a.length === 0) return null;
  const f = (n: number) => n.toLocaleString('en-IN');
  return a[0] === a[a.length - 1] ? `${f(a[0])} sq ft` : `${f(a[0])} to ${f(a[a.length - 1])} sq ft`;
}

/** "3 & 4 BHK" and "2 and 3 BHK" across projects become one line: "2, 3 and 4 BHK". */
function configurationsOf(properties: Property[]): string[] {
  const nums = Array.from(
    new Set(properties.flatMap((p) => Array.from((p.bhk || '').matchAll(/\d+(?:\.\d+)?/g)).map((m) => Number(m[0])))),
  ).sort((a, b) => a - b);
  return nums.length > 0 ? [`${list(nums.map(String), 8)} BHK`] : uniq(properties.map((p) => p.bhk));
}

export function summariseResidential(
  location: LocationInfo,
  category: string,
  properties: Property[],
): SegmentSummary {
  const loc = location.name;
  const phrase = PHRASES[`residential/${category}`] ?? 'residences';
  const names = properties.map((p) => p.title);
  const developers = uniq(properties.map((p) => p.developerName));
  const configs = configurationsOf(properties);
  const price = rangeText(properties);
  const onRequest = properties.length - priced(properties).length;
  const area = areaText(properties.map((p) => p.carpetArea));
  const status = uniq(properties.map((p) => p.possession));

  const facts: Fact[] = [
    { label: 'Projects listed', value: String(properties.length) },
    ...(price ? [{ label: 'Price range', value: price + (onRequest > 0 ? ` (${onRequest} on request)` : '') }] : []),
    ...(configs.length ? [{ label: 'Configurations', value: list(configs, 8) }] : []),
    ...(area ? [{ label: 'Carpet area', value: area }] : []),
    ...(status.length ? [{ label: 'Possession', value: list(status) }] : []),
    ...(developers.length ? [{ label: 'Developers', value: list(developers) }] : []),
  ];

  const paragraphs = [
    `${properties.length === 1 ? 'One project is' : `${properties.length} projects are`} currently listed as ${phrase} in ${loc} on Parmar Properties: ${list(names)}.` +
      (price ? ` Asking prices run from ${price}.` : ' Prices are shared on request.') +
      (developers.length ? ` The developers include ${list(developers)}.` : ''),
    location.description
      ? `About ${loc}: ${location.description}`
      : `${loc} is one of the South Mumbai addresses our advisors cover.`,
    location.keyEnclaves.length
      ? `Key enclaves and roads in ${loc} include ${list(location.keyEnclaves)}.`
      : '',
  ].filter(Boolean);

  const faqs: Faq[] = [
    {
      question: `What is the price range of ${phrase} in ${loc}?`,
      answer: price
        ? `Listed ${phrase} in ${loc} are priced from ${price}. These are asking prices, so ask our advisors for the current cost sheet and any taxes and charges.`
        : `Prices for ${phrase} in ${loc} are shared on request. Contact our advisors for the current cost sheet.`,
    },
    {
      question: `Which projects are available in ${loc}?`,
      answer: `${list(names)}${developers.length ? `, by ${list(developers)}` : ''}.`,
    },
    ...(status.length
      ? [{
          question: `Are these projects ready to move in?`,
          answer: `Current status across the listed projects: ${list(status)}. Each project page gives its possession details and MahaRERA registration.`,
        }]
      : []),
    {
      question: `How do I verify a project's RERA registration?`,
      answer: `Each listing shows its MahaRERA registration number where available. You can check any number at maharera.maharashtra.gov.in before you book.`,
    },
    {
      question: `How can I arrange a site visit in ${loc}?`,
      answer: `Call ${BUSINESS.telephone} or message us on WhatsApp and an advisor will arrange a private viewing.`,
    },
  ];

  return { phrase, paragraphs, facts, faqs };
}

export function summariseCommercial(
  location: LocationInfo,
  category: string,
  commercials: CommercialProperty[],
): SegmentSummary {
  const loc = location.name;
  const phrase = PHRASES[`commercial/${category}`] ?? 'commercial spaces';
  const rent = category !== 'buy';
  const names = commercials.map((c) => c.title);
  const types = uniq(commercials.map((c) => c.propertyType));
  const price = rangeText(commercials);
  const area = areaText(commercials.map((c) => c.carpetArea));
  const status = uniq(commercials.map((c) => c.possession));

  const facts: Fact[] = [
    { label: 'Spaces listed', value: String(commercials.length) },
    ...(price ? [{ label: rent ? 'Monthly rent' : 'Price range', value: price }] : []),
    ...(area ? [{ label: 'Carpet area', value: area }] : []),
    ...(types.length ? [{ label: 'Space types', value: list(types) }] : []),
    ...(status.length ? [{ label: 'Possession', value: list(status) }] : []),
  ];

  const paragraphs = [
    `${commercials.length === 1 ? 'One space is' : `${commercials.length} spaces are`} currently listed as ${phrase} in ${loc}: ${list(names)}.` +
      (price ? (rent ? ` Monthly rent runs ${price}.` : ` Asking prices run from ${price}.`) : ' Pricing is shared on request.'),
    location.description ? `About ${loc}: ${location.description}` : '',
  ].filter(Boolean);

  const faqs: Faq[] = [
    {
      question: `What is the ${rent ? 'rent' : 'price'} of ${phrase} in ${loc}?`,
      answer: price
        ? `Listed ${phrase} in ${loc} are ${rent ? 'available at' : 'priced from'} ${price}. Ask our advisors for the current terms${rent ? ', deposit and lock-in' : ''}.`
        : `Terms for ${phrase} in ${loc} are shared on request. Contact our advisors.`,
    },
    {
      question: `What sizes are available in ${loc}?`,
      answer: area ? `Listed spaces have a carpet area of ${area}.` : `Sizes are shared on request.`,
    },
    {
      question: `How can I arrange a viewing in ${loc}?`,
      answer: `Call ${BUSINESS.telephone} or message us on WhatsApp and an advisor will arrange a visit.`,
    },
  ];

  return { phrase, paragraphs, facts, faqs };
}

/** Published market guides that are about this location (named in the title, subtitle or address). */
export function guidesAbout(articles: InsightArticle[], location: LocationInfo, max = 3): InsightArticle[] {
  const name = location.name.toLowerCase();
  const slug = location.slug.toLowerCase();
  return articles
    .filter((a) => `${a.title} ${a.subtitle}`.toLowerCase().includes(name) || a.slug.toLowerCase().includes(slug))
    .slice(0, max);
}

export function kindLabel(kind: SegmentKind): string {
  return kind === 'residential' ? 'Residential' : 'Commercial';
}

/** Locations named in a market guide's title, subtitle or address. */
export function locationsMentioned(article: InsightArticle, locations: LocationInfo[], max = 3): LocationInfo[] {
  const text = `${article.title} ${article.subtitle} ${article.slug.replace(/-/g, ' ')}`.toLowerCase();
  return locations.filter((l) => text.includes(l.name.toLowerCase())).slice(0, max);
}

/** Content for a budget page ("Flats above ₹10 crore"), built from the listings that fall in the band. */
export function summariseBudget(
  bandPhrase: string,
  properties: Property[],
): SegmentSummary {
  const names = properties.map((p) => p.title);
  const areas = uniq(properties.map((p) => p.location));
  const developers = uniq(properties.map((p) => p.developerName));
  const configs = configurationsOf(properties);
  const price = rangeText(properties);
  const area = areaText(properties.map((p) => p.carpetArea));
  const status = uniq(properties.map((p) => p.possession));
  const busiest = areas
    .map((a) => ({ a, n: properties.filter((p) => p.location === a).length }))
    .sort((x, y) => y.n - x.n)[0];

  const facts: Fact[] = [
    { label: 'Flats listed', value: String(properties.length) },
    ...(price ? [{ label: 'Price range', value: price }] : []),
    ...(areas.length ? [{ label: 'Locations', value: list(areas, 8) }] : []),
    ...(configs.length ? [{ label: 'Configurations', value: list(configs, 8) }] : []),
    ...(area ? [{ label: 'Carpet area', value: area }] : []),
    ...(status.length ? [{ label: 'Possession', value: list(status) }] : []),
    ...(developers.length ? [{ label: 'Developers', value: list(developers, 8) }] : []),
  ];

  const paragraphs = [
    `${properties.length === 1 ? 'One flat is' : `${properties.length} flats are`} currently listed ${bandPhrase} on Parmar Properties, across ${list(areas, 8)}: ${list(names, 8)}.` +
      (price ? ` Asking prices run from ${price}.` : ''),
    busiest && areas.length > 1
      ? `${busiest.a} has the most flats in this budget (${busiest.n}). Each location page has the neighbourhood, nearby landmarks and every flat listed there.`
      : '',
    'Prices shown are asking prices and can change, so ask our advisors for the current cost sheet, taxes and charges before you decide.',
  ].filter(Boolean);

  const faqs: Faq[] = [
    {
      question: `How many flats ${bandPhrase} are listed?`,
      answer: `${properties.length} ${properties.length === 1 ? 'flat is' : 'flats are'} listed ${bandPhrase} right now${areas.length ? `, in ${list(areas, 8)}` : ''}.`,
    },
    ...(configs.length
      ? [{ question: `What sizes are available ${bandPhrase}?`, answer: `Configurations ${bandPhrase} include ${list(configs, 8)}${area ? `, with a carpet area of ${area}` : ''}.` }]
      : []),
    {
      question: `Are these flats ready to move in?`,
      answer: status.length
        ? `Current status across these flats: ${list(status)}. Each project page gives its possession details and MahaRERA registration.`
        : `Each project page gives its possession details and MahaRERA registration.`,
    },
    {
      question: `How do I check that a project is RERA registered?`,
      answer: `Each listing shows its MahaRERA registration number where available. You can check any number on the MahaRERA website (maharera.maharashtra.gov.in) before you book.`,
    },
    {
      question: `How can I arrange a site visit?`,
      answer: `Call ${BUSINESS.telephone} or message us on WhatsApp and an advisor will arrange a private viewing.`,
    },
  ];

  return { phrase: `flats ${bandPhrase}`, paragraphs, facts, faqs };
}
