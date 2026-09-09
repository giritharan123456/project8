const express = require("express");
const pool = require("../config/db");
const { requireRole, requireSchool } = require("../middleware/auth");
const { ROLES } = require("../lib/auth");
const { getSchoolById } = require("../lib/schools");

const router = express.Router();

// Teacher-portal routes: TEACHER accounts use these day-to-day, and ADMIN
// can access them too (an admin can do anything a teacher can). What a
// TEACHER must NOT reach is anything in routes/admin.js (user role
// management, admin stats) - that file only accepts ROLES.ADMIN, so a
// TEACHER token is rejected there with a 403 even though it's accepted
// here.
router.use(requireRole(ROLES.ADMIN, ROLES.TEACHER));

// Section 4 "school-based data separation" - EVERY route below is scoped
// by school_id, enforced here on the server, never trusting a frontend
// filter. A TEACHER can only ever see their own school's data:
// requireSchool blocks a TEACHER with no school on file, and
// resolveScope() below always uses req.user.schoolId for a TEACHER - it
// deliberately ignores any school_id a TEACHER might pass in the query
// string, so a teacher can't widen their own scope by hand-editing a
// request. An ADMIN is not tied to one school; they may pass
// ?school_id=<id> to view one school's data, or omit it to see every
// school (admin-only, still explicit and auditable - never the default
// for a TEACHER).
router.use(requireSchool);

// Resolves the effective school_id for the current request. Every query
// below goes through this rather than inlining `WHERE school_id = ?` by
// hand, so the "TEACHER can never override their own scope" rule lives in
// exactly one place.
function resolveScope(req) {
  if (req.user.role === ROLES.ADMIN) {
    const requested = req.query.school_id ? Number(req.query.school_id) : null;
    return { schoolId: requested, allSchools: requested === null };
  }
  return { schoolId: req.user.schoolId, allSchools: false };
}

// --- Subject scoping (Section 3) ---
//
// A teacher teaches specific subjects (picked on the signup form or set by
// an admin). The activity routes below (leaderboard, reports, quizzes,
// analytics, leaderboard/report) are narrowed to students who have real
// completions/attempts in one of those subjects, so a Chemistry teacher
// sees Chemistry performance instead of the school's whole curriculum mix.
// ADMIN is exempt - they have no subjects of their own, so "every school,
// every subject" stays the admin default (the admin Leaderboard report can
// still be narrowed with its own ?subject= filter).

// TEACHER's subjects -> canonical codes, tolerant of how the value was
// stored (players.subjects has both lowercase codes and display names).
async function teacherSubjectCodes(req) {
  if (req.user.role === ROLES.ADMIN) return null;
  const [rows] = await pool.query(
    "SELECT subjects FROM players WHERE id = ? AND role = 'TEACHER'",
    [req.user.id]
  );
  const raw = (rows[0]?.subjects || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!raw.length) return null;
  const [catalog] = await pool.query("SELECT code, name FROM subjects");
  const byLowerName = new Map(catalog.map((r) => [String(r.name).toLowerCase(), r.code]));
  const known = new Set(catalog.map((r) => r.code));
  const codes = [];
  for (const s of raw) {
    const l = s.toLowerCase();
    const code = byLowerName.get(l) || (known.has(l) ? l : null);
    if (code && !codes.includes(code)) codes.push(code);
  }
  return codes.length ? codes : null;
}

// `column IN (?, ?...)` for a code list; `1=1` when there's nothing to
// filter on (admin / no subjects on file), so callers can push the clause
// unconditionally without special-casing.
function subjectInClause(codes, column) {
  if (!codes || !codes.length) return { sql: "1=1", params: [] };
  return { sql: `${column} IN (${codes.map(() => "?").join(",")})`, params: codes };
}

