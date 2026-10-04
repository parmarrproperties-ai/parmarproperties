// ============================================================
// src/seo/site.ts — Business facts used for SEO metadata and
// structured data (JSON-LD). Keep these accurate: search engines
// and AI assistants quote them directly.
// ============================================================

export const SITE_URL = "https://www.parmarproperties.in";

export const site = {
  url: SITE_URL,
  name: "Parmar Properties",
  legalName: "Parmar Properties & Infrastructure Private Limited",
  alternateName: "Parmar Properties Pvt. Ltd.",
  slogan: "Building Relationships. Creating Value.",
  description:
    "Parmar Properties is a South Mumbai luxury real estate advisory, founded in 1981, helping families, HNIs, NRIs and business owners buy, sell and lease premium homes and commercial spaces.",
  foundingDate: "1981",
  /** Path under /public (static/) — absolute URL is built with SITE_URL. */
  logoPath: "/logo.png",
  defaultOgImagePath: "/og-default.jpg",
  email: "office@parmarproperties.in",
  officePhone: "+91-22-6666-9733",
  phones: ["+91-93222-32899", "+91-98191-20161", "+91-93230-41133"],
  whatsapp: "919322232899",
  address: {
    streetAddress: "208, Peninsula Centre, Dr. S S Rao Road, Parel",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "400012",
    addressCountry: "IN",
  },
  /** MahaRERA agent registration number — add it here to show it in the footer and schema. */
  rera: "",
  /** Google Maps search link for the office (no API key needed). */
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Peninsula+Centre+Dr+S+S+Rao+Road+Parel+Mumbai+400012",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Peninsula+Centre,+Dr+S+S+Rao+Road,+Parel,+Mumbai+400012&output=embed",
  sameAs: [
    "https://www.facebook.com/people/Parmar-Properties/61556751864965/",
    "https://www.instagram.com/parmar_properties",
    "https://www.youtube.com/@parmarpropertiesofficial",
    "https://www.linkedin.com/company/parmar-properties-and-infrastructure-pvt-ltd/",
    // Add the Google Business Profile URL here once it is live.
  ],
  areaServed: [
    "South Mumbai", "Worli", "Worli Sea Face", "Malabar Hill", "Altamount Road", "Pedder Road",
    "Breach Candy", "Nepean Sea Road", "Walkeshwar", "Cuffe Parade", "Nariman Point", "Marine Drive",
    "Tardeo", "Mahalaxmi", "Lower Parel", "Prabhadevi", "Dadar", "Sewri", "Wadala", "Lalbaug",
    "Hughes Road", "Bandra",
  ],
  knowsAbout: [
    "Luxury residential real estate in South Mumbai",
    "Commercial real estate in Mumbai",
    "Property leasing",
    "NRI property investment in India",
    "Pre-launch and new-launch residential projects",
    "Resale luxury apartments",
  ],
  founders: [
    { name: "Jain Dilip P. Parmar", jobTitle: "Founder", description: "Founded Parmar Properties in 1981 and brings more than 40 years of real estate experience." },
    { name: "Sanjay Dilip Parmar", jobTitle: "Director", description: "Leads marketing and sales, business growth and team development." },
    { name: "Jain Ankit Dilip Parmar", jobTitle: "Director", description: "Brings financial and market expertise; leads campaigns and helps buyers find their homes." },
  ],
  stats: { familiesHelped: 5124, residentialDeals: 1289, commercialDeals: 328 },
};

export const absoluteUrl = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

export const whatsappLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
