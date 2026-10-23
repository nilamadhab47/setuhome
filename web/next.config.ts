import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  outputFileTracingIncludes: {
    "/api/waitlist": ["./public/email/**/*"],
  },
  async redirects() {
    return ["/features", "/festivals", "/for-kids", "/scripture", "/faq", "/contact"].map(
      (source) => ({ source, destination: "/", permanent: false }),
    );
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