// Narrows the *student set* to those with at least one completion in one of
// the teacher's subjects. Referenced table alias: `p`.
function subjectActivityExists(codes) {
  if (!codes || !codes.length) return { sql: "1=1", params: [] };
  return {
    sql: `EXISTS (
      SELECT 1 FROM player_completions pc
      JOIN worlds w ON w.id = pc.world_id
      WHERE pc.player_id = p.id AND w.subject_code IN (${codes.map(() => "?").join(",")})
    )`,
    params: codes,
  };
}

// GET /api/teacher/school - "My School": the signed-in teacher's own
// school plus headcounts. Requires an explicit ?school_id= for ADMIN
// (there's no single "my school" for an account not tied to one).
router.get("/school", async (req, res, next) => {
  try {
    const { schoolId, allSchools } = resolveScope(req);
    if (allSchools || !schoolId) {
      // An admin has no single "my school" -- return platform-wide totals
      // so the teacher portal still renders for admin accounts.
      const [rows] = await pool.query(
        "SELECT SUM(role = 'STUDENT') AS studentCount, SUM(role = 'TEACHER') AS teacherCount FROM players"
      );
      return res.json({
        id: null,
        name: "All Schools",
        created_at: null,
        studentCount: Number(rows[0].studentCount) || 0,
        teacherCount: Number(rows[0].teacherCount) || 0,
      });
    }
    const school = await getSchoolById(schoolId);
    if (!school) return res.status(404).json({ message: "School not found." });

    const [[{ studentCount }]] = await pool.query(
      "SELECT COUNT(*) AS studentCount FROM players WHERE school_id = ? AND role = 'STUDENT'",
      [schoolId]
    );
    const [[{ teacherCount }]] = await pool.query(
      "SELECT COUNT(*) AS teacherCount FROM players WHERE school_id = ? AND role = 'TEACHER'",
      [schoolId]
    );
    res.json({ ...school, studentCount, teacherCount });
  } catch (err) {
    next(err);
  }
});

