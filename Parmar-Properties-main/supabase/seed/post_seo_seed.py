#!/usr/bin/env python3
"""
Generates supabase/seed/20261004_post_faqs_sources.sql — search titles, meta
descriptions, FAQs and sources for the 10 blog posts published as of 4 Oct 2026.

Every FAQ answer restates facts from the post itself. Source links point to the
organisations each post cites; replace them with the exact report URLs if you
have them. Edit this file, re-run `python3 supabase/seed/post_seo_seed.py`, then
run the generated SQL in the Supabase SQL editor (after the migration).
"""

import json
from pathlib import Path

CRE = {"label": "CRE Matrix & India Sotheby's International Realty — Mumbai luxury housing report, H1 2026", "url": "https://www.crematrix.com/"}
KNIGHT_FRANK = {"label": "Knight Frank India — Mumbai residential registrations research", "url": "https://www.knightfrank.co.in/research"}
CBRE = {"label": "CBRE India — 2026 market outlook", "url": "https://www.cbre.co.in/insights"}
MAHARERA = {"label": "MahaRERA — project registration search", "url": "https://maharera.maharashtra.gov.in/"}
RBI = {"label": "Reserve Bank of India — FAQs on acquisition of immovable property by NRIs and OCIs", "url": "https://www.rbi.org.in/Scripts/FAQDisplay.aspx"}

