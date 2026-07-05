import { useNavigate, useLocation } from "react-router-dom";

export type NavigationItemProps = {
  label: string;
  href: string;
  itemVariant: string;
  isDropdown: boolean;
  dropdownItems?: { label: string; href: string }[];
};

export const NavigationItem = ({ label, href, itemVariant, isDropdown, dropdownItems }: NavigationItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, targetHref: string) => {
    if (targetHref.startsWith('/#')) {
      e.preventDefault();
      const hash = targetHref.replace('/', '');
      if (location.pathname === '/') {
        const element = document.querySelector(hash);
        if (element) {
          const lenis = (window as any).lenis;
          if (lenis) {
            lenis.scrollTo(element, { offset: -80 });
          } else {
            const y = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
          window.history.pushState(null, '', targetHref);
        }
      } else {
        navigate(targetHref);
      }
    }
  };
  const customStyle = {
    fontFamily: '"Instrument Sans", "Instrument Sans", sans-serif',
  };

  return (
    <div className={`group relative ${itemVariant}`}>
      {isDropdown ? (
        <>
          <button
            type="button"
            className="flex items-center gap-1.5 text-base font-semibold text-neutral-900 transition-colors duration-200 py-2 cursor-pointer"
            style={customStyle}
          >
            <span className="relative">
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 transition-all duration-300 group-hover:w-full"></span>
            </span>
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* Dropdown Menu - Smooth fade & slide slide-down on hover */}
          <div 
            className={`absolute top-[85%] mt-2 min-w-[220px] bg-white border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-xl py-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4 ${
              label === 'Opportunities' || label === 'Contact' 
                ? 'right-0' 
                : 'left-1/2 -translate-x-1/2'
            }`}
          >
            {dropdownItems?.map((item, idx) => {
              const isNewTab = label === "Opportunities" || label === "Contact";
              return (
                <a
                  key={idx}
                  href={item.href}
                  target={isNewTab ? "_blank" : undefined}
                  rel={isNewTab ? "noopener noreferrer" : undefined}
                  className="block px-6 py-3 text-[15px] font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors duration-200"
                  style={customStyle}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </>
      ) : (
        <a
          href={href}
          onClick={(e) => handleClick(e, href)}
          target={href.startsWith('http') ? "_blank" : undefined}
          rel={href.startsWith('http') ? "noopener noreferrer" : undefined}
          className="block text-base font-semibold text-neutral-900 transition-colors duration-200 py-2"
          style={customStyle}
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
  