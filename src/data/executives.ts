import type {
  ContentImage,
  ExecutiveDepartment,
  ExecutiveMember,
  ExecutivePanel,
} from "@/types/content";

type AvatarTone = "navy" | "blue" | "teal" | "slate";

const avatar = (name: string, tone: AvatarTone): ContentImage => ({
  src: `/images/people/avatar-${tone}.svg`,
  alt: `Portrait placeholder; no individual photograph supplied for ${name}`,
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
 * The 2025–26 record is transcribed from the supplied signed committee notice.
 * Earlier sessions remain clearly marked prototype records until an approved
 * archive is supplied. College numbers, shifts, and signatures are not
 * published from the source notice.
 */
export const executivePanels: readonly ExecutivePanel[] = [
  {
    session: "2025–26",
    startYear: 2025,
    endYear: 2026,
    isCurrent: true,
    recordStatus: "official-document",
    title: "Executive Panel 2025–26",
    summary:
      "The latest supplied committee notice names 13 student officers for the 2025–26 session and states that the panel's tenure continues until the HSC 2026 examination.",
    groupImage: {
      src: "/images/executives/executive-panel-2025-26.jpg",
      alt: "Thirteen members of the DRMC Science Club 2025–26 executive panel standing at the college gate",
      width: 2048,
      height: 1192,
    },
    moderator: member(
      "moderator-2025-26",
      "A.K.M. Badrul Hasan",
      "Moderator · DRMC Science Club",
      "Faculty Guidance",
      "navy",
    ),
    advisers: [],
    institutionalLeadership: [
      member(
        "chief-club-coordinator-2025-26",
        "Md. Jahedul Haque",
        "Chief Club Co-Ordinator · Dhaka Residential Model College",
        "Institutional Leadership",
        "teal",
      ),
      member(
        "principal-2025-26",
        "Brig. Gen. Md. Zaber Hossain, PhD",
        "Principal · Dhaka Residential Model College",
        "Institutional Leadership",
        "blue",
      ),
    ],
    departments: [
      department(
        "Executive Committee",
        "Official designations are presented in the order published in the supplied committee notice; the notice does not define departmental divisions.",
        [
          member(
            "president-2025-26",
            "Rasheeq Raiyan Proyash",
            "President",
            "Executive Committee",
            "navy",
            "Class XII",
          ),
          member(
            "general-secretary-2025-26",
            "Rubaiyat E Tasin",
            "General Secretary",
            "Executive Committee",
            "teal",
            "Class XII",
          ),
          member(
            "vice-president-day-2025-26",
            "Mohammad Araf Rahman",
            "Vice-President (Day)",
            "Executive Committee",
            "blue",
            "Class XII",
          ),
          member(
            "vice-president-morning-2025-26",
            "Naveen Azmain Huq",
            "Vice-President (Morning)",
            "Executive Committee",
            "slate",
            "Class XII",
          ),
          member(
            "joint-secretary-2025-26",
            "Ariq Arko",
            "Joint Secretary",
            "Executive Committee",
            "navy",
            "Class XII",
          ),
          member(
            "organizing-secretary-2025-26",
            "Farjad Alif",
            "Organizing Secretary",
            "Executive Committee",
            "teal",
            "Class XII",
          ),
          member(
            "office-secretary-2025-26",
            "S.M. Mushfiq Rahman Araf",
            "Office Secretary",
            "Executive Committee",
            "blue",
            "Class XII",
          ),
          member(
            "publication-secretary-2025-26",
            "Ahmed Ragib Jamil Shashawto",
            "Publication Secretary",
            "Executive Committee",
            "slate",
            "Class XII",
          ),
          member(
            "treasurer-2025-26",
            "Samin Ibne Zaman",
            "Treasurer",
            "Executive Committee",
            "navy",
            "Class XII",
          ),
          member(
            "quizzing-secretary-2025-26",
            "Md. Tahmid Bin Saif",
            "Quizzing Secretary",
            "Executive Committee",
            "teal",
            "Class XII",
          ),
          member(
            "olympiad-secretary-2025-26",
            "Md. Inan Ibn Iqbal Spondon",
            "Olympiad Secretary",
            "Executive Committee",
            "blue",
            "Class XII",
          ),
          member(
            "human-resource-secretary-2025-26",
            "Saifullah Faruk Shafin",
            "Human Resource Secretary",
            "Executive Committee",
            "slate",
            "Class XII",
          ),
          member(
            "external-affairs-secretary-2025-26",
            "Nahian Karim",
            "External Affairs Secretary",
            "Executive Committee",
            "navy",
            "Class XII",
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
    recordStatus: "prototype",
    title: "Executive Panel 2024–25",
    summary:
      "This prototype archive record demonstrates how a past committee can preserve its programme work and contribution to the club's digital activity archive.",
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
        "Aurora and the tenth-edition visual archive.",
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
