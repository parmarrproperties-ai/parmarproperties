import { Link } from "react-router-dom";
import { PageShell, ArrowIcon, primaryButton } from "@/components/PageShell";
import { Seo } from "@/seo/Seo";
import { pages } from "@/seo/pages";
import { whatsappLink } from "@/seo/site";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/seo/schema";
import { faqGroups, allFaqs } from "@/content/faqs";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const FaqPage = () => (
  <PageShell breadcrumbs={[{ name: "FAQ" }]}>
    <Seo
      {...pages.faq}
      jsonLd={[
        webPageSchema({ ...pages.faq }),
        faqSchema(allFaqs),
        breadcrumbSchema([{ name: "FAQ", path: "/faq" }]),
      ]}
    />

    <div className="max-w-[900px]">
      <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-normal tracking-[-0.04em] leading-[1.05] mb-6">
        Frequently Asked Questions
      </h1>
      <p data-speakable className="text-[17px] md:text-[19px] leading-[1.6] text-black/70 mb-12">
        Straight answers to the questions we hear most from people buying, selling and leasing luxury property in South Mumbai —
        including NRI buyers.
      </p>

      <nav aria-label="FAQ topics" className="flex flex-wrap gap-2 mb-12">
        {faqGroups.map((g) => (
          <a key={g.heading} href={`#${slugify(g.heading)}`} className="px-3 py-1 rounded-full text-[12px] font-medium border border-black bg-white hover:bg-black hover:text-white transition-colors">
            {g.heading}
          </a>
        ))}
      </nav>

      {faqGroups.map((group) => (
        <section key={group.heading} id={slugify(group.heading)} className="mb-14 scroll-mt-32">
          <h2 className="text-[28px] md:text-[34px] tracking-[-0.03em] mb-6">{group.heading}</h2>
          <div className="flex flex-col divide-y divide-black/10 border-y border-black/10">
            {group.faqs.map((faq) => (
              <details key={faq.question} className="group py-5" open>
                <summary className="cursor-pointer list-none flex justify-between gap-6 text-[17px] md:text-[19px] font-semibold">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <span aria-hidden="true" className="text-black/40 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-[15px] md:text-[16px] leading-[1.7] text-black/75">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ))}

      <div className="bg-white p-8 flex flex-col gap-4">
        <h2 className="text-[24px] md:text-[28px]">Have a different question?</h2>
        <p className="text-[15px] leading-[1.7] text-black/70">
          Our advisors are happy to help. Read our <Link to="/blog" className="underline underline-offset-2">buyer guides</Link>,
          explore our <Link to="/services" className="underline underline-offset-2">services</Link>, or ask us directly.
        </p>
        <a href={whatsappLink("Hi, I have a question about property in South Mumbai.")} target="_blank" rel="noopener noreferrer" className={`${primaryButton} w-fit`}>
          Ask on WhatsApp <ArrowIcon size={14} />
        </a>
      </div>
    </div>
  </PageShell>
);
