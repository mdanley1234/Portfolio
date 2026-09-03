import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sources are already WebP; AVIF gives the optimizer a smaller option again.
    formats: ["image/avif", "image/webp"],
    // Matches the layout's real breakpoints instead of the default ladder.
    deviceSizes: [420, 640, 828, 1080, 1400, 1920],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  experimental: {
    // Tree-shakes icon imports so a handful of glyphs don't pull the whole set.
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
