"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Building } from "lucide-react";

import { cn } from "@/lib/utils";
import { findActiveNavItem, navSections } from "@/lib/nav";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const active = findActiveNavItem(pathname, search);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/20 text-primary-foreground">
          <Building className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Parmar Properties</p>
          <p className="truncate text-xs text-sidebar-muted">Admin CMS</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <p className="px-2 pb-1 text-[11px] font-semibold tracking-wider text-sidebar-muted uppercase">
              {section.title}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = active?.href === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-5 py-4">
        <p className="text-xs text-sidebar-muted">
          Content saved here is the source of truth for the public website.
        </p>
      </div>
    </div>
  );
}
