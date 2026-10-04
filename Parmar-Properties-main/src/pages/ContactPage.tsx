import { PageShell, ArrowIcon, primaryButton, secondaryButton } from "@/components/PageShell";
import { Seo } from "@/seo/Seo";
import { pages } from "@/seo/pages";
import { site, whatsappLink } from "@/seo/site";
import { breadcrumbSchema, organizationSchema, webPageSchema } from "@/seo/schema";

const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;
const displayPhone = (phone: string) => phone.replace(/-/g, " ");

export const ContactPage = () => {
  const { address } = site;
  return (
    <PageShell breadcrumbs={[{ name: "Contact" }]}>
      <Seo
        {...pages.contact}
        jsonLd={[
          webPageSchema({ type: "ContactPage", ...pages.contact }),
          organizationSchema(),
          breadcrumbSchema([{ name: "Contact", path: "/contact" }]),
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        <div className="flex flex-col gap-8">
          <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-normal tracking-[-0.04em] leading-[1.05]">
            Contact Parmar Properties
          </h1>
          <p data-speakable className="text-[17px] md:text-[19px] leading-[1.6] text-black/70 max-w-[560px]">
            Speak to a South Mumbai property advisor about buying, selling or leasing a home or office. Visit our Parel office, call us,
            or message us on WhatsApp.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink("Hi, I would like to schedule a consultation.")} target="_blank" rel="noopener noreferrer" className={primaryButton}>
              Chat on WhatsApp <ArrowIcon size={14} />
            </a>
            <a href={telHref(site.officePhone)} className={secondaryButton}>
              Call {displayPhone(site.officePhone)}
            </a>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40 mb-2">Office</dt>
              <dd>
                <address className="not-italic text-[16px] leading-[1.6]">
                  {site.legalName}
                  <br />
                  {address.streetAddress}
                  <br />
                  {address.addressLocality}, {address.addressRegion} {address.postalCode}
                </address>
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm underline underline-offset-2 text-black/60 hover:text-black">
                  Get directions
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40 mb-2">Phone</dt>
              <dd className="flex flex-col gap-1 text-[16px]">
                <a href={telHref(site.officePhone)} className="hover:underline">{displayPhone(site.officePhone)} (office)</a>
                {site.phones.map((p) => (
                  <a key={p} href={telHref(p)} className="hover:underline">{displayPhone(p)}</a>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40 mb-2">Email</dt>
              <dd className="text-[16px]">
                <a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40 mb-2">Areas we cover</dt>
              <dd className="text-[15px] leading-[1.6] text-black/70">
                Worli, Malabar Hill, Mahalaxmi, Tardeo, Cuffe Parade, Lower Parel, Prabhadevi and across South Mumbai
              </dd>
            </div>
            {site.rera && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40 mb-2">MahaRERA</dt>
                <dd className="text-[16px]">{site.rera}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="w-full min-h-[360px] lg:min-h-[520px] bg-white">
          <iframe
            title="Map showing the Parmar Properties office at Peninsula Centre, Parel, Mumbai"
            src={site.mapsEmbedUrl}
            className="w-full h-full min-h-[360px] lg:min-h-[520px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </PageShell>
  );
};
