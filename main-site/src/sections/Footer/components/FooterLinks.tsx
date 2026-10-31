import { FooterLinkColumn } from "@/sections/Footer/components/FooterLinkColumn";
import { ScrollReveal } from "@/components/ScrollReveal";
import { footer } from "@/content/content";

export const FooterLinks = () => {
  return (
    <div className="flex justify-between md:justify-end md:gap-32 w-full mt-10 md:mt-0 font-['Instrument_Sans']">
      <FooterLinkColumn
        className="flex flex-col gap-y-4 max-w-max"
        links={footer.primaryLinks}
        isPrimary={true}
      />
      <FooterLinkColumn
        className="flex flex-col gap-y-4 max-w-max text-left md:text-right"
        links={footer.socialLinks}
      />
    </div>
  );
};
