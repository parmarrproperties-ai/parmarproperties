import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { whyParmar } from "@/content/content";

// FIND's "why-us_grid": a small eyebrow column + ONE text block where the
// lead-in is solid black/bold and the continuation is a lighter gray "em"
// span — not a separate <h2> + <p> pair.
export const SectionIntro = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start mb-10 md:mb-16 w-full max-w-[1920px] mx-auto px-6 md:px-16 2xl:px-32">
      <div className="w-full md:w-[35%] lg:w-[40%] flex-shrink-0">
        <ScrollReveal delay={100} direction="right">
          <p className="text-black font-['Instrument_Sans'] text-lg md:text-xl font-semibold tracking-[0.02em]">
            {whyParmar.eyebrow}
          </p>
        </ScrollReveal>
      </div>
      <div className="w-full md:w-[65%] lg:w-[60%]">
        <ScrollScrubRevealText
          as="p"
          className="font-['Instrument_Sans'] tracking-[-0.02em] leading-[1.15] text-2xl md:text-4xl lg:text-[42px]"
          segments={whyParmar.bodySegments}
          scrubStart="top 90%"
          scrubEnd="center 40%"
        />
      </div>
    </div>
  );
};