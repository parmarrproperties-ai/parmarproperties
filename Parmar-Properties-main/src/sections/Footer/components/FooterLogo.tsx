import { ScrollReveal } from "@/components/ScrollReveal";

export const FooterLogo = () => {
  return (
    <ScrollReveal delay={0} className="box-border caret-transparent text-[10px] col-end-[logo] col-start-[logo] row-end-[logo] row-start-[logo] leading-[11.5px] min-h-[auto] min-w-[auto] outline-neutral-900 outline-[3px] no-underline mt-20 md:text-[6.66667px] md:leading-[7.66667px] md:mt-[83.3333px]">
      <a
        href="/"
        className="no-underline cursor-pointer transition-opacity duration-200 hover:opacity-80 inline-block"
        aria-label="Go to home page"
      >
        <div className="flex flex-col items-start justify-center font-['Instrument_Sans']">
          <span className="text-[52px] md:text-[80px] font-bold tracking-tight leading-none">
            PARMAR
          </span>
          <span className="text-[15px] md:text-[22px] font-medium tracking-[0.3em] text-white/70 leading-none mt-1 md:mt-2">
            PROPERTIES
          </span>
        </div>
      </a>
    </ScrollReveal>
  );
};
