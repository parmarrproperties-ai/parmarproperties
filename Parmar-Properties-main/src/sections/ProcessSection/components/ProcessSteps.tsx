import { ProcessStep } from "@/sections/ProcessSection/components/ProcessStep";
import { ScrollReveal } from "@/components/ScrollReveal";
import { processSouthMumbai } from "@/content/content";

export const ProcessSteps = () => {
  return (
    <div className="flex-1 min-w-0 w-full lg:-ml-[250px]">
      <ScrollReveal className="text-black font-medium text-xl md:text-2xl mb-8 font-['Instrument_Sans']">
        {processSouthMumbai.subHeading}
      </ScrollReveal>
      <div className="flex flex-col">
        {processSouthMumbai.steps.map((step, index) => (
          <ProcessStep
            key={step.stepNumber}
            stepNumber={step.stepNumber}
            title={step.title}
            description={step.description}
            isFirst={index === 0}
            isLast={index === processSouthMumbai.steps.length - 1}
            delay={index * 120}
          />
        ))}
      </div>
    </div>
  );
};
