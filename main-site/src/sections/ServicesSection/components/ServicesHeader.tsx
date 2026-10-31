import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { services } from "@/content/content";

export const ServicesHeader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-[44px] md:mb-[76px] px-6 md:px-16 w-full max-w-[1920px] mx-auto items-end">
      {/* Label */}
      <ScrollReveal className="mb-10 md:mb-0">
        <h3 className="text-white font-['Instrument_Sans'] font-semibold text-xl tracking-wide max-w-sm">
          {services.eyebrow.split('\n').map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h3>
      </ScrollReveal>

      {/* Main Heading */}
      <ScrollReveal delay={120} className="w-full">
        <h2 className="font-['Instrument_Sans'] text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]">
          {services.heading.split('\n').map((line, i) => (
            <ScrollScrubRevealText
              key={i}
              as="span"
              text={line}
              className="block"
              baseColorClass="text-white/30"
              revealColorClass={i === 1 ? "text-neutral-400" : "text-white"}
              scrubStart="top 90%"
              scrubEnd="center 50%"
            />
          ))}
        </h2>
      </ScrollReveal>
    </div>
  );
};