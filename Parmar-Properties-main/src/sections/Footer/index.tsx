import { useRef, useEffect, useState } from "react";
import { NewsletterSignup } from "@/sections/Footer/components/NewsletterSignup";
import { FooterLinks } from "@/sections/Footer/components/FooterLinks";
import { FooterLogo } from "@/sections/Footer/components/FooterLogo";
import { FooterLegal } from "@/sections/Footer/components/FooterLegal";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Footer = () => {
  const [footerHeight, setFooterHeight] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current && footerHeight > 0) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Container height is 1.5 * footerHeight
            // scrollAmount goes from 0 to 1.5 * footerHeight
            const scrollAmount = Math.max(0, windowHeight - rect.top);
            
            if (scrollAmount <= 0) {
              setTranslateY(0);
            } else if (scrollAmount <= footerHeight) {
              // For the first H of scroll, we push the footer down by 0.5x the scroll amount.
              // This creates a parallax effect where the footer moves up at half the speed of the scroll.
              // By the time we scroll H, the footer is translated down by 0.5 * H relative to the container,
              // which means it has moved UP by 0.5 * H relative to the viewport (revealing the top 50%).
              setTranslateY(scrollAmount * 0.5);
            } else {
              // After scrolling H, we freeze the translation at 0.5 * H.
              // As we scroll the remaining 0.5 * H, the footer moves parallel with the container,
              // revealing the remaining 50% normally.
              setTranslateY(footerHeight * 0.5);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Init
    return () => window.removeEventListener("scroll", handleScroll);
  }, [footerHeight]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden" 
      style={{ height: footerHeight > 0 ? `${footerHeight * 1.5}px` : 'auto' }}
    >
      <footer 
        ref={footerRef}
        className="absolute top-0 w-full left-0 right-0 will-change-transform"
        style={{ transform: `translateY(${translateY}px)` }}
      >
        <div className="bg-neutral-900 text-white min-h-[auto] min-w-[auto] z-0 overflow-hidden w-full h-full">
          <div className="w-full max-w-[1920px] mx-auto px-6 md:px-16">
            <ScrollReveal 
              direction="up" 
              distance={40} 
              className="grid [grid-template-areas:'newsletter''links''logo''copyright'] grid-cols-1 pt-16 pb-10 gap-y-12 md:[grid-template-areas:'newsletter_links''logo_logo''copyright_copyright'] md:grid-cols-[1fr_auto] md:justify-between md:pt-24 md:pb-8"
            >
              <NewsletterSignup />
              <FooterLinks />
              <FooterLogo />
              <FooterLegal />
            </ScrollReveal>
          </div>
        </div>
      </footer>
    </div>
  );
};
