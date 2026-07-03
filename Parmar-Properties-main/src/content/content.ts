// ============================================================
// content.ts – Single source of truth for all user-facing content
// NO React, NO JSX. Pure TypeScript.
//
// BLOG DATA: Moved to Supabase. Use useBlogPosts() / fetchPostBySlug().
// BlogPost type is defined in src/lib/types.ts (re-exported below for
// backward compatibility).
// ============================================================

// Re-export so any file that still does `import { BlogPost } from "@/content/content"`
// continues to compile without changes.
export type { BlogPost } from "@/lib/types";

import t1 from "assets/testimonial1.png";
import t2 from "assets/testimonial2.png";
import t3 from "assets/testimonial3.png";
import sideImg from "assets/Indian family.png";
import investmentAdvisoryImg from "assets/Investment advisory.png";
import exclusiveOpportunitiesImg from "assets/Exclusive Opportunities.png";
import completeSupportImg from "assets/Complete support.png";
import buyImg from "assets/Buy image.png";
import sellImg from "assets/Sell image.png";
import leaseImg from "assets/Lease image.png";
import parmarPropertiesLogo from "assets/Parmar Properties Logo.png";

// ─── Types ──────────────────────────────────────────────────
type NavLink = {
  label: string;
  href: string;
  isDropdown?: boolean;
  dropdownItems?: { label: string; href: string }[];
};
type CtaButton = { label: string; href: string };
type TextSegment = { text: string; revealColorClass: string; baseColorClass: string };
type ServiceItem = { number: number; label: string; description: string; imageUrl: string };
type ProcessStep = { stepNumber: string; title: string; description: string };
type SupportCard = { title: string; description: string; imageSrc: string; iconSrc: string; buttonText: string; href: string };
type TestimonialItem = { quote: string; author: string; rating: number; imageUrl: string };
type FooterLink = { label: string; href: string };
type ContactInfo = { label: string; value: string; href: string };

// ─── Brand ──────────────────────────────────────────────────
export const brand = {
  name: "Parmar Properties",
  tagline: "South Mumbai's Trusted Luxury Real Estate Advisory Since 1981",
  copyrightYear: new Date().getFullYear(),
  logoUrl: parmarPropertiesLogo,
};

// ─── Header / Navigation ────────────────────────────────────
export const navigation = {
  links: [
    { label: "Home", href: "/", isDropdown: false },
    { label: "About Us", href: "/About", isDropdown: false },
    { label: "Services", href: "/#services", isDropdown: false },
    { label: "Expertise", href: "/#expertise", isDropdown: false },
    { label: "Blogs", href: "/blog", isDropdown: false },
    { label: "Contact", href: "https://wa.me/1234567890", isDropdown: false },
  ] as NavLink[],
  ctaButton: { label: "Schedule Consultation", href: "https://parmar-properties-two.vercel.app/contact" } as CtaButton,
};

// ─── Hero Section ───────────────────────────────────────────
export const hero = {
  headline: "Access. Influence. Legacy",
  subHeadline: "SOUTH MUMBAI'S TRUSTED LUXURY REAL ESTATE ADVISORY SINCE 1981",
  ctaButton: { label: "Find Properties", href: "https://parmar-properties-listing.vercel.app/" } as CtaButton,
};

// ─── Identity Section ───────────────────────────────────────
export const identity = {
  heading: "Who We Are & What We Do",
  bodySegments: [
    {
      text: "For over four decades, Parmar Properties has been helping families, homebuyers, and investors make confident real estate decisions.",
      revealColorClass: "text-white font-medium",
      baseColorClass: "text-neutral-800 font-medium",
    },
    {
      text: "With honest guidance, personalized service, and a deep understanding of the market, we help you find not just the right property, but the right opportunity for your future.",
      revealColorClass: "text-neutral-400 font-medium",
      baseColorClass: "text-neutral-800 font-medium",
    },
  ] as TextSegment[],
};

// ─── Why Parmar Section ─────────────────────────────────────
export const whyParmar = {
  eyebrow: "Why PARMAR",
  bodySegments: [
    {
      text: "Don't settle for a broker—partner with trusted advisors.",
      revealColorClass: "text-black font-semibold",
      baseColorClass: "text-neutral-200 font-semibold",
    },
    {
      text: " Every recommendation is backed by decades of market expertise, deep developer relationships, and an unwavering commitment to your success.",
      revealColorClass: "text-neutral-400 font-medium",
      baseColorClass: "text-neutral-200 font-medium",
    },
  ] as TextSegment[],
};

