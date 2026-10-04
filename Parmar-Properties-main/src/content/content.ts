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

import t1 from "assets/testimonial1.webp";
import t2 from "assets/testimonial2.webp";
import t3 from "assets/testimonial3.webp";
import sideImg from "assets/Indian family.webp";
import investmentAdvisoryImg from "assets/Investment advisory.webp";
import exclusiveOpportunitiesImg from "assets/Exclusive Opportunities.webp";
import completeSupportImg from "assets/Complete support.webp";
import buyImg from "assets/Buy image.webp";
import sellImg from "assets/Sell image.webp";
import leaseImg from "assets/Lease image.webp";
import parmarPropertiesLogo from "assets/Parmar Properties Logo.webp";

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
    { label: "About Us", href: "/about", isDropdown: false },
    { label: "Services", href: "/services", isDropdown: false },
    { label: "Expertise", href: "/#expertise", isDropdown: false },
    { label: "Blogs", href: "/blog", isDropdown: false },
    { label: "Contact", href: "/contact", isDropdown: false },
  ] as NavLink[],
  ctaButton: { label: "Schedule Consultation", href: "https://wa.me/919322232899?text=Hi%2C%20I%20would%20like%20to%20schedule%20a%20consultation." } as CtaButton,
};

// ─── Hero Section ───────────────────────────────────────────
export const hero = {
  headline: "Access. Influence. Legacy",
  subHeadline: "SOUTH MUMBAI'S TRUSTED LUXURY REAL ESTATE ADVISORY SINCE 1981",
  ctaButton: { label: "Find Properties", href: "https://wa.me/919322232899?text=Hi%2C%20I%20am%20looking%20to%20find%20properties." } as CtaButton,
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
      description: "Lease premium homes, offices and retail spaces across South Mumbai. We match landlords with quality tenants and negotiate rent, deposit and lock-in terms.",
      imageUrl: leaseImg,
    },
  ] as ServiceItem[],
  ctaSection: {
    ctaButton: { label: "Talk to an Expert", href: "https://wa.me/919322232899?text=Hi%2C%20I%20would%20like%20to%20talk%20to%20an%20expert." } as CtaButton,
  }
};

// ——— Process / Why South Mumbai Section —————————————————————
export const processSouthMumbai = {
  heading: "Real Estate,\nRewired.",
  subHeading: "Steps:",
  ctaButton: { label: "Start Your Search", href: "https://wa.me/919322232899?text=Hi%2C%20I%20want%20to%20start%20my%20property%20search." },
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
      href: "https://wa.me/919322232899?text=Hi%2C%20I%20need%20investment%20advisory%20services.",
    },
    {
      title: "Exclusive Opportunities",
      description: "Access to carefully curated homes, pre-launch projects, and private listings through our trusted network.",
      imageSrc: exclusiveOpportunitiesImg,
      iconSrc: "https://c.animaapp.com/mq3zczchi8fb7N/assets/icon-6.svg",
      buttonText: "Let's Connect",
      href: "https://wa.me/919322232899?text=Hi%2C%20I%20am%20interested%20in%20exclusive%20opportunities.",
    },
    {
      title: "Complete Support",
      description: "From property search to final paperwork, we're with you at every step.",
      imageSrc: completeSupportImg,
      iconSrc: "https://c.animaapp.com/mq3zczchi8fb7N/assets/icon-6.svg",
      buttonText: "Let's Connect",
      href: "https://wa.me/919322232899?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20your%20complete%20support.",
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
    { value: "5124+", label: "Families Helped" },
    { value: "1289+", label: "Residential Deals" },
    { value: "328+", label: "Commercial Deals" },
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
  ctaButton: { label: "Connect With Us", href: "https://wa.me/919322232899?text=Hi%2C%20I%20want%20to%20join%20your%20team." } as CtaButton,
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
    cta: { label: "Let's Connect Now", href: "https://wa.me/919322232899?text=Hi%2C%20I%20am%20ready%20to%20connect." }
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
  primaryButton: { label: "Let's Get Started", href: "https://wa.me/919322232899?text=Hi%2C%20I%20want%20to%20get%20started." } as CtaButton,
  whatsapp: { label: "Chat on WhatsApp", phone: "919322232899" },
};

// ─── Footer ──────────────────────────────────────────────────
export const footer = {
  primaryLinks: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Buy", href: "/services/buy" },
    { label: "Sell", href: "/services/sell" },
    { label: "Lease", href: "/services/lease" },
    { label: "NRI Investment", href: "/services/nri" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ] as FooterLink[],
  socialLinks: [
    { label: "Facebook", href: "https://www.facebook.com/people/Parmar-Properties/61556751864965/" },
    { label: "Instagram", href: "https://www.instagram.com/parmar_properties" },
    { label: "Youtube", href: "https://www.youtube.com/@parmarpropertiesofficial" },
    { label: "Linkedin", href: "https://www.linkedin.com/company/parmar-properties-and-infrastructure-pvt-ltd/" },
    { label: "Whatsapp", href: "https://wa.me/919322232899?text=Hi%2C%20I%20would%20like%20to%20connect." },
  ] as FooterLink[],
  legalLinks: [
    { label: "Terms & Conditions", href: "/terms-of-service" },
    { label: "Privacy policy", href: "/privacy-policy" },
  ] as FooterLink[],
  contact: [
    { label: "Head Office", value: "208, Peninsula Centre, Dr. S S Rao Road, Parel, Mumbai 400012", href: "https://www.google.com/maps/search/?api=1&query=Peninsula+Centre+Dr+S+S+Rao+Road+Parel+Mumbai+400012" },
    { label: "Email Us", value: "office@parmarproperties.in", href: "mailto:office@parmarproperties.in" },
    { label: "Call Us", value: "+91 22 6666 9733", href: "tel:+912266669733" },
  ] as ContactInfo[],
};
