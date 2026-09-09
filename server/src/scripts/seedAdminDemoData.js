// Populates the Admin-panel-facing tables that npm run seed doesn't touch:
// schools, sections, demo students/teachers (players), which subjects each
// board/class offers (board_subjects / class_subjects), chapters (grouping
// a couple of worlds' existing lessons), and admin_users (the Admin >
// Admin Users roster - real rows now that migration 008 created the
// table, previously only in client/src/admin/mockData.js).
//
// Safe to re-run: TRUNCATEs everything this script owns first (in FK-safe
// order), then re-inserts. Does NOT touch curriculum tables (subjects,
// boards, worlds, lessons, questions, etc.) - run `npm run seed` first if
// those are empty.
//
//   npm run seed:admin
//
// Demo login for every seeded student/teacher: password "demo1234".

require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const { hashPassword } = require("../lib/password");

const DEMO_PASSWORD = "demo1234";

async function run() {
  const conn = await pool.getConnection();
  try {
    console.log("Clearing existing admin-demo tables...");
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    for (const table of [
      "teacher_sections",
      "teacher_classes",
      "teacher_boards",
      "teacher_subjects",
      "class_subjects",
      "board_subjects",
      "admin_users",
    ]) {
      await conn.query(`TRUNCATE TABLE ${table}`);
    }
    // Demo players/sections/schools specifically (id-scoped, not a blanket
    // TRUNCATE - a real signed-up account could exist in the same table).
    await conn.query("DELETE FROM players WHERE email LIKE '%@demo.learnquest.gg'");
    const [oldDemoSchools] = await conn.query("SELECT id FROM schools WHERE normalized_name LIKE '%(demo)%'");
    const oldDemoSchoolIds = oldDemoSchools.map((r) => r.id);
    if (oldDemoSchoolIds.length > 0) {
      await conn.query(`DELETE FROM sections WHERE school_id IN (${oldDemoSchoolIds.map(() => "?").join(",")})`, oldDemoSchoolIds);
      await conn.query(`DELETE FROM schools WHERE id IN (${oldDemoSchoolIds.map(() => "?").join(",")})`, oldDemoSchoolIds);
    }
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    // --- board_subjects / class_subjects ("Subjects Offered") -------------
    console.log("Seeding board_subjects / class_subjects...");
    const [subjectRows] = await conn.query("SELECT code, status FROM subjects");
    const [boardRows] = await conn.query("SELECT code FROM boards");
    const [classRows] = await conn.query("SELECT grade FROM classes");
    // Every board offers every "active" subject; "coming_soon" subjects are
    // left off (mirrors the app not routing into content that isn't built).
    const activeSubjects = subjectRows.filter((s) => s.status === "active").map((s) => s.code);
    for (const b of boardRows) {
      for (const code of activeSubjects) {
        await conn.query("INSERT IGNORE INTO board_subjects (board_code, subject_code) VALUES (?,?)", [b.code, code]);
      }
    }
    for (const c of classRows) {
      for (const code of activeSubjects) {
        await conn.query("INSERT IGNORE INTO class_subjects (grade, subject_code) VALUES (?,?)", [c.grade, code]);
      }
    }

    // --- schools ------------------------------------------------------------
    console.log("Seeding demo schools...");
    const schoolDefs = [
      "Pallet Town High School (Demo)",
      "Cerulean City Academy (Demo)",
      "Saffron International School (Demo)",
    ];
    const schoolIds = {};
    for (const name of schoolDefs) {
      const [result] = await conn.query(
        "INSERT INTO schools (name, normalized_name) VALUES (?, ?)",
        [name, name.trim().toLowerCase()]
      );
      schoolIds[name] = result.insertId;
    }

    // --- sections -------------------------------------------------------
    console.log("Seeding demo sections...");
    const sectionDefs = [
      { school: schoolDefs[0], board: "CBSE", grade: 9, name: "A" },
      { school: schoolDefs[0], board: "CBSE", grade: 9, name: "B" },
      { school: schoolDefs[0], board: "CBSE", grade: 10, name: "A" },
      { school: schoolDefs[1], board: "ICSE", grade: 8, name: "A" },
      { school: schoolDefs[2], board: "IB", grade: 11, name: "A" },
    ];
    const sectionIds = {}; // keyed "school|board|grade|name"
    for (const [i, s] of sectionDefs.entries()) {
      const [result] = await conn.query(
        "INSERT INTO sections (school_id, board_code, grade, name, sort_order) VALUES (?,?,?,?,?)",
        [schoolIds[s.school], s.board, s.grade, s.name, i]
      );
      sectionIds[`${s.school}|${s.board}|${s.grade}|${s.name}`] = result.insertId;
    }

    // --- demo students ----------------------------------------------------
    console.log("Seeding demo students...");
    const passwordHash = await hashPassword(DEMO_PASSWORD);
    const students = [
      { name: "Aarav Sharma", email: "aarav.sharma@demo.learnquest.gg", school: schoolDefs[0], board: "CBSE", grade: "9", section: "A", status: "active", level: 14, xp: 1240, coins: 620 },
      { name: "Diya Patel", email: "diya.patel@demo.learnquest.gg", school: schoolDefs[0], board: "CBSE", grade: "9", section: "A", status: "active", level: 9, xp: 780, coins: 340 },
      { name: "Kabir Singh", email: "kabir.singh@demo.learnquest.gg", school: schoolDefs[0], board: "CBSE", grade: "9", section: "B", status: "active", level: 11, xp: 990, coins: 410 },
      { name: "Meera Nair", email: "meera.nair@demo.learnquest.gg", school: schoolDefs[0], board: "CBSE", grade: "10", section: "A", status: "active", level: 18, xp: 2150, coins: 890 },
      { name: "Rohan Verma", email: "rohan.verma@demo.learnquest.gg", school: schoolDefs[0], board: "CBSE", grade: "10", section: "A", status: "inactive", level: 6, xp: 320, coins: 150 },
      { name: "Ishita Rao", email: "ishita.rao@demo.learnquest.gg", school: schoolDefs[1], board: "ICSE", grade: "8", section: "A", status: "active", level: 8, xp: 640, coins: 280 },
      { name: "Arjun Menon", email: "arjun.menon@demo.learnquest.gg", school: schoolDefs[1], board: "ICSE", grade: "8", section: "A", status: "suspended", level: 4, xp: 190, coins: 60 },
      { name: "Sanya Kapoor", email: "sanya.kapoor@demo.learnquest.gg", school: schoolDefs[1], board: "ICSE", grade: "8", section: null, status: "active", level: 12, xp: 1050, coins: 470 },
      { name: "Vivaan Iyer", email: "vivaan.iyer@demo.learnquest.gg", school: schoolDefs[2], board: "IB", grade: "11", section: "A", status: "active", level: 21, xp: 3020, coins: 1150 },
      { name: "Ananya Das", email: "ananya.das@demo.learnquest.gg", school: schoolDefs[2], board: "IB", grade: "11", section: "A", status: "active", level: 16, xp: 1780, coins: 720 },
    ];
    for (const s of students) {
      const sectionId = s.section ? sectionIds[`${s.school}|${s.board}|${s.grade}|${s.section}`] ?? null : null;
      await conn.query(
        `INSERT INTO players
          (id, name, email, password_hash, role, status, level, coins, xp, total_xp_earned, streak,
           current_grade, current_board, current_subject, school_name, school_id, section_id, language)
         VALUES (?,?,?,?, 'STUDENT', ?, ?, ?, ?, ?, ?, ?, ?, 'chemistry', ?, ?, ?, 'en')`,
        [
          uuidv4(), s.name, s.email, passwordHash, s.status, s.level, s.coins, s.xp, s.xp, Math.floor(s.xp / 200),
          s.grade, s.board, s.school, schoolIds[s.school], sectionId,
        ]
      );
    }

    // --- demo teachers ------------------------------------------------------
    console.log("Seeding demo teachers...");
    const teachers = [
      {
        name: "Priya Desai", email: "priya.desai@demo.learnquest.gg", school: schoolDefs[0], status: "active",
        subjects: ["chemistry"], boards: ["CBSE"], grades: [9, 10], sections: [["CBSE", 9, "A"], ["CBSE", 9, "B"], ["CBSE", 10, "A"]],
      },
      {
        name: "Rahul Bhatt", email: "rahul.bhatt@demo.learnquest.gg", school: schoolDefs[0], status: "active",
        subjects: ["mathematics"], boards: ["CBSE"], grades: [9, 10], sections: [["CBSE", 9, "A"], ["CBSE", 10, "A"]],
      },
      {
        name: "Neha Joshi", email: "neha.joshi@demo.learnquest.gg", school: schoolDefs[1], status: "active",
        subjects: ["chemistry", "physics"], boards: ["ICSE"], grades: [8], sections: [["ICSE", 8, "A"]],
      },
      {
        name: "Suresh Pillai", email: "suresh.pillai@demo.learnquest.gg", school: schoolDefs[2], status: "active",
        subjects: ["mathematics", "physics"], boards: ["IB"], grades: [11], sections: [["IB", 11, "A"]],
      },
      {
        name: "Kavita Reddy", email: "kavita.reddy@demo.learnquest.gg", school: schoolDefs[1], status: "inactive",
        subjects: ["english"], boards: ["ICSE"], grades: [8], sections: [],
      },
    ];
    for (const t of teachers) {
      const teacherId = uuidv4();
      const primaryGrade = String(t.grades[0]);
      await conn.query(
        `INSERT INTO players
          (id, name, email, password_hash, role, status, level, coins, xp, total_xp_earned, streak,
           current_grade, current_board, current_subject, school_name, school_id, subjects, language)
         VALUES (?,?,?,?, 'TEACHER', ?, 12, 850, 850, 850, 0, ?, ?, 'chemistry', ?, ?, ?, 'en')`,
        [
          teacherId, t.name, t.email, passwordHash, t.status,
          primaryGrade, t.boards[0], t.school, schoolIds[t.school], t.subjects.join(", "),
        ]
      );
      for (const code of t.subjects) {
        await conn.query("INSERT IGNORE INTO teacher_subjects (teacher_id, subject_code) VALUES (?,?)", [teacherId, code]);
      }
      for (const board of t.boards) {
        await conn.query("INSERT IGNORE INTO teacher_boards (teacher_id, board_code) VALUES (?,?)", [teacherId, board]);
      }
      for (const grade of t.grades) {
        await conn.query("INSERT IGNORE INTO teacher_classes (teacher_id, grade) VALUES (?,?)", [teacherId, grade]);
      }
      for (const [board, grade, name] of t.sections) {
        const sectionId = sectionIds[`${t.school}|${board}|${grade}|${name}`];
        if (sectionId) {
          await conn.query("INSERT IGNORE INTO teacher_sections (teacher_id, section_id) VALUES (?,?)", [teacherId, sectionId]);
        }
      }
    }

    // --- chapters (group a couple of worlds' existing lessons) -----------
    console.log("Seeding demo chapters...");
    const chapterDefs = [
      {
        worldId: "atom-valley",
        chapters: [
          { title: "Atomic Basics", description: "What atoms are made of and how we model them.", lessonKeys: ["l1", "l2"] },
          { title: "Advanced Structure", description: "Electron behavior and atomic variants.", lessonKeys: ["l3", "l4", "l5"] },
        ],
      },
      {
        worldId: "algebra-atoll",
        chapters: [
          { title: "Getting Started with Algebra", description: "Variables, expressions, and simple equations.", lessonKeys: ["l1", "l2"] },
          { title: "Solving Equations", description: "Multi-step equations and word problems.", lessonKeys: ["l3", "l4", "l5"] },
        ],
      },
    ];
    for (const def of chapterDefs) {
      for (const [i, ch] of def.chapters.entries()) {
        const [result] = await conn.query(
          "INSERT INTO chapters (world_id, board_code, title, description, sort_order, status) VALUES (?, NULL, ?, ?, ?, 'published')",
          [def.worldId, ch.title, ch.description, i]
        );
        const chapterId = result.insertId;
        if (ch.lessonKeys.length > 0) {
          await conn.query(
            `UPDATE lessons SET chapter_id = ? WHERE world_id = ? AND board_code IS NULL AND lesson_key IN (${ch.lessonKeys
              .map(() => "?")
              .join(",")})`,
            [chapterId, def.worldId, ...ch.lessonKeys]
          );
        }
      }
    }

    // --- admin_users (Admin > Admin Users roster) --------------------------
    console.log("Seeding admin_users...");
    const adminUsers = [
      { name: "Ananya Rao", email: "ananya.rao@learnquest.edu", role: "Super Admin", permissions: ["Content", "People", "Reports", "Settings"], status: "active", lastLogin: "2026-09-02" },
      { name: "Vikram Nair", email: "vikram.nair@learnquest.edu", role: "Admin", permissions: ["Content", "People"], status: "active", lastLogin: "2026-08-29" },
      { name: "Sara Thomas", email: "sara.thomas@learnquest.edu", role: "Support", permissions: ["People"], status: "active", lastLogin: "2026-08-15" },
      { name: "Karthik Iyer", email: "karthik.iyer@learnquest.edu", role: "Admin", permissions: ["Content", "Reports"], status: "inactive", lastLogin: "2026-06-30" },
      { name: "Divya Menon", email: "divya.menon@learnquest.edu", role: "Support", permissions: ["People"], status: "active", lastLogin: "2026-08-20" },
    ];
    for (const a of adminUsers) {
      await conn.query(
        "INSERT INTO admin_users (id, name, email, password_hash, role, permissions, status, last_login) VALUES (?,?,?,NULL,?,?,?,?)",
        [uuidv4(), a.name, a.email, a.role, JSON.stringify(a.permissions), a.status, a.lastLogin]
      );
    }

    console.log("Admin demo-data seed complete.");
    console.log(`Demo student/teacher accounts all use password: "${DEMO_PASSWORD}"`);
  } finally {
    conn.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error("Admin demo-data seed failed:", err);
  process.exit(1);
});
