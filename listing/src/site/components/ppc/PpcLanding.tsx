'use client';

import { withBasePath } from "@/lib/base-path";
import React from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import type { Property } from '@/site/types/property';
import { EnquiryForm as SharedForm } from './shared';
import { withOnwards } from '@/site/lib/price';

const PHONE_DISPLAY = '+91 (022) 6666 9733';
const PHONE_TEL = 'tel:+912266669733';
const PLACEHOLDER = '/placeholder.png';
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brick';
const CTA = `inline-flex items-center justify-center gap-2 min-h-12 px-8 bg-brick hover:bg-brickHover text-white text-sm uppercase tracking-widest font-semibold transition-colors ${FOCUS}`;

/** Premium single-property page for Google PPC traffic: one property, one call to action. Every section appears only when the property has the data for it. */
export function PpcLanding({ property }: { property: Property }) {
  const real = (property.images ?? []).filter((i) => i && i !== PLACEHOLDER);
  const hero = real[0];
  const gallery = real.slice(1, 6);
  const variants = property.layoutVariants ?? [];
  const plans = (property.floorPlans ?? []).filter((p) => p.image);

  // Show the date text alone when it already says the status ("Ready to move in").
  const date = property.possessionDate?.trim();
  const statusText =
    date && date.toLowerCase().includes(property.possession.toLowerCase().split(' ')[0])
      ? date
      : property.possession + (date ? ` · ${date}` : '');
  const place = property.subLocation?.toLowerCase().includes(property.location.toLowerCase())
    ? property.subLocation
    : [property.subLocation, property.location].filter(Boolean).join(', ');

  const facts = (
    [
      ['Location', place],
      ['Configurations', property.bhk],
      ['Status', statusText],
      ['Type', property.propertyType],
      ['MahaRERA', property.reraId],
    ] as [string, string][]
  ).filter(([, v]) => v);

  const mapsUrl =
    property.googleMapsUrl ||
    (property.coordinates ? `https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}` : '');

  return (
    <div className="bg-mineral text-ink font-sans min-h-screen pb-16 md:pb-0">
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-white/95 backdrop-blur border-b border-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBasePath("/logo_without_bg.png")} alt="Parmar Properties" className="h-9 w-auto" />
        <div className="flex items-center gap-4">
          <a href={PHONE_TEL} className={`hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brick ${FOCUS}`}>
            <Phone className="w-4 h-4" aria-hidden /> {PHONE_DISPLAY}
          </a>
          <a href="#enquire" className={`inline-flex items-center min-h-10 px-5 bg-ink hover:bg-brick text-white text-xs uppercase tracking-widest font-semibold ${FOCUS}`}>
            Enquire
          </a>
        </div>
      </header>

      <section className="relative text-white bg-ink overflow-hidden">
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={withBasePath(hero)} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-r from-ink/85 via-ink/55 to-ink/30" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 py-14 sm:py-24 grid gap-10 lg:grid-cols-[1fr_380px] items-end">
          <div>
            <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05]">{property.title}</h1>
            {property.tagline ? <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-xl">{property.tagline}</p> : null}
            <p className="mt-3 text-base text-white/85">
              {[property.location, property.propertyType, property.possession].filter(Boolean).join(' · ')}
            </p>
            <p className="mt-8 text-3xl sm:text-4xl font-semibold">{withOnwards(property.priceFormatted)}</p>
          </div>
          <div className="bg-surface text-ink p-6 sm:p-7 shadow-2xl shadow-black/30"><SharedForm property={property} /></div>
        </div>
      </section>

      <section className="bg-white border-b border-line" aria-label="Key facts">
        <dl className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))] divide-line lg:divide-x">
          {facts.map(([k, v]) => (
            <div key={k} className="px-4 sm:px-8 py-5 border-b border-line lg:border-b-0">
              <dt className="text-sm text-slateText">{k}</dt>
              <dd className="mt-1 text-base font-semibold wrap-break-word">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-16 sm:space-y-24">
        {property.description || property.highlights.length > 0 ? (
          <section className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <h2 className="font-serif text-3xl">Overview</h2>
            <div className="max-w-prose space-y-6">
              {property.description ? <p className="text-base leading-relaxed text-slateText">{property.description}</p> : null}
              {property.highlights.length > 0 ? (
                <ul className="divide-y divide-line border-y border-line">
                  {property.highlights.map((h) => (
                    <li key={h} className="py-3 text-base">
                      {h}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ) : null}

        {gallery.length > 0 ? (
          <section
            aria-label="Gallery"
            className={`grid gap-2 sm:gap-3 ${gallery.length === 1 ? 'grid-cols-1' : gallery.length === 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}
          >
            {gallery.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={withBasePath(src)}
                alt={`${property.title}, view ${i + 2}`}
                loading="lazy"
                className={`w-full object-cover ${gallery.length === 1 ? 'aspect-16/9' : 'aspect-4/3'} ${gallery.length > 2 && i === 0 ? 'col-span-2 row-span-2 h-full' : ''}`}
              />
            ))}
          </section>
        ) : null}

        {variants.length > 0 ? (
          <section className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <h2 className="font-serif text-3xl">Residences</h2>
            <div className="overflow-x-auto bg-surface border border-line">
              <table className="w-full text-base">
                <thead className="text-left text-sm text-slateText">
                  <tr>
                    <th scope="col" className="p-4 font-medium">Residence</th>
                    <th scope="col" className="p-4 font-medium">Carpet area (sq.ft)</th>
                    <th scope="col" className="p-4 font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, i) => (
                    <tr key={`${v.id}-${i}`} className="border-t border-line">
                      <th scope="row" className="p-4 text-left font-semibold">{v.title}</th>
                      <td className="p-4">{v.area}</td>
                      <td className="p-4">{withOnwards(v.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {plans.length > 0 ? (
          <section aria-label="Floor plans" className="grid gap-6 sm:grid-cols-2">
            {plans.map((p) => (
              <figure key={p.title} className="bg-surface border border-line p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={withBasePath(p.image)} alt={`Floor plan: ${p.title}`} loading="lazy" className="w-full h-auto" />
                <figcaption className="mt-3 text-base">
                  <span className="font-semibold">{p.title}</span>
                  {p.area ? <span className="text-slateText"> · {p.area}</span> : null}
                </figcaption>
              </figure>
            ))}
          </section>
        ) : null}

        {property.amenities.length > 0 ? (
          <section className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <h2 className="font-serif text-3xl">Amenities</h2>
            <ul className="sm:columns-2 gap-x-10">
              {property.amenities.map((a) => (
                <li key={a} className="py-3 border-b border-line text-base break-inside-avoid">
                  {a}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {mapsUrl ? (
          <section className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <h2 className="font-serif text-3xl">Location</h2>
            <div className="max-w-prose space-y-4">
              <p className="text-base text-slateText">{place}</p>
              {mapsUrl ? (
                <a href={mapsUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 min-h-11 text-base font-semibold underline underline-offset-4 ${FOCUS}`}>
                  Open in Google Maps <ArrowRight className="w-4 h-4" aria-hidden />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : null}
            </div>
          </section>
        ) : null}

        {property.developerName || property.developerDescription || property.reraQrImage ? (
          <section className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <h2 className="font-serif text-3xl">The developer</h2>
            <div className="max-w-prose space-y-4">
              {property.developerName ? <p className="text-base font-semibold">{property.developerName}</p> : null}
              {property.developerDescription ? <p className="text-base leading-relaxed text-slateText">{property.developerDescription}</p> : null}
              {property.reraQrImage ? (
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={withBasePath(property.reraQrImage)} alt="MahaRERA registration QR code" className="w-24 h-24 bg-white p-1 border border-line" />
                  {property.reraId ? <p className="text-sm text-slateText">MahaRERA registration<br /><span className="font-semibold text-ink">{property.reraId}</span></p> : null}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}
      </main>

      <section className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14 sm:py-16 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl">See {property.title} in person</h2>
            <p className="mt-2 text-base text-white/85">Speak to an advisor on {PHONE_DISPLAY} or request a callback.</p>
          </div>
          <a href="#enquire" className={CTA}>
            Request private viewing
          </a>
        </div>
      </section>

      <footer className="px-4 sm:px-8 py-8 text-sm text-slateText max-w-6xl mx-auto">
        Prices, areas and availability are indicative and subject to change. Please verify project registration on the
        MahaRERA website. Parmar Properties · MahaRERA A51900018442.
      </footer>

      <a
        href={PHONE_TEL}
        className={`md:hidden fixed bottom-0 inset-x-0 z-20 flex items-center justify-center gap-2 min-h-14 bg-brick text-white text-base font-semibold ${FOCUS}`}
      >
        <Phone className="w-4 h-4" aria-hidden /> Call {PHONE_DISPLAY}
      </a>
    </div>
  );
}
