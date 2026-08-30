import type { Activity, ContentImage } from "@/types/content";

const activityImage = (
  src: string,
  alt: string,
  width: number,
  height: number,
): ContentImage => ({ src, alt, width, height });

/**
 * Programmes transcribed from the supplied official artwork. The array itself is
 * intentionally not treated as chronology; every public helper sorts by date.
 */
export const activities: readonly Activity[] = [
  {
    slug: "intra-catalyst-2026",
    title: "Intra Catalyst 2026",
    category: "Competition",
    status: "completed",
    recordStatus: "poster-verified",
    featured: true,
    date: "2026-08-29",
    dateLabel: "29 August 2026",
    location: "DRMC Campus, Academic Building-3",
    excerpt:
      "An intra-college project display and science olympiad programme for students from classes 3 to 12.",
    body: [
      "DRMC Science Club's published Intra Catalyst programme combined a project display with subject olympiads on 29 August 2026. The artwork lists Primary (classes 3–5), Junior (classes 6–8), Secondary (classes 9–10), and Senior (classes 11–12) categories.",
      "The project display ran from 9:00 am to 1:00 pm in Academic Building-3, with reporting at 8:00 am. Mechanical, non-mechanical, and IT projects competed together in an open category, and each team could include one to three people.",
      "The published olympiad schedule was General Science, 9:00–9:30 am; Junior Science, 9:45–10:15 am; Physics, 10:30–11:00 am; Chemistry, 11:15–11:45 am; and Biology, 12:00–12:30 pm. The prize-giving time was marked to be announced.",
    ],
    image: activityImage(
      "/images/activities/2026-intra-catalyst-overview.jpg",
      "Official Intra Catalyst 2026 overview poster",
      1279,
      1638,
    ),
    gallery: [
      activityImage(
        "/images/activities/2026-intra-catalyst-schedule.jpg",
        "Official Intra Catalyst 2026 event schedule",
        1638,
        2048,
      ),
      activityImage(
        "/images/activities/2026-intra-catalyst-project-display.jpg",
        "Official Intra Catalyst 2026 project-display information",
        1638,
        2048,
      ),
      activityImage(
        "/images/activities/2026-intra-catalyst-olympiad-guidelines.jpg",
        "Official Intra Catalyst 2026 olympiad guidelines",
        1638,
        2048,
      ),
    ],
    tags: ["Project display", "Science olympiad", "Intra-college"],
    organizers: ["DRMC Science Club"],
    highlights: [
      "Project display: 9:00 am–1:00 pm; reporting time: 8:00 am",
      "Project teams of 1–3 people in one open category",
      "Olympiad pre-registration was required, with a 30-minute exam duration",
      "Olympiad participants were asked to report 15 minutes before their announced time",
    ],
  },
  {
    slug: "bmec-national-round-2026",
    title: "Banglar Math Excellency Championship 2026 — National Round",
    category: "Competition",
    status: "completed",
    recordStatus: "poster-verified",
    featured: true,
    date: "2026-05-01",
    dateLabel: "1 May 2026",
    location: "DRMC Campus, Academic Building-3",
    excerpt:
      "DRMC hosted the national round of the 2026 Banglar Math Excellency Championship in association with Banglar Math.",
    body: [
      "The supplied event artwork identifies DRMC Campus, Academic Building-3 as the venue for the national round of the Banglar Math Excellency Championship 2026.",
      "The national round was scheduled for 1 May 2026 and presented in association with DRMC Science Club and Banglar Math.",
    ],
    image: activityImage(
      "/images/activities/2026-bmec-national-round.jpg",
      "Official poster for the BMEC 2026 national round at DRMC",
      2048,
      1717,
    ),
    gallery: [],
    tags: ["Mathematics", "National round", "Competition"],
    organizers: ["Banglar Math", "DRMC Science Club"],
    highlights: [
      "National round of BMEC 2026",
      "Hosted at DRMC Campus, Academic Building-3",
      "Held on 1 May 2026",
    ],
  },
  {
    slug: "intra-academic-trials-2025",
    title: "Intra Academic Trials 2025",
    category: "Competition",
    status: "completed",
    recordStatus: "poster-verified",
    featured: true,
    date: "2025-10-20",
    dateLabel: "20 October 2025",
    location: "Venue not printed on the supplied schedule",
    excerpt:
      "A five-part DRMC Science Club academic trial covering physics, chemistry, astronomy, junior science, and biology.",
    body: [
      "DRMC Science Club's published schedule placed five academic trials on 20 October 2025. The supplied artwork does not print a venue, so no venue has been inferred for this archive record.",
      "The announced sequence was Physics, 12:00–12:35 pm; Chemistry, 12:45–1:20 pm; Astronomy, 1:30–2:05 pm; Junior Science, 2:15–2:50 pm; and Biology, 3:00–3:35 pm.",
    ],
    image: activityImage(
      "/images/activities/2025-intra-academic-trials.jpg",
      "Official schedule for the 2025 Intra Academic Trials",
      2048,
      1717,
    ),
    gallery: [],
    tags: ["Academic trial", "Olympiad", "Intra-college"],
    organizers: ["DRMC Science Club"],
    highlights: [
      "Physics: 12:00–12:35 pm",
      "Chemistry: 12:45–1:20 pm",
      "Astronomy: 1:30–2:05 pm",
      "Junior Science: 2:15–2:50 pm",
      "Biology: 3:00–3:35 pm",
    ],
  },
  {
    slug: "banglar-math-workshop-2025",
    title: "Mathematical Workshop with Banglar Math",
    category: "Workshop",
    status: "completed",
    recordStatus: "poster-verified",
    featured: false,
    date: "2025-09-02",
    endDate: "2025-09-04",
    dateLabel: "2–4 September 2025",
    location: "DRMC Auditorium",
    excerpt:
      "A three-day mathematics workshop with separate sessions for classes 3–5, 6–8, and 9–12.",
    body: [
      "DRMC Science Club and DR(MC)² announced a three-day mathematical workshop with Banglar Math at the DRMC Auditorium.",
      "The published timetable was 2 September, 12:45–2:00 pm for classes 3–5; 3 September, 1:20–2:35 pm for classes 6–8; and 4 September, 12:45–2:00 pm for classes 9–12.",
    ],
    image: activityImage(
      "/images/activities/2025-banglar-math-workshop.jpg",
      "Official poster for the 2025 mathematical workshop with Banglar Math",
      1638,
      2048,
    ),
    gallery: [],
    tags: ["Mathematics", "Workshop", "Banglar Math"],
    organizers: ["DRMC Science Club", "DR(MC)²", "Banglar Math"],
    highlights: [
      "Classes 3–5: 2 September, 12:45–2:00 pm",
      "Classes 6–8: 3 September, 1:20–2:35 pm",
      "Classes 9–12: 4 September, 12:45–2:00 pm",
    ],
  },
  {
    slug: "us-college-application-workshop-2025",
    title: "US College Application Workshop",
    category: "Workshop",
    status: "completed",
    recordStatus: "poster-verified",
    featured: false,
    date: "2025-08-23",
    dateLabel: "23 August 2025",
    location: "DRMC Auditorium",
    excerpt:
      "A Premia Education × DRMC Science Club workshop on the US college application process.",
    body: [
      "The updated programme poster announces a 23 August workshop at the DRMC Auditorium and notes that the date was scheduled with HSC '25 in mind.",
      "This archive places the programme in 2025 from that printed HSC '25 context. No additional time or programme details have been added beyond the supplied artwork.",
    ],
    image: activityImage(
      "/images/activities/2025-us-college-application-workshop.jpg",
      "Official poster for the US College Application Workshop at DRMC",
      1508,
      1889,
    ),
    gallery: [],
    tags: ["College application", "Higher education", "Workshop"],
    organizers: ["Premia Education", "DRMC Science Club"],
    highlights: [
      "Announced for 23 August",
      "Venue: DRMC Auditorium",
      "Presented by Premia Education × DRMC Science Club",
    ],
  },
  {
    slug: "igso-preparation-seminar-2025",
    title: "IGSO Preparation Seminar 2025",
    category: "Seminar",
    status: "completed",
    recordStatus: "poster-verified",
    featured: false,
    date: "2025-08-11",
    dateLabel: "11 August 2025",
    location: "Dhaka Residential Model College",
    excerpt:
      "A preparation seminar for the 2nd International General Science Olympiad, presented by DRMC Science Club.",
    body: [
      "Under the message “Science Isn't Just a Subject — It's Your Superpower!”, DRMC Science Club announced a preparation seminar for the 2nd International General Science Olympiad.",
      "The supplied poster schedules the seminar for 11 August 2025, from 12:00 to 1:00 pm, at Dhaka Residential Model College.",
    ],
    image: activityImage(
      "/images/activities/2025-igso-preparation-seminar.jpg",
      "Official poster for the 2025 IGSO preparation seminar",
      1338,
      750,
    ),
    gallery: [],
    tags: ["General science", "Olympiad preparation", "Seminar"],
    organizers: ["DRMC Science Club"],
    highlights: [
      "Preparation for the 2nd International General Science Olympiad",
      "11 August 2025, 12:00–1:00 pm",
      "Hosted at Dhaka Residential Model College",
    ],
  },
];

const newestFirst = (a: Activity, b: Activity) =>
  b.date.localeCompare(a.date);

const soonestFirst = (a: Activity, b: Activity) =>
  a.date.localeCompare(b.date);

export const activitySlugs = activities.map((activity) => activity.slug);

export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((activity) => activity.slug === slug);
}

export function getLatestActivities(limit = 3): Activity[] {
  return [...activities]
    .sort(newestFirst)
    .slice(0, Math.max(0, limit));
}

export function getUpcomingActivities(): Activity[] {
  return activities
    .filter((activity) => activity.status === "upcoming")
    .toSorted(soonestFirst);
}

export function getCompletedActivities(): Activity[] {
  return activities
    .filter((activity) => activity.status === "completed")
    .toSorted(newestFirst);
}

export function getFeaturedActivities(limit?: number): Activity[] {
  const featured = activities
    .filter((activity) => activity.featured)
    .toSorted(newestFirst);

  return typeof limit === "number"
    ? featured.slice(0, Math.max(0, limit))
    : featured;
}
