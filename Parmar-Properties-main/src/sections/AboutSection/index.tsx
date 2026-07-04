import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { aboutSection } from "@/content/content";
import AboutUsImg from "assets/AboutUsImg.png";

export const AboutSection = () => {

  return (
    <section className="bg-white relative py-16 md:py-24 w-full overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 lg:px-24 xl:px-32 flex flex-col lg:flex-row gap-16 md:gap-24 relative z-10">

        {/* Left Column */}
        <div className="w-full lg:w-[45%] flex flex-col gap-12 pt-4">
          <ScrollReveal direction="up" delay={0}>
            <h2 className="text-[#333] font-['Instrument_Sans'] text-xl md:text-2xl font-medium tracking-wide leading-relaxed max-w-sm">
              {aboutSection.eyebrow}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 w-full mt-4">
            {aboutSection.stats?.map((stat, idx) => (
              <ScrollReveal key={idx} direction="up" delay={(idx + 1) * 100} className="border-b border-[#eee] pb-4">
                <div className="text-[48px] md:text-[64px] font-['Instrument_Sans'] font-light text-black leading-none mb-3">{stat.value}</div>
                <p className="text-[#666] text-xs md:text-sm font-medium">{stat.label}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[55%] flex flex-col pt-8 lg:pt-0 pb-12 lg:pb-0">
          <ScrollReveal direction="up" delay={100}>
            <h1 className="text-[100px] md:text-[140px] lg:text-[180px] font-black text-[#222] leading-[0.8] tracking-tighter mb-10 font-['Inter',sans-serif]">
              {aboutSection.heading}
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <ScrollScrubRevealText
              as="p"
              className="font-['Instrument_Sans'] text-base md:text-[17px] leading-[1.6] max-w-[500px] mb-10"
              segments={aboutSection.bodySegments}
              scrubStart="top 85%"
              scrubEnd="center 50%"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <a
              href="https://wa.me/919322232899?text=Hi%2C%20I%20would%20like%20to%20learn%20more%20about%20Parmar%20Properties."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 bg-black text-white text-sm md:text-base font-medium leading-[1.1] px-6 py-3.5 rounded-full hover:bg-black/85 transition-colors duration-300 shadow-sm"
            >
              <span>{aboutSection.buttonLabel}</span>
              <span className="flex items-center justify-center w-5 h-5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </span>
            </a>
          </ScrollReveal>
        </div>
      </div>

      {/* Decorative Image (positioned middle right) */}
      <div className="absolute top-[65%] md:top-[50%] lg:top-[35%] right-0 w-[110%] md:w-[600px] lg:w-[750px] xl:w-[900px] pointer-events-none z-0 transform translate-x-8 lg:translate-x-24 opacity-80">
        <ScrollReveal direction="left" delay={500}>
          <img
            src={AboutUsImg}
            alt="Architecture"
            className="w-full h-auto object-cover rounded-tl-[3rem] shadow-2xl"
            style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 5%, black 100%)', maskImage: 'linear-gradient(to top, transparent 5%, black 100%)' }}
          />
        </ScrollReveal>
      </div>
    </section>
  );
};
