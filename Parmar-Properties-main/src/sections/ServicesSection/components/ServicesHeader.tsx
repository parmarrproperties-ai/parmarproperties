import { ScrollReveal } from "@/components/ScrollReveal";

export const ServicesHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 px-6 md:px-16 w-full max-w-[1920px] mx-auto">
      {/* Label */}
      <ScrollReveal className="mb-10 md:mb-0">
        <h3 className="text-white font-['Instrument_Sans'] font-semibold text-xl tracking-wide">
          Advisory Services
        </h3>
      </ScrollReveal>

      {/* Main Heading */}
      <ScrollReveal delay={120} className="max-w-2xl">
        <h2 className="text-white font-['Instrument_Sans'] text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]">
          Luxury & Ultra-Luxury<br />
          <span className="text-white/40">Real Estate Advisory</span>
        </h2>
      </ScrollReveal>
    </div>
  );
};