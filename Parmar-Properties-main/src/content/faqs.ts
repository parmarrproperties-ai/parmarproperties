// ============================================================
// faqs.ts — Questions and answers for the /faq page.
// Answers are written as short, direct paragraphs (40–60 words)
// so they can be used for featured snippets and voice answers.
// ============================================================

import type { Faq } from "@/seo/schema";

export type FaqGroup = { heading: string; faqs: Faq[] };

export const faqGroups: FaqGroup[] = [
  {
    heading: "About Parmar Properties",
    faqs: [
      {
        question: "What is Parmar Properties?",
        answer:
          "Parmar Properties is a South Mumbai luxury real estate advisory founded in 1981. We help families, HNIs, NRIs and business owners buy, sell and lease premium homes and commercial spaces, and have helped more than 5,124 families with over 1,289 residential and 328 commercial deals.",
      },
      {
        question: "Where is the Parmar Properties office?",
        answer:
          "Our office is at 208, Peninsula Centre, Dr. S S Rao Road, Parel, Mumbai 400012. You can call us on +91 22 6666 9733 or +91 93222 32899, message us on WhatsApp, or email office@parmarproperties.in to book a meeting.",
      },
      {
        question: "Which areas of Mumbai does Parmar Properties cover?",
        answer:
          "We focus on South and Central Mumbai, including Worli, Worli Sea Face, Malabar Hill, Altamount Road, Pedder Road, Breach Candy, Nepean Sea Road, Walkeshwar, Cuffe Parade, Nariman Point, Marine Drive, Tardeo, Mahalaxmi, Lower Parel, Prabhadevi, Dadar and Sewri.",
      },
      {
        question: "Who runs Parmar Properties?",
        answer:
          "Parmar Properties was founded by Mr. Jain Dilip P. Parmar, who has more than 40 years of real estate experience. It is run today with directors Mr. Sanjay Dilip Parmar, who leads marketing and sales, and Mr. Jain Ankit Dilip Parmar, who brings financial and market expertise.",
      },
      {
        question: "Which developers does Parmar Properties work with?",
        answer:
          "We work with leading Mumbai developers including Lodha, Godrej Properties, Piramal Realty, Rustomjee, Kalpataru, Runwal, L&T Realty, Adani Realty, Shapoorji Pallonji, Peninsula Land, Marathon, Bhoomi, Avighna and Avhad, which gives our clients early access to launches and inventory.",
      },
    ],
  },
  {
    heading: "Buying Luxury Property in South Mumbai",
    faqs: [
      {
        question: "What should I check before buying a luxury flat in Mumbai?",
        answer:
          "Check the project's MahaRERA registration, the developer's delivery record, the carpet area rather than only the built-up area, floor-plan efficiency, view and orientation, parking allotment, maintenance charges and the payment plan. For resale homes, also check the title chain and society NOC with your lawyer.",
      },
      {
        question: "How do I check if a project is registered with MahaRERA?",
        answer:
          "Search the project name or registration number on the official MahaRERA website, maharera.maharashtra.gov.in. The listing shows the developer, approved plans, the promised completion date and quarterly progress updates. Ask the developer for the registration number before you pay a booking amount.",
      },
      {
        question: "What does a 20:80 payment plan mean?",
        answer:
          "In a 20:80 plan, the buyer pays about 20% of the price at booking and the remaining 80% at possession, instead of in construction-linked instalments. It eases cash flow during construction, but terms vary by developer, so read the agreement carefully and compare the total cost with other plans.",
      },
      {
        question: "Is Worli or Malabar Hill better for a luxury home?",
        answer:
          "Worli suits buyers who want newer high-rise towers, sea views and fast access to the Sea Link and Coastal Road. Malabar Hill suits buyers who value established neighbourhoods, scarcity and long-standing prestige. The right choice depends on lifestyle, commute, budget and whether you prefer new or older buildings.",
      },
      {
        question: "Should I buy a new launch or a resale luxury apartment?",
        answer:
          "New launches offer modern amenities and staggered payments but involve waiting for possession. Resale homes offer certainty and faster move-in but may need renovation. Compare the total cost, including stamp duty, interiors and time to possession, rather than only the quoted price per square foot.",
      },
    ],
  },
  {
    heading: "NRI Buyers",
    faqs: [
      {
        question: "Can NRIs buy property in Mumbai?",
        answer:
          "Yes. NRIs and OCI cardholders can buy residential and commercial property in India, but generally not agricultural land, plantations or farmhouses. Payments are made through NRE, NRO or FCNR accounts or by inward remittance through banking channels. Parmar Properties helps NRIs shortlist, visit and complete purchases remotely.",
      },
      {
        question: "Can an NRI buy property in Mumbai without visiting India?",
        answer:
          "Yes, many steps can be completed remotely using virtual walkthroughs, and a registered power of attorney can sign documents on your behalf. Most buyers still visit once to see their final shortlist. We plan visits around your trip so decisions can be made efficiently.",
      },
    ],
  },
  {
    heading: "Selling and Leasing",
    faqs: [
      {
        question: "How do I sell my flat in South Mumbai quickly?",
        answer:
          "Price it correctly from recent comparable transactions, keep documents ready (sale deed, share certificate, society NOC, tax receipts) and present the home well. Parmar Properties introduces your property privately to pre-qualified HNI, NRI and business-family buyers, which shortens the time to a serious offer.",
      },
      {
        question: "Do rental agreements in Mumbai need to be registered?",
        answer:
          "Yes. In Maharashtra, leave-and-licence agreements must be registered, and this can usually be done online. Parmar Properties coordinates the agreement and registration for both landlords and tenants as part of our leasing service.",
      },
      {
        question: "How much does Parmar Properties charge?",
        answer:
          "Our fee depends on the property and the type of transaction — buying, selling or leasing. We agree it clearly with you at the start, before any visits, so there are no surprises later. Call or WhatsApp us for details on your requirement.",
      },
    ],
  },
];

export const allFaqs = faqGroups.flatMap((g) => g.faqs);
