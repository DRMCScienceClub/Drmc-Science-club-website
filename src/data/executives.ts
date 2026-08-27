import type {
  ContentImage,
  ExecutiveDepartment,
  ExecutiveMember,
  ExecutivePanel,
} from "@/types/content";

type AvatarTone = "navy" | "blue" | "teal" | "slate";

const avatar = (name: string, tone: AvatarTone): ContentImage => ({
  src: `/images/people/avatar-${tone}.svg`,
  alt: `Portrait placeholder for ${name}`,
  width: 480,
  height: 480,
});

const member = (
  id: string,
  name: string,
  role: string,
  department: string,
  tone: AvatarTone,
  academicClass?: string,
): ExecutiveMember => ({
  id,
  name,
  role,
  department,
  academicClass,
  image: avatar(name, tone),
});

const department = (
  name: string,
  description: string,
  members: ExecutiveMember[],
): ExecutiveDepartment => ({ name, description, members });

/**
 * Prototype panel directory. Names are realistic mock content and are not a
 * representation of the club's official office-bearers.
 */
export const executivePanels: readonly ExecutivePanel[] = [
  {
    session: "2026–27",
    startYear: 2026,
    endYear: 2027,
    isCurrent: true,
    title: "Executive Panel 2026–27",
    summary:
      "The current student panel coordinates year-round academic programmes, publications, outreach and the national science festival under faculty guidance.",
    moderator: member(
      "moderator-2026",
      "Md. Rezaul Karim",
      "Club Moderator · Senior Lecturer, Physics",
      "Faculty Leadership",
      "navy",
    ),
    advisers: [
      member(
        "adviser-farhana-2026",
        "Farhana Yasmin",
        "Academic Adviser · Lecturer, Chemistry",
        "Faculty Leadership",
        "teal",
      ),
      member(
        "adviser-mahmud-2026",
        "Mahmudul Hasan",
        "Technical Adviser · Lecturer, ICT",
        "Faculty Leadership",
        "blue",
      ),
    ],
    departments: [
      department(
        "Leadership & Secretariat",
        "Sets the annual direction and keeps the club's teams, records and institutional coordination aligned.",
        [
          member(
            "president-2026",
            "Arham Ahmed",
            "President",
            "Leadership & Secretariat",
            "navy",
            "Class XII",
          ),
          member(
            "vice-president-2026",
            "Nafis Rahman",
            "Vice President",
            "Leadership & Secretariat",
            "blue",
            "Class XII",
          ),
          member(
            "general-secretary-2026",
            "Samiul Bashar",
            "General Secretary",
            "Leadership & Secretariat",
            "teal",
            "Class XII",
          ),
          member(
            "joint-secretary-2026",
            "Rafi Abdullah",
            "Joint Secretary",
            "Leadership & Secretariat",
            "slate",
            "Class XI",
          ),
        ],
      ),
      department(
        "Academic & Research",
        "Designs olympiads, reviews learning resources and helps student ideas become careful investigations.",
        [
          member(
            "academic-secretary-2026",
            "Ayman Kabir",
            "Secretary of Academic Affairs",
            "Academic & Research",
            "blue",
            "Class XII",
          ),
          member(
            "research-coordinator-2026",
            "Zarif Hossain",
            "Research Coordinator",
            "Academic & Research",
            "teal",
            "Class XI",
          ),
          member(
            "olympiad-coordinator-2026",
            "Abrar Mahmud",
            "Olympiad Coordinator",
            "Academic & Research",
            "slate",
            "Class XI",
          ),
        ],
      ),
      department(
        "Innovation & Technology",
        "Runs practical engineering sessions and maintains the digital and technical systems behind club programmes.",
        [
          member(
            "innovation-secretary-2026",
            "Tanzim Fahim",
            "Secretary of Innovation",
            "Innovation & Technology",
            "navy",
            "Class XII",
          ),
          member(
            "robotics-coordinator-2026",
            "Mehedi Hasan",
            "Robotics Coordinator",
            "Innovation & Technology",
            "teal",
            "Class XI",
          ),
          member(
            "it-secretary-2026",
            "Ariyan Chowdhury",
            "IT Secretary",
            "Innovation & Technology",
            "blue",
            "Class XI",
          ),
        ],
      ),
      department(
        "Publications & Communications",
        "Edits the annual magazine and turns club work into clear, responsible public communication.",
        [
          member(
            "publication-secretary-2026",
            "Tahmidul Islam",
            "Publication Secretary",
            "Publications & Communications",
            "navy",
            "Class XII",
          ),
          member(
            "editorial-coordinator-2026",
            "Samin Zaman",
            "Editorial Coordinator",
            "Publications & Communications",
            "slate",
            "Class XI",
          ),
          member(
            "media-secretary-2026",
            "Fardin Noor",
            "Media & Design Secretary",
            "Publications & Communications",
            "teal",
            "Class XI",
          ),
        ],
      ),
      department(
        "Events & Outreach",
        "Plans accessible events, welcomes participating institutions and supports smooth delivery on the ground.",
        [
          member(
            "organizing-secretary-2026",
            "Shadman Sakib",
            "Organizing Secretary",
            "Events & Outreach",
            "blue",
            "Class XII",
          ),
          member(
            "outreach-coordinator-2026",
            "Muhtasim Fuad",
            "Outreach Coordinator",
            "Events & Outreach",
            "teal",
            "Class XI",
          ),
          member(
            "logistics-coordinator-2026",
            "Sadeed Khan",
            "Logistics Coordinator",
            "Events & Outreach",
            "slate",
            "Class XI",
          ),
        ],
      ),
    ],
  },
  {
    session: "2025–26",
    startYear: 2025,
    endYear: 2026,
    isCurrent: false,
    title: "Executive Panel 2025–26",
    summary:
      "The panel behind Innovation Frontier 2025 expanded the club's research mentoring and restarted regular campus skywatch sessions.",
    moderator: member(
      "moderator-2025",
      "Md. Rezaul Karim",
      "Club Moderator · Senior Lecturer, Physics",
      "Faculty Leadership",
      "navy",
    ),
    advisers: [
      member(
        "adviser-farhana-2025",
        "Farhana Yasmin",
        "Academic Adviser · Lecturer, Chemistry",
        "Faculty Leadership",
        "teal",
      ),
      member(
        "adviser-tanvir-2025",
        "Tanvir Ahmed",
        "Programme Adviser · Lecturer, Biology",
        "Faculty Leadership",
        "slate",
      ),
    ],
    departments: [
      department(
        "Leadership & Secretariat",
        "Panel leadership and institutional coordination.",
        [
          member(
            "president-2025",
            "Iftekhar Alam",
            "President",
            "Leadership & Secretariat",
            "navy",
            "Class XII",
          ),
          member(
            "vice-president-2025",
            "Rakibul Haque",
            "Vice President",
            "Leadership & Secretariat",
            "blue",
            "Class XII",
          ),
          member(
            "general-secretary-2025",
            "Adnan Faisal",
            "General Secretary",
            "Leadership & Secretariat",
            "teal",
            "Class XII",
          ),
        ],
      ),
      department(
        "Academic & Research",
        "Olympiad, research mentoring and academic review.",
        [
          member(
            "academic-secretary-2025",
            "Saad Bin Omar",
            "Secretary of Academic Affairs",
            "Academic & Research",
            "blue",
            "Class XII",
          ),
          member(
            "research-coordinator-2025",
            "Arman Hossain",
            "Research Coordinator",
            "Academic & Research",
            "slate",
            "Class XI",
          ),
        ],
      ),
      department(
        "Innovation & Technology",
        "Engineering programmes and digital operations.",
        [
          member(
            "innovation-secretary-2025",
            "Mahin Rahman",
            "Secretary of Innovation",
            "Innovation & Technology",
            "teal",
            "Class XII",
          ),
          member(
            "it-secretary-2025",
            "Nabil Hasan",
            "IT Secretary",
            "Innovation & Technology",
            "navy",
            "Class XI",
          ),
        ],
      ),
      department(
        "Publications & Communications",
        "Magazine, media and visual documentation.",
        [
          member(
            "publication-secretary-2025",
            "Raiyan Ahmed",
            "Publication Secretary",
            "Publications & Communications",
            "blue",
            "Class XII",
          ),
          member(
            "media-secretary-2025",
            "Farhan Kabir",
            "Media Secretary",
            "Publications & Communications",
            "slate",
            "Class XI",
          ),
        ],
      ),
      department(
        "Events & Outreach",
        "Festival operations, logistics and visiting-team support.",
        [
          member(
            "organizing-secretary-2025",
            "Afnan Chowdhury",
            "Organizing Secretary",
            "Events & Outreach",
            "teal",
            "Class XII",
          ),
          member(
            "logistics-coordinator-2025",
            "Sakib Mahmud",
            "Logistics Coordinator",
            "Events & Outreach",
            "navy",
            "Class XI",
          ),
        ],
      ),
    ],
  },
  {
    session: "2024–25",
    startYear: 2024,
    endYear: 2025,
    isCurrent: false,
    title: "Executive Panel 2024–25",
    summary:
      "The tenth-festival panel delivered Cosmic Inquiry 2024 and assembled the club's first consolidated digital activity archive.",
    moderator: member(
      "moderator-2024",
      "Shahidul Alam",
      "Club Moderator · Associate Professor, Physics",
      "Faculty Leadership",
      "navy",
    ),
    advisers: [
      member(
        "adviser-rezaul-2024",
        "Md. Rezaul Karim",
        "Academic Adviser · Senior Lecturer, Physics",
        "Faculty Leadership",
        "blue",
      ),
    ],
    departments: [
      department(
        "Leadership & Secretariat",
        "Panel leadership and club administration.",
        [
          member(
            "president-2024",
            "Samin Rahman",
            "President",
            "Leadership & Secretariat",
            "navy",
            "Class XII",
          ),
          member(
            "general-secretary-2024",
            "Ahnaf Karim",
            "General Secretary",
            "Leadership & Secretariat",
            "teal",
            "Class XII",
          ),
        ],
      ),
      department(
        "Academic & Research",
        "Academic contests, talks and project review.",
        [
          member(
            "academic-secretary-2024",
            "Tasnim Ahmed",
            "Academic Secretary",
            "Academic & Research",
            "blue",
            "Class XII",
          ),
          member(
            "astronomy-coordinator-2024",
            "Nayeem Hasan",
            "Astronomy Coordinator",
            "Academic & Research",
            "slate",
            "Class XI",
          ),
        ],
      ),
      department(
        "Innovation & Technology",
        "Technical exhibits, model-satellite challenge and web archive.",
        [
          member(
            "innovation-secretary-2024",
            "Rifat Hossain",
            "Innovation Secretary",
            "Innovation & Technology",
            "teal",
            "Class XII",
          ),
          member(
            "it-secretary-2024",
            "Ishmam Noor",
            "IT Secretary",
            "Innovation & Technology",
            "navy",
            "Class XI",
          ),
        ],
      ),
      department(
        "Publications & Communications",
        "Anuron and the tenth-edition visual archive.",
        [
          member(
            "publication-secretary-2024",
            "Fahim Abrar",
            "Publication Secretary",
            "Publications & Communications",
            "blue",
            "Class XII",
          ),
        ],
      ),
      department(
        "Events & Outreach",
        "Programme delivery and school liaison.",
        [
          member(
            "organizing-secretary-2024",
            "Zubair Islam",
            "Organizing Secretary",
            "Events & Outreach",
            "slate",
            "Class XII",
          ),
        ],
      ),
    ],
  },
];

export const executiveSessions = executivePanels.map((panel) => panel.session);

export function getCurrentExecutivePanel(): ExecutivePanel | undefined {
  return executivePanels.find((panel) => panel.isCurrent) ?? executivePanels[0];
}

export function getExecutivePanelBySession(
  session: string,
): ExecutivePanel | undefined {
  const normalizedSession = decodeURIComponent(session)
    .trim()
    .replaceAll("-", "–");
  return executivePanels.find((panel) => panel.session === normalizedSession);
}

export function getExecutivePanelByYear(
  year: number | string,
): ExecutivePanel | undefined {
  const parsedYear = typeof year === "string" ? Number.parseInt(year, 10) : year;
  return Number.isFinite(parsedYear)
    ? executivePanels.find(
        (panel) =>
          panel.startYear === parsedYear || panel.endYear === parsedYear,
      )
    : undefined;
}

export function getExecutiveMemberCount(panel: ExecutivePanel): number {
  return panel.departments.reduce(
    (total, currentDepartment) => total + currentDepartment.members.length,
    0,
  );
}
