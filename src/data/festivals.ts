import type {
  ContentImage,
  Festival,
  FestivalOrganization,
  FestivalSegment,
} from "@/types/content";

const festivalImage = (
  src: string,
  alt: string,
  width = 1600,
  height = 900,
): ContentImage => ({ src, alt, width, height });

const organization = (
  name: string,
  role: string,
  logoName: string,
): FestivalOrganization => ({
  name,
  role,
  logo: festivalImage(
    `/images/partners/${logoName}.svg`,
    `${name} prototype partner mark`,
    420,
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

const upcomingFestival: Festival = {
  slug: "quantum-horizon-2026",
  title: "DRMC National Science Festival 2026",
  shortTitle: "Quantum Horizon 2026",
  year: 2026,
  edition: "TBC edition",
  theme: "Quantum Horizon: Curiosity Beyond the Visible",
  summary:
    "A Phase 1 programme concept for experiments, engineering challenges and scientific exchange among school and college students across Bangladesh.",
  description: [
    "This clearly labelled prototype demonstrates how a future DRMC National Science Festival can publish live registration, schedules, segments and resources. Its title, edition, dates and programme require club approval before launch.",
    "The proposed programme moves from the smallest particles to the largest questions facing our cities and planet, with student research, subject olympiads and open demonstrations led by the club's academic departments.",
  ],
  startDate: "2026-10-16",
  endDate: "2026-10-17",
  dateLabel: "16–17 October 2026 · prototype dates",
  venue: "Dhaka Residential Model College",
  venueAddress: "Mirpur Road, Mohammadpur, Dhaka 1207",
  status: "upcoming",
  recordStatus: "prototype",
  featured: true,
  coverImage: festivalImage(
    "/images/festivals/quantum-horizon-2026.svg",
    "Abstract orbital prototype artwork for Quantum Horizon 2026",
  ),
  registration: {
    status: "open",
    label: "Prototype registration open",
    opensAt: "2026-08-20T09:00:00+06:00",
    closesAt: "2026-10-08T23:59:00+06:00",
    href: "#register",
    note: "Demonstration only. Final dates, fees, eligibility and submission links must be confirmed by the club authority.",
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
      eligibility:
        "Junior (VI–VIII), Secondary (IX–X), Higher Secondary (XI–XII)",
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
      "Quantum Horizon prototype festival visual",
    ),
    festivalImage(
      "/images/activities/robotics-workshop.svg",
      "Illustration of students developing a prototype robot",
    ),
    festivalImage(
      "/images/activities/astronomy-night.svg",
      "Illustration of a telescope observation session on the DRMC campus",
    ),
  ],
  brochure: {
    label: "Download prototype festival brochure",
    href: "/documents/quantum-horizon-2026-brochure.pdf",
    download: true,
  },
  rulebook: {
    label: "Download prototype segment rulebook",
    href: "/documents/quantum-horizon-2026-rulebook.pdf",
    download: true,
  },
};

type ArchivedSegmentSeed = Pick<FestivalSegment, "title" | "category">;

type HistoricalFestivalSeed = {
  slug: string;
  title: string;
  shortTitle: string;
  year: number;
  edition: string;
  theme: string;
  startDate: string;
  endDate: string;
  dateLabel: string;
  titleSponsor: string;
  image: ContentImage;
  segments: readonly ArchivedSegmentSeed[];
};

const slugifySegment = (title: string, index: number): string =>
  `${title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${index + 1}`;

function historicalFestival(seed: HistoricalFestivalSeed): Festival {
  return {
    slug: seed.slug,
    title: seed.title,
    shortTitle: seed.shortTitle,
    year: seed.year,
    edition: `${seed.edition} edition`,
    theme: seed.theme,
    summary: `A poster-backed record of the ${seed.edition} DRMC national science programme, held ${seed.dateLabel}.`,
    description: [
      `The supplied event poster records the ${seed.edition} edition, its dates and the theme “${seed.theme}”. The artwork is reproduced here as the primary Phase 1 archive source.`,
      "Segment names below are transcribed from the poster. Full schedules, result sheets, eligibility rules, sponsor classifications, venue records and downloadable documents will be added only after the club verifies its historical archive.",
    ],
    startDate: seed.startDate,
    endDate: seed.endDate,
    dateLabel: seed.dateLabel,
    venue: "Archive venue to be verified",
    venueAddress: "The supplied poster does not specify a venue address.",
    status: "completed",
    recordStatus: "poster-verified",
    featured: false,
    coverImage: seed.image,
    registration: {
      status: "closed",
      label: "Archived edition",
      note: "This edition has concluded. Historical registration details have not yet been verified for publication.",
    },
    segments: seed.segments.map((segment, index) => ({
      ...segment,
      slug: slugifySegment(segment.title, index),
    })),
    schedule: [],
    results: [],
    resultsNote:
      "Verified result sheets were not included with the supplied archive artwork.",
    sponsors: [
      {
        name: seed.titleSponsor,
        role: "Title sponsor identified on supplied poster",
      },
    ],
    partners: [],
    gallery: [seed.image],
  };
}

const historicalFestivalSeeds: readonly HistoricalFestivalSeed[] = [
  {
    slug: "16th-national-science-carnival-2025",
    title: "16th DRMC National Science Carnival 2025",
    shortTitle: "16th Science Carnival",
    year: 2025,
    edition: "16th",
    theme: "Orbis Scientiae, Vita Astrorum",
    startDate: "2025-05-01",
    endDate: "2025-05-03",
    dateLabel: "1–3 May 2025",
    titleSponsor: "eduCare",
    image: festivalImage(
      "/images/festivals/archive/16th-national-science-carnival-2025.jpg",
      "Poster for the 16th DRMC National Science Carnival 2025, featuring blue constellations on a dark star field",
      2048,
      1072,
    ),
    segments: [],
  },
  {
    slug: "15th-national-science-codeavour-international-carnival-2024",
    title: "15th DRMC National Science & Codeavour International Carnival 2024",
    shortTitle: "15th Science & Codeavour Carnival",
    year: 2024,
    edition: "15th",
    theme: "Excellentia Scientifica",
    startDate: "2024-02-01",
    endDate: "2024-02-04",
    dateLabel: "1–4 February 2024",
    titleSponsor: "Bashundhara Oil and Gas Company Ltd.",
    image: festivalImage(
      "/images/festivals/archive/15th-national-science-codeavour-international-carnival-2024.jpg",
      "Poster for the 15th DRMC National Science and Codeavour International Carnival 2024, featuring an orange-and-purple nebula and event lists",
      1600,
      891,
    ),
    segments: [
      { title: "Project Display Exhibition", category: "Exhibition" },
      {
        title: "Codeavour International Project Display",
        category: "International competition",
      },
      {
        title: "Scientific Debate (Myth Buster)",
        category: "Science communication",
      },
      { title: "Robo Race", category: "Robotics" },
      { title: "General Science Olympiad", category: "Olympiad" },
      {
        title: "Criminal Case Investigation",
        category: "Applied science",
      },
    ],
  },
  {
    slug: "14th-national-science-carnival-2023",
    title: "14th DRMC–Summit National Science Carnival 2023",
    shortTitle: "14th Science Carnival",
    year: 2023,
    edition: "14th",
    theme: "Proximam Inspire",
    startDate: "2023-01-27",
    endDate: "2023-01-29",
    dateLabel: "27–29 January 2023",
    titleSponsor: "Summit",
    image: festivalImage(
      "/images/festivals/archive/14th-national-science-carnival-2023.jpg",
      "Poster for the 14th DRMC–Summit National Science Carnival 2023, featuring a red-and-blue nebula and event lists",
      1280,
      720,
    ),
    segments: [
      { title: "Project Display Exhibition", category: "Exhibition" },
      {
        title: "Science Based Poster Designing",
        category: "Science communication",
      },
      { title: "Robo-Fight", category: "Robotics" },
      { title: "General Science Olympiad", category: "Olympiad" },
      { title: "Geo-Tagging Olympiad", category: "Olympiad" },
      { title: "Science Based Memecon", category: "Creative competition" },
    ],
  },
  {
    slug: "13th-national-science-carnival-2020",
    title: "13th DRMC–Evaly National Science Carnival 2020",
    shortTitle: "13th Science Carnival",
    year: 2020,
    edition: "13th",
    theme: "Capax Infiniti",
    startDate: "2020-02-06",
    endDate: "2020-02-08",
    dateLabel: "6–8 February 2020",
    titleSponsor: "Evaly",
    image: festivalImage(
      "/images/festivals/archive/13th-national-science-carnival-2020.jpg",
      "Poster for the 13th DRMC–Evaly National Science Carnival 2020, featuring purple smoke, geometric accents and event lists",
      2048,
      1071,
    ),
    segments: [
      { title: "Project Display", category: "Exhibition" },
      { title: "Gaming Contest", category: "Competition" },
      { title: "Robotics Competition", category: "Robotics" },
      { title: "Biology Olympiad", category: "Olympiad" },
      { title: "Astronomy Olympiad", category: "Olympiad" },
      { title: "52 Acre Challenge", category: "Challenge" },
    ],
  },
  {
    slug: "12th-national-science-carnival-2019",
    title: "12th DRMC–Summit National Science Carnival 2019",
    shortTitle: "12th Science Carnival",
    year: 2019,
    edition: "12th",
    theme: "Appetitum Scientiæ",
    startDate: "2019-01-31",
    endDate: "2019-02-02",
    dateLabel: "31 January–2 February 2019",
    titleSponsor: "Summit",
    image: festivalImage(
      "/images/festivals/archive/12th-national-science-carnival-2019.jpg",
      "Poster for the 12th DRMC–Summit National Science Carnival 2019, featuring a teal circuit-themed science portal and event lists",
      2048,
      1152,
    ),
    segments: [
      { title: "Project Display Competition", category: "Competition" },
      { title: "Robot Showcasing", category: "Robotics" },
      { title: "Robotics Competition", category: "Robotics" },
      { title: "Math Olympiad", category: "Olympiad" },
      { title: "Astronomy Olympiad", category: "Olympiad" },
      {
        title: "Science Fiction Story Writing",
        category: "Creative competition",
      },
    ],
  },
  {
    slug: "11th-national-science-carnival-2018",
    title: "11th DRMC–Bhumijo National Science Carnival 2018",
    shortTitle: "11th Science Carnival",
    year: 2018,
    edition: "11th",
    theme: "Amor Scientim (as printed)",
    startDate: "2018-02-08",
    endDate: "2018-02-10",
    dateLabel: "8–10 February 2018",
    titleSponsor: "Bhumijo",
    image: festivalImage(
      "/images/festivals/archive/11th-national-science-carnival-2018.jpg",
      "Poster for the 11th DRMC–Bhumijo National Science Carnival 2018, featuring an asteroid field and competition lists",
      2048,
      1602,
    ),
    segments: [
      { title: "Project Display", category: "Exhibition" },
      { title: "Gaming Contest", category: "Competition" },
      { title: "Robotics Competition", category: "Robotics" },
      { title: "Math Olympiad", category: "Olympiad" },
      { title: "IT Olympiad", category: "Olympiad" },
      { title: "Scientific Crossword", category: "Competition" },
    ],
  },
  {
    slug: "10th-national-science-carnival-2017",
    title: "DRMC–Savlon 10th National Science Carnival 2017",
    shortTitle: "10th Science Carnival",
    year: 2017,
    edition: "10th",
    theme: "Sapere Aude",
    startDate: "2017-02-09",
    endDate: "2017-02-11",
    dateLabel: "9–11 February 2017",
    titleSponsor: "Savlon",
    image: festivalImage(
      "/images/festivals/archive/10th-national-science-carnival-2017.jpg",
      "Poster for the DRMC–Savlon 10th National Science Carnival 2017, featuring a fractured sphere in space and event lists",
      960,
      480,
    ),
    segments: [
      { title: "Project Display", category: "Exhibition" },
      { title: "Mobile Photography", category: "Exhibition" },
      { title: "Programming Contest", category: "Competition" },
      { title: "Bio Olympiad", category: "Olympiad" },
      { title: "Astronomy Olympiad", category: "Olympiad" },
      { title: "Chess", category: "Competition" },
    ],
  },
  {
    slug: "9th-national-science-carnival-2016",
    title: "DRMC–Islami Bank 9th National Science Carnival 2016",
    shortTitle: "9th Science Carnival",
    year: 2016,
    edition: "9th",
    theme: "Fiat Lux",
    startDate: "2016-02-04",
    endDate: "2016-02-06",
    dateLabel: "4–6 February 2016",
    titleSponsor: "Islami Bank Bangladesh Limited",
    image: festivalImage(
      "/images/festivals/archive/9th-national-science-carnival-2016.jpg",
      "Poster for the DRMC–Islami Bank 9th National Science Carnival 2016, featuring a geometric blue brain and competition lists",
      2896,
      1448,
    ),
    segments: [
      { title: "Project Display", category: "Exhibition" },
      { title: "Photography Exhibition", category: "Exhibition" },
      { title: "Programming Contest", category: "Competition" },
      { title: "Math Olympiad", category: "Olympiad" },
      { title: "Informatics Olympiad", category: "Olympiad" },
      { title: "Science Based Crosswords", category: "Competition" },
    ],
  },
  {
    slug: "8th-national-science-festival-2015",
    title: "DRMC–Square 8th National Science Festival 2015",
    shortTitle: "8th Science Festival",
    year: 2015,
    edition: "8th",
    theme: "Scientia Vinces",
    startDate: "2015-02-05",
    endDate: "2015-02-07",
    dateLabel: "5–7 February 2015",
    titleSponsor: "Square",
    image: festivalImage(
      "/images/festivals/archive/8th-national-science-festival-2015.jpg",
      "Poster for the DRMC–Square 8th National Science Festival 2015, featuring a blue digital globe and event lists",
      2896,
      1448,
    ),
    segments: [
      { title: "Project Display", category: "Exhibition" },
      { title: "Wall Magazine", category: "Exhibition" },
      { title: "Robotics Workshop", category: "Workshop" },
      { title: "Programming Contest", category: "Competition" },
      { title: "Math Olympiad", category: "Olympiad" },
      { title: "Astronomy Olympiad", category: "Olympiad" },
    ],
  },
];

/**
 * The current programme is explicitly fictional Phase 1 content. Historical
 * entries are limited to facts visible in the supplied archive posters.
 */
export const festivals: readonly Festival[] = [
  upcomingFestival,
  ...historicalFestivalSeeds.map(historicalFestival),
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
    .toSorted((a, b) => b.endDate.localeCompare(a.endDate));
}
