import { footer, brand } from "@/content/content";

export const FooterLegal = () => {
  return (
      <div className="col-span-full flex flex-row flex-wrap justify-end items-center text-white/40 text-xs font-medium mt-8 md:mt-5 gap-x-4 md:gap-x-8">
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
  