import { ProcessStep } from "@/sections/ProcessSection/components/ProcessStep";
import { ScrollReveal } from "@/components/ScrollReveal";

export const ProcessSteps = () => {
  return (
    <div className="flex-1 min-w-0 w-full max-w-2xl">
      <ScrollReveal className="text-black font-medium text-xl md:text-2xl mb-8 font-['Instrument_Sans']">
        Why South Mumbai:
      </ScrollReveal>
      <div className="flex flex-col">
        <ProcessStep
          stepNumber="01"
          title="Consistent High Liquidity."
          description="₹12,000+ Cr annual luxury transaction volume."
          isFirst={true}
          delay={0}
        />
        <ProcessStep
          stepNumber="02"
          title="HNI Business Families."
          description="78% of buyers in this premium market are HNI business families."
          delay={120}
        />
        <ProcessStep
          stepNumber="03"
          title="Limited Supply."
          description="Limited supply ensures long-term appreciation and wealth preservation."
          isLast={true}
          delay={240}
        />
      </div>
    </div>
  );
};
