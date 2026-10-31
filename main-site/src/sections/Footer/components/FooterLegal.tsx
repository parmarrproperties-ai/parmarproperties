import { footer, brand } from "@/content/content";

export const FooterLegal = () => {
  return (
      <div className="flex flex-row flex-wrap justify-start md:justify-end items-center text-white/40 text-[13px] font-medium mt-[42px] md:mt-0 md:pb-1 gap-x-4 md:gap-x-8">
        {footer.legalLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            {link.label}
          </a>
        ))}
        <div>Copyright © {brand.copyrightYear}</div>
      </div>
  );
};
  