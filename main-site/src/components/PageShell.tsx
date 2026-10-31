import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/sections/Header/index";
import { Footer } from "@/sections/Footer/index";

type Crumb = { name: string; path?: string };

/** Layout for content pages: header, visible breadcrumbs, main content and footer. */
export const PageShell = ({ breadcrumbs, children }: { breadcrumbs?: Crumb[]; children: ReactNode }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <>
      <div id="main-content-wrapper" className="min-h-screen bg-[#f3f1ed] text-black overflow-x-clip selection:bg-black selection:text-white relative z-10 flex flex-col font-['Instrument_Sans']">
        <Header />
        <main id="main-content" className="flex-1 pt-[110px] md:pt-[150px] pb-16 md:pb-24 px-6 md:px-16 w-full max-w-[1920px] mx-auto">
          {breadcrumbs && (
            <nav aria-label="Breadcrumb" className="mb-8 text-[12px] font-medium uppercase tracking-widest text-black/40">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link to="/" className="hover:text-black">Home</Link></li>
                {breadcrumbs.map((c) => (
                  <li key={c.name} className="flex items-center gap-2">
                    <span aria-hidden="true">/</span>
                    {c.path ? <Link to={c.path} className="hover:text-black">{c.name}</Link> : <span className="text-black/60">{c.name}</span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};

export const ArrowIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14m-7-7 7 7-7 7" />
  </svg>
);

export const primaryButton =
  "inline-flex items-center gap-2 bg-black text-white text-sm md:text-base font-medium px-6 py-3.5 rounded-full hover:bg-black/85 transition-colors";
export const secondaryButton =
  "inline-flex items-center gap-2 border border-black/20 text-black text-sm md:text-base font-medium px-6 py-3.5 rounded-full hover:bg-black hover:text-white transition-colors";
