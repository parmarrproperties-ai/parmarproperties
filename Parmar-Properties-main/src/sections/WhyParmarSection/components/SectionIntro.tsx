import { ScrollReveal } from "@/components/ScrollReveal";

export const SectionIntro = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 max-w-7xl mx-auto px-6 md:px-12">
      <ScrollReveal className="max-w-2xl" delay={100} direction="right">
        <h2 className="text-black font-['Instrument_Sans'] text-4xl md:text-6xl font-semibold tracking-[-0.04em] leading-[1.05] mb-6">
          40+ Years Presence.<br/>
          HNI Network. Proven Outcomes.
        </h2>
      </ScrollReveal>
      <ScrollReveal className="max-w-md mt-6 md:mt-0" delay={200}>
        <p className="text-black/60 font-medium text-lg leading-relaxed font-['Instrument_Sans']">
          A real estate advisory with deep influence in the Jain–Marwadi business community and premium South Bombay markets. Direct access to liquidity-rich HNI and business families.
        </p>
      </ScrollReveal>
    </div>
  );
};