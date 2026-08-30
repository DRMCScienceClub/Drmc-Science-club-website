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
 * The 2024–25 record is also transcribed from its supplied signed notice.
 * College numbers, phone numbers, shifts, signatures, and other private
 * administrative details are intentionally not published.
 */
export const executivePanels: readonly ExecutivePanel[] = ([
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
    recordStatus: "official-document",
    title: "Executive Panel 2024–25",
    summary:
      "The supplied committee notice names 15 Class XII student officers for the 2024–25 session. The notice also respectfully remembers Mohammad Farhanul Islam Bhuiyan, a martyr of the Anti-Discrimination Student Movement.",
    groupImage: {
      src: "/images/executives/executive-panel-2024-25.jpg",
      alt: "Members of the DRMC Science Club 2024–25 executive panel standing together on campus",
      width: 2048,
      height: 1365,
    },
    moderator: member(
      "moderator-2024-25",
      "A.K.M. Badrul Hasan",
      "Moderator · DRMC Science Club",
      "Faculty Guidance",
      "navy",
    ),
    advisers: [],
    institutionalLeadership: [
      member(
        "chief-club-coordinator-2024-25",
        "Md. Jahedul Hoque",
        "Chief Club Co-Ordinator · Dhaka Residential Model College",
        "Institutional Leadership",
        "teal",
      ),
      member(
        "principal-2024-25",
        "Brig. Gen. Mohammed Zaber Hossain, PhD",
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
            "president-2024-25",
            "Ferdous Ahmed Fahad",
            "President",
            "Executive Committee",
            "navy",
            "Class XII",
          ),
          member(
            "general-secretary-2024-25",
            "Ahnaf Tahmid Uddin",
            "General Secretary",
            "Executive Committee",
            "teal",
            "Class XII",
          ),
          member(
            "vice-president-day-2024-25",
            "Mahir Ishraq Rojin",
            "Vice-President (Day)",
            "Executive Committee",
            "blue",
            "Class XII",
          ),
          member(
            "vice-president-morning-2024-25",
            "Rakibul Islam",
            "Vice-President (Morning)",
            "Executive Committee",
            "slate",
            "Class XII",
          ),
          member(
            "joint-secretary-2024-25",
            "Md. Saimum Islam",
            "Joint Secretary",
            "Executive Committee",
            "navy",
            "Class XII",
          ),
          member(
            "organizing-secretary-2024-25",
            "Rejoan Ahmed Rahad",
            "Organizing Secretary",
            "Executive Committee",
            "teal",
            "Class XII",
          ),
          member(
            "office-secretary-2024-25",
            "Allen Zaman",
            "Office Secretary",
            "Executive Committee",
            "blue",
            "Class XII",
          ),
          member(
            "treasurer-2024-25",
            "Muhammad Yaseen Khan",
            "Treasurer",
            "Executive Committee",
            "slate",
            "Class XII",
          ),
          member(
            "publication-secretary-2024-25",
            "Kazi Fairaz Kabir",
            "Publication Secretary",
            "Executive Committee",
            "navy",
            "Class XII",
          ),
          member(
            "wall-magazine-secretary-2024-25",
            "Md. Tahsin Abid",
            "Wall Magazine Secretary",
            "Executive Committee",
            "teal",
            "Class XII",
          ),
          member(
            "robotics-secretary-2024-25",
            "Fahmid Mustakim",
            "Robotics Secretary",
            "Executive Committee",
            "blue",
            "Class XII",
          ),
          member(
            "olympiad-secretary-2024-25",
            "Abdullah Ath Tameem",
            "Olympiad Secretary",
            "Executive Committee",
            "slate",
            "Class XII",
          ),
          member(
            "quizzing-secretary-2024-25",
            "Saundipan Saha",
            "Quizzing Secretary",
            "Executive Committee",
            "navy",
            "Class XII",
          ),
          member(
            "human-resource-secretary-2024-25",
            "Mahbubur Rahman Alif",
            "Human Resource Secretary",
            "Executive Committee",
            "teal",
            "Class XII",
          ),
          member(
            "external-affairs-secretary-2024-25",
            "Suborno Bhowmik",
            "External Affairs Secretary",
            "Executive Committee",
            "blue",
            "Class XII",
          ),
        ],
      ),
    ],
  },
] satisfies readonly ExecutivePanel[]).toSorted(
  (first, second) =>
    second.endYear - first.endYear || second.startYear - first.startYear,
);

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
