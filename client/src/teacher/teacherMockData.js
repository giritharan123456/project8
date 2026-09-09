// Teacher-portal seed data.
//
// Assignments and Results don't exist in server/schema.sql yet, so -- same
// pattern as client/src/admin/mockData.js -- this module seeds them shaped
// the way those tables *would* look. Assignments reference existing
// lessons/quizzes from admin/mockData.js; Results reference existing
// students and the assignments below. See TeacherContext.jsx for how these
// combine with the shared admin store and get scoped to "my students",
// "my classes" etc. per the signed-in teacher.

export const ASSIGNMENTS = [
  {
    id: "AS-1",
    teacherId: "TCH-201",
    title: "Intro to Atoms \u2014 Homework",
    type: "lesson",
    lessonId: "L-1",
    quizId: null,
    classId: "9",
    boardId: "CBSE",
    subjectId: "SUB-1",
    subject: "Chemistry",
    dueDate: "2026-09-05",
    instructions: "Read through the lesson and complete the recap worksheet on atomic structure basics.",
    status: "published",
  },
  {
    id: "AS-2",
    teacherId: "TCH-201",
    title: "Atomic Structure Check",
    type: "lesson",
    lessonId: "L-2",
    quizId: null,
    classId: "9",
    boardId: "ICSE",
    subjectId: "SUB-1",
    subject: "Chemistry",
    dueDate: "2026-09-08",
    instructions: "Label the diagram of an atom and answer the three short questions.",
    status: "published",
  },
  {
    id: "AS-3",
    teacherId: "TCH-201",
    title: "Isotopes Practice Set",
    type: "lesson",
    lessonId: "L-4",
    quizId: null,
    classId: "9",
    boardId: "CBSE",
    subjectId: "SUB-1",
    subject: "Chemistry",
    dueDate: "2026-09-12",
    instructions: "Ten practice problems on isotopes and mass number.",
    status: "published",
  },
  {
    id: "AS-4",
    teacherId: "TCH-201",
    title: "Molecule Forest Checkpoint Quiz",
    type: "quiz",
    lessonId: null,
    quizId: "QZ-3",
    classId: "9",
    boardId: "ICSE",
    subjectId: "SUB-1",
    subject: "Chemistry",
    dueDate: "2026-09-15",
    instructions: "In-app checkpoint quiz covering molecules and compounds.",
    status: "published",
  },
  {
    id: "AS-5",
    teacherId: "TCH-201",
    title: "Bonding Cave Boss Prep Quiz",
    type: "quiz",
    lessonId: null,
    quizId: "QZ-4",
    classId: "10",
    boardId: "CBSE",
    subjectId: "SUB-1",
    subject: "Chemistry",
    dueDate: "2026-09-20",
    instructions: "Practice quiz before the Bonding Cave boss battle.",
    status: "published",
  },
  {
    id: "AS-6",
    teacherId: "TCH-202",
    title: "Acids & Bases Worksheet",
    type: "lesson",
    lessonId: "L-7",
    quizId: null,
    classId: "11",
    boardId: "MH",
    subjectId: "SUB-1",
    subject: "Chemistry",
    dueDate: "2026-09-10",
    instructions: "Household acids and bases \u2014 identify five examples from home.",
    status: "published",
  },
  {
    id: "AS-7",
    teacherId: "TCH-202",
    title: "Household Indicators Reading",
    type: "lesson",
    lessonId: "L-8",
    quizId: null,
    classId: "11",
    boardId: "MH",
    subjectId: "SUB-1",
    subject: "Chemistry",
    dueDate: "2026-09-14",
    instructions: "Short reading on turmeric and litmus as natural indicators.",
    status: "draft",
  },
  {
    id: "AS-8",
    teacherId: "TCH-202",
    title: "Acid Base Island Mastery Quiz",
    type: "quiz",
    lessonId: null,
    quizId: "QZ-6",
    classId: "11",
    boardId: "MH",
    subjectId: "SUB-1",
    subject: "Chemistry",
    dueDate: "2026-09-18",
    instructions: "Full mastery test for the Acid Base Island world.",
    status: "published",
  },
];

export const RESULTS = [
  { id: "RES-1", assignmentId: "AS-1", studentId: "STU-1001", status: "graded", score: 92, submittedAt: "2026-09-04", feedback: "Great work labelling the subatomic particles." },
  { id: "RES-2", assignmentId: "AS-2", studentId: "STU-1008", status: "graded", score: 74, submittedAt: "2026-09-07", feedback: "Good effort \u2014 review electron shells before the next quiz." },
  { id: "RES-3", assignmentId: "AS-3", studentId: "STU-1001", status: "missing", score: null, submittedAt: null, feedback: "" },
  { id: "RES-4", assignmentId: "AS-4", studentId: "STU-1008", status: "submitted", score: null, submittedAt: "2026-09-14", feedback: "" },
  { id: "RES-5", assignmentId: "AS-5", studentId: "STU-1010", status: "graded", score: 81, submittedAt: "2026-09-19", feedback: "Solid understanding of ionic vs covalent bonding." },
  { id: "RES-6", assignmentId: "AS-6", studentId: "STU-1007", status: "graded", score: 88, submittedAt: "2026-09-09", feedback: "Nice real-world examples." },
  { id: "RES-7", assignmentId: "AS-8", studentId: "STU-1007", status: "submitted", score: null, submittedAt: "2026-09-17", feedback: "" },
];

