import { Link } from "react-router-dom";
import { PageShell, ArrowIcon, primaryButton } from "@/components/PageShell";
import { Seo } from "@/seo/Seo";
import { pages } from "@/seo/pages";
import { whatsappLink } from "@/seo/site";
import { breadcrumbSchema, serviceSchema, webPageSchema } from "@/seo/schema";
import { servicePages, servicesHub } from "@/content/services";

export const ServicesPage = () => (
  <PageShell breadcrumbs={[{ name: "Services" }]}>
    <Seo
      {...pages.services}
      jsonLd={[
        webPageSchema({ type: "CollectionPage", ...pages.services }),
        ...servicePages.map((s) => serviceSchema({ name: s.name, path: `/services/${s.slug}`, description: s.summary, serviceType: s.serviceType })),
        breadcrumbSchema([{ name: "Services", path: "/services" }]),
      ]}
    />

    <div className="max-w-[900px] mb-14">
      <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-normal tracking-[-0.04em] leading-[1.05] mb-6">{servicesHub.h1}</h1>
      <p data-speakable className="text-[17px] md:text-[19px] leading-[1.6] text-black/70">{servicesHub.summary}</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {servicePages.map((s) => (
        <Link key={s.slug} to={`/services/${s.slug}`} className="group bg-white flex flex-col overflow-hidden">
          <img src={s.imageUrl} alt={s.imageAlt} loading="lazy" className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
          <div className="p-8 flex flex-col gap-3">
            <h2 className="text-[24px] md:text-[28px] tracking-[-0.03em]">{s.h1}</h2>
            <p className="text-[15px] leading-[1.7] text-black/70">{s.summary}</p>
            <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold">
              Learn more <ArrowIcon size={14} />
            </span>
          </div>
        </Link>
      ))}
    </div>

    <div className="mt-16 bg-white p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <h2 className="text-[24px] md:text-[30px] tracking-[-0.03em]">Not sure where to start?</h2>
        <p className="text-[15px] leading-[1.7] text-black/70 mt-2">Tell us what you are planning and an advisor will guide you.</p>
      </div>
      <a href={whatsappLink("Hi, I would like to talk to an expert.")} target="_blank" rel="noopener noreferrer" className={`${primaryButton} w-fit`}>
        Talk to an expert <ArrowIcon size={14} />
      </a>
    </div>
  </PageShell>
);
