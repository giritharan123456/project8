const express = require("express");
const pool = require("../config/db");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { requireRole, requireSchool } = require("../middleware/auth");
const { ROLES } = require("../lib/auth");

const router = express.Router();

function attachment(res, filename) {
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
}

function makePdf() {
  const doc = new PDFDocument({ size: "A4", margin: 48 });
  doc.font("Helvetica");
  return doc;
}

function header(doc, title, meta) {
  doc
    .fillColor("#1f2937")
    .fontSize(18)
    .font("Helvetica-Bold")
    .text(title, { align: "center" })
    .moveDown(0.2);
  if (meta) {
    doc
      .fillColor("#6b7280")
      .fontSize(10)
      .font("Helvetica")
      .text(meta, { align: "center" })
      .moveDown(0.8);
  }
  doc
    .moveDown(0.2)
    .moveTo(48, doc.y)
    .lineTo(545, doc.y)
    .strokeColor("#d1d5db")
    .stroke()
    .moveDown(0.8);
}

function statBlock(doc, stats) {
  const w = 124;
  let x = 48;
  doc.font("Helvetica-Bold").fontSize(15).fillColor("#111827");
  for (const s of stats) {
    doc.text(String(s.value), x, doc.y + 4, { width: w, align: "center" });
    doc.moveDown(0.1);
    doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(s.label, x, doc.y, { width: w, align: "center" });
    doc.fillColor("#111827");
    doc.font("Helvetica-Bold").fontSize(15);
    x += w;
    if (x > 545 - w) {
      x = 48;
      doc.moveDown(1.2);
    }
  }
  doc.moveDown(1.4);
}

function table(doc, headers, rows, widths) {
  const colWidths = widths || Array(headers.length).fill((545 - 48) / headers.length);
  const pageWidth = 545 - 48;
  const scale = pageWidth / colWidths.reduce((a, b) => a + b, 0);
  const cw = colWidths.map((c) => c * scale);

  const headerTop = doc.y;
  doc.font("Helvetica-Bold").fontSize(8).fillColor("#ffffff");
  let x = 48;
  doc.rect(48, headerTop, pageWidth, 16).fill("#1d4ed8");
  headers.forEach((h, i) => {
    doc.fillColor("#ffffff").text(h, x + 4, headerTop + 4, { width: cw[i] - 8, ellipsis: true });
    x += cw[i];
  });
  doc.moveDown(1);
  doc.font("Helvetica").fontSize(8);

  rows.forEach((r) => {
    if (doc.y > 760) doc.addPage();
    const top = doc.y;
    doc.fillColor("#f9fafb");
    rows.indexOf(r) % 2 === 0 && doc.rect(48, top, pageWidth, 16).fill("#f3f4f6");
    let cx = 48;
    r.forEach((cell, i) => {
      doc.fillColor("#111827").text(String(cell ?? ""), cx + 4, top + 4, { width: cw[i] - 8, ellipsis: true });
      cx += cw[i];
    });
    doc.moveDown(1);
  });
  doc.fillColor("#111827");
}

