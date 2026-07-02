import { useEffect, useState, useRef } from "react";
import { Header } from "@/sections/Header/index";
import { Footer } from "@/sections/Footer/index";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { SplitTextReveal } from "@/components/SplitTextReveal";
import { brand } from "@/content/content";

import Sugee from "assets/sugee-Photoroom.webp";
import Rustomjee from "assets/Rustomjee-Photoroom.webp";
import RunwalWebp from "assets/Runwal.webp";
import PeninsulaLand from "assets/Peninsula land-Photoroom.webp";
import Lodha from "assets/lodha-500x328-Photoroom.webp";
import Bhoomi from "assets/bhoomi.webp";
import Avighna from "assets/Avighna-Photoroom.webp";
import Avhad from "assets/avhad-Photoroom.webp";
import Godrej from "assets/godrejlogo.webp";
import Kalpatru from "assets/kalpatruLogo-removebg-preview.png";
import Piramal from "assets/Piramal Logo.png";
import DilipParmarImage from "assets/Mr. Dilip Parmar.jpeg";
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
      text: "We believe buying a property is more than completing a transaction. It's about understanding your goals, evaluating every opportunity, and helping you make decisions with confidence.",
      revealColorClass: "text-black font-semibold",
      baseColorClass: "text-neutral-300 font-semibold",
    },
    {
      text: " From your first conversation to the final handover, our role is to guide, advise, and represent your best interests at every step.",
      revealColorClass: "text-neutral-500 font-medium",
      baseColorClass: "text-neutral-300 font-medium",
    },
  ];

  const philosophySegments = [
    {
      text: "The right property isn't simply found—it's discovered through the right advice.",
      revealColorClass: "text-black font-medium",
      baseColorClass: "text-neutral-300 font-medium",
    },
    {
      text: " We believe lasting relationships are built through honesty, transparency, and putting our clients' interests before everything else.",
      revealColorClass: "text-neutral-500 font-normal",
      baseColorClass: "text-neutral-300 font-normal",
    },
  ];

  const partners = [

    { name: "Sugee", logo: Sugee, customClass: "scale-125 md:scale-150" },
    { name: "Rustomjee", logo: Rustomjee, customClass: "scale-125 md:scale-150" },
    { name: "Runwal", logo: RunwalWebp, customClass: "scale-125 md:scale-150" },
    { name: "Peninsula Land", logo: PeninsulaLand, customClass: "scale-125 md:scale-150" },
    { name: "Lodha", logo: Lodha, customClass: "scale-125 md:scale-150" },
    { name: "Bhoomi", logo: Bhoomi, customClass: "scale-125 md:scale-150" },
    { name: "Avighna", logo: Avighna },
    { name: "Avhad", logo: Avhad },
    { name: "Godrej", logo: Godrej, customClass: "scale-[1.65] md:scale-[1.95]" },
    { name: "Kalpatru", logo: Kalpatru },
    { name: "Piramal", logo: Piramal, customClass: "scale-75 md:scale-[0.85]" },
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
        <section className="relative pt-[80px] md:pt-[100px] pb-6 md:pb-8 px-6 md:px-16 w-full max-w-[1920px] mx-auto border-b border-black/5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
            <div className="flex flex-col items-start text-left">
              <ScrollReveal direction="up" delay={0}>
                <p className="text-xs md:text-sm font-semibold tracking-[0.15em] uppercase text-black/40 mb-6">
                  Est. {brand.tagline.match(/\d{4}/)?.[0] || '1981'} &mdash; South Mumbai
                </p>
              </ScrollReveal>

              <h1 className="text-[48px] md:text-[64px] lg:text-[80px] font-['Instrument_Serif'] italic font-normal tracking-[-0.04em] text-black max-w-[800px] mb-8 flex flex-col gap-0 leading-[0.85]">
                <span><SplitTextReveal text="Access." initialDelay={100} /></span>
                <span><SplitTextReveal text="Influence." initialDelay={300} /></span>
                <span><SplitTextReveal text="Legacy." initialDelay={500} /></span>
              </h1>

              <ScrollReveal direction="up" delay={700}>
                <p className="text-[18px] md:text-[22px] font-medium tracking-[-0.03em] leading-[1.3] text-black/60 max-w-[540px]">
                  For over four decades, Parmar Properties has helped families, entrepreneurs, and investors make confident real estate decisions through trusted relationships and thoughtful guidance.
                </p>
              </ScrollReveal>
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
        <section className="bg-white py-12 md:py-16 px-6 md:px-16 border-b border-black/5">
          <div className="max-w-[1920px] mx-auto flex flex-col items-center">
            <ScrollReveal direction="up" delay={0}>
              <h2 className="font-['Instrument_Serif'] text-[36px] md:text-[52px] italic text-black mb-4 text-center">
                People Behind the Relationships
              </h2>
              <p className="text-base text-black/70 max-w-3xl mx-auto text-center mb-16">
                Our leadership brings together decades of market understanding, strong industry relationships, and a shared commitment to putting clients first. Every decision we make is guided by integrity, transparency, and a long-term perspective.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 w-full max-w-6xl">
              {/* Founder 1 */}
              <div className="flex flex-col gap-6">
                <ScrollReveal delay={100} className="w-full aspect-[4/5] bg-neutral-100 relative overflow-hidden group">
                  <img
                    src={DilipParmarImage}
                    alt="Mr. Jain Dilip P. Parmar"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 border border-black/5 pointer-events-none"></div>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={150}>
                  <h3 className="text-[26px] font-semibold tracking-[-0.03em]">Mr. Jain Dilip P. Parmar</h3>
                  <p className="text-sm uppercase tracking-widest text-black/40 mt-1 mb-4">The Leader</p>
                  <p className="text-base text-black/70 leading-relaxed">
                    Founded Parmar Properties with a vision for trusted real estate. Brings 40+ years of experience and leadership.
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
                  <h3 className="text-[26px] font-semibold tracking-[-0.03em]">Mr. Sanjay Dilip Parmar</h3>
                  <p className="text-sm uppercase tracking-widest text-black/40 mt-1 mb-4">The Director</p>
                  <p className="text-base text-black/70 leading-relaxed">
                    Leads marketing and sales with strong market expertise. Also drives business growth and team development.
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
                  <h3 className="text-[26px] font-semibold tracking-[-0.03em]">Mr. Jain Ankit Dilip Parmar</h3>
                  <p className="text-sm uppercase tracking-widest text-black/40 mt-1 mb-4">The Director</p>
                  <p className="text-base text-black/70 leading-relaxed">
                    Brings energy with financial and market expertise. Leads campaigns and helps buyers find their dream homes.
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Editorial Narrative ("Who We Are") */}
        <section className="bg-[#f8f7f4] py-12 md:py-16 px-6 md:px-16 border-b border-black/5">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-center">
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
                <h2 className="font-['Instrument_Serif'] text-[36px] md:text-[48px] italic text-black mb-8">
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
        <section className="bg-white py-12 md:py-16 px-6 md:px-16">
          <div className="max-w-[1920px] mx-auto">
            <ScrollReveal direction="up" delay={100} className="mb-10 md:mb-12 text-center">
              <h2 className="font-['Instrument_Serif'] text-[36px] md:text-[52px] italic text-black">
                Built on Principles That Never Change
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10 border-y border-black/10">
              {/* Pillar 1 */}
              <div className="p-10 md:p-16 flex flex-col gap-6 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl hover:bg-neutral-50 cursor-default">
                <ScrollReveal delay={100}>
                  <span className="font-['Instrument_Serif'] text-[64px] md:text-[84px] italic text-black/10 leading-[1.1]">01</span>
                  <h3 className="text-[24px] md:text-[28px] font-semibold tracking-[-0.04em] mt-4 mb-2">Personalized Guidance</h3>
                  <p className="text-base text-black/60 leading-relaxed">
                    Every client has different aspirations. We take the time to understand your goals before recommending the right opportunities.
                  </p>
                </ScrollReveal>
              </div>

              {/* Pillar 2 */}
              <div className="p-10 md:p-16 flex flex-col gap-6 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl hover:bg-neutral-50 cursor-default">
                <ScrollReveal delay={200}>
                  <span className="font-['Instrument_Serif'] text-[64px] md:text-[84px] italic text-black/10 leading-[1.1]">02</span>
                  <h3 className="text-[24px] md:text-[28px] font-semibold tracking-[-0.04em] mt-4 mb-2">Honest Advice</h3>
                  <p className="text-base text-black/60 leading-relaxed">
                    Clear communication and transparent guidance help you make informed decisions with complete confidence.
                  </p>
                </ScrollReveal>
              </div>

              {/* Pillar 3 */}
              <div className="p-10 md:p-16 flex flex-col gap-6 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl hover:bg-neutral-50 cursor-default">
                <ScrollReveal delay={300}>
                  <span className="font-['Instrument_Serif'] text-[64px] md:text-[84px] italic text-black/10 leading-[1.1]">03</span>
                  <h3 className="text-[24px] md:text-[28px] font-semibold tracking-[-0.04em] mt-4 mb-2">Local Expertise</h3>
                  <p className="text-base text-black/60 leading-relaxed">
                    Our understanding of South Mumbai's real estate market helps clients discover opportunities that align with their lifestyle and investment goals.
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Track Record Showcase */}
        <section className="bg-black text-white py-12 md:py-16 px-6 md:px-16 border-y border-white/10">
          <div className="max-w-[1920px] mx-auto text-center">
            <ScrollReveal direction="up" delay={0}>
              <h2 className="font-['Instrument_Serif'] text-[40px] md:text-[56px] italic text-white leading-[1.1] mb-8">
                Relationships Built Over Time
              </h2>
              <p className="text-[18px] md:text-[22px] font-medium tracking-[-0.03em] leading-[1.3] text-white/80 max-w-3xl mx-auto">
                Every property journey is unique, but our commitment remains the same—to offer honest guidance, thoughtful advice, and a real estate experience built on trust.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* 6. Philosophy Quote */}
        <section className="bg-[#f3f1ed] py-12 md:py-16 px-6 md:px-16 text-center border-b border-black/5">
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
        <section className="bg-white py-12 md:py-16 px-6 md:px-16">
          <div className="max-w-[1920px] mx-auto flex flex-col items-center">
            <ScrollReveal direction="up" delay={100} className="text-center mb-12 md:mb-16">
              <h2 className="font-['Instrument_Serif'] text-[32px] md:text-[46px] italic text-black mb-4">
                Our Trusted Partners
              </h2>
              <p className="text-base text-black/60 max-w-2xl mx-auto">
                We work alongside some of Mumbai's most respected developers to provide our clients with access to thoughtfully selected residential and investment opportunities. Because strong partnerships create better opportunities.
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
        <section className="bg-[#f8f7f4] text-black py-12 md:py-16 px-6 md:px-16 text-center border-t border-black/5">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
            <ScrollReveal direction="up" delay={100}>
              <h2 className="font-['Instrument_Serif'] text-[36px] md:text-[52px] font-normal italic leading-[1.1] tracking-tight text-black">
                Let's Start the Conversation
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200}>
              <p className="text-sm md:text-base text-black/60 leading-relaxed max-w-[520px]">
                Whether you're searching for your next home or planning your next investment, we're here to guide you with clarity, care, and confidence.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300}>
              <a
                href="https://parmarproperties.in/contact"
                className="inline-flex items-center gap-3 bg-black text-white text-sm md:text-base font-semibold leading-none px-8 py-4 rounded-full hover:bg-black/80 hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 shadow-md"
              >
                <span>Schedule a Private Consultation</span>
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
