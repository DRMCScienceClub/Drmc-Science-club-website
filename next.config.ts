import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Next's CLI checker currently loses captured tsc output under Node 24.
    // TypeScript 5.9 still exposes the compiler API, so use that supported path.
    useTypeScriptCli: false,
  },
  images: {
    qualities: [75, 100],
  },
};

export default nextConfig;
