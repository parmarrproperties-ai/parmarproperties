import { ProcessHeader } from "@/sections/ProcessSection/components/ProcessHeader";
import { ProcessSteps } from "@/sections/ProcessSection/components/ProcessSteps";

export const ProcessSection = () => {
  return (
    <section className="bg-white py-5 md:py-11 w-full overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 flex flex-col md:flex-row md:justify-between items-start gap-8 lg:gap-16 xl:gap-20">
        <ProcessHeader />
        <ProcessSteps />
      </div>
    </section>
  );
};
