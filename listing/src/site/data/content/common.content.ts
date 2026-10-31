/**
 * ============================================================================
 *               PARMAR PROPERTIES - GLOBAL & COMMON CONTENT
 *                           (common.content.ts)
 * ============================================================================
 * 
 * 🗺️ BOSS & STAKEHOLDER UI WIREFRAME:
 * Controls the shared elements visible on EVERY page across the entire website.
 * 
 * +--------------------------------------------------------------------------+
 * | [STICKY HEADER / NAVIGATION BAR]                                         |
 * | [PARMAR PROPERTIES Logo]  | Buy | Launches | Luxury | Commercials | [ADVISORY]|
 * +--------------------------------------------------------------------------+
 * |                                                                          |
 * |                               PAGE CONTENT                               |
 * |                                                                          |
 * +--------------------------------------------------------------------------+
 * | [FOOTER SECTION]                                                         |
 * | [PARMAR PROPERTIES]       | Quick Links      | Mumbai Office             |
 * | MahaRERA: A51900018442    | All navigation   | Peninsula Center, Parel   |
 * | Tel: +91 (022) 4988 7700  | Contact details  | Copyright notice          |
 * +--------------------------------------------------------------------------+
 */

export const BRAND_CONTENT = {
  companyName: "Parmar Properties",
  tagline: "Mumbai • Prime Residential Real Estate",
  shortDescription: "Curated portfolio of prime waterfront residences, penthouses, and sky villas across Worli, Bandra, Juhu, and South Mumbai.",
  foundedYear: 1981,
  yearsOfHeritage: "40+",
  reraRegistrationNumber: "A51900018442",
  officialWebsiteUrl: "https://www.parmarproperties.in/",
  primaryCity: "Mumbai",
  primaryRegion: "South & West Mumbai",
};

export const CONTACT_CONTENT = {
  office: {
    firmName: "Parmar Properties",
    building: "Peninsula Center, 208",
    area: "Doctor SS Rao Marg, Parel",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "400012",
    fullAddress: "Peninsula Center, 208, Doctor SS Rao Marg, Parel, Mumbai, Maharashtra 400012",
  },
  communication: {
    landline: "+91 (022) 6666 9733",
    phoneDisplay: "+91 (022) 6666 9733",
    phoneCallUrl: "tel:+912266669733",
    supportEmail: "contact@parmarproperties.com",
    supportEmailUrl: "mailto:contact@parmarproperties.com",
    advisoryDeskEmail: "advisory@parmarproperties.com",
    hoursOfOperation: "Mon - Sun: 10:00 AM - 6:30 PM IST",
  },
};

export const NAVIGATION_CONTENT = {
  logoText: "PARMAR PROPERTIES",
  advisoryButtonLabel: "TALK TO OUR ADVISORY",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Buy", href: "/properties?tab=buy" },
    { label: "New Launches", href: "/properties?tab=new-launches" },
    { label: "Luxury Collection", href: "/properties?tab=luxury-collection" },
    { label: "Commercials", href: "/commercials" },
    { label: "Location", href: "/locations" },
    { label: "Insights", href: "/market-intelligence" },
  ],
  advisoryModal: {
    badge: "CONFIDENTIAL ADVISORY DESK",
    title: "Talk to Our Advisory",
    description: "Connect with a senior managing director for bespoke portfolio evaluation, off-market inventory matches, and confidential transaction guidance.",
    responseTime: "A senior partner will contact you within 2 business hours.",
    budgetOptions: [
      { label: "₹5 Cr – ₹15 Cr", value: "₹5 Cr – ₹15 Cr" },
      { label: "₹15 Cr – ₹30 Cr", value: "₹15 Cr – ₹30 Cr" },
      { label: "₹30 Cr – ₹60 Cr", value: "₹30 Cr – ₹60 Cr" },
      { label: "₹60 Cr+ (Ultra Prime Trophy)", value: "₹60 Cr+" },
    ],
    submitButtonLabel: "SUBMIT CONFIDENTIAL REQUEST",
    successHeading: "Advisory Request Received",
    successMessage: "Your advisory consultation request has been registered. Our senior managing director will reach out discreetly.",
  },
};

export const FOOTER_CONTENT = {
  brandName: "PARMAR PROPERTIES",
  subBrand: "Mumbai • Prime Residential Real Estate",
  officialWebsiteText: "Visit Official Website",
  officialWebsiteUrl: "https://www.parmarproperties.in/",
  termsOfServiceUrl: "https://www.parmarproperties.in/terms-of-service",
  privacyPolicyUrl: "https://www.parmarproperties.in/privacy-policy",
  reraText: "MahaRERA: A51900018442",
  legalHeading: "Legal & Privacy",
  officeHeading: "Office",
  officeLines: [
    "Parmar Properties",
    "Peninsula Center, 208, Doctor SS Rao Marg, Parel",
    "Mumbai, Maharashtra 400012",
  ],
  contactHeading: "Contact",
  contactPhone: "+91 (022) 6666 9733",
  contactEmail: "contact@parmarproperties.com",
  copyright: `© ${new Date().getFullYear()} Parmar Properties. All rights reserved.`,
  reraFullDisclaimer: "MahaRERA Registration No. A51900018442",
};
