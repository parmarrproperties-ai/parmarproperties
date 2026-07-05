import { useState, useEffect, useRef } from "react";
import { brand, footer } from "@/content/content";
import { Facebook, Instagram, Youtube, Linkedin, MessageCircle, ArrowRight, Phone } from "lucide-react";

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const footer = footerRef.current;
      if (!footer) return;

      const rect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
        const translateY = (1 - progress) * 40;
        setParallaxY(translateY);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer ref={footerRef} className="relative w-full z-0 overflow-hidden bg-[#111111] font-['Instrument_Sans']">
      <div
        className="bg-[#111111] text-white w-full"
        style={{ transform: `translateY(${parallaxY}px)`, willChange: "transform" }}
      >
        <div className="w-full max-w-[1920px] mx-auto px-6 md:px-16 pt-16 pb-8">

          {/* Top Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-20">

            {/* Logo & Tagline */}
            <div className="flex flex-col w-full">
              <a href="/" className="flex flex-col items-start justify-center transition-opacity hover:opacity-80 mb-6">
                <span className="text-[72px] md:text-[120px] font-bold tracking-tight leading-[1.1]">PARMAR</span>
                <span className="text-[24px] md:text-[36px] font-medium tracking-[0.3em] text-white/70 leading-[1.1] mt-1">PROPERTIES</span>
              </a>
              <h3 className="text-white font-semibold text-[18px] md:text-[22px] mb-2 tracking-wide">Building Relationships. Creating Value.</h3>
              <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-sm">
                Helping families, investors, and business leaders make confident real estate decisions through trusted advice and meaningful relationships.
              </p>
            </div>



            {/* Right Column: Socials & Numbers */}
            <div className="flex flex-col gap-8 lg:items-start min-w-[200px]">
              {/* Socials */}
              <div className="flex items-center gap-6 text-white">
                <a href={footer.socialLinks.find(l => l.label === "Facebook")?.href || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors"><Facebook size={20} strokeWidth={2.5} /></a>
                <a href={footer.socialLinks.find(l => l.label === "Instagram")?.href || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors"><Instagram size={20} strokeWidth={2.5} /></a>
                <a href={footer.socialLinks.find(l => l.label === "Youtube")?.href || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors"><Youtube size={22} strokeWidth={2.5} /></a>
                <a href={footer.socialLinks.find(l => l.label === "Linkedin")?.href || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors"><Linkedin size={20} strokeWidth={2.5} /></a>
              </div>
              
              {/* Numbers */}
              <div className="flex flex-col gap-4">
                <a href="tel:+919322232899" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium flex items-center gap-2">
                  <Phone size={16} /> +91 9322232899
                </a>
                <a href="tel:+919819120161" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium flex items-center gap-2">
                  <Phone size={16} /> +91 9819120161
                </a>
                <a href="tel:+919323041133" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium flex items-center gap-2">
                  <Phone size={16} /> +91 9323041133
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] font-medium text-white/50 tracking-wide">
            <div>© {brand.name} Pvt. Ltd. All Rights Reserved {brand.copyrightYear}</div>
            <div className="flex gap-2">
              {footer.legalLinks.map((link, index) => (
                <span key={link.label} className="flex gap-2">
                  <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
                  {index < footer.legalLinks.length - 1 && <span>|</span>}
                </span>
              ))}
            </div>
            <div>Built by Parmar Properties</div>
          </div>

        </div>
      </div>
    </footer>
  );
};
