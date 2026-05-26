import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix workspace root warning
  turbopack: {
    root: __dirname,
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
