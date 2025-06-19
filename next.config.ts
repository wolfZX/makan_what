import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [];
  },
  env: {
    PORT: "3008",
  },
};

export default nextConfig;
