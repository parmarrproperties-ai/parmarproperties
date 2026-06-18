import { ServicesHeader } from "@/sections/ServicesSection/components/ServicesHeader";
import { ServicePanel } from "@/sections/ServicesSection/components/ServicePanel";
import { ServicesCta } from "@/sections/ServicesSection/components/ServicesCta";

export const ServicesSection = () => {
  return (
    <section className="bg-black py-20 md:py-32 w-full overflow-hidden">
      <ServicesHeader />
      
      <div className="w-full flex flex-col border-b border-white/20">
        <ServicePanel
          imageUrl="https://c.animaapp.com/mq3zczchi8fb7N/assets/67.jpg"
          description="Access exclusive and pre-launch luxury inventory in South Mumbai. Take advantage of strategic timing, valuation guidance, and street-level pricing intelligence."
          label="BUY"
          delay={0}
        />
        <ServicePanel
          imageUrl="https://c.animaapp.com/mq3zczchi8fb7N/assets/85.jpg"
          description="Achieve high-velocity sales execution. Leverage our direct reach to liquidity-rich HNI buyers and pre-launch sales capabilities to sell in record time."
          label="SELL"
          delay={150}
        />
        <ServicePanel
          imageUrl="https://c.animaapp.com/mq3zczchi8fb7N/assets/48.jpg"
          description="Strategic wealth planning for HNIs, NRIs, and Family Businesses. Get zero-pressure advisory, negotiation leverage, and long-term capital appreciation."
          label="PORTFOLIO"
          delay={300}
        />
      </div>

      <ServicesCta />
    </section>
  );
};