// --- Subject-aware demo assignments/results ---
//
// A teacher's roster comes from the real API and is already subject-scoped,
// but assignments/results live in the mock store, whose static seed is
// Chemistry-only. When a teacher has authored nothing yet, TeacherContext
// shows a demo set *derived from that teacher's own curriculum* (its
// lessons/quizzes carry the registered subject names), so a Physics teacher
// sees Physics assignments -- not the generic Chemistry seed. The final
// fallback to the static seed (below) is so a subject with no lessons and
// no quizzes still produces something instead of a blank page.

function pickClassForAssignment(classes) {
  if (!classes || !classes.length) return { grade: "9", board: "CBSE" };
  const found = classes.find((c) => String(c.grade) === "9") || classes[0];
  return { grade: String(found.grade), board: found.board || "CBSE" };
}

function dueDates(seed) {
  return "2026-09-" + String(seed).padStart(2, "0");
}

export function buildSubjectAssignments({ curriculum, subjects, classes, teacherId }) {
  const lessonsBySubject = {};
  const quizzesBySubject = {};

  const courseById = Object.fromEntries(curriculum.courses.map((c) => [c.id, c]));
  const courseByLessonId = {};
  for (const chapter of curriculum.chapters) {
    for (const lesson of curriculum.lessons) {
      if (lesson.chapterId === chapter.id && courseById[chapter.courseId]) {
        courseByLessonId[lesson.id] = courseById[chapter.courseId];
      }
    }
  }
  for (const lesson of curriculum.lessons) {
    const subject = courseByLessonId[lesson.id]?.subject ?? "General";
    (lessonsBySubject[subject] = lessonsBySubject[subject] || []).push(lesson);
  }
  for (const quiz of curriculum.quizzes) {
    const subject = courseById[quiz.courseId]?.subject ?? "General";
    (quizzesBySubject[subject] = quizzesBySubject[subject] || []).push(quiz);
  }

  const rows = [];
  const { grade, board } = pickClassForAssignment(classes);
  let dateSeed = 2;

  for (const subject of subjects) {
    const subjectLessons = lessonsBySubject[subject] || [];
    const subjectQuizzes = quizzesBySubject[subject] || [];
    const prefix = subject.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "") || "GEN";

    subjectLessons.slice(0, 2).forEach((lesson, i) => {
      rows.push({
        id: `AS-${prefix}-${i + 1}`,
        teacherId,
        title: `${lesson.title} \u2014 Homework`,
        type: "lesson",
        lessonId: lesson.id,
        quizId: null,
        classId: grade,
        boardId: board,
        subject,
        dueDate: dueDates(dateSeed + i),
        instructions: "Complete the lesson and its practice questions.",
        status: "published",
      });
    });

    subjectQuizzes.slice(0, 1).forEach((quiz, i) => {
      rows.push({
        id: `AS-${prefix}-Q${i + 1}`,
        teacherId,
        title: `${quiz.title} \u2014 Checkpoint Quiz`,
        type: "quiz",
        lessonId: null,
        quizId: quiz.id,
        classId: grade,
        boardId: board,
        subject,
        dueDate: dueDates(dateSeed + 2 + i),
        instructions: "In-app checkpoint quiz for this world.",
        status: "published",
      });
      dateSeed += 2;
    });

    // A subject with no curriculum content still needs one visible row, or
    // the Assignments page would read "No data available yet".
    if (!subjectLessons.length && !subjectQuizzes.length) {
      rows.push({
        id: `AS-${prefix}-0`,
        teacherId,
        title: `${subject} Practice Assignment`,
        type: "lesson",
        lessonId: null,
        quizId: null,
        classId: grade,
        boardId: board,
        subject,
        dueDate: dueDates(dateSeed),
        instructions: "Practice assignment for your class.",
        status: "draft",
      });
      dateSeed += 2;
    }
    dateSeed += 2;
  }

  return rows;
}

export function buildSubjectResults({ assignments, students }) {
  const rows = [];
  const pool = Array.isArray(students) ? students : [];
  const bucket = pool.length ? Math.min(pool.length, 5) : 4;
  let seq = 1;

  for (const assignment of assignments) {
    for (let i = 0; i < bucket; i++) {
      const student = pool.length ? pool[i % pool.length] : null;
      const graded = (i + 1) % 4 !== 0;
      rows.push({
        id: `RES-${assignment.id}-${i + 1}`,
        assignmentId: assignment.id,
        studentId: student ? student.id : `STU-${assignment.id}-${i + 1}`,
        status: graded ? "graded" : i % 3 === 0 ? "submitted" : "missing",
        score: graded ? 55 + ((seq * 7) % 46) : null,
        submittedAt: graded || i % 3 === 0 ? assignment.dueDate : null,
        feedback: graded ? "Solid work \u2014 keep it up." : "",
      });
      seq++;
    }
  }

  return rows;
}
