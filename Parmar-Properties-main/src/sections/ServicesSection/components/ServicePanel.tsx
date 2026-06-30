import { ScrollReveal } from "@/components/ScrollReveal";

export type ServicePanelProps = {
  imageUrl: string;
  description: string;
  label: string;
  number: number;
  delay?: number;
};

export const ServicePanel = ({ imageUrl, description, label, number, delay = 0 }: ServicePanelProps) => {
  return (
    <ScrollReveal delay={delay} direction="up" distance={40} className="group relative w-full border-t border-white/20 bg-black overflow-hidden flex flex-col md:flex-row items-start md:items-center pt-10 pb-5 md:pt-24 md:pb-[76px] px-6 md:px-16 transition-all duration-500 cursor-pointer">
      {/* Background Image (appears on hover on desktop, always visible on mobile) */}
      <div className="absolute inset-0 opacity-40 md:opacity-0 md:group-hover:opacity-40 transition-opacity duration-700 pointer-events-none z-0 overflow-hidden">
        <img
          src={imageUrl}
          alt={label}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 translate-y-0 md:translate-y-12 md:group-hover:translate-y-0"
        />
      </div>

      <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start md:items-center">
        
        {/* Left Side: Number ring & Description */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full">
          {/* Number Ring */}
          <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-semibold">{number}</span>
          </div>
          
          <p className="text-white/80 font-['Instrument_Sans'] text-lg md:text-xl leading-relaxed max-w-sm">
            {description}
          </p>
        </div>

        {/* Right Side: Huge Label Text & Huge Arrow */}
        <div className="w-full flex items-center justify-start gap-4 md:gap-10">
          <span className="block relative text-white font-['Instrument_Sans'] text-6xl md:text-[160px] lg:text-[180px] font-medium tracking-tight leading-[1.1] transition-transform duration-500 md:group-hover:scale-105
                         after:content-[''] after:absolute after:bottom-[-8px] md:after:bottom-3 after:left-0 after:w-full after:h-[3px] md:after:h-[6px] after:bg-white after:scale-x-0 after:origin-right md:group-hover:after:scale-x-100 md:group-hover:after:origin-left after:transition-transform after:duration-500">
            {label}
          </span>
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" className="text-white font-['Instrument_Sans'] text-6xl md:text-[160px] lg:text-[180px] transition-transform duration-500 md:group-hover:translate-x-6 md:group-hover:scale-105">
            <path d="M4 12h14" strokeLinecap="square" />
            <path d="M12 4l8 8-8 8" strokeLinecap="butt" />
          </svg>
        </div>
      </div>
    </ScrollReveal>
  );
};