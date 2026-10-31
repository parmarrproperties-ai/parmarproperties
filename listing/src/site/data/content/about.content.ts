/**
 * ============================================================================
 *               PARMAR PROPERTIES - ABOUT US PAGE CONTENT
 *                           (about.content.ts)
 * ============================================================================
 * 
 * 🗺️ BOSS & STAKEHOLDER UI WIREFRAME:
 * Controls the /about page.
 * 
 * +--------------------------------------------------------------------------+
 * | [HERO HEADER]                                                            |
 * | Badge: "Our Heritage • Established 1981"                                 |
 * | Title: "Parmar Properties"                                               |
 * | Subtitle: "Mumbai’s premier discreet real estate advisory..."            |
 * +--------------------------------------------------------------------------+
 * | [STORY & FOUNDER SECTION]                                                |
 * | Heading: "A Legacy of Discretion & Architectural Integrity"              |
 * | Paragraphs describing 40+ years in Mumbai prime corridors                |
 * | Founder Card: Vikram Parmar, Founder & Principal Managing Director       |
 * +--------------------------------------------------------------------------+
 * | [KEY METRICS BAR]                                                        |
 * | [ ₹1,800+ Cr Transacted ] [ 40+ Years ] [ 100% Vetted ] [ 1-on-1 Desk ]   |
 * +--------------------------------------------------------------------------+
 * | [CORE PILLARS]                                                           |
 * | 1. Generational Trust  2. Curated Exclusivity  3. Legal & MahaRERA Rigor |
 * +--------------------------------------------------------------------------+
 */

export const ABOUT_PAGE_CONTENT = {
  meta: {
    pageTitle: "About Parmar Properties | 40+ Years of Mumbai Real Estate Heritage",
    pageDescription: "Founded in Mumbai, Parmar Properties is a premier discreet luxury real estate advisory representing high-net-worth individuals, family offices, and NRI investors.",
    canonicalPath: "/about",
  },
  header: {
    badge: "Our Heritage • Active Since 1981",
    title: "Parmar Properties",
    subtitle: "Mumbai’s premier discreet real estate advisory, representing generational family offices, business leaders, and discerning tastemakers in prime residential acquisitions.",
  },
  story: {
    heading: "A Legacy of Discretion & Architectural Integrity",
    paragraphs: [
      "Founded in Mumbai, Parmar Properties has developed an unrivaled standing for curating and closing the city’s most significant prime residential and commercial transactions.",
      "From the iconic coastal towers along Worli Sea Face and Marine Drive to secluded estate villas in Bandra’s Pali Hill and Juhu Beachfront, we operate with surgical precision, absolute confidentiality, and deep legal mastery under MahaRERA.",
    ],
    founder: {
      initials: "VP",
      name: "Vikram Parmar",
      title: "Founder & Principal Managing Director",
    },
    image: {
      src: "/hero/hero-1-crisp.jpg",
      alt: "Parmar Properties Mumbai Heritage",
    },
  },
  metrics: [
    { value: "₹5,000+ Cr", label: "Transacted Portfolio", sub: "Discreet advisory volume" },
    { value: "40+", label: "Years in Mumbai", sub: "Active since 1981" },
    { value: "100%", label: "MahaRERA Due Diligence", sub: "Zero legal encumbrances" },
    { value: "1-on-1", label: "Managing Partner Desk", sub: "Confidential promoter access" },
  ],
  pillars: [
    {
      title: "Generational Trust",
      description: "Over 40 years of continuous family-run integrity, unmatched relationship equity, and deep-rooted standing across Mumbai's elite business and film communities.",
    },
    {
      title: "Curated Exclusivity",
      description: "We represent a purposefully tight portfolio. Every home is personally vetted for unobstructed vistas, superior engineering, high ceilings, and prestigious neighbors.",
    },
    {
      title: "Technical & Legal Rigor",
      description: "Complete in-house scrutiny of titles, MahaRERA registrations, society NOCs, structural terrace load capabilities, and cross-border fund repatriation under FEMA.",
    },
  ],
  cta: {
    badge: "CONFIDENTIAL ADVISORY DESK",
    heading: "Ready to discuss your acquisition requirements?",
    subtext: "Book a confidential consultation with Vikram Parmar and our senior managing team.",
    buttonText: "TALK TO OUR ADVISORY",
  },
};
