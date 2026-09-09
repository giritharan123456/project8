// client/src/data/subjectCatalog.js
//
// Replaces the old flat, global `SUBJECT_CATALOG` array. Subjects now vary by
// Board + Class (and, for Class 11/12, Stream), matching how real curricula
// diverge at those stages.
//
// ASSUMPTIONS BAKED IN BELOW â€” confirm with the TL/brief before shipping:
//   1. Grade cutoffs: 4â€“5 = "primary" (broad EVS, no split sciences),
//      6â€“10 = "secondary" (standard split-subject set),
//      11â€“12 = "senior secondary" (stream-based). The brief flags these
//      cutoffs as unconfirmed â€” this is a reasonable default, not a fact.
//   2. Exact subject lists per board are approximations of real-world
//      curricula, not sourced from an authoritative board syllabus doc.
//      In particular:
//        - ICSE is modeled with a combined "Physical Science" paper for
//          Physics+Chemistry at grades 9â€“10 (as ICSE actually does), plus a
//          separate Biology â€” rather than three separate science subjects.
//        - IB does not really have Science/Commerce/Arts "streams" at the
//          Diploma level (11â€“12); students pick subjects across six groups
//          instead. The stream-shaped lookup below is a *simplified
//          approximation* for this app's flow, not the real IB DP model â€”
//          flagged with `note` fields. Confirm whether IB should instead get
//          its own non-stream selection UI.
//        - Cambridge IGCSE is normally only grades 9â€“10; grades 11â€“12 would
//          really be A-Levels, a different qualification. 11â€“12 entries for
//          IGCSE are marked `status: "coming_soon"` for this reason rather
//          than guessing at an A-Level subject list.
//   3. Only Chemistry, Mathematics, Physics, English, Biology, Hindi,
//      Tamil, Social Science, and Computer Science have real built content
//      right now (see WORLD_TEMPLATE / MATH_WORLD_TEMPLATE /
//      PHYSICS_WORLD_TEMPLATE / ENGLISH_WORLD_TEMPLATE /
//      BIOLOGY_WORLD_TEMPLATE / HINDI_WORLD_TEMPLATE /
//      TAMIL_WORLD_TEMPLATE / SOCIAL_SCIENCE_WORLD_TEMPLATE /
//      COMPUTER_SCIENCE_WORLD_TEMPLATE in content.js), so every other
//      subject is marked `status: "coming_soon"` regardless of board/class,
//      so nothing routes into a mislabeled world. Tamil is TN's primary
//      second-language subject (not an elective) and gets its own "TAM"
//      code via `secondLanguageSubject()` below, same treatment as Hindi.
//      Marathi/French (MH/IB/IGCSE's second-language slot) still share the
//      generic "L2" coming_soon placeholder since no real content exists
//      for them yet. This also includes ICSE's separate History & Civics /
//      Geography subjects, which only exist as standalone "coming_soon"
//      placeholders since ICSE splits what other boards call "Social
//      Science" into two separate papers.
//
// Downstream components (SubjectsPage, WorldMapPage, etc.) should not need
// to change shape â€” each subject object keeps the existing
// { code, name, tagline, icon, accent, status } fields.

function subject(code, name, tagline, icon, accent, status = "coming_soon") {
  return { code, name, tagline, icon, accent, status };
}

// Shared subject building blocks so board variants don't have to repeat
// nearly-identical objects. `lang` lets each board plug in its own
// second-language name (Hindi, Tamil, Marathi, French, etc.).
const MATH = () => subject("MATH", "Mathematics", "Numbers, algebra, and problem solving.", "Calculator", "#38D9F4", "available");
const PHYSICS = () => subject("PHY", "Physics", "How the physical world behaves.", "Atom", "#806BFF", "available");
const CHEMISTRY = () => subject("CHEM", "Chemistry", "Reactions, elements, and the world of atoms.", "FlaskConical", "#4ADE80", "available");
const BIOLOGY = () => subject("BIO", "Biology", "Life, cells, and living systems.", "Microscope", "#FCD34D", "available");
const PHYSICAL_SCIENCE = () => subject("PSCI", "Physical Science", "Combined Physics & Chemistry paper.", "TestTube", "#806BFF");
const ENGLISH = () => subject("ENG", "English", "Reading, writing, and communication.", "BookOpen", "#38D9F4", "available");
const SECOND_LANGUAGE = (lang) => subject("L2", lang, `Reading, writing, and grammar in ${lang}.`, "Languages", "#F87171");
const HINDI = () => subject("HIN", "Hindi", "\u0935\u094d\u092f\u093e\u0915\u0930\u0923, \u0932\u0947\u0916\u0928 \u0914\u0930 \u0938\u093e\u0939\u093f\u0924\u094d\u092f \u2014 grammar, writing, and literature.", "Languages", "#F87171", "available");
const TAMIL = () => subject("TAM", "Tamil", "\u0b8e\u0bb4\u0bc1\u0ba4\u0bcd\u0ba4\u0bc1, \u0b87\u0bb2\u0b95\u0bcd\u0b95\u0ba3\u0bae\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b87\u0bb2\u0b95\u0bcd\u0b95\u0bbf\u0baf\u0bae\u0bcd \u2014 script, grammar, and literature.", "Languages", "#F87171", "available");

