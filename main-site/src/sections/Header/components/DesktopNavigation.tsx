import { NavigationItem } from "@/sections/Header/components/NavigationItem";
import { navigation } from "@/content/content";

export const DesktopNavigation = () => {
  return (
    <nav className="box-border caret-transparent gap-x-[normal] hidden text-[10px] leading-[11.5px] min-h-0 min-w-0 outline-[3px] gap-y-[normal] no-underline ml-auto md:gap-x-12 md:flex md:text-[6.66667px] md:leading-[7.66667px] md:min-h-[auto] md:min-w-[auto] md:gap-y-[26.6667px]">
      {navigation.links.map((link, idx) => (
        <NavigationItem
          key={idx}
          label={link.label}
          href={link.href}
          itemVariant="uppercase items-center box-border caret-transparent gap-x-2.5 flex text-lg font-medium leading-[22.5px] min-h-0 min-w-0 outline-[3px] gap-y-2.5 no-underline md:gap-x-[6.66667px] md:text-[13.3333px] md:leading-[16.6667px] md:min-h-[auto] md:min-w-[auto] md:gap-y-[6.66667px]"
          isDropdown={link.isDropdown ?? false}
          dropdownItems={link.dropdownItems}
        />
      ))}
    </nav>
  );
};
