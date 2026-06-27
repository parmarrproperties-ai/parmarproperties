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
  const [isPastHero, setIsPastHero] = useState(false);
  const [activeMobileDropdowns, setActiveMobileDropdowns] = useState<Record<string, boolean>>({});

  const toggleMobileDropdown = (label: string) => {
    setActiveMobileDropdowns(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

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

          const heroElement = document.getElementById("hero-section");
          // If no hero element, fallback to innerHeight
          const heroHeight = heroElement ? heroElement.offsetHeight : window.innerHeight;
          setIsPastHero(currentScrollY > heroHeight - 100);

          // Keep both features: set state for top, and hide appropriately with custom logic
          setIsAtTop(atTop);
          
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

  // On blog pages, we want the white background even at the top if it's not the home page
  const showWhiteBg = isHomePage ? (!isAtTop && isPastHero) : true;

  return (
    <>
      <header
      data-mobile-menu-open={isMobileMenuOpen ? "true" : "false"}
      className={`box-border caret-transparent text-sm min-h-[auto] min-w-[auto] fixed no-underline z-[100] top-0 inset-x-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isHidden 
          ? "opacity-0 pointer-events-none -translate-y-4" 
          : "opacity-100 pointer-events-auto translate-y-0"
      } ${
        showWhiteBg
          ? "bg-white/95 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="box-border caret-transparent w-full max-w-[1920px] no-underline mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="items-center box-border caret-transparent text-neutral-900 grid grid-cols-[1fr_auto] leading-[11.5px] min-h-[64px] relative no-underline z-[100] md:grid-cols-[200px_1fr_200px] md:leading-[1.5] md:min-h-[75px]">
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
        <div className="flex flex-col flex-1 gap-5 mt-2 overflow-y-auto max-h-[70vh]">
          {navigation.links.map((link, index) => {
            const isDropdown = link.isDropdown;
            const isOpen = !!activeMobileDropdowns[link.label];
            return (
              <div key={link.label} className="flex flex-col border-b border-neutral-100 last:border-0 pb-3 last:pb-0">
                {isDropdown ? (
                  <>
                    <button
                      onClick={() => toggleMobileDropdown(link.label)}
                      className={`flex items-center justify-between text-black text-[24px] font-normal tracking-normal no-underline hover:text-black/60 transition-all duration-300 w-full text-left py-2 ${
                        isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                      }`}
                      style={{ transitionDelay: `${isMobileMenuOpen ? 100 + index * 50 : 0}ms`, fontFamily: "'Inter', sans-serif" }}
                    >
                      <span>{link.label}</span>
                      <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`opacity-80 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                        <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {/* Mobile Dropdown Sublinks */}
                    <div className={`flex flex-col gap-3 pl-4 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[300px] mt-2 pb-2 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
                      {link.dropdownItems?.map((item, idx) => {
                        const isNewTab = link.label === "Opportunities" || link.label === "Contact";
                        return (
                          <a
                            key={idx}
                            href={item.href}
                            target={isNewTab ? "_blank" : undefined}
                            rel={isNewTab ? "noopener noreferrer" : undefined}
                            className="text-black/70 text-lg hover:text-black py-1.5 transition-colors block"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.label}
                          </a>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <a
                    href={link.href}
                    className={`flex items-center justify-between text-black text-[24px] font-normal tracking-normal no-underline hover:text-black/60 transition-all duration-300 py-2 ${
                      isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                    style={{ transitionDelay: `${isMobileMenuOpen ? 100 + index * 50 : 0}ms`, fontFamily: "'Inter', sans-serif" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                  </a>
                )}
              </div>
            );
          })}
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