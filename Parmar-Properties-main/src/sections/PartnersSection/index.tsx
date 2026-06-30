import { ScrollReveal } from "@/components/ScrollReveal";
import Tejukaya from "assets/Tejukaya.webp";
import Sugee from "assets/sugee-Photoroom.webp";
import Rustomjee from "assets/Rustomjee-Photoroom.webp";
import RunwalWebp from "assets/Runwal.webp";
import PeninsulaLand from "assets/Peninsula land-Photoroom.webp";
import Lodha from "assets/lodha-500x328-Photoroom.webp";
import Bhoomi from "assets/bhoomi.webp";
import Avighna from "assets/Avighna-Photoroom.webp";
import Avhad from "assets/avhad-Photoroom.webp";

export const PartnersSection = () => {
  const partners = [
    { name: "Tejukaya", logo: Tejukaya },
    { name: "Sugee", logo: Sugee, customClass: "scale-125 md:scale-150" },
    { name: "Rustomjee", logo: Rustomjee, customClass: "scale-125 md:scale-150" },
    { name: "Runwal", logo: RunwalWebp, customClass: "scale-125 md:scale-150" },
    { name: "Peninsula Land", logo: PeninsulaLand, customClass: "scale-125 md:scale-150" },
    { name: "Lodha", logo: Lodha, customClass: "scale-125 md:scale-150" },
    { name: "Bhoomi", logo: Bhoomi, customClass: "scale-125 md:scale-150" },
    { name: "Avighna", logo: Avighna },
    { name: "Avhad", logo: Avhad },
  ];

  return (
    <section className="bg-white py-16 md:py-24 px-6 md:px-16 w-full overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @-webkit-keyframes marquee {
          0% { -webkit-transform: translateX(0); }
          100% { -webkit-transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 42s linear infinite;
          -webkit-animation: marquee 42s linear infinite;
          will-change: transform;
        }
      `}</style>
      <div className="max-w-[1920px] mx-auto flex flex-col items-center">
        <ScrollReveal direction="up" delay={100} className="text-center mb-12 md:mb-16">
          <h2 className="font-['Instrument_Sans'] text-[36px] md:text-[52px] font-medium tracking-tight text-black mb-4">
            Our Trusted Partners
          </h2>
          <p className="font-['Instrument_Sans'] text-base md:text-lg text-black/60 max-w-2xl mx-auto">
            We collaborate with South Mumbai's most prestigious developers to bring you exclusive access to premium real estate.
          </p>
        </ScrollReveal>

        <div className="w-full max-w-6xl overflow-hidden relative flex">
          {/* Gradient masks for smooth fade on edges */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div className="flex w-max animate-marquee items-center h-24 md:h-32">
            {[...partners, ...partners, ...partners, ...partners].map((partner, idx) => (
              <img
                key={idx}
                src={partner.logo}
                alt={partner.name}
                className={`flex-none w-40 h-16 md:w-56 md:h-24 mx-0 object-contain cursor-default ${partner.customClass || ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
