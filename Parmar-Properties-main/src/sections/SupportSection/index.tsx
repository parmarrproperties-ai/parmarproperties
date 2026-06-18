import { SupportHeader } from "@/sections/SupportSection/components/SupportHeader";
import { SupportCard } from "@/sections/SupportSection/components/SupportCard";

export const SupportSection = () => {
  return (
    <section className="bg-neutral-900 text-white py-16 md:py-[100px] w-full overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16">
        <SupportHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16">
          <SupportCard
            imageAlt="Immediate HNI Reach"
            imageSrc="https://c.animaapp.com/mq3zczchi8fb7N/assets/18.jpg"
            title="Immediate HNI Reach"
            description="Direct access to qualified, liquidity-rich HNI buyers and business families."
            buttonText="Learn More"
            iconSrc="https://c.animaapp.com/mq3zczchi8fb7N/assets/icon-6.svg"
            iconAlt="Icon"
            delay={0}
          />
          <SupportCard
            imageAlt="Pre-Launch Velocity"
            imageSrc="https://c.animaapp.com/mq3zczchi8fb7N/assets/91.jpg"
            title="Pre-Launch Velocity"
            description="Proven pre-launch and early-launch sales execution capabilities."
            buttonText="Learn More"
            iconSrc="https://c.animaapp.com/mq3zczchi8fb7N/assets/icon-6.svg"
            iconAlt="Icon"
            delay={100}
          />
          <SupportCard
            imageAlt="Pricing Insights"
            imageSrc="https://c.animaapp.com/mq3zczchi8fb7N/assets/17.jpg"
            title="Pricing Insights"
            description="Market-backed pricing intelligence and transparent mandate-based relationships."
            buttonText="Learn More"
            iconSrc="https://c.animaapp.com/mq3zczchi8fb7N/assets/icon-6.svg"
            iconAlt="Icon"
            delay={200}
          />
        </div>
      </div>
    </section>
  );
};