// GET /api/teacher/students - roster of student accounts, filtered by
// school_id at the database level (never just in the frontend). Optional
// ?grade= / ?board= narrow it further, still within the same school.
router.get("/students", async (req, res, next) => {
  try {
    const { schoolId, allSchools } = resolveScope(req);
    const { grade, board } = req.query;

    const where = ["p.role = 'STUDENT'", "p.email IS NOT NULL"];
    const params = [];
    if (!allSchools) {
      where.push("p.school_id = ?");
      params.push(schoolId);
    }
    if (grade) {
      where.push("p.current_grade = ?");
      params.push(String(grade));
    }
    if (board) {
      where.push("p.current_board = ?");
      params.push(board);
    }

    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.email, p.level, p.xp, p.total_xp_earned, p.streak,
              p.current_grade, p.current_board, p.school_id, p.created_at
       FROM players p
       WHERE ${where.join(" AND ")}
       ORDER BY p.created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/teacher/students/:id/progress - one student's completions, for
// the Student Progress modal. The school_id check here is what stops a
// teacher from reaching another school's student by guessing/enumerating
// an id - listing (above) already hides it, but this closes the direct
// lookup too.
router.get("/students/:id/progress", async (req, res, next) => {
  try {
    const { schoolId, allSchools } = resolveScope(req);

    const where = ["id = ?", "role = 'STUDENT'"];
    const params = [req.params.id];
    if (!allSchools) {
      where.push("school_id = ?");
      params.push(schoolId);
    }

    const [student] = await pool.query(
      `SELECT id, name, email, role, current_grade, current_board, school_id FROM players WHERE ${where.join(" AND ")}`,
      params
    );
    if (student.length === 0) return res.status(404).json({ message: "Student not found" });

    const [completions] = await pool.query(
      `SELECT grade, board, world_id, lesson_id, difficulty_id, accuracy, stars, xp, coins, completed_at
       FROM player_completions WHERE player_id = ? ORDER BY completed_at DESC`,
      [req.params.id]
    );
    res.json({ student: student[0], completions });
  } catch (err) {
    next(err);
  }
});

// GET /api/teacher/classes - "My Classes": distinct grade/board
// combinations with a student headcount, scoped to the school.
router.get("/classes", async (req, res, next) => {
  try {
    const { schoolId, allSchools } = resolveScope(req);
    const where = ["role = 'STUDENT'"];
    const params = [];
    if (!allSchools) {
      where.push("school_id = ?");
      params.push(schoolId);
    }
    const [rows] = await pool.query(
      `SELECT current_grade AS grade, current_board AS board, COUNT(*) AS studentCount
       FROM players
       WHERE ${where.join(" AND ")}
       GROUP BY current_grade, current_board
       ORDER BY current_grade, current_board`,
      params
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/teacher/subjects - "My Subjects": the signed-in teacher's own
// assigned subjects (collected at signup, Section 3). ADMIN needs a
// specific teacher id here since they don't have subjects of their own.
router.get("/subjects", async (req, res, next) => {
  try {
    let teacherId = req.user.id;
    if (req.user.role === ROLES.ADMIN && req.query.teacher_id) {
      teacherId = req.query.teacher_id;
    }
    const [rows] = await pool.query("SELECT subjects FROM players WHERE id = ? AND role = 'TEACHER'", [teacherId]);
    if (rows.length === 0) {
      // Admins have no rows in players with role='TEACHER' -- for them the
      // portal is a platform-wide view, so return every active subject.
      if (req.user.role === ROLES.ADMIN) {
        const [subjectRows] = await pool.query(
          "SELECT name FROM subjects WHERE status = 'active' ORDER BY sort_order, name"
        );
        return res.json({ subjects: subjectRows.map((s) => s.name) });
      }
      return res.status(404).json({ message: "Teacher not found" });
    }
    const subjects = (rows[0].subjects || "").split(",").map((s) => s.trim()).filter(Boolean);
    res.json({ subjects });
  } catch (err) {
    next(err);
  }
});

// GET /api/teacher/leaderboard - students ranked within the teacher's own
// school only (a school-scoped view of Section 27's leaderboard, distinct
// from the global /api/leaderboard every player sees in-app).
router.get("/leaderboard", async (req, res, next) => {
  try {
    const { schoolId, allSchools } = resolveScope(req);
    const where = ["role = 'STUDENT'"];
    const params = [];
    if (!allSchools) {
      where.push("school_id = ?");
      params.push(schoolId);
    }
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.level, p.total_xp_earned, p.streak, p.current_grade, p.current_board
       FROM players p
       WHERE ${where.join(" AND ")}
       ORDER BY p.total_xp_earned DESC, p.level DESC
       LIMIT 100`,
      params
    );
    res.json(rows.map((row, i) => ({ rank: i + 1, ...row })));
  } catch (err) {
    next(err);
  }
});

// GET /api/teacher/leaderboard/report - the filterable, PDF-report-ready
// leaderboard behind the admin Leaderboard page's Download PDF button:
// one row per student built from their most recent completed quiz
// attempt, filtered by school/grade/board/subject, plus the aggregate
// summary the PDF's summary block expects. Same all-schools-by-default
// rule as /leaderboard, scoped to the teacher's school when they aren't
// an admin.
router.get("/leaderboard/report", async (req, res, next) => {
  try {
    const { schoolId, allSchools } = resolveScope(req);
    const { grade, board, subject } = req.query || {};
    const subjectCodes = await teacherSubjectCodes(req);

    const where = ["qa.status = 'completed'", "p.role = 'STUDENT'"];
    const params = [];
    if (!allSchools) {
      where.push("p.school_id = ?");
      params.push(schoolId);
    }
    if (grade) {
      where.push("p.current_grade = ?");
      params.push(grade);
    }
    if (board) {
      where.push("p.current_board = ?");
      params.push(board);
    }
    if (subject) {
      where.push("q.subject_code = ?");
      params.push(subject);
    }
    // TEACHER: narrow the report to the subjects they teach on top of any
    // explicit ?subject= filter. ADMIN has no teacher subjects, so this
    // adds nothing and the report stays school/all-schools scoped.
    if (subjectCodes) {
      const inClause = subjectInClause(subjectCodes, "q.subject_code");
      where.push(inClause.sql);
      params.push(...inClause.params);
    }

    const [rows] = await pool.query(
      `SELECT p.id AS studentId, p.name, p.current_grade AS grade, p.current_board AS board,
              qa.accuracy, qa.score, qa.correct_count, qa.total_questions, qa.time_taken_ms, qa.completed_at
       FROM quiz_attempts qa
       JOIN players p ON p.id = qa.player_id
       JOIN quizzes q ON q.id = qa.quiz_id
       WHERE ${where.join(" AND ")}
         AND qa.id = (
           SELECT MAX(qa2.id) FROM quiz_attempts qa2
           WHERE qa2.player_id = qa.player_id AND qa2.status = 'completed'
         )
       ORDER BY qa.accuracy DESC, qa.completed_at DESC`,
      params
    );

    const performance = (acc) =>
      acc >= 85 ? "Excellent" : acc >= 70 ? "Good" : acc >= 50 ? "Average" : "Needs Improvement";

    const reportRows = rows.map((r, i) => {
      const percentage = Math.max(0, Math.min(100, Math.round(r.accuracy || 0)));
      const score =
        r.correct_count != null && r.total_questions
          ? Math.round((r.correct_count / r.total_questions) * 100)
          : r.score ?? percentage;
      return {
        rank: i + 1,
        name: r.name,
        score,
        percentage,
        avgTimeTakenMs: r.time_taken_ms != null ? Math.round(r.time_taken_ms) : null,
        completedAt: r.completed_at,
        performance: performance(percentage),
      };
    });

    const percentages = reportRows.map((r) => r.percentage);
    const counts = { Excellent: 0, Good: 0, Average: 0, "Needs Improvement": 0 };
    reportRows.forEach((r) => {
      counts[r.performance] += 1;
    });
    const totalMs = rows.reduce((s, r) => s + (r.time_taken_ms != null ? r.time_taken_ms : 0), 0);

    res.json({
      rows: reportRows,
      summary: {
        totalStudents: rows.length,
        averageScore: percentages.length
          ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
          : 0,
        highestScore: percentages.length ? Math.max(...percentages) : 0,
        averageTimeTakenMs: rows.length ? Math.round(totalMs / rows.length) : 0,
        excellentCount: counts.Excellent,
        goodCount: counts.Good,
        averageCount: counts.Average,
        needsImprovementCount: counts["Needs Improvement"],
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/teacher/reports - aggregate school performance: headline
// numbers plus a per-class breakdown, all scoped to the school.
router.get("/reports", async (req, res, next) => {
  try {
    const { schoolId, allSchools } = resolveScope(req);
    const subjectCodes = await teacherSubjectCodes(req);
    const studentWhere = ["role = 'STUDENT'"];
    const params = [];
    if (!allSchools) {
      studentWhere.push("school_id = ?");
      params.push(schoolId);
    }

    const [[summary]] = await pool.query(
      `SELECT COUNT(*) AS studentCount, COALESCE(AVG(level), 0) AS avgLevel,
              COALESCE(SUM(total_xp_earned), 0) AS totalXpEarned, COALESCE(AVG(streak), 0) AS avgStreak
       FROM players p WHERE ${studentWhere.join(" AND ")}`,
      params
    );

    const [byClass] = await pool.query(
      `SELECT p.current_grade AS grade, p.current_board AS board,
              COUNT(*) AS studentCount, COALESCE(AVG(p.level), 0) AS avgLevel,
              COALESCE(SUM(p.total_xp_earned), 0) AS totalXpEarned
       FROM players p WHERE ${studentWhere.join(" AND ")}
       GROUP BY p.current_grade, p.current_board
       ORDER BY p.current_grade, p.current_board`,
      params
    );

    const completionWhere = ["p.role = 'STUDENT'"];
    const completionParams = [];
    if (!allSchools) {
      completionWhere.push("p.school_id = ?");
      completionParams.push(schoolId);
    }
    if (subjectCodes) {
      const subj = subjectActivityExists(subjectCodes);
      completionWhere.push(subj.sql);
      completionParams.push(...subj.params);
      const inClause = subjectInClause(subjectCodes, "w.subject_code");
      completionWhere.push(inClause.sql);
      completionParams.push(...inClause.params);
    }
    const [[accuracy]] = await pool.query(
      `SELECT COALESCE(AVG(pc.accuracy), 0) AS avgAccuracy, COUNT(*) AS completionCount
       FROM player_completions pc
       JOIN players p ON p.id = pc.player_id
       LEFT JOIN worlds w ON w.id = pc.world_id
       WHERE ${completionWhere.join(" AND ")}`,
      completionParams
    );

    res.json({ summary: { ...summary, ...accuracy }, byClass });
  } catch (err) {
    next(err);
  }
});

// GET /api/teacher/quizzes - "Quizzes": every recorded lesson/quiz
// attempt (player_completions) for students at the teacher's school,
// newest first, each row carrying the student's name/class so the UI
// doesn't need a second lookup. This is real gameplay data (Section 4
// school scoping applies here exactly like every other route above) -
// distinct from the curriculum-side "quizzes" content editors manage
// under Courses, which lives in the mock content store on the client.
router.get("/quizzes", async (req, res, next) => {
  try {
    const { schoolId, allSchools } = resolveScope(req);
    const subjectCodes = await teacherSubjectCodes(req);
    const where = ["p.role = 'STUDENT'"];
    const params = [];
    if (!allSchools) {
      where.push("p.school_id = ?");
      params.push(schoolId);
    }
    if (subjectCodes) {
      const subj = subjectActivityExists(subjectCodes);
      where.push(subj.sql);
      params.push(...subj.params);
      const inClause = subjectInClause(subjectCodes, "w.subject_code");
      where.push(inClause.sql);
      params.push(...inClause.params);
    }

    const [rows] = await pool.query(
      `SELECT pc.player_id AS studentId, p.name AS studentName, p.current_grade AS grade, p.current_board AS board,
              pc.world_id, pc.lesson_id, pc.difficulty_id, pc.accuracy AS score, pc.stars, pc.xp, pc.coins, pc.completed_at
       FROM player_completions pc
       JOIN players p ON p.id = pc.player_id
       LEFT JOIN worlds w ON w.id = pc.world_id
       WHERE ${where.join(" AND ")}
       ORDER BY pc.completed_at DESC
       LIMIT 500`,
      params
    );

    // Average time-per-question (ms), from the finer-grained quiz_submissions
    // table, folded in per-student so each row can show a "time taken" figure
    // without a second round trip from the client. Scoped to the same
    // teacher-subject student set as the completions above.
    const timeWhere = ["p.role = 'STUDENT'"];
    const timeParams = [];
    if (!allSchools) {
      timeWhere.push("p.school_id = ?");
      timeParams.push(schoolId);
    }
    if (subjectCodes) {
      const subj = subjectActivityExists(subjectCodes);
      timeWhere.push(subj.sql);
      timeParams.push(...subj.params);
    }
    const [timeRows] = await pool.query(
      `SELECT qs.player_id AS studentId, COALESCE(AVG(qs.time_taken_ms), 0) AS avgTimeTakenMs
       FROM quiz_submissions qs
       JOIN players p ON p.id = qs.player_id
       WHERE ${timeWhere.join(" AND ")}
       GROUP BY qs.player_id`,
      timeParams
    );
    const timeByStudent = Object.fromEntries(timeRows.map((r) => [r.studentId, Math.round(r.avgTimeTakenMs)]));

    res.json(rows.map((row) => ({ ...row, avgTimeTakenMs: timeByStudent[row.studentId] ?? null })));
  } catch (err) {
    next(err);
  }
});

// GET /api/teacher/analytics - "Analytics": deeper, per-student
// performance rollups than /reports' single school-wide summary. Every
// number here is derived from player_completions / quiz_submissions,
// grouped by student, then scoped to the school exactly like every
// other route in this file.
router.get("/analytics", async (req, res, next) => {
  try {
    const { schoolId, allSchools } = resolveScope(req);
    const subjectCodes = await teacherSubjectCodes(req);
    const where = ["p.role = 'STUDENT'"];
    const params = [];
    const completionJoin = ["LEFT JOIN player_completions pc ON pc.player_id = p.id"];
    // NOTE: ? placeholders bind in SQL-text order. The worlds-join subject
    // clause is written BEFORE the WHERE clause, so its params must be
    // pushed first -- pushing them last would bind schoolId/exists params
    // to the IN (...) list and silently empty every analytics row.
    if (subjectCodes) {
      const inClause = subjectInClause(subjectCodes, "w.subject_code");
      completionJoin.push(`LEFT JOIN worlds w ON w.id = pc.world_id AND ${inClause.sql}`);
      params.push(...inClause.params);
    }
    if (!allSchools) {
      where.push("p.school_id = ?");
      params.push(schoolId);
    }
    if (subjectCodes) {
      const subj = subjectActivityExists(subjectCodes);
      where.push(subj.sql);
      params.push(...subj.params);
    }

    const [students] = await pool.query(
      `SELECT p.id, p.name, p.current_grade AS grade, p.current_board AS board, p.level, p.total_xp_earned AS totalXpEarned,
              COUNT(pc.player_id) AS completedLessons,
              COALESCE(MAX(pc.accuracy), 0) AS highestScore,
              COALESCE(AVG(pc.accuracy), 0) AS averageScore
       FROM players p
       ${completionJoin.join("\n")}
       WHERE ${where.join(" AND ")}
       GROUP BY p.id, p.name, p.current_grade, p.current_board, p.level, p.total_xp_earned
       ORDER BY averageScore DESC`,
      params
    );

    const timeWhere = ["p.role = 'STUDENT'"];
    const timeParams = [];
    if (!allSchools) {
      timeWhere.push("p.school_id = ?");
      timeParams.push(schoolId);
    }
    if (subjectCodes) {
      const subj = subjectActivityExists(subjectCodes);
      timeWhere.push(subj.sql);
      timeParams.push(...subj.params);
    }
    const [timeRows] = await pool.query(
      `SELECT qs.player_id AS id, COALESCE(AVG(qs.time_taken_ms), 0) AS avgTimeTakenMs,
              COUNT(*) AS questionsAnswered, COALESCE(SUM(qs.correct), 0) AS correctAnswers
       FROM quiz_submissions qs
       JOIN players p ON p.id = qs.player_id
       WHERE ${timeWhere.join(" AND ")}
       GROUP BY qs.player_id`,
      timeParams
    );
    const timeById = Object.fromEntries(timeRows.map((r) => [r.id, r]));

    const withActivity = students.map((s) => ({
      ...s,
      highestScore: Math.round(s.highestScore),
      averageScore: Math.round(s.averageScore),
      avgTimeTakenMs: Math.round(timeById[s.id]?.avgTimeTakenMs ?? 0) || null,
      questionsAnswered: timeById[s.id]?.questionsAnswered ?? 0,
      correctAnswers: timeById[s.id]?.correctAnswers ?? 0,
    }));

    const active = withActivity.filter((s) => s.completedLessons > 0);
    const performanceBands = {
      excellent: active.filter((s) => s.averageScore >= 85).length,
      good: active.filter((s) => s.averageScore >= 60 && s.averageScore < 85).length,
      needsImprovement: active.filter((s) => s.averageScore < 60).length,
      noActivity: withActivity.length - active.length,
    };

    const topPerformers = [...active].sort((a, b) => b.averageScore - a.averageScore).slice(0, 5);
    const needsAttention = [...active].sort((a, b) => a.averageScore - b.averageScore).slice(0, 5);

    res.json({ students: withActivity, performanceBands, topPerformers, needsAttention });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
