// client/src/data/quizCatalog.js
//
// Formal-Test catalog. Builds a Standard (Board) → Class → Subject → Unit →
// Test tree entirely from the hand-authored learning content in content.js
// (WORLD_TEMPLATES_BY_SUBJECT + QUESTION_BANK), so every "test" is real
// board-syllabus-mapped material — never randomly generated.
//
// A "unit" is one world (e.g. "atom-valley", topic "Structure of the Atom")
// and each unit offers one test per difficulty tier that has real questions
// in QUESTION_BANK. Every question is enriched with its unit's `fact` and
// `formula` (Concept cards shown during review). Tests carry exam-style
// marks with negative marking on option-based questions.
import {
  WORLD_TEMPLATES_BY_SUBJECT,
  LESSONS_BY_WORLD,
  QUESTION_BANK,
  DIFFICULTIES,
  DIFFICULTY_ACCENTS,
  isFreeTextQuestion,
  isFreeTextCorrect,
  isMatchQuestion,
  isSequenceQuestion,
  isMultiSelectQuestion,
  isSpecialCorrect,
} from "./content.js";
import { getSubjectName } from "./subjectCatalog.js";

// Per-unit "Did you know?" concept facts — hand-authored, syllabus-aligned,
// attached to every question of that unit in review.
export const UNIT_FACTS = {
  // Chemistry
  "atom-valley": "An atom is the smallest unit of an element that keeps its chemical identity. Its nucleus holds protons and neutrons, while electrons orbit in shells.",
  "molecule-forest": "A molecule forms when two or more atoms bond together — O2, H2O and CO2 are everyday molecules.",
  "bonding-cave": "Atoms bond by sharing or transferring electrons: ionic bonds transfer electrons, covalent bonds share them.",
  "reaction-volcano": "In a chemical reaction, reactants rearrange their atoms to form products — total mass is conserved throughout.",
  "acid-base-island": "Acids release H+ ions in water and bases release OH-. A solution with pH 7 is neutral, below 7 acidic and above 7 basic.",
  "final-chemistry-kingdom": "This grand test combines every chemistry unit, from atomic structure to acids, bases and salts.",
  // Mathematics
  "number-nexus": "The number system grows from natural numbers to integers, rationals and the full real number line.",
  "algebra-atrium": "Algebra uses symbols to generalise arithmetic — one variable can stand for many numbers at once.",
  "geometry-grove": "Geometry studies shapes and space: lines, angles and triangles follow fixed rules such as 180° inside a triangle.",
  "mensuration-mines": "Mensuration measures figures: perimeter and area in 2D, and surface area and volume in 3D.",
  "data-desert": "Statistics and probability summarise data and measure chance — mean, median and mode are the key averages.",
  "final-math-summit": "The final maths challenge covers number systems, algebra, geometry, mensuration and data.",
  // Physics
  "motion-meadow": "Motion is a change in position — speed measures distance per time, and acceleration measures the change in speed.",
  "force-falls": "Newton's laws govern motion: inertia, F = ma, and equal-and-opposite action and reaction.",
  "energy-expanse": "Work is force times displacement; energy comes as kinetic and potential forms; power is work per unit time.",
  "circuit-caverns": "Electric current is the flow of charge, and Ohm's law V = IR links voltage, current and resistance.",
  "light-lagoon": "Light travels in straight lines, and reflection and refraction each obey their own law of angles.",
  "final-physics-frontier": "The final physics test reaches from motion and forces through energy, circuits and light.",
  // Biology
  "cell-city": "The cell is the basic unit of life — its membrane, cytoplasm and nucleus keep the organism alive.",
  "tissue-terrace": "Groups of similar cells form tissues, and tissues combine into organs and organ systems.",
  "kingdom-canyon": "Living things are classified into a five-kingdom system that groups organisms by key features.",
  "wellness-woods": "Health depends on balanced nutrition, hygiene, exercise and healthy lifestyle choices.",
  "resource-reef": "Natural resources — air, water, soil and forests — sustain all life and must be conserved.",
  // English
  "grammar-grasslands": "Grammar is the rulebook of language — parts of speech, tense and voice build correct sentences.",
  "vocabulary-valley": "Vocabulary grows through synonyms, antonyms, prefix and suffix roots.",
  "comprehension-cliffs": "Reading comprehension means finding explicit facts and inferring the implied meaning of a passage.",
  "composition-cove": "Formal composition — letters, essays and stories — needs a clear structure, purpose and tone.",
  "literary-lagoon": "Literature is studied through plot, character, setting and theme across prose and poetry.",
  // Social Science
  "history-highlands": "History studies how human societies changed over time — its events, causes and consequences.",
  "civics-citadel": "Civics explains the constitution, democracy, elections and the working of government.",
  "geo-garden": "Geography covers landforms, climate, resources and how people interact with the Earth.",
  "economy-isles": "Economics studies how goods and services are produced, distributed and consumed.",
  "resource-ridge": "Sustainable use of resources balances today's needs with the need to protect the planet.",
};

