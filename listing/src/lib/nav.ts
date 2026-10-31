import type { ComponentType } from "react";
import {
  Boxes,
  Briefcase,
  Building,
  FileText,
  Gem,
  Images,
  Inbox,
  LayoutDashboard,
  MapPin,
  Newspaper,
  Plus,
  Rocket,
  Settings,
  Sparkles,
  Star,
  Trash,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        href: "/admin/dashboard",
        label: "Dashboard",
        description: "Portfolio summary and recent activity",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Properties",
    items: [
      {
        href: "/admin/properties?collection=buy",
        label: "Buy",
        description: "Full residential catalog",
        icon: Building,
      },
      {
        href: "/admin/properties?collection=new-launches",
        label: "New Launches",
        description: "Pre-launch and under-construction",
        icon: Rocket,
      },
      {
        href: "/admin/properties?collection=luxury",
        label: "Luxury Collection",
        description: "₹25 Cr+ trophy residences",
        icon: Gem,
      },
      {
        href: "/admin/commercials",
        label: "Commercials",
        description: "Grade-A offices and retail assets",
        icon: Briefcase,
      },
      {
        href: "/admin/properties/new",
        label: "Add Property",
        description: "Create a new listing",
        icon: Plus,
      },
      {
        href: "/admin/featured-properties",
        label: "Featured",
        description: "Home page featured order",
        icon: Star,
      },
      {
        href: "/admin/trash",
        label: "Trash",
        description: "Restore or permanently remove",
        icon: Trash,
      },
    ],
  },
  {
    title: "Website content",
    items: [
      {
        href: "/admin/hero",
        label: "Hero Section",
        description: "Home page carousel",
        icon: Images,
      },
      {
        href: "/admin/locations",
        label: "Locations",
        description: "Editorial pages and property filter catalogue",
        icon: MapPin,
      },
      {
        href: "/admin/insights",
        label: "Insights",
        description: "Market intelligence articles",
        icon: Newspaper,
      },
      {
        href: "/admin/page-content",
        label: "Page content",
        description: "Per-route editorial copy and SEO",
        icon: FileText,
      },
      {
        href: "/admin/amenities",
        label: "Amenities",
        description: "Shared amenity catalogue",
        icon: Boxes,
      },
    ],
  },
  {
    title: "Enquiries",
    items: [
      {
        href: "/admin/leads",
        label: "Leads",
        description: "Every enquiry the website sends you",
        icon: Inbox,
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        href: "/admin/settings",
        label: "Settings",
        description: "Brand, contact and account",
        icon: Settings,
      },
    ],
  },
];

export const navItems: NavItem[] = navSections.flatMap(
  (section) => section.items
);

export const brandIcon = Sparkles;

/**
 * Matches pathname (+ optional search) to a nav item.
 * Collection query params are part of the match for Buy / New Launches / Luxury.
 */
export function findActiveNavItem(
  pathname: string,
  search = ""
): NavItem | undefined {
  const full = `${pathname}${search}`;

  const exactQuery = navItems.find((item) => item.href === full);
  if (exactQuery) return exactQuery;

  const byPathAndQuery = navItems.find((item) => {
    const [itemPath, itemQuery] = item.href.split("?");
    if (itemPath !== pathname) return false;
    if (!itemQuery) return true;
    const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
    const want = new URLSearchParams(itemQuery);
    for (const [key, value] of want.entries()) {
      if (params.get(key) !== value) return false;
    }
    return true;
  });
  if (byPathAndQuery) return byPathAndQuery;

  // Default /admin/properties with no collection → Buy
  if (pathname === "/admin/properties") {
    return navItems.find((item) => item.href.includes("collection=buy"));
  }

  return [...navItems]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => {
      const itemPath = item.href.split("?")[0];
      return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
    });
}
