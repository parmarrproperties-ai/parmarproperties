// ============================================================
// services.ts — Copy for /services and /services/:slug pages.
// Each section heading is phrased as a question so search engines
// and AI assistants can lift the answer directly (AEO).
// ============================================================

import buyImg from "assets/Buy image.png";
import sellImg from "assets/Sell image.png";
import leaseImg from "assets/Lease image.png";
import nriImg from "assets/Investment advisory.png";
import type { Faq } from "@/seo/schema";

export type ServiceSection = { question: string; answer: string[]; bullets?: string[] };

export type ServicePage = {
  slug: "buy" | "sell" | "lease" | "nri";
  name: string;
  serviceType: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  /** 40–60 word direct answer shown under the H1 — the snippet candidate. */
  summary: string;
  imageUrl: string;
  imageAlt: string;
  whatsappText: string;
  sections: ServiceSection[];
  faqs: Faq[];
};

export const servicesHub = {
  h1: "Luxury Real Estate Services in South Mumbai",
  summary:
    "Parmar Properties helps families, HNIs, NRIs and business owners buy, sell and lease premium residential and commercial property across South Mumbai. Since 1981 we have helped more than 5,124 families and closed over 1,289 residential and 328 commercial deals, working directly with Mumbai's leading developers.",
};

export const servicePages: ServicePage[] = [
  {
    slug: "buy",
    name: "Buy a Luxury Home in South Mumbai",
    serviceType: "Real estate buyer advisory",
    seoTitle: "Buy Luxury Property in South Mumbai | Parmar Properties",
    seoDescription:
      "Buy a luxury home in Worli, Malabar Hill, Mahalaxmi and across South Mumbai with advisors since 1981. Pre-launch access, pricing guidance and due diligence.",
    h1: "Buy Luxury Property in South Mumbai",
    summary:
      "Parmar Properties helps you buy luxury apartments and homes in South Mumbai, from Worli and Malabar Hill to Mahalaxmi and Tardeo. We shortlist new-launch, pre-launch and resale options, guide you on pricing and payment plans, and support you through due diligence, negotiation and registration.",
    imageUrl: buyImg,
    imageAlt: "Luxury apartment interior in South Mumbai",
    whatsappText: "Hi, I am looking to buy a property in South Mumbai.",
    sections: [
      {
        question: "How does Parmar Properties help you buy a home?",
        answer: [
          "We start with a conversation about how you live, your budget and your timeline, then build a shortlist that fits — not just what happens to be available. Because we have worked in South Mumbai since 1981, we can usually tell you how a building, a developer or a micro-market has performed over time.",
        ],
        bullets: [
          "Requirement mapping: location, size, view, floor, parking and possession timeline",
          "Shortlists across new launches, pre-launch inventory and resale homes",
          "Site visits arranged around your schedule, including virtual walkthroughs for NRIs",
          "Price benchmarking against recent transactions in the same micro-market",
          "Negotiation on price, payment plan and inclusions",
          "Coordination with your lawyer, banker and the developer through to registration",
        ],
      },
      {
        question: "Which South Mumbai locations do you cover?",
        answer: [
          "Our core markets are Worli and Worli Sea Face, Malabar Hill, Altamount Road, Pedder Road, Breach Candy, Nepean Sea Road, Walkeshwar, Cuffe Parade, Nariman Point, Marine Drive, Tardeo, Mahalaxmi, Lower Parel, Prabhadevi, Dadar and Sewri. Each area has a different mix of sea views, connectivity, building age and price, and we help you compare them side by side.",
        ],
      },
      {
        question: "Can you get access to pre-launch luxury projects?",
        answer: [
          "Yes. We work with developers including Lodha, Godrej Properties, Piramal Realty, Rustomjee, Kalpataru, Runwal, L&T Realty, Adani Realty, Shapoorji Pallonji and Peninsula Land, which often means early information on upcoming launches and the best-placed units. We always recommend checking the project's MahaRERA registration before booking.",
        ],
      },
      {
        question: "Should I buy a new launch or a resale home?",
        answer: [
          "New launches can offer modern amenities, staggered payment plans and newer construction, but you wait for possession. Resale homes give you certainty — you see exactly what you are buying and can usually move in sooner — but may need renovation. We help you compare the total cost, not only the quoted price. Our guide on primary vs resale property covers this in detail.",
        ],
      },
    ],
    faqs: [
      { question: "Do you charge buyers a fee?", answer: "Fees depend on the property and the type of transaction. We explain our fee clearly at the start, before any site visits, so there are no surprises." },
      { question: "How long does it take to buy a luxury home in South Mumbai?", answer: "Most buyers take a few weeks to a few months to shortlist and decide. Once you have chosen a home, documentation and registration typically follow over the next few weeks, depending on financing and whether the property is new or resale." },
      { question: "What should I check before booking a luxury apartment?", answer: "Check the MahaRERA registration, the developer's delivery record, carpet area (not only built-up area), floor plan efficiency, view and orientation, parking, maintenance charges and the payment plan. Our 15-point checklist on the blog walks through each one." },
    ],
  },
  {
    slug: "sell",
    name: "Sell Your Property in South Mumbai",
    serviceType: "Real estate seller advisory",
    seoTitle: "Sell Your South Mumbai Property | Parmar Properties",
    seoDescription:
      "Sell your South Mumbai home or office with advisors who reach serious HNI, NRI and business-family buyers. Pricing advice, discreet marketing and negotiation.",
    h1: "Sell Your Property in South Mumbai",
    summary:
      "Parmar Properties helps owners sell luxury homes and commercial spaces in South Mumbai at the right price. We advise on pricing from recent comparable deals, present your property discreetly to a qualified network of HNI, NRI and business-family buyers, and manage negotiation and paperwork through to closing.",
    imageUrl: sellImg,
    imageAlt: "Premium South Mumbai residence prepared for sale",
    whatsappText: "Hi, I would like to sell my property in South Mumbai.",
    sections: [
      {
        question: "How do you price a South Mumbai property for sale?",
        answer: [
          "We look at recent transactions in the same building and micro-market, the property's floor, view, condition and parking, and how much comparable stock is currently on the market. You get a realistic price range and a recommended asking price, with the reasoning behind it.",
        ],
      },
      {
        question: "Who will you show my property to?",
        answer: [
          "Over four decades we have built relationships with families, HNIs, NRIs and business owners who buy in South Mumbai. We present your property to qualified buyers first, which keeps the process discreet and avoids unnecessary visits.",
        ],
        bullets: [
          "Discreet, pre-qualified buyer introductions",
          "Professional presentation of the property",
          "Visits scheduled around your convenience",
          "Negotiation support on price, timelines and terms",
          "Coordination of documentation through to registration",
        ],
      },
      {
        question: "Can you sell commercial property as well?",
        answer: [
          "Yes. We have closed more than 328 commercial deals, including offices, clinics and retail spaces. Commercial sales depend heavily on tenancy, yield and location, and we help you present those numbers clearly to investors and end users.",
        ],
      },
    ],
    faqs: [
      { question: "Is my sale kept confidential?", answer: "Yes. Many of our sellers prefer not to list publicly, so we can introduce the property privately to pre-qualified buyers from our network." },
      { question: "What documents do I need to sell my flat in Mumbai?", answer: "Typically the sale deed or agreement, share certificate (for a society flat), society NOC, property tax and maintenance receipts, and identity documents. Your lawyer will confirm the full list for your property." },
    ],
  },
  {
    slug: "lease",
    name: "Lease Premium Homes and Offices in South Mumbai",
    serviceType: "Residential and commercial leasing",
    seoTitle: "Lease Luxury Homes & Offices in South Mumbai | Parmar",
    seoDescription:
      "Rent or lease out premium apartments and commercial spaces in South Mumbai. Parmar Properties matches landlords and tenants and manages terms and paperwork.",
    h1: "Lease Premium Homes and Offices in South Mumbai",
    summary:
      "Parmar Properties helps tenants find and landlords lease premium apartments, offices and retail spaces across South Mumbai. We match requirements to the right property, negotiate rent, deposit and lock-in terms, and coordinate the leave-and-licence agreement and its registration.",
    imageUrl: leaseImg,
    imageAlt: "Furnished luxury apartment available to lease in South Mumbai",
    whatsappText: "Hi, I am interested in leasing a property in South Mumbai.",
    sections: [
      {
        question: "How does Parmar Properties help tenants?",
        answer: [
          "Tell us your preferred locations, budget, size, furnishing and move-in date. We shortlist homes or offices that match, arrange visits and negotiate rent, security deposit, lock-in period and maintenance terms on your behalf.",
        ],
      },
      {
        question: "How does Parmar Properties help landlords?",
        answer: [
          "We recommend a realistic rent based on comparable properties, introduce pre-screened tenants — including corporate and NRI tenants — and coordinate the agreement so your interests are protected.",
        ],
        bullets: [
          "Rental benchmarking against nearby comparable properties",
          "Tenant screening and introductions",
          "Negotiation of rent, deposit, escalation and lock-in",
          "Leave-and-licence agreement coordination and registration",
        ],
      },
      {
        question: "Do you lease commercial spaces?",
        answer: [
          "Yes — offices, clinics and retail spaces in South and Central Mumbai, including Lower Parel, Worli, Nariman Point and Parel, for both owners and occupiers.",
        ],
      },
    ],
    faqs: [
      { question: "Are leave-and-licence agreements in Mumbai registered?", answer: "Yes. In Maharashtra, leave-and-licence agreements must be registered. We coordinate the registration process, which can usually be completed online." },
      { question: "What is a typical lock-in period?", answer: "It varies by property and negotiation. Residential leases often have a shorter lock-in than commercial leases. We help both sides agree a lock-in that suits their plans." },
    ],
  },
  {
    slug: "nri",
    name: "NRI Property Investment in Mumbai",
    serviceType: "NRI real estate advisory",
    seoTitle: "NRI Property Investment in Mumbai | Parmar Properties",
    seoDescription:
      "Buy, sell or lease Mumbai property from abroad with Parmar Properties. Remote shortlisting, virtual visits, payment guidance and coordination for NRIs.",
    h1: "NRI Property Investment in Mumbai",
    summary:
      "Parmar Properties helps Non-Resident Indians buy, sell and lease property in Mumbai without needing to be in the city for every step. We build a remote shortlist, arrange virtual and in-person visits, explain payment and documentation requirements, and coordinate with your lawyer and bank from booking to registration.",
    imageUrl: nriImg,
    imageAlt: "NRI family reviewing Mumbai property investment options",
    whatsappText: "Hi, I am an NRI and need help with property in Mumbai.",
    sections: [
      {
        question: "Can NRIs buy property in Mumbai?",
        answer: [
          "Yes. Under India's foreign exchange rules, NRIs and OCI cardholders can buy residential and commercial property in India. Agricultural land, plantation property and farmhouses are generally not permitted. Payments are usually made through NRE, NRO or FCNR accounts or by inward remittance through normal banking channels.",
        ],
      },
      {
        question: "How do you help NRIs buy remotely?",
        answer: [
          "We plan the search before you travel, so your time in Mumbai is spent on final decisions rather than first visits.",
        ],
        bullets: [
          "Remote shortlisting with floor plans, videos and live virtual walkthroughs",
          "Planned site visits around your India trips",
          "Guidance on payment channels and documentation",
          "Coordination with your lawyer, bank and the developer",
          "Support with power of attorney arrangements if you cannot be present",
          "After-purchase leasing support",
        ],
      },
      {
        question: "Can you manage my Mumbai property while I am abroad?",
        answer: [
          "We help NRI owners lease their homes to reliable tenants and handle the leave-and-licence process, so the property earns income while you are overseas. When you are ready to exit, our sales advisory helps you sell at the right price.",
        ],
      },
    ],
    faqs: [
      { question: "Do I need to visit Mumbai to buy a property?", answer: "Not necessarily. Many steps can be done remotely, and a registered power of attorney can sign on your behalf. Most NRI clients still visit once to see their shortlisted homes in person." },
      { question: "Can NRIs get a home loan in India?", answer: "Yes. Many Indian banks offer home loans to NRIs. Eligibility and documentation depend on the bank and your country of residence, so speak to your bank early." },
      { question: "Is there tax on rental income or sale of property for NRIs?", answer: "Rental income and capital gains from Indian property are taxable in India, and tax may be deducted at source. Rules change, so confirm the current position with a chartered accountant before you buy or sell." },
    ],
  },
];

export const getServicePage = (slug: string) => servicePages.find((s) => s.slug === slug) ?? null;
