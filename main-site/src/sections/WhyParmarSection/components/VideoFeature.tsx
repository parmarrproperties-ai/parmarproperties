import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import whyParmarVideo from "assets/WhyParmarSectionVideo-web.mp4";

export const VideoFeature = () => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ triggerOnce: true });

  // The video is the heaviest file on the home page. Start downloading it only
  // when the visitor scrolls to within ~1.5 screens of it, so it doesn't compete
  // with the hero for bandwidth (faster first load / LCP).
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  useEffect(() => {
    const el = videoRef.current;
    if (!el || shouldLoad) return;
    if (typeof IntersectionObserver === "undefined") { setShouldLoad(true); return; }
    const observer = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { setShouldLoad(true); observer.disconnect(); } },
      { rootMargin: "150% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoad]);

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
          ref={videoRef}
          src={shouldLoad ? whyParmarVideo : undefined}
          preload="none"
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
