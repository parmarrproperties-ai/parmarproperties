import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { services } from "@/content/content";

export const ServicesHeader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-[44px] md:mb-[76px] px-6 md:px-16 w-full max-w-[1920px] mx-auto items-end">
      {/* Label */}
      <ScrollReveal className="mb-10 md:mb-0">
<<<<<<< HEAD
        <h3 className="text-white font-['Instrument_Sans'] font-semibold text-xl tracking-wide">
          {services.eyebrow}
=======
        <h3 className="text-white font-['Instrument_Sans'] font-semibold text-xl tracking-wide max-w-sm">
          {services.eyebrow.split('\n').map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
>>>>>>> efc0caeafe50b585c1d6ed32850f70cc46c268aa
        </h3>
      </ScrollReveal>

      {/* Main Heading */}
<<<<<<< HEAD
      <ScrollReveal delay={120} className="max-w-2xl">
        <ScrollScrubRevealText
          as="h2"
          text={services.heading}
          className="font-['Instrument_Sans'] text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]"
          baseColorClass="text-white/30"
          revealColorClass="text-white"
          scrubStart="top 90%"
          scrubEnd="center 50%"
        />
=======
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
>>>>>>> efc0caeafe50b585c1d6ed32850f70cc46c268aa
      </ScrollReveal>
    </div>
  );
};