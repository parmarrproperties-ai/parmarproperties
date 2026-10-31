#!/usr/bin/env tsx
// ============================================================
// scripts/migrate-to-supabase.ts
// One-time migration: push existing blog.posts data from content.ts
// into Supabase (posts + post_sections tables).
//
// Run: npx tsx scripts/migrate-to-supabase.ts
//
// Prerequisites:
//   - VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
//     OR set SUPABASE_URL and SUPABASE_SERVICE_KEY for service-role key
//     (service role bypasses RLS so you can write without being signed in)
//
// SAFE TO RUN MULTIPLE TIMES: uses upsert on slug so it won't duplicate.
// ============================================================

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌  Missing SUPABASE_URL / VITE_SUPABASE_URL or key in .env"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Existing posts data (copied from the old content.ts) ─────────────

const existingPosts = [
  {
    slug: "q1-2026-market-report",
    date: "2026-04-13",
    title: "Q1 2026 NYC Market Report",
    excerpt:
      "The first quarter of 2026 marked a dynamic start to the year across New York City's real estate market. Increased transaction activity, rising rental demand, and shifting pricing trends all point to a market that is active — but more selective.",
    imageUrl:
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "Real Estate",
    featured: true, // first post = featured
    status: "published" as const,
    intro: [
      "The first quarter of 2026 marked a dynamic start to the year across New York City's real estate market. Increased transaction activity, rising rental demand, and shifting pricing trends all point to a market that is active — but more selective.",
      "While higher-priced markets experienced some pricing adjustments, more affordable boroughs continued to show resilience, driven by steady demand and accessibility. Across both sales and rentals, one theme is clear: buyers and renters are engaged, but more strategic than ever.",
    ],
    downloads: [
      { label: "Manhattan Q1 2026 Sales Report", href: "#" },
      { label: "Manhattan Q1 2026 Rental Report", href: "#" },
      { label: "Brooklyn Q1 2026 Sales Report", href: "#" },
      { label: "Brooklyn Q1 2026 Rental Report", href: "#" },
      { label: "Queens Q1 2026 Sales Report", href: "#" },
      { label: "Queens Q1 2026 Rental Report", href: "#" },
      { label: "The Bronx Q1 2026 Sales Report", href: "#" },
      { label: "The Bronx Q1 2026 Rental Report", href: "#" },
    ],
    sections: [
      {
        order: 0,
        title: "Manhattan Market Overview",
        paragraphs: [
          "Manhattan remained the city's most active and highest-value market in Q1, leading in both transaction volume and pricing. However, the data reflects a shift in leverage.",
          "While activity remains strong, pricing saw modest declines, and properties are spending more time on the market. Discounts from initial ask have widened, signaling increased negotiating power for buyers.",
          "On the rental side, demand remains elevated. Rents continued to climb year-over-year, and leasing activity stayed consistent, reinforcing Manhattan's position as the city's most competitive rental market.",
        ],
        insight:
          "Manhattan is still the benchmark market — but it's no longer one-sided. Buyers have more room to negotiate, while renters continue to face upward pricing pressure.",
      },
      {
        order: 1,
        title: "Brooklyn Market Overview",
        paragraphs: [
          "Brooklyn's market remained highly active in Q1, with strong transaction volume and steady demand across both sales and rentals.",
          "On the sales side, pricing softened slightly, reflecting a more value-conscious buyer pool. Despite this, price per square foot increased year-over-year, suggesting continued long-term strength in the borough.",
          "Brooklyn's rental market continues to stand out. Rents increased, leasing activity remained strong, and properties moved quickly — all indicators of sustained demand.",
        ],
        insight: null,
      },
    ],
  },
  {
    slug: "summer-2026-events",
    date: "2026-06-19",
    title: "South Mumbai Summer 2026: Events Worth Adding to Your Calendar",
    excerpt:
      "A guide to South Mumbai's top Summer 2026 events, including free concerts, outdoor theatre, food festivals, and waterfront experiences happening across the city.",
    imageUrl:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Lifestyle",
    featured: false,
    status: "published" as const,
    intro: [
      "Summer 2026 in South Mumbai is shaping up to be one of the most vibrant seasons in recent memory. From the revitalized waterfront to the historic charm of Fort, the city is alive with energy.",
      "Whether you're a long-time resident or a luxury buyer exploring the area, these events offer a unique glimpse into the lifestyle that makes South Mumbai so coveted.",
    ],
    downloads: [],
    sections: [
      {
        order: 0,
        title: "Waterfront Experiences",
        paragraphs: [
          "The Marine Drive promenade continues to be the heart of the city's summer life. This year, expect a series of sunset concerts and open-air art installations that celebrate the Arabian Sea.",
          "Luxury hotels along the coast are also hosting exclusive rooftop events, providing the perfect vantage point for the city's famous summer sunsets.",
        ],
        insight: null,
      },
    ],
  },
  {
    slug: "quiet-south-bombay-neighbourhoods",
    date: "2026-05-11",
    title:
      "Quiet South Bombay Neighbourhoods: The Best Low-Density Areas for Families and Luxury Buyers",
    excerpt:
      "Discover the quieter side of South Bombay with neighbourhoods that offer space, charm, and a more relaxed pace of living.",
    imageUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Buying",
    featured: false,
    status: "published" as const,
    intro: [
      "While South Mumbai is known for its bustling markets and iconic skyline, there are pockets of tranquility that offer a rare low-density living experience.",
      "For families and luxury buyers seeking a more relaxed pace without sacrificing proximity to the city's core, these neighbourhoods are the ultimate hidden gems.",
    ],
    downloads: [],
    sections: [
      {
        order: 0,
        title: "The Charm of Altamount Road",
        paragraphs: [
          "Altamount Road remains one of the most prestigious addresses in the country, yet it maintains a quiet, residential feel that is hard to find elsewhere.",
          "With its lush greenery and limited traffic, it offers a sanctuary for those who value privacy and peace.",
        ],
        insight: null,
      },
    ],
  },
  {
    slug: "cozy-snow-day-at-home",
    date: "2026-02-23",
    title: "5 Cozy Ways to Spend a Snow Day at Home",
    excerpt:
      "When the city slows down, lean in. Five cozy ways to make the most of a snow day in South Mumbai.",
    imageUrl:
      "https://images.unsplash.com/photo-1516912481808-3406841bd33c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Lifestyle",
    featured: false,
    status: "published" as const,
    intro: [],
    downloads: [],
    sections: [],
  },
  {
    slug: "agent-mistakes-2025",
    date: "2026-02-05",
    title: "8 Ways Agents Held Their Business Back in 2025!",
    excerpt:
      "Discover the top mistakes agents made in 2025 that slowed their growth and learn how to avoid them in the year ahead.",
    imageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "News",
    featured: false,
    status: "published" as const,
    intro: [],
    downloads: [],
    sections: [],
  },
  {
    slug: "january-2026-market-update",
    date: "2026-02-02",
    title: "January 2026 South Mumbai Market Update",
    excerpt:
      "Inventory is up across South Mumbai to start 2026. See how Worli, Bandra, and Juhu are shaping up heading into spring.",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Real Estate",
    featured: false,
    status: "published" as const,
    intro: [],
    downloads: [],
    sections: [],
  },
  {
    slug: "selling-during-holidays",
    date: "2025-12-31",
    title: "Wrapping Up a Sale Before the Ball Drops",
    excerpt:
      "Selling your home during the holidays? It's not a hurdle, it's an opportunity. Learn how to leverage the season's magic to attract serious, motivated buyers.",
    imageUrl:
      "https://images.unsplash.com/photo-1512909481869-0eaa1e9817c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Selling",
    featured: false,
    status: "published" as const,
    intro: [],
    downloads: [],
    sections: [],
  },
  {
    slug: "what-1cr-buys-south-mumbai",
    date: "2026-03-09",
    title: "What ₹1Cr Buys in Different South Mumbai Neighbourhoods",
    excerpt:
      "Curious what ₹1Cr can still buy in today's South Mumbai market? Explore a snapshot of available listings across the peninsula.",
    imageUrl:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "Buying",
    featured: false,
    status: "published" as const,
    intro: [],
    downloads: [],
    sections: [],
  },
];

