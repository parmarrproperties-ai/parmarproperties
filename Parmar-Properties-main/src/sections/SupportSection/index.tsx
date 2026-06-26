import { SupportHeader } from "@/sections/SupportSection/components/SupportHeader";
import { SupportCard } from "@/sections/SupportSection/components/SupportCard";
import { support } from "@/content/content";

export const SupportSection = () => {
  return (
    <section className="bg-neutral-900 text-white py-8 md:py-[50px] w-full overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16">
        <SupportHeader />
        <div className="flex flex-col md:flex-row gap-2 md:gap-8 mt-12 md:mt-16 w-full">
          {support.cards.map((card, index) => (
            <SupportCard
              key={card.title}
              imageAlt={card.title}
              imageSrc={card.imageSrc}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
              iconSrc={card.iconSrc}
              iconAlt="Icon"
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

