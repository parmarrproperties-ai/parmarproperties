import { useEffect, useState, useRef } from "react";
import { Header } from "@/sections/Header/index";
import { Footer } from "@/sections/Footer/index";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { SplitTextReveal } from "@/components/SplitTextReveal";
import { brand } from "@/content/content";
import Tejukaya from "assets/Tejukaya.webp";
import Sugee from "assets/sugee-Photoroom.webp";
import Rustomjee from "assets/Rustomjee-Photoroom.webp";
import RunwalWebp from "assets/Runwal.webp";
import PeninsulaLand from "assets/Peninsula land-Photoroom.webp";
import Lodha from "assets/lodha-500x328-Photoroom.webp";
import Bhoomi from "assets/bhoomi.webp";
import Avighna from "assets/Avighna-Photoroom.webp";
import Avhad from "assets/avhad-Photoroom.webp";
const ArrowIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14m-7-7 7 7-7 7" />
  </svg>
);

const useCountUp = (end: number, duration: number = 1600, startImmediately: boolean = false) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (startImmediately) {
      let startTimestamp: number | null = null;
      let lastCount = 0;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOutProgress = progress;
        const currentCount = Math.round(easeOutProgress * end);

        if (currentCount !== lastCount) {
          setCount(currentCount);
          lastCount = currentCount;
        }

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTimestamp: number | null = null;
          let lastCount = 0;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = progress;
            const currentCount = Math.round(easeOutProgress * end);

            if (currentCount !== lastCount) {
              setCount(currentCount);
              lastCount = currentCount;
            }

            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    let timeoutId = setTimeout(() => {
      observer.observe(element);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (element) observer.unobserve(element);
    };
  }, [end, duration, startImmediately]);

  return { count, ref };
};

const AnimatedStat = ({
  end,
  suffix,
  prefix = "",
  label,
  alignLeft = false,
  textSize = "text-[64px] md:text-[88px]",
  labelColor = "text-white/50",
  startImmediately = false
}: {
  end: number;
  suffix?: React.ReactNode;
  prefix?: string;
  label: string;
  alignLeft?: boolean;
  textSize?: string;
  labelColor?: string;
  startImmediately?: boolean;
}) => {
  const { count, ref } = useCountUp(end, 1600, startImmediately);
  return (
    <div className={`flex flex-col ${alignLeft ? "items-start text-left" : "items-center text-center justify-center"}`}>
      <span ref={ref} className={`${textSize} font-medium tracking-[-0.04em] leading-[1.1] mb-3 flex items-baseline ${alignLeft ? "" : "justify-center"}`}>
        {prefix}{count}{suffix}
      </span>
      <span className={`text-xs md:text-sm font-semibold tracking-widest uppercase ${labelColor}`}>{label}</span>
    </div>
  );
};

