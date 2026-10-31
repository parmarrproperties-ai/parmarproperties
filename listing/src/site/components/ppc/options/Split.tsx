import React from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import type { Property } from '@/site/types/property';
import { withOnwards } from '@/site/lib/price';
import { EnquiryForm, Logo } from '../shared';
import { CTA, DISCLAIMER, FOCUS, PHONE_DISPLAY, PHONE_TEL, ppcData } from '../kit';

/** Option C: the photograph stays put on the left while the details scroll on the right, with the form first. Gallery-like, calm. */
export function Split({ property }: { property: Property }) {
  const d = ppcData(property);
  return (
    <div className="bg-mineral text-ink font-sans min-h-screen pb-16 md:pb-0 lg:grid lg:grid-cols-2">
      <div className="relative h-[68svh] lg:h-screen lg:sticky lg:top-0 bg-ink text-white">
        {d.hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={d.hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/10 to-ink/30" aria-hidden />
        <span className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-white px-3 py-1.5"><Logo className="h-7 w-auto" /></span>
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-10">
          <p className="text-base text-white/85">{[property.location, property.propertyType].filter(Boolean).join(' · ')}</p>
          <h1 className="mt-2 font-serif text-5xl sm:text-6xl lg:text-7xl leading-none">{property.title}</h1>
          <p className="mt-4 text-2xl sm:text-3xl font-semibold">{withOnwards(property.priceFormatted)}</p>
        </div>
      </div>

      <main className="px-4 sm:px-10 lg:px-14 py-10 sm:py-14 space-y-14">
        <div className="flex items-center justify-between gap-4">
          {property.tagline ? <p className="text-xl text-slateText max-w-md">{property.tagline}</p> : <span />}
          <a href={PHONE_TEL} className={`hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brick shrink-0 ${FOCUS}`}>
            <Phone className="w-4 h-4" aria-hidden /> {PHONE_DISPLAY}
          </a>
        </div>

        <div className="bg-white border border-line p-6 sm:p-8 shadow-lg shadow-ink/5">
          <EnquiryForm property={property} />
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-y border-line py-8">
          {d.facts.map(([k, v]) => (
            <div key={k}><dt className="text-sm text-slateText">{k}</dt><dd className="mt-1 text-lg font-semibold wrap-break-word">{v}</dd></div>
          ))}
        </dl>

        {property.description ? <p className="text-lg leading-relaxed">{property.description}</p> : null}
        {property.highlights.length > 0 ? (
          <ul className="divide-y divide-line border-y border-line">{property.highlights.map((h) => <li key={h} className="py-3">{h}</li>)}</ul>
        ) : null}

        {d.gallery.length > 0 ? (
          <section aria-label="Gallery" className="grid grid-cols-2 gap-2">
            {d.gallery.slice(0, 4).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt={`${property.title}, view ${i + 2}`} loading="lazy" className={`w-full object-cover aspect-4/3 ${i === 0 && d.gallery.length % 2 === 1 ? 'col-span-2' : ''}`} />
            ))}
          </section>
        ) : null}

        {d.variants.length > 0 ? (
          <section>
            <h2 className="font-serif text-3xl mb-5">Residences</h2>
            <ul className="divide-y divide-line border-y border-line">
              {d.variants.map((v, i) => (
                <li key={`${v.id}-${i}`} className="py-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <span className="font-semibold">{v.title}</span>
                  <span className="text-slateText">{v.area} sq.ft</span>
                  <span className="font-semibold">{withOnwards(v.price)}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {property.amenities.length > 0 ? (
          <section>
            <h2 className="font-serif text-3xl mb-5">Amenities</h2>
            <ul className="sm:columns-2 gap-x-8">{property.amenities.map((x) => <li key={x} className="py-3 border-b border-line break-inside-avoid">{x}</li>)}</ul>
          </section>
        ) : null}

        {d.mapsUrl ? (
          <a href={d.mapsUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 min-h-11 font-semibold underline underline-offset-4 ${FOCUS}`}>
            Open in Google Maps <ArrowRight className="w-4 h-4" aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}

        <div className="bg-ink text-white p-8 flex flex-wrap items-center justify-between gap-5">
          <h2 className="font-serif text-2xl sm:text-3xl">See {property.title} in person</h2>
          <a href="#enquire" className={CTA}>Request private viewing</a>
        </div>
        <footer className="text-sm text-slateText">{DISCLAIMER}</footer>
      </main>

      <a href={PHONE_TEL} className={`md:hidden fixed bottom-0 inset-x-0 z-20 flex items-center justify-center gap-2 min-h-14 bg-brick text-white font-semibold ${FOCUS}`}>
        <Phone className="w-4 h-4" aria-hidden /> Call {PHONE_DISPLAY}
      </a>
    </div>
  );
}
