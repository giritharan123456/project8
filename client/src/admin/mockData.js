// Admin panel seed data.
//
// The live game backend (server/schema.sql) models boards, classes,
// subjects, students/teachers (`players`), worlds/lessons/questions --
// but there's no Chapter or Quiz table yet. Rather than block the admin UI
// on a backend migration, this module seeds realistic content shaped the
// way those still-missing tables *would* look, so every /admin screen is
// fully interactive today and can be re-pointed at real endpoints later
// without changing any page markup (see AdminContext.jsx).
//
// Courses/Chapters/Lessons/Questions/Quizzes are multi-subject: Chemistry
// keeps its curated demo set below, and the other signup subjects
// (Physics, Mathematics, English, Biology, Tamil) get a coherent little
// curriculum derived from their real world templates in content.js, so a
// teacher who registered for Physics sees Physics-branded content instead
// of only Chemistry (see TEACHER_CONTENT below and TeacherContext.jsx's
// subject scoping).
import { WORLD_TEMPLATES_BY_SUBJECT } from "../data/content.js";
//
// STUDENTS/TEACHERS below are kept only as historical reference for the
// shape Admin > Students/Teachers used before they graduated to the real
// `players` table (see AdminContext.jsx's REAL_RESOURCES) - nothing
// imports them anymore.
//
// Assignment relationships (subjects <-> classes/boards, teachers <->
// classes/subjects) are modeled as id arrays (e.g. `subjectIds`) so the
// admin forms can render them as multi-select checklists.

export const SUBJECTS = [
  { id: "SUB-1", name: "Chemistry", icon: "FlaskConical", description: "Core subject powering every world, lesson and battle in LearnQuest.", boardsCount: 6, status: "active" },
  { id: "SUB-2", name: "Physics", icon: "Atom", description: "Motion, force, energy, and electricity -- Motion Meadow through Final Physics Frontier.", boardsCount: 6, status: "active" },
  { id: "SUB-3", name: "Biology", icon: "Dna", description: "Planned expansion subject -- Cell City and Genetics Grove worlds.", boardsCount: 1, status: "draft" },
];

