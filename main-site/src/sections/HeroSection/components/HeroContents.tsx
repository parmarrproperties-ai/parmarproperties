import { HeroButton } from "@/sections/HeroSection/components/HeroButton";

export const HeroContents = () => {
  return (
    <div className="max-w-[640px]">
      {/* Eyebrow tag */}
      <div className="text-white/60 text-sm font-medium tracking-[0.15em] uppercase mb-6 font-[Instrument_Sans]">
        Expert Real Estate Agents
      </div>

      {/* Main headline */}
      <h1
        aria-label="Building Relationships"
        className="text-white font-[Instrument_Sans] font-semibold tracking-[-1.5px] leading-[1.05] mb-6"
        style={{ fontSize: "clamp(44px, 5.5vw, 72px)" }}
      >
        Building<br />Relationships
      </h1>

      {/* Sub-headline */}
      <p className="text-white/70 font-[Instrument_Sans] font-medium leading-relaxed mb-10"
        style={{ fontSize: "clamp(16px, 1.8vw, 22px)" }}
      >
        Expert agents. Real guidance. A clear path to find what's next.
      </p>

      {/* CTA button */}
      <HeroButton />
    </div>
  );
};
