import { withBasePath } from "@/lib/base-path";
import React from 'react';
import { Phone } from 'lucide-react';
import type { Property } from '@/site/types/property';
import { withOnwards } from '@/site/lib/price';
import { EnquiryForm, Logo } from '../shared';
import { DISCLAIMER, FOCUS, PHONE_DISPLAY, PHONE_TEL, ppcData } from '../kit';

/** Option D: built for the click from an ad. Price, three facts and the form sit in the first screen; everything else is short. */
export function Express({ property }: { property: Property }) {
  const d = ppcData(property);
  const keyFacts = d.facts.filter(([k]) => k === 'Configurations' || k === 'Status' || k === 'Location').slice(0, 3);
  const trust = [property.developerName, property.reraId ? `MahaRERA ${property.reraId}` : '', d.status].filter(Boolean);
  return (
    <div className="bg-mineral text-ink font-sans min-h-screen pb-20 md:pb-0">
      <header className="flex items-center justify-between px-4 sm:px-10 py-3 bg-white border-b border-line">
        <Logo />
        <a href={PHONE_TEL} className={`inline-flex items-center gap-2 min-h-10 px-4 bg-ink text-white text-sm font-semibold ${FOCUS}`}>
          <Phone className="w-4 h-4" aria-hidden /> <span className="hidden sm:inline">{PHONE_DISPLAY}</span><span className="sm:hidden">Call</span>
        </a>
      </header>

      <section className="max-w-6xl mx-auto grid lg:grid-cols-2 lg:gap-0 lg:my-10 lg:shadow-xl lg:shadow-ink/10">
        <div className="relative min-h-64 sm:min-h-80 lg:min-h-[560px] bg-ink">
          {d.hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={withBasePath(d.hero)} alt={property.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : null}
        </div>
        <div className="bg-white p-6 sm:p-10 flex flex-col gap-6">
          <div>
            <p className="text-base text-slateText">{[property.location, property.propertyType].filter(Boolean).join(' · ')}</p>
            <h1 className="mt-1 font-serif text-4xl sm:text-5xl leading-[1.05]">{property.title}</h1>
            <p className="mt-4 font-serif text-4xl sm:text-5xl text-brick">{withOnwards(property.priceFormatted)}</p>
          </div>
          {keyFacts.length > 0 ? (
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-base">
              {keyFacts.map(([k, v]) => <li key={k}><span className="text-slateText">{k}: </span><span className="font-semibold">{v}</span></li>)}
            </ul>
          ) : null}
          <EnquiryForm property={property} title="Get current availability" />
        </div>
      </section>

      {trust.length > 0 ? (
        <section className="bg-brick text-white" aria-label="Assurance">
          <ul className="max-w-6xl mx-auto px-4 sm:px-10 py-4 flex flex-wrap gap-x-10 gap-y-2 text-base font-semibold">
            {trust.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </section>
      ) : null}

      <main className="max-w-6xl mx-auto px-4 sm:px-10 py-12 sm:py-16 space-y-12">
        {property.description ? <p className="text-lg leading-relaxed max-w-prose">{property.description}</p> : null}
        {d.gallery.length > 0 ? (
          <section aria-label="Gallery" className="grid grid-cols-3 gap-2">
            {d.gallery.slice(0, 3).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={withBasePath(src)} alt={`${property.title}, view ${i + 2}`} loading="lazy" className="w-full object-cover aspect-4/5 sm:aspect-[4/3]" />
            ))}
          </section>
        ) : null}
        {d.variants.length > 0 ? (
          <ul className="divide-y divide-line border-y border-line">
            {d.variants.map((v, i) => (
              <li key={`${v.id}-${i}`} className="py-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <span className="font-semibold">{v.title}</span><span className="text-slateText">{v.area} sq.ft carpet</span><span className="font-semibold">{withOnwards(v.price)}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {property.amenities.length > 0 ? (
          <p className="text-base text-slateText max-w-prose"><span className="font-semibold text-ink">Amenities: </span>{property.amenities.slice(0, 8).join(', ')}.</p>
        ) : null}
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-10 pb-10 text-sm text-slateText">{DISCLAIMER}</footer>
      <div className="md:hidden fixed bottom-0 inset-x-0 z-20 grid grid-cols-2 min-h-14 text-base font-semibold text-white">
        <a href={PHONE_TEL} className={`flex items-center justify-center gap-2 bg-ink ${FOCUS}`}><Phone className="w-4 h-4" aria-hidden /> Call</a>
        <a href="#enquire" className={`flex items-center justify-center bg-brick ${FOCUS}`}>Request callback</a>
      </div>
    </div>
  );
}