export const STUDENTS = [
  {
    id: "STU-1001", name: "Aarav Mehta", email: "aarav.mehta@example.com", grade: 9, board: "CBSE", level: 14, xp: 2380, coins: 640, status: "active", joinedDate: "2026-01-12",
    completedLessons: [
      { lessonId: "L-1", accuracy: 92, stars: 3, completedAt: "2026-02-01" },
      { lessonId: "L-2", accuracy: 85, stars: 2, completedAt: "2026-02-04" },
      { lessonId: "L-3", accuracy: 78, stars: 2, completedAt: "2026-02-10" },
    ],
    quizAttempts: [
      { quizId: "QZ-1", score: 90, takenAt: "2026-02-02" },
      { quizId: "QZ-2", score: 74, takenAt: "2026-02-11" },
    ],
  },
  {
    id: "STU-1002", name: "Diya Iyer", email: "diya.iyer@example.com", grade: 10, board: "ICSE", level: 21, xp: 4120, coins: 1180, status: "active", joinedDate: "2025-11-03",
    completedLessons: [
      { lessonId: "L-1", accuracy: 96, stars: 3, completedAt: "2025-11-10" },
      { lessonId: "L-2", accuracy: 91, stars: 3, completedAt: "2025-11-14" },
      { lessonId: "L-3", accuracy: 88, stars: 3, completedAt: "2025-11-20" },
      { lessonId: "L-4", accuracy: 82, stars: 2, completedAt: "2025-12-01" },
    ],
    quizAttempts: [
      { quizId: "QZ-1", score: 95, takenAt: "2025-11-11" },
      { quizId: "QZ-2", score: 88, takenAt: "2025-11-21" },
      { quizId: "QZ-3", score: 91, takenAt: "2025-12-02" },
    ],
  },
  {
    id: "STU-1003", name: "Kabir Nair", email: "kabir.nair@example.com", grade: 11, board: "CBSE", level: 9, xp: 1560, coins: 310, status: "inactive", joinedDate: "2026-02-20",
    completedLessons: [{ lessonId: "L-7", accuracy: 65, stars: 1, completedAt: "2026-02-25" }],
    quizAttempts: [{ quizId: "QZ-6", score: 58, takenAt: "2026-02-26" }],
  },
  {
    id: "STU-1004", name: "Ishita Rao", email: "ishita.rao@example.com", grade: 9, board: "TN", level: 17, xp: 2990, coins: 820, status: "active", joinedDate: "2025-09-28",
    completedLessons: [
      { lessonId: "L-7", accuracy: 89, stars: 3, completedAt: "2025-10-05" },
      { lessonId: "L-8", accuracy: 80, stars: 2, completedAt: "2025-10-12" },
    ],
    quizAttempts: [{ quizId: "QZ-6", score: 84, takenAt: "2025-10-06" }],
  },
  {
    id: "STU-1005", name: "Vihaan Shah", email: "vihaan.shah@example.com", grade: 12, board: "CBSE", level: 28, xp: 6100, coins: 2050, status: "active", joinedDate: "2025-08-14",
    completedLessons: [
      { lessonId: "L-1", accuracy: 100, stars: 3, completedAt: "2025-08-20" },
      { lessonId: "L-2", accuracy: 97, stars: 3, completedAt: "2025-08-22" },
      { lessonId: "L-3", accuracy: 94, stars: 3, completedAt: "2025-08-28" },
      { lessonId: "L-4", accuracy: 90, stars: 3, completedAt: "2025-09-02" },
      { lessonId: "L-5", accuracy: 88, stars: 3, completedAt: "2025-09-10" },
    ],
    quizAttempts: [
      { quizId: "QZ-1", score: 99, takenAt: "2025-08-21" },
      { quizId: "QZ-2", score: 93, takenAt: "2025-08-29" },
      { quizId: "QZ-4", score: 87, takenAt: "2025-09-11" },
    ],
  },
  {
    id: "STU-1006", name: "Ananya Pillai", email: "ananya.pillai@example.com", grade: 10, board: "IGCSE", level: 12, xp: 2010, coins: 500, status: "suspended", joinedDate: "2026-03-02",
    completedLessons: [{ lessonId: "L-6", accuracy: 70, stars: 2, completedAt: "2026-03-10" }],
    quizAttempts: [{ quizId: "QZ-3", score: 66, takenAt: "2026-03-11" }],
  },
  {
    id: "STU-1007", name: "Reyansh Gupta", email: "reyansh.gupta@example.com", grade: 11, board: "MH", level: 19, xp: 3450, coins: 970, status: "active", joinedDate: "2025-12-19",
    completedLessons: [
      { lessonId: "L-6", accuracy: 86, stars: 3, completedAt: "2025-12-28" },
      { lessonId: "L-7", accuracy: 79, stars: 2, completedAt: "2026-01-05" },
    ],
    quizAttempts: [
      { quizId: "QZ-3", score: 82, takenAt: "2025-12-29" },
      { quizId: "QZ-5", score: 77, takenAt: "2026-01-06" },
    ],
  },
  {
    id: "STU-1008", name: "Myra Joshi", email: "myra.joshi@example.com", grade: 9, board: "ICSE", level: 6, xp: 780, coins: 150, status: "active", joinedDate: "2026-04-01",
    completedLessons: [{ lessonId: "L-1", accuracy: 60, stars: 1, completedAt: "2026-04-05" }],
    quizAttempts: [{ quizId: "QZ-1", score: 55, takenAt: "2026-04-06" }],
  },
  {
    id: "STU-1009", name: "Arjun Verma", email: "arjun.verma@example.com", grade: 12, board: "IB", level: 24, xp: 5230, coins: 1640, status: "active", joinedDate: "2025-10-07",
    completedLessons: [
      { lessonId: "L-2", accuracy: 93, stars: 3, completedAt: "2025-10-15" },
      { lessonId: "L-3", accuracy: 90, stars: 3, completedAt: "2025-10-22" },
      { lessonId: "L-4", accuracy: 85, stars: 2, completedAt: "2025-11-01" },
    ],
    quizAttempts: [
      { quizId: "QZ-2", score: 89, takenAt: "2025-10-23" },
      { quizId: "QZ-4", score: 81, takenAt: "2025-11-02" },
    ],
  },
  {
    id: "STU-1010", name: "Saanvi Desai", email: "saanvi.desai@example.com", grade: 10, board: "CBSE", level: 15, xp: 2670, coins: 690, status: "inactive", joinedDate: "2026-01-30",
    completedLessons: [{ lessonId: "L-5", accuracy: 75, stars: 2, completedAt: "2026-02-08" }],
    quizAttempts: [{ quizId: "QZ-2", score: 70, takenAt: "2026-02-09" }],
  },
];

