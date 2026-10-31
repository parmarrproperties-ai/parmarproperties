import { Link, useParams } from "react-router-dom";
import { PageShell, ArrowIcon, primaryButton, secondaryButton } from "@/components/PageShell";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { Seo } from "@/seo/Seo";
import { servicePageMeta } from "@/seo/pages";
import { whatsappLink } from "@/seo/site";
import { breadcrumbSchema, faqSchema, serviceSchema, webPageSchema } from "@/seo/schema";
import { getServicePage, servicePages } from "@/content/services";

export const ServiceDetailPage = () => {
  const { slug = "" } = useParams();
  const service = getServicePage(slug);
  const meta = servicePageMeta(slug);
  if (!service || !meta) return <NotFoundPage />;

  const path = `/services/${service.slug}`;
  const others = servicePages.filter((s) => s.slug !== service.slug);

  return (
    <PageShell breadcrumbs={[{ name: "Services", path: "/services" }, { name: service.h1 }]}>
      <Seo
        {...meta}
        image={service.imageUrl}
        imageAlt={service.imageAlt}
        jsonLd={[
          webPageSchema({ path, title: meta.title, description: meta.description }),
          serviceSchema({ name: service.name, path, description: service.summary, serviceType: service.serviceType }),
          faqSchema(service.faqs),
          breadcrumbSchema([{ name: "Services", path: "/services" }, { name: service.h1, path }]),
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-20 items-start mb-16">
        <div className="flex flex-col gap-6">
          <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-normal tracking-[-0.04em] leading-[1.05]">{service.h1}</h1>
          <p data-speakable className="text-[17px] md:text-[19px] leading-[1.6] text-black/75">{service.summary}</p>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink(service.whatsappText)} target="_blank" rel="noopener noreferrer" className={primaryButton}>
              Talk to an advisor <ArrowIcon size={14} />
            </a>
            <Link to="/contact" className={secondaryButton}>Contact details</Link>
          </div>
        </div>
        <img src={service.imageUrl} alt={service.imageAlt} className="w-full aspect-[4/3] object-cover" />
      </div>

      <div className="max-w-[900px] flex flex-col gap-12">
        {service.sections.map((section) => (
          <section key={section.question} className="flex flex-col gap-4 pb-10 border-b border-black/10">
            <h2 className="text-[26px] md:text-[32px] tracking-[-0.03em]">{section.question}</h2>
            {section.answer.map((para) => (
              <p key={para} className="text-[15px] md:text-[17px] leading-[1.7] text-black/80">{para}</p>
            ))}
            {section.bullets && (
              <ul className="list-disc pl-5 flex flex-col gap-2 text-[15px] md:text-[17px] leading-[1.6] text-black/80">
                {section.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            )}
          </section>
        ))}

        <section className="flex flex-col gap-6">
          <h2 className="text-[26px] md:text-[32px] tracking-[-0.03em]">Frequently Asked Questions</h2>
          <dl className="flex flex-col gap-6">
            {service.faqs.map((faq) => (
              <div key={faq.question} className="flex flex-col gap-2">
                <dt className="text-[17px] md:text-[19px] font-semibold">{faq.question}</dt>
                <dd className="text-[15px] md:text-[16px] leading-[1.7] text-black/75">{faq.answer}</dd>
              </div>
            ))}
          </dl>
          <p className="text-[15px] text-black/60">
            More answers on our <Link to="/faq" className="underline underline-offset-2">FAQ page</Link> and in our{" "}
            <Link to="/blog" className="underline underline-offset-2">buyer guides</Link>.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-[22px] md:text-[26px] tracking-[-0.03em]">Other services</h2>
          <ul className="flex flex-wrap gap-3">
            {others.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className={secondaryButton}>{s.h1}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
};
