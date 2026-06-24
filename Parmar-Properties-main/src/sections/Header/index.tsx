import { useState, useEffect } from "react";
import { HeaderLogo } from "@/sections/Header/components/HeaderLogo";
import { DesktopNavigation } from "@/sections/Header/components/DesktopNavigation";
import { MobileMenuButton } from "@/sections/Header/components/MobileMenuButton";
import { navigation } from "@/content/content";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Find the Hero section height to know when to show the solid header
          // The Hero section is the first <section> on the page and has a large scrollVh height.
          const heroSection = document.querySelector('section');
          const triggerHeight = heroSection ? (heroSection.offsetTop + heroSection.offsetHeight - window.innerHeight) : window.innerHeight;
          
          // Add solid background only after scrolling past the cinematic Hero section
          setIsScrolled(currentScrollY > triggerHeight);

          // Hide on scroll down, show on scroll up
          if (currentScrollY <= 0) {
            setIsHidden(false);
          } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsHidden(true);
          } else if (currentScrollY < lastScrollY) {
            setIsHidden(false);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
      data-mobile-menu-open={isMobileMenuOpen ? "true" : "false"}
      className={`box-border caret-transparent text-sm min-h-[auto] min-w-[auto] fixed no-underline z-[100] top-0 inset-x-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isHidden 
          ? "opacity-0 pointer-events-none -translate-y-4" 
          : "opacity-100 pointer-events-auto translate-y-0"
      } ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="box-border caret-transparent w-full max-w-[1920px] no-underline mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="items-center box-border caret-transparent text-neutral-900 grid grid-cols-[1fr_auto] leading-[11.5px] min-h-[64px] relative no-underline z-[100] md:grid-cols-[200px_1fr_200px] md:leading-[1.5] md:min-h-[62px]">
          <div className="relative z-10 w-full">
            <HeaderLogo />
          </div>
          <DesktopNavigation />
          <div className="flex justify-end items-center relative z-[9999] pointer-events-auto">
            <a
              href={navigation.ctaButton.href}
              className="hidden md:inline-flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 hover:-translate-y-0.5 hover:scale-105 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-lg whitespace-nowrap"
            >
              {navigation.ctaButton.label}
            </a>
            <MobileMenuButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </div>
        </div>
      </div>
    </header>

      {/* Mobile Nav Drawer */}
      <div 
        className={`fixed inset-0 bg-white z-[90] transition-all duration-300 md:hidden flex flex-col pt-28 px-8 pb-10 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col flex-1 gap-7 mt-2">
          {navigation.links.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              className={`flex items-center justify-between text-black text-[28px] md:text-5xl font-normal tracking-normal no-underline hover:text-black/60 transition-all duration-500 ${
                isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${isMobileMenuOpen ? 100 + index * 50 : 0}ms`, fontFamily: "'Inter', sans-serif" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>{link.label}</span>
              {/* Thin chevron matching the image */}
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          ))}
        </div>
        
        <div className={`mt-auto w-full transition-all duration-500 ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`} style={{ transitionDelay: `${isMobileMenuOpen ? 100 + navigation.links.length * 50 : 0}ms` }}>
          <a
            href={navigation.ctaButton.href}
            className="w-full md:w-auto md:px-16 flex items-center justify-center bg-[#0F0F0F] text-white font-medium text-[17px] py-[18px] rounded-full hover:bg-black transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {navigation.ctaButton.label}
          </a>
        </div>
      </div>
    </>
  );
};