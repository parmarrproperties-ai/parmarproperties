import { ScrollReveal } from "@/components/ScrollReveal";
import { identity } from "@/content/content";
import ArrowLady from "assets/Arrow lady.webp";
import Arrow2nd from "assets/Arrow 2nd.webp";
import Arrow3rd from "assets/Arrow 3rd.webp";
import ArrowMan from "assets/Arrow Man.webp";

export const ImageStack = () => {
  // Alt text describes each image for search engines and screen readers.
  const imageAlts = [
    "Property advisor outside a modern Mumbai office tower",
    "Living and dining area of a luxury apartment",
    "Bedroom of a luxury apartment with city views",
    "Client outside a premium office building at dusk",
  ];
  const images = [
    ArrowLady,
    Arrow2nd,
    Arrow3rd,
    ArrowMan,
  ];

  const chevronClipPath = "polygon(0% 0%, 53.1% 0%, 100% 50%, 53.1% 100%, 0% 100%, 46.8% 50%)";

  return (
    <div className="flex justify-center items-center relative overflow-hidden w-full py-8 -mx-4 px-4 sm:mx-0 sm:px-0">
      {images.map((src, index) => {
        const isFirst = index === 0;
        const isLast = index === 3;
        const isSpecial = isFirst || isLast;

        return (
          <ScrollReveal
            key={index}
            delay={index * 150}
            direction="left"
            distance={80}
            className="shrink-0 relative"
            style={{
              zIndex: 10 - index,
              marginLeft: isFirst ? "0" : "clamp(-40px, -6vw, -20px)",
            }}
          >
            <div
              className="identity-card overflow-hidden bg-neutral-900"
              style={{
                width: "clamp(90px, 26vw, 280px)",
                aspectRatio: "346 / 440",
                clipPath: chevronClipPath,
                WebkitClipPath: chevronClipPath,
              }}
            >
              <img loading="lazy" decoding="async"
                src={src}
                alt={imageAlts[index] ?? "Luxury real estate in Mumbai"}
                className={`w-full h-full object-cover select-none ${isSpecial ? "scale-[1.15]" : ""}`}
                draggable={false}
              />
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
};