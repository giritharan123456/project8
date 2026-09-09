// AI learning features — all functions are mock implementations that
// simulate real API calls with realistic delays and plausible responses.
// Swap these out for actual backend/AI calls once the API exists.

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(min = 400, max = 1200) {
  return delay(min + Math.random() * (max - min));
}

const MOCK_QUESTIONS = {
  chemistry: [
    { q: "What is the atomic number of Carbon?", options: ["4", "6", "8", "12"], answer: "6", explanation: "Carbon has 6 protons, making its atomic number 6." },
    { q: "Which gas is most abundant in Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], answer: "Nitrogen", explanation: "Nitrogen makes up about 78% of Earth's atmosphere." },
    { q: "What is the chemical formula for water?", options: ["H2O", "CO2", "NaCl", "O2"], answer: "H2O", explanation: "Water is composed of two hydrogen atoms and one oxygen atom." },
    { q: "Which element has the symbol 'Fe'?", options: ["Iron", "Fluorine", "Francium", "Fermium"], answer: "Iron", explanation: "Fe comes from the Latin word 'ferrum' meaning iron." },
    { q: "What type of bond forms between a metal and non-metal?", options: ["Covalent", "Ionic", "Metallic", "Hydrogen"], answer: "Ionic", explanation: "Ionic bonds form when electrons are transferred from a metal to a non-metal." },
  ],
  mathematics: [
    { q: "What is the value of π (pi) to two decimal places?", options: ["3.14", "3.16", "3.12", "3.18"], answer: "3.14", explanation: "Pi is approximately 3.14159..." },
    { q: "What is the square root of 144?", options: ["10", "11", "12", "14"], answer: "12", explanation: "12 × 12 = 144." },
    { q: "Solve: 3x + 6 = 18. What is x?", options: ["3", "4", "6", "8"], answer: "4", explanation: "3x = 12, so x = 4." },
    { q: "What is 15% of 200?", options: ["25", "30", "35", "40"], answer: "30", explanation: "15/100 × 200 = 30." },
    { q: "What is the sum of angles in a triangle?", options: ["90°", "180°", "270°", "360°"], answer: "180°", explanation: "The interior angles of any triangle always sum to 180 degrees." },
  ],
  physics: [
    { q: "What is the unit of force?", options: ["Joule", "Watt", "Newton", "Pascal"], answer: "Newton", explanation: "The Newton (N) is the SI unit of force." },
    { q: "What is the speed of light approximately?", options: ["300,000 km/s", "150,000 km/s", "300,000 m/s", "150,000 m/s"], answer: "300,000 km/s", explanation: "Light travels at approximately 300,000 kilometers per second." },
  ],
  biology: [
    { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], answer: "Mitochondria", explanation: "Mitochondria generate most of the cell's ATP through cellular respiration." },
    { q: "What does DNA stand for?", options: ["Deoxyribonucleic Acid", "Dinitrogen Acid", "Deoxyribose Nucleic Atom", "Dynamic Nuclear Acid"], answer: "Deoxyribonucleic Acid", explanation: "DNA stands for Deoxyribonucleic Acid." },
  ],
};

const MOCK_FLASHCARDS = [
  { front: "What is the atomic number?", back: "The number of protons in an atom's nucleus" },
  { front: "What is an ionic bond?", back: "A bond formed by the transfer of electrons from a metal to a non-metal" },
  { front: "What is the law of conservation of mass?", back: "Mass is neither created nor destroyed in a chemical reaction" },
  { front: "What is a catalyst?", back: "A substance that increases the rate of a chemical reaction without being consumed" },
  { front: "What is pH?", back: "A measure of how acidic or basic a solution is, on a scale of 0-14" },
  { front: "What is an exothermic reaction?", back: "A reaction that releases heat energy to its surroundings" },
  { front: "What is an endothermic reaction?", back: "A reaction that absorbs heat energy from its surroundings" },
  { front: "What is Avogadro's number?", back: "6.022 × 10²³ — the number of particles in one mole of a substance" },
];

const MOCK_STUDY_GUIDE = {
  title: "Comprehensive Study Guide",
  sections: [
    {
      topic: "Core Concepts",
      summary: "Master the fundamental principles that form the foundation of this subject.",
      keyPoints: [
        "Understand the basic definitions and terminology",
        "Identify key formulas and their applications",
        "Practice with real-world examples",
      ],
    },
    {
      topic: "Problem-Solving Strategies",
      summary: "Develop systematic approaches to tackle different types of questions.",
      keyPoints: [
        "Read the question carefully before attempting",
        "Identify what is given and what is asked",
        "Show all working steps clearly",
        "Verify your answer makes logical sense",
      ],
    },
    {
      topic: "Common Mistakes to Avoid",
      summary: "Learn from frequent errors students make in this area.",
      keyPoints: [
        "Double-check unit conversions",
        "Don't rush through calculations",
        "Review each option before selecting an answer",
        "Pay attention to negative signs and directions",
      ],
    },
  ],
  practiceTips: [
    "Start with easier questions and gradually increase difficulty",
    "Review incorrect answers and understand why they were wrong",
    "Create flashcards for key terms and formulas",
    "Practice under timed conditions to build speed",
  ],
};

// ── Public API ───────────────────────────────────────────────────────

