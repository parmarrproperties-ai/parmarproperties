import { ScrollReveal } from "@/components/ScrollReveal";

export const ServicesCta = () => {
  return (
    <ScrollReveal className="flex flex-col items-start px-6 md:px-16 mt-16 md:mt-24 w-full max-w-[1920px] mx-auto">
      <h3 className="text-white font-['Instrument_Sans'] text-2xl md:text-3xl lg:text-[40px] font-medium leading-normal tracking-tight max-w-3xl mb-12">
        Our certified agents guide you through every stage of real estate{" "}
        <span className="text-white/40">
          with expert knowledge and reliable support.
        </span>
      </h3>
      
      <a
        href="https://parmar-properties-two.vercel.app/contact"
        className="inline-flex items-center justify-center border border-white/30 text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-medium text-sm transition-colors duration-300"
      >
        <span>Get Started with Parmar Properties</span>
        <svg className="ml-3 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </ScrollReveal>
  );
};