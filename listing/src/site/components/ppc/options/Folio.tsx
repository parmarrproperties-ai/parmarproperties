import React from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import type { Property } from '@/site/types/property';
import { withOnwards } from '@/site/lib/price';
import { EnquiryForm, Logo } from '../shared';
import { CTA, DISCLAIMER, FOCUS, PHONE_DISPLAY, PHONE_TEL, ppcData } from '../kit';

/** Option B: a photo mosaic opens the page like a brochure spread; the form follows the reader down the side. Light, editorial. */
export function Folio({ property }: { property: Property }) {
  const d = ppcData(property);
  const [a, b, c] = [d.all[0], d.all[1], d.all[2]];
  return (
    <div className="bg-mineral text-ink font-sans min-h-screen pb-16 md:pb-0">
      <header className="flex items-center justify-between px-4 sm:px-10 py-3 bg-white border-b border-line">
        <Logo />
        <a href={PHONE_TEL} className={`inline-flex items-center gap-2 text-sm font-semibold text-brick ${FOCUS}`}>
          <Phone className="w-4 h-4" aria-hidden /> {PHONE_DISPLAY}
        </a>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-10 pt-6 sm:pt-10">
        {a ? (
          <div className={`grid gap-2 sm:gap-3 ${b ? 'lg:grid-cols-3' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a} alt={`${property.title}`} className={`w-full object-cover aspect-4/3 sm:aspect-[16/10] ${b ? 'lg:col-span-2 lg:row-span-2 lg:h-full lg:aspect-auto' : ''}`} />
            {b ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b} alt="" className="hidden lg:block w-full h-full object-cover aspect-4/3" />
            ) : null}
            {c ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c} alt="" className="hidden lg:block w-full h-full object-cover aspect-4/3" />
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-10 sm:py-14 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-x-14">
        <div className="lg:col-start-1">
          <div>
            <p className="text-base text-slateText">{[property.location, property.propertyType].filter(Boolean).join(' · ')}</p>
            <h1 className="mt-2 font-serif text-5xl sm:text-7xl leading-none">{property.title}</h1>
            {property.tagline ? <p className="mt-4 text-xl text-slateText max-w-2xl">{property.tagline}</p> : null}
            <p className="mt-6 font-serif text-4xl sm:text-5xl text-brick">{withOnwards(property.priceFormatted)}</p>
          </div>
        </div>

        <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-6 self-start">
          <div className="bg-white border border-line p-6 sm:p-7 shadow-lg shadow-ink/5">
            <EnquiryForm property={property} />
            <p className="mt-5 text-sm text-slateText">Prefer to talk? <a href={PHONE_TEL} className={`font-semibold text-ink underline underline-offset-4 ${FOCUS}`}>{PHONE_DISPLAY}</a></p>
          </div>
        </aside>

        <div className="lg:col-start-1 space-y-14">
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6 border-y border-line py-8">
            {d.facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm text-slateText">{k}</dt>
                <dd className="mt-1 font-serif text-2xl wrap-break-word">{v}</dd>
              </div>
            ))}
          </dl>

          {property.description ? <p className="text-lg leading-relaxed max-w-prose">{property.description}</p> : null}

          {d.variants.length > 0 ? (
            <section>
              <h2 className="font-serif text-3xl mb-5">Residences</h2>
              <div className="overflow-x-auto bg-surface border border-line">
                <table className="w-full text-base">
                  <thead className="text-left text-sm text-slateText">
                    <tr><th scope="col" className="p-4 font-medium">Residence</th><th scope="col" className="p-4 font-medium">Carpet (sq.ft)</th><th scope="col" className="p-4 font-medium">Price</th></tr>
                  </thead>
                  <tbody>
                    {d.variants.map((v, i) => (
                      <tr key={`${v.id}-${i}`} className="border-t border-line">
                        <th scope="row" className="p-4 text-left font-semibold">{v.title}</th><td className="p-4">{v.area}</td><td className="p-4">{withOnwards(v.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {property.amenities.length > 0 ? (
            <section>
              <h2 className="font-serif text-3xl mb-5">Amenities</h2>
              <ul className="sm:columns-2 gap-x-10">
                {property.amenities.map((x) => <li key={x} className="py-3 border-b border-line break-inside-avoid">{x}</li>)}
              </ul>
            </section>
          ) : null}

          {d.mapsUrl ? (
            <a href={d.mapsUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 min-h-11 font-semibold underline underline-offset-4 ${FOCUS}`}>
              Open in Google Maps <ArrowRight className="w-4 h-4" aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>

      </div>

      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-14 flex flex-wrap items-center justify-between gap-6">
          <h2 className="font-serif text-3xl sm:text-4xl">See {property.title} in person</h2>
          <a href="#enquire" className={CTA}>Request private viewing</a>
        </div>
      </section>
      <footer className="max-w-7xl mx-auto px-4 sm:px-10 py-8 text-sm text-slateText">{DISCLAIMER}</footer>
      <a href={PHONE_TEL} className={`md:hidden fixed bottom-0 inset-x-0 z-20 flex items-center justify-center gap-2 min-h-14 bg-brick text-white font-semibold ${FOCUS}`}>
        <Phone className="w-4 h-4" aria-hidden /> Call {PHONE_DISPLAY}
      </a>
    </div>
  );
}