async function sendPdf(res, doc, filename) {
  const chunks = [];
  const buf = await new Promise((resolve, reject) => {
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
  attachment(res, filename);
  res.setHeader("Content-Type", "application/pdf");
  res.send(buf);
}

async function sendXlsx(res, wb, filename) {
  const buf = await wb.xlsx.writeBuffer();
  attachment(res, filename);
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buf);
}

async function studentStats(playerId) {
  const [[comp]] = await pool.query(
    "SELECT COUNT(*) n, COALESCE(ROUND(AVG(accuracy),0),0) avgAcc, COALESCE(MAX(accuracy),0) bestAcc, COALESCE(SUM(xp),0) xp, COALESCE(SUM(coins),0) coins, COUNT(DISTINCT world_id) worlds, COALESCE(MAX(completed_at),'') lastOn FROM player_completions WHERE player_id=?",
    [playerId]
  );
  const [[qz]] = await pool.query("SELECT COUNT(*) n, COALESCE(ROUND(AVG(accuracy),0),0) avgAcc FROM quiz_attempts WHERE player_id=? AND status='completed'", [playerId]);
  const [[badges]] = await pool.query("SELECT COUNT(*) n FROM player_badges WHERE player_id=?", [playerId]);
  const [[mastery]] = await pool.query("SELECT COUNT(*) n FROM mastery WHERE player_id=?", [playerId]);
  return { ...comp, quizzes: qz.n, quizAvgAcc: qz.avgAcc, totalBadges: badges.n, mastery: mastery.n };
}

async function recentCompletions(playerId, limit) {
  const [rows] = await pool.query(
    "SELECT pc.world_id, w.name AS world, pc.lesson_id, pc.difficulty_id, pc.accuracy, pc.stars, pc.xp, pc.completed_at FROM player_completions pc LEFT JOIN worlds w ON pc.world_id=w.id WHERE pc.player_id=? ORDER BY pc.completed_at DESC LIMIT ?",
    [playerId, limit || 20]
  );
  return rows;
}

// =============================================================
// STUDENT: printable progress report (PDF)
// =============================================================
router.get("/student/report", requireRole(ROLES.STUDENT, ROLES.ADMIN), async (req, res, next) => {
  try {
    const pid = req.user.id;
    const [[me]] = await pool.query("SELECT name, email, current_grade, current_board, school_id FROM players WHERE id=?", [pid]);
    if (!me) return res.status(404).json({ message: "Player not found." });
    let schoolName = "";
    if (me.school_id) {
      const [sc] = await pool.query("SELECT name FROM schools WHERE id=?", [me.school_id]);
      if (sc[0]) schoolName = sc[0].name;
    }
    const stats = await studentStats(pid);
    const recent = await recentCompletions(pid, 20);

    const doc = makePdf();
    header(doc, "LearnQuest - Student Progress Report", `${me.name}  |  ${me.current_board} Grade ${me.current_grade}  |  ${schoolName || "Independent"}`);
    doc.moveDown(1.2);
    doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(`Generated ${new Date().toLocaleString()}`, { align: "right" }).moveDown(0.8);
    statBlock(doc, [
      { value: stats.n, label: "Lessons Completed" },
      { value: `${stats.avgAcc}%`, label: "Avg Accuracy" },
      { value: `${stats.bestAcc}%`, label: "Best Accuracy" },
      { value: stats.worlds, label: "Worlds Explored" },
    ]);
    doc.moveDown(0.4);
    statBlock(doc, [
      { value: stats.xp, label: "Total XP Earned" },
      { value: stats.coins, label: "Coins Earned" },
      { value: stats.quizzes, label: "Quizzes Taken" },
      { value: stats.totalBadges, label: "Badges Earned" },
    ]);

    doc.moveDown(0.8);
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("Recent Activity");
    doc.moveDown(0.4);
    if (!recent.length) {
      doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text("No activity recorded yet.");
    } else {
      table(
        doc,
        ["World", "Lesson", "Difficulty", "Accuracy", "Stars", "XP", "Completed"],
        recent.map((r) => [r.world || r.world_id, r.lesson_id, r.difficulty_id, `${r.accuracy}%`, r.stars, r.xp, String(r.completed_at || "").slice(0, 10)]),
        [140, 70, 70, 70, 50, 50, 80]
      );
    }
    await sendPdf(res, doc, `learnquest-report-${pid.slice(0, 8)}.pdf`);
  } catch (err) {
    next(err);
  }
});

// =============================================================
// STUDENT: full progress export (Excel)
// =============================================================
router.get("/student/progress/export", requireRole(ROLES.STUDENT, ROLES.ADMIN), async (req, res, next) => {
  try {
    const pid = req.user.id;
    const [[me]] = await pool.query("SELECT name, current_grade, current_board FROM players WHERE id=?", [pid]);
    const stats = await studentStats(pid);
    const [completions] = await pool.query(
      "SELECT pc.world_id, w.name AS world, pc.lesson_id, pc.difficulty_id, pc.accuracy, pc.stars, pc.xp, pc.coins, pc.completed_at FROM player_completions pc LEFT JOIN worlds w ON pc.world_id=w.id WHERE pc.player_id=? ORDER BY pc.completed_at DESC",
      [pid]
    );
    const [attempts] = await pool.query("SELECT id, quiz_id, total_questions, correct_count, accuracy, xp_earned, coins_earned, status, completed_at FROM quiz_attempts WHERE player_id=? AND status='completed' ORDER BY completed_at DESC", [pid]);

    const wb = new ExcelJS.Workbook();
    wb.creator = "LearnQuest";
    const summary = wb.addWorksheet("Summary");
    summary.columns = [
      { header: "Metric", key: "m", width: 28 },
      { header: "Value", key: "v", width: 18 },
    ];
    summary.addRows([
      { m: "Student", v: me ? me.name : "" },
      { m: "Grade / Board", v: me ? `${me.current_board} Grade ${me.current_grade}` : "" },
      { m: "Lessons Completed", v: stats.n },
      { m: "Avg Accuracy (%)", v: stats.avgAcc },
      { m: "Best Accuracy (%)", v: stats.bestAcc },
      { m: "Total XP Earned", v: stats.xp },
      { m: "Coins Earned", v: stats.coins },
      { m: "Quizzes Taken", v: stats.quizzes },
      { m: "Badges Earned", v: stats.totalBadges },
      { m: "Mastery Entries", v: stats.mastery },
    ]);
    summary.getRow(1).font = { bold: true };

    const lessons = wb.addWorksheet("Lesson Completions");
    lessons.columns = [
      { header: "World", key: "world", width: 30 },
      { header: "Lesson", key: "lesson", width: 16 },
      { header: "Difficulty", key: "difficulty", width: 14 },
      { header: "Accuracy %", key: "accuracy", width: 12 },
      { header: "Stars", key: "stars", width: 8 },
      { header: "XP", key: "xp", width: 8 },
      { header: "Coins", key: "coins", width: 8 },
      { header: "Completed At", key: "completed_at", width: 20 },
    ];
    lessons.addRows(completions.map((r) => ({ world: r.world || r.world_id, lesson: r.lesson_id, difficulty: r.difficulty_id, accuracy: r.accuracy, stars: r.stars, xp: r.xp, coins: r.coins, completed_at: r.completed_at })));
    lessons.getRow(1).font = { bold: true };

    const quizes = wb.addWorksheet("Quiz Attempts");
    quizes.columns = [
      { header: "Quiz", key: "quiz", width: 18 },
      { header: "Questions", key: "q", width: 10 },
      { header: "Correct", key: "c", width: 10 },
      { header: "Accuracy %", key: "a", width: 10 },
      { header: "XP", key: "xp", width: 8 },
      { header: "Coins", key: "coins", width: 8 },
      { header: "Completed At", key: "d", width: 20 },
    ];
    quizes.addRows(attempts.map((r) => ({ quiz: r.quiz_id, q: r.total_questions, c: r.correct_count, a: r.accuracy, xp: r.xp_earned, coins: r.coins_earned, d: r.completed_at })));
    quizes.getRow(1).font = { bold: true };

    await sendXlsx(res, wb, `student-progress-${pid.slice(0, 8)}.xlsx`);
  } catch (err) {
    next(err);
  }
});

// resolveScope identical to teacher.js so exports honour school separation
function resolveScope(req) {
  if (req.user.role === ROLES.ADMIN) {
    const requested = req.query.school_id ? Number(req.query.school_id) : null;
    return { schoolId: requested, allSchools: requested === null };
  }
  return { schoolId: req.user.schoolId, allSchools: false };
}

async function teacherScopeStudents(schoolId) {
  const [rows] = await pool.query(
    "SELECT p.id, p.name, p.email, p.current_grade grade, p.current_board board, " +
      "(SELECT COUNT(*) FROM player_completions pc WHERE pc.player_id=p.id) lessons, " +
      "(SELECT COALESCE(ROUND(AVG(accuracy),0),0) FROM player_completions pc WHERE pc.player_id=p.id) avgAcc, " +
      "(SELECT COUNT(*) FROM quiz_attempts qa WHERE qa.player_id=p.id AND qa.status='completed') quizzes, " +
      "(SELECT COALESCE(SUM(xp),0) FROM player_completions pc WHERE pc.player_id=p.id) xp, " +
      "(SELECT COUNT(*) FROM player_badges pb WHERE pb.player_id=p.id) badges " +
      "FROM players p WHERE p.role='STUDENT' AND p.email IS NOT NULL AND p.school_id=? ORDER BY p.current_grade, p.name",
    [schoolId]
  );
  return rows;
}

// =============================================================
// TEACHER: class roster report (PDF)
// =============================================================
router.get("/teacher/roster", requireRole(ROLES.TEACHER, ROLES.ADMIN), requireSchool, async (req, res, next) => {
  try {
    const { schoolId } = resolveScope(req);
    if (!schoolId) return res.status(400).json({ message: "school_id is required." });
    const [[school]] = await pool.query("SELECT name FROM schools WHERE id=?", [schoolId]);
    const rows = await teacherScopeStudents(schoolId);

    const doc = makePdf();
    header(doc, "LearnQuest - Class Roster", `${school ? school.name : "School"}  |  Generated ${new Date().toLocaleDateString()}`);
    doc.moveDown(1);
    doc.font("Helvetica").fontSize(10).fillColor("#374151").text(`Total students: ${rows.length}`).moveDown(0.6);
    doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text("Student activity shown below is pulled live from the platform database.").moveDown(0.6);
    if (!rows.length) {
      doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text("No students linked to this school yet.");
    } else {
      table(
        doc,
        ["Name", "Email", "Grade", "Board", "Lessons", "Avg Accuracy", "Quizzes", "XP", "Badges"],
        rows.map((r) => [r.name, r.email, r.grade, r.board, r.lessons, `${r.avgAcc}%`, r.quizzes, r.xp, r.badges]),
        [110, 150, 40, 50, 48, 60, 48, 42, 42]
      );
    }
    await sendPdf(res, doc, `class-roster-school-${schoolId}.pdf`);
  } catch (err) {
    next(err);
  }
});

// =============================================================
// TEACHER: roster + student progress (Excel)
// =============================================================
router.get("/teacher/students/export", requireRole(ROLES.TEACHER, ROLES.ADMIN), requireSchool, async (req, res, next) => {
  try {
    const { schoolId } = resolveScope(req);
    if (!schoolId) return res.status(400).json({ message: "school_id is required." });
    const [[school]] = await pool.query("SELECT name FROM schools WHERE id=?", [schoolId]);
    const rows = await teacherScopeStudents(schoolId);

    const wb = new ExcelJS.Workbook();
    wb.creator = "LearnQuest";
    const ws = wb.addWorksheet("Students");
    ws.columns = [
      { header: "Name", key: "name", width: 24 },
      { header: "Email", key: "email", width: 34 },
      { header: "Grade", key: "grade", width: 8 },
      { header: "Board", key: "board", width: 10 },
      { header: "Lessons Completed", key: "lessons", width: 16 },
      { header: "Avg Accuracy %", key: "avgAcc", width: 14 },
      { header: "Quizzes Taken", key: "quizzes", width: 14 },
      { header: "Total XP", key: "xp", width: 10 },
      { header: "Badges", key: "badges", width: 8 },
    ];
    ws.addRows(rows.map((r) => ({ name: r.name, email: r.email, grade: r.grade, board: r.board, lessons: r.lessons, avgAcc: r.avgAcc, quizzes: r.quizzes, xp: r.xp, badges: r.badges })));
    ws.getRow(1).font = { bold: true };

    const detail = wb.addWorksheet("Student Detail");
    detail.columns = [
      { header: "Student", key: "name", width: 22 },
      { header: "Lesson World", key: "world", width: 28 },
      { header: "Lesson", key: "lesson", width: 10 },
      { header: "Difficulty", key: "diff", width: 12 },
      { header: "Accuracy %", key: "acc", width: 10 },
      { header: "Stars", key: "stars", width: 8 },
      { header: "XP", key: "xp", width: 8 },
      { header: "Completed At", key: "d", width: 20 },
    ];
    const detailRows = [];
    for (const s of rows) {
      const [c] = await pool.query("SELECT pc.world_id, w.name AS world, pc.lesson_id, pc.difficulty_id, pc.accuracy, pc.stars, pc.xp, pc.completed_at FROM player_completions pc LEFT JOIN worlds w ON pc.world_id=w.id WHERE pc.player_id=? ORDER BY pc.completed_at DESC", [s.id]);
      c.forEach((r) => detailRows.push({ name: s.name, world: r.world || r.world_id, lesson: r.lesson_id, diff: r.difficulty_id, acc: r.accuracy, stars: r.stars, xp: r.xp, d: r.completed_at }));
    }
    detail.addRows(detailRows);
    detail.getRow(1).font = { bold: true };

    await sendXlsx(res, wb, `school-${schoolId}-students.xlsx`);
  } catch (err) {
    next(err);
  }
});

// =============================================================
// ADMIN: platform overview report (PDF)
// =============================================================
router.get("/admin/report", requireRole(ROLES.ADMIN), async (req, res, next) => {
  try {
    const [[sch]] = await pool.query("SELECT COUNT(*) n FROM schools");
    const [[stu]] = await pool.query("SELECT COUNT(*) n FROM players WHERE role='STUDENT'");
    const [[tea]] = await pool.query("SELECT COUNT(*) n FROM players WHERE role='TEACHER'");
    const [[comp]] = await pool.query("SELECT COUNT(*) n FROM player_completions");
    const [[qs]] = await pool.query("SELECT COUNT(*) n FROM questions");
    const [[qu]] = await pool.query("SELECT COUNT(*) n FROM quizzes");
    const [[bg]] = await pool.query("SELECT COUNT(*) n FROM badges");
    const [content] = await pool.query("SELECT s.code, s.name, (SELECT COUNT(*) FROM units u WHERE u.subject_code=s.code) units, (SELECT COUNT(*) FROM concepts c JOIN units u ON c.unit_id=u.id WHERE u.subject_code=s.code) concepts, (SELECT COUNT(*) FROM topics t JOIN concepts c ON t.concept_id=c.id JOIN units u ON c.unit_id=u.id WHERE u.subject_code=s.code) topics, (SELECT COUNT(*) FROM learning_contents lc JOIN topics t ON lc.topic_id=t.id JOIN concepts c ON t.concept_id=c.id JOIN units u ON c.unit_id=u.id WHERE u.subject_code=s.code) lc FROM subjects s WHERE s.status='active' ORDER BY s.sort_order");
    const [schools] = await pool.query("SELECT sc.name, (SELECT COUNT(*) FROM players p WHERE p.school_id=sc.id AND p.role='STUDENT') students, (SELECT COUNT(*) FROM players p WHERE p.school_id=sc.id AND p.role='TEACHER') teachers, (SELECT COUNT(*) FROM player_completions pc JOIN players p ON pc.player_id=p.id WHERE p.school_id=sc.id) lessons FROM schools sc ORDER BY sc.id DESC LIMIT 8");

    const doc = makePdf();
    header(doc, "LearnQuest - Platform Report", `Generated ${new Date().toLocaleString()}`);
    doc.moveDown(1);
    statBlock(doc, [
      { value: sch.n, label: "Schools" },
      { value: stu.n, label: "Students" },
      { value: tea.n, label: "Teachers" },
      { value: comp.n, label: "Lesson Completions" },
    ]);
    doc.moveDown(0.4);
    statBlock(doc, [
      { value: qu.n, label: "Quizzes" },
      { value: qs.n, label: "Questions" },
      { value: bg.n, label: "Badges" },
      { value: "Live", label: "Data Source" },
    ]);

    doc.moveDown(0.8);
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("Content Coverage by Subject");
    doc.moveDown(0.4);
    table(
      doc,
      ["Subject", "Units", "Concepts", "Topics", "Learning Content"],
      content.map((r) => [r.name, r.units, r.concepts, r.topics, r.lc])
    );

    doc.moveDown(0.8);
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("School Activity (recent schools)");
    doc.moveDown(0.4);
    table(
      doc,
      ["School", "Students", "Teachers", "Lessons Completed"],
      schools.map((r) => [r.name, r.students, r.teachers, r.lessons])
    );
    await sendPdf(res, doc, `learnquest-platform-report.pdf`);
  } catch (err) {
    next(err);
  }
});

// =============================================================
// ADMIN: full platform export (Excel)
// =============================================================
router.get("/admin/export/students", requireRole(ROLES.ADMIN), async (req, res, next) => {
  try {
    const [students] = await pool.query(
      "SELECT p.name, p.email, p.current_grade grade, p.current_board board, s.name school, " +
        "(SELECT COUNT(*) FROM player_completions pc WHERE pc.player_id=p.id) lessons, " +
        "(SELECT COALESCE(ROUND(AVG(accuracy),0),0) FROM player_completions pc WHERE pc.player_id=p.id) avgAcc, " +
        "(SELECT COUNT(*) FROM quiz_attempts qa WHERE qa.player_id=p.id AND qa.status='completed') quizzes, " +
        "(SELECT COALESCE(SUM(xp),0) FROM player_completions pc WHERE pc.player_id=p.id) xp, " +
        "(SELECT COUNT(*) FROM player_badges pb WHERE pb.player_id=p.id) badges " +
        "FROM players p LEFT JOIN schools s ON p.school_id=s.id WHERE p.role='STUDENT' ORDER BY p.current_grade, p.name"
    );
    const [content] = await pool.query("SELECT s.code, s.name, (SELECT COUNT(*) FROM worlds w WHERE w.subject_code=s.code) worlds, (SELECT COUNT(*) FROM lessons l JOIN worlds w ON l.world_id=w.id WHERE w.subject_code=s.code) lessons, (SELECT COUNT(*) FROM units u WHERE u.subject_code=s.code) units, (SELECT COUNT(*) FROM concepts c JOIN units u ON c.unit_id=u.id WHERE u.subject_code=s.code) concepts, (SELECT COUNT(*) FROM questions q JOIN worlds w ON q.world_id=w.id WHERE w.subject_code=s.code) questions, (SELECT COUNT(*) FROM quizzes qz WHERE qz.subject_code=s.code) quizzes FROM subjects s WHERE s.status='active' ORDER BY s.sort_order");
    const [schools] = await pool.query("SELECT sc.id, sc.name, (SELECT COUNT(*) FROM players p WHERE p.school_id=sc.id AND p.role='STUDENT') students, (SELECT COUNT(*) FROM players p WHERE p.school_id=sc.id AND p.role='TEACHER') teachers FROM schools sc ORDER BY sc.id");

    const wb = new ExcelJS.Workbook();
    wb.creator = "LearnQuest";

    const ws = wb.addWorksheet("Students");
    ws.columns = [
      { header: "Name", key: "name", width: 22 },
      { header: "Email", key: "email", width: 34 },
      { header: "Grade", key: "grade", width: 8 },
      { header: "Board", key: "board", width: 10 },
      { header: "School", key: "school", width: 30 },
      { header: "Lessons", key: "lessons", width: 10 },
      { header: "Avg Accuracy %", key: "avgAcc", width: 14 },
      { header: "Quizzes", key: "quizzes", width: 10 },
      { header: "XP", key: "xp", width: 10 },
      { header: "Badges", key: "badges", width: 8 },
    ];
    ws.addRows(students.map((r) => ({ ...r, school: r.school || "Independent" })));
    ws.getRow(1).font = { bold: true };

    const cc = wb.addWorksheet("Content Coverage");
    cc.columns = [
      { header: "Subject", key: "name", width: 22 },
      { header: "Worlds", key: "worlds", width: 8 },
      { header: "Lessons", key: "lessons", width: 8 },
      { header: "Units", key: "units", width: 8 },
      { header: "Concepts", key: "concepts", width: 10 },
      { header: "Questions", key: "questions", width: 10 },
      { header: "Quizzes", key: "quizzes", width: 8 },
    ];
    cc.addRows(content);
    cc.getRow(1).font = { bold: true };

    const ss = wb.addWorksheet("Schools");
    ss.columns = [
      { header: "ID", key: "id", width: 6 },
      { header: "School", key: "name", width: 34 },
      { header: "Students", key: "students", width: 10 },
      { header: "Teachers", key: "teachers", width: 10 },
    ];
    ss.addRows(schools);
    ss.getRow(1).font = { bold: true };

    await sendXlsx(res, wb, `learnquest-platform-export.xlsx`);
  } catch (err) {
    next(err);
  }
});

// Shared by the /teacher/reports and /admin/reports export endpoints:
// same queries server/src/routes/teacher.js's /reports handler runs, so the
// exported file always matches exactly what the Reports pages show.
async function reportsData(schoolId, allSchools) {
  const studentWhere = ["role = 'STUDENT'"];
  const params = [];
  if (!allSchools) {
    studentWhere.push("school_id = ?");
    params.push(schoolId);
  }
  const [[summary]] = await pool.query(
    `SELECT COUNT(*) AS studentCount, COALESCE(AVG(level), 0) AS avgLevel,
            COALESCE(SUM(total_xp_earned), 0) AS totalXpEarned, COALESCE(AVG(streak), 0) AS avgStreak
     FROM players WHERE ${studentWhere.join(" AND ")}`,
    params
  );
  const [byClass] = await pool.query(
    `SELECT current_grade AS grade, current_board AS board,
            COUNT(*) AS studentCount, COALESCE(AVG(level), 0) AS avgLevel,
            COALESCE(SUM(total_xp_earned), 0) AS totalXpEarned
     FROM players WHERE ${studentWhere.join(" AND ")}
     GROUP BY current_grade, current_board
     ORDER BY current_grade, current_board`,
    params
  );
  const completionWhere = ["p.role = 'STUDENT'"];
  const completionParams = [];
  if (!allSchools) {
    completionWhere.push("p.school_id = ?");
    completionParams.push(schoolId);
  }
  const [[accuracy]] = await pool.query(
    `SELECT COALESCE(AVG(pc.accuracy), 0) AS avgAccuracy, COUNT(*) AS completionCount
     FROM player_completions pc
     JOIN players p ON p.id = pc.player_id
     WHERE ${completionWhere.join(" AND ")}`,
    completionParams
  );
  return { summary: { ...summary, ...accuracy }, byClass };
}

// =============================================================
// TEACHER / ADMIN: school performance report (PDF) - mirrors the
// Reports dashboard cards plus the grade/board breakdown.
// =============================================================
router.get(["/teacher/reports", "/admin/report-summary"], requireRole(ROLES.TEACHER, ROLES.ADMIN), requireSchool, async (req, res, next) => {
  try {
    const { schoolId, allSchools } = resolveScope(req);
    let schoolName = "All Schools";
    if (!allSchools && schoolId) {
      const [[school]] = await pool.query("SELECT name FROM schools WHERE id=?", [schoolId]);
      schoolName = school ? school.name : `School ${schoolId}`;
    }
    const { summary, byClass } = await reportsData(schoolId, allSchools);

    const doc = makePdf();
    header(doc, "LearnQuest - Performance Report", `${schoolName}  |  Generated ${new Date().toLocaleString()}`);
    doc.moveDown(0.8);
    statBlock(doc, [
      { value: summary.studentCount, label: "Students" },
      { value: `${Math.round(summary.avgLevel * 10) / 10}`, label: "Avg Level" },
      { value: summary.totalXpEarned, label: "Total XP Earned" },
      { value: `${Math.round(summary.avgAccuracy)}%`, label: "Avg Lesson Accuracy" },
    ]);
    doc.moveDown(1);
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("Students by Grade / Board");
    doc.moveDown(0.4);
    if (!byClass.length) {
      doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text("No students linked to this school yet.");
    } else {
      table(
        doc,
        ["Grade", "Board", "Students", "Avg Level", "Total XP"],
        byClass.map((r) => [r.grade, r.board, r.studentCount, `${Math.round(r.avgLevel * 10) / 10}`, r.totalXpEarned]),
        [70, 120, 90, 90, 120]
      );
    }
    await sendPdf(res, doc, schoolId ? `school-${schoolId}-performance-report.pdf` : `platform-performance-report.pdf`);
  } catch (err) {
    next(err);
  }
});

// =============================================================
// TEACHER / ADMIN: school performance report (Excel)
// =============================================================
router.get(["/teacher/reports/export", "/admin/report-summary/export"], requireRole(ROLES.TEACHER, ROLES.ADMIN), requireSchool, async (req, res, next) => {
  try {
    const { schoolId, allSchools } = resolveScope(req);
    let schoolName = "All Schools";
    if (!allSchools && schoolId) {
      const [[school]] = await pool.query("SELECT name FROM schools WHERE id=?", [schoolId]);
      schoolName = school ? school.name : `School ${schoolId}`;
    }
    const { summary, byClass } = await reportsData(schoolId, allSchools);

    const wb = new ExcelJS.Workbook();
    wb.creator = "LearnQuest";

    const sm = wb.addWorksheet("Summary");
    sm.columns = [
      { header: "Metric", key: "m", width: 30 },
      { header: "Value", key: "v", width: 20 },
    ];
    sm.addRows([
      { m: "School", v: schoolName },
      { m: "Students", v: summary.studentCount },
      { m: "Avg Level", v: Math.round(summary.avgLevel * 10) / 10 },
      { m: "Total XP Earned", v: summary.totalXpEarned },
      { m: "Avg Streak (days)", v: Math.round(summary.avgStreak * 10) / 10 },
      { m: "Avg Lesson Accuracy (%)", v: Math.round(summary.avgAccuracy) },
      { m: "Lesson Completions", v: summary.completionCount },
    ]);
    sm.getRow(1).font = { bold: true };

    const bc = wb.addWorksheet("By Class");
    bc.columns = [
      { header: "Grade", key: "grade", width: 10 },
      { header: "Board", key: "board", width: 14 },
      { header: "Students", key: "studentCount", width: 10 },
      { header: "Avg Level", key: "avgLevel", width: 12 },
      { header: "Total XP", key: "totalXpEarned", width: 14 },
    ];
    bc.addRows(byClass.map((r) => ({ ...r, avgLevel: Math.round(r.avgLevel * 10) / 10 })));
    bc.getRow(1).font = { bold: true };

    await sendXlsx(res, wb, schoolId ? `school-${schoolId}-performance-report.xlsx` : `platform-performance-report.xlsx`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;