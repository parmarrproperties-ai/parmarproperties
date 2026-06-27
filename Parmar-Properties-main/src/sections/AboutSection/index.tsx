import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { SplitTextReveal } from "@/components/SplitTextReveal";
import { aboutSection } from "@/content/content";

export const AboutSection = () => {
  return (
    <section className="bg-white relative py-16 md:py-[100px] w-full overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 lg:px-24 xl:px-32 flex flex-col gap-12 md:gap-16">
        {/* Header Grid: Matches other sections (small on left, big on right) */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,420px)_1fr] gap-10 md:gap-16 items-start pb-4">
          {/* Left Column: Eyebrow */}
          <div className="w-full">
            <ScrollReveal delay={100} direction="right">
              <p className="text-black font-['Instrument_Sans'] text-lg md:text-xl font-semibold tracking-[0.02em] uppercase">
                {aboutSection.eyebrow}
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column: Premium SplitTextReveal Headline */}
          <div className="w-full">
            <ScrollReveal delay={100} direction="up">
              <h2 className="font-['Instrument_Sans'] tracking-[-0.03em] leading-[1.2] text-[26px] md:text-[36px] lg:text-[42px] xl:text-[46px] font-semibold text-black text-balance">
                <SplitTextReveal text={aboutSection.heading} initialDelay={100} />
              </h2>
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom Section: Image on LEFT, Description on RIGHT */}
        <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1.2fr] gap-10 md:gap-16 items-stretch">
          {/* Left Column: Sharp Image with LEFT to RIGHT reveal animation */}
          <div className="w-full h-full">
            <ScrollReveal
              direction="left"
              distance={120}
              duration={1600}
              className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-none overflow-hidden shadow-sm h-full"
            >
              <img
                src={aboutSection.imageUrl}
                alt="Parmar Properties Heritage"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105"
              />
            </ScrollReveal>
          </div>

          {/* Right Column: Narrative Copy & Button */}
          <div className="flex flex-col justify-between gap-8 max-w-[420px] h-full py-2">
            <div className="flex flex-col gap-6 md:gap-8">
              <ScrollReveal delay={200}>
                <ScrollScrubRevealText
                  as="p"
                  className="font-['Instrument_Sans'] tracking-[-0.02em] leading-[1.2] text-xl md:text-2xl lg:text-[26px] text-balance"
                  segments={aboutSection.bodySegments}
                  scrubStart="top 90%"
                  scrubEnd="center 50%"
                />
              </ScrollReveal>
            </div>
            <ScrollReveal delay={300} direction="up">
              <Link
                to="/about"
                className="bg-black text-white text-xs md:text-sm font-semibold px-6 py-3 rounded-full hover:bg-black/85 transition-all duration-300 w-fit inline-block tracking-normal shadow-sm hover:shadow"
              >
                {aboutSection.buttonLabel}
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
