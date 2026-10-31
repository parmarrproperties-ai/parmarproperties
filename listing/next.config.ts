import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "https", hostname: "images.unsplash.com" },
];

// Property photos live in the project's Supabase storage; allow whichever project the env points at.
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { hostname, protocol } = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    remotePatterns.push({
      protocol: protocol.replace(":", "") as "http" | "https",
      hostname,
      pathname: "/storage/v1/**",
    });
  }
} catch {
  // Invalid URL in env: ignore; images from that host need a rebuild once fixed.
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.188"],
  images: {
    remotePatterns,
    // Uploaded photos never change at the same URL, so keep resized copies for 31 days
    // instead of re-optimising them from the (large) originals every few hours.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