// ─── Services Section ───────────────────────────────────────
export const services = {
  eyebrow: "Luxury & Ultra-Luxury\nReal Estate Advisory",
  heading: "How Parmar\nCan Help You",
  items: [
    {
      number: 1,
      label: "Buy",
      description: "Access exclusive and pre-launch luxury inventory in South Mumbai. Take advantage of strategic timing, valuation guidance, and street-level pricing intelligence.",
      imageUrl: buyImg,
    },
    {
      number: 2,
      label: "Sell",
      description: "Achieve high-velocity sales execution. Leverage our direct reach to liquidity-rich HNI buyers and pre-launch sales capabilities to sell in record time.",
      imageUrl: sellImg,
    },
    {
      number: 3,
      label: "Lease",
      description: "Strategic wealth planning for HNIs, NRIs, and Family Businesses. Get zero-pressure advisory, negotiation leverage, and long-term capital appreciation.",
      imageUrl: leaseImg,
    },
  ] as ServiceItem[],
  ctaSection: {
    ctaButton: { label: "Talk to an Expert", href: "/contact" } as CtaButton,
  }
};

// ——— Process / Why South Mumbai Section —————————————————————
export const processSouthMumbai = {
  heading: "Real Estate,\nRewired.",
  subHeading: "Steps:",
  ctaButton: { label: "Start Your Search", href: "https://parmar-properties-listing.vercel.app" },
  steps: [
    { stepNumber: "01", title: "Talk to a Real Human.", description: "We match you with an expert who actually listens." },
    { stepNumber: "02", title: "Get Clarity.", description: "We define what you really need, not just what's available." },
    { stepNumber: "03", title: "Move Forward.", description: "We find what fits — and make it happen." },
  ] as ProcessStep[],
};

// ——— Support / Features Section —————————————————————————————
export const support = {
  heading: "Our\nExpertise",
  subHeading: "We believe buying a property should feel simple, informed, and rewarding.",
  subHeadingMuted: "Every recommendation we make is guided by experience, market knowledge, and a genuine understanding of your goals.",
  cards: [
    {
      title: "Investment Advisory",
      description: "Thoughtful guidance to help you make confident investment decisions.",
      imageSrc: investmentAdvisoryImg,
      iconSrc: "https://c.animaapp.com/mq3zczchi8fb7N/assets/icon-6.svg",
      buttonText: "Let's Connect",
      href: "https://parmar-properties-two.vercel.app/services",
    },
    {
      title: "Exclusive Opportunities",
      description: "Access to carefully curated homes, pre-launch projects, and private listings through our trusted network.",
      imageSrc: exclusiveOpportunitiesImg,
      iconSrc: "https://c.animaapp.com/mq3zczchi8fb7N/assets/icon-6.svg",
      buttonText: "Let's Connect",
      href: "https://parmar-properties-two.vercel.app/services",
    },
    {
      title: "Complete Support",
      description: "From property search to final paperwork, we're with you at every step.",
      imageSrc: completeSupportImg,
      iconSrc: "https://c.animaapp.com/mq3zczchi8fb7N/assets/icon-6.svg",
      buttonText: "Let's Connect",
      href: "https://parmar-properties-two.vercel.app/services",
    },
  ] as SupportCard[],
};

// ─── About Section ───────────────────────────────────────────
export const aboutSection = {
  eyebrow: "Tailored Real Estate Advisory for the Most Discerning Buyers & Sellers",
  heading: "ABOUT",
  bodySegments: [
    {
      text: "A boutique real estate consultancy offering curated solutions across luxury residences, commercial spaces, bespoke leases, and NRI investments.",
      revealColorClass: "text-black font-semibold",
      baseColorClass: "text-neutral-300 font-medium",
    },
    {
      text: " With deep developer relationships and a personalised, detail-first approach—we help you find the right space, effortlessly.",
      revealColorClass: "text-[#555] font-medium",
      baseColorClass: "text-neutral-300 font-medium",
    },
  ] as TextSegment[],
  buttonLabel: "LEARN MORE",
  stats: [
    { value: "40+", label: "Years in Business" },
    { value: "535+", label: "Families Helped" },
    { value: "372+", label: "Residential Deals" },
    { value: "47+", label: "Commercial Deals" },
  ],
};

// ─── Blog & Resources Section ────────────────────────────────
// NOTE: blog.posts has been removed — data is now in Supabase.
// Use useBlogPosts() hook or fetchPostBySlug() to load posts.
export const blog = {
  heading: { main: "Blog &", accent: "Resources" },
  subheading: "See how we've helped clients achieve their real estate dreams, one successful move at a time.",
  ctaButton: { label: "Visit Our Blog", href: "/blog" } as CtaButton,
  categories: ["All", "Buying", "Investments", "Lifestyle", "News", "Real Estate", "Renting", "Selling"],
};

