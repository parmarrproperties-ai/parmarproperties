import { ScrollReveal } from "@/components/ScrollReveal";

export type SupportCardProps = {
    imageAlt: string;
    imageSrc: string;
    title: string;
    description: string;
    buttonText: string;
    iconSrc: string;
    iconAlt: string;
    delay?: number;
    href?: string;
};

export const SupportCard = (props: SupportCardProps) => {
  return (
      <div className="group relative flex-1 flex flex-col transition-[flex] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] hover:flex-[1.8] lg:hover:flex-[2.5] min-h-[320px] md:min-h-[380px] lg:min-h-[420px] rounded-xl overflow-hidden cursor-pointer">
        <ScrollReveal 
          delay={props.delay || 0} 
          className="w-full flex-1 flex flex-col justify-between p-6 md:p-8"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              alt={props.imageAlt}
              src={props.imageSrc}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Gradients for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 transition-opacity duration-500 ease-out group-hover:opacity-90" />
          </div>

          {/* Content Top */}
          <div className="relative z-10 flex flex-col gap-4 w-[260px] md:w-[280px]">
            <h3 className="text-3xl md:text-4xl font-['Instrument_Sans'] font-medium tracking-tight text-white leading-tight">
              {props.title}
            </h3>
            
            <div className="absolute top-full left-0 w-full mt-4 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:-translate-y-2 pointer-events-none group-hover:pointer-events-auto">
              <p className="text-base md:text-lg text-white/80 leading-relaxed font-['Instrument_Sans'] w-full">
                {props.description}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-auto transition-transform duration-500 ease-in-out group-hover:translate-y-0">
            <a
              href={props.href || "https://parmar-properties-two.vercel.app/services"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/50 text-white font-['Instrument_Sans'] text-sm md:text-base font-medium transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:border-white"
            >
              {props.buttonText}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
            </a>
          </div>
        </ScrollReveal>
      </div>
    );
  };
  