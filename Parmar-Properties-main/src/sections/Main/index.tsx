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
        <div className="w-full overflow-hidden whitespace-nowrap py-[30px] md:py-[46px] bg-black text-[#b59e7e] flex items-center">
          <div className="animate-marquee inline-block flex-shrink-0">
            <span className="marquee-text sm:mx-6 md:mx-8 text-4xl md:text-6xl lg:text-7xl font-normal tracking-wide font-bebas text-transparent [-webkit-text-stroke:1px_white]">
              WORLI&nbsp;&nbsp;&nbsp;&nbsp;ALTAMOUNT ROAD&nbsp;&nbsp;&nbsp;&nbsp;MARINE DRIVE&nbsp;&nbsp;&nbsp;&nbsp;SEWRI&nbsp;&nbsp;&nbsp;&nbsp;LOWER PAREL&nbsp;&nbsp;&nbsp;&nbsp;PEDDER ROAD&nbsp;&nbsp;&nbsp;&nbsp;CUFFE PARADE&nbsp;&nbsp;&nbsp;&nbsp;PRABHADEVI&nbsp;&nbsp;&nbsp;&nbsp;DADAR&nbsp;&nbsp;&nbsp;&nbsp;MALABAR HILL&nbsp;&nbsp;&nbsp;&nbsp;NARIMAN POINT&nbsp;&nbsp;&nbsp;&nbsp;BREACH CANDY&nbsp;&nbsp;&nbsp;&nbsp;NEPEAN SEA ROAD&nbsp;&nbsp;&nbsp;&nbsp;LALBAUG&nbsp;&nbsp;&nbsp;&nbsp;MAHALAXMI&nbsp;&nbsp;&nbsp;&nbsp;BANDRA&nbsp;&nbsp;&nbsp;&nbsp;HUGHES ROAD&nbsp;&nbsp;&nbsp;&nbsp;WALKESHWAR&nbsp;&nbsp;&nbsp;&nbsp;WORLI SEA FACE&nbsp;&nbsp;&nbsp;&nbsp;TARDEO&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span className="marquee-text sm:mx-6 md:mx-8 text-4xl md:text-6xl lg:text-7xl font-normal tracking-wide font-bebas text-transparent [-webkit-text-stroke:1px_white]">
              WORLI&nbsp;&nbsp;&nbsp;&nbsp;ALTAMOUNT ROAD&nbsp;&nbsp;&nbsp;&nbsp;MARINE DRIVE&nbsp;&nbsp;&nbsp;&nbsp;SEWRI&nbsp;&nbsp;&nbsp;&nbsp;LOWER PAREL&nbsp;&nbsp;&nbsp;&nbsp;PEDDER ROAD&nbsp;&nbsp;&nbsp;&nbsp;CUFFE PARADE&nbsp;&nbsp;&nbsp;&nbsp;PRABHADEVI&nbsp;&nbsp;&nbsp;&nbsp;DADAR&nbsp;&nbsp;&nbsp;&nbsp;MALABAR HILL&nbsp;&nbsp;&nbsp;&nbsp;NARIMAN POINT&nbsp;&nbsp;&nbsp;&nbsp;BREACH CANDY&nbsp;&nbsp;&nbsp;&nbsp;NEPEAN SEA ROAD&nbsp;&nbsp;&nbsp;&nbsp;LALBAUG&nbsp;&nbsp;&nbsp;&nbsp;MAHALAXMI&nbsp;&nbsp;&nbsp;&nbsp;BANDRA&nbsp;&nbsp;&nbsp;&nbsp;HUGHES ROAD&nbsp;&nbsp;&nbsp;&nbsp;WALKESHWAR&nbsp;&nbsp;&nbsp;&nbsp;WORLI SEA FACE&nbsp;&nbsp;&nbsp;&nbsp;TARDEO&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>

        <ServicesSection />
        <PartnersSection />
        <SupportSection />
        <BlogSection />
      </div>
    </main>
  );
};
