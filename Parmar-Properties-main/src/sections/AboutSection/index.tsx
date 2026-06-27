import { ScrollReveal } from "@/components/ScrollReveal";
import { SplitTextReveal } from "@/components/SplitTextReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { aboutSection } from "@/content/content";

export const AboutSection = () => {
  return (
    <section className="bg-white relative py-16 md:py-24 w-full overflow-hidden border-y border-black/5">
      <div className="flex flex-col gap-16 md:gap-24 w-full max-w-[1920px] mx-auto px-6 md:px-16 2xl:px-32">
        
        {/* Top Section: Eyebrow Left, Heading Right */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start w-full">
          {/* Left Column: Eyebrow */}
          <div className="w-full md:w-[35%] lg:w-[40%] flex-shrink-0">
            <ScrollReveal delay={100} direction="right">
              <p className="text-black font-['Instrument_Sans'] text-lg md:text-xl font-semibold tracking-[0.02em] uppercase">
                {aboutSection.eyebrow}
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column: Heading */}
          <div className="w-full md:w-[65%] lg:w-[60%]">
            <ScrollReveal delay={150}>
              <h2 className="font-['Instrument_Sans'] tracking-[-0.04em] leading-[1.05] text-[36px] md:text-[54px] lg:text-[64px] font-semibold text-black">
                <SplitTextReveal text={aboutSection.heading} initialDelay={100} />
              </h2>
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom Section: 2 columns */}
        <div className="w-full flex flex-col-reverse md:flex-row gap-12 md:gap-20 items-end justify-between">
          
          <div className="w-full md:w-[60%] lg:w-[55%]">
            <ScrollReveal 
              direction="right" 
              distance={100}
              duration={1200}
              className="relative w-full rounded-none overflow-hidden shadow-sm"
            >
              <img
                src={aboutSection.imageUrl}
                alt="About us visual"
                loading="lazy"
                className="w-full h-auto object-cover aspect-[4/3] md:aspect-[16/10] transition-transform duration-[2000ms] hover:scale-105"
              />
            </ScrollReveal>
          </div>

          {/* Right text + Button */}
          <div className="w-full md:w-[38%] flex flex-col gap-8 pb-4">
            <ScrollReveal delay={250}>
              <ScrollScrubRevealText
                as="p"
                className="font-['Instrument_Sans'] tracking-[-0.02em] leading-relaxed text-lg md:text-xl text-neutral-600 font-medium"
                segments={aboutSection.bodySegments}
                scrubStart="top 90%"
                scrubEnd="center 50%"
              />
            </ScrollReveal>
            <ScrollReveal delay={350} direction="up">
              <a
                href={aboutSection.ctaButton.href}
                className="inline-block bg-[#1a1a1a] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-black transition-colors w-fit font-['Instrument_Sans']"
              >
                {aboutSection.ctaButton.label}
              </a>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};
