import { useState, useEffect, useRef } from "react";
import { brand, footer } from "@/content/content";
import { Facebook, Instagram, Youtube, Linkedin, MessageCircle, ArrowRight } from "lucide-react";

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
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-20">
            
            {/* Logo & Tagline */}
            <div className="flex flex-col max-w-md">
              <a href="/" className="flex flex-col items-start justify-center transition-opacity hover:opacity-80 mb-6">
                <span className="text-[72px] md:text-[120px] font-bold tracking-tight leading-[1.1]">PARMAR</span>
                <span className="text-[24px] md:text-[36px] font-medium tracking-[0.3em] text-white/70 leading-[1.1] mt-1">PROPERTIES</span>
              </a>
              <h3 className="text-white font-semibold text-[18px] md:text-[22px] mb-2 tracking-wide">Building Relationships. Creating Value.</h3>
              <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-sm">
                Helping families, investors, and business leaders make confident real estate decisions through trusted advice and meaningful relationships.
              </p>
            </div>



            {/* Socials */}
            <div className="flex items-center gap-6 text-white">
              <a href={footer.socialLinks.find(l => l.label === "Facebook")?.href || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors"><Facebook size={20} strokeWidth={2.5} /></a>
              <a href={footer.socialLinks.find(l => l.label === "Instagram")?.href || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors"><Instagram size={20} strokeWidth={2.5} /></a>
              <a href="#" className="hover:text-white/70 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
              </a>
              <a href={footer.socialLinks.find(l => l.label === "Youtube")?.href || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors"><Youtube size={22} strokeWidth={2.5} /></a>
              <a href={footer.socialLinks.find(l => l.label === "Whatsapp")?.href || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors"><MessageCircle size={20} strokeWidth={2.5} /></a>
              <a href={footer.socialLinks.find(l => l.label === "Linkedin")?.href || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors"><Linkedin size={20} strokeWidth={2.5} /></a>
            </div>
          </div>

          {/* Middle Section - Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="flex flex-col gap-5">
              <h4 className="text-white font-bold text-[17px] mb-2 tracking-wide">ABOUT US</h4>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium">Who we are</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium">Client Testimonials</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium">Contact Us</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium">Careers</a>
            </div>
            
            <div className="flex flex-col gap-5">
              <h4 className="text-white font-bold text-[17px] mb-2 tracking-wide">SERVICES</h4>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium">Residential</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium">Commercial</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium">NRI Concierge</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium">Interior Design Advisory</a>
            </div>

            <div className="flex flex-col gap-5">
              <h4 className="text-white font-bold text-[17px] mb-2 tracking-wide">INSIGHTS</h4>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium">Blogs</a>
            </div>

            <div className="flex flex-col gap-4 justify-start pt-1 md:pt-11">
              <a href="tel:+919004849025" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium">+91-9004849025</a>
              <a href="tel:+918989520448" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium">+91-8989520448</a>
              <a href="tel:+919022179597" className="text-white/80 hover:text-white transition-colors text-[15px] font-medium">+91-9022179597</a>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] font-medium text-white/50 tracking-wide">
            <div>© {brand.name} Pvt. Ltd. All Rights Reserved {brand.copyrightYear}</div>
            <div className="flex gap-2">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Site Map</a>
            </div>
            <div>Built by Parmar Properties</div>
          </div>

        </div>
      </div>
    </footer>
  );
};
