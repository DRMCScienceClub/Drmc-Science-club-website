import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DRMC Science Club",
    short_name: "DRMCSC",
    description: "The official website of DRMC Science Club.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7fafc",
    theme_color: "#0a2038",
    icons: [
      {
        src: "/images/brand/drmc-science-club-logo.jpeg",
        sizes: "812x802",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
