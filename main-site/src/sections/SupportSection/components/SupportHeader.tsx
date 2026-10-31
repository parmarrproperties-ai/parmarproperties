import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { support } from "@/content/content";

export const SupportHeader = () => {
  return (
    <div className="flex flex-col md:grid gap-10 md:gap-x-[26.6667px] md:grid-cols-[auto_650.667px] items-start">
      
      {/* Heading reveals first */}
      <ScrollReveal direction="up" delay={0}>
        <div className="box-border caret-transparent text-[10px] leading-[11.5px] min-h-[auto] min-w-[auto] outline-neutral-900 outline-[3px] no-underline md:text-[6.66667px] md:leading-[7.66667px]">
          <div className="box-border caret-transparent text-[44px] font-medium tracking-[-0.88px] leading-[46.2px] outline-neutral-900 outline-[3px] no-underline md:text-5xl md:tracking-[-1.92px] md:leading-[48px]">
            <h2 className="box-border caret-transparent text-[44px] tracking-[-0.88px] leading-[46.2px] outline-neutral-900 outline-[3px] no-underline md:text-5xl md:tracking-[-1.92px] md:leading-[48px] text-balance">
              {support.heading.split('\n').map((line, i) => (
                <ScrollScrubRevealText 
                  key={i}
                  as="span"
                  text={line}
                  className="block box-border caret-transparent text-[44px] tracking-[-0.88px] leading-[46.2px] outline-neutral-900 outline-[3px] no-underline md:text-5xl md:tracking-[-1.92px] md:leading-[48px]"
                  baseColorClass="text-white/30"
                  revealColorClass={i === 1 ? "text-neutral-400" : "text-white"}
                  scrubStart="top 90%"
                  scrubEnd="center 40%"
                />
              ))}
            </h2>
          </div>
        </div>
      </ScrollReveal>

      {/* Body text + button reveals 150ms after heading */}
      <ScrollReveal direction="up" delay={150}>
        <div className="box-border caret-transparent text-[10px] leading-[11.5px] min-h-[auto] min-w-[auto] outline-neutral-900 outline-[3px] no-underline md:text-[6.66667px] md:leading-[7.66667px]">
          <div className="box-border caret-transparent text-[22px] font-medium tracking-[normal] leading-[28.6px] outline-neutral-900 outline-[3px] no-underline md:text-[21.3333px] md:tracking-[-0.64px] md:leading-[24.5333px]">
              <p className="box-border caret-transparent text-[22px] tracking-[normal] leading-[28.6px] outline-neutral-900 outline-[3px] no-underline md:text-[21.3333px] md:tracking-[-0.64px] md:leading-[24.5333px]">
                {support.subHeading}
                <span className="box-border caret-transparent text-white/40 text-[22px] tracking-[normal] leading-[28.6px] outline-neutral-900 outline-[3px] no-underline md:text-[21.3333px] md:tracking-[-0.64px] md:leading-[24.5333px]">
                  {" "}{support.subHeadingMuted}
                </span>
              </p>
            </div>
          </div>
        </ScrollReveal>

    </div>
  );
};
