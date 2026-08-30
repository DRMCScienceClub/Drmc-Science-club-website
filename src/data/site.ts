import type {
  ContactDetails,
  NavigationItem,
  Notice,
  SiteConfig,
  SiteStat,
  SocialLink,
} from "@/types/content";
import { achievements } from "./achievements";
import { activities } from "./activities";
import { festivals } from "./festivals";
import { auroraArchive } from "./magazines";

export const siteConfig: SiteConfig = {
  name: "DRMC Science Club",
  shortName: "DRMCSC",
  description:
    "The student science community of Dhaka Residential Model College—questioning carefully, building responsibly and sharing what we discover.",
  url: "https://scienceclub.drmc.edu.bd",
  locale: "en_BD",
  established: 2008,
  institution: "Dhaka Residential Model College",
};

export const primaryNavigation: readonly NavigationItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    description: "Our purpose, history and values",
  },
  {
    label: "Activities",
    href: "/activities",
    description: "Workshops, observations and competitions",
  },
  {
    label: "Achievements",
    href: "/achievements",
    description: "Student distinctions documented in club announcements",
  },
  {
    label: "Executives",
    href: "/executives",
    description: "Current and archived panels",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Find and contact the club",
  },
  {
    label: "Join the Club",
    href: "/join",
    description: "Membership information for DRMC students",
    highlighted: true,
  },
];

export const exploreNavigation: readonly NavigationItem[] = [
  {
    label: "Science Festivals",
    href: "/festivals",
    description: "The latest verified carnival and past editions",
  },
  {
    label: "Annual Magazine",
    href: "/magazines",
    description: "Read the Aurora archive",
  },
];

export const footerNavigation = [
  {
    title: "Explore",
    links: [
      { label: "About the club", href: "/about" },
      { label: "Activities", href: "/activities" },
      { label: "Achievements", href: "/achievements" },
      { label: "Festivals", href: "/festivals" },
      { label: "Magazines", href: "/magazines" },
    ],
  },
  {
    title: "People",
    links: [
      { label: "Executive panels", href: "/executives" },
      { label: "Join the club", href: "/join" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Administration",
    links: [{ label: "Admin sign in", href: "/admin/login" }],
  },
] as const;

/**
 * No time-sensitive notice was included in the supplied source set. Keeping
 * this empty prevents an expired or speculative announcement from appearing.
 */
export const notices: readonly Notice[] = [];

export const siteStats: readonly SiteStat[] = [
  {
    value: String(festivals.length),
    label: "festival editions",
    description: "Poster-backed records spanning the 8th through 17th editions.",
  },
  {
    value: String(activities.length),
    label: "verified activities",
    description: "Supplied programme artwork preserved in chronological order.",
  },
  {
    value: String(achievements.length),
    label: "achievement records",
    description: "Poster-backed student and team distinctions in the archive.",
  },
  {
    value: String(auroraArchive.totalVolumes),
    label: "magazine volumes",
    description: "Student science writing, research notes and illustrations.",
  },
];

export const contactDetails: ContactDetails = {
  institution: "Dhaka Residential Model College",
  clubName: "DRMC Science Club",
  addressLines: [
    "Science Building, Dhaka Residential Model College",
    "Mirpur Road, Mohammadpur",
    "Dhaka 1207, Bangladesh",
  ],
  email: "scienceclub@drmc.edu.bd",
  phone: "+880 2 5815 3780",
  officeHours: "Sunday–Thursday, 10:00–16:00 (during college terms)",
  mapUrl: "https://maps.google.com/?q=Dhaka+Residential+Model+College",
};

export const socialLinks: readonly SocialLink[] = [
  {
    platform: "Facebook",
    label: "Follow DRMC Science Club on Facebook",
    handle: "@DRMCScienceClub",
    href: "https://www.facebook.com/DRMCScienceClub",
  },
  {
    platform: "Instagram",
    label: "Follow DRMC Science Club on Instagram",
    handle: "@drmcscienceclub",
    href: "https://www.instagram.com/drmcscienceclub/",
  },
];

export const clubPillars = [
  {
    title: "Question carefully",
    description:
      "Begin with a precise question, seek evidence and stay willing to revise an answer.",
  },
  {
    title: "Build responsibly",
    description:
      "Turn concepts into safe, thoughtful experiments and solutions grounded in real needs.",
  },
  {
    title: "Share generously",
    description:
      "Make science welcoming through clear communication, peer learning and public programmes.",
  },
] as const;

export const membershipSteps = [
  {
    step: "01",
    title: "Attend an orientation",
    description:
      "Meet the departments, understand the annual programme and ask questions before applying.",
  },
  {
    step: "02",
    title: "Choose your interests",
    description:
      "Tell us which fields, practical skills or communication roles you would like to explore.",
  },
  {
    step: "03",
    title: "Complete the student form",
    description:
      "Submit the club's term-time form when the next DRMC student intake is announced.",
  },
] as const;

export function getActiveNotices(
  referenceDate: Date | string = new Date(),
): Notice[] {
  const timestamp =
    referenceDate instanceof Date
      ? referenceDate.getTime()
      : new Date(referenceDate).getTime();

  if (!Number.isFinite(timestamp)) {
    return [];
  }

  return notices.filter(
    (notice) =>
      timestamp >= new Date(notice.startsAt).getTime() &&
      timestamp <= new Date(notice.endsAt).getTime(),
  );
}
