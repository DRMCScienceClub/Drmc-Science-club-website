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

const segment = (title: string, category: string): FestivalSegment => ({
  slug: title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  title,
  category,
});

const latestFestivalPoster = festivalImage(
  "/images/festivals/archive/17th-national-science-codeavour-carnival-2026.jpg",
  "Official poster for the 17th DRMC National Science and Codeavour 7.0 Carnival 2026",
  1600,
  837,
);

const latestFestival: Festival = {
  slug: "17th-national-science-codeavour-carnival-2026",
  title: "17th DRMC National Science & Codeavour 7.0 Carnival 2026",
  shortTitle: "17th Science & Codeavour Carnival",
  year: 2026,
  edition: "17th edition",
  theme: "Discere Est Evolvere",
  summary:
    "The poster-backed record of DRMC's 17th national science carnival and Codeavour 7.0 programme, held 21–23 January 2026.",
  description: [
    "The official event artwork verifies the 17th edition, its 21–23 January 2026 dates, the theme “Discere Est Evolvere”, and a programme spanning science exhibitions, olympiads, robotics, gaming, quizzes and creative challenges.",
    "The 44 segment names and sponsor acknowledgements below are transcribed from the supplied posters. A session-by-session schedule, rulebook, venue address and verified result sheets were not supplied, so those details are intentionally left unpublished.",
  ],
  startDate: "2026-01-21",
  endDate: "2026-01-23",
  dateLabel: "21–23 January 2026",
  venue: "Venue not stated on supplied poster",
  venueAddress: "The supplied event artwork does not state a venue address.",
  status: "completed",
  recordStatus: "poster-verified",
  featured: true,
  coverImage: latestFestivalPoster,
  registration: {
    status: "closed",
    label: "Completed edition",
    note: "This edition concluded on 23 January 2026. Historical registration instructions were not supplied for publication.",
  },
  segments: [
    segment("Codeavour Project Display Exhibition", "Exhibition"),
    segment("Wall Magazine Exhibition", "Exhibition"),
    segment("Scrapbook Display", "Exhibition"),
    segment("Mobile Photography Exhibition", "Photography"),
    segment("DSLR Photography Exhibition", "Photography"),
    segment("Astrophotography Exhibition", "Photography"),
    segment("Science-Based Illustration Exhibition", "Creative exhibition"),
    segment("Treasure Hunt", "Challenge"),
    segment("PUBG Mobile", "Gaming"),
    segment("FC 26", "Gaming"),
    segment("E-Football Mobile", "Gaming"),
    segment("Valorant", "Gaming"),
    segment("F1 25 Sim Racing", "Gaming"),
    segment("Clash Royale", "Gaming"),
    segment("Robo-Soccer", "Robotics"),
    segment("Line Following Robot", "Robotics"),
    segment("Mini Sumo", "Robotics"),
    segment("Drag Race", "Robotics"),
    segment("Drone Racing", "Robotics"),
    segment("Chess Showdown", "Skill competition"),
    segment("Rubik’s Cube Solving", "Skill competition"),
    segment("Integration Bee", "Mathematics"),
    segment("Math Olympiad", "Olympiad"),
    segment("Physics Olympiad", "Olympiad"),
    segment("Chemistry Olympiad", "Olympiad"),
    segment("Biology Olympiad", "Olympiad"),
    segment("Astronomy and Astrophysics Olympiad", "Olympiad"),
    segment("Robotics Olympiad", "Olympiad"),
    segment("Life Story Olympiad", "Olympiad"),
    segment("Sci-Fi Crossword Matching Olympiad", "Olympiad"),
    segment("Junior Science Olympiad", "Olympiad"),
    segment("Crisis Problem Solving", "Challenge"),
    segment("BuzzerBlitz", "Challenge"),
    segment("Flash Calculation Challenge", "Challenge"),
    segment("Star Mapping", "Astronomy"),
    segment("Solo Quiz", "Quiz"),
    segment("Team-Based Quiz", "Quiz"),
    segment("Mega Quiz", "Quiz"),
    segment("Pottermore Quiz", "Quiz"),
    segment("Marvel vs DC Quiz", "Quiz"),
    segment("Odd One Out", "Challenge"),
    segment("Geo-Tagging", "Challenge"),
    segment("Bingeflix", "Challenge"),
    segment("Memecon", "Creative competition"),
  ],
  schedule: [],
  results: [],
  resultsNote:
    "Verified result sheets were not included with the supplied event artwork.",
  sponsors: [
    { name: "United Healthcare", role: "Title sponsor" },
    { name: "ACI Pure Salt", role: "Co-sponsor · powered by" },
    { name: "deli", role: "Gold sponsor" },
  ],
  partners: [
    { name: "Nescafé", role: "Coffee partner" },
    { name: "Speedcubing Bangladesh", role: "Rubik’s Cube partner" },
    {
      name: "DRMC Film and Photography Club",
      role: "Photography partner",
    },
    { name: "ACI Fun", role: "Snacks partner" },
    { name: "Creative Juniors", role: "Robotics partner" },
    { name: "Polar Ice Cream", role: "Ice cream partner" },
    { name: "Global Brand", role: "Gaming partner" },
    { name: "khobor", role: "Online media partner" },
    { name: "The Front Page", role: "Online media partner" },
    { name: "The Daily Ittefaq", role: "Print media partner" },
    { name: "Bangladesh Chess Federation", role: "Chess partner" },
    { name: "Sunquick", role: "Refreshment partner" },
    { name: "Banglar Math", role: "Academic partner" },
    { name: "ESN BD", role: "Gaming promotional partner" },
    { name: "Somokal", role: "Print media partner" },
    { name: "Bangladesh Gamers Summit", role: "Broadcasting partner" },
    { name: "GTV", role: "Television media partner" },
    { name: "Sailor by Epyllion", role: "Outfit partner" },
    { name: "Mono Space", role: "Logistic partner" },
    { name: "ATN Bangla", role: "Television media partner" },
    { name: "Premia Education", role: "Stationery partner" },
    { name: "Udvash", role: "Academic partner" },
    { name: "Channel 24", role: "Television media partner" },
    { name: "Jaijaidin", role: "Print media partner" },
    { name: "Radio Today 89.6 FM", role: "Radio partner" },
  ],
  gallery: [latestFestivalPoster],
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
  sponsors?: readonly FestivalOrganization[];
  partners?: readonly FestivalOrganization[];
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
      `The supplied event poster records the ${seed.edition} edition, its dates and the theme “${seed.theme}”. The artwork is reproduced here as the primary archive source.`,
      "Segment names below are transcribed from the poster. Full schedules, result sheets, eligibility rules, venue records and downloadable documents will be added only after the club verifies its historical archive.",
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
    sponsors: seed.sponsors
      ? [...seed.sponsors]
      : [
          {
            name: seed.titleSponsor,
            role: "Title sponsor identified on supplied poster",
          },
        ],
    partners: seed.partners ? [...seed.partners] : [],
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
    sponsors: [
      { name: "eduCare", role: "Title sponsor" },
      { name: "Leadswin", role: "Powered by" },
      { name: "bKash", role: "Silver sponsor" },
    ],
    partners: [
      { name: "Polar Ice Cream", role: "Ice cream partner" },
      { name: "Jamuna TV", role: "Television media partner" },
      {
        name: "DRMC Film and Photography Club",
        role: "Photography partner",
      },
      { name: "Lecture Publications", role: "Outfit partner" },
      { name: "The Daily Ittefaq", role: "Print media partner" },
      { name: "Kaler Kantho", role: "Print media partner" },
      { name: "Prothom Alo", role: "Print media partner" },
      { name: "Speedcubing Bangladesh", role: "Rubik’s Cube partner" },
      { name: "Bombay Sweets", role: "Refreshment partner" },
      { name: "PRAN", role: "Beverage partner" },
      { name: "Ekattor TV", role: "Television media partner" },
      { name: "GTV", role: "Television media partner" },
      { name: "Bangladesh Chess Federation", role: "Chess partner" },
      { name: "Masud English Academy", role: "Production partner" },
      { name: "MSI", role: "Gaming partner" },
      { name: "Net Heads", role: "Connectivity partner" },
      { name: "Cudy", role: "Connectivity partner" },
      { name: "Habibi’s Game Shop", role: "Gaming accounts partner" },
    ],
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

export const festivals: readonly Festival[] = [
  latestFestival,
  ...historicalFestivalSeeds.map(historicalFestival),
].toSorted((a, b) => b.endDate.localeCompare(a.endDate));

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
    .filter(
      (festival) => festival.status === "completed" && !festival.featured,
    )
    .toSorted((a, b) => b.endDate.localeCompare(a.endDate));
}
