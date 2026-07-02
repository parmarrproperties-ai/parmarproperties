import { ServicePanel } from "@/sections/ServicesSection/components/ServicePanel";
import { ServicesCta } from "@/sections/ServicesSection/components/ServicesCta";
import { services } from "@/content/content";

export const ServicesSection = () => {
  return (
    <section id="services" className="bg-black pt-0 pb-10 md:pb-16 w-full overflow-hidden">
      <div className="w-full flex flex-col border-b border-white/20">
        {services.items.map((item, index) => (
          <ServicePanel
            key={item.number}
            imageUrl={item.imageUrl}
            description={item.description}
            label={item.label}
            number={item.number}
            delay={index * 150}
          />
        ))}
      </div>

      <ServicesCta />
    </section>
  );
};