export const TEACHERS = [
  { id: "TCH-201", name: "Priya Subramaniam", email: "priya.s@learnquest.edu", subjectIds: ["SUB-1"], boardIds: ["CBSE", "ICSE"], classIds: ["9", "10"], status: "active", joinedDate: "2024-06-01" },
  { id: "TCH-202", name: "Rahul Krishnan", email: "rahul.k@learnquest.edu", subjectIds: ["SUB-1"], boardIds: ["TN", "MH"], classIds: ["11", "12"], status: "active", joinedDate: "2024-08-15" },
  { id: "TCH-203", name: "Emily Fernandes", email: "emily.f@learnquest.edu", subjectIds: ["SUB-1"], boardIds: ["IB", "IGCSE"], classIds: ["11", "12"], status: "active", joinedDate: "2025-01-20" },
  { id: "TCH-204", name: "Sanjay Bhatt", email: "sanjay.b@learnquest.edu", subjectIds: ["SUB-2"], boardIds: ["CBSE"], classIds: ["9", "10"], status: "inactive", joinedDate: "2024-03-11" },
  { id: "TCH-205", name: "Meera Chandran", email: "meera.c@learnquest.edu", subjectIds: ["SUB-1"], boardIds: ["CBSE", "TN"], classIds: ["9", "10", "11"], status: "active", joinedDate: "2025-05-06" },
  { id: "TCH-206", name: "Devansh Kulkarni", email: "devansh.k@learnquest.edu", subjectIds: ["SUB-3"], boardIds: ["ICSE"], classIds: ["9", "10"], status: "active", joinedDate: "2025-09-02" },
];

// Admin console accounts (super admins, admins, support staff) -- distinct
// from TEACHERS/STUDENTS above, which are the people using the *product*.
// Not modeled in server/schema.sql yet, same as the rest of this file (see
// header comment): this is the seed for the /admin/admin-users screen.
export const ADMIN_USERS = [
  {
    id: "ADM-001",
    name: "Ananya Rao",
    email: "ananya.rao@learnquest.edu",
    role: "Super Admin",
    permissions: ["Content", "People", "Reports", "Settings"],
    status: "active",
    lastLogin: "2026-09-02",
  },
  {
    id: "ADM-002",
    name: "Vikram Nair",
    email: "vikram.nair@learnquest.edu",
    role: "Admin",
    permissions: ["Content", "People"],
    status: "active",
    lastLogin: "2026-08-29",
  },
  {
    id: "ADM-003",
    name: "Sara Thomas",
    email: "sara.thomas@learnquest.edu",
    role: "Support",
    permissions: ["People"],
    status: "active",
    lastLogin: "2026-08-15",
  },
  {
    id: "ADM-004",
    name: "Karthik Iyer",
    email: "karthik.iyer@learnquest.edu",
    role: "Admin",
    permissions: ["Content", "Reports"],
    status: "inactive",
    lastLogin: "2026-06-30",
  },
  {
    id: "ADM-005",
    name: "Divya Menon",
    email: "divya.menon@learnquest.edu",
    role: "Support",
    permissions: ["People", "Reports"],
    status: "suspended",
    lastLogin: "2026-04-11",
  },
];

