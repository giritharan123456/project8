import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import * as teacherApi from "../api/teacher.js";
import { BOARDS, COURSES, CHAPTERS, LESSONS, QUESTIONS, QUIZZES } from "../admin/mockData.js";
import { ASSIGNMENTS, RESULTS, buildSubjectAssignments, buildSubjectResults } from "./teacherMockData.js";
import { subjectDisplayNames } from "../data/subjects.js";

// Roster data (school, students, classes, subjects, leaderboard, reports)
// comes from the real backend (server/src/routes/teacher.js) and is
// already scoped to the signed-in teacher's school_id server-side -
// Section 4's "don't depend only on frontend filtering" is satisfied
// there, not here. This context just holds what the API returned; it
// never re-filters roster data by school on the client.
//
// Courses/chapters/lessons/questions/quizzes/assignments/results have no
// backend of their own yet, so they stay on the same localStorage-backed
// mock store the Admin console uses (shared via ADMIN_STORAGE_KEY, so a
// teacher editing a lesson sees the same content an admin would).
//
// v6: the mock store is now multi-subject (see mockData.js's
// buildSubjectCurriculum). Teacher pages filter the curriculum down to the
// subjects this teacher registered for, so a Physics teacher sees
// Physics-branded courses instead of a Chemistry-only store.
const ADMIN_STORAGE_KEY = "chemquest_admin_v6";
const TEACHER_STORAGE_KEY = "chemquest_teacher_v1";

const CONTENT_SEED = { courses: COURSES, chapters: CHAPTERS, lessons: LESSONS, questions: QUESTIONS, quizzes: QUIZZES };
const TEACHER_SEED = { assignments: ASSIGNMENTS, results: RESULTS };

const CONTENT_EDITABLE_RESOURCES = new Set(["courses", "lessons", "questions"]);
const TEACHER_OWNED_RESOURCES = new Set(["assignments", "results"]);

function loadJSON(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const merged = { ...fallback };
    for (const k of Object.keys(parsed)) {
      const stored = parsed[k];
      const seed = fallback[k];
      // An explicitly-saved empty array only shadows the seed when the seed
      // is empty too. Otherwise a stale/cleared localStorage (e.g. from an
      // older app version that seeded nothing) would wipe every list and
      // every page would read "No data available yet" forever.
      if (Array.isArray(stored) && stored.length === 0 && Array.isArray(seed) && seed.length > 0) {
        continue;
      }
      merged[k] = stored;
    }
    return merged;
  } catch {
    return fallback;
  }
}

function persistJSON(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full/unavailable -- fail silently, session still works.
  }
}

function genId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}

const TeacherDataContext = createContext(null);

