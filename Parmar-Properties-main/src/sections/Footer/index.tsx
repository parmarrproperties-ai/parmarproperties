import { useState, useEffect, useRef } from "react";
import { NewsletterSignup } from "@/sections/Footer/components/NewsletterSignup";
import { FooterLinks } from "@/sections/Footer/components/FooterLinks";
import { FooterLogo } from "@/sections/Footer/components/FooterLogo";
import { FooterLegal } from "@/sections/Footer/components/FooterLegal";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Footer = () => {
  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
          >
            <NewsletterSignup />
            <FooterLinks />
            <FooterLogo />
            <FooterLegal />
          </ScrollReveal>
        </div>
      </footer>
    </>
  );
};
