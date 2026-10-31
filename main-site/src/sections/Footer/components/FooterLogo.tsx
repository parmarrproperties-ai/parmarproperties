
export const FooterLogo = () => {
  return (
    <div className="box-border caret-transparent text-[10px] leading-[11.5px] min-h-[auto] min-w-[auto] outline-neutral-900 outline-[3px] no-underline mt-[5px] md:text-[6.66667px] md:leading-[7.66667px] md:mt-[8.3333px]">
      <a
        href="/"
        className="no-underline cursor-pointer transition-opacity duration-200 hover:opacity-80 inline-block"
        aria-label="Go to home page"
      >
        <div className="flex flex-col items-start justify-center font-['Instrument_Sans']">
          <span className="text-[52px] md:text-[120px] font-bold tracking-tight leading-[1.1]">
            PARMAR
          </span>
          <span className="text-[15px] md:text-[32px] font-medium tracking-[0.3em] text-white/70 leading-[1.1] mt-1 md:mt-2">
            PROPERTIES
          </span>
        </div>
      </a>
    </div>
  );
};