// Hindi (CBSE/ICSE's default second language) and Tamil (TN's primary
// second-language subject, not a generic elective) both have real built
// content (see HINDI_WORLD_TEMPLATE / TAMIL_WORLD_TEMPLATE in content.js).
// Marathi/French, plugged in as the second-language slot for MH/IB/IGCSE,
// stay on the generic "L2" coming_soon placeholder below since no real
// content exists for them yet â€” giving them the dedicated "HIN"/"TAM"
// codes would incorrectly surface Hindi/Tamil's worlds under a
// Marathi/French label.
function secondLanguageSubject(lang) {
  if (lang === "Hindi") return HINDI();
  if (lang === "Tamil") return TAMIL();
  return SECOND_LANGUAGE(lang);
}
const SOCIAL_SCIENCE = () => subject("SST", "Social Science", "History, civics, and geography together.", "Landmark", "#FCD34D", "available");
const HISTORY_CIVICS = () => subject("HCG", "History & Civics", "Past events and how government works.", "ScrollText", "#F87171");
const GEOGRAPHY = () => subject("GEO", "Geography", "Maps, places, and the physical world.", "Globe2", "#4ADE80");
const COMPUTER_SCIENCE = () => subject("CS", "Computer Science", "Programming logic and computational thinking.", "Cpu", "#806BFF", "available");
const EVS = () => subject("EVS", "Environmental Studies", "The world around us â€” nature, health, and community.", "Leaf", "#4ADE80");
const ACCOUNTANCY = () => subject("ACC", "Accountancy", "Recording and reporting business finances.", "Calculator", "#FCD34D");
const BUSINESS_STUDIES = () => subject("BST", "Business Studies", "How businesses are organized and run.", "Briefcase", "#38D9F4");
const ECONOMICS = () => subject("ECO", "Economics", "How markets, money, and trade work.", "TrendingUp", "#4ADE80");
const HISTORY = () => subject("HIST", "History", "Major events that shaped the world.", "ScrollText", "#F87171");
const POLITICAL_SCIENCE = () => subject("POL", "Political Science", "Governments, power, and public policy.", "Landmark", "#806BFF");
const PSYCHOLOGY = () => subject("PSY", "Psychology", "How people think, feel, and behave.", "Brain", "#FCD34D");

// --- Tier builders -----------------------------------------------------

function primarySubjects(lang) {
  return [ENGLISH(), secondLanguageSubject(lang), MATH(), EVS(), COMPUTER_SCIENCE()];
}

function secondarySubjects(lang, { combinedScience = false } = {}) {
  const science = combinedScience
    ? [PHYSICAL_SCIENCE(), BIOLOGY()]
    : [PHYSICS(), CHEMISTRY(), BIOLOGY()];
  return [MATH(), ...science, ENGLISH(), secondLanguageSubject(lang), SOCIAL_SCIENCE(), COMPUTER_SCIENCE()];
}

function scienceStream() {
  return [PHYSICS(), CHEMISTRY(), MATH(), BIOLOGY(), ENGLISH(), COMPUTER_SCIENCE()];
}

function commerceStream() {
  return [ACCOUNTANCY(), BUSINESS_STUDIES(), ECONOMICS(), MATH(), ENGLISH()];
}

function artsStream() {
  return [HISTORY(), POLITICAL_SCIENCE(), GEOGRAPHY(), ECONOMICS(), PSYCHOLOGY(), ENGLISH()];
}

function seniorSecondaryByStream() {
  return {
    "11-science": scienceStream(),
    "11-commerce": commerceStream(),
    "11-arts": artsStream(),
    "12-science": scienceStream(),
    "12-commerce": commerceStream(),
    "12-arts": artsStream(),
  };
}

// --- Per-board assembly --------------------------------------------------

function buildBoard(lang, { combinedScience = false, senior = seniorSecondaryByStream() } = {}) {
  return {
    "4": primarySubjects(lang),
    "5": primarySubjects(lang),
    "6": secondarySubjects(lang, { combinedScience }),
    "7": secondarySubjects(lang, { combinedScience }),
    "8": secondarySubjects(lang, { combinedScience }),
    "9": secondarySubjects(lang, { combinedScience }),
    "10": secondarySubjects(lang, { combinedScience }),
    ...senior,
  };
}

