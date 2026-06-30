import { useState, useEffect, useRef } from "react";
import { NewsletterSignup } from "@/sections/Footer/components/NewsletterSignup";
import { FooterLinks } from "@/sections/Footer/components/FooterLinks";
import { FooterLogo } from "@/sections/Footer/components/FooterLogo";
import { FooterLegal } from "@/sections/Footer/components/FooterLegal";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Footer = () => {
<<<<<<< HEAD
  const [footerHeight, setFooterHeight] = useState(0);
=======
>>>>>>> efc0caeafe50b585c1d6ed32850f70cc46c268aa
  const footerRef = useRef<HTMLElement>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
<<<<<<< HEAD
    if (!footerRef.current) return;

    // Use ResizeObserver to dynamically track footer height
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setFooterHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(footerRef.current);
    
    // Initial height calculation
    setFooterHeight(footerRef.current.getBoundingClientRect().height);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      {/* Spacer div acts as the scroll clearance. 
          Its margin-bottom/height perfectly matches the footer,
          allowing the main content to scroll exactly enough to reveal the footer. */}
      <div style={{ height: footerHeight }} className="w-full" />
      
      {/* Fixed footer positioned behind the main content (z-index: -10) */}
      <footer 
        ref={footerRef}
        className="fixed bottom-0 left-0 w-full -z-10 bg-neutral-900 text-white overflow-hidden"
      >
        <div className="w-full max-w-[1920px] mx-auto px-6 md:px-16">
          <ScrollReveal 
            direction="up" 
            distance={40} 
            className="grid [grid-template-areas:'newsletter''links''logo''copyright'] grid-cols-1 pt-16 pb-10 gap-y-12 md:[grid-template-areas:'newsletter_links''logo_logo''copyright_copyright'] md:grid-cols-[1fr_auto] md:justify-between md:pt-24 md:pb-8"
=======
    const handleScroll = () => {
      const footer = footerRef.current;
      if (!footer) return;

      const rect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only apply parallax when footer is in or near the viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        // How far the footer has entered the viewport (0 = just entered, 1 = fully passed)
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
        // Translate from +40px (not yet reached) to 0px (scrolled through)
        const translateY = (1 - progress) * 40;
        setParallaxY(translateY);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // init on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full z-0 overflow-hidden bg-neutral-900"
    >
      <div 
        className="bg-neutral-900 text-white w-full"
        style={{
          transform: `translateY(${parallaxY}px)`,
          willChange: "transform",
        }}
      >
        <div className="w-full max-w-[1920px] mx-auto px-6 md:px-16">
          <ScrollReveal
            direction="up"
            distance={40}
            className="grid grid-cols-1 md:grid-cols-2 pt-10 pb-6 gap-y-8 md:pt-14 md:pb-6 md:gap-y-6 justify-between"
>>>>>>> efc0caeafe50b585c1d6ed32850f70cc46c268aa
          >
            <NewsletterSignup />
            <FooterLinks />
            <FooterLogo />
            <FooterLegal />
          </ScrollReveal>
        </div>
<<<<<<< HEAD
      </footer>
    </>
=======
      </div>
    </footer>
>>>>>>> efc0caeafe50b585c1d6ed32850f70cc46c268aa
  );
};