export const BOARDS = [
  { id: "CBSE", name: "CBSE", type: "Central Board", category: "Central Boards", description: "NCERT-aligned Chemistry, followed nationwide.", courses: 14, lessons: 78, icon: "Landmark", subjectIds: ["SUB-1", "SUB-2"], status: "active" },
  { id: "ICSE", name: "ICSE", type: "Central Board", category: "Central Boards", description: "In-depth, application-focused Chemistry curriculum.", courses: 15, lessons: 82, icon: "ScrollText", subjectIds: ["SUB-1", "SUB-3"], status: "active" },
  { id: "TN", name: "Tamil Nadu State Board", type: "State Board", category: "State Boards", description: "Chemistry curriculum set by the Tamil Nadu board.", courses: 13, lessons: 70, icon: "MapPinned", subjectIds: ["SUB-1"], status: "active" },
  { id: "MH", name: "Maharashtra State Board", type: "State Board", category: "State Boards", description: "Chemistry curriculum set by the Maharashtra board.", courses: 13, lessons: 68, icon: "MapPinned", subjectIds: ["SUB-1"], status: "active" },
  { id: "IB", name: "IB", type: "International Board", category: "International Boards", description: "Inquiry-based Chemistry for the IB Diploma pathway.", courses: 16, lessons: 90, icon: "Globe2", subjectIds: ["SUB-1"], status: "active" },
  { id: "IGCSE", name: "IGCSE", type: "International Board", category: "International Boards", description: "Cambridge-aligned Chemistry for IGCSE students.", courses: 15, lessons: 84, icon: "Globe2", subjectIds: ["SUB-1"], status: "draft" },
];

export const CLASSES = [
  { id: "4", grade: 4, icon: "Sprout", courses: 6, lessons: 28, questions: 180, difficultyLabel: "Foundation", subjectIds: ["SUB-1"] },
  { id: "5", grade: 5, icon: "Leaf", courses: 7, lessons: 34, questions: 220, difficultyLabel: "Foundation", subjectIds: ["SUB-1"] },
  { id: "6", grade: 6, icon: "Beaker", courses: 8, lessons: 42, questions: 300, difficultyLabel: "Foundation \u2192 Beginner", subjectIds: ["SUB-1"] },
  { id: "7", grade: 7, icon: "TestTube", courses: 9, lessons: 48, questions: 360, difficultyLabel: "Beginner", subjectIds: ["SUB-1"] },
  { id: "8", grade: 8, icon: "Microscope", courses: 10, lessons: 55, questions: 430, difficultyLabel: "Beginner \u2192 Intermediate", subjectIds: ["SUB-1"] },
  { id: "9", grade: 9, icon: "FlaskConical", courses: 12, lessons: 65, questions: 520, difficultyLabel: "Beginner \u2192 Intermediate", subjectIds: ["SUB-1", "SUB-2"] },
  { id: "10", grade: 10, icon: "TestTubes", courses: 14, lessons: 78, questions: 640, difficultyLabel: "Intermediate", subjectIds: ["SUB-1", "SUB-2", "SUB-3"] },
  { id: "11", grade: 11, icon: "Atom", courses: 16, lessons: 92, questions: 810, difficultyLabel: "Intermediate \u2192 Advanced", subjectIds: ["SUB-1"] },
  { id: "12", grade: 12, icon: "Orbit", courses: 18, lessons: 104, questions: 940, difficultyLabel: "Advanced", subjectIds: ["SUB-1"] },
];

