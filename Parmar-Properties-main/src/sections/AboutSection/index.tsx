import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { SplitTextReveal } from "@/components/SplitTextReveal";
import { aboutSection } from "@/content/content";

export const AboutSection = () => {
  return (
    <section className="bg-white relative py-16 md:py-[100px] w-full overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 lg:px-24 xl:px-32 flex flex-col gap-12 md:gap-16">
        {/* Two-Column Layout: Image on LEFT, Content on RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-10 md:gap-16 items-start">
          {/* Left Column: Eyebrow & Image */}
          <div className="w-full max-w-[500px] mx-auto lg:mx-0 flex flex-col gap-6">
            <ScrollReveal delay={100} direction="right">
              <p className="text-black font-['Instrument_Sans'] text-lg md:text-xl font-semibold tracking-[0.02em] uppercase">
                {aboutSection.eyebrow}
              </p>
            </ScrollReveal>

            <ScrollReveal
              direction="left"
              distance={120}
              duration={1600}
              className="relative w-full aspect-square rounded-none overflow-hidden shadow-sm"
            >
              <img
                src={aboutSection.imageUrl}
                alt="Parmar Properties Heritage"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105"
              />
            </ScrollReveal>
          </div>

          {/* Right Column: Heading, Narrative Copy & Button */}
          <div className="flex flex-col gap-8 py-2 lg:pt-[52px] w-full">
            <div className="flex flex-col gap-4 w-full">
              <h2 className="font-['Instrument_Sans'] tracking-[-0.03em] leading-[1.2] text-[26px] md:text-[36px] lg:text-[42px] xl:text-[46px] font-medium text-black w-full">
                <SplitTextReveal text={aboutSection.heading} initialDelay={100} />
              </h2>
            </div>

            <ScrollScrubRevealText
              as="p"
              className="font-['Instrument_Sans'] tracking-[-0.02em] leading-[1.2] text-xl md:text-2xl lg:text-[26px] w-full"
              segments={aboutSection.bodySegments}
              scrubStart="top 90%"
              scrubEnd="center 50%"
            />

            <ScrollReveal delay={300} direction="up">
              <Link
                to="/about"
                className="bg-black text-white text-xs md:text-sm font-semibold px-6 py-3 rounded-full hover:bg-black/85 transition-all duration-300 w-fit inline-block tracking-normal shadow-sm hover:shadow mt-4"
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
