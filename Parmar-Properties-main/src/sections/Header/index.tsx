import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HeaderLogo } from "@/sections/Header/components/HeaderLogo";
import { DesktopNavigation } from "@/sections/Header/components/DesktopNavigation";
import { MobileMenuButton } from "@/sections/Header/components/MobileMenuButton";
import { navigation } from "@/content/content";

export const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const atTop = currentScrollY === 0;
          const isScrollingDownFast = currentScrollY > lastScrollY && currentScrollY > 300;

          setIsAtTop(atTop);

          // Fade out while scrolling down past the threshold.
          setIsHidden(isScrollingDownFast);

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

  // On blog pages, we want the white background even at the top if it's not the home page
  const showWhiteBg = !isAtTop || !isHomePage;

  return (
    <header
      data-mobile-menu-open={isMobileMenuOpen ? "true" : "false"}
      className={`relative box-border caret-transparent text-sm min-h-[auto] min-w-[auto] fixed no-underline z-[100] top-0 inset-x-0 transition-all duration-500 ease-in-out ${
        isHidden ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      } ${
        showWhiteBg 
          ? "bg-white/95 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      {!showWhiteBg && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[120px] bg-gradient-to-b from-black/35 via-black/15 to-transparent md:h-[150px]"
        />
      )}
      <div className="box-border caret-transparent w-full max-w-[1920px] no-underline mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="items-center box-border caret-transparent text-neutral-900 grid grid-cols-[1fr_auto] leading-[11.5px] min-h-[64px] relative no-underline z-50 md:grid-cols-[200px_1fr_200px] md:leading-[1.5] md:min-h-[62px]">
          <HeaderLogo />
          <DesktopNavigation />
          <div className="flex justify-end items-center">
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

      {/* Mobile Nav Drawer */}
      <div className={`fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 text-2xl font-['Instrument_Sans']">
          {navigation.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-neutral-900 font-medium no-underline hover:text-neutral-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href={navigation.ctaButton.href}
            className="mt-4 inline-flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 hover:-translate-y-0.5 hover:scale-105 text-white font-semibold text-base px-6 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {navigation.ctaButton.label}
          </a>
        </div>
      </div>
    </header>
  );
};