// Per-unit "Formula"/key-concept card shown on the instructions screen and
// in review for subjects where a formula is meaningful.
export const UNIT_FORMULAS = {
  "atom-valley": "Atomic Number (Z) = number of protons · Mass Number (A) = protons + neutrons",
  "bonding-cave": "Octet rule: atoms gain, lose or share electrons to reach 8 electrons in the outer shell",
  "reaction-volcano": "Law of Conservation of Mass: total mass of reactants = total mass of products",
  "acid-base-island": "pH = -log[H+]; pH 7 neutral, < 7 acidic, > 7 basic",
  "number-nexus": "Natural ⊂ Whole ⊂ Integers ⊂ Rationals ⊂ Reals · HCF × LCM = product of two numbers",
  "algebra-atrium": "(a + b)² = a² + 2ab + b²; if ax + b = 0 then x = -b/a",
  "geometry-grove": "Angles of a triangle sum to 180°; Pythagoras: a² + b² = c²",
  "mensuration-mines": "Rectangle area = l × b; volume of a cuboid = l × b × h",
  "data-desert": "Mean = Σx/N; median = middle value; P(E) = favourable outcomes ÷ total outcomes",
  "motion-meadow": "Speed = distance ÷ time; acceleration = change in velocity ÷ time",
  "force-falls": "F = ma; momentum p = mv; every action has an equal and opposite reaction",
  "energy-expanse": "Work = F × d; KE = ½mv²; PE = mgh; Power = Work ÷ time",
  "circuit-caverns": "Ohm's law: V = IR; charge Q = I × t",
  "light-lagoon": "Angle of incidence = angle of reflection; sin i ÷ sin r = n (refractive index)",
};

const SECONDS_PER_QUESTION = 60;
const MARKS_PER_QUESTION = 1;
const NEGATIVE_MARK_ON_OPTIONS = 0.25;

// Build the full test list for every subject that has real content.
const DEFAULT_PASSING_PERCENTAGE = 40;
function buildCatalog() {
  const tests = [];
  const units = [];

  for (const [subjectCode, template] of Object.entries(WORLD_TEMPLATES_BY_SUBJECT)) {
    template.forEach((world, wi) => {
      const pool = QUESTION_BANK[world.id];
      const chapterCount = (LESSONS_BY_WORLD[world.id] ?? []).length;
      const subjectName = getSubjectName(subjectCode);

      const unit = {
        subject: subjectCode,
        subjectName,
        id: world.id,
        name: world.name,
        topic: world.topic,
        chapter: world.topic,
        unitOrder: wi + 1,
        icon: world.icon,
        boss: world.boss,
        chapterCount,
        fact: UNIT_FACTS[world.id] ?? "",
        formula: UNIT_FORMULAS[world.id] ?? "",
        questionCount: 0,
      };
      units.push(unit);

      DIFFICULTIES.forEach((difficulty) => {
        const questions = pool?.[difficulty.id] ?? [];
        if (!questions.length) return;

        const id = `test-${world.id}-${difficulty.id}`;
        unit.questionCount += questions.length;

        tests.push({
          id,
          title: `${world.topic} — ${difficulty.label} Test`,
          shortTitle: world.name,
          subject: subjectCode,
          subjectName,
          unitId: world.id,
          unitName: world.name,
          unitTopic: world.topic,
          chapter: world.topic,
          unitIcon: world.icon,
          unitBoss: world.boss,
          chapterCount,
          difficulty: difficulty.id,
          difficultyLabel: difficulty.label,
          difficultyAccent: DIFFICULTY_ACCENTS[difficulty.id],
          questionCount: questions.length,
          timeLimit: questions.length * SECONDS_PER_QUESTION,
          marksPerCorrect: MARKS_PER_QUESTION,
          negativeMark: NEGATIVE_MARK_ON_OPTIONS,
          totalMarks: questions.length * MARKS_PER_QUESTION,
          maxScore: questions.length * MARKS_PER_QUESTION,
          passingPercentage: DEFAULT_PASSING_PERCENTAGE,
          fact: UNIT_FACTS[world.id] ?? "",
          formula: UNIT_FORMULAS[world.id] ?? "",
        });
      });
    });
  }

  return { units, tests };
}

