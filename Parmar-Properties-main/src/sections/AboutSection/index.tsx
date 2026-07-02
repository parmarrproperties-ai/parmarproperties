import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { aboutSection } from "@/content/content";
import AboutUsImg from "assets/AboutUsImg.png";

export const AboutSection = () => {
  const aboutSegments = [
    {
      text: "A boutique real estate consultancy offering curated solutions across luxury residences, commercial spaces, bespoke leases, and NRI investments.",
      revealColorClass: "text-black font-semibold",
      baseColorClass: "text-neutral-300 font-medium",
    },
    {
      text: " With deep developer relationships and a personalised, detail-first approach—we help you find the right space, effortlessly.",
      revealColorClass: "text-[#555] font-medium",
      baseColorClass: "text-neutral-300 font-medium",
    },
  ];

  return (
    <section className="bg-white relative py-16 md:py-24 w-full overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 lg:px-24 xl:px-32 flex flex-col lg:flex-row gap-16 md:gap-24 relative z-10">

        {/* Left Column */}
        <div className="w-full lg:w-[45%] flex flex-col gap-12 pt-4">
          <ScrollReveal direction="up" delay={0}>
            <h2 className="text-[#333] font-['Instrument_Sans'] text-xl md:text-2xl font-medium tracking-wide leading-relaxed max-w-sm">
              Tailored Real Estate Advisory for the Most Discerning Buyers & Sellers
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 w-full mt-4">
            <ScrollReveal direction="up" delay={100} className="border-b border-[#eee] pb-4">
              <div className="text-[48px] md:text-[64px] font-['Instrument_Sans'] font-light text-black leading-none mb-3">40+</div>
              <p className="text-[#666] text-xs md:text-sm font-medium">Years in Business</p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200} className="border-b border-[#eee] pb-4">
              <div className="text-[48px] md:text-[64px] font-['Instrument_Sans'] font-light text-black leading-none mb-3">500+</div>
              <p className="text-[#666] text-xs md:text-sm font-medium">Families Helped</p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300} className="border-b border-[#eee] pb-4">
              <div className="text-[48px] md:text-[64px] font-['Instrument_Sans'] font-light text-black leading-none mb-3">312+</div>
              <p className="text-[#666] text-xs md:text-sm font-medium">Residential Deals</p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={400} className="border-b border-[#eee] pb-4">
              <div className="text-[48px] md:text-[64px] font-['Instrument_Sans'] font-light text-black leading-none mb-3">41+</div>
              <p className="text-[#666] text-xs md:text-sm font-medium">Commercial Deals</p>
            </ScrollReveal>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[55%] flex flex-col pt-8 lg:pt-0 pb-32 lg:pb-0">
          <ScrollReveal direction="up" delay={100}>
            <h1 className="text-[100px] md:text-[140px] lg:text-[180px] font-black text-[#222] leading-[0.8] tracking-tighter mb-10 font-['Inter',sans-serif]">
              ABOUT
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <ScrollScrubRevealText
              as="p"
              className="font-['Instrument_Sans'] text-base md:text-[17px] leading-[1.6] max-w-[500px] mb-10"
              segments={aboutSegments}
              scrubStart="top 85%"
              scrubEnd="center 50%"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-3 bg-black text-white text-sm md:text-base font-medium leading-[1.1] px-6 py-3.5 rounded-full hover:bg-black/85 transition-colors duration-300 shadow-sm"
            >
              <span>LEARN MORE</span>
              <span className="flex items-center justify-center w-5 h-5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </span>
            </Link>
          </ScrollReveal>
        </div>
      </div>

      {/* Decorative Image (positioned top right) */}
      <div className="absolute top-0 right-0 w-80 md:w-[450px] lg:w-[600px] pointer-events-none z-0 transform translate-x-12 lg:translate-x-24 -translate-y-4">
        <ScrollReveal direction="left" delay={500}>
          <img
            src={AboutUsImg}
            alt="Architecture"
            className="w-full h-auto object-cover rounded-tl-3xl shadow-2xl opacity-90"
            style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 10%, black 100%)', maskImage: 'linear-gradient(to top, transparent 10%, black 100%)' }}
          />
        </ScrollReveal>
      </div>
    </section>
  );
};
