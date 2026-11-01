'use client';

/**
 * Site header. Matches the main site (www.parmarproperties.in) header: same logo,
 * sizes, fonts, links, scroll behaviour and mobile drawer. Company pages link to
 * the main domain; property pages stay inside /listing.
 */
import React, { useEffect, useState } from 'react';
import { withBasePath } from '@/lib/base-path';

const MAIN = 'https://www.parmarproperties.in';
const INSTRUMENT: React.CSSProperties = { fontFamily: "var(--font-instrument), 'Instrument Sans', sans-serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };

const navigation = [
  { label: 'Home', href: `${MAIN}/` },
  { label: 'About Us', href: `${MAIN}/about` },
  { label: 'Services', href: `${MAIN}/services` },
  { label: 'Properties', href: withBasePath('/properties') },
  { label: 'Expertise', href: `${MAIN}/#expertise` },
  { label: 'Blogs', href: `${MAIN}/blog` },
  { label: 'Contact', href: `${MAIN}/contact` },
];

const ctaButton = {
  label: 'Schedule Consultation',
  href: 'https://wa.me/919322232899?text=Hi%2C%20I%20would%20like%20to%20schedule%20a%20consultation.',
};

const isExternal = (href: string) => href.startsWith('http');

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Same as the main site: hide while scrolling down, show again when scrolling up.
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y <= 0) setIsHidden(false);
        else if (y > lastScrollY && y > 100) setIsHidden(true);
        else if (y < lastScrollY) setIsHidden(false);
        lastScrollY = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
    <header
      data-mobile-menu-open={isMobileMenuOpen ? 'true' : 'false'}
      className={`box-border caret-transparent text-sm min-h-[auto] min-w-[auto] fixed no-underline not-italic font-['Instrument_Sans'] z-[100] top-0 inset-x-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isHidden ? 'opacity-0 pointer-events-none -translate-y-4' : 'opacity-100 pointer-events-auto translate-y-0'
      } bg-white/95 backdrop-blur-md shadow-sm`}
    >
      <div className="box-border caret-transparent w-full max-w-[1920px] no-underline mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="flex justify-between items-center box-border caret-transparent text-neutral-900 leading-[11.5px] min-h-[64px] relative no-underline z-[100] md:leading-[1.5] md:min-h-[75px] w-full">
          <div className="relative z-10">
            <div className="flex items-center py-[5px]">
              <a
                href={MAIN + '/'}
                className="flex items-center transition-opacity duration-200 hover:opacity-80"
                aria-label="Go to home page"
              >
                <img
                  src={withBasePath('/brand/parmar-properties-logo.webp')}
                  width={1308}
                  height={508}
                  alt="Parmar Properties"
                  className="h-[54px] md:h-[68px] md:ml-[80px] w-auto object-contain object-left pointer-events-none"
                />
              </a>
            </div>
          </div>

          <nav className="box-border caret-transparent gap-x-[normal] hidden text-[10px] leading-[11.5px] min-h-0 min-w-0 gap-y-[normal] no-underline ml-auto md:gap-x-5 xl:gap-x-12 md:flex md:text-[6.66667px] md:leading-[7.66667px] md:min-h-[auto] md:min-w-[auto] md:gap-y-[26.6667px]">
            {navigation.map((link) => (
              <div
                key={link.label}
                className="group relative uppercase items-center box-border caret-transparent gap-x-2.5 flex text-lg font-medium leading-[22.5px] min-h-0 min-w-0 gap-y-2.5 no-underline md:gap-x-[6.66667px] md:text-[13.3333px] md:leading-[16.6667px] md:min-h-[auto] md:min-w-[auto] md:gap-y-[6.66667px]"
              >
                <a
                  href={link.href}
                  target={isExternal(link.href) && link.href.includes('wa.me') ? '_blank' : undefined}
                  rel={isExternal(link.href) && link.href.includes('wa.me') ? 'noopener noreferrer' : undefined}
                  className="block text-base font-semibold text-neutral-900 transition-colors duration-200 py-2"
                  style={INSTRUMENT}
                >
                  <span className="relative">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </div>
            ))}
          </nav>

          <div className="flex justify-end items-center relative z-[9999] pointer-events-auto md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu control"
              className="items-center z-50 bg-transparent caret-transparent flex flex-col text-[10px] h-[30px] justify-center leading-[11.5px] min-h-[auto] min-w-[auto] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black relative no-underline w-[30px] border p-0 border-transparent md:hidden md:text-[6.66667px] md:h-5 md:leading-[7.66667px] md:min-h-0 md:min-w-0 md:w-5"
            >
              <span className={`bg-neutral-900 box-border caret-transparent block text-[10px] h-px leading-[11.5px] absolute no-underline w-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-[5px]'}`}></span>
              <span className={`bg-neutral-900 box-border caret-transparent block text-[10px] h-px leading-[11.5px] absolute no-underline w-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-[5px]'}`}></span>
            </button>
          </div>
        </div>
      </div>
    </header>

      {/* Mobile drawer: identical to the main site */}
      <div
        className={`fixed inset-0 bg-white z-[90] transition-all duration-300 md:hidden flex flex-col pt-28 px-8 pb-10 not-italic ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col flex-1 gap-5 mt-2 overflow-y-auto max-h-[70vh]">
          {navigation.map((link, index) => (
            <div key={link.label} className="flex flex-col border-b border-neutral-100 last:border-0 pb-3 last:pb-0">
              <a
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`uppercase flex items-center justify-between text-black text-[24px] font-normal tracking-normal no-underline hover:text-black/60 transition-all duration-300 py-2 ${
                  isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${isMobileMenuOpen ? 100 + index * 50 : 0}ms`, ...INTER }}
              >
                <span>{link.label}</span>
              </a>
            </div>
          ))}
        </div>

        <div
          className={`mt-auto w-full transition-all duration-500 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          style={{ transitionDelay: `${isMobileMenuOpen ? 100 + navigation.length * 50 : 0}ms` }}
        >
          <a
            href={ctaButton.href}
            className="uppercase w-full md:w-auto md:px-16 flex items-center justify-center bg-[#0F0F0F] text-white font-medium text-[17px] py-[18px] rounded-full hover:bg-black transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {ctaButton.label}
          </a>
        </div>
      </div>
    </>
  );
}