export const BASE_COURSES = [
  { id: "atom-valley", name: "Atom Valley", topic: "Structure of the Atom", icon: "Atom", boss: "Proton Guardian", subject: "Chemistry", grade: 9, isFinal: false, sortOrder: 1, status: "published" },
  { id: "molecule-forest", name: "Molecule Forest", topic: "Molecules & Compounds", icon: "Trees", boss: "Molecule Monster", subject: "Chemistry", grade: 9, isFinal: false, sortOrder: 2, status: "published" },
  { id: "bonding-cave", name: "Bonding Cave", topic: "Chemical Bonding", icon: "Link2", boss: "Bond Breaker", subject: "Chemistry", grade: 10, isFinal: false, sortOrder: 3, status: "published" },
  { id: "reaction-volcano", name: "Reaction Volcano", topic: "Chemical Reactions", icon: "Flame", boss: "Magma Reactant", subject: "Chemistry", grade: 10, isFinal: false, sortOrder: 4, status: "published" },
  { id: "acid-base-island", name: "Acid Base Island", topic: "Acids, Bases & Salts", icon: "Waves", boss: "pH Phantom", subject: "Chemistry", grade: 11, isFinal: false, sortOrder: 5, status: "published" },
  { id: "final-chemistry-kingdom", name: "Final Chemistry Kingdom", topic: "Final Mastery Challenge", icon: "Castle", boss: "The Alchemist King", subject: "Chemistry", grade: 12, isFinal: true, sortOrder: 6, status: "published" },
];

export const BASE_CHAPTERS = [
  { id: "CH-1", courseId: "atom-valley", title: "Atomic Foundations", description: "Atoms, structure and the particles that make them up.", lessonsCount: 3, sortOrder: 1, status: "published" },
  { id: "CH-2", courseId: "atom-valley", title: "Isotopes & Models", description: "Isotopes and the historical models of the atom.", lessonsCount: 2, sortOrder: 2, status: "published" },
  { id: "CH-3", courseId: "molecule-forest", title: "Molecules & Formulas", description: "Compounds, mixtures and molecular formulas.", lessonsCount: 3, sortOrder: 1, status: "published" },
  { id: "CH-4", courseId: "molecule-forest", title: "Naming & Molar Mass", description: "Naming compounds and computing molar mass.", lessonsCount: 2, sortOrder: 2, status: "published" },
  { id: "CH-5", courseId: "bonding-cave", title: "Bond Types", description: "Ionic, covalent and metallic bonding.", lessonsCount: 3, sortOrder: 1, status: "published" },
  { id: "CH-6", courseId: "reaction-volcano", title: "Reactions & Rates", description: "Reaction types, balancing and reaction rates.", lessonsCount: 3, sortOrder: 1, status: "draft" },
  { id: "CH-7", courseId: "acid-base-island", title: "Acids & Bases Basics", description: "Core concepts of acidity, basicity and the pH scale.", lessonsCount: 2, sortOrder: 1, status: "published" },
];

export const BASE_LESSONS = [
  { id: "L-1", chapterId: "CH-1", title: "Introduction to Atoms", description: "What atoms are and why everything is made of them.", board: "CBSE", sortOrder: 1, status: "published" },
  { id: "L-2", chapterId: "CH-1", title: "Atomic Structure", description: "Protons, neutrons, and electrons \u2014 the anatomy of an atom.", board: "CBSE", sortOrder: 2, status: "published" },
  { id: "L-3", chapterId: "CH-1", title: "Electron Configuration", description: "How electrons fill shells and why it matters.", board: "CBSE", sortOrder: 3, status: "published" },
  { id: "L-4", chapterId: "CH-2", title: "Isotopes", description: "Same element, different mass \u2014 what makes an isotope.", board: "CBSE", sortOrder: 1, status: "published" },
  { id: "L-5", chapterId: "CH-2", title: "Atomic Models", description: "From Dalton to Bohr \u2014 how our picture of the atom evolved.", board: "CBSE", sortOrder: 2, status: "published" },
  { id: "L-6", chapterId: "CH-3", title: "Introduction to Molecules", description: "How atoms combine to form molecules.", board: "CBSE", sortOrder: 1, status: "published" },
  { id: "L-7", chapterId: "CH-7", title: "Acids, Bases and Salts", description: "The Tamil Nadu Board's framing of everyday acids and bases.", board: "TN", sortOrder: 1, status: "published" },
  { id: "L-8", chapterId: "CH-7", title: "Indicators in Daily Life", description: "Turmeric, litmus, and other indicators used on household liquids.", board: "TN", sortOrder: 2, status: "draft" },
];

