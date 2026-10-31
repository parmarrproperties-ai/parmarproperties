'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ScrollReveal } from '@/site/components/ui/ScrollReveal';
import { HOME_PAGE_CONTENT } from '@/site/data/content/home.content';
import { fetchHomePageContent } from '@/site/lib/supabase/page-content';
import { fetchInsightsArticles } from '@/site/lib/supabase/insights';

export interface MarketInsight {
  id: string;
  category: string;
  title: string;
  description: string;
  readTime: string;
  tag: string;
}

export function MarketIntelligenceSection() {
  const router = useRouter();
  const [miContent, setMiContent] = useState({
    sectionId: HOME_PAGE_CONTENT.marketIntelligence.sectionId,
    badge: HOME_PAGE_CONTENT.marketIntelligence.badge,
    heading: HOME_PAGE_CONTENT.marketIntelligence.heading,
    subheading: HOME_PAGE_CONTENT.marketIntelligence.subheading,
    viewAllLink: HOME_PAGE_CONTENT.marketIntelligence.viewAllLink,
  });
  const [featuredInsights, setFeaturedInsights] = useState<MarketInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    if (clientWidth > 0) {
      const idx = Math.round(scrollLeft / (clientWidth * 0.85));
      setActiveIdx(Math.min(Math.max(idx, 0), Math.max(0, featuredInsights.length - 1)));
    }
  };

  const scrollToIdx = (idx: number) => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.clientWidth * 0.85;
    carouselRef.current.scrollTo({
      left: idx * cardWidth,
      behavior: 'smooth',
    });
    setActiveIdx(idx);
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetchHomePageContent(), fetchInsightsArticles()])
      .then(([home, articles]) => {
        if (!isMounted) return;

        setMiContent({
          sectionId: HOME_PAGE_CONTENT.marketIntelligence.sectionId,
          badge: home.miBadge,
          heading: home.miHeading,
          subheading: home.miSubheading,
          viewAllLink: {
            text: home.miViewAllText,
            link: home.miViewAllLink,
          },
        });

        setFeaturedInsights(
          articles.slice(0, 4).map((article) => ({
            id: article.slug || article.id,
            category: article.category,
            title: article.title,
            description: article.description,
            readTime: article.readTime,
            tag: article.tag,
          }))
        );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id={miContent.sectionId || 'market-intelligence'}
      className="py-8 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#CFD1CA]"
    >
      <ScrollReveal animation="fade-up">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 sm:mb-12 pb-3 sm:pb-6 border-b border-[#CFD1CA] gap-3 sm:gap-4">
          <div className="max-w-2xl">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold text-[#C5282F] mb-1.5 sm:mb-2 block">
              {miContent.badge}
            </span>
            <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-bold text-[#15181A] tracking-tight">
              {miContent.heading}
            </h2>
            <p className="text-xs sm:text-sm text-[#5B605F] mt-1 sm:mt-2 font-sans leading-relaxed line-clamp-2 sm:line-clamp-none">
              {miContent.subheading}
            </p>
          </div>

          <Link
            href={miContent.viewAllLink.link}
            className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-[#15181A] hover:bg-[#C5282F] text-white text-[11px] sm:text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-200 self-start md:self-end shadow-xs group"
          >
            <span>{miContent.viewAllLink.text}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </ScrollReveal>

      {/* 4 Square-styled Minimalist Editorial Boxes */}
      {loading ? (
        <p className="text-sm text-[#5B605F] font-sans">Loading research articles…</p>
      ) : featuredInsights.length === 0 ? (
        <p className="text-sm text-[#5B605F] font-sans">
          No published research articles are available yet.
        </p>
      ) : (
        <>
          {/* Mobile View: Luxury Editorial Swipe Carousel (Fits in One Single Scroll) */}
          <div className="block md:hidden">
            {/* Horizontal Snap Scroll Deck */}
            <div 
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-3.5 pt-1 -mx-4 px-4 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredInsights.map((insight) => (
                <Link
                  key={insight.id}
                  href={`/market-intelligence/${insight.id}`}
                  className="w-[84vw] max-w-[320px] shrink-0 snap-start bg-white border border-[#CFD1CA] p-5 shadow-xs hover:border-[#15181A] transition-all flex flex-col justify-between min-h-[205px] relative group"
                >
                  {/* Top Architectural Red Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C5282F]" />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5282F] font-sans truncate">
                        {insight.category}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#8C908F] shrink-0">
                        {insight.tag}
                      </span>
                    </div>

                    <h3 className="font-sans text-base font-bold text-[#15181A] leading-snug tracking-tight mb-2 group-hover:text-[#C5282F] transition-colors line-clamp-2">
                      {insight.title}
                    </h3>

                    <p className="text-xs text-[#5B605F] leading-relaxed font-sans font-light line-clamp-3">
                      {insight.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#CFD1CA]/60 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[#8C908F] font-medium tracking-wide">
                      {insight.readTime || '3 MIN READ'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#15181A] group-hover:text-[#C5282F] transition-colors">
                      <span>Read Detailed Article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Carousel Navigation Indicator Dots */}
            <div className="flex items-center justify-between pt-1.5 px-0.5">
              <div className="flex items-center gap-1.5">
                {featuredInsights.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToIdx(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeIdx === idx
                        ? 'w-6 bg-[#C5282F]'
                        : 'w-1.5 bg-[#CFD1CA] hover:bg-[#8C908F]'
                    }`}
                    aria-label={`Go to insight ${idx + 1}`}
                  />
                ))}
              </div>

              <span className="text-[10px] uppercase tracking-widest font-mono text-[#8C908F]">
                SWIPE &bull; {activeIdx + 1} OF {featuredInsights.length}
              </span>
            </div>
          </div>

          {/* Desktop/Tablet View: 100% UNCHANGED */}
          <div className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8">
            {featuredInsights.map((insight, idx) => {
              return (
                <ScrollReveal key={insight.id} animation="fade-up" delay={idx * 100}>
                  <div
                    role="button"
                    tabIndex={0}
                    onDoubleClick={() => router.push(`/market-intelligence/${insight.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') router.push(`/market-intelligence/${insight.id}`);
                    }}
                    title="Double click to open article"
                    className="group block bg-[#F7F7F4] border border-[#CFD1CA] p-8 sm:p-10 hover:border-[#15181A] hover:bg-white transition-all duration-300 shadow-xs hover:shadow-md relative flex flex-col justify-between min-h-[220px] cursor-pointer select-none"
                  >
                    <div>
                      {/* Category in small tracking uppercase */}
                      <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#5B605F] group-hover:text-[#C5282F] transition-colors block mb-3 font-sans">
                        {insight.category}
                      </span>

                      {/* Title in strong bold styling */}
                      <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#15181A] tracking-tight mb-3 leading-snug group-hover:text-[#C5282F] transition-colors">
                        {insight.title}
                      </h3>

                      {/* Contextual Description */}
                      <p className="text-xs sm:text-[13px] text-[#5B605F] leading-relaxed font-sans">
                        {insight.description}
                      </p>
                    </div>

                    {/* Footer bar */}
                    <div className="pt-6 mt-6 border-t border-[#CFD1CA]/60 flex items-center justify-between text-xs text-[#5B605F]">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#15181A] font-medium">
                        {insight.tag}
                      </span>
                      <Link
                        href={`/market-intelligence/${insight.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#15181A] group-hover:text-[#C5282F] transition-colors"
                      >
                        <span>Read Detailed Article</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </>
      )}

      {/* Direct button at bottom as well (desktop only to prevent clutter on mobile) */}
      <div className="hidden md:flex mt-10 pt-6 justify-start">
        <Link
          href="/market-intelligence"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#15181A] hover:bg-[#C5282F] text-white text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-200 shadow-xs group"
        >
          <span>VIEW ALL INSIGHTS -&gt;</span>
        </Link>
      </div>
    </section>
  );
}
