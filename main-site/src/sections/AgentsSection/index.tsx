import { AgentsMedia } from "@/sections/AgentsSection/components/AgentsMedia";
import { AgentsContent } from "@/sections/AgentsSection/components/AgentsContent";
import { agents } from "@/content/content";

export const AgentsSection = () => {
  return (
    <section className="bg-[#f7f7f7] py-8 md:py-12 w-full overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 flex flex-col md:flex-row items-start lg:gap-10">
        <AgentsMedia imageUrl={agents.imageUrl} />
        <AgentsContent />
      </div>
    </section>
  );
};
