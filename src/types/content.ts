/** Shared content primitives used by the public prototype and the mock admin. */
export interface ContentLink {
  label: string;
  href: string;
  external?: boolean;
  download?: boolean;
}

export interface ContentImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface NavigationItem {
  label: string;
  href: string;
  description?: string;
  highlighted?: boolean;
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  startsAt: string;
  endsAt: string;
  link?: ContentLink;
  tone: "info" | "announcement" | "urgent";
}

export interface SiteStat {
  label: string;
  value: string;
  description: string;
}

export interface SocialLink {
  platform: "Facebook" | "Instagram";
  label: string;
  handle: string;
  href: string;
}

export interface ContactDetails {
  institution: string;
  clubName: string;
  addressLines: string[];
  email: string;
  phone: string;
  officeHours: string;
  mapUrl: string;
}

export type FestivalStatus = "upcoming" | "ongoing" | "completed";
export type RegistrationStatus =
  | "opening-soon"
  | "open"
  | "closed"
  | "not-required";

export interface FestivalRegistration {
  status: RegistrationStatus;
  label: string;
  opensAt?: string;
  closesAt?: string;
  href?: string;
  note: string;
}

export interface FestivalSegment {
  slug: string;
  title: string;
  category: string;
  summary: string;
  eligibility: string;
  teamSize: string;
  fee: string;
}

export interface FestivalScheduleItem {
  time: string;
  title: string;
  description?: string;
  venue: string;
  segmentSlug?: string;
}

export interface FestivalScheduleDay {
  date: string;
  label: string;
  items: FestivalScheduleItem[];
}

export interface FestivalResult {
  segment: string;
  position: "Champion" | "1st Runner-up" | "2nd Runner-up" | "Special Mention";
  recipient: string;
  institution: string;
}

export interface FestivalOrganization {
  name: string;
  role: string;
  href?: string;
  logo?: ContentImage;
}

export interface Festival {
  slug: string;
  title: string;
  shortTitle: string;
  year: number;
  edition: string;
  theme: string;
  summary: string;
  description: string[];
  startDate: string;
  endDate: string;
  dateLabel: string;
  venue: string;
  venueAddress: string;
  status: FestivalStatus;
  featured: boolean;
  coverImage: ContentImage;
  registration: FestivalRegistration;
  segments: FestivalSegment[];
  schedule: FestivalScheduleDay[];
  results: FestivalResult[];
  resultsNote: string;
  sponsors: FestivalOrganization[];
  partners: FestivalOrganization[];
  gallery: ContentImage[];
  brochure?: ContentLink;
  rulebook?: ContentLink;
}

export type ActivityCategory =
  | "Workshop"
  | "Observation"
  | "Competition"
  | "Outreach"
  | "Seminar";
export type ActivityStatus = "upcoming" | "completed";

export interface Activity {
  slug: string;
  title: string;
  category: ActivityCategory;
  status: ActivityStatus;
  featured: boolean;
  date: string;
  dateLabel: string;
  location: string;
  excerpt: string;
  body: string[];
  image: ContentImage;
  gallery: ContentImage[];
  tags: string[];
  organizers: string[];
  highlights: string[];
  registration?: ContentLink;
  relatedFestivalSlug?: string;
}

export interface MagazineIssue {
  year: number;
  slug: string;
  title: string;
  subtitle: string;
  volume: string;
  publishedAt: string;
  pages: number;
  description: string;
  highlights: string[];
  coverImage: ContentImage;
  featured: boolean;
  readOnline: ContentLink;
  downloadPdf: ContentLink;
}

export interface ExecutiveMember {
  id: string;
  name: string;
  role: string;
  department: string;
  academicClass?: string;
  image: ContentImage;
}

export interface ExecutiveDepartment {
  name: string;
  description: string;
  members: ExecutiveMember[];
}

export interface ExecutivePanel {
  session: string;
  startYear: number;
  endYear: number;
  isCurrent: boolean;
  title: string;
  summary: string;
  moderator: ExecutiveMember;
  advisers: ExecutiveMember[];
  departments: ExecutiveDepartment[];
}

export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  url: string;
  locale: string;
  established: number;
  institution: string;
}