export const AboutPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const narrativeSegments = [
    {
      text: "For over four decades, Parmar Properties has been the silent force behind South Mumbai's most significant residential and commercial acquisitions.",
      revealColorClass: "text-black font-semibold",
      baseColorClass: "text-neutral-300 font-semibold",
    },
    {
      text: " We do not simply list properties. We advise, strategize, and execute with absolute precision. Our clients are high-net-worth individuals, family offices, and NRI investors who demand absolute discretion, unmatched market access, and street-level pricing intelligence.",
      revealColorClass: "text-neutral-500 font-medium",
      baseColorClass: "text-neutral-300 font-medium",
    },
  ];

  const philosophySegments = [
    {
      text: "In South Mumbai's luxury real estate market, trust is the only currency that never depreciates.",
      revealColorClass: "text-black font-medium",
      baseColorClass: "text-neutral-300 font-medium",
    },
    {
      text: " We build relationships that span generations, ensuring every transaction is backed by decades of street-level data, deep developer alignments, and an unwavering commitment to your legacy.",
      revealColorClass: "text-neutral-500 font-normal",
      baseColorClass: "text-neutral-300 font-normal",
    },
  ];

  const partners = [
    { name: "Tejukaya", logo: Tejukaya },
    { name: "Sugee", logo: Sugee, customClass: "scale-125 md:scale-150" },
    { name: "Rustomjee", logo: Rustomjee, customClass: "scale-125 md:scale-150" },
    { name: "Runwal", logo: RunwalWebp, customClass: "scale-125 md:scale-150" },
    { name: "Peninsula Land", logo: PeninsulaLand, customClass: "scale-125 md:scale-150" },
    { name: "Lodha", logo: Lodha, customClass: "scale-125 md:scale-150" },
    { name: "Bhoomi", logo: Bhoomi, customClass: "scale-125 md:scale-150" },
    { name: "Avighna", logo: Avighna },
    { name: "Avhad", logo: Avhad },
  ];

  return (
    <>
      <div id="main-content-wrapper" className="min-h-screen bg-[#f3f1ed] text-black font-['Instrument_Sans'] overflow-x-clip selection:bg-black selection:text-white relative z-10">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @-webkit-keyframes marquee {
            0% { -webkit-transform: translateX(0); }
            100% { -webkit-transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 42s linear infinite;
            -webkit-animation: marquee 42s linear infinite;
            will-change: transform;
          }
        `}</style>
        <Header />

        {/* 1. Immersive Editorial Hero Section */}
        <section className="relative pt-[90px] md:pt-[130px] pb-16 md:pb-24 px-6 md:px-16 w-full max-w-[1920px] mx-auto border-b border-black/5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
            <div className="flex flex-col items-start text-left">
              <ScrollReveal direction="up" delay={0}>
                <p className="text-xs md:text-sm font-semibold tracking-[0.15em] uppercase text-black/40 mb-6">
                  Est. {brand.tagline.match(/\d{4}/)?.[0] || '1981'} &mdash; South Mumbai
                </p>
              </ScrollReveal>

              <h1 className="text-[52px] md:text-[80px] lg:text-[96px] font-['Instrument_Serif'] italic font-normal tracking-[-0.04em] text-black max-w-[800px] mb-8 flex flex-col gap-0 leading-[0.85]">
                <span><SplitTextReveal text="Access." initialDelay={100} /></span>
                <span><SplitTextReveal text="Influence." initialDelay={300} /></span>
                <span><SplitTextReveal text="Legacy." initialDelay={500} /></span>
              </h1>

              <ScrollReveal direction="up" delay={700}>
                <p className="text-[18px] md:text-[22px] font-medium tracking-[-0.03em] leading-[1.3] text-black/60 max-w-[540px] mb-8">
                  South Mumbai's most trusted luxury real estate advisory, shaping premium portfolios and guiding generation-spanning acquisitions.
                </p>
              </ScrollReveal>

              <div className="flex gap-12 border-t border-black/10 pt-8 w-full max-w-[540px]">
                <div>
                  <AnimatedStat
                    end={12}
                    prefix="₹"
                    suffix={<><span className="text-[18px] md:text-[24px]">k+ Cr</span></>}
                    label="Ecosystem volume"
                    alignLeft={true}
                    textSize="text-[36px] md:text-[48px]"
                    labelColor="text-black/40"
                    startImmediately={true}
                  />
                </div>
                <div className="w-[1px] bg-black/10 h-12 self-center"></div>
                <div>
                  <AnimatedStat
                    end={40}
                    suffix="+"
                    label="Market Authority"
                    alignLeft={true}
                    textSize="text-[36px] md:text-[48px]"
                    labelColor="text-black/40"
                    startImmediately={true}
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-full min-h-[300px] md:min-h-[450px]">
              <ScrollReveal direction="left" delay={400} className="w-full h-full relative">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Our Story"
                  className="w-full aspect-[4/3] object-cover transition-all duration-700 hover:scale-[1.02]"
                />
                <div className="absolute inset-0 border border-black/5 pointer-events-none"></div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 2. Our Founders Section */}
        <section className="bg-white py-20 md:py-32 px-6 md:px-16 border-b border-black/5">
          <div className="max-w-[1920px] mx-auto flex flex-col items-center">
            <ScrollReveal direction="up" delay={0}>
              <h2 className="font-['Instrument_Serif'] text-[42px] md:text-[64px] italic text-black mb-16 text-center">
                Our Leadership
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 w-full max-w-6xl">
              {/* Founder 1 */}
              <div className="flex flex-col gap-6">
                <ScrollReveal delay={100} className="w-full aspect-[4/5] bg-neutral-100 relative overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Founder Name"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 border border-black/5 pointer-events-none"></div>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={150}>
                  <h3 className="text-[26px] font-semibold tracking-[-0.03em]">John Doe</h3>
                  <p className="text-sm uppercase tracking-widest text-black/40 mt-1 mb-4">Founder & Chairman</p>
                  <p className="text-base text-black/70 leading-relaxed">
                    Visionary leader with over four decades of unparalleled experience in navigating South Mumbai's complex luxury real estate landscape.
                  </p>
                </ScrollReveal>
              </div>

              {/* Founder 2 (Staggered layout - medium offset) */}
              <div className="flex flex-col gap-6 md:mt-12">
                <ScrollReveal delay={200} className="w-full aspect-[4/5] bg-neutral-100 relative overflow-hidden group">
                  {/* PLACEHOLDER: Replace src with actual founder image */}
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Founder Name"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 border border-black/5 pointer-events-none"></div>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={250}>
                  <h3 className="text-[26px] font-semibold tracking-[-0.03em]">Jane Doe</h3>
                  <p className="text-sm uppercase tracking-widest text-black/40 mt-1 mb-4">Co-Founder & CEO</p>
                  <p className="text-base text-black/70 leading-relaxed">
                    Driving strategic acquisitions and overseeing the execution of high-velocity transactions across premium micro-markets.
                  </p>
                </ScrollReveal>
              </div>

              {/* Founder 3 (Staggered layout - larger offset) */}
              <div className="flex flex-col gap-6 md:mt-24">
                <ScrollReveal delay={300} className="w-full aspect-[4/5] bg-neutral-100 relative overflow-hidden group">
                  {/* PLACEHOLDER: Replace src with actual founder image */}
                  <img
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Founder Name"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 border border-black/5 pointer-events-none"></div>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={350}>
                  <h3 className="text-[26px] font-semibold tracking-[-0.03em]">Richard Roe</h3>
                  <p className="text-sm uppercase tracking-widest text-black/40 mt-1 mb-4">Co-Founder & COO</p>
                  <p className="text-base text-black/70 leading-relaxed">
                    Optimizing operational frameworks and structuring long-term investment strategies for our ultra-high-net-worth client portfolio.
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Editorial Narrative ("Who We Are") */}
        <section className="bg-[#f8f7f4] py-24 md:py-36 px-6 md:px-16 border-b border-black/5">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 relative h-full min-h-[500px]">
              <ScrollReveal direction="right" delay={100} className="absolute top-0 left-0 w-[70%] aspect-[3/4] z-10">
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Interior Details" className="w-full h-full object-cover" />
              </ScrollReveal>
              <ScrollReveal direction="up" delay={300} className="absolute bottom-0 right-0 w-[60%] aspect-square z-20 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Luxury Architecture" className="w-full h-full object-cover" />
              </ScrollReveal>
            </div>

            <div className="order-1 lg:order-2 flex flex-col justify-center">
              <ScrollReveal direction="up" delay={100}>
                <h2 className="font-['Instrument_Serif'] text-[42px] md:text-[56px] italic text-black mb-8">
                  Advisors, Not Brokers.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <ScrollScrubRevealText
                  as="p"
                  className="text-[22px] md:text-[32px] tracking-[-0.03em] leading-[1.25] text-balance"
                  segments={narrativeSegments}
                  scrubStart="top 85%"
                  scrubEnd="center 45%"
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 4. Pillars of Excellence Grid */}
        <section className="bg-white py-24 md:py-32 px-6 md:px-16">
          <div className="max-w-[1920px] mx-auto">
            <ScrollReveal direction="up" delay={100} className="mb-16 md:mb-24 text-center">
              <h2 className="font-['Instrument_Serif'] text-[42px] md:text-[64px] italic text-black">
                The Pillars of Our Advisory
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10 border-y border-black/10">
              {/* Pillar 1 */}
              <div className="p-10 md:p-16 flex flex-col gap-6 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl hover:bg-neutral-50 cursor-default">
                <ScrollReveal delay={100}>
                  <span className="font-['Instrument_Serif'] text-[64px] md:text-[84px] italic text-black/10 leading-[1.1]">01</span>
                  <h3 className="text-[24px] md:text-[28px] font-semibold tracking-[-0.04em] mt-4 mb-2">Unmatched Access</h3>
                  <p className="text-base text-black/60 leading-relaxed">
                    We unlock off-market luxury inventory, pre-launch developer opportunities, and highly restricted residential assets across South Bombay's most prestigious micro-markets.
                  </p>
                </ScrollReveal>
              </div>

              {/* Pillar 2 */}
              <div className="p-10 md:p-16 flex flex-col gap-6 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl hover:bg-neutral-50 cursor-default">
                <ScrollReveal delay={200}>
                  <span className="font-['Instrument_Serif'] text-[64px] md:text-[84px] italic text-black/10 leading-[1.1]">02</span>
                  <h3 className="text-[24px] md:text-[28px] font-semibold tracking-[-0.04em] mt-4 mb-2">Absolute Discretion</h3>
                  <p className="text-base text-black/60 leading-relaxed">
                    Protecting the privacy and strategic interests of South Mumbai's prominent business families, industrialists, and corporate leaders is our highest operational mandate.
                  </p>
                </ScrollReveal>
              </div>

              {/* Pillar 3 */}
              <div className="p-10 md:p-16 flex flex-col gap-6 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl hover:bg-neutral-50 cursor-default">
                <ScrollReveal delay={300}>
                  <span className="font-['Instrument_Serif'] text-[64px] md:text-[84px] italic text-black/10 leading-[1.1]">03</span>
                  <h3 className="text-[24px] md:text-[28px] font-semibold tracking-[-0.04em] mt-4 mb-2">Pricing Intelligence</h3>
                  <p className="text-base text-black/60 leading-relaxed">
                    Our recommendations are backed by decades of street-level transaction records, proprietary valuation models, and deep developer alignments to ensure optimal entry and exit timing.
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Track Record Showcase */}
        <section className="bg-black text-white py-24 md:py-32 px-6 md:px-16 border-y border-white/10">
          <div className="max-w-[1920px] mx-auto text-center mb-16 md:mb-24">
            <ScrollReveal direction="up" delay={0}>
              <h2 className="font-['Instrument_Serif'] text-[48px] md:text-[72px] italic text-white leading-[1.1]">
                Decades of Trusted Execution.
              </h2>
            </ScrollReveal>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 text-center">
            {/* Stat 1 */}
            <ScrollReveal direction="up" delay={100} className="w-full flex items-center justify-center">
              <AnimatedStat end={40} suffix="+" label="Years Presence" />
            </ScrollReveal>
            {/* Stat 2 */}
            <ScrollReveal direction="up" delay={200} className="w-full flex items-center justify-center md:border-x border-white/10">
              <AnimatedStat end={12} prefix="₹" suffix={<><span className="text-[40px] md:text-[60px]">k+ Cr</span></>} label="Ecosystem Volume" />
            </ScrollReveal>
            {/* Stat 3 */}
            <ScrollReveal direction="up" delay={300} className="w-full flex items-center justify-center">
              <AnimatedStat end={154} prefix="₹" suffix={<><span className="text-[40px] md:text-[60px]"> Cr</span></>} label="Sold in 30 Days" />
            </ScrollReveal>
          </div>
        </section>

        {/* 6. Philosophy Quote */}
        <section className="bg-[#f3f1ed] py-24 md:py-36 px-6 md:px-16 text-center border-b border-black/5">
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            <ScrollReveal direction="up" delay={100} className="mb-6">
              <span className="text-[64px] md:text-[96px] font-['Instrument_Serif'] italic text-black/20 leading-[1.1]">“</span>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <ScrollScrubRevealText
                as="p"
                className="text-[26px] md:text-[42px] lg:text-[52px] tracking-[-0.03em] leading-[1.2] text-balance mb-12 font-['Instrument_Serif'] italic"
                segments={philosophySegments}
                scrubStart="top 85%"
                scrubEnd="center 45%"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300}>
              <div className="w-16 h-[1px] bg-black/20 mb-6 mx-auto"></div>
              <p className="text-sm font-semibold tracking-[0.15em] uppercase text-black/60">
                Our Operating Philosophy
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* 7. Our Partners Section */}
        <section className="bg-white py-24 md:py-32 px-6 md:px-16">
          <div className="max-w-[1920px] mx-auto flex flex-col items-center">
            <ScrollReveal direction="up" delay={100} className="text-center mb-12 md:mb-16">
              <h2 className="font-['Instrument_Serif'] text-[36px] md:text-[52px] italic text-black mb-4">
                Our Trusted Partners
              </h2>
              <p className="text-base text-black/60 max-w-2xl mx-auto">
                We collaborate with South Mumbai's most prestigious developers to bring you exclusive access to premium real estate.
              </p>
            </ScrollReveal>

            <div className="w-full max-w-6xl overflow-hidden relative flex">
              {/* Gradient masks for smooth fade on edges */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

              <div className="flex w-max animate-marquee items-center h-24 md:h-32">
                {[...partners, ...partners, ...partners, ...partners].map((partner, idx) => (
                  <img
                    key={idx}
                    src={partner.logo}
                    alt={partner.name}
                    className={`flex-none w-40 h-16 md:w-56 md:h-24 mx-0 object-contain cursor-default ${partner.customClass || ""}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Refined CTA Section */}
        <section className="bg-[#f8f7f4] text-black py-20 md:py-28 px-6 md:px-16 text-center border-t border-black/5">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
            <ScrollReveal direction="up" delay={100}>
              <h2 className="font-['Instrument_Serif'] text-[42px] md:text-[64px] font-normal italic leading-[1.1] tracking-tight text-black">
                Begin Your Private Consultation
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200}>
              <p className="text-sm md:text-base text-black/60 leading-relaxed max-w-[520px]">
                Connect with our senior advisors for a confidential discussion regarding your South Mumbai residential or commercial real estate requirements.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300}>
              <a
                href="https://parmarproperties.in/contact"
                className="inline-flex items-center gap-3 bg-black text-white text-sm md:text-base font-semibold leading-none px-8 py-4 rounded-full hover:bg-black/80 hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 shadow-md"
              >
                <span>Schedule Consultation</span>
                <ArrowIcon size={16} />
              </a>
            </ScrollReveal>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};