// ─── Agents / Join Section ───────────────────────────────────
export const agents = {
  eyebrow: "Join Our Team",
  heading: "Don't Rent Your Career. Own It.",
  imageUrl: "https://c.animaapp.com/mq3zczchi8fb7N/assets/94.jpg",
  bodySegments: [
    {
      text: "We offer access to real buyers beyond conventional channels, early access to pre-launch inventory, and street-level pricing intelligence.",
      revealColorClass: "text-black font-medium",
      baseColorClass: "text-neutral-200 font-medium",
    },
    {
      text: " Experience faster closures through value-led, zero-pressure, trust-first advisory. Strategic timing guidance, negotiation leverage, and long-term wealth creation for HNIs, NRIs, and family businesses.",
      revealColorClass: "text-neutral-400 font-medium",
      baseColorClass: "text-neutral-200 font-medium",
    },
  ] as TextSegment[],
  ctaButton: { label: "Connect With Us", href: "https://parmar-properties-two.vercel.app/join" } as CtaButton,
};

// ─── Testimonials Section ────────────────────────────────────
export const testimonials = {
  headingSegments: [
    { text: "Don't Take ", revealColorClass: "text-black", baseColorClass: "text-neutral-300" },
    { text: "Our Word for It.", revealColorClass: "text-neutral-400", baseColorClass: "text-neutral-300" },
  ] as TextSegment[],
  sideImageUrl: sideImg,
  bottomBanner: {
    heading: "Are you The Next One!",
    subheading: "South Mumbai's Trusted Luxury Real Estate Advisory.",
    cta: { label: "Let's Connect Now", href: "https://parmar-properties-two.vercel.app/contact" }
  },
  items: [
    { quote: "Finding a home in South Mumbai is as much about patience as it is about access. The team at Parmar Properties secured our dream duplex in Malabar Hill before it even hit the open market. Absolutely professional and highly connected!", author: "Anonymous", rating: 5, imageUrl: t1 },
    { quote: "As an NRI, I needed a trusted advisor who understood regulatory compliance and the premium market in Cuffe Parade. Parmar Properties was incredibly thorough, transparent, and responsive at all times of the day.", author: "Anonymous", rating: 5, imageUrl: t2 },
    { quote: "A truly professional experience from start to finish. The advisory team handled our family wealth portfolio's real estate investments with the utmost confidentiality and delivered outstanding returns.", author: "Anonymous", rating: 5, imageUrl: t3 },
    { quote: "Unmatched expertise in South Bombay luxury real estate. Their strategic approach to negotiation and deep builder relationships helped us secure our clinic space and residence at prime locations with zero hassle.", author: "Anonymous", rating: 5, imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { quote: "They don't just sell properties; they build lasting relationships. The level of trust and transparency they provided was exactly what we needed as first-time luxury buyers in Worli.", author: "Anonymous", rating: 5, imageUrl: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  ] as TestimonialItem[],
};

// ─── CTA Section ─────────────────────────────────────────────
export const cta = {
  headline: "Parmar Properties. <br/> South Mumbai's Trusted Luxury Real Estate Advisory.",
  backgroundImageUrl: "https://c.animaapp.com/mq3zczchi8fb7N/assets/14.webp",
  primaryButton: { label: "Let's Get Started", href: "https://parmar-properties-two.vercel.app/contact" } as CtaButton,
  whatsapp: { label: "Chat on WhatsApp", phone: "1234567890" },
};

// ─── Footer ──────────────────────────────────────────────────
export const footer = {
  primaryLinks: [
    { label: "About", href: "https://parmar-properties-two.vercel.app/about" },
    { label: "Expertise", href: "/#expertise" },
    { label: "Opportunities", href: "/#services" },
    { label: "Contact", href: "https://parmar-properties-two.vercel.app/contact" },
  ] as FooterLink[],
  socialLinks: [
    { label: "Facebook", href: "https://www.facebook.com/people/Parmar-Properties/61556751864965/" },
    { label: "Instagram", href: "https://www.instagram.com/parmar_properties?igsh=Y3B6amlmMHRydmpl" },
    { label: "Youtube", href: "https://www.youtube.com/@parmarpropertiesofficial" },
    { label: "Linkedin", href: "https://www.linkedin.com/company/parmar-properties-and-infrastructure-pvt-ltd/" },
    { label: "Whatsapp", href: "https://wa.me/1234567890" },
  ] as FooterLink[],
  legalLinks: [
    { label: "Terms & Conditions", href: "/terms-of-service" },
    { label: "Privacy policy", href: "/privacy-policy" },
  ] as FooterLink[],
  contact: [
    { label: "Head Office", value: "208, Parmar Properties, Peninsula Centre", href: "geo://40.75104385252497,-73.98395637414475" },
    { label: "Email Us", value: "office@parmarproperties.in", href: "mailto:office@parmarproperties.in" },
    { label: "Call Us", value: "+022 6666 9733", href: "tel:+02266669733" },
  ] as ContactInfo[],
};
