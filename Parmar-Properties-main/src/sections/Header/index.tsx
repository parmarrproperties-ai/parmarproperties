import { useState } from "react";
import { HeaderLogo } from "@/sections/Header/components/HeaderLogo";
import { DesktopNavigation } from "@/sections/Header/components/DesktopNavigation";
import { MobileMenuButton } from "@/sections/Header/components/MobileMenuButton";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      data-mobile-menu-open={isMobileMenuOpen ? "true" : "false"}
      className="box-border caret-transparent text-sm min-h-[auto] min-w-[auto] absolute no-underline z-50 top-0 inset-x-0"
      style={{
        background: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        borderBottom: "none",
        boxShadow: "none",
      }}
    >
      <div className="box-border caret-transparent w-full max-w-[1920px] no-underline mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="items-center box-border caret-transparent text-neutral-900 grid grid-cols-[1fr_auto] leading-[11.5px] min-h-[94px] relative no-underline z-50 md:grid-cols-[166.667px_1fr_166.667px] md:leading-[1.5] md:min-h-[62px]">
          <HeaderLogo />
          <DesktopNavigation />
          <MobileMenuButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div className={`fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 text-2xl font-['Instrument_Sans']">
          <a href="/search" className="text-neutral-900 font-medium no-underline hover:text-neutral-600 transition-colors">Search</a>
          <a href="/agents" className="text-neutral-900 font-medium no-underline hover:text-neutral-600 transition-colors">Agents</a>
          <a href="/join" className="text-neutral-900 font-medium no-underline hover:text-neutral-600 transition-colors">Join</a>
          <a href="/about" className="text-neutral-900 font-medium no-underline hover:text-neutral-600 transition-colors">About Us</a>
        </div>
      </div>
    </header>
  );
};