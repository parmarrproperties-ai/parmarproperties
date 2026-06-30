<<<<<<< HEAD
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { support } from "@/content/content";

export const SupportHeader = () => {
  return (
    <div className="flex flex-col md:grid gap-10 md:gap-x-8 md:grid-cols-[auto_650px] items-start">

      {/* Heading */}
      <ScrollReveal direction="up" delay={0}>
        <h2 className="text-[44px] font-medium tracking-[-0.88px] leading-[46.2px] md:text-5xl md:tracking-[-1.92px] md:leading-[48px] text-balance">
          <ScrollScrubRevealText
            text={support.heading}
            className="text-[44px] tracking-[-0.88px] leading-[46.2px] md:text-5xl md:tracking-[-1.92px] md:leading-[48px]"
            baseColorClass="text-white/30"
            revealColorClass="text-white"
            scrubStart="top 90%"
            scrubEnd="center 40%"
          />
        </h2>
      </ScrollReveal>

      {/* Body text + button */}
      <ScrollReveal direction="up" delay={150}>
        <p className="text-[22px] font-medium leading-[28.6px] md:text-[21px] md:tracking-[-0.64px] md:leading-[24.5px]">
          {support.subHeading}
          <span className="text-white/40">
            {" "}{support.subHeadingMuted}
          </span>
        </p>
        <div className="mt-8 md:mt-7">
          <a
            href={support.ctaButton.href}
            className="inline-flex items-center gap-3.5 bg-white text-neutral-900 text-base md:text-xs font-medium px-6 py-3.5 md:px-5 md:py-[10px] rounded-full border border-transparent transition-transform hover:scale-105"
          >
            <span>{support.ctaButton.label}</span>
            <span className="flex items-center justify-center w-6 h-6 md:w-4 md:h-4">
              <img
                src="https://c.animaapp.com/mq3zczchi8fb7N/assets/icon-9.svg"
                alt="Icon"
                className="w-full h-full"
              />
            </span>
          </a>
        </div>
      </ScrollReveal>

    </div>
  );
};
=======
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
          <div className="box-border caret-transparent text-[10px] leading-[11.5px] outline-neutral-900 outline-[3px] no-underline mt-[30px] md:text-[6.66667px] md:leading-[7.66667px] md:mt-[26.6667px]">
            <div className="box-border caret-transparent text-[10px] leading-[11.5px] outline-neutral-900 outline-[3px] no-underline md:text-[6.66667px] md:leading-[7.66667px]">
              <a
                href={support.ctaButton.href}
                className="bg-white box-border caret-transparent text-neutral-900 inline-block text-base font-medium leading-6 outline-[3px] relative no-underline border px-6 py-3.5 rounded-[100px] border-solid border-transparent md:text-xs md:leading-[16.8px] md:px-5 md:py-[10.2667px]"
              >
                <div className="items-center box-border caret-transparent gap-x-3.5 flex text-base justify-center leading-6 outline-[3px] gap-y-3.5 no-underline overflow-hidden md:gap-x-[9.33333px] md:text-xs md:leading-[16.8px] md:gap-y-[9.33333px]">
                  <div className="box-border caret-transparent text-base leading-6 min-h-[auto] min-w-[auto] outline-[3px] no-underline overflow-hidden md:text-xs md:leading-[16.8px]">
                    <span className="box-border caret-transparent block text-base leading-6 outline-[3px] relative no-underline md:text-xs md:leading-[16.8px] after:accent-auto after:box-border after:caret-transparent after:text-neutral-900 after:block after:text-base after:not-italic after:normal-nums after:font-medium after:tracking-[normal] after:leading-6 after:list-outside after:list-disc after:outline-[3px] after:pointer-events-auto after:absolute after:text-start after:no-underline after:indent-[0px] after:normal-case after:visible after:border-separate after:top-[105%] after:inset-x-0 after:font-instrument_sans after:md:text-xs after:md:leading-[16.8px]">
                      {support.ctaButton.label}
                    </span>
                  </div>
                  <span className="items-center box-border caret-transparent flex text-base h-6 justify-center leading-6 min-h-[auto] min-w-6 outline-[3px] no-underline w-6 md:text-xs md:h-4 md:leading-[16.8px] md:min-w-4 md:w-4">
                    <img
                      src="https://c.animaapp.com/mq3zczchi8fb7N/assets/icon-9.svg"
                      alt="Icon"
                      className="box-border caret-transparent text-base leading-6 outline-[3px] no-underline md:text-xs md:leading-[16.8px]"
                    />
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
};
>>>>>>> efc0caeafe50b585c1d6ed32850f70cc46c268aa
