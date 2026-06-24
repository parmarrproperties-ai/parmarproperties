import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { ScrollReveal } from "@/components/ScrollReveal";
import { agents } from "@/content/content";

export const AgentsContent = () => {
  return (
    <div className="flex-1 w-full max-w-3xl flex flex-col justify-center">
      <ScrollScrubRevealText
        as="h2"
        text={agents.heading}
        className="font-['Instrument_Sans'] text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] leading-[1.05] mb-4 md:mb-6"
        baseColorClass="text-neutral-300"
        revealColorClass="text-black"
        scrubStart="top 90%"
        scrubEnd="center 60%"
      />

      <ScrollReveal delay={200} className="relative w-full aspect-[3/2] rounded-none overflow-hidden mb-6">
        <img
          src={agents.imageUrl}
          alt="Agents working"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <ScrollScrubRevealText
          as="p"
          className="text-lg md:text-xl leading-relaxed font-['Instrument_Sans'] mb-6"
          segments={agents.bodySegments}
          scrubStart="top 85%"
          scrubEnd="center 40%"
        />
      </ScrollReveal>

      <ScrollReveal delay={300}>
        <a
          href={agents.ctaButton.href}
          className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-full font-medium text-sm transition-transform hover:scale-105"
        >
          <span>{agents.ctaButton.label}</span>
          <svg className="ml-3 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </ScrollReveal>
    </div>
  );
};