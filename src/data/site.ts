import type {
  ContactDetails,
  NavigationItem,
  Notice,
  SiteConfig,
  SiteStat,
  SocialLink,
} from "@/types/content";

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
    description: "Current festival and past editions",
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

/** Notices are scheduled in Bangladesh Standard Time and selected at render time. */
export const notices: readonly Notice[] = [
  {
    id: "festival-registration-2026",
    title: "Registration now open",
    message:
      "Prototype registration for DRMC National Science Festival 2026 closes on 8 October.",
    startsAt: "2026-08-20T09:00:00+06:00",
    endsAt: "2026-10-08T23:59:00+06:00",
    link: {
      label: "View festival",
      href: "/festivals/quantum-horizon-2026",
    },
    tone: "announcement",
  },
  {
    id: "robotics-workshop-2026",
    title: "Limited workshop seats",
    message:
      "The Robotics & Control Systems Workshop takes place in the ICT Lab on 5 September.",
    startsAt: "2026-08-27T08:00:00+06:00",
    endsAt: "2026-09-05T12:00:00+06:00",
    link: {
      label: "Workshop details",
      href: "/activities/robotics-control-systems-workshop",
    },
    tone: "info",
  },
  {
    id: "festival-gate-update-2026",
    title: "Participant entry update",
    message:
      "Registered festival teams should carry their confirmation and institution ID to the Mohammadpur gate.",
    startsAt: "2026-10-14T08:00:00+06:00",
    endsAt: "2026-10-17T17:00:00+06:00",
    link: {
      label: "Check the schedule",
      href: "/festivals/quantum-horizon-2026#schedule",
    },
    tone: "urgent",
  },
];

export const siteStats: readonly SiteStat[] = [
  {
    value: "18+",
    label: "years of inquiry",
    description: "A student science community growing at DRMC since 2008.",
  },
  {
    value: "2,500+",
    label: "festival participants",
    description: "Learners welcomed from institutions across Bangladesh.",
  },
  {
    value: "40+",
    label: "annual learning hours",
    description: "Workshops, observations, competitions and open discussions.",
  },
  {
    value: "14",
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
