"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LogOut, Menu, TriangleAlert, X } from "lucide-react";
import { toast } from "sonner";

import type { Profile } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { findActiveNavItem } from "@/lib/nav";
import { getCurrentProfile, signOut } from "@/lib/api/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { LoadingBlock } from "@/components/shared/states";
import { SetupNotice } from "@/components/admin/setup-notice";

function initialsFor(profile: Profile): string {
  const source = profile.full_name?.trim() || profile.email;
  return source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const configured = isSupabaseConfigured();

  const [profile, setProfile] = React.useState<Profile | null>(null);
  // Nothing to load when the environment variables are missing.
  const [loading, setLoading] = React.useState(configured);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  React.useEffect(() => {
    if (!configured) return;

    let cancelled = false;

    getCurrentProfile()
      .then((result) => {
        if (cancelled) return;
        if (!result) {
          router.replace("/admin/login");
          return;
        }
        setProfile(result);
      })
      .catch((error) => {
        if (!cancelled) toast.error(getErrorMessage(error));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [configured, router]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      router.replace("/admin/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
      setSigningOut(false);
    }
  }

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <SetupNotice />
      </div>
    );
  }

  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const activeItem = findActiveNavItem(pathname, search);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <SidebarNav />
        </div>
      </aside>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-xl">
            <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Close navigation"
              className="absolute top-4 right-3 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setMobileNavOpen(false)}
            >
              <X />
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Open navigation"
            className="lg:hidden"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu />
          </Button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {activeItem?.label ?? "Admin"}
            </p>
            {activeItem?.description ? (
              <p className="truncate text-xs text-muted-foreground">
                {activeItem.description}
              </p>
            ) : null}
          </div>

          {profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                  <Avatar>
                    <AvatarFallback>{initialsFor(profile)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
                    {profile.full_name || profile.email}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-foreground">
                  <span className="block truncate font-medium">
                    {profile.full_name || "Admin"}
                  </span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {profile.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  disabled={signingOut}
                  onClick={handleSignOut}
                >
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </header>

        {profile && !profile.is_active ? (
          <div className="flex items-start gap-2 border-b border-warning/40 bg-warning/10 px-4 py-3 text-sm sm:px-6">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
            <p className="text-warning-foreground">
              Your admin profile is not active yet, so saving changes will be
              blocked by the database. Ask a super admin to set{" "}
              <code className="rounded bg-warning/20 px-1">is_active</code> to
              true on your profile row.
            </p>
          </div>
        ) : null}

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {loading ? <LoadingBlock label="Loading workspace…" /> : children}
        </main>
      </div>
    </div>
  );
}
