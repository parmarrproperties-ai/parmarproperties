import { useScrollReveal } from "@/hooks/useScrollReveal";
import whyParmarVideo from "assets/WhyParmarSectionVideo.mp4";

export const VideoFeature = () => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ triggerOnce: true });

  return (
    <div className="w-full max-w-[1920px] mx-auto px-6 md:px-16 2xl:px-32 pt-[10px] overflow-hidden">
      <div
        ref={ref}
        className="relative w-full aspect-[4/5] md:aspect-[21/9] rounded-none overflow-hidden transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateX(0)" : "translateX(150px)"
        }}
      >
        <video
          src={whyParmarVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};