export type NavigationItemProps = {
  label: string;
  href: string;
  itemVariant: string;
  isDropdown: boolean;
};

export const NavigationItem = ({ label, href, itemVariant, isDropdown }: NavigationItemProps) => {
  return (
    <div className={`group relative font-['Instrument_Sans'] ${itemVariant}`}>
      {isDropdown ? (
        <button
          type="button"
          className="flex items-center gap-2 text-base font-semibold text-neutral-900 transition-colors duration-200"
        >
          <span className="relative">
            {label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 transition-all duration-300 group-hover:w-full"></span>
          </span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ) : (
        <a
          href={href}
          className="block text-base font-semibold text-neutral-900 transition-colors duration-200"
        >
          <span className="relative">
            {label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 transition-all duration-300 group-hover:w-full"></span>
          </span>
        </a>
      )}
    </div>
  );
};
  