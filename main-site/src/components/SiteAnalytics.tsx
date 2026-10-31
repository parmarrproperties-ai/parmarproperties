import { useEffect } from "react";
import { Analytics, track, type BeforeSendEvent } from "@vercel/analytics/react";

// Admin pages are staff-only: keep them out of the visitor numbers.
const beforeSend = (event: BeforeSendEvent) =>
  new URL(event.url).pathname.startsWith("/admin") ? null : event;

/** Classifies a clicked link as a lead action (WhatsApp, phone call or email). */
function leadType(href: string): "WhatsApp" | "Call" | "Email" | null {
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) return "WhatsApp";
  if (href.startsWith("tel:")) return "Call";
  if (href.startsWith("mailto:")) return "Email";
  return null;
}

/**
 * Vercel Web Analytics: page views (including client-side navigation), plus a
 * "Lead Click" custom event whenever a visitor taps a WhatsApp, phone or email
 * link anywhere on the site. Renders nothing visible.
 */
export const SiteAnalytics = () => {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const type = leadType(link.getAttribute("href") || "");
      if (type) track("Lead Click", { type, page: window.location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return <Analytics beforeSend={beforeSend} />;
};
