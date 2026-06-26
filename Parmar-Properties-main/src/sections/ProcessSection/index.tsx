import { ProcessHeader } from "@/sections/ProcessSection/components/ProcessHeader";
import { ProcessSteps } from "@/sections/ProcessSection/components/ProcessSteps";

export const ProcessSection = () => {
  return (
    <section className="bg-white py-10 md:py-16 w-full overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 flex flex-col md:flex-row md:justify-between items-start gap-12 lg:gap-24">
        <ProcessHeader />
        <ProcessSteps />
      </div>
    </section>
  );
};
