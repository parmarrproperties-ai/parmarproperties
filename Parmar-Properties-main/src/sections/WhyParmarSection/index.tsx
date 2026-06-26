import { SectionIntro } from "@/sections/WhyParmarSection/components/SectionIntro";
import { VideoFeature } from "@/sections/WhyParmarSection/components/VideoFeature";

export const WhyFindSection = () => {
  return (
    <section className="bg-white relative py-10 md:py-16 w-full overflow-hidden">
      <SectionIntro />
      <VideoFeature />
    </section>
  );
};
