import { ImageStack } from "@/sections/IdentitySection/components/ImageStack";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { identity } from "@/content/content";
export const IdentitySection = () => {
  const headingSegments = [
    { text: "Who We Are ", baseColorClass: "text-neutral-800", revealColorClass: "text-white" },
    { text: "& What We Do", baseColorClass: "text-neutral-800", revealColorClass: "text-neutral-400" },
  ];

  return (
    <section className="bg-black pt-[9px] md:pt-[25px] pb-6 md:pb-10 overflow-hidden w-full">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 flex flex-col items-center text-center">
        <ScrollScrubRevealText
          as="h2"
          segments={headingSegments}
          className="font-['Instrument_Sans'] text-5xl md:text-6xl font-semibold tracking-[-0.04em] leading-[1.05] relative top-[15px] mb-[9px] md:mb-[25px]"
          scrubStart="top 90%"
          scrubEnd="center 60%"
        />

        {/* Chevron Cards overlapping row */}
        <div className="w-full flex justify-center mb-6 md:mb-10">
          <ImageStack />
        </div>

        <ScrollReveal delay={300}>
          <ScrollScrubRevealText
            as="p"
            className="text-xl md:text-2xl leading-relaxed max-w-3xl font-['Instrument_Sans']"
            segments={identity.bodySegments}
            scrubStart="top 85%"
            scrubEnd="center 40%"
          />
        </ScrollReveal>
      </div>
    </section>
  );
};