export const BASE_QUESTIONS = [
  { id: "Q-1", lessonId: "L-1", difficulty: "easy", type: "mcq", questionText: "Which subatomic particle carries a negative charge?", correctAnswer: "Electron", explanation: "Electrons are negatively charged and occupy shells around the nucleus.", status: "published" },
  { id: "Q-2", lessonId: "L-2", difficulty: "easy", type: "mcq", questionText: "What is found inside the nucleus of an atom?", correctAnswer: "Protons and neutrons", explanation: "The nucleus holds the positively charged protons and neutral neutrons.", status: "published" },
  { id: "Q-3", lessonId: "L-2", difficulty: "medium", type: "mcq", questionText: "The atomic number of an element equals its number of:", correctAnswer: "Protons", explanation: "Atomic number is defined as the count of protons in the nucleus.", status: "published" },
  { id: "Q-4", lessonId: "L-4", difficulty: "medium", type: "fill_blank", questionText: "Isotopes of an element have the same number of protons but different numbers of ____.", correctAnswer: "neutrons", explanation: "Isotopes vary in neutron count, which changes their mass number.", status: "published" },
  { id: "Q-5", lessonId: "L-5", difficulty: "hard", type: "sequence", questionText: "Order the atomic models from earliest to most recent.", correctAnswer: "Dalton, Thomson, Rutherford, Bohr", explanation: "The atomic model evolved through these four milestones.", status: "draft" },
  { id: "Q-6", lessonId: "L-7", difficulty: "easy", type: "mcq", questionText: "Which of these is a common household acid?", correctAnswer: "Tamarind", explanation: "Tamarind contains tartaric acid, a mild household acid.", status: "published" },
  { id: "Q-7", lessonId: "L-6", difficulty: "expert", type: "match_following", questionText: "Match each compound to its molecular formula.", correctAnswer: "Water-H2O, Salt-NaCl", explanation: "Matches common compounds to their correct chemical formulas.", status: "published" },
];

export const BASE_QUIZZES = [
  { id: "QZ-1", title: "Atom Valley \u2014 Easy Warm-up", courseId: "atom-valley", difficulty: "easy", questionCount: 10, timeLimitMin: 8, status: "published" },
  { id: "QZ-2", title: "Atomic Structure Deep Dive", courseId: "atom-valley", difficulty: "hard", questionCount: 15, timeLimitMin: 15, status: "published" },
  { id: "QZ-3", title: "Molecule Forest Checkpoint", courseId: "molecule-forest", difficulty: "medium", questionCount: 12, timeLimitMin: 10, status: "published" },
  { id: "QZ-4", title: "Bonding Cave Boss Prep", courseId: "bonding-cave", difficulty: "expert", questionCount: 20, timeLimitMin: 20, status: "draft" },
  { id: "QZ-5", title: "Reaction Volcano Speed Round", courseId: "reaction-volcano", difficulty: "medium", questionCount: 10, timeLimitMin: 6, status: "published" },
  { id: "QZ-6", title: "Acid Base Island Mastery Test", courseId: "acid-base-island", difficulty: "hard", questionCount: 18, timeLimitMin: 18, status: "published" },
];

