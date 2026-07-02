import { SplitTextReveal } from "@/components/SplitTextReveal";
import { ScrollReveal } from "@/components/ScrollReveal";
import { cta } from "@/content/content";
import IndianFamily from "assets/Indian family.png";

export const CtaSection = () => {
  return (
    <section className="relative flex items-center justify-center text-white h-[400px] md:h-[600px]">
      <div className="absolute inset-0 overflow-hidden bg-neutral-900/80">
        <img
          alt=""
          src={IndianFamily}
          loading="lazy"
          className="w-full h-full object-cover scale-[1.0102] mix-blend-overlay"
        />
      </div>
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 md:px-16 text-center">
        <div className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.3px] md:tracking-[-0.48px] leading-tight">
          <SplitTextReveal 
            text={cta.headline}
            className="text-3xl sm:text-4xl md:text-5xl tracking-[-0.3px] md:tracking-[-0.48px] leading-tight"
          />
        </div>
        <ScrollReveal delay={300} className="mt-8 md:mt-[30px] flex items-center justify-center gap-4">
          <div>
            <a
              href={cta.primaryButton.href}
              className="inline-flex items-center justify-center bg-white text-neutral-900 text-base md:text-sm font-medium leading-6 px-6 py-3.5 md:px-5 md:py-3 rounded-[100px] transition-transform hover:scale-105"
            >
              <span className="mr-3">
                {cta.primaryButton.label}
              </span>
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
    </section>
  );
};