import { ScrollReveal } from "@/components/ScrollReveal";
import { whyParmar } from "@/content/content";

export const VideoFeature = () => {
  return (
    <div className="w-full max-w-[1920px] mx-auto px-6 md:px-16 2xl:px-32 pt-10">
      <ScrollReveal 
        direction="left" 
        distance={200}
        duration={1500}
        className="relative w-full aspect-[4/5] md:aspect-[21/9] rounded-none overflow-hidden"
      >
        <img
          src={whyParmar.featureImageUrl}
          alt="Luxury Real Estate Placeholder"
          loading="lazy"
          width="1200"
          height="600"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </ScrollReveal>
    </div>
  );
};