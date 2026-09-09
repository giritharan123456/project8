import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
  ADMIN_USERS,
  COURSES,
  CHAPTERS,
  QUIZZES,
} from "./mockData.js";
import {
  getAdminSubjects, createAdminSubject, updateAdminSubject, deleteAdminSubject,
  getAdminBoards, createAdminBoard, updateAdminBoard, deleteAdminBoard,
  getAdminClasses, createAdminClass, updateAdminClass, deleteAdminClass,
  getAdminStudents, createAdminStudent, updateAdminStudent, deleteAdminStudent,
  getAdminTeachers, createAdminTeacher, updateAdminTeacher, deleteAdminTeacher,
  getAdminCoursesList,
  getAdminLessons, createAdminLesson, updateAdminLesson, deleteAdminLesson,
  getAdminQuestions, createAdminQuestion, updateAdminQuestion, deleteAdminQuestion,
} from "./api.js";

// One localStorage-backed CRUD store shared by every /admin page that
// isn't wired to a real table yet. Resources are seeded from mockData.js
// the first time the app runs in a browser and then persisted, so edits
// survive a refresh without needing real backend tables for Courses/
// Chapters/Quizzes (see mockData.js's header comment).
//
// Subjects/Boards/Classes/Students/Teachers/Lessons/Questions graduated
// off this store - they now read and write real tables (`subjects`/
// `boards`/`classes`/`players`/`lessons`/`questions`, see admin/api.js and
// server/src/routes/admin.js). REAL_RESOURCES below is what routes each
// resource's addItem/updateItem/deleteItem to the right place while every
// page keeps calling the exact same useAdminData() hook.
// v5: dropped lessons/questions from the localStorage seed now that
// they're real too (repointed to a real Course instead of the mock
// chapterId/lessonId fields they shipped with - see LessonsPage.jsx/
// QuestionsPage.jsx); anyone with a v4 snapshot just stops reading those
// two keys out of it (harmless leftover in their localStorage).
// v6: multi-subject curriculum seed (see mockData.js's
// buildSubjectCurriculum) -- Courses/Chapters/Quizzes now include Physics,
// Mathematics, English, Biology and Tamil content alongside Chemistry, so
// the admin console sees the whole catalog.
const STORAGE_KEY = "chemquest_admin_v6";

const SEED = {
  adminUsers: ADMIN_USERS,
  courses: COURSES,
  chapters: CHAPTERS,
  quizzes: QUIZZES,
};

const REAL_RESOURCES = {
  subjects: { get: getAdminSubjects, create: createAdminSubject, update: updateAdminSubject, del: deleteAdminSubject },
  boards: { get: getAdminBoards, create: createAdminBoard, update: updateAdminBoard, del: deleteAdminBoard },
  classes: { get: getAdminClasses, create: createAdminClass, update: updateAdminClass, del: deleteAdminClass },
  students: { get: getAdminStudents, create: createAdminStudent, update: updateAdminStudent, del: deleteAdminStudent },
  teachers: { get: getAdminTeachers, create: createAdminTeacher, update: updateAdminTeacher, del: deleteAdminTeacher },
  lessons: { get: getAdminLessons, create: createAdminLesson, update: updateAdminLesson, del: deleteAdminLesson },
  questions: { get: getAdminQuestions, create: createAdminQuestion, update: updateAdminQuestion, del: deleteAdminQuestion },
};

function loadInitialState() {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw);
    // Merge with SEED so any resource added to mockData.js after a user's
    // last visit still shows up instead of being silently missing. Empty
    // arrays saved to storage do NOT overwrite a non-empty seed - a stale
    // or cleared store must not leave every list saying "No data available
    // yet" forever.
    const merged = { ...SEED, ...parsed };
    for (const k of Object.keys(SEED)) {
      if (Array.isArray(parsed[k]) && parsed[k].length === 0 && Array.isArray(SEED[k]) && SEED[k].length > 0) {
        merged[k] = SEED[k];
      }
    }
    return merged;
  } catch {
    return SEED;
  }
}

function persist(state) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable (e.g. private browsing) -- fail silently,
    // the admin still works for the rest of the session.
  }
}

function genId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}

const AdminDataContext = createContext(null);

export function AdminProvider({ children }) {
  const [state, setState] = useState(loadInitialState);
  // Real-table resources (subjects/boards/classes/students/teachers/
  // lessons/questions) fetched from the API, kept separate from the
  // localStorage-backed `state` above.
  const [realData, setRealData] = useState({
    subjects: [], boards: [], classes: [], students: [], teachers: [], lessons: [], questions: [],
  });
  const [realLoading, setRealLoading] = useState({
    subjects: true, boards: true, classes: true, students: true, teachers: true, lessons: true, questions: true,
  });

  // Read-only real Course list (the `worlds` table) - Admin > Courses
  // itself is still mock/localStorage, but Lessons/Questions need a real
  // Course to select and validate against, so this is fetched once,
  // separately from the full-CRUD REAL_RESOURCES loop below.
  const [courseCatalog, setCourseCatalog] = useState([]);
  useEffect(() => {
    getAdminCoursesList()
      .then(setCourseCatalog)
      .catch((err) => console.error("Failed to load admin/courses", err));
  }, []);

  const refetch = useCallback(async (resource) => {
    const rows = await REAL_RESOURCES[resource].get();
    setRealData((prev) => ({ ...prev, [resource]: rows }));
    setRealLoading((prev) => ({ ...prev, [resource]: false }));
  }, []);

  useEffect(() => {
    Object.keys(REAL_RESOURCES).forEach((resource) => {
      refetch(resource).catch((err) => {
        console.error(`Failed to load admin/${resource}`, err);
        setRealLoading((prev) => ({ ...prev, [resource]: false }));
      });
    });
  }, [refetch]);

  const addItem = useCallback(
    (resource, item) => {
      if (REAL_RESOURCES[resource]) {
        return REAL_RESOURCES[resource].create(item).then(() => refetch(resource));
      }
      setState((prev) => {
        const id = item.id?.trim() ? item.id : genId(resource.slice(0, 3).toUpperCase());
        const next = { ...prev, [resource]: [{ ...item, id }, ...(prev[resource] ?? [])] };
        persist(next);
        return next;
      });
      return Promise.resolve();
    },
    [refetch]
  );

  const updateItem = useCallback(
    (resource, id, patch) => {
      if (REAL_RESOURCES[resource]) {
        return REAL_RESOURCES[resource].update(id, patch).then(() => refetch(resource));
      }
      setState((prev) => {
        const next = {
          ...prev,
          [resource]: (prev[resource] ?? []).map((row) => (row.id === id ? { ...row, ...patch } : row)),
        };
        persist(next);
        return next;
      });
      return Promise.resolve();
    },
    [refetch]
  );

  const deleteItem = useCallback(
    (resource, id) => {
      if (REAL_RESOURCES[resource]) {
        return REAL_RESOURCES[resource].del(id).then(() => refetch(resource));
      }
      setState((prev) => {
        const next = { ...prev, [resource]: (prev[resource] ?? []).filter((row) => row.id !== id) };
        persist(next);
        return next;
      });
      return Promise.resolve();
    },
    [refetch]
  );

  const resetAll = useCallback(() => {
    setState(SEED);
    persist(SEED);
  }, []);

  const value = useMemo(
    () => ({
      data: { ...state, ...realData, courseCatalog },
      loading: realLoading,
      addItem,
      updateItem,
      deleteItem,
      resetAll,
    }),
    [state, realData, realLoading, courseCatalog, addItem, updateItem, deleteItem, resetAll]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminProvider");
  return ctx;
}