// ─── Run migration ─────────────────────────────────────────

async function migrate() {
  console.log(`🚀  Migrating ${existingPosts.length} posts to Supabase…\n`);

  for (let i = 0; i < existingPosts.length; i++) {
    const post = existingPosts[i];
    console.log(`  [${i + 1}/${existingPosts.length}] ${post.title}`);

    // Upsert post row
    const { data: postRow, error: postErr } = await supabase
      .from("posts")
      .upsert(
        {
          slug: post.slug,
          title: post.title,
          date: post.date,
          excerpt: post.excerpt,
          image_url: post.imageUrl,
          category: post.category,
          intro: post.intro,
          downloads: post.downloads,
          featured: post.featured,
          status: post.status,
          grid_order: i,
          more_articles_override: null,
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (postErr) {
      console.error(`    ❌  Failed to upsert post: ${postErr.message}`);
      continue;
    }

    // Replace sections
    if (post.sections.length > 0) {
      await supabase.from("post_sections").delete().eq("post_id", postRow.id);
      const { error: secErr } = await supabase.from("post_sections").insert(
        post.sections.map((s) => ({
          post_id: postRow.id,
          order: s.order,
          title: s.title || null,
          paragraphs: s.paragraphs,
          insight: s.insight,
        }))
      );
      if (secErr) {
        console.error(`    ⚠️   Failed to insert sections: ${secErr.message}`);
      } else {
        console.log(`    ✅  Upserted with ${post.sections.length} section(s)`);
      }
    } else {
      console.log(`    ✅  Upserted (no sections)`);
    }
  }

  console.log("\n🎉  Migration complete!");
}

migrate().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
