import type {
  ContentImage,
  Festival,
  FestivalOrganization,
} from "@/types/content";

const festivalImage = (
  src: string,
  alt: string,
  width = 1200,
  height = 800,
): ContentImage => ({ src, alt, width, height });

const organization = (
  name: string,
  role: string,
  logoName: string,
): FestivalOrganization => ({
  name,
  role,
  href: "#",
  logo: festivalImage(
    `/images/partners/${logoName}.svg`,
    `${name} placeholder partner mark`,
    320,
    160,
  ),
});

const stellarLabs = organization(
  "Stellar Labs Bangladesh",
  "Title sponsor · prototype",
  "stellar-labs",
);
const nucleusEducation = organization(
  "Nucleus Education",
  "Olympiad partner · prototype",
  "nucleus-education",
);
const horizonTech = organization(
  "Horizon Tech",
  "Innovation partner · prototype",
  "horizon-tech",
);
const scienceForAll = organization(
  "Science for All Foundation",
  "Outreach partner · prototype",
  "science-for-all",
);

/**
 * Prototype festival archive, newest first. Sponsor names and downloadable files
 * are intentionally marked as mock content until the club supplies final assets.
 */
export const festivals: readonly Festival[] = [
  {
    slug: "quantum-horizon-2026",
    title: "DRMC National Science Festival 2026",
    shortTitle: "Quantum Horizon 2026",
    year: 2026,
    edition: "12th edition",
    theme: "Quantum Horizon: Curiosity Beyond the Visible",
    summary:
      "Two days of experiments, engineering challenges and scientific exchange for curious school and college students across Bangladesh.",
    description: [
      "The DRMC National Science Festival returns with a programme built around the scale-changing ideas of modern science—from the smallest particles to the largest questions facing our cities and planet.",
      "Participants will meet student researchers, build and defend projects, compete in subject olympiads and take part in open demonstrations led by the club's academic departments.",
    ],
    startDate: "2026-10-16",
    endDate: "2026-10-17",
    dateLabel: "16–17 October 2026",
    venue: "Dhaka Residential Model College",
    venueAddress: "Mirpur Road, Mohammadpur, Dhaka 1207",
    status: "upcoming",
    featured: true,
    coverImage: festivalImage(
      "/images/festivals/quantum-horizon-2026.svg",
      "Abstract orbital illustration for Quantum Horizon 2026",
    ),
    registration: {
      status: "open",
      label: "Registration open",
      opensAt: "2026-08-20T09:00:00+06:00",
      closesAt: "2026-10-08T23:59:00+06:00",
      href: "#register",
      note: "Prototype registration only. Final fees, eligibility and submission links will be confirmed by the club authority.",
    },
    segments: [
      {
        slug: "project-display",
        title: "Science Project Display",
        category: "Research & innovation",
        summary:
          "Present a working model or evidence-based investigation to a jury of teachers, researchers and engineers.",
        eligibility: "School (VI–X) and college (XI–XII) groups",
        teamSize: "1–3 participants",
        fee: "৳500 per team (mock)",
      },
      {
        slug: "science-olympiad",
        title: "Integrated Science Olympiad",
        category: "Individual competition",
        summary:
          "A concept-driven written challenge spanning physics, chemistry, biology, mathematics and earth science.",
        eligibility: "Junior (VI–VIII), Secondary (IX–X), Higher Secondary (XI–XII)",
        teamSize: "Individual",
        fee: "৳200 per participant (mock)",
      },
      {
        slug: "robotics-challenge",
        title: "Robotics Challenge",
        category: "Engineering",
        summary:
          "Design a compact autonomous rover that can navigate a marked rescue course and complete field tasks.",
        eligibility: "Secondary and higher secondary students",
        teamSize: "2–4 participants",
        fee: "৳800 per team (mock)",
      },
      {
        slug: "scientific-poster",
        title: "Scientific Poster Presentation",
        category: "Science communication",
        summary:
          "Turn a research question into a clear visual argument and defend it during a moderated poster walk.",
        eligibility: "School and college students",
        teamSize: "1–2 participants",
        fee: "৳300 per entry (mock)",
      },
      {
        slug: "astro-quiz",
        title: "Astro Quiz",
        category: "Team quiz",
        summary:
          "Fast-paced preliminary and buzzer rounds on astronomy, spaceflight and the night sky over Bangladesh.",
        eligibility: "School and college teams",
        teamSize: "2 participants",
        fee: "৳300 per team (mock)",
      },
    ],
    schedule: [
      {
        date: "2026-10-16",
        label: "Day 1 · Discover",
        items: [
          {
            time: "08:00",
            title: "Campus gates and registration desks open",
            description: "Badge collection and project installation.",
            venue: "College main gate & academic building",
          },
          {
            time: "09:30",
            title: "Opening ceremony",
            description: "Welcome, festival briefing and guest address.",
            venue: "DRMC Auditorium",
          },
          {
            time: "11:00",
            title: "Project and poster judging · Round 1",
            venue: "Science building",
            segmentSlug: "project-display",
          },
          {
            time: "14:30",
            title: "Integrated Science Olympiad",
            venue: "Academic building",
            segmentSlug: "science-olympiad",
          },
          {
            time: "16:00",
            title: "Public science demonstrations",
            venue: "Central field pavilion",
          },
        ],
      },
      {
        date: "2026-10-17",
        label: "Day 2 · Build",
        items: [
          {
            time: "08:30",
            title: "Robotics arena inspection",
            venue: "Indoor games hall",
            segmentSlug: "robotics-challenge",
          },
          {
            time: "10:00",
            title: "Astro Quiz preliminary",
            venue: "Language lab",
            segmentSlug: "astro-quiz",
          },
          {
            time: "12:30",
            title: "Final project defence",
            venue: "Science building",
            segmentSlug: "project-display",
          },
          {
            time: "15:30",
            title: "Closing and award ceremony",
            description: "Results, acknowledgements and closing remarks.",
            venue: "DRMC Auditorium",
          },
        ],
      },
    ],
    results: [],
    resultsNote: "Results will be published here after the closing ceremony.",
    sponsors: [stellarLabs],
    partners: [nucleusEducation, horizonTech, scienceForAll],
    gallery: [
      festivalImage(
        "/images/festivals/quantum-horizon-2026.svg",
        "Quantum Horizon festival visual",
      ),
      festivalImage(
        "/images/activities/robotics-workshop.svg",
        "Students developing a prototype robot",
      ),
      festivalImage(
        "/images/activities/astronomy-night.svg",
        "Telescope observation session on the DRMC campus",
      ),
    ],
    brochure: {
      label: "Download festival brochure",
      href: "/documents/quantum-horizon-2026-brochure.pdf",
      download: true,
    },
    rulebook: {
      label: "Download segment rulebook",
      href: "/documents/quantum-horizon-2026-rulebook.pdf",
      download: true,
    },
  },
  {
    slug: "innovation-frontier-2025",
    title: "DRMC National Science Festival 2025",
    shortTitle: "Innovation Frontier 2025",
    year: 2025,
    edition: "11th edition",
    theme: "Innovation Frontier: Ideas for a Resilient Bangladesh",
    summary:
      "The 2025 edition connected student-led science with the challenges of safer cities, clean water and climate resilience.",
    description: [
      "Innovation Frontier gathered teams from schools and colleges around Bangladesh for project displays, olympiads and an engineering design sprint.",
      "The festival's central exhibition asked participants to frame local problems carefully, test a solution and communicate both its promise and limitations.",
    ],
    startDate: "2025-09-19",
    endDate: "2025-09-20",
    dateLabel: "19–20 September 2025",
    venue: "Dhaka Residential Model College",
    venueAddress: "Mirpur Road, Mohammadpur, Dhaka 1207",
    status: "completed",
    featured: false,
    coverImage: festivalImage(
      "/images/festivals/innovation-frontier-2025.svg",
      "Geometric innovation illustration for the 2025 festival",
    ),
    registration: {
      status: "closed",
      label: "Registration closed",
      opensAt: "2025-07-20T09:00:00+06:00",
      closesAt: "2025-09-10T23:59:00+06:00",
      note: "This edition has concluded. Browse the published results and archive gallery below.",
    },
    segments: [
      {
        slug: "project-display",
        title: "Science Project Display",
        category: "Research & innovation",
        summary: "Working projects addressing environmental and civic challenges.",
        eligibility: "School and college groups",
        teamSize: "1–3 participants",
        fee: "Registration closed",
      },
      {
        slug: "science-olympiad",
        title: "Science Olympiad",
        category: "Individual competition",
        summary: "Junior, secondary and higher-secondary concept rounds.",
        eligibility: "Classes VI–XII",
        teamSize: "Individual",
        fee: "Registration closed",
      },
      {
        slug: "green-engineering",
        title: "Green Engineering Sprint",
        category: "Engineering",
        summary: "A timed build challenge using a fixed kit of reusable materials.",
        eligibility: "Secondary and higher secondary students",
        teamSize: "3 participants",
        fee: "Registration closed",
      },
      {
        slug: "science-quiz",
        title: "Science Quiz",
        category: "Team quiz",
        summary: "Written qualifier followed by an auditorium buzzer final.",
        eligibility: "School and college teams",
        teamSize: "2 participants",
        fee: "Registration closed",
      },
    ],
    schedule: [
      {
        date: "2025-09-19",
        label: "Day 1 · Investigate",
        items: [
          {
            time: "08:30",
            title: "Participant check-in",
            venue: "Academic building",
          },
          {
            time: "10:00",
            title: "Opening and keynote",
            venue: "DRMC Auditorium",
          },
          {
            time: "11:30",
            title: "Project judging",
            venue: "Science building",
            segmentSlug: "project-display",
          },
          {
            time: "14:30",
            title: "Science Olympiad",
            venue: "Academic building",
            segmentSlug: "science-olympiad",
          },
        ],
      },
      {
        date: "2025-09-20",
        label: "Day 2 · Innovate",
        items: [
          {
            time: "09:00",
            title: "Green Engineering Sprint",
            venue: "Indoor games hall",
            segmentSlug: "green-engineering",
          },
          {
            time: "11:30",
            title: "Science Quiz final",
            venue: "DRMC Auditorium",
            segmentSlug: "science-quiz",
          },
          {
            time: "15:00",
            title: "Awards and closing",
            venue: "DRMC Auditorium",
          },
        ],
      },
    ],
    results: [
      {
        segment: "Senior Project Display",
        position: "Champion",
        recipient: "Team Aqua Sentinel",
        institution: "Rajuk Uttara Model College",
      },
      {
        segment: "Junior Project Display",
        position: "Champion",
        recipient: "Team Shobuj Chhaya",
        institution: "Government Laboratory High School",
      },
      {
        segment: "Higher Secondary Science Olympiad",
        position: "Champion",
        recipient: "Tahmid Rahman",
        institution: "Notre Dame College",
      },
      {
        segment: "Green Engineering Sprint",
        position: "Champion",
        recipient: "Team Delta Works",
        institution: "Dhaka Residential Model College",
      },
      {
        segment: "Science Quiz",
        position: "1st Runner-up",
        recipient: "Team Curie",
        institution: "Viqarunnisa Noon School & College",
      },
    ],
    resultsNote: "Selected prototype results are shown for layout demonstration.",
    sponsors: [stellarLabs],
    partners: [horizonTech, scienceForAll],
    gallery: [
      festivalImage(
        "/images/festivals/innovation-frontier-2025.svg",
        "Innovation Frontier 2025 archive visual",
      ),
      festivalImage(
        "/images/activities/climate-forum.svg",
        "Student speakers at a climate forum",
      ),
      festivalImage(
        "/images/activities/science-olympiad.svg",
        "Students taking part in a science olympiad",
      ),
    ],
    brochure: {
      label: "View archived brochure",
      href: "/documents/innovation-frontier-2025-brochure.pdf",
      download: true,
    },
    rulebook: {
      label: "View archived rulebook",
      href: "/documents/innovation-frontier-2025-rulebook.pdf",
      download: true,
    },
  },
  {
    slug: "cosmic-inquiry-2024",
    title: "DRMC National Science Festival 2024",
    shortTitle: "Cosmic Inquiry 2024",
    year: 2024,
    edition: "10th edition",
    theme: "Cosmic Inquiry: Question, Observe, Discover",
    summary:
      "A milestone tenth edition celebrating observation, evidence and a decade of student science at DRMC.",
    description: [
      "Cosmic Inquiry placed astronomy and evidence-led discovery at the centre of the festival while retaining its popular project and olympiad programmes.",
      "An evening skywatch, model satellite challenge and public lecture helped mark the festival's tenth edition.",
    ],
    startDate: "2024-09-27",
    endDate: "2024-09-28",
    dateLabel: "27–28 September 2024",
    venue: "Dhaka Residential Model College",
    venueAddress: "Mirpur Road, Mohammadpur, Dhaka 1207",
    status: "completed",
    featured: false,
    coverImage: festivalImage(
      "/images/festivals/cosmic-inquiry-2024.svg",
      "Cosmic orbit illustration for the 2024 festival",
    ),
    registration: {
      status: "closed",
      label: "Registration closed",
      note: "This archived festival has concluded.",
    },
    segments: [
      {
        slug: "project-display",
        title: "Science Project Display",
        category: "Research & innovation",
        summary: "Student research, models and engineering prototypes.",
        eligibility: "School and college groups",
        teamSize: "1–3 participants",
        fee: "Registration closed",
      },
      {
        slug: "astronomy-olympiad",
        title: "Astronomy Olympiad",
        category: "Individual competition",
        summary: "Conceptual questions, sky maps and observation problems.",
        eligibility: "Classes VIII–XII",
        teamSize: "Individual",
        fee: "Registration closed",
      },
      {
        slug: "satellite-model",
        title: "Model Satellite Challenge",
        category: "Engineering",
        summary: "Build and explain a model Earth-observation payload.",
        eligibility: "School and college groups",
        teamSize: "2–4 participants",
        fee: "Registration closed",
      },
    ],
    schedule: [
      {
        date: "2024-09-27",
        label: "Day 1 · Question",
        items: [
          {
            time: "09:00",
            title: "Opening ceremony",
            venue: "DRMC Auditorium",
          },
          {
            time: "11:00",
            title: "Project exhibition",
            venue: "Science building",
            segmentSlug: "project-display",
          },
          {
            time: "18:00",
            title: "Campus skywatch",
            venue: "College field",
          },
        ],
      },
      {
        date: "2024-09-28",
        label: "Day 2 · Discover",
        items: [
          {
            time: "09:30",
            title: "Astronomy Olympiad",
            venue: "Academic building",
            segmentSlug: "astronomy-olympiad",
          },
          {
            time: "12:00",
            title: "Model Satellite final",
            venue: "Indoor games hall",
            segmentSlug: "satellite-model",
          },
          {
            time: "15:30",
            title: "Tenth-edition closing ceremony",
            venue: "DRMC Auditorium",
          },
        ],
      },
    ],
    results: [
      {
        segment: "Project Display",
        position: "Champion",
        recipient: "Team Nodi",
        institution: "St. Joseph Higher Secondary School",
      },
      {
        segment: "Astronomy Olympiad",
        position: "Champion",
        recipient: "Nafisa Islam",
        institution: "Holy Cross College",
      },
      {
        segment: "Model Satellite Challenge",
        position: "Champion",
        recipient: "Team Meghna Orbiter",
        institution: "Dhaka Residential Model College",
      },
    ],
    resultsNote: "Selected prototype results are shown for layout demonstration.",
    sponsors: [nucleusEducation],
    partners: [scienceForAll],
    gallery: [
      festivalImage(
        "/images/festivals/cosmic-inquiry-2024.svg",
        "Cosmic Inquiry 2024 archive visual",
      ),
      festivalImage(
        "/images/activities/astronomy-night.svg",
        "Students observing the night sky",
      ),
      festivalImage(
        "/images/activities/lab-discovery.svg",
        "Hands-on science demonstration",
      ),
    ],
    brochure: {
      label: "View archived brochure",
      href: "/documents/cosmic-inquiry-2024-brochure.pdf",
      download: true,
    },
    rulebook: {
      label: "View archived rulebook",
      href: "/documents/cosmic-inquiry-2024-rulebook.pdf",
      download: true,
    },
  },
];

export const festivalSlugs = festivals.map((festival) => festival.slug);

export function getFestivalBySlug(slug: string): Festival | undefined {
  return festivals.find((festival) => festival.slug === slug);
}

export function getFeaturedFestival(): Festival | undefined {
  return festivals.find((festival) => festival.featured);
}

export function getCurrentOrUpcomingFestival(): Festival | undefined {
  return (
    festivals.find((festival) => festival.status === "ongoing") ??
    festivals.find((festival) => festival.status === "upcoming")
  );
}

export function getFestivalArchive(): Festival[] {
  return festivals
    .filter((festival) => festival.status === "completed")
    .toSorted((a, b) => b.year - a.year);
}
