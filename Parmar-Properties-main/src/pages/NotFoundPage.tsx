import { useLocation, Link } from "react-router-dom";
import { PageShell, primaryButton, secondaryButton } from "@/components/PageShell";
import { Seo } from "@/seo/Seo";
import { pages } from "@/seo/pages";

export const NotFoundPage = () => {
  const { pathname } = useLocation();
  return (
    <PageShell>
      <Seo {...pages.notFound} path={pathname} noindex />
      <div className="max-w-[720px] py-10 flex flex-col gap-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40">Error 404</p>
        <h1 className="text-[40px] md:text-[56px] font-normal tracking-[-0.04em] leading-[1.05]">This page could not be found</h1>
        <p className="text-[17px] leading-[1.6] text-black/70">
          The link may be out of date. Try one of these instead:
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/" className={primaryButton}>Home</Link>
          <Link to="/services" className={secondaryButton}>Services</Link>
          <Link to="/blog" className={secondaryButton}>Blog</Link>
          <Link to="/contact" className={secondaryButton}>Contact</Link>
        </div>
      </div>
    </PageShell>
  );
};