POSTS = {
    "why-worli-continues-to-lead-mumbai-s-luxury-housing-market": {
        "seo_title": "Why Worli Leads Mumbai's Luxury Housing Market (2026)",
        "seo_description": "Why Worli is Mumbai's leading luxury address in 2026: connectivity, sea views, deep supply and 159 luxury deals in H1 2026, plus how to build a shortlist.",
        "faqs": [
            ("Why is Worli so popular with luxury homebuyers?",
             "Worli sits between South Mumbai and the newer business districts, with access via the Bandra-Worli Sea Link, the Coastal Road and Metro Line 3. It also has one of Mumbai's deepest supplies of luxury homes, from large apartments to penthouses, and select towers offer sea and skyline views."),
            ("How many luxury homes were sold in Worli in H1 2026?",
             "CRE Matrix and India Sotheby's International Realty reported 159 luxury home transactions in Worli in H1 2026, up from 35 in H1 2025, with a total transaction value of ₹4,493 crore."),
            ("What should I check before buying a flat in Worli?",
             "Compare the exact view line and whether it is protected, carpet area, floor plate, homes per floor, lift core, parking, possession stage, maintenance and the peak-hour access route. Visit twice at different times of day and review the detailed floor plan."),
        ],
        "sources": [CRE],
    },
    "10-crore-homes-in-mumbai-what-is-driving-luxury-demand-in-2026": {
        "seo_title": "₹10 Crore+ Homes in Mumbai: What Drives Luxury Demand",
        "seo_description": "Mumbai's ₹10 crore-plus homes saw ₹18,512 crore in sales in H1 2026. What is driving demand, why ₹20–40 crore homes are growing and what buyers should do.",
        "faqs": [
            ("How big is Mumbai's ₹10 crore-plus housing market?",
             "In H1 2026, homes priced at ₹10 crore and above recorded ₹18,512 crore in sales across 957 transactions in the primary and resale markets — the highest half-yearly value reported by CRE Matrix and India Sotheby's International Realty."),
            ("Which luxury price bracket is growing fastest in Mumbai?",
             "The ₹20–40 crore bracket. Sales rose from 66 homes in H1 2023 to 156 in H1 2026, as buyers move towards larger, lower-density and better-located residences."),
            ("What size of luxury home is most in demand in Mumbai?",
             "Homes of 2,000–4,000 sq. ft. accounted for 58% of primary luxury sales in H1 2026, reflecting demand for bigger living areas, home offices, staff rooms, storage and decks."),
        ],
        "sources": [CRE],
    },
    "primary-vs-resale-luxury-property-in-mumbai-a-buyer-s-guide": {
        "seo_title": "Primary vs Resale Luxury Property in Mumbai: Buyer Guide",
        "seo_description": "New launch or resale luxury home in Mumbai? Compare possession, total cost, payment plans, inspection and due diligence to choose the right option for you.",
        "faqs": [
            ("Is it better to buy a new launch or a resale luxury flat in Mumbai?",
             "Choose a new launch if you value phased payments and new specifications and can wait for possession. Choose resale if you want to inspect the actual home and view and move in sooner. If both matter, compare a completed new project with a well-kept resale building in the same area."),
            ("What extra costs should I budget for when buying property in Mumbai?",
             "For resale, budget for stamp duty, registration, brokerage if applicable, renovation, society transfer formalities and any upgrades. For new projects, include taxes, statutory charges, maintenance deposits and fit-out costs. Compare the cost of a move-in-ready home, not just the agreement value."),
            ("What due diligence is needed for a resale home in Mumbai?",
             "Review the title documents, society records, outstanding dues, occupancy-related documents, parking rights and the seller's ability to transfer clear title. For new projects, check the MahaRERA registration and sanctioned plans. Use an independent lawyer in either case."),
        ],
        "sources": [CRE, MAHARERA],
    },
    "worli-vs-mahalaxmi-a-practical-guide-for-luxury-homebuyers": {
        "seo_title": "Worli vs Mahalaxmi: Which Is Better for a Luxury Home?",
        "seo_description": "Worli or Mahalaxmi? Compare connectivity, views, housing formats and pricing to decide which South Mumbai location suits your luxury home search best.",
        "faqs": [
            ("Which is better for a luxury home, Worli or Mahalaxmi?",
             "Neither is better for everyone. Worli suits buyers who want a coastal identity, contemporary luxury towers and cross-city connectivity. Mahalaxmi suits buyers who want a central position between South and Central Mumbai and access to newer large-format projects."),
            ("How does connectivity in Worli compare with Mahalaxmi?",
             "Worli has the Bandra-Worli Sea Link and Coastal Road access towards the western and central business areas. Mahalaxmi is central to Worli, Lower Parel, Tardeo and South Mumbai and is served by Metro Line 3. The deciding factor is usually your most frequent weekly route."),
            ("How should I compare property prices in Worli and Mahalaxmi?",
             "Look beyond the headline rate per square foot. Compare the all-in cost — parking, floor-rise charges, taxes, maintenance and fit-out — and how much of the carpet area is genuinely usable."),
        ],
        "sources": [],
    },
    "the-nri-guide-to-buying-property-in-mumbai-in-2026": {
        "seo_title": "NRI Guide to Buying Property in Mumbai (2026)",
        "seo_description": "How NRIs can buy property in Mumbai in 2026: eligibility, payment channels, remote shortlisting, using India visits well and keeping documents organised.",
        "faqs": [
            ("Can NRIs buy property in Mumbai?",
             "Yes. Under current RBI guidance, NRIs and OCIs can generally buy residential and commercial property in India, while agricultural land, plantation property and farmhouses are treated differently. Get current legal and tax advice for your own transaction."),
            ("How can an NRI pay for property in India?",
             "Payments must go through recognised banking channels under FEMA rules. RBI's guidance allows funds received in India through banking channels or from eligible NRE, FCNR(B) or NRO accounts, subject to applicable rules. Avoid informal payment arrangements."),
            ("How can NRIs buy property in Mumbai without long visits?",
             "Build a shortlist before travelling using floor plans, all-in cost sheets, construction status and developer track record, and narrow it to three or four options. Then visit competing projects in the same micro-market on the same day and keep every document in one digital folder."),
        ],
        "sources": [RBI],
    },
    "mumbai-luxury-real-estate-market-2026-what-buyers-should-know": {
        "seo_title": "Mumbai Luxury Real Estate Market 2026: Buyer's Guide",
        "seo_description": "Mumbai luxury real estate in 2026: 80,221 registrations in H1, ₹18,512 crore of ₹10 crore-plus sales, Worli's lead and what buyers should do next.",
        "faqs": [
            ("How is Mumbai's property market performing in 2026?",
             "Strongly but selectively. Mumbai city recorded 80,221 property registrations in H1 2026, according to Knight Frank India, and August 2026 registrations were projected at 12,503, the strongest August in over 14 years. Buyers are concentrating on established developers, better locations and larger homes."),
            ("Which Mumbai location leads luxury home sales in 2026?",
             "Worli. It recorded 159 luxury transactions worth ₹4,493 crore in H1 2026, according to CRE Matrix and India Sotheby's International Realty, helped by its central location, sea-facing options and improved connectivity."),
            ("What should luxury homebuyers in Mumbai do in 2026?",
             "Shortlist by location, residence quality and developer execution. Then compare payment schedules, possession timelines, MahaRERA disclosures, maintenance costs and resale alternatives in the same micro-market. A project should make sense before any incentives are considered."),
        ],
        "sources": [KNIGHT_FRANK, CRE, CBRE, MAHARERA],
    },
    "why-mumbai-s-luxury-buyers-are-choosing-larger-homes": {
        "seo_title": "Why Mumbai Luxury Buyers Are Choosing Larger Homes",
        "seo_description": "Homes of 2,000–4,000 sq. ft. made up 58% of Mumbai's primary luxury sales in H1 2026. Why buyers want more space and how to compare large homes properly.",
        "faqs": [
            ("Why are luxury buyers in Mumbai choosing bigger homes?",
             "Homes now need to support work, family, entertaining, wellness, storage and staff without these competing for space. Many buyers are upgrading from an existing premium home and want better zoning and privacy, not just an extra bedroom."),
            ("What share of Mumbai luxury sales are large homes?",
             "Homes measuring 2,000–4,000 sq. ft. accounted for 58% of primary luxury sales in H1 2026, according to CRE Matrix and India Sotheby's International Realty."),
            ("How do I compare two large apartments?",
             "Look beyond total carpet area. Check living-room width, bedroom dimensions, wardrobe walls, kitchen and utility separation, staff room location, deck size, ceiling height and window spans, and test a dimensioned floor plan with real furniture sizes."),
        ],
        "sources": [CRE],
    },
    "south-mumbai-property-guide-2026-worli-mahalaxmi-malabar-hill-tardeo-beyond": {
        "seo_title": "South Mumbai Property Guide 2026: Best Areas Compared",
        "seo_description": "Worli, Mahalaxmi, Malabar Hill, Tardeo or Sewri? A 2026 guide to South Mumbai's luxury micro-markets and how to choose the right one for your lifestyle.",
        "faqs": [
            ("Which is the best area to buy luxury property in South Mumbai?",
             "It depends on how you live. Worli suits contemporary high-rise living and connectivity; Malabar Hill offers scarcity and an established residential character; Mahalaxmi combines central access with new large-format projects; Tardeo offers boutique buildings; Sewri is a waterfront growth story."),
            ("How is Sewri's property market changing?",
             "Sewri is being reshaped by Atal Setu, open to traffic since January 2024, and the planned 4.5 km Sewri-Worli Elevated Connector. Buyers should still check infrastructure timelines and local roads rather than buying on future connectivity alone."),
            ("How do I choose between South Mumbai neighbourhoods?",
             "Use a lifestyle matrix: your main workplaces, schools, clubs, hospitals and family networks, whether a sea view is essential, whether you need immediate possession, how much privacy you expect, and whether you prefer a large estate or a boutique building."),
        ],
        "sources": [],
    },
    "buying-a-luxury-home-in-mumbai-15-things-to-check-before-you-book": {
        "seo_title": "15 Things to Check Before Buying a Luxury Home in Mumbai",
        "seo_description": "A 15-point checklist for buying a luxury home in Mumbai: MahaRERA, developer record, carpet area, view, payment plan, possession, parking and resale value.",
        "faqs": [
            ("What should I check before booking a luxury flat in Mumbai?",
             "Verify the MahaRERA registration and the developer's delivery record; compare RERA carpet area and floor planning; confirm the exact stack, orientation and neighbouring plots; get an all-in cost sheet and map the payment plan; and check parking, maintenance costs and future resale liquidity."),
            ("Why compare RERA carpet area instead of saleable area?",
             "RERA carpet area measures the usable floor area of the home on a consistent basis, while saleable or super built-up figures can include common areas. Comparing carpet area gives a fair, like-for-like view of the space you actually get."),
            ("How do I check a project's MahaRERA registration?",
             "Search for the project on the MahaRERA website and review the registered details, such as the developer, approved plans and declared completion date. Treat it as a starting point and get transaction-specific legal advice."),
        ],
        "sources": [MAHARERA],
    },
    "how-to-read-a-luxury-property-payment-plan-20-80-25-75-25x4-more": {
        "seo_title": "Luxury Property Payment Plans Explained: 20:80, 25:75, 25x4",
        "seo_description": "What 20:80, 25:75, 25x4 and construction-linked payment plans mean for Mumbai luxury buyers, the questions to ask before booking and how to compare them.",
        "faqs": [
            ("What is a 20:80 payment plan?",
             "A 20:80 plan typically means about 20% of the price is paid in the early stage and the remaining 80% at a later milestone, often possession, subject to the developer's exact terms. Always check the official cost sheet and agreement wording."),
            ("What is a 25x4 payment plan?",
             "A 25x4 plan generally splits the price into four instalments of 25%, each due at a stated milestone. Definitions vary between developers, so confirm the milestones in the agreement."),
            ("Is a deferred payment plan a discount?",
             "No. A deferred plan reduces immediate cash outflow but is not a discount in itself. Its value depends on the price under each plan, the timing, project progress and what else you could do with the capital."),
        ],
        "sources": [MAHARERA],
    },
}


