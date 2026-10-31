import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertyDetailClient } from '@/site/components/property/PropertyDetailClient';
import { JsonLd } from '@/site/components/seo/JsonLd';
import type { Property } from '@/site/types/property';
import { NOINDEX, SITE_NAME, absoluteUrl, breadcrumbJsonLd, pageMetadata } from '@/site/lib/seo';
import {
  fetchPropertyBySlug,
  fetchPropertyCards,
  fetchPublishedPropertySlugs,
  pickSimilarProperties,
} from '@/site/lib/supabase/properties';

// Supabase fetches are cached by Next; without this a publish/edit/unpublish never shows.
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await fetchPublishedPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

/** Imported listings carry boilerplate SEO copy; treat it as unset so the facts below are used. */
function isBoilerplate(text: string | undefined, property: Property): boolean {
  if (!text) return true;
  return (
    text.startsWith(`${property.title} in `) && text.endsWith(`| ${SITE_NAME}`)
  ) || (text.startsWith('Explore ') && text.includes('Review project details'));
}

function propertyArea(property: Property): string {
  return property.subLocation && property.subLocation !== property.location
    ? `${property.subLocation}, ${property.location}`
    : property.location;
}

function propertySeoTitle(property: Property): string {
  if (!isBoilerplate(property.metaTitle, property)) return property.metaTitle as string;
  const kind = property.propertyType === 'Apartment' ? 'Apartments' : `${property.propertyType}s`;
  return property.bhk
    ? `${property.title}, ${property.location}: ${property.bhk} ${kind}`
    : `${property.title}, ${property.location}: Price, Floor Plans & RERA`;
}

function propertySeoDescription(property: Property): string {
  if (!isBoilerplate(property.metaDescription, property)) return property.metaDescription as string;
  const parts = [
    `${property.title} in ${propertyArea(property)}, Mumbai${property.developerName ? ` by ${property.developerName}` : ''}.`,
    property.bhk
      ? `${property.bhk} ${property.propertyType.toLowerCase()}s, ${property.possession.toLowerCase()}.`
      : `${property.possession}.`,
    property.priceFormatted !== 'Price on Request' ? `From ${property.priceFormatted}.` : 'Price on request.',
    /^P[R\d]/.test(property.reraId) ? `MahaRERA ${property.reraId}.` : '',
    'View photos, floor plans and enquire with Parmar Properties.',
  ];
  return parts.filter(Boolean).join(' ').replace(/\s+/g, ' ');
}

function propertyJsonLd(property: Property) {
  const url = absoluteUrl(`/properties/${property.slug}`);
  const hasPrice = property.price > 0 && property.priceFormatted !== 'Price on Request';
  const images = property.images.filter((src) => src && !src.endsWith('/placeholder.png'));
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${url}#listing`,
    url,
    name: property.title,
    description: propertySeoDescription(property),
    image: images.slice(0, 6).map((src) => absoluteUrl(src)),
    provider: { '@id': `${absoluteUrl('/')}#organization` },
    about: {
      '@type': property.propertyType === 'Apartment' || property.propertyType === 'Sea-Facing Apartment' ? 'Apartment' : 'Residence',
      name: property.title,
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.subLocation || undefined,
        addressLocality: property.location,
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
      ...(property.coordinates
        ? { geo: { '@type': 'GeoCoordinates', latitude: property.coordinates.lat, longitude: property.coordinates.lng } }
        : {}),
      ...(property.carpetArea > 0
        ? { floorSize: { '@type': 'QuantitativeValue', value: property.carpetArea, unitCode: 'FTK' } }
        : {}),
      ...(property.amenities.length > 0
        ? { amenityFeature: property.amenities.map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })) }
        : {}),
    },
    ...(hasPrice
      ? {
          offers: {
            '@type': 'Offer',
            price: Math.round(property.price * 10_000_000),
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url,
          },
        }
      : {}),
    ...(/^P[R\d]/.test(property.reraId)
      ? { identifier: { '@type': 'PropertyValue', name: 'MahaRERA', value: property.reraId } }
      : {}),
  };
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const property = await fetchPropertyBySlug(params.slug);
  if (!property) return { title: 'Property not found', robots: NOINDEX };
  const title = propertySeoTitle(property);
  return pageMetadata({
    title,
    absoluteTitle: title.endsWith(`| ${SITE_NAME}`),
    description: propertySeoDescription(property),
    path: `/properties/${property.slug}`,
    image: property.coverImage,
  });
}

export default async function PropertyDetailPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const property = await fetchPropertyBySlug(params.slug);

  if (!property) {
    notFound();
  }

  const catalog = await fetchPropertyCards();
  const similarProperties = pickSimilarProperties(property, catalog);

  return (
    <>
      <JsonLd
        data={[
          propertyJsonLd(property),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Properties', path: '/properties' },
            { name: property.title, path: `/properties/${property.slug}` },
          ]),
        ]}
      />
      <PropertyDetailClient property={property} similarProperties={similarProperties} />
    </>
  );
}
