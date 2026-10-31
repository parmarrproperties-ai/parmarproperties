import { ScrollReveal } from "@/components/ScrollReveal";

export type ProcessStepProps = {
  stepNumber: string;
  title: string;
  description: string;
  isFirst?: boolean;
  isLast?: boolean;
  delay?: number;
};

export const ProcessStep = ({ stepNumber, title, description, isFirst, isLast, delay = 0 }: ProcessStepProps) => {
  return (
    <ScrollReveal delay={delay} className={`flex flex-col md:flex-row items-start md:items-baseline py-8 md:py-10 border-white/20 border-b ${
        isFirst ? "border-t" : ""
      } ${isLast ? "border-b-0" : ""}`}
    >
      <div className="text-white/40 font-['Instrument_Sans'] text-sm tracking-widest mb-4 md:mb-0 md:mr-8 md:w-8 shrink-0">
        {stepNumber}
      </div>
      <div className="font-['Instrument_Sans'] text-2xl md:text-[32px] md:leading-[1.1] font-medium tracking-tight">
        <span className="text-white">{title}</span>{" "}
        <span className="text-white/40">{description}</span>
      </div>
    </ScrollReveal>
  );
};