def sql_str(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def main() -> None:
    out = [
        "-- ============================================================",
        "-- Search titles, meta descriptions, FAQs and sources for the 10 posts",
        "-- published as of 4 Oct 2026. Generated by post_seo_seed.py — edit that",
        "-- file and re-run it rather than editing this SQL by hand.",
        "-- Run AFTER supabase/migrations/20261004_post_seo_fields.sql.",
        "-- Only fills fields that are still empty, so edits made in the admin are kept.",
        "-- ============================================================",
        "",
    ]
    for slug, d in POSTS.items():
        assert 30 <= len(d["seo_title"]) <= 60, (slug, len(d["seo_title"]))
        assert 120 <= len(d["seo_description"]) <= 160, (slug, len(d["seo_description"]))
        faqs = [{"question": q, "answer": a} for q, a in d["faqs"]]
        out.append(
            "update public.posts set\n"
            f"  seo_title       = coalesce(nullif(seo_title, ''), {sql_str(d['seo_title'])}),\n"
            f"  seo_description = coalesce(nullif(seo_description, ''), {sql_str(d['seo_description'])}),\n"
            f"  faqs    = case when faqs = '[]'::jsonb then {sql_str(json.dumps(faqs, ensure_ascii=False))}::jsonb else faqs end,\n"
            f"  sources = case when sources = '[]'::jsonb then {sql_str(json.dumps(d['sources'], ensure_ascii=False))}::jsonb else sources end\n"
            f"where slug = {sql_str(slug)};\n"
        )
    path = Path(__file__).with_name("20261004_post_faqs_sources.sql")
    path.write_text("\n".join(out), encoding="utf-8")
    print(f"wrote {path} ({len(POSTS)} posts)")


if __name__ == "__main__":
    main()