const { units: CATALOG_UNITS, tests: CATALOG_TESTS } = buildCatalog();

export function getQuizUnits(subjectCode) {
  if (subjectCode) return CATALOG_UNITS.filter((u) => u.subject === subjectCode);
  return CATALOG_UNITS;
}

export function getQuizTests(filters = {}) {
  return CATALOG_TESTS.filter((t) => {
    if (filters.subject && t.subject !== filters.subject) return false;
    if (filters.unitId && t.unitId !== filters.unitId) return false;
    if (filters.difficulty && t.difficulty !== filters.difficulty) return false;
    return true;
  });
}

export function getTestMeta(testId) {
  return CATALOG_TESTS.find((t) => t.id === testId) ?? null;
}

// Loads a full, playable test from the catalog. Each question is mapped into
// the same shape endpoints.getQuizById() returns ({ id, text, type, options,
// pairs, correctAnswer, explanation, image }) plus Concept enrichment
// (`fact`, `formula`) and exam marking per question. The id is stable and
// deterministic so attempt records can refer back to a fixed question.
export function getTestById(testId) {
  const test = getTestMeta(testId);
  if (!test) return null;

  const pool = QUESTION_BANK[test.unitId]?.[test.difficulty] ?? [];
  const questions = pool.map((q, i) => {
    const tailored = { ...q, type: q.type ?? "mcq" };
    return {
      id: `${testId}-q${i + 1}`,
      text: q.q,
      type: tailored.type,
      options: q.options ?? [],
      pairs: q.pairs ?? [],
      correctAnswer: q.answer,
      explanation: q.explanation ?? "",
      image: q.image,
      fact: q.fact ?? UNIT_FACTS[test.unitId] ?? "",
      formula: q.formula ?? UNIT_FORMULAS[test.unitId] ?? "",
      marks: test.marksPerCorrect,
      negativeMark: isFreeTextQuestion(tailored) ? 0 : test.negativeMark,
    };
  });

  return { ...test, questions };
}

// Returns the catalog form of a test, or null. Callers that want the legacy
// server-quiz fallback (quiz-1/2/3) should try this first, then
// endpoints.getQuizById().
export function loadTestById(testId) {
  return getTestById(testId) ?? null;
}

// Question-level result row shared by results pages: graded answer, marks
// won/lost and the concept cards for review.
export function gradeTestQuestion(question, userAnswer) {
  const marks = question.marks ?? 1;
  const negativeMark = question.negativeMark ?? 0;
  const skipped = userAnswer == null;
  if (skipped) {
    return { skipped, correct: false, marksEarned: 0 };
  }
  let correct = false;
  if (isFreeTextQuestion(question)) {
    correct = isFreeTextCorrect(question, userAnswer);
  } else if (isMatchQuestion(question) || isSequenceQuestion(question) || isMultiSelectQuestion(question)) {
    correct = isSpecialCorrect(question, userAnswer);
  } else {
    correct = userAnswer === question.correctAnswer;
  }
  return {
    skipped,
    correct,
    marksEarned: correct ? marks : -negativeMark,
  };
}