export function TeacherProvider({ children }) {
  const { user } = useAuth();

  // -- mock curriculum + teacher-owned content, unchanged mechanism --
  const [contentData, setContentData] = useState(() => loadJSON(ADMIN_STORAGE_KEY, CONTENT_SEED));
  const [teacherOwnedData, setTeacherOwnedData] = useState(() => loadJSON(TEACHER_STORAGE_KEY, TEACHER_SEED));

  const addItem = useCallback((resource, item) => {
    const id = item.id?.trim ? (item.id.trim() ? item.id : genId(resource.slice(0, 3).toUpperCase())) : genId(resource.slice(0, 3).toUpperCase());
    if (TEACHER_OWNED_RESOURCES.has(resource)) {
      setTeacherOwnedData((prev) => {
        const next = { ...prev, [resource]: [{ ...item, id }, ...(prev[resource] ?? [])] };
        persistJSON(TEACHER_STORAGE_KEY, next);
        return next;
      });
    } else if (CONTENT_EDITABLE_RESOURCES.has(resource)) {
      setContentData((prev) => {
        const next = { ...prev, [resource]: [{ ...item, id }, ...(prev[resource] ?? [])] };
        persistJSON(ADMIN_STORAGE_KEY, next);
        return next;
      });
    }
  }, []);

  const updateItem = useCallback((resource, id, patch) => {
    if (TEACHER_OWNED_RESOURCES.has(resource)) {
      setTeacherOwnedData((prev) => {
        const next = { ...prev, [resource]: (prev[resource] ?? []).map((row) => (row.id === id ? { ...row, ...patch } : row)) };
        persistJSON(TEACHER_STORAGE_KEY, next);
        return next;
      });
    } else if (CONTENT_EDITABLE_RESOURCES.has(resource)) {
      setContentData((prev) => {
        const next = { ...prev, [resource]: (prev[resource] ?? []).map((row) => (row.id === id ? { ...row, ...patch } : row)) };
        persistJSON(ADMIN_STORAGE_KEY, next);
        return next;
      });
    }
  }, []);

  const deleteItem = useCallback((resource, id) => {
    if (TEACHER_OWNED_RESOURCES.has(resource)) {
      setTeacherOwnedData((prev) => {
        const next = { ...prev, [resource]: (prev[resource] ?? []).filter((row) => row.id !== id) };
        persistJSON(TEACHER_STORAGE_KEY, next);
        return next;
      });
    } else if (CONTENT_EDITABLE_RESOURCES.has(resource)) {
      setContentData((prev) => {
        const next = { ...prev, [resource]: (prev[resource] ?? []).filter((row) => row.id !== id) };
        persistJSON(ADMIN_STORAGE_KEY, next);
        return next;
      });
    }
  }, []);

  // -- real, school-scoped roster data from the API --
  const [school, setSchool] = useState(null);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [reports, setReports] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [rosterLoading, setRosterLoading] = useState(true);
  const [rosterError, setRosterError] = useState(null);

  const loadRoster = useCallback(async () => {
    setRosterLoading(true);
    setRosterError(null);
    const results = await Promise.allSettled([
      teacherApi.getMySchool(),
      teacherApi.getStudents(),
      teacherApi.getClasses(),
      teacherApi.getSubjects(),
      teacherApi.getLeaderboard(),
      teacherApi.getReports(),
      teacherApi.getQuizzes(),
      teacherApi.getAnalytics(),
    ]);
    const ok = (index) => (results[index]?.status === "fulfilled" ? results[index].value : null);
    setSchool(ok(0));
    setStudents(ok(1) ?? []);
    setClasses(ok(2) ?? []);
    setSubjects(ok(3)?.subjects ?? []);
    setLeaderboard(ok(4) ?? []);
    setReports(ok(5));
    setQuizResults(ok(6) ?? []);
    setAnalytics(ok(7));
    // Individual endpoints can legitimately fail for some accounts (e.g. an
    // admin has no teacher row or single school); only treat it as a hard
    // error if *every* request failed.
    if (results.every((r) => r.status === "rejected")) {
      setRosterError(
        results.map((r) => r.reason?.message ?? "Request failed").join("; ") ||
          "Couldn't load your school's data."
      );
    }
    setRosterLoading(false);
  }, []);

  useEffect(() => {
    if (user) loadRoster();
  }, [user, loadRoster]);

  // Subject-scoped mock curriculum. `subjects` comes from the API as the
  // teacher's registered subjects (display names on fresh signups, lowercase
  // codes on legacy rows) -- subjectDisplayNames normalizes both. The full
  // store is multi-subject now, so these filters are what keep each teacher's
  // Courses/Lessons/Questions/Quizzes pages showing their subject's content.
  const subjectNameSet = useMemo(() => new Set(subjectDisplayNames(subjects)), [subjects]);
  const curriculum = useMemo(() => {
    const courses = (contentData.courses ?? []).filter((c) => subjectNameSet.has(c.subject));
    const courseIds = new Set(courses.map((c) => c.id));
    const chapters = (contentData.chapters ?? []).filter((ch) => courseIds.has(ch.courseId));
    const chapterIds = new Set(chapters.map((ch) => ch.id));
    const lessons = (contentData.lessons ?? []).filter((l) => chapterIds.has(l.chapterId));
    const lessonIds = new Set(lessons.map((l) => l.id));
    const questions = (contentData.questions ?? []).filter((q) => lessonIds.has(q.lessonId));
    const quizzes = (contentData.quizzes ?? []).filter((qz) => courseIds.has(qz.courseId));
    return { courses, chapters, lessons, questions, quizzes };
  }, [contentData, subjectNameSet]);

  // Assignments/results live in the shared mock store until they get a
  // backend. Rows authored by this teacher always win; a teacher who has
  // authored nothing sees a demo set *derived from their own subject
  // curriculum* (see buildSubjectAssignments/Results), so a Physics teacher
  // sees Physics assignments instead of the Chemistry-only static seed.
  const myAssignments = useMemo(() => {
    const all = teacherOwnedData.assignments ?? [];
    const authored = all.filter((a) => a.teacherId === user?.id);
    if (authored.length) return authored;
    return buildSubjectAssignments({
      curriculum,
      subjects: subjectDisplayNames(subjects),
      classes,
      teacherId: user?.id,
    });
  }, [teacherOwnedData.assignments, user?.id, curriculum, subjects, classes]);
  const myAssignmentIds = useMemo(() => myAssignments.map((a) => a.id), [myAssignments]);
  const myResults = useMemo(() => {
    const all = teacherOwnedData.results ?? [];
    const authored = all.filter((r) => myAssignmentIds.includes(r.assignmentId));
    if (authored.length) return authored;
    return buildSubjectResults({ assignments: myAssignments, students });
  }, [teacherOwnedData.results, myAssignmentIds, myAssignments, students]);

  const data = useMemo(
    () => ({
      // real, school-scoped
      school,
      students,
      classes,
      subjects,
      leaderboard,
      reports,
      quizResults,
      analytics,
      // mock curriculum, shared with the admin console, scoped to this
      // teacher's registered subjects
      courses: curriculum.courses,
      chapters: curriculum.chapters,
      lessons: curriculum.lessons,
      questions: curriculum.questions,
      quizzes: curriculum.quizzes,
      // mock, teacher-owned
      assignments: myAssignments,
      results: myResults,
    }),
    [school, students, classes, subjects, leaderboard, reports, quizResults, analytics, curriculum, myAssignments, myResults]
  );

  const value = useMemo(
    () => ({
      currentTeacher: user,
      data,
      rosterLoading,
      rosterError,
      refetchRoster: loadRoster,
      lookups: { boards: BOARDS },
      addItem,
      updateItem,
      deleteItem,
    }),
    [user, data, rosterLoading, rosterError, loadRoster, addItem, updateItem, deleteItem]
  );

  return <TeacherDataContext.Provider value={value}>{children}</TeacherDataContext.Provider>;
}

export function useTeacherData() {
  const ctx = useContext(TeacherDataContext);
  if (!ctx) throw new Error("useTeacherData must be used within TeacherProvider");
  return ctx;
}
