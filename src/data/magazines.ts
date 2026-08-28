import type { MagazineIssue } from "@/types/content";

/** Annual prototype issues of the club magazine, newest first. */
export const magazines: readonly MagazineIssue[] = [
  {
    year: 2026,
    slug: "anuron-2026",
    title: "Anuron 2026",
    subtitle: "Signals of Tomorrow",
    volume: "Volume 14",
    publishedAt: "2026-04-14",
    pages: 96,
    description:
      "The annual science magazine of DRMC Science Club explores signals—from neural impulses and radio astronomy to the warning signs hidden in climate data. This prototype issue combines student features, interviews, explainers and original illustrations.",
    highlights: [
      "Student research: mapping heat around the DRMC campus",
      "Explainer: how gravitational-wave detectors listen to space",
      "Interview: building a habit of scientific doubt",
      "Bangla science fiction and illustration portfolio",
    ],
    coverImage: {
      src: "/images/magazines/anuron-2026.svg",
      alt: "Abstract blue and teal cover for Anuron 2026, Signals of Tomorrow",
      width: 900,
      height: 1200,
    },
    featured: true,
    readOnline: {
      label: "Read Anuron 2026 online",
      href: "#reader",
    },
    downloadPdf: {
      label: "Download PDF",
      href: "/documents/anuron-2026.pdf",
      download: true,
    },
  },
  {
    year: 2025,
    slug: "anuron-2025",
    title: "Anuron 2025",
    subtitle: "Living Systems",
    volume: "Volume 13",
    publishedAt: "2025-04-14",
    pages: 88,
    description:
      "An issue about systems that adapt, cooperate and recover. Student writers move between cell biology, river ecology, public health and the design of resilient cities.",
    highlights: [
      "Photo essay: microscopic structures in familiar leaves",
      "Feature: what makes an urban wetland resilient?",
      "Student project notes on adaptable urban systems",
      "Science-book recommendations from the editorial board",
    ],
    coverImage: {
      src: "/images/magazines/anuron-2025.svg",
      alt: "Layered organic forms on the cover of Anuron 2025, Living Systems",
      width: 900,
      height: 1200,
    },
    featured: false,
    readOnline: {
      label: "Read Anuron 2025 online",
      href: "#reader",
    },
    downloadPdf: {
      label: "Download PDF",
      href: "/documents/anuron-2025.pdf",
      download: true,
    },
  },
  {
    year: 2024,
    slug: "anuron-2024",
    title: "Anuron 2024",
    subtitle: "The Measure of Wonder",
    volume: "Volume 12",
    publishedAt: "2024-03-26",
    pages: 84,
    description:
      "An annual issue about measuring the seemingly immeasurable—from the distance to a star to the uncertainty in a classroom experiment.",
    highlights: [
      "A visual archive of student science ideas",
      "Practical guide: keeping an observation notebook",
      "How astronomers estimate distances across the universe",
      "Shortlisted entries from the student science-writing contest",
    ],
    coverImage: {
      src: "/images/magazines/anuron-2024.svg",
      alt: "Orbital line art on the cover of Anuron 2024, The Measure of Wonder",
      width: 900,
      height: 1200,
    },
    featured: false,
    readOnline: {
      label: "Read Anuron 2024 online",
      href: "#reader",
    },
    downloadPdf: {
      label: "Download PDF",
      href: "/documents/anuron-2024.pdf",
      download: true,
    },
  },
];

export const magazineYears = magazines.map((magazine) => magazine.year);

export function getMagazineByYear(
  year: number | string,
): MagazineIssue | undefined {
  const normalizedYear = String(year);
  const parsedYear = /^\d{4}$/.test(normalizedYear) ? Number(normalizedYear) : Number.NaN;
  return Number.isInteger(parsedYear)
    ? magazines.find((magazine) => magazine.year === parsedYear)
    : undefined;
}

export function getFeaturedMagazine(): MagazineIssue | undefined {
  return magazines.find((magazine) => magazine.featured) ?? magazines[0];
}
