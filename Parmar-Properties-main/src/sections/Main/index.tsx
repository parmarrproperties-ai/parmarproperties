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
        <ServicesSection />
        <PartnersSection />
        <SupportSection />
        <BlogSection />
        <CtaSection />
      </div>
    </main>
  );
};
