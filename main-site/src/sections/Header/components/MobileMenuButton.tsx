export const MobileMenuButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
    return (
      <button
        onClick={onClick}
        aria-label="Menu control"
        className="items-center z-50 bg-transparent caret-transparent flex flex-col text-[10px] h-[30px] justify-center leading-[11.5px] min-h-[auto] min-w-[auto] outline-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black relative no-underline w-[30px] border p-0 border-transparent md:hidden md:text-[6.66667px] md:h-5 md:leading-[7.66667px] md:min-h-0 md:min-w-0 md:w-5"
      >
        <span className={`bg-neutral-900 box-border caret-transparent block text-[10px] h-px leading-[11.5px] outline-[3px] absolute no-underline w-full transition-all duration-300 ${isOpen ? "rotate-45" : "-translate-y-[5px]"}`}></span>
        <span className={`bg-neutral-900 box-border caret-transparent block text-[10px] h-px leading-[11.5px] outline-[3px] absolute no-underline w-full transition-all duration-300 ${isOpen ? "-rotate-45" : "translate-y-[5px]"}`}></span>
      </button>
    );
  };
  