export const SUBJECTS_BY_BOARD_CLASS = {
  // CBSE commonly offers Tamil alongside Hindi as an additional language
  // option â€” surface it as its own extra card wherever Hindi appears
  // (grades 4â€“10; second-language subjects drop out at the senior-secondary
  // stream stage same as Hindi does), rather than replacing Hindi.
  CBSE: (() => {
    const board = buildBoard("Hindi");
    for (const grade of ["4", "5", "6", "7", "8", "9", "10"]) {
      board[grade] = [...board[grade], TAMIL()];
    }
    return board;
  })(),

  // ICSE: combined "Physical Science" paper at 9â€“10 instead of separate
  // Physics/Chemistry, plus History & Civics + Geography instead of one
  // merged Social Science subject.
  ICSE: (() => {
    const board = buildBoard("Hindi", { combinedScience: true });
    for (const grade of ["6", "7", "8", "9", "10"]) {
      board[grade] = board[grade]
        .filter((s) => s.code !== "SST")
        .concat([HISTORY_CIVICS(), GEOGRAPHY()]);
    }
    return board;
  })(),

  TN: buildBoard("Tamil"),
  MH: buildBoard("Marathi"),

  // IB: Diploma-level (11â€“12) streams are a simplified approximation, not
  // the real subject-group model â€” see note at top of file.
  IB: buildBoard("French", {
    senior: {
      "11-science": scienceStream().map((s) => ({ ...s, note: "Approximation of IB DP Group 4/5 sciences." })),
      "11-commerce": commerceStream().map((s) => ({ ...s, note: "Approximation of IB DP Individuals & Societies (Business/Economics)." })),
      "11-arts": artsStream().map((s) => ({ ...s, note: "Approximation of IB DP Individuals & Societies / Arts groups." })),
      "12-science": scienceStream().map((s) => ({ ...s, note: "Approximation of IB DP Group 4/5 sciences." })),
      "12-commerce": commerceStream().map((s) => ({ ...s, note: "Approximation of IB DP Individuals & Societies (Business/Economics)." })),
      "12-arts": artsStream().map((s) => ({ ...s, note: "Approximation of IB DP Individuals & Societies / Arts groups." })),
    },
  }),

  // IGCSE: Cambridge IGCSE is normally grades 9â€“10 only. 11â€“12 would really
  // be A-Levels (a different qualification) â€” mark as coming_soon rather
  // than guessing at an A-Level subject list.
  IGCSE: (() => {
    const board = buildBoard("French", { combinedScience: false });
    for (const key of ["11-science", "11-commerce", "11-arts", "12-science", "12-commerce", "12-arts"]) {
      board[key] = [
        subject(
          "ALVL",
          "A-Levels (Coming Soon)",
          "Cambridge IGCSE covers grades 9â€“10; A-Level content is on the roadmap.",
          "Globe2",
          "#806BFF",
          "coming_soon"
        ),
      ];
    }
    return board;
  })(),
};

/**
 * Returns the subject list for a given board + grade (+ stream for 11/12).
 *
 * @param {string} board - board code, e.g. "CBSE", "ICSE", "TN", "MH", "IB", "IGCSE"
 * @param {string|number} grade - grade/class number, e.g. 9 or "9"
 * @param {string} [stream] - required for grade 11/12: "science" | "commerce" | "arts"
 * @returns {Array<{code:string,name:string,tagline:string,icon:string,accent:string,status:string}>}
 */
export function getSubjectsFor(board, grade, stream) {
  const boardData = SUBJECTS_BY_BOARD_CLASS[board];
  if (!boardData) return [];

  const gradeNum = Number(grade);
  const key = gradeNum >= 11 ? `${gradeNum}-${(stream || "").toLowerCase()}` : String(gradeNum);

  return boardData[key] ?? [];
}

// --- Back-compat lookups --------------------------------------------------
//
// SideNav.jsx and WorldMapPage.jsx only ever have a bare subject `code`
// on hand (no board/class context is threaded through for this lookup),
// and just want that code's display name for a header/label. Since a
// subject's { name, icon, accent } is identical everywhere it appears
// (only *availability* varies by board/class), it's safe to resolve a
// code by scanning every board/class list once rather than requiring
// every caller to pass board/grade through.
let _codeIndex = null;
function codeIndex() {
  if (_codeIndex) return _codeIndex;
  _codeIndex = new Map();
  for (const boardData of Object.values(SUBJECTS_BY_BOARD_CLASS)) {
    for (const subjects of Object.values(boardData)) {
      for (const s of subjects) {
        if (!_codeIndex.has(s.code)) _codeIndex.set(s.code, s);
      }
    }
  }
  return _codeIndex;
}

/**
 * Looks up a subject by its `code` (e.g. "CHEM"), regardless of which
 * board/class it came from. Returns null if the code isn't found in any
 * board/class list.
 */
export function getSubjectByCode(code) {
  if (!code) return null;
  return codeIndex().get(code) ?? codeIndex().get(String(code).toUpperCase()) ?? null;
}

/**
 * Display name for a subject code, falling back to the raw code (or
 * "Chemistry", matching the old default) when it can't be resolved.
 */
export function getSubjectName(code) {
  return getSubjectByCode(code)?.name ?? code ?? "Chemistry";
}

/**
 * Returns every unique subject across all boards/classes. Useful for
 * landing pages and other places that need the full subject catalog
 * without a board/class context.
 */
export function getAllSubjects() {
  const idx = codeIndex();
  return Array.from(idx.values());
}
