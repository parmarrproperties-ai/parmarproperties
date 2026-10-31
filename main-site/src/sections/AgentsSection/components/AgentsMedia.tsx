import { agents } from "@/content/content";

export type AgentsMediaProps = {
  imageUrl: string;
};

export const AgentsMedia = ({ imageUrl }: AgentsMediaProps) => {
  return (
    <div className="flex-1 w-full mb-10 md:mb-0 relative md:pr-10">
      <div className="text-black/60 font-['Instrument_Sans'] font-semibold tracking-widest text-sm uppercase mb-4 md:mb-6">
        {agents.eyebrow}
      </div>
      <div className="relative w-full max-w-[280px] md:max-w-[320px] h-[340px] sm:h-auto aspect-[4/5] rounded-none overflow-hidden mt-8 md:mt-24 hidden md:block">
        <img
          src={imageUrl}
          alt="Agent portrait"
          loading="lazy"
          width="400"
          height="500"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};