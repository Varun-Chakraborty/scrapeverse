import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root : process.cwd(),
  },
  /* config options here */
};

export default nextConfig;
