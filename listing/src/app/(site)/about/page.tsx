import React from 'react';
import Link from 'next/link';
import Image from "@/components/ui/image";
import { ShieldCheck, Landmark, Users, ArrowRight } from 'lucide-react';
import { ABOUT_PAGE_CONTENT } from '@/site/data/content/about.content';
import { pageMetadata } from '@/site/lib/seo';

export const metadata = pageMetadata({
  title: ABOUT_PAGE_CONTENT.meta.pageTitle,
  absoluteTitle: true,
  description: ABOUT_PAGE_CONTENT.meta.pageDescription,
  path: '/about',
});

export default function AboutPage() {
  const { header, story, metrics, pillars, cta } = ABOUT_PAGE_CONTENT;
  const pillarIcons = [ShieldCheck, Landmark, Users];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen bg-[#EDEEE9] text-[#15181A]">
      {/* Header */}
      <div className="mb-14 text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#5B605F] mb-3 block">
          {header.badge}
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#15181A] mb-6">
          {header.title}
        </h1>
        <p className="text-base sm:text-lg text-[#5B605F] leading-relaxed font-sans">
          {header.subtitle}
        </p>
      </div>

      {/* Story & Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="font-serif text-3xl font-light text-[#15181A]">
            {story.heading}
          </h2>
          {story.paragraphs.map((p, idx) => (
            <p key={idx} className="text-sm sm:text-base text-[#5B605F] leading-relaxed">
              {p}
            </p>
          ))}

          <div className="pt-4 border-t border-[#CFD1CA] flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F7F7F4] border border-[#15181A] flex items-center justify-center font-serif text-lg text-[#15181A] font-bold">
              {story.founder.initials}
            </div>
            <div>
              <p className="font-serif text-base font-medium text-[#15181A]">{story.founder.name}</p>
              <p className="text-xs text-[#5B605F]">{story.founder.title}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 relative h-[420px] bg-[#CFD1CA] border border-[#CFD1CA] overflow-hidden shadow-xs">
          <Image
            src={story.image.src}
            alt={story.image.alt}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Key Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center p-8 bg-[#F7F7F4] border border-[#CFD1CA] mb-16 shadow-xs">
        {metrics.map((m, idx) => (
          <div key={idx} className="space-y-1">
            <span className="font-serif text-3xl sm:text-4xl font-light text-[#15181A]">{m.value}</span>
            <p className="text-xs uppercase tracking-wider text-[#5B605F]">{m.label}</p>
            {m.sub && <p className="text-[10px] text-[#8E9291]">{m.sub}</p>}
          </div>
        ))}
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {pillars.map((pillar, idx) => {
          const Icon = pillarIcons[idx] || ShieldCheck;
          return (
            <div key={idx} className="bg-[#F7F7F4] border border-[#CFD1CA] p-8 space-y-4">
              <Icon className="w-8 h-8 text-[#C5282F]" />
              <h3 className="font-serif text-xl font-medium text-[#15181A]">{pillar.title}</h3>
              <p className="text-xs text-[#5B605F] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-[#F7F7F4] border border-[#CFD1CA] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs space-y-4">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5282F] block">
          {cta.badge}
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#15181A] font-light">
          {cta.heading}
        </h3>
        <p className="text-sm text-[#5B605F]">
          {cta.subtext}
        </p>
        <div className="pt-2">
          <Link
            href="/properties?tab=buy"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            <span>{cta.buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
