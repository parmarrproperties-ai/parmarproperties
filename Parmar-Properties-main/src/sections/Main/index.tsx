import { HeroSection } from "@/sections/HeroSection";
import { WhyFindSection } from "@/sections/WhyParmarSection";
import { IdentitySection } from "@/sections/IdentitySection";
import { ProcessSection } from "@/sections/ProcessSection";
import { AgentsSection } from "@/sections/AgentsSection";
import { TestimonialsSection } from "@/sections/TestimonialsSection";
import { ServicesSection } from "@/sections/ServicesSection";
import { SupportSection } from "@/sections/SupportSection";
import { BlogSection } from "@/sections/BlogSection";
import { CtaSection } from "@/sections/CtaSection";

const clipStyle = { overflowX: "clip" as const };

export const Main = () => {
  return (
    <main id="main-content" className="relative z-[1] min-h-0">
      <HeroSection />
      <div style={clipStyle}>
        <WhyFindSection />
        <IdentitySection />
        <ProcessSection />
        <AgentsSection />
        <TestimonialsSection />
        <ServicesSection />
        <SupportSection />
        <BlogSection />
        <CtaSection />
      </div>
    </main>
  );
};
