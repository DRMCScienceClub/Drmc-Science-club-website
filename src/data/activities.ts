import type { Activity, ContentImage } from "@/types/content";

const activityImage = (src: string, alt: string): ContentImage => ({
  src,
  alt,
  width: 1200,
  height: 800,
});

/** Regular club programmes, ordered by their public display priority. */
export const activities: readonly Activity[] = [
  {
    slug: "robotics-control-systems-workshop",
    title: "Robotics & Control Systems Workshop",
    category: "Workshop",
    status: "upcoming",
    featured: true,
    date: "2026-09-05",
    dateLabel: "5 September 2026",
    location: "DRMC ICT Lab",
    excerpt:
      "A beginner-friendly build session on sensors, motor control and the logic behind an autonomous rover.",
    body: [
      "This practical workshop introduces the sensing–decision–action loop that powers autonomous machines. Participants will work in small groups with a prepared microcontroller and rover kit.",
      "Club mentors will demonstrate safe wiring, simple sensor calibration and a line-following control routine before each group tests its rover on a compact field course.",
      "No prior robotics experience is required. Participants should bring a notebook; all electronic components will be provided for the session.",
    ],
    image: activityImage(
      "/images/activities/robotics-workshop.svg",
      "Student hands assembling a small educational robot",
    ),
    gallery: [
      activityImage(
        "/images/activities/robotics-workshop.svg",
        "Robotics workshop prototype and circuit board",
      ),
      activityImage(
        "/images/festivals/quantum-horizon-2026.svg",
        "Quantum Horizon engineering programme visual",
      ),
    ],
    tags: ["Robotics", "Electronics", "Programming"],
    organizers: ["Robotics & Engineering Department", "ICT Department"],
    highlights: [
      "Understand ultrasonic and line sensors",
      "Wire and test a motor-driver circuit",
      "Tune a simple autonomous navigation routine",
    ],
    registration: {
      label: "Reserve a workshop seat",
      href: "#register",
    },
    relatedFestivalSlug: "quantum-horizon-2026",
  },
  {
    slug: "urban-climate-solutions-forum",
    title: "Urban Climate Solutions Forum",
    category: "Seminar",
    status: "upcoming",
    featured: true,
    date: "2026-09-12",
    dateLabel: "12 September 2026",
    location: "DRMC Seminar Room",
    excerpt:
      "Students examine heat, waterlogging and air-quality evidence, then pitch a small intervention for their neighbourhood.",
    body: [
      "The forum turns familiar urban problems into researchable questions. Short talks will introduce heat-island mapping, local air-quality measurement and the basics of interpreting rainfall data.",
      "In the design round, teams will select one Dhaka neighbourhood, define an evidence gap and outline a practical school-led response. The emphasis is on testable claims rather than polished presentation.",
    ],
    image: activityImage(
      "/images/activities/climate-forum.svg",
      "Students discussing climate data around a table",
    ),
    gallery: [
      activityImage(
        "/images/activities/climate-forum.svg",
        "Climate forum discussion and city data graphics",
      ),
      activityImage(
        "/images/festivals/innovation-frontier-2025.svg",
        "Innovation Frontier resilience theme visual",
      ),
    ],
    tags: ["Climate", "Dhaka", "Data literacy"],
    organizers: ["Earth & Environmental Science Department"],
    highlights: [
      "Read and question a local environmental dataset",
      "Frame a testable neighbourhood research question",
      "Pitch an achievable student-led intervention",
    ],
    registration: {
      label: "Register for the forum",
      href: "#register",
    },
  },
  {
    slug: "monsoon-sky-observation-night",
    title: "Monsoon Sky Observation Night",
    category: "Observation",
    status: "completed",
    featured: true,
    date: "2026-07-18",
    dateLabel: "18 July 2026",
    location: "DRMC College Field",
    excerpt:
      "A guided evening of lunar observation, seasonal constellations and learning to keep a useful sky log.",
    body: [
      "After a weather briefing, members learned how to orient a planisphere and record cloud cover, limiting magnitude and observation conditions in a field log.",
      "The sky cleared long enough for groups to observe the Moon and several bright seasonal objects through club telescopes. A short discussion connected the observations to Bangladesh's monsoon weather patterns.",
    ],
    image: activityImage(
      "/images/activities/astronomy-night.svg",
      "Telescope pointed toward a starry sky from the college field",
    ),
    gallery: [
      activityImage(
        "/images/activities/astronomy-night.svg",
        "DRMC students gathered around a telescope",
      ),
      activityImage(
        "/images/festivals/cosmic-inquiry-2024.svg",
        "Cosmic Inquiry astronomy archive visual",
      ),
    ],
    tags: ["Astronomy", "Observation", "Field notes"],
    organizers: ["Astronomy & Space Science Department"],
    highlights: [
      "Used a planisphere to identify seasonal constellations",
      "Observed the lunar surface through two telescopes",
      "Completed a structured sky-observation log",
    ],
    relatedFestivalSlug: "cosmic-inquiry-2024",
  },
  {
    slug: "inter-house-science-olympiad-2026",
    title: "Inter-House Science Olympiad 2026",
    category: "Competition",
    status: "completed",
    featured: false,
    date: "2026-06-27",
    dateLabel: "27 June 2026",
    location: "DRMC Academic Building",
    excerpt:
      "More than 180 DRMC students tested their reasoning across physics, chemistry, biology and mathematics.",
    body: [
      "The annual inter-house olympiad used separate junior and senior papers designed by the club's academic departments and reviewed by teachers.",
      "Questions rewarded explanation, estimation and careful reading. A post-event solutions session gave participants a chance to challenge assumptions and compare approaches.",
    ],
    image: activityImage(
      "/images/activities/science-olympiad.svg",
      "Students working on science olympiad papers in a classroom",
    ),
    gallery: [
      activityImage(
        "/images/activities/science-olympiad.svg",
        "Inter-house science olympiad classroom",
      ),
    ],
    tags: ["Olympiad", "Reasoning", "Competition"],
    organizers: ["Academic Affairs Department", "Research Department"],
    highlights: [
      "184 participants across two divisions",
      "Four interdisciplinary question sections",
      "Open solutions and review session",
    ],
  },
  {
    slug: "microscopy-lab-discovery-day",
    title: "Microscopy Lab Discovery Day",
    category: "Workshop",
    status: "completed",
    featured: false,
    date: "2026-05-16",
    dateLabel: "16 May 2026",
    location: "DRMC Biology Laboratory",
    excerpt:
      "A careful first look at slide preparation, compound microscopes and documenting biological observations.",
    body: [
      "Participants learned the parts of a compound microscope and practised focusing from low to high power without damaging prepared slides.",
      "Groups prepared temporary onion epidermis and leaf samples, then made labelled observational drawings that separated what was visible from what they expected to see.",
    ],
    image: activityImage(
      "/images/activities/lab-discovery.svg",
      "Student viewing a prepared sample through a laboratory microscope",
    ),
    gallery: [
      activityImage(
        "/images/activities/lab-discovery.svg",
        "Microscope, slides and student lab notes",
      ),
    ],
    tags: ["Biology", "Microscopy", "Laboratory"],
    organizers: ["Biology & Life Science Department"],
    highlights: [
      "Prepared temporary plant-cell slides",
      "Practised safe microscope handling",
      "Created evidence-based observation drawings",
    ],
  },
];

export const activitySlugs = activities.map((activity) => activity.slug);

export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((activity) => activity.slug === slug);
}

export function getLatestActivities(limit = 3): Activity[] {
  return [...activities]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, Math.max(0, limit));
}

export function getFeaturedActivities(limit?: number): Activity[] {
  const featured = activities.filter((activity) => activity.featured);
  return typeof limit === "number"
    ? featured.slice(0, Math.max(0, limit))
    : featured;
}
