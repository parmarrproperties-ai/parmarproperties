'use client';

import React, { useEffect, useState } from 'react';
import { Award, Gem, TrendingUp, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/site/components/ui/ScrollReveal';
import { HOME_PAGE_CONTENT } from '@/site/data/content/home.content';
import {
  fetchHomePageContent,
  type HomePageCms,
  type HomeTrustMetric,
  type HomeWhyPillar,
} from '@/site/lib/supabase/page-content';

const ICONS = [Award, Gem, TrendingUp, ShieldCheck];

function toWhyPoints(pillars: HomeWhyPillar[]) {
  return pillars.map((p, idx) => ({
    number: p.number,
    subtitle: p.subtitle,
    title: p.title,
    description: p.description,
    icon: ICONS[idx] || Award,
    badge: p.badge,
  }));
}

const FALLBACK_CMS: HomePageCms = {
  heroHeadline: HOME_PAGE_CONTENT.hero.headline,
  heroSubtext: HOME_PAGE_CONTENT.hero.subtext,
  heroSlideDurationMs: HOME_PAGE_CONTENT.hero.slideDurationMs,
  searchMinBudgetCr: HOME_PAGE_CONTENT.hero.searchConsole.budgetSlider.minCrores,
  searchMaxBudgetCr: HOME_PAGE_CONTENT.hero.searchConsole.budgetSlider.maxCrores,
  searchBudgetStepCr: HOME_PAGE_CONTENT.hero.searchConsole.budgetSlider.stepCrores || 1,
  whyBadge: HOME_PAGE_CONTENT.whyParmar.badge,
  whyTitlePrefix: HOME_PAGE_CONTENT.whyParmar.titlePrefix,
  whyTitleHighlight: HOME_PAGE_CONTENT.whyParmar.titleHighlight,
  whySubtitle: HOME_PAGE_CONTENT.whyParmar.subtitle,
  whyCtaText: HOME_PAGE_CONTENT.whyParmar.ctaButton.text,
  whyCtaLink: HOME_PAGE_CONTENT.whyParmar.ctaButton.link,
  whyPillars: HOME_PAGE_CONTENT.whyParmar.pillars.map((p) => ({
    number: p.number,
    subtitle: p.subtitle,
    title: p.title,
    description: p.description,
    badge: p.badge,
  })),
  whyTrustMetrics: HOME_PAGE_CONTENT.whyParmar.trustMetrics.map((m) => ({
    value: m.value,
    label: m.label,
    sub: m.sub,
  })),
  miBadge: HOME_PAGE_CONTENT.marketIntelligence.badge,
  miHeading: HOME_PAGE_CONTENT.marketIntelligence.heading,
  miSubheading: HOME_PAGE_CONTENT.marketIntelligence.subheading,
  miViewAllText: HOME_PAGE_CONTENT.marketIntelligence.viewAllLink.text,
  miViewAllLink: HOME_PAGE_CONTENT.marketIntelligence.viewAllLink.link,
};

export function WhyParmar() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [whyContent, setWhyContent] = useState(FALLBACK_CMS);

  useEffect(() => {
    let isMounted = true;
    fetchHomePageContent().then((data) => {
      if (isMounted) setWhyContent(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const whyPoints = toWhyPoints(whyContent.whyPillars);
  const trustMetrics: HomeTrustMetric[] = whyContent.whyTrustMetrics;

  return (
    <section
      id="why-parmar"
      className="w-full bg-[#24282D] text-white border-y border-[#3C434B] relative overflow-hidden py-8 sm:py-20 lg:py-28 font-sans"
    >
      {/* Dynamic Background Architectural Animations */}
      {/* 1. Subtle glowing ambient light orbs */}
      <div className="absolute -top-36 -left-36 w-96 h-96 bg-[#C5282F]/10 rounded-full blur-[110px] pointer-events-none animate-pulse duration-8000" />
      <div className="absolute -bottom-36 -right-36 w-96 h-96 bg-[#C5282F]/08 rounded-full blur-[120px] pointer-events-none animate-pulse duration-10000" />

      {/* 2. Architectural Blueprint Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 3. Subtle Heritage Watermark */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-serif text-[100px] sm:text-[140px] font-bold text-white/[0.02] pointer-events-none select-none tracking-widest leading-none hidden lg:block">
        PARMAR
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Reveal Animation */}
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 sm:pb-10 border-b border-[#3C434B] gap-3 sm:gap-6 mb-4 sm:mb-12">
            <div className="max-w-3xl">
              {/* Animated Live Status Badge */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-[#2E3339] border border-[#444C55] text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-bold text-[#E5484D] mb-2 sm:mb-4 shadow-sm">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5484D] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#E5484D]" />
                </span>
                <span>{whyContent.whyBadge}</span>
              </div>

              {/* Section Title: WHY PARMAR PROPERTIES */}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-sans font-light tracking-tight text-white mb-2 sm:mb-4 leading-tight">
                {whyContent.whyTitlePrefix}{' '}
                <span className="font-semibold text-white">{whyContent.whyTitleHighlight}</span>
              </h2>

              <p className="text-xs sm:text-base lg:text-lg text-[#D1D5DB] font-sans leading-relaxed font-light line-clamp-2 sm:line-clamp-none">
                {whyContent.whySubtitle}
              </p>
            </div>

            {/* Quick Contact Link */}
            <div className="shrink-0 hidden sm:block">
              <a
                href={whyContent.whyCtaLink || '#properties'}
                className="group inline-flex items-center gap-2 px-5 py-3 bg-[#2E3339] hover:bg-[#C5282F] border border-[#444C55] hover:border-[#C5282F] text-xs uppercase tracking-[0.15em] font-semibold text-white transition-all duration-300 shadow-sm"
              >
                <span>{whyContent.whyCtaText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Mobile View: High-End Compact Luxury Pillars (Fits in One Single Scroll) */}
        <div className="block lg:hidden space-y-2.5 mb-5">
          {whyPoints.map((pt) => {
            const Icon = pt.icon;
            return (
              <div
                key={pt.title}
                className="bg-[#2D3238] border-l-2 border-l-[#E5484D] border-y border-r border-[#3C434B] p-3 rounded-xs shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <span className="font-mono text-sm font-bold text-[#E5484D] tabular-nums">
                      {pt.number}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-[#24282D] border border-[#444C55] flex items-center justify-center text-[#E5484D] shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#9CA3AF] font-sans truncate">
                        {pt.subtitle}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-[#E5484D] shrink-0">
                        {pt.badge}
                      </span>
                    </div>

                    <h3 className="font-sans text-xs sm:text-sm font-bold text-white leading-tight mb-1">
                      {pt.title}
                    </h3>

                    <p className="text-[11px] text-[#D1D5DB] leading-relaxed font-sans font-light">
                      {pt.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Stacked Architectural Rows (100% UNCHANGED) */}
        <div className="hidden lg:flex flex-col space-y-5 mb-16">
          {whyPoints.map((pt, idx) => {
            const Icon = pt.icon;
            const isHovered = hoveredIdx === idx;

            return (
              <ScrollReveal key={pt.title} animation="fade-up" delay={idx * 100}>
                <div
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`group relative bg-[#2D3238] border transition-all duration-500 ease-out p-6 sm:p-8 lg:p-10 overflow-hidden shadow-lg ${
                    isHovered
                      ? 'border-[#C5282F]/70 bg-[#32383F] -translate-y-1 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.5),0_0_25px_rgba(197,40,47,0.18)]'
                      : 'border-[#3C434B] hover:border-[#4B535D]'
                  }`}
                >
                  {/* Top Animated Shimmer Bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[#C5282F] to-transparent transition-all duration-700 ${
                      isHovered ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                    }`}
                  />

                  {/* Ambient Light Sweep Hover Animation */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-linear-to-r from-transparent via-white/[0.05] to-transparent" />

                  {/* Vertical Card Inner Layout: Responsive 3-Part Row */}
                  <div className="grid grid-cols-12 gap-8 items-center">
                    {/* Part 1: Index Number, Icon & Headings */}
                    <div className="col-span-5 flex items-center gap-6">
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-sans text-3xl font-bold tracking-tight text-[#E5484D] tabular-nums group-hover:scale-105 transition-transform duration-300">
                          {pt.number}
                        </span>
                        <div className="w-12 h-12 rounded-full bg-[#24282D] border border-[#444C55] flex items-center justify-center text-[#E5484D] group-hover:bg-[#C5282F] group-hover:text-white group-hover:border-[#C5282F] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md shrink-0">
                          <Icon className="w-5 h-5 transition-transform duration-500" />
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#D1D5DB]/80 group-hover:text-white transition-colors block mb-1 font-sans">
                          {pt.subtitle}
                        </span>
                        <h3 className="font-sans text-xl font-bold tracking-wide text-white group-hover:text-white transition-colors flex items-center gap-2">
                          <span>{pt.title}</span>
                          <Sparkles className="w-4 h-4 text-[#E5484D] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </h3>
                      </div>
                    </div>

                    {/* Part 2: Description */}
                    <div className="col-span-4">
                      <p className="text-sm text-[#D1D5DB] leading-relaxed font-sans font-normal">
                        {pt.description}
                      </p>
                    </div>

                    {/* Part 3: Standard Badge & Stamp */}
                    <div className="col-span-3 flex flex-col items-end justify-between items-center gap-2 w-full">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#E5484D] group-hover:scale-125 transition-transform duration-300" />
                        <span className="text-[11px] uppercase tracking-wider font-semibold">{pt.badge}</span>
                      </div>
                      <span className="text-[10px] text-[#9CA3AF] font-sans tracking-widest uppercase font-medium">
                        PARMAR STANDARD
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Animated Trust Metrics Bar */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 p-3.5 sm:p-8 bg-[#2A2F35] border border-[#3C434B]">
            {trustMetrics.map((metric, i) => (
              <div
                key={metric.label}
                className={`p-2.5 sm:p-4 transition-all duration-300 ${
                  i < trustMetrics.length - 1 ? 'lg:border-r border-[#3C434B]' : ''
                } hover:bg-[#32383F] group`}
              >
                <div className="font-sans text-2xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums group-hover:text-[#E5484D] transition-colors mb-0.5 sm:mb-1.5">
                  {metric.value}
                </div>
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white mb-0.5 sm:mb-1 font-sans">
                  {metric.label}
                </div>
                <div className="text-[9px] sm:text-[11px] text-[#9CA3AF] font-sans leading-tight sm:leading-relaxed">
                  {metric.sub}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
