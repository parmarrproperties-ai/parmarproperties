import { HeroSection } from "@/sections/HeroSection";
import { WhyFindSection } from "@/sections/WhyParmarSection";
import { IdentitySection } from "@/sections/IdentitySection";
import { AboutSection } from "@/sections/AboutSection";
import { ProcessSection } from "@/sections/ProcessSection";
import { TestimonialsSection } from "@/sections/TestimonialsSection";
import { ServicesSection } from "@/sections/ServicesSection";
import { PartnersSection } from "@/sections/PartnersSection";
import { SupportSection } from "@/sections/SupportSection";
import { BlogSection } from "@/sections/BlogSection";
import { CtaSection } from "@/sections/CtaSection";

const clipStyle = { overflowX: "clip" as const };

export const Main = () => {
  return (
    <main id="main-content" className="relative z-[1] min-h-0 bg-white">
      <HeroSection />
      <div style={clipStyle}>
        <WhyFindSection />
        <IdentitySection />
        <AboutSection />
        <ProcessSection />
        <TestimonialsSection />
        
        {/* Marquee Section */}
        <div className="w-full overflow-hidden whitespace-nowrap py-10 md:py-14 bg-black text-[#b59e7e] flex items-center">
          <div className="animate-marquee inline-block flex-shrink-0">
            <span className="marquee-text sm:mx-6 md:mx-8 text-4xl md:text-6xl lg:text-7xl font-normal tracking-wide font-bebas text-transparent [-webkit-text-stroke:1px_white]">
              TARDEO&nbsp;&nbsp; LOWER PAREL&nbsp;&nbsp; PRABHADEVI&nbsp;&nbsp; MAHALAXMI&nbsp;&nbsp; MALABAR HILL&nbsp;&nbsp; WALKESHWAR&nbsp; &nbsp; WORLI&nbsp;&nbsp; ALTAMOUNT ROAD&nbsp;&nbsp; BREACH CANDY&nbsp;&nbsp; CUFFE PARADE&nbsp;&nbsp; WORLI SEA FACE&nbsp;&nbsp; NEPEAN SEA ROAD&nbsp;&nbsp; HUGHES ROAD&nbsp;&nbsp; PEDDER ROAD&nbsp;&nbsp; MARINE DRIVE&nbsp;&nbsp; NARIMAN POINT&nbsp;
            </span>
            <span className="marquee-text sm:mx-6 md:mx-8 text-4xl md:text-6xl lg:text-7xl font-normal tracking-wide font-bebas text-transparent [-webkit-text-stroke:1px_white]">
              TARDEO&nbsp;&nbsp; LOWER PAREL&nbsp;&nbsp; PRABHADEVI&nbsp;&nbsp; MAHALAXMI&nbsp;&nbsp; MALABAR HILL&nbsp;&nbsp; WALKESHWAR&nbsp; &nbsp; WORLI&nbsp;&nbsp; ALTAMOUNT ROAD&nbsp;&nbsp; BREACH CANDY&nbsp;&nbsp; CUFFE PARADE&nbsp;&nbsp; WORLI SEA FACE&nbsp;&nbsp; NEPEAN SEA ROAD&nbsp;&nbsp; HUGHES ROAD&nbsp;&nbsp; PEDDER ROAD&nbsp;&nbsp; MARINE DRIVE&nbsp;&nbsp; NARIMAN POINT&nbsp;
            </span>
          </div>
        </div>

        <ServicesSection />
        <PartnersSection />
        <SupportSection />
        <BlogSection />
        <CtaSection />
      </div>
    </main>
  );
};
