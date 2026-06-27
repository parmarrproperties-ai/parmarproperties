import { NavigationItem } from "@/sections/Header/components/NavigationItem";
import { navigation } from "@/content/content";

const [about, expertise, opportunities, contact] = navigation.links;

export const DesktopNavigation = () => {
  return (
    <nav className="box-border caret-transparent gap-x-[normal] hidden text-[10px] leading-[11.5px] min-h-0 min-w-0 outline-[3px] gap-y-[normal] no-underline m-auto md:gap-x-12 md:flex md:text-[6.66667px] md:leading-[7.66667px] md:min-h-[auto] md:min-w-[auto] md:gap-y-[26.6667px]">
      <NavigationItem
        label={about.label}
        href={about.href}
        itemVariant="items-center box-border caret-transparent gap-x-2.5 flex text-lg font-medium leading-[22.5px] min-h-0 min-w-0 outline-[3px] gap-y-2.5 no-underline md:gap-x-[6.66667px] md:text-[13.3333px] md:leading-[16.6667px] md:min-h-[auto] md:min-w-[auto] md:gap-y-[6.66667px]"
        isDropdown={about.isDropdown ?? false}
        dropdownItems={about.dropdownItems}
      />
      <NavigationItem
        label={expertise.label}
        href={expertise.href}
        itemVariant="items-center gap-x-2.5 flex text-lg font-medium leading-[22.5px] gap-y-2.5 md:gap-x-[6.66667px] md:text-[13.3333px] md:leading-[16.6667px] md:gap-y-[6.66667px]"
        isDropdown={expertise.isDropdown ?? false}
        dropdownItems={expertise.dropdownItems}
      />
      <NavigationItem
        label={opportunities.label}
        href={opportunities.href}
        itemVariant="items-center gap-x-2.5 flex text-lg font-medium leading-[22.5px] gap-y-2.5 md:gap-x-[6.66667px] md:text-[13.3333px] md:leading-[16.6667px] md:gap-y-[6.66667px]"
        isDropdown={opportunities.isDropdown ?? true}
        dropdownItems={opportunities.dropdownItems}
      />
      <NavigationItem
        label={contact.label}
        href={contact.href}
        itemVariant="items-center gap-x-2.5 flex text-lg font-medium leading-[22.5px] gap-y-2.5 md:gap-x-[6.66667px] md:text-[13.3333px] md:leading-[16.6667px] md:gap-y-[6.66667px]"
        isDropdown={contact.isDropdown ?? true}
        dropdownItems={contact.dropdownItems}
      />
    </nav>
  );
};