// --- Multi-subject curriculum (Section 3 teacher signup) ----------------
//
// Chemistry keeps its curated demo set above. For every other signup
// subject we derive a small, coherent course set straight from that
// subject's real world template in content.js (same world names, topics,
// icons and bosses a student would actually meet), plus matching chapters,
// lessons, questions and quizzes. So a teacher who registered for Physics
// gets Physics-branded curriculum pages instead of always seeing Chemistry.
const SUBJECT_TEMPLATE_CODES = {
  Physics: "PHY",
  Mathematics: "MATH",
  English: "ENG",
  Biology: "BIO",
  Tamil: "TAM",
};

function buildSubjectCurriculum() {
  const courses = [];
  const chapters = [];
  const lessons = [];
  const questions = [];
  const quizzes = [];

  for (const [subjectName, code] of Object.entries(SUBJECT_TEMPLATE_CODES)) {
    const template = WORLD_TEMPLATES_BY_SUBJECT[code] ?? [];
    template.forEach((world, i) => {
      const grade = world.isFinal ? 12 : 9 + Math.min(3, Math.floor(i / 2));
      courses.push({
        id: world.id,
        name: world.name,
        topic: world.topic,
        icon: world.icon ?? "Map",
        boss: world.boss ?? world.topic,
        subject: subjectName,
        grade,
        isFinal: !!world.isFinal,
        sortOrder: i + 1,
        status: "published",
      });

      ["Foundations", "Challenges"].forEach((part, ci) => {
        const chapterId = `${world.id}-ch${ci + 1}`;
        chapters.push({
          id: chapterId,
          courseId: world.id,
          title: `${world.name} \u2014 ${part}`,
          description: `Core concepts in ${world.topic}, applied through ${subjectName.toLowerCase()} missions.`,
          lessonsCount: 2,
          sortOrder: ci + 1,
          status: "published",
        });

        ["Core Concepts", "Practice Round"].forEach((label, li) => {
          const lessonId = `${chapterId}-l${li + 1}`;
          lessons.push({
            id: lessonId,
            chapterId,
            title: `${world.name}: ${label}`,
            description: `Playful practice on ${world.topic} from ${world.name}.`,
            board: "CBSE",
            sortOrder: li + 1,
            status: "published",
          });

          [
            { difficulty: "easy", type: "mcq", correctAnswer: world.topic, text: `Which topic does "${world.name}" explore?` },
            { difficulty: "medium", type: "true_false", correctAnswer: "True", text: `True or False: "${world.name}" covers ${world.topic}.` },
          ].forEach((qq, qIdx) => {
            questions.push({
              id: `${lessonId}-q${qIdx + 1}`,
              lessonId,
              difficulty: qq.difficulty,
              type: qq.type,
              questionText: qq.text,
              correctAnswer: qq.correctAnswer,
              explanation: `${qq.correctAnswer} \u2014 reinforced in ${world.name}.`,
              status: "published",
            });
          });
        });
      });

      ["Warm-up Checkpoint", "Mastery Test"].forEach((label, zi) => {
        quizzes.push({
          id: `${world.id}-qz${zi + 1}`,
          title: `${world.name} \u2014 ${label}`,
          courseId: world.id,
          difficulty: zi === 0 ? "easy" : "hard",
          questionCount: zi === 0 ? 8 : 12,
          timeLimitMin: zi === 0 ? 8 : 15,
          status: "published",
        });
      });
    });
  }

  return { courses, chapters, lessons, questions, quizzes };
}

const DERIVED = buildSubjectCurriculum();

export const COURSES = [...BASE_COURSES, ...DERIVED.courses];
export const CHAPTERS = [...BASE_CHAPTERS, ...DERIVED.chapters];
export const LESSONS = [...BASE_LESSONS, ...DERIVED.lessons];
export const QUESTIONS = [...BASE_QUESTIONS, ...DERIVED.questions];
export const QUIZZES = [...BASE_QUIZZES, ...DERIVED.quizzes];
