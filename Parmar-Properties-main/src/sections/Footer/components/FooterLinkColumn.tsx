export type FooterLink = {
  href: string;
  label: string;
  linkClassName?: string;
  spanClassName?: string;
};

export type FooterLinkColumnProps = {
  className: string;
  links: FooterLink[];
  isPrimary?: boolean;
};

export const FooterLinkColumn = ({ className, links, isPrimary }: FooterLinkColumnProps) => {
  return (
    <div className={className}>
      {links.map((link) => (
        <a 
          key={`${link.href}-${link.label}`} 
          href={link.href} 
          target={link.label === "Opportunities" || link.label === "Expertise" ? undefined : "_blank"}
          rel={link.label === "Opportunities" || link.label === "Expertise" ? undefined : "noopener noreferrer"}
          className={link.linkClassName || (isPrimary ? "text-2xl md:text-3xl font-medium tracking-tight hover:text-white/70 transition-colors" : "text-base font-medium hover:text-white/70 transition-colors")}
        >
          {link.spanClassName ? (
            <span className={link.spanClassName}>{link.label}</span>
          ) : (
            link.label
          )}
        </a>
      ))}
    </div>
  );
};
