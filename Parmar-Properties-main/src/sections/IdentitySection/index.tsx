import { ImageStack } from "@/sections/IdentitySection/components/ImageStack";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { identity } from "@/content/content";
export const IdentitySection = () => {
  return (
    <section className="bg-white py-10 md:py-16 overflow-hidden w-full">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 flex flex-col items-center text-center">
        <ScrollScrubRevealText 
          as="h2"
          text={identity.heading}
          className="font-['Instrument_Sans'] text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] mb-12 md:mb-20"
          baseColorClass="text-neutral-300"
          revealColorClass="text-black"
          scrubStart="top 90%"
          scrubEnd="center 60%"
        />
        
        {/* Chevron Cards overlapping row */}
        <div className="w-full flex justify-center mb-12 md:mb-20">
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
