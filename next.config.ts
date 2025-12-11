import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Trinity Option B: No legacy redirects needed
      // All traffic goes to /discover for Trinity conversation
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Enable Link prefetching for better performance
          {
            key: "Link",
            value: "</fractional-jobs>; rel=prefetch, </fractional-jobs-articles>; rel=prefetch",
          },
        ],
      },
    ];
  },

  images: {
    unoptimized: true, // For Vercel deployment
  },

  // Optimize CSS and package imports for modern browsers
  experimental: {
    // Tree-shake heavy packages more aggressively
    optimizePackageImports: [
      "@tailwindcss/typography",
      "react-markdown",
      "@humeai/voice-react",
      "@mux/mux-player-react",
      "@stackframe/stack",
      "@neondatabase/serverless",
      "zod",
    ],
    // Inline critical CSS to eliminate render-blocking requests
    optimizeCss: true,
  },
};

export default nextConfig;
