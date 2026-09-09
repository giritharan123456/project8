const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// --- Mock AI responses ---

const MOCK_QUESTIONS = {
  mathematics: [
    { q: "What is the value of 3x + 7 when x = 4?", options: ["19", "17", "21", "15"], answer: "19", explanation: "Substituting x = 4: 3(4) + 7 = 12 + 7 = 19.", difficulty: "easy" },
    { q: "Solve for x: 2x - 5 = 11", options: ["8", "6", "7", "9"], answer: "8", explanation: "2x = 16, so x = 8.", difficulty: "medium" },
    { q: "What is the area of a circle with radius 7 cm? (Use pi = 22/7)", options: ["154 cm²", "148 cm²", "156 cm²", "152 cm²"], answer: "154 cm²", explanation: "Area = pi × r² = (22/7) × 49 = 154 cm².", difficulty: "medium" },
    { q: "If the mean of 5, 8, x, 12, 15 is 10, find x.", options: ["10", "8", "12", "11"], answer: "10", explanation: "(5 + 8 + x + 12 + 15) / 5 = 10, so 40 + x = 50, x = 10.", difficulty: "hard" },
  ],
  physics: [
    { q: "A car accelerates from rest to 30 m/s in 6 seconds. What is its acceleration?", options: ["5 m/s²", "6 m/s²", "4 m/s²", "3 m/s²"], answer: "5 m/s²", explanation: "a = (v - u) / t = (30 - 0) / 6 = 5 m/s².", difficulty: "easy" },
    { q: "What is the SI unit of force?", options: ["Joule", "Newton", "Watt", "Pascal"], answer: "Newton", explanation: "The Newton (N) is the SI unit of force, defined as kg·m/s².", difficulty: "easy" },
    { q: "A body of mass 5 kg is thrown vertically upward with velocity 20 m/s. What is the maximum height reached? (g = 10 m/s²)", options: ["20 m", "25 m", "15 m", "30 m"], answer: "20 m", explanation: "Using v² = u² - 2gh: 0 = 400 - 20h, h = 20 m.", difficulty: "medium" },
  ],
  chemistry: [
    { q: "What is the atomic number of Carbon?", options: ["4", "6", "8", "12"], answer: "6", explanation: "Carbon has 6 protons, so its atomic number is 6.", difficulty: "easy" },
    { q: "Which type of bond forms between sodium and chlorine in NaCl?", options: ["Covalent", "Ionic", "Metallic", "Hydrogen"], answer: "Ionic", explanation: "Sodium transfers an electron to chlorine, forming Na⁺ and Cl⁻ ions held by ionic bonding.", difficulty: "medium" },
    { q: "Balance the equation: Fe + O₂ → Fe₂O₃", options: ["4Fe + 3O₂ → 2Fe₂O₃", "2Fe + O₂ → Fe₂O₃", "Fe + O₂ → Fe₂O₃", "3Fe + 2O₂ → Fe₂O₃"], answer: "4Fe + 3O₂ → 2Fe₂O₃", explanation: "Balancing gives 4Fe + 3O₂ → 2Fe₂O₃ (4 Fe, 6 O on each side).", difficulty: "medium" },
  ],
  biology: [
    { q: "Which organelle is known as the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], answer: "Mitochondria", explanation: "Mitochondria produce ATP through cellular respiration.", difficulty: "easy" },
    { q: "DNA stands for:", options: ["Deoxyribonucleic Acid", "Dinitrogen Acid", "Deoxyribose Nucleic Agent", "Dioxy Nucleic Acid"], answer: "Deoxyribonucleic Acid", explanation: "DNA is Deoxyribonucleic Acid, the molecule carrying genetic information.", difficulty: "easy" },
    { q: "Which process converts glucose into pyruvate?", options: ["Krebs Cycle", "Glycolysis", "Electron Transport Chain", "Photosynthesis"], answer: "Glycolysis", explanation: "Glycolysis is the first step of cellular respiration, breaking glucose into two pyruvate molecules.", difficulty: "medium" },
  ],
  english: [
    { q: "Which word is a synonym for 'abundant'?", options: ["Scarce", "Plentiful", "Minimal", "Rare"], answer: "Plentiful", explanation: "'Abundant' means existing in large quantities, synonymous with 'plentiful'.", difficulty: "easy" },
    { q: "Identify the part of speech of 'quickly' in 'She ran quickly.'", options: ["Noun", "Verb", "Adverb", "Adjective"], answer: "Adverb", explanation: "'Quickly' modifies the verb 'ran', making it an adverb.", difficulty: "medium" },
    { q: "Which sentence uses the passive voice?", options: ["The dog chased the cat.", "The cat was chased by the dog.", "The dog is chasing the cat.", "The dog will chase the cat."], answer: "The cat was chased by the dog.", explanation: "In passive voice, the subject receives the action.", difficulty: "medium" },
  ],
  history: [
    { q: "In which year did India gain independence?", options: ["1945", "1946", "1947", "1948"], answer: "1947", explanation: "India gained independence on August 15, 1947.", difficulty: "easy" },
    { q: "Who was the first Emperor of the Maurya Dynasty?", options: ["Ashoka", "Bindusara", "Chandragupta Maurya", "Bimbisara"], answer: "Chandragupta Maurya", explanation: "Chandragupta Maurya founded the Maurya Empire around 322 BCE.", difficulty: "medium" },
  ],
  geography: [
    { q: "Which is the longest river in the world?", options: ["Amazon", "Nile", "Mississippi", "Yangtze"], answer: "Nile", explanation: "The Nile stretches approximately 6,650 km through northeastern Africa.", difficulty: "easy" },
    { q: "Which layer of the atmosphere contains the ozone layer?", options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"], answer: "Stratosphere", explanation: "The ozone layer is found in the stratosphere, about 15-35 km above Earth.", difficulty: "medium" },
  ],
  "computer-science": [
    { q: "Which data structure follows LIFO (Last In, First Out)?", options: ["Queue", "Stack", "Array", "Linked List"], answer: "Stack", explanation: "A stack follows LIFO: the last element pushed is the first one popped.", difficulty: "easy" },
    { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], answer: "Hyper Text Markup Language", explanation: "HTML is the standard markup language for creating web pages.", difficulty: "easy" },
    { q: "Which sorting algorithm has average time complexity O(n log n)?", options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"], answer: "Merge Sort", explanation: "Merge sort divides and merges, achieving O(n log n) in all cases.", difficulty: "medium" },
  ],
  "social-science": [
    { q: "Which is the largest democracy in the world?", options: ["USA", "India", "Brazil", "Indonesia"], answer: "India", explanation: "India has the largest democratic electorate in the world.", difficulty: "easy" },
    { q: "GDP stands for:", options: ["Gross Domestic Product", "General Development Plan", "Global Distribution Protocol", "Gross Domestic Process"], answer: "Gross Domestic Product", explanation: "GDP measures the total monetary value of all finished goods and services produced within a country.", difficulty: "easy" },
  ],
};

const MOCK_FLASHCARDS = {
  mathematics: [
    { front: "What is the Pythagorean theorem?", back: "a² + b² = c², where c is the hypotenuse of a right triangle." },
    { front: "Formula for the area of a circle", back: "A = πr²" },
    { front: "What is the quadratic formula?", back: "x = (-b ± √(b² - 4ac)) / 2a" },
    { front: "Definition of a prime number", back: "A natural number greater than 1 that has no positive divisors other than 1 and itself." },
  ],
  physics: [
    { front: "Newton's Second Law", back: "F = ma (Force equals mass times acceleration)" },
    { front: "What is Ohm's Law?", back: "V = IR (Voltage equals Current times Resistance)" },
    { front: "Formula for kinetic energy", back: "KE = ½mv²" },
  ],
  chemistry: [
    { front: "What is Avogadro's number?", back: "6.022 × 10²³ (the number of particles in one mole)" },
    { front: "pH of a neutral solution", back: "7" },
    { front: "What is the formula for water?", back: "H₂O (two hydrogen atoms bonded to one oxygen atom)" },
  ],
  biology: [
    { front: "What are the four bases in DNA?", back: "Adenine (A), Thymine (T), Guanine (G), Cytosine (C)" },
    { front: "Function of mitochondria", back: "Produce ATP through cellular respiration — the powerhouse of the cell." },
    { front: "What is photosynthesis?", back: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (plants convert light energy into glucose)" },
  ],
};

const MOCK_STUDY_GUIDES = {
  mathematics: {
    title: "Mathematics Study Guide",
    sections: [
      { topic: "Algebra", keyPoints: ["Master variable isolation", "Practice word problems", "Understand inequality rules"], tips: "Always check your answer by substituting back into the original equation." },
      { topic: "Geometry", keyPoints: ["Memorize area and perimeter formulas", "Practice Pythagorean theorem problems", "Understand angle relationships"], tips: "Draw diagrams to visualize geometric problems." },
      { topic: "Statistics", keyPoints: ["Know the difference between mean, median, mode", "Understand probability basics", "Practice data interpretation"], tips: "Always label your axes and include units on graphs." },
    ],
  },
  physics: {
    title: "Physics Study Guide",
    sections: [
      { topic: "Mechanics", keyPoints: ["Master Newton's three laws", "Practice kinematic equations", "Understand momentum conservation"], tips: "Draw free body diagrams for every force problem." },
      { topic: "Electricity", keyPoints: ["Know Ohm's law (V=IR)", "Understand series vs parallel circuits", "Practice power calculations"], tips: "Remember: in series, current is constant; in parallel, voltage is constant." },
    ],
  },
  chemistry: {
    title: "Chemistry Study Guide",
    sections: [
      { topic: "Atomic Structure", keyPoints: ["Know the periodic table groups", "Understand electron configuration", "Practice isotope notation"], tips: "Use the periodic table as your primary reference — memorize group trends." },
      { topic: "Reactions", keyPoints: ["Balance chemical equations", "Identify reaction types", "Practice stoichiometry"], tips: "Always write out the balanced equation before doing calculations." },
    ],
  },
};

function getSubjectContext(subjectCode) {
  const code = (subjectCode || "mathematics").toLowerCase().replace(/[^a-z-]/g, "");
  return MOCK_QUESTIONS[code] ? code : "mathematics";
}

// POST /api/ai/generate-quiz - Generate quiz from topic
router.post("/generate-quiz", requireAuth, async (req, res, next) => {
  try {
    const { topic, subjectCode, difficulty, questionCount = 5 } = req.body || {};
    const ctx = getSubjectContext(subjectCode);
    const pool_q = MOCK_QUESTIONS[ctx] || MOCK_QUESTIONS.mathematics;

    const shuffled = [...pool_q].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(Number(questionCount), shuffled.length));

    const questions = selected.map((q, i) => ({
      id: `ai-q-${Date.now()}-${i}`,
      questionText: q.q,
      type: "mcq",
      options: q.options,
      correctAnswer: q.answer,
      explanation: q.explanation,
      difficulty: q.difficulty,
    }));

    res.json({
      topic: topic || "General Review",
      subjectCode: ctx,
      questionCount: questions.length,
      questions,
      generatedAt: new Date(),
      message: "This is a mock AI-generated quiz. In production, this would call a real LLM API.",
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/generate-question - Generate a single question
router.post("/generate-question", requireAuth, async (req, res, next) => {
  try {
    const { topic, subjectCode, difficulty } = req.body || {};
    const ctx = getSubjectContext(subjectCode);
    const pool_q = MOCK_QUESTIONS[ctx] || MOCK_QUESTIONS.mathematics;
    const q = pool_q[Math.floor(Math.random() * pool_q.length)];

    res.json({
      id: `ai-q-${Date.now()}`,
      questionText: q.q,
      type: "mcq",
      options: q.options,
      correctAnswer: q.answer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      generatedAt: new Date(),
      message: "Mock AI-generated question.",
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/explanation - Get explanation for a question
router.post("/explanation", requireAuth, async (req, res, next) => {
  try {
    const { questionId, questionText, correctAnswer } = req.body || {};
    res.json({
      questionId: questionId || null,
      explanation: correctAnswer
        ? `The correct answer is "${correctAnswer}". ${questionText ? `Regarding: "${questionText}" — ` : ""}This answer is correct because it directly addresses the core concept being tested. In a classroom setting, you would want to connect this to the fundamental principles behind the answer.`
        : "Please provide the question and correct answer for a detailed explanation.",
      generatedAt: new Date(),
      message: "Mock AI explanation.",
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/hint - Get hint for a question
router.post("/hint", requireAuth, async (req, res, next) => {
  try {
    const { questionId, questionText, hintLevel = 1 } = req.body || {};
    const hints = [
      "Think about the key concept this question is testing. What topic does it fall under?",
      "Consider the relationship between the given information. Can you eliminate any obviously wrong options?",
      `The answer relates to fundamental principles in this topic. Review the relevant formulas or definitions, then revisit the question.`,
    ];
    const level = Math.max(1, Math.min(3, Number(hintLevel)));
    res.json({
      questionId: questionId || null,
      hintLevel: level,
      hint: hints[level - 1],
      generatedAt: new Date(),
      message: "Mock AI hint.",
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/flashcards - Generate flashcards from topic
router.post("/flashcards", requireAuth, async (req, res, next) => {
  try {
    const { topic, subjectCode, count = 6 } = req.body || {};
    const ctx = getSubjectContext(subjectCode);
    const pool_fc = MOCK_FLASHCARDS[ctx] || MOCK_FLASHCARDS.mathematics;

    const shuffled = [...pool_fc].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(Number(count), shuffled.length));

    const flashcards = selected.map((fc, i) => ({
      id: `ai-fc-${Date.now()}-${i}`,
      front: fc.front,
      back: fc.back,
    }));

    res.json({
      topic: topic || "General Review",
      subjectCode: ctx,
      flashcardCount: flashcards.length,
      flashcards,
      generatedAt: new Date(),
      message: "Mock AI-generated flashcards.",
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/study-guide - Generate study guide
router.post("/study-guide", requireAuth, async (req, res, next) => {
  try {
    const { topic, subjectCode } = req.body || {};
    const ctx = getSubjectContext(subjectCode);
    const guide = MOCK_STUDY_GUIDES[ctx] || MOCK_STUDY_GUIDES.mathematics;

    res.json({
      ...guide,
      subjectCode: ctx,
      topic: topic || "General Review",
      generatedAt: new Date(),
      message: "Mock AI-generated study guide.",
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/ai/recommendations - Get personalized recommendations
router.get("/recommendations", requireAuth, async (req, res, next) => {
  try {
    const pool_mod = require("../config/db");

    let weakAreas = [];
    try {
      const [weak] = await pool_mod.query(
        `SELECT subject_code, concept_name, accuracy
         FROM player_mastery
         WHERE player_id = ? AND total_count > 0 AND accuracy < 60
         ORDER BY accuracy ASC
         LIMIT 5`,
        [req.user.id]
      );
      weakAreas = weak;
    } catch (_) {
      // mastery table may not exist yet
    }

    const recommendations = [];

    if (weakAreas.length > 0) {
      recommendations.push({
        type: "weak_areas",
        title: "Review Weak Areas",
        description: `You have ${weakAreas.length} concept(s) below 60% accuracy. Focus on these for the biggest improvement.`,
        items: weakAreas.map((w) => ({ subject: w.subject_code, concept: w.concept_name, accuracy: w.accuracy })),
        priority: "high",
      });
    }

    recommendations.push({
      type: "daily_challenge",
      title: "Daily Challenge",
      description: "Complete today's challenges to earn bonus XP and coins!",
      priority: "medium",
    });

    recommendations.push({
      type: "review_due",
      title: "Flashcard Review",
      description: "Some of your flashcards are due for review. Spaced repetition helps you remember long-term.",
      priority: "medium",
    });

    recommendations.push({
      type: "quiz_practice",
      title: "Practice Quiz",
      description: "Try a new quiz in your weakest subject to strengthen your knowledge.",
      priority: "low",
    });

    res.json({ recommendations, generatedAt: new Date(), message: "Mock personalized recommendations." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
