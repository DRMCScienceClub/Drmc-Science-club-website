import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DRMC Science Club",
    short_name: "DRMCSC",
    description: "The official website of DRMC Science Club.",
    start_url: "/",
    display: "standalone",
    background_color: "#edf8f5",
    theme_color: "#0b1014",
    icons: [
      {
        src: "/images/brand/drmc-science-club-app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/brand/drmc-science-club-app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