export async function generateAIQuiz({ subject = "chemistry", topic = "general", difficulty = "medium", questionCount = 5 } = {}) {
  await randomDelay(800, 1500);

  const bank = MOCK_QUESTIONS[subject] ?? MOCK_QUESTIONS.chemistry;
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  const questions = shuffled.slice(0, Math.min(questionCount, shuffled.length));

  return {
    title: `AI-Generated ${subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz`,
    subject,
    topic,
    difficulty,
    questions: questions.map((q, i) => ({
      id: `aiq_${Date.now()}_${i}`,
      ...q,
      type: "multiple_choice",
      difficulty,
    })),
    generatedAt: new Date().toISOString(),
  };
}

export async function generateAIQuestion({ subject = "chemistry", topic = "general", type = "multiple_choice", difficulty = "medium" } = {}) {
  await randomDelay(300, 800);

  const bank = MOCK_QUESTIONS[subject] ?? MOCK_QUESTIONS.chemistry;
  const q = bank[Math.floor(Math.random() * bank.length)];

  return {
    id: `aiq_${Date.now()}`,
    ...q,
    type,
    difficulty,
    subject,
    topic,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateAIExplanation({ question, correctAnswer, studentAnswer }) {
  await randomDelay(500, 1000);

  const isCorrect = studentAnswer === correctAnswer;
  return {
    isCorrect,
    explanation: isCorrect
      ? `Correct! ${correctAnswer} is the right answer. Great job understanding this concept.`
      : `Not quite. The correct answer is "${correctAnswer}". Review the relevant concept and try similar questions to strengthen your understanding.`,
    tip: isCorrect
      ? "Try challenging yourself with a harder difficulty level."
      : "Focus on the underlying concept rather than memorizing the answer.",
  };
}

export async function generateAIHint({ question, difficulty = "medium" } = {}) {
  await randomDelay(300, 700);

  const hints = [
    "Think about the key definitions related to this topic.",
    "Consider what happens step by step in this process.",
    "Eliminate the options that are clearly incorrect first.",
    "Recall the formula or rule that applies here.",
    "Break the problem down into smaller, manageable parts.",
  ];

  return {
    hint: hints[Math.floor(Math.random() * hints.length)],
    difficulty,
  };
}

export async function generateAIFlashcards({ topic = "general", count = 5 } = {}) {
  await randomDelay(600, 1200);

  const shuffled = [...MOCK_FLASHCARDS].sort(() => Math.random() - 0.5);
  const cards = shuffled.slice(0, Math.min(count, shuffled.length));

  return {
    topic,
    cards: cards.map((c, i) => ({
      id: `fc_${Date.now()}_${i}`,
      ...c,
      difficulty: "medium",
    })),
    generatedAt: new Date().toISOString(),
  };
}

export async function generateAIStudyGuide({ subject = "chemistry", topics = ["general"] } = {}) {
  await randomDelay(1000, 2000);

  return {
    ...MOCK_STUDY_GUIDE,
    title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Study Guide`,
    subject,
    topics,
    generatedAt: new Date().toISOString(),
  };
}

export async function generatePersonalizedPractice({ studentId, weakConcepts = [] } = {}) {
  await randomDelay(800, 1500);

  const questions = [];
  for (const concept of weakConcepts.slice(0, 5)) {
    questions.push({
      id: `pp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      q: `Practice question on: ${concept}`,
      concept,
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "Option A",
      explanation: `This question tests your understanding of ${concept}.`,
      type: "multiple_choice",
      difficulty: "medium",
    });
  }

  return {
    studentId,
    questions,
    generatedAt: new Date().toISOString(),
  };
}

// ── Analysis functions (synchronous) ─────────────────────────────────

export function adjustDifficulty(accuracy, recentPerformance = []) {
  if (recentPerformance.length < 3) return "medium";

  const recentAccuracy =
    recentPerformance.slice(-5).reduce((s, r) => s + (r.correct ? 1 : 0), 0) /
    Math.min(recentPerformance.length, 5);

  if (recentAccuracy >= 0.9) return "hard";
  if (recentAccuracy >= 0.7) return "medium";
  return "easy";
}

export function detectWeakConcepts(masteryData = []) {
  return masteryData
    .filter((c) => c.accuracy < 60 && c.totalAttempts >= 2)
    .sort((a, b) => a.accuracy - b.accuracy)
    .map((c) => ({
      concept: c.concept,
      accuracy: c.accuracy,
      level: c.level,
    }));
}

export function getRecommendations(studentData = {}) {
  const recommendations = [];
  const { masteryData = [], recentAccuracy = 0, streak = 0, totalXp = 0 } = studentData;

  const weak = detectWeakConcepts(masteryData);
  if (weak.length > 0) {
    recommendations.push({
      type: "practice",
      title: "Practice Weak Areas",
      description: `Focus on: ${weak.slice(0, 3).map((w) => w.concept).join(", ")}`,
      priority: "high",
    });
  }

  if (recentAccuracy >= 80) {
    recommendations.push({
      type: "challenge",
      title: "Ready for a Challenge",
      description: "Your accuracy is high! Try harder questions or a timed quiz.",
      priority: "medium",
    });
  }

  if (streak >= 5) {
    recommendations.push({
      type: "streak",
      title: "Keep Your Streak Going",
      description: `You're on a ${streak}-day streak! Don't break it.`,
      priority: "medium",
    });
  }

  if (totalXp > 500) {
    recommendations.push({
      type: "review",
      title: "Review Past Lessons",
      description: "Revisit completed worlds to reinforce your knowledge.",
      priority: "low",
    });
  }

  return recommendations;
}
