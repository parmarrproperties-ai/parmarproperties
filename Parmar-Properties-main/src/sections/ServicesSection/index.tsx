import { ServicesHeader } from "@/sections/ServicesSection/components/ServicesHeader";
import { ServicePanel } from "@/sections/ServicesSection/components/ServicePanel";
import { ServicesCta } from "@/sections/ServicesSection/components/ServicesCta";
import { services } from "@/content/content";

export const ServicesSection = () => {
  return (
    <section id="services" className="bg-black py-10 md:py-16 w-full overflow-hidden">
      <ServicesHeader />
      
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
