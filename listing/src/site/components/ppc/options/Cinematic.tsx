import { withBasePath } from "@/lib/base-path";
import React from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import type { Property } from '@/site/types/property';
import { withOnwards } from '@/site/lib/price';
import { EnquiryForm, Logo } from '../shared';
import { CTA, DISCLAIMER, FOCUS, PHONE_DISPLAY, PHONE_TEL, ppcData } from '../kit';

/** Option A: one photograph fills the first screen; the callback form is a strip at its foot. Dark, quiet, image-led. */
export function Cinematic({ property }: { property: Property }) {
  const d = ppcData(property);
  return (
    <div className="bg-ink text-white font-sans min-h-screen pb-16 md:pb-0">
      <section className="relative min-h-svh flex flex-col">
        {d.hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={withBasePath(d.hero)} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-b from-ink/60 via-ink/10 to-ink" aria-hidden />
        <header className="relative flex items-center justify-between px-4 sm:px-10 py-4">
          <span className="bg-white px-3 py-1.5"><Logo className="h-7 w-auto" /></span>
          <a href={PHONE_TEL} className={`inline-flex items-center gap-2 text-sm font-semibold ${FOCUS}`}>
            <Phone className="w-4 h-4" aria-hidden /> <span className="hidden sm:inline">{PHONE_DISPLAY}</span><span className="sm:hidden">Call</span>
          </a>
        </header>
        <div className="relative mt-auto px-4 sm:px-10 pb-8 sm:pb-12 max-w-7xl w-full mx-auto">
          <p className="text-base sm:text-lg text-white/85">{[property.location, property.propertyType, property.bhk].filter(Boolean).join(' · ')}</p>
          <h1 className="mt-2 font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.98] max-w-4xl">{property.title}</h1>
          {property.tagline ? <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl">{property.tagline}</p> : null}
          <p className="mt-6 text-3xl sm:text-4xl font-semibold">{withOnwards(property.priceFormatted)}</p>
          <div className="mt-8 bg-ink/80 backdrop-blur border border-white/25 p-5 sm:p-6">
            <EnquiryForm property={property} inline dark title="" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-10 py-16 sm:py-24 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-8 content-start">
          {d.facts.map(([k, v]) => (
            <div key={k}>
              <dt className="text-sm text-white/65">{k}</dt>
              <dd className="mt-1 font-serif text-2xl sm:text-3xl wrap-break-word">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="space-y-6 max-w-prose">
          {property.description ? <p className="text-lg sm:text-xl leading-relaxed text-white/85">{property.description}</p> : null}
          {property.highlights.length > 0 ? (
            <ul className="divide-y divide-white/20 border-y border-white/20">
              {property.highlights.map((h) => <li key={h} className="py-3 text-base">{h}</li>)}
            </ul>
          ) : null}
        </div>
      </section>

      {d.gallery.length > 0 ? (
        <section aria-label="Gallery" className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 sm:px-10 pb-4">
          {d.gallery.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={withBasePath(src)} alt={`${property.title}, view ${i + 2}`} loading="lazy" className="snap-start shrink-0 h-64 sm:h-96 w-auto max-w-[85vw] object-cover" />
          ))}
        </section>
      ) : null}

      {d.variants.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-10 py-16 sm:py-24">
          <h2 className="font-serif text-3xl sm:text-4xl mb-8">Residences</h2>
          <ul className="divide-y divide-white/20 border-y border-white/20">
            {d.variants.map((v, i) => (
              <li key={`${v.id}-${i}`} className="py-5 grid gap-1 sm:grid-cols-[1fr_auto_auto] sm:gap-10 sm:items-baseline">
                <span className="font-serif text-xl sm:text-2xl">{v.title}</span>
                <span className="text-white/75">{v.area} sq.ft carpet</span>
                <span className="text-lg font-semibold">{withOnwards(v.price)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {property.amenities.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-10 pb-16 sm:pb-24">
          <h2 className="font-serif text-3xl sm:text-4xl mb-6">Amenities</h2>
          <p className="font-serif text-2xl sm:text-3xl leading-snug text-white/85">{property.amenities.join('  ·  ')}</p>
          {d.mapsUrl ? (
            <a href={d.mapsUrl} target="_blank" rel="noreferrer" className={`mt-8 inline-flex items-center gap-2 min-h-11 font-semibold underline underline-offset-4 ${FOCUS}`}>
              Open in Google Maps <ArrowRight className="w-4 h-4" aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </section>
      ) : null}

      <section className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-14 flex flex-wrap items-center justify-between gap-6">
          <h2 className="font-serif text-3xl sm:text-4xl">See {property.title} in person</h2>
          <a href="#enquire" className={CTA}>Request private viewing</a>
        </div>
      </section>
      <footer className="max-w-7xl mx-auto px-4 sm:px-10 py-8 text-sm text-white/65">{DISCLAIMER}</footer>
      <a href={PHONE_TEL} className={`md:hidden fixed bottom-0 inset-x-0 z-20 flex items-center justify-center gap-2 min-h-14 bg-brick text-white font-semibold ${FOCUS}`}>
        <Phone className="w-4 h-4" aria-hidden /> Call {PHONE_DISPLAY}
      </a>
    </div>
  );
}
