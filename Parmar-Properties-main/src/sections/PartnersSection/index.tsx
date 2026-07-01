import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import Sugee from "assets/sugee-Photoroom.webp";
import Rustomjee from "assets/Rustomjee-Photoroom.webp";
import RunwalWebp from "assets/Runwal.webp";
import PeninsulaLand from "assets/Peninsula land-Photoroom.webp";
import Lodha from "assets/lodha-500x328-Photoroom.webp";
import Bhoomi from "assets/bhoomi.webp";
import Avighna from "assets/Avighna-Photoroom.webp";
import Avhad from "assets/avhad-Photoroom.webp";
import Godrej from "assets/godrejlogo.webp";
import Kalpataru from "assets/kalpatruLogo-removebg-preview.png";
import Piramal from "assets/Piramal Logo.png";

export const PartnersSection = () => {
  const row1Partners = [
    { name: "Lodha", logo: Lodha, customClass: "scale-110 md:scale-125" },
    { name: "Godrej", logo: Godrej, customClass: "scale-110 md:scale-125" },
    { name: "Rustomjee", logo: Rustomjee, customClass: "scale-110 md:scale-125" },
    { name: "Kalpataru", logo: Kalpataru, customClass: "scale-110 md:scale-125" },
    { name: "Piramal", logo: Piramal, customClass: "scale-110 md:scale-125" },
    { name: "Peninsula Land", logo: PeninsulaLand, customClass: "scale-110 md:scale-125" },
  ];

  const row2Partners = [
    { name: "Runwal", logo: RunwalWebp, customClass: "scale-110 md:scale-125" },
    { name: "Sugee", logo: Sugee, customClass: "scale-110 md:scale-125" },
    { name: "Bhoomi", logo: Bhoomi, customClass: "scale-110 md:scale-125" },
    { name: "Avighna", logo: Avighna },
    { name: "Avhad", logo: Avhad },
  ];

  return (
    <section className="bg-white py-12 md:py-24 px-6 md:px-16 w-full">
      <div className="max-w-[1920px] mx-auto">
        <ScrollReveal direction="up" delay={100} className="flex flex-col xl:flex-row xl:items-end justify-between mb-12 md:mb-20 gap-8">
          <h2 className="flex flex-col font-['Instrument_Sans'] text-[#222222]">
            <ScrollScrubRevealText
              as="span"
              text="OUR TRUSTED,"
              className="text-[14px] sm:text-[20px] md:text-[38px] lg:text-[50px] font-medium tracking-tight mb-2 md:mb-4 uppercase"
              baseColorClass="text-neutral-300"
              revealColorClass="text-black"
              scrubStart="top 95%"
              scrubEnd="center 65%"
            />
            <ScrollScrubRevealText
              as="span"
              text="PARTNERS"
              className="text-[50px] sm:text-[72px] md:text-[110px] lg:text-[140px] font-bold tracking-[-0.04em] leading-[0.8] uppercase"
              baseColorClass="text-neutral-300"
              revealColorClass="text-neutral-500"
              scrubStart="top 85%"
              scrubEnd="center 45%"
            />
          </h2>
          <p className="font-['Instrument_Sans'] text-base md:text-lg font-medium text-black/80 max-w-md xl:mb-2 leading-relaxed">
            We collaborate with South Mumbai's most prestigious developers to bring you exclusive access to premium real estate.
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-4 md:gap-8 w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-4 items-center justify-items-center w-full">
            {row1Partners.map((partner, idx) => (
              <ScrollReveal key={`row1-${idx}`} delay={idx * 50} direction="up" distance={20} className="flex justify-center items-center w-full">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className={`w-24 md:w-32 lg:w-36 object-contain mix-blend-multiply opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-300 ${partner.customClass || ""}`}
                />
              </ScrollReveal>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-4 items-center justify-items-center w-full lg:px-[5%]">
            {row2Partners.map((partner, idx) => (
              <ScrollReveal key={`row2-${idx}`} delay={idx * 50} direction="up" distance={20} className="flex justify-center items-center w-full">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className={`w-24 md:w-32 lg:w-36 object-contain mix-blend-multiply opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-300 ${partner.customClass || ""}`}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
