import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (supabaseUrl) {
  try {
    const url = new URL(supabaseUrl);
    if (url.protocol === "https:" || url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      remotePatterns.push({
        protocol: url.protocol === "https:" ? "https" : "http",
        hostname: url.hostname,
        port: url.port,
        pathname: "/storage/v1/object/**",
      });
    }
  } catch {
    // Runtime configuration reports malformed Supabase URLs more clearly.
  }
}

const nextConfig: NextConfig = {
  experimental: {
    // Next's CLI checker currently loses captured tsc output under Node 24.
    // TypeScript 5.9 still exposes the compiler API, so use that supported path.
    useTypeScriptCli: false,
  },
  images: {
    qualities: [75, 100],
    remotePatterns,
  },
};

export default nextConfig;
