export const STATS = [
  { value: 10000, suffix: "+", label: "Players" },
  { value: 120, suffix: "+", label: "Lessons" },
  { value: 5000, suffix: "+", label: "Questions" },
  { value: 50, suffix: "+", label: "Achievements" },
];

// "type" drives the accent color, so color encodes what kind of ability
// each card represents rather than decorating identically-weighted cards.
export const FEATURES = [
  {
    icon: "Gamepad2",
    title: "Learn Through Gameplay",
    description:
      "Every concept is a mission. Progress by playing, not by scrolling through slides.",
    type: "mechanics",
  },
  {
    icon: "Swords",
    title: "Battle Chemistry Monsters",
    description:
      "Answer correctly to land the hit. Chemistry monsters guard every level.",
    type: "battle",
  },
  {
    icon: "Puzzle",
    title: "Solve Chemistry Puzzles",
    description:
      "Match, drag, and build equations. Puzzles that make reactions click.",
    type: "mechanics",
  },
  {
    icon: "Sparkles",
    title: "Earn XP & Rewards",
    description:
      "XP, coins, and stars for every correct answer â€” spend them in the shop.",
    type: "reward",
  },
  {
    icon: "Map",
    title: "Explore New Worlds",
    description:
      "Each chapter is a world on the map. Clear it to reveal what's next.",
    type: "explore",
  },
  {
    icon: "Crown",
    title: "Become a Chemistry Master",
    description:
      "Defeat every chapter boss and claim the title across your class and board.",
    type: "reward",
  },
];

// NOTE: glow includes the "hover:" prefix as a full literal string on purpose â€”
// Tailwind's content scanner matches raw text, not computed JS, so a class built
// at runtime from a bare "shadow-glow-cyan" + prepended "hover:" would never be
// generated. Keeping the whole utility as one literal string here fixes that.
export const FEATURE_ACCENTS = {
  mechanics: { color: "#38D9F4", glow: "hover:shadow-glow-cyan", tw: "text-neon-cyan" },
  battle: { color: "#806BFF", glow: "hover:shadow-glow-purple", tw: "text-arcane-purple" },
  reward: { color: "#FCD34D", glow: "hover:shadow-glow-gold", tw: "text-reward-gold" },
  explore: { color: "#4ADE80", glow: "hover:shadow-glow-green", tw: "text-neon-green" },
};

// Mock curriculum summary data for the Class Selection screen (Section 6).
// Real numbers should come from GET /api/courses?class=<n> aggregates once
// the curriculum API exists â€” see Section 40 of the brief.
export const CLASSES = [
  {
    grade: 4,
    icon: "Sprout",
    courses: 6,
    lessons: 28,
    questions: 180,
    difficulty: "Foundation",
  },
  {
    grade: 5,
    icon: "Leaf",
    courses: 7,
    lessons: 34,
    questions: 220,
    difficulty: "Foundation",
  },
  {
    grade: 6,
    icon: "Beaker",
    courses: 8,
    lessons: 42,
    questions: 300,
    difficulty: "Foundation \u2192 Beginner",
  },
  {
    grade: 7,
    icon: "TestTube",
    courses: 9,
    lessons: 48,
    questions: 360,
    difficulty: "Beginner",
  },
  {
    grade: 8,
    icon: "Microscope",
    courses: 10,
    lessons: 55,
    questions: 430,
    difficulty: "Beginner \u2192 Intermediate",
  },
  {
    grade: 9,
    icon: "FlaskConical",
    courses: 12,
    lessons: 65,
    questions: 520,
    difficulty: "Beginner \u2192 Intermediate",
  },
  {
    grade: 10,
    icon: "TestTubes",
    courses: 14,
    lessons: 78,
    questions: 640,
    difficulty: "Intermediate",
  },
  {
    grade: 11,
    icon: "Atom",
    courses: 16,
    lessons: 92,
    questions: 810,
    difficulty: "Intermediate \u2192 Advanced",
  },
  {
    grade: 12,
    icon: "Orbit",
    courses: 18,
    lessons: 104,
    questions: 940,
    difficulty: "Advanced",
  },
];

// Mock board data for Board Selection (Section 7), grouped by category
// exactly as the brief specifies. Course/lesson counts are per-board
// totals across all classes â€” real numbers should come from
// GET /api/courses?board=<code> once the curriculum API exists.
export const BOARD_CATEGORIES = [
  {
    category: "Central Boards",
    boards: [
      {
        code: "CBSE",
        name: "CBSE",
        type: "Central Board",
        description: "NCERT-aligned curriculum, followed nationwide.",
        courses: 14,
        lessons: 78,
        icon: "Landmark",
      },
      {
        code: "ICSE",
        name: "ICSE",
        type: "Central Board",
        description: "In-depth, application-focused curriculum across every subject.",
        courses: 15,
        lessons: 82,
        icon: "ScrollText",
      },
    ],
  },
  {
    category: "State Boards",
    boards: [
      {
        code: "TN",
        name: "Tamil Nadu State Board",
        type: "State Board",
        description: "Full curriculum set by the Tamil Nadu State Board.",
        courses: 13,
        lessons: 70,
        icon: "MapPinned",
      },
      {
        code: "MH",
        name: "Maharashtra State Board",
        type: "State Board",
        description: "Full curriculum set by the Maharashtra State Board.",
        courses: 13,
        lessons: 68,
        icon: "MapPinned",
      },
    ],
  },
  {
    category: "International Boards",
    boards: [
      {
        code: "IB",
        name: "IB",
        type: "International Board",
        description: "Inquiry-based learning across the IB Diploma pathway.",
        courses: 16,
        lessons: 90,
        icon: "Globe2",
      },
      {
        code: "IGCSE",
        name: "IGCSE",
        type: "International Board",
        description: "Cambridge-aligned curriculum for IGCSE students.",
        courses: 15,
        lessons: 84,
        icon: "Globe2",
      },
    ],
  },
];

// Chemistry World map (Section 10). World *names and topics* are the
// configurable curriculum shell per Section 41 â€” swap this array's contents
// per board/class from GET /api/courses?board=&class= once that endpoint
// exists; nothing downstream should need to change shape-wise.
export const WORLD_TEMPLATE = [
  {
    id: "atom-valley",
    name: "Atom Valley",
    topic: "Structure of the Atom",
    icon: "Atom",
    boss: "Proton Guardian",
  },
  {
    id: "molecule-forest",
    name: "Molecule Forest",
    topic: "Molecules & Compounds",
    icon: "Trees",
    boss: "Molecule Monster",
  },
  {
    id: "bonding-cave",
    name: "Bonding Cave",
    topic: "Chemical Bonding",
    icon: "Link2",
    boss: "Bond Breaker",
  },
  {
    id: "reaction-volcano",
    name: "Reaction Volcano",
    topic: "Chemical Reactions",
    icon: "Flame",
    boss: "Magma Reactant",
  },
  {
    id: "acid-base-island",
    name: "Acid Base Island",
    topic: "Acids, Bases & Salts",
    icon: "Waves",
    boss: "pH Phantom",
  },
  {
    id: "final-chemistry-kingdom",
    name: "Final Chemistry Kingdom",
    topic: "Final Mastery Challenge",
    icon: "Castle",
    boss: "The Alchemist King",
    isFinal: true,
  },
];

// Mathematics world map â€” same shape as WORLD_TEMPLATE (Chemistry) above,
// with its own unique world ids so it never collides with Chemistry's
// content, progress keys, or storage keys (completionKey/bossKey are built
// from worldId, so distinct ids alone keep the two subjects' saved
// progress fully separate â€” no other change needed there).
export const MATH_WORLD_TEMPLATE = [
  {
    id: "number-nexus",
    name: "Number Nexus",
    topic: "Number Systems",
    icon: "Hash",
    boss: "The Rational Wraith",
  },
  {
    id: "algebra-atrium",
    name: "Algebra Atrium",
    topic: "Algebraic Expressions & Equations",
    icon: "Sigma",
    boss: "Equation Ogre",
  },
  {
    id: "geometry-grove",
    name: "Geometry Grove",
    topic: "Lines, Angles & Triangles",
    icon: "Triangle",
    boss: "The Angle Sphinx",
  },
  {
    id: "mensuration-mines",
    name: "Mensuration Mines",
    topic: "Area, Surface Area & Volume",
    icon: "Box",
    boss: "Volumetric Golem",
  },
  {
    id: "data-desert",
    name: "Data Desert",
    topic: "Statistics & Probability",
    icon: "BarChart3",
    boss: "The Probability Phantom",
  },
  {
    id: "final-math-summit",
    name: "Final Math Summit",
    topic: "Final Mastery Challenge",
    icon: "Castle",
    boss: "The Theorem Titan",
    isFinal: true,
  },
];

// Physics world map â€” same shape as WORLD_TEMPLATE (Chemistry) above, with
// its own unique world ids so it never collides with Chemistry's or Math's
// content, progress keys, or storage keys.
export const PHYSICS_WORLD_TEMPLATE = [
  {
    id: "motion-meadow",
    name: "Motion Meadow",
    topic: "Distance, Speed & Acceleration",
    icon: "Gauge",
    boss: "The Velocity Specter",
  },
  {
    id: "force-falls",
    name: "Force Falls",
    topic: "Newton's Laws of Motion",
    icon: "Anchor",
    boss: "Inertia Golem",
  },
  {
    id: "energy-expanse",
    name: "Energy Expanse",
    topic: "Work, Energy & Power",
    icon: "Flame",
    boss: "The Power Wraith",
  },
  {
    id: "circuit-caverns",
    name: "Circuit Caverns",
    topic: "Current Electricity",
    icon: "Zap",
    boss: "Circuit Sentinel",
  },
  {
    id: "light-lagoon",
    name: "Light Lagoon",
    topic: "Reflection, Refraction & Lenses",
    icon: "Sun",
    boss: "Refraction Phantom",
  },
  {
    id: "final-physics-frontier",
    name: "Final Physics Frontier",
    topic: "Final Mastery Challenge",
    icon: "Castle",
    boss: "The Force Sovereign",
    isFinal: true,
  },
];

// English world map â€” same shape as WORLD_TEMPLATE (Chemistry) above, with
// its own unique world ids so it never collides with Chemistry's, Math's,
// or Physics's content, progress keys, or storage keys.
export const ENGLISH_WORLD_TEMPLATE = [
  {
    id: "grammar-grasslands",
    name: "Grammar Grasslands",
    topic: "Parts of Speech & Sentence Structure",
    icon: "BookOpen",
    boss: "The Syntax Serpent",
  },
  {
    id: "vocabulary-valley",
    name: "Vocabulary Valley",
    topic: "Synonyms, Antonyms & Word Building",
    icon: "Library",
    boss: "The Lexicon Lich",
  },
  {
    id: "comprehension-cliffs",
    name: "Comprehension Cliffs",
    topic: "Reading Comprehension & Inference",
    icon: "ScrollText",
    boss: "The Riddle Sphinx",
  },
  {
    id: "composition-cove",
    name: "Composition Cove",
    topic: "Paragraph & Essay Writing",
    icon: "PenTool",
    boss: "The Blank Page Wraith",
  },
  {
    id: "literary-lagoon",
    name: "Literary Lagoon",
    topic: "Poetry, Prose & Literary Devices",
    icon: "Feather",
    boss: "The Metaphor Mirage",
  },
  {
    id: "final-english-empire",
    name: "Final English Empire",
    topic: "Final Mastery Challenge",
    icon: "Castle",
    boss: "The Grammar Sovereign",
    isFinal: true,
  },
];

// Biology world map â€” same shape as WORLD_TEMPLATE (Chemistry) above, with
// its own unique world ids so it never collides with any other subject's
// content, progress keys, or storage keys.
export const BIOLOGY_WORLD_TEMPLATE = [
  {
    id: "cell-city",
    name: "Cell City",
    topic: "The Fundamental Unit of Life",
    icon: "Microscope",
    boss: "The Membrane Marauder",
  },
  {
    id: "tissue-terrace",
    name: "Tissue Terrace",
    topic: "Plant & Animal Tissues",
    icon: "Layers",
    boss: "The Tissue Titan",
  },
  {
    id: "kingdom-canyon",
    name: "Kingdom Canyon",
    topic: "Diversity in Living Organisms",
    icon: "PawPrint",
    boss: "The Classification Chimera",
  },
  {
    id: "wellness-woods",
    name: "Wellness Woods",
    topic: "Health & Disease",
    icon: "HeartPulse",
    boss: "The Pathogen Phantom",
  },
  {
    id: "resource-reef",
    name: "Resource Reef",
    topic: "Natural Resources",
    icon: "Droplets",
    boss: "The Pollution Wraith",
  },
  {
    id: "final-biology-biosphere",
    name: "Final Biology Biosphere",
    topic: "Food Resources & Final Mastery",
    icon: "Castle",
    boss: "The Evolution Sovereign",
    isFinal: true,
  },
];

// Hindi world map â€” same shape again, own unique ids. Content is CBSE's
// (and ICSE's) Hindi second-language paper; Tamil/Marathi/French are
// still separate "L2" placeholders in subjectCatalog.js since no real
// content exists for those yet (see note there).
export const HINDI_WORLD_TEMPLATE = [
  {
    id: "vyakaran-vatika",
    name: "Vyakaran Vatika",
    topic: "\u0938\u0902\u091c\u094d\u091e\u093e, \u0938\u0930\u094d\u0935\u0928\u093e\u092e \u0914\u0930 \u0915\u094d\u0930\u093f\u092f\u093e (Nouns, Pronouns & Verbs)",
    icon: "Sprout",
    boss: "\u0935\u094d\u092f\u093e\u0915\u0930\u0923 \u0930\u093e\u0915\u094d\u0937\u0938",
  },
  {
    id: "shabd-sagar",
    name: "Shabd Sagar",
    topic: "\u092a\u0930\u094d\u092f\u093e\u092f\u0935\u093e\u091a\u0940, \u0935\u093f\u0932\u094b\u092e \u0914\u0930 \u092e\u0941\u0939\u093e\u0935\u0930\u0947 (Synonyms, Antonyms & Idioms)",
    icon: "Waves",
    boss: "\u0936\u092c\u094d\u0926 \u0926\u093e\u0928\u0935",
  },
  {
    id: "vachan-ghati",
    name: "Vachan Ghati",
    topic: "\u0917\u0926\u094d\u092f\u093e\u0902\u0936 \u0914\u0930 \u092a\u0926\u094d\u092f\u093e\u0902\u0936 (Prose & Poetry Comprehension)",
    icon: "Mountain",
    boss: "\u092a\u094d\u0930\u0936\u094d\u0928 \u092a\u093f\u0936\u093e\u091a",
  },
  {
    id: "lekhan-lok",
    name: "Lekhan Lok",
    topic: "\u0928\u093f\u092c\u0902\u0927 \u0914\u0930 \u092a\u0924\u094d\u0930 \u0932\u0947\u0916\u0928 (Essay & Letter Writing)",
    icon: "PenLine",
    boss: "\u0916\u093e\u0932\u0940 \u092a\u0928\u094d\u0928\u093e \u092a\u094d\u0930\u0947\u0924",
  },
  {
    id: "sahitya-sarovar",
    name: "Sahitya Sarovar",
    topic: "\u0915\u093e\u0935\u094d\u092f \u0914\u0930 \u0905\u0932\u0902\u0915\u093e\u0930 (Poetic Devices & Literature)",
    icon: "BookMarked",
    boss: "\u0905\u0932\u0902\u0915\u093e\u0930 \u092e\u0930\u0940\u091a\u093f\u0915\u093e",
  },
  {
    id: "hindi-samman-shikhar",
    name: "Hindi Samman Shikhar",
    topic: "Final Mastery Challenge",
    icon: "Castle",
    boss: "\u092d\u093e\u0937\u093e \u0938\u092e\u094d\u0930\u093e\u091f",
    isFinal: true,
  },
];


// Tamil world map â€” TN board's primary second-language subject (not a
// generic elective â€” see subjectCatalog.js). Same shape again, own
// unique ids.
export const TAMIL_WORLD_TEMPLATE = [
  {
    id: "ezhuthu-thittam",
    name: "Ezhuthu Thittam",
    topic: "à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ (Script: Vowels, Consonants & Compound Letters)",
    icon: "Sprout",
    boss: "à®Žà®´à¯à®¤à¯à®¤à¯ à®…à®°à®•à¯à®•à®©à¯",
  },
  {
    id: "sol-vanam",
    name: "Sol Vanam",
    topic: "à®šà¯Šà®±à¯à®•à®³à¯, à®ªà®´à®®à¯Šà®´à®¿à®•à®³à¯ & à®®à®°à®ªà¯à®¤à¯à®¤à¯Šà®Ÿà®°à¯à®•à®³à¯ (Vocabulary & Proverbs)",
    icon: "Waves",
    boss: "à®šà¯Šà®²à¯ à®ªà¯‡à®¯à¯",
  },
  {
    id: "ilakkanam-kunru",
    name: "Ilakkanam Kunru",
    topic: "à®ªà¯†à®¯à®°à¯à®šà¯à®šà¯Šà®²à¯, à®µà®¿à®©à¯ˆà®šà¯à®šà¯Šà®²à¯ & à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ (Grammar & Case Markers)",
    icon: "Mountain",
    boss: "à®‡à®²à®•à¯à®•à®£ à®‡à®°à®¾à®Ÿà¯à®šà®šà®©à¯",
  },
  {
    id: "padaippu-paguthi",
    name: "Padaippu Paguthi",
    topic: "à®•à®Ÿà¯à®Ÿà¯à®°à¯ˆ, à®•à®Ÿà®¿à®¤à®®à¯ & à®‰à®°à¯ˆà®¯à®¾à®Ÿà®²à¯ (Composition & Letter Writing)",
    icon: "PenLine",
    boss: "à®µà¯†à®±à¯à®±à¯à®¤à¯à®¤à®¾à®³à¯ à®ªà¯‡à®¯à¯",
  },
  {
    id: "ilakkiya-thurai",
    name: "Ilakkiya Thurai",
    topic: "à®…à®£à®¿à®•à®³à¯ & à®‡à®²à®•à¯à®•à®¿à®¯à®®à¯ (Poetic Devices & Literature)",
    icon: "BookMarked",
    boss: "à®…à®£à®¿ à®®à®¾à®¯à¯ˆ",
  },
  {
    id: "tamil-arasu",
    name: "Tamil Arasu",
    topic: "Final Mastery Challenge",
    icon: "Castle",
    boss: "à®®à¯Šà®´à®¿ à®…à®°à®šà®©à¯",
    isFinal: true,
  },
];
// Social Science world map â€” same shape again, own unique ids. Covers the
// combined History + Civics + Geography + Economics syllabus used by CBSE/
// TN/MH/IB/IGCSE's single "Social Science" paper at grades 6-10 (ICSE
// splits this into separate History & Civics / Geography subjects instead
// â€” see subjectCatalog.js).
export const SOCIAL_SCIENCE_WORLD_TEMPLATE = [
  {
    id: "history-highlands",
    name: "History Highlands",
    topic: "Key Events That Shaped Nations",
    icon: "ScrollText",
    boss: "The Chronicle Wraith",
  },
  {
    id: "civics-citadel",
    name: "Civics Citadel",
    topic: "Democracy, Government & Rights",
    icon: "Landmark",
    boss: "The Bureaucracy Beast",
  },
  {
    id: "geo-garden",
    name: "Geo Garden",
    topic: "Physical & Human Geography",
    icon: "Globe2",
    boss: "The Cartography Colossus",
  },
  {
    id: "economy-isles",
    name: "Economy Isles",
    topic: "Money, Markets & Development",
    icon: "Coins",
    boss: "The Inflation Imp",
  },
  {
    id: "resource-ridge",
    name: "Resource Ridge",
    topic: "Natural Resources & Agriculture",
    icon: "TreePine",
    boss: "The Deforestation Djinn",
  },
  {
    id: "final-social-science-senate",
    name: "Final Social Science Senate",
    topic: "Final Mastery Challenge",
    icon: "Castle",
    boss: "The Constitution Colossus",
    isFinal: true,
  },
];

// Computer Science world map â€” same shape again, own unique ids.
export const COMPUTER_SCIENCE_WORLD_TEMPLATE = [
  {
    id: "byte-bay",
    name: "Byte Bay",
    topic: "Computer Fundamentals",
    icon: "Cpu",
    boss: "The Hardware Hydra",
  },
  {
    id: "algorithm-archipelago",
    name: "Algorithm Archipelago",
    topic: "Algorithms & Flowcharts",
    icon: "GitBranch",
    boss: "The Logic Leviathan",
  },
  {
    id: "code-canyon",
    name: "Code Canyon",
    topic: "Programming Basics: Variables, Loops & Conditionals",
    icon: "Terminal",
    boss: "The Syntax Error Specter",
  },
  {
    id: "data-structure-dunes",
    name: "Data Structure Dunes",
    topic: "Data Representation & Structures",
    icon: "Database",
    boss: "The Array Aberration",
  },
  {
    id: "network-nook",
    name: "Network Nook",
    topic: "The Internet & Networking Basics",
    icon: "Wifi",
    boss: "The Firewall Phantom",
  },
  {
    id: "final-code-citadel",
    name: "Final Code Citadel",
    topic: "Final Mastery Challenge",
    icon: "Castle",
    boss: "The Compiler Overlord",
    isFinal: true,
  },
];

// Maps a subject code (from subjectCatalog.js) to its world template.
// Unknown/omitted subjects default to Chemistry, matching the app's
// existing DEFAULT_SUBJECT behavior (server/src/lib/gameLogic.js).
export const WORLD_TEMPLATES_BY_SUBJECT = {
  CHEM: WORLD_TEMPLATE,
  MATH: MATH_WORLD_TEMPLATE,
  PHY: PHYSICS_WORLD_TEMPLATE,
  ENG: ENGLISH_WORLD_TEMPLATE,
  BIO: BIOLOGY_WORLD_TEMPLATE,
  HIN: HINDI_WORLD_TEMPLATE,
  TAM: TAMIL_WORLD_TEMPLATE,
  SST: SOCIAL_SCIENCE_WORLD_TEMPLATE,
  CS: COMPUTER_SCIENCE_WORLD_TEMPLATE,
};

export function worldTemplateFor(subject) {
  return WORLD_TEMPLATES_BY_SUBJECT[subject] ?? WORLD_TEMPLATE;
}

// Tiny deterministic string hash â€” NOT cryptographic, just enough to turn
// "9-CBSE" vs "9-TN" into different-but-stable mock progress so switching
// curriculum (Section 29) visibly shows separate progress per Section 28
// ("never overwrite progress between different curricula") without a
// backend yet. Replace with a real GET /api/player/progress read once the
// progress API exists.
export function seededRatio(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return (Math.abs(h) % 1000) / 1000;
}

export function starsForProgress(progress) {
  if (progress >= 90) return 3;
  if (progress >= 70) return 2;
  if (progress >= 50) return 1;
  return 0;
}

// Builds the player's world map for a given Class + Board. Worlds unlock
// sequentially â€” clearing one (100% complete) opens the next, matching the
// locked/unlocked/completed states called for in Section 10.
export function getWorldMap(grade, board, subject) {
  let previousCleared = true;

  const worlds = worldTemplateFor(subject).map((world, i) => {
    const seed = `${grade ?? "9"}-${board ?? "CBSE"}-${world.id}`;
    const roll = seededRatio(seed);

    let status = "locked";
    let progress = 0;

    if (previousCleared) {
      // First not-yet-cleared world in the chain is always at least
      // "unlocked" so there's always something playable next.
      progress = i === 0 ? Math.round(35 + roll * 65) : Math.round(roll * 100);
      status = progress >= 100 ? "completed" : "unlocked";
      progress = Math.min(progress, status === "completed" ? 100 : 96);
    }

    previousCleared = status === "completed";

    return {
      ...world,
      status,
      progress,
      stars: status === "completed" ? starsForProgress(progress) : 0,
      xp: status === "completed" ? Math.round(180 + roll * 320) : 0,
    };
  });

  const completedCount = worlds.filter((w) => w.status === "completed").length;
  const totalStars = worlds.reduce((sum, w) => sum + w.stars, 0);
  const totalXp = worlds.reduce((sum, w) => sum + w.xp, 0);
  const overallProgress = Math.round(
    worlds.reduce((sum, w) => sum + (w.status === "completed" ? 100 : w.progress), 0) /
      worlds.length
  );

  return { worlds, completedCount, totalStars, totalXp, overallProgress };
}

// Mock signed-in player HUD data (top strip on the World Map). Wire to
// GET /api/player once auth + the player API exist â€” see Section 23.
export const MOCK_PLAYER = {
  name: "Chemist",
  level: 12,
  xp: 850,
  xpToNext: 1200,
  coins: 850,
  streak: 7,
};

// Player Dashboard (Section 23). Badges, daily quests, and a recent-
// achievements feed for the home hub. Wire to GET /api/player,
// GET /api/quests, and GET /api/achievements once those APIs exist.
export const MOCK_BADGES = [
  { icon: "Trophy", name: "First Quest", unlocked: true, xp: 10, meta: "Completed your first lesson" },
  { icon: "Flame", name: "7 Day Streak", unlocked: true, xp: 50, meta: "Logged in 7 days in a row" },
  { icon: "Atom", name: "Atomic Expert", unlocked: true, xp: 30, meta: "Completed Atomic Structure" },
  { icon: "FlaskConical", name: "Lab Explorer", unlocked: true, xp: 20, meta: "Explored every world once" },
  { icon: "Swords", name: "Boss Slayer", unlocked: true, xp: 40, meta: "Defeated a chapter boss" },
  { icon: "Star", name: "50 Stars", unlocked: true, xp: 25, meta: "Earned 50 total stars" },
  { icon: "Target", name: "Perfect Score", unlocked: false },
  { icon: "Crown", name: "Chemistry Legend", unlocked: false },
];

export const MOCK_DAILY_QUESTS = [
  { id: "dq1", title: "Complete 1 Lesson", progress: 1, target: 1, xp: 200, coins: 100 },
  { id: "dq2", title: "Answer 10 Questions", progress: 6, target: 10, xp: 200, coins: 100 },
  { id: "dq3", title: "Earn 100 XP", progress: 100, target: 100, xp: 200, coins: 100 },
  { id: "dq4", title: "Defeat 1 Mini Boss", progress: 0, target: 1, xp: 200, coins: 100 },
];

export const MOCK_RECENT_ACHIEVEMENTS = [
  { icon: "Swords", title: "Defeated Proton Guardian", meta: "Atom Valley Boss \u00b7 2h ago" },
  { icon: "Star", title: "3-Star Clear: Isotopes", meta: "Atom Valley \u00b7 1d ago" },
  { icon: "Flame", title: "7 Day Streak Reached", meta: "Daily login \u00b7 2d ago" },
  { icon: "Sparkles", title: "Earned 100 Bonus XP", meta: "Daily Quest \u00b7 2d ago" },
];

// Builds the Player Dashboard's data (Section 23): the player HUD, badge
// count, daily quests, recent achievements, "Continue Adventure" (first
// unlocked-but-not-completed world in the current curriculum), and a
// per-curriculum progress list (Section 28 â€” tracked separately per
// Class + Board, never overwritten). The extra curricula are illustrative
// "other saved adventures"; swap for a real GET /api/player/progress list
// (all class/board pairs the player has touched) once that endpoint exists.
export function getDashboardData(grade, board, subject) {
  const currentGrade = grade ?? "9";
  const currentBoard = board ?? "CBSE";
  const { worlds, completedCount, totalStars, totalXp, overallProgress } =
    getWorldMap(currentGrade, currentBoard, subject);

  const continueWorld =
    worlds.find((w) => w.status === "unlocked") ??
    worlds.find((w) => w.status !== "completed") ??
    null;

  const otherCombos = [
    { grade: "9", board: "TN" },
    { grade: "10", board: "CBSE" },
  ].filter((c) => !(c.grade === currentGrade && c.board === currentBoard));

  const curricula = [
    {
      grade: currentGrade,
      board: currentBoard,
      current: true,
      overallProgress,
      totalStars,
    },
    ...otherCombos.map((c) => {
      const map = getWorldMap(c.grade, c.board, subject);
      return {
        grade: c.grade,
        board: c.board,
        current: false,
        overallProgress: map.overallProgress,
        totalStars: map.totalStars,
      };
    }),
  ];

  return {
    worlds,
    completedCount,
    totalStars,
    totalXp,
    overallProgress,
    continueWorld,
    curricula,
    badgesUnlocked: MOCK_BADGES.filter((b) => b.unlocked).length,
  };
}

// Player Profile (Section 24) extra stats not already covered by
// MOCK_PLAYER / getDashboardData. Wire to GET /api/player once the
// player API exists.
export const MOCK_PROFILE_EXTRA = {
  avatarIcon: "FlaskConical",
  questionsAnswered: 742,
  levelsCompleted: 58,
  bossesDefeated: 3,
  accuracy: 84,
};

// Builds Player Profile data (Section 24): identity + all-time stats plus
// the player's current Class/Board/Course, reusing getDashboardData for
// the "current course" (first completed or in-progress world).
export function getProfileData(grade, board) {
  const currentGrade = grade ?? "9";
  const currentBoard = board ?? "CBSE";
  const dashboard = getDashboardData(currentGrade, currentBoard);
  const currentCourse =
    dashboard.continueWorld?.name ??
    dashboard.worlds.find((w) => w.status === "completed")?.name ??
    dashboard.worlds[0]?.name ??
    null;

  return {
    ...MOCK_PLAYER,
    ...MOCK_PROFILE_EXTRA,
    totalStars: dashboard.totalStars,
    currentGrade,
    currentBoard,
    currentCourse,
  };
}

// Achievements (Section 25). Full detail behind the Dashboard's compact
// badge grid â€” description, unlock status, and progress toward locked
// ones. Wire to GET /api/achievements once that endpoint exists.
export const MOCK_ACHIEVEMENTS = [
  {
    id: "first-quest",
    icon: "Trophy",
    name: "First Quest",
    description: "Complete your very first lesson.",
    unlocked: true,
    unlockedMeta: "Unlocked on Day 1",
  },
  {
    id: "streak-7",
    icon: "Flame",
    name: "7 Day Streak",
    description: "Log in and play for 7 days in a row.",
    unlocked: true,
    unlockedMeta: "Unlocked 2 days ago",
  },
  {
    id: "atomic-expert",
    icon: "Atom",
    name: "Atomic Expert",
    description: "Score 90%+ on every lesson in Atom Valley.",
    unlocked: true,
    unlockedMeta: "Unlocked 5 days ago",
  },
  {
    id: "lab-explorer",
    icon: "FlaskConical",
    name: "Lab Explorer",
    description: "Visit all six Chemistry Worlds at least once.",
    unlocked: true,
    unlockedMeta: "Unlocked 1 week ago",
  },
  {
    id: "boss-slayer",
    icon: "Swords",
    name: "Boss Slayer",
    description: "Defeat 3 chapter bosses.",
    unlocked: true,
    unlockedMeta: "Unlocked 2 hours ago",
    progressCurrent: 3,
    progressTarget: 3,
  },
  {
    id: "50-stars",
    icon: "Star",
    name: "50 Stars",
    description: "Earn 50 stars total across all lessons.",
    unlocked: true,
    unlockedMeta: "Unlocked 3 days ago",
    progressCurrent: 50,
    progressTarget: 50,
  },
  {
    id: "perfect-score",
    icon: "Target",
    name: "Perfect Score",
    description: "Clear a level with 100% accuracy.",
    unlocked: false,
    progressCurrent: 0,
    progressTarget: 1,
  },
  {
    id: "chemistry-legend",
    icon: "Crown",
    name: "Chemistry Legend",
    description: "Defeat every chapter boss across a full curriculum.",
    unlocked: false,
    progressCurrent: 3,
    progressTarget: 6,
  },
];

// Leaderboard (Section 27). Deterministic mock rows (same seeded-hash
// trick as world/board progress) so switching scope/period filters shows
// visibly different but stable rankings without a backend. Wire to
// GET /api/leaderboard once that endpoint exists.
const LEADERBOARD_NAMES = [
  "Aarav", "Diya", "Kabir", "Meera", "Rohan", "Ishita", "Vihaan", "Ananya",
  "Aryan", "Priya", "Sai", "Tara", "Dev", "Kavya", "Arjun", "Nisha",
  "Vikram", "Sneha", "Karthik", "Pooja",
];

export const LEADERBOARD_SCOPES = [
  { id: "global", label: "Global" },
  { id: "class", label: "My Class" },
  { id: "board", label: "My Board" },
];

export const LEADERBOARD_PERIODS = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "all-time", label: "All Time" },
];

export function getLeaderboardData(scope, period, grade, board, live) {
  const currentGrade = grade ?? "9";
  const currentBoard = board ?? "CBSE";
  const seedBase = `${scope}-${period}-${currentGrade}-${currentBoard}`;

  const others = LEADERBOARD_NAMES.map((name) => {
    const roll = seededRatio(`${seedBase}-${name}`);
    const level = 8 + Math.floor(roll * 20);
    const xp = 600 + Math.floor(roll * 9400);
    const stars = 15 + Math.floor(roll * 210);
    return { name, level, xp, stars, isYou: false };
  });

  const dashboard = getDashboardData(currentGrade, currentBoard);
  // If the caller passed live player-store totals (Section 40's real
  // XP/stars from actual play), rank "You" using those instead of the
  // static mock so clearing lessons/bosses actually moves your rank.
  const you = {
    name: MOCK_PLAYER.name,
    level: MOCK_PLAYER.level,
    xp: live?.xp != null ? MOCK_PLAYER.level * 700 + live.xp : MOCK_PLAYER.level * 700 + MOCK_PLAYER.xp,
    stars: live?.stars ?? dashboard.totalStars,
    isYou: true,
  };

  const rows = [...others, you]
    .sort((a, b) => b.xp - a.xp)
    .map((row, i) => ({ ...row, rank: i + 1 }));

  const yourRow = rows.find((r) => r.isYou);

  return { rows, yourRow };
}

// Shop (Section 33). Virtual-coin-only purchases across avatars, skins,
// backgrounds, power-ups (Section 20), frames, and effects. Wire to a
// real GET/POST /api/shop once that endpoint exists â€” "owned" here is
// just initial mock state, not persisted.
export const SHOP_CATEGORIES = [
  { id: "avatars", label: "Avatars", icon: "UserRound" },
  { id: "skins", label: "Skins", icon: "Shirt" },
  { id: "backgrounds", label: "Backgrounds", icon: "Image" },
  { id: "powerups", label: "Power-Ups", icon: "Zap" },
  { id: "frames", label: "Frames", icon: "Square" },
  { id: "effects", label: "Effects", icon: "Wand2" },
];

export const SHOP_ITEMS = [
  { id: "av-atom", category: "avatars", name: "Atom Adept", icon: "Atom", price: 150, owned: true },
  { id: "av-flask", category: "avatars", name: "Flask Fighter", icon: "FlaskConical", price: 150, owned: false },
  { id: "av-crystal", category: "avatars", name: "Crystal Sage", icon: "Gem", price: 300, owned: false },
  { id: "av-phoenix", category: "avatars", name: "Alchemy Phoenix", icon: "Bird", price: 500, owned: false },

  { id: "skin-neon", category: "skins", name: "Neon Circuit Skin", icon: "Sparkle", price: 250, owned: false },
  { id: "skin-lava", category: "skins", name: "Molten Lava Skin", icon: "Flame", price: 250, owned: false },
  { id: "skin-frost", category: "skins", name: "Frost Lab Skin", icon: "Snowflake", price: 250, owned: true },

  { id: "bg-nebula", category: "backgrounds", name: "Nebula Lab", icon: "Sparkles", price: 200, owned: false },
  { id: "bg-cave", category: "backgrounds", name: "Crystal Cavern", icon: "Mountain", price: 200, owned: false },
  { id: "bg-volcano", category: "backgrounds", name: "Volcanic Ridge", icon: "Flame", price: 200, owned: false },

  { id: "pu-hint", category: "powerups", name: "Hint Potion", icon: "FlaskConical", price: 50, owned: false, description: "Removes one incorrect answer." },
  { id: "pu-doublexp", category: "powerups", name: "Double XP", icon: "Zap", price: 80, owned: false, description: "Doubles XP earned for one level." },
  { id: "pu-shield", category: "powerups", name: "Shield", icon: "Shield", price: 70, owned: false, description: "Protects one life." },
  { id: "pu-freeze", category: "powerups", name: "Time Freeze", icon: "Clock", price: 60, owned: false, description: "Stops the timer temporarily." },
  { id: "pu-chemhint", category: "powerups", name: "Chemistry Hint", icon: "Lightbulb", price: 40, owned: false, description: "Provides a clue toward the answer." },

  { id: "fr-gold", category: "frames", name: "Gold Ring Frame", icon: "Circle", price: 300, owned: false },
  { id: "fr-arcane", category: "frames", name: "Arcane Frame", icon: "Hexagon", price: 300, owned: true },

  { id: "fx-sparks", category: "effects", name: "Victory Sparks", icon: "Sparkles", price: 180, owned: false },
  { id: "fx-trail", category: "effects", name: "Molecule Trail", icon: "Orbit", price: 180, owned: false },
];

// Convenience view of just the powerups category, so Battle/Boss Battle
// don't need to filter SHOP_ITEMS themselves to render the power-up tray.
export const POWERUP_ITEMS = SHOP_ITEMS.filter((i) => i.category === "powerups");

// Section 20's "Chemistry Hint" power-up ("provides a clue toward the
// answer") is deliberately weaker than the Hint Potion (which removes a
// wrong option outright) â€” it nudges without giving the answer away, so
// it's generated from the question's own shape rather than authored per
// question.
// Section 16 free-text question types (Fill in the Blank, Numerical)
// share the same answer box (components/FillBlankInput.jsx) since neither
// has an options list. Correctness is compared here so Battle and Boss
// Battle can't drift apart on how each type gets graded: Fill in the
// Blank is a trimmed, case-insensitive string match; Numerical does the
// same but also accepts numeric equivalence (e.g. "18" vs "18.0" vs "
// 18 ") since a player shouldn't lose a life over formatting.
export function isFreeTextCorrect(question, rawAnswer) {
  if (rawAnswer == null) return false;
  const given = rawAnswer.trim().toLowerCase();
  const correct = String(question.correctAnswer).trim().toLowerCase();
  if (given === correct) return true;
  if (question.type === "numerical") {
    const givenNum = parseFloat(given);
    const correctNum = parseFloat(correct);
    if (!Number.isNaN(givenNum) && !Number.isNaN(correctNum)) {
      return Math.abs(givenNum - correctNum) < 1e-9;
    }
  }
  return false;
}

// True for any question type that answers via FillBlankInput's free-text
// box rather than an options grid (Section 16): Fill in the Blank,
// Numerical, and Chemical Equation (a missing-coefficient fill-in, so it
// needs no answer-input component of its own beyond what Fill in the
// Blank already provides).
export function isFreeTextQuestion(question) {
  return (
    question?.type === "fill_blank" ||
    question?.type === "numerical" ||
    question?.type === "chemical_equation"
  );
}

// The two remaining Section 16 interactive types. Both use tap-based
// components (MatchPairsInput / SequenceInput) rather than native
// drag-and-drop â€” see those components' file comments for why â€” so
// their answer payload isn't a single string like the option/free-text
// types above: it's an object (match) or an ordered array (sequence).
export function isMatchQuestion(question) {
  return question?.type === "match_following";
}

export function isSequenceQuestion(question) {
  return question?.type === "drag_drop";
}

// True for Multiple Select questions â€” answered by tapping one or more
// options (and submitting), rather than a single-tap single option.
export function isMultiSelectQuestion(question) {
  return question?.type === "multi_select";
}

// Grades Match the Following, Drag and Drop, and Multiple Select answers.
// `payload` is whatever the input component hands back via onSubmit:
// a {left: right} map for a match question, an ordered array of item
// labels for a sequence question, or an array of selected option labels
// for multi-select. Multi-select is order-independent set equality.
export function isSpecialCorrect(question, payload) {
  if (isMatchQuestion(question)) {
    const pairs = question.pairs ?? [];
    if (!payload || typeof payload !== "object" || Object.keys(payload).length !== pairs.length) {
      return false;
    }
    return pairs.every((p) => payload[p.left] === p.right);
  }
  if (isSequenceQuestion(question)) {
    if (!Array.isArray(payload)) return false;
    return payload.join("|") === question.correctAnswer;
  }
  if (isMultiSelectQuestion(question)) {
    if (!Array.isArray(payload)) return false;
    const correct = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.map(String)
      : String(question.correctAnswer).split("|").map((s) => s.trim());
    if (payload.length !== correct.length) return false;
    const chosen = payload.map(String).sort().join("|");
    const expected = correct.sort().join("|");
    return chosen === expected;
  }
  return false;
}

// Human-readable badge label for each Section 16 question type, shown on
// the Battle screen so "not just multiple choice" is visible, not just
// true under the hood. Falls back to "Multiple Choice" for plain/true-false
// items and anything untagged.
const TYPE_LABELS = {
  mcq: "Multiple Choice",
  true_false: "True / False",
  fill_blank: "Fill in the Blank",
  numerical: "Numerical",
  chemical_equation: "Chemical Equation",
  match_following: "Match the Following",
  drag_drop: "Drag & Drop",
  multi_select: "Multiple Select",
  reaction: "Reaction Question",
};

export function getQuestionTypeLabel(question) {
  const type = question?.type ?? "mcq";
  if (question?.image) return "Image-Based";
  return TYPE_LABELS[type] ?? "Multiple Choice";
}

export function getPowerupClue(question) {
  if (!question) return "";
  const answer = String(question.correctAnswer ?? "");
  if (question.type === "fill_blank" || question.type === "chemical_equation") {
    return `${answer.length}-character answer, starting with "${answer.trim()[0]?.toUpperCase() ?? "?"}".`;
  }
  if (question.type === "numerical") {
    const digits = answer.replace(/[^0-9]/g, "").length;
    return `A ${digits}-digit number${answer.includes(".") ? " with a decimal point" : ""}.`;
  }
  if (question.type === "match_following") {
    const first = question.pairs?.[0];
    return first ? `"${first.left}" pairs with "${first.right}".` : "Look for the closest meaning in each pair.";
  }
  if (question.type === "drag_drop") {
    const firstItem = answer.split("|")[0];
    return firstItem ? `The sequence starts with "${firstItem}".` : "Think about what comes first.";
  }
  const firstLetter = answer.trim()[0]?.toUpperCase() ?? "?";
  return `The correct option starts with "${firstLetter}".`;
}

// Course/Chapter screen (Section 11). Each world's lesson list â€” the
// *configurable* curriculum shell per Section 41. Swap these per real
// board/class content from GET /api/lessons?course=... once that endpoint
// exists; every lesson maps 1:1 to a playable game level (Section 12).
export const LESSONS_BY_WORLD = {
  "atom-valley": [
    { id: "l1", title: "Introduction to Atoms", description: "What atoms are and why everything is made of them." },
    { id: "l2", title: "Atomic Structure", description: "Protons, neutrons, and electrons â€” the anatomy of an atom." },
    { id: "l3", title: "Electron Configuration", description: "How electrons fill shells and why it matters." },
    { id: "l4", title: "Isotopes", description: "Same element, different mass â€” what makes an isotope." },
    { id: "l5", title: "Atomic Models", description: "From Dalton to Bohr â€” how our picture of the atom evolved." },
  ],
  "molecule-forest": [
    { id: "l1", title: "Introduction to Molecules", description: "How atoms combine to form molecules." },
    { id: "l2", title: "Compounds vs Mixtures", description: "Telling a compound apart from a mixture." },
    { id: "l3", title: "Molecular Formulas", description: "Reading and writing chemical formulas." },
    { id: "l4", title: "Naming Compounds", description: "Rules for naming common chemical compounds." },
    { id: "l5", title: "Molar Mass", description: "Calculating the mass of a mole of a substance." },
  ],
  "bonding-cave": [
    { id: "l1", title: "Ionic Bonding", description: "How ions form bonds by transferring electrons." },
    { id: "l2", title: "Covalent Bonding", description: "How atoms share electrons to bond." },
    { id: "l3", title: "Metallic Bonding", description: "The 'sea of electrons' that holds metals together." },
    { id: "l4", title: "Bond Polarity", description: "Why some bonds are polar and others aren't." },
    { id: "l5", title: "Molecular Shapes", description: "Predicting 3D shapes with VSEPR theory." },
  ],
  "reaction-volcano": [
    { id: "l1", title: "Types of Reactions", description: "Combination, decomposition, displacement, and more." },
    { id: "l2", title: "Balancing Equations", description: "Making sure atoms are conserved on both sides." },
    { id: "l3", title: "Reaction Rates", description: "What speeds up or slows down a reaction." },
    { id: "l4", title: "Energy in Reactions", description: "Exothermic vs endothermic reactions." },
    { id: "l5", title: "Catalysts", description: "How catalysts change reaction speed without being used up." },
  ],
  "acid-base-island": [
    { id: "l1", title: "Introduction to Acids & Bases", description: "What makes a substance acidic or basic." },
    { id: "l2", title: "The pH Scale", description: "Measuring acidity and basicity from 0 to 14." },
    { id: "l3", title: "Neutralization", description: "What happens when an acid meets a base." },
    { id: "l4", title: "Salts", description: "How salts form and what they're made of." },
    { id: "l5", title: "Indicators", description: "Using indicators to test acidity in the lab." },
  ],
  "final-chemistry-kingdom": [
    { id: "l1", title: "Comprehensive Review", description: "A mixed recap across every world you've cleared." },
    { id: "l2", title: "Mixed Practice", description: "Cross-topic questions pulled from the whole syllabus." },
    { id: "l3", title: "Speed Challenge", description: "Beat the clock on rapid-fire chemistry questions." },
    { id: "l4", title: "Master Trial", description: "The final gauntlet before the Chemistry Master title." },
  ],

  // --- Mathematics -----------------------------------------------------
  "number-nexus": [
    { id: "l1", title: "Types of Numbers", description: "Natural numbers, integers, rationals, and irrationals." },
    { id: "l2", title: "Real Numbers on a Line", description: "Placing and comparing numbers on the number line." },
    { id: "l3", title: "Exponents & Powers", description: "Rules for multiplying, dividing, and raising powers." },
    { id: "l4", title: "Factors & Multiples", description: "HCF, LCM, and prime factorization." },
    { id: "l5", title: "Rounding & Estimation", description: "Approximating numbers sensibly and checking answers." },
  ],
  "algebra-atrium": [
    { id: "l1", title: "Introduction to Algebra", description: "Variables, constants, and algebraic expressions." },
    { id: "l2", title: "Simplifying Expressions", description: "Combining like terms and expanding brackets." },
    { id: "l3", title: "Linear Equations", description: "Solving for x in one-variable equations." },
    { id: "l4", title: "Simultaneous Equations", description: "Solving two equations with two unknowns." },
    { id: "l5", title: "Factorization", description: "Breaking expressions down into factors." },
  ],
  "geometry-grove": [
    { id: "l1", title: "Lines & Angles", description: "Types of angles and the rules that relate them." },
    { id: "l2", title: "Triangles", description: "Classifying triangles and their angle properties." },
    { id: "l3", title: "Congruence", description: "When two triangles are exactly the same shape and size." },
    { id: "l4", title: "The Pythagorean Theorem", description: "Relating the sides of a right-angled triangle." },
    { id: "l5", title: "Circles", description: "Radius, diameter, chords, and circle theorems basics." },
  ],
  "mensuration-mines": [
    { id: "l1", title: "Perimeter & Area Basics", description: "Measuring the edges and surfaces of flat shapes." },
    { id: "l2", title: "Area of Triangles & Quadrilaterals", description: "Formulas for common polygon areas." },
    { id: "l3", title: "Circles: Area & Circumference", description: "Working with Ï€ to measure circular shapes." },
    { id: "l4", title: "Surface Area of Solids", description: "Covering cubes, cuboids, and cylinders." },
    { id: "l5", title: "Volume of Solids", description: "How much space 3D shapes take up." },
  ],
  "data-desert": [
    { id: "l1", title: "Collecting & Organizing Data", description: "Tally marks, frequency tables, and raw data." },
    { id: "l2", title: "Mean, Median & Mode", description: "The three measures of central tendency." },
    { id: "l3", title: "Graphs & Charts", description: "Bar graphs, histograms, and pie charts." },
    { id: "l4", title: "Introduction to Probability", description: "Chance, outcomes, and simple probability." },
    { id: "l5", title: "Probability of Events", description: "Calculating probability for real-world situations." },
  ],
  "final-math-summit": [
    { id: "l1", title: "Comprehensive Review", description: "A mixed recap across every world you've cleared." },
    { id: "l2", title: "Mixed Practice", description: "Cross-topic questions pulled from the whole syllabus." },
    { id: "l3", title: "Speed Challenge", description: "Beat the clock on rapid-fire math questions." },
    { id: "l4", title: "Master Trial", description: "The final gauntlet before the Math Master title." },
  ],

  // --- Physics -----------------------------------------------------------
  "motion-meadow": [
    { id: "l1", title: "Distance & Displacement", description: "Telling how far you traveled apart from how far you ended up." },
    { id: "l2", title: "Speed & Velocity", description: "The difference between how fast you go and which way you're going." },
    { id: "l3", title: "Acceleration", description: "How velocity changes over time, and what it means to speed up or slow down." },
    { id: "l4", title: "Equations of Motion", description: "Using v = u + at and friends to solve motion problems." },
    { id: "l5", title: "Graphs of Motion", description: "Reading distance-time and velocity-time graphs." },
  ],
  "force-falls": [
    { id: "l1", title: "Newton's First Law", description: "Why objects at rest stay at rest, and objects in motion stay in motion." },
    { id: "l2", title: "Newton's Second Law", description: "How force, mass, and acceleration relate through F = ma." },
    { id: "l3", title: "Newton's Third Law", description: "Every action has an equal and opposite reaction." },
    { id: "l4", title: "Momentum", description: "Mass in motion, and how it's conserved in collisions." },
    { id: "l5", title: "Friction", description: "The force that resists sliding, and when it helps or hurts." },
  ],
  "energy-expanse": [
    { id: "l1", title: "Work Done", description: "When a force actually does work, and how to calculate it." },
    { id: "l2", title: "Kinetic & Potential Energy", description: "Energy of motion versus energy of position." },
    { id: "l3", title: "Conservation of Energy", description: "Why energy is never created or destroyed, only transformed." },
    { id: "l4", title: "Power", description: "How quickly work gets done." },
    { id: "l5", title: "Commercial Units of Energy", description: "Kilowatt-hours and how an electricity bill is calculated." },
  ],
  "circuit-caverns": [
    { id: "l1", title: "Electric Current & Circuits", description: "Charge in motion, and the parts of a simple circuit." },
    { id: "l2", title: "Ohm's Law", description: "How voltage, current, and resistance relate." },
    { id: "l3", title: "Resistance & Resistivity", description: "What determines how much a material resists current." },
    { id: "l4", title: "Series & Parallel Circuits", description: "Two ways to wire components together, and how it changes current flow." },
    { id: "l5", title: "Electric Power & Heating Effect", description: "How electrical energy turns into heat and light." },
  ],
  "light-lagoon": [
    { id: "l1", title: "Reflection of Light", description: "The laws that govern how light bounces off surfaces." },
    { id: "l2", title: "Spherical Mirrors", description: "Concave and convex mirrors, and the images they form." },
    { id: "l3", title: "Refraction of Light", description: "Why light bends when it passes between materials." },
    { id: "l4", title: "Lenses", description: "Convex and concave lenses, and how they focus light." },
    { id: "l5", title: "The Human Eye", description: "How the eye focuses light, and common vision defects." },
  ],
  "final-physics-frontier": [
    { id: "l1", title: "Comprehensive Review", description: "A mixed recap across every world you've cleared." },
    { id: "l2", title: "Mixed Practice", description: "Cross-topic questions pulled from the whole syllabus." },
    { id: "l3", title: "Speed Challenge", description: "Beat the clock on rapid-fire physics questions." },
    { id: "l4", title: "Master Trial", description: "The final gauntlet before the Physics Master title." },
  ],

  // --- English -------------------------------------------------------
  "grammar-grasslands": [
    { id: "l1", title: "Parts of Speech", description: "Nouns, verbs, adjectives, and the building blocks of every sentence." },
    { id: "l2", title: "Tenses", description: "Past, present, and future â€” and the forms in between." },
    { id: "l3", title: "Subject-Verb Agreement", description: "Making sure your subject and verb always match." },
    { id: "l4", title: "Sentence Types", description: "Simple, compound, and complex sentences, and how to build them." },
    { id: "l5", title: "Punctuation", description: "Commas, apostrophes, and full stops â€” the marks that shape meaning." },
  ],
  "vocabulary-valley": [
    { id: "l1", title: "Synonyms & Antonyms", description: "Words that mean the same, and words that mean the opposite." },
    { id: "l2", title: "Prefixes & Suffixes", description: "Building new words by changing what's added to a root." },
    { id: "l3", title: "Homophones & Homonyms", description: "Words that sound alike or look alike but mean different things." },
    { id: "l4", title: "Idioms & Phrases", description: "Common expressions that mean more than their literal words." },
    { id: "l5", title: "Context Clues", description: "Figuring out a word's meaning from how it's used in a sentence." },
  ],
  "comprehension-cliffs": [
    { id: "l1", title: "Reading for Detail", description: "Picking out the facts stated directly in a passage." },
    { id: "l2", title: "Main Idea & Theme", description: "Finding what a passage is really about." },
    { id: "l3", title: "Making Inferences", description: "Reading between the lines to understand what isn't said outright." },
    { id: "l4", title: "Author's Purpose & Tone", description: "Why a writer wrote something, and how they feel about it." },
    { id: "l5", title: "Sequencing Events", description: "Putting the events of a passage in the order they happened." },
  ],
  "composition-cove": [
    { id: "l1", title: "Paragraph Structure", description: "Topic sentences, supporting details, and a clear conclusion." },
    { id: "l2", title: "Descriptive Writing", description: "Using vivid details to help a reader picture a scene." },
    { id: "l3", title: "Narrative Writing", description: "Telling a story with a clear beginning, middle, and end." },
    { id: "l4", title: "Formal Letters & Emails", description: "Writing with the right tone and structure for formal messages." },
    { id: "l5", title: "Editing & Proofreading", description: "Catching and fixing errors before calling a piece finished." },
  ],
  "literary-lagoon": [
    { id: "l1", title: "Introduction to Poetry", description: "Rhyme, rhythm, and how a poem is put together." },
    { id: "l2", title: "Figures of Speech", description: "Metaphor, simile, personification, and other literary devices." },
    { id: "l3", title: "Elements of a Story", description: "Plot, character, setting, and conflict in fiction." },
    { id: "l4", title: "Prose vs Poetry", description: "Telling apart the two major forms of literary writing." },
    { id: "l5", title: "Analyzing a Passage", description: "Digging into word choice, tone, and structure in a piece of writing." },
  ],
  "final-english-empire": [
    { id: "l1", title: "Comprehensive Review", description: "A mixed recap across every world you've cleared." },
    { id: "l2", title: "Mixed Practice", description: "Cross-topic questions pulled from the whole syllabus." },
    { id: "l3", title: "Speed Challenge", description: "Beat the clock on rapid-fire English questions." },
    { id: "l4", title: "Master Trial", description: "The final gauntlet before the English Master title." },
  ],

  // --- Biology ---------------------------------------------------------
  "cell-city": [
    { id: "l1", title: "Discovery of the Cell", description: "Who discovered cells, and why the cell is the basic unit of life." },
    { id: "l2", title: "Cell Membrane & Cell Wall", description: "The structures that protect and control what enters or leaves a cell." },
    { id: "l3", title: "The Nucleus", description: "The control center that houses a cell's genetic material." },
    { id: "l4", title: "Cell Organelles", description: "Mitochondria, ribosomes, the Golgi apparatus, and other tiny cell machinery." },
    { id: "l5", title: "Plant Cell vs Animal Cell", description: "Spotting the structural differences between plant and animal cells." },
  ],
  "tissue-terrace": [
    { id: "l1", title: "What is a Tissue?", description: "Why cells group together to form tissues." },
    { id: "l2", title: "Plant Tissues: Meristematic", description: "The tissues responsible for growth in plants." },
    { id: "l3", title: "Plant Tissues: Permanent", description: "Simple and complex permanent tissues in plants." },
    { id: "l4", title: "Animal Tissues: Epithelial & Connective", description: "Covering and connecting tissues in animals." },
    { id: "l5", title: "Animal Tissues: Muscular & Nervous", description: "Tissues that let animals move and sense the world." },
  ],
  "kingdom-canyon": [
    { id: "l1", title: "Classification Basics", description: "Why scientists classify living organisms into groups." },
    { id: "l2", title: "Kingdom Monera & Protista", description: "The simplest classification kingdoms." },
    { id: "l3", title: "Kingdom Fungi & Plantae", description: "Fungi and the major divisions of the plant kingdom." },
    { id: "l4", title: "Kingdom Animalia: Invertebrates", description: "Animals without a backbone, from sponges to arthropods." },
    { id: "l5", title: "Kingdom Animalia: Vertebrates", description: "Animals with a backbone, from fish to mammals." },
  ],
  "wellness-woods": [
    { id: "l1", title: "What is Health?", description: "Understanding health as more than just 'not being sick'." },
    { id: "l2", title: "Types of Diseases", description: "Telling acute apart from chronic, and infectious from non-infectious." },
    { id: "l3", title: "Infectious Agents", description: "Bacteria, viruses, fungi, and other disease-causing organisms." },
    { id: "l4", title: "How Diseases Spread", description: "Common routes of transmission and how to break the chain." },
    { id: "l5", title: "Prevention & Immunization", description: "Vaccines and other ways the body defends against disease." },
  ],
  "resource-reef": [
    { id: "l1", title: "The Air We Breathe", description: "The atmosphere's role in supporting life." },
    { id: "l2", title: "Water as a Resource", description: "The water cycle and why fresh water matters." },
    { id: "l3", title: "Soil Formation", description: "How soil forms and why it's essential for life." },
    { id: "l4", title: "Biogeochemical Cycles", description: "How carbon, nitrogen, and oxygen cycle through the environment." },
    { id: "l5", title: "Ozone Layer & Pollution", description: "The ozone layer's protective role and the impact of pollution." },
  ],
  "final-biology-biosphere": [
    { id: "l1", title: "Improvement in Crop Yields", description: "Crop variety improvement, manures, and fertilizers." },
    { id: "l2", title: "Animal Husbandry", description: "Raising livestock, poultry, and fish for food." },
    { id: "l3", title: "Mixed Practice", description: "Cross-topic questions pulled from the whole syllabus." },
    { id: "l4", title: "Master Trial", description: "The final gauntlet before the Biology Master title." },
  ],

  // --- Hindi -------------------------------------------------------------
  "vyakaran-vatika": [
    { id: "l1", title: "\u0938\u0902\u091c\u094d\u091e \u0914\u0930 \u0909\u0938\u0915\u0947 \u092d\u0947\u0926 (Nouns & Their Types)", description: "\u0935\u094d\u092f\u0915\u094d\u0924\u093f\u0935\u093e\u091a\u0915, \u091c\u093e\u0924\u093f\u0935\u093e\u091a\u0915, \u092d\u093e\u0935\u0935\u093e\u091a\u0915 \u0914\u0930 \u0938\u092e\u0942\u0939\u0935\u093e\u091a\u0915 \u0938\u0902\u091c\u094d\u091e\u0964" },
    { id: "l2", title: "\u0938\u0930\u094d\u0935\u0928\u093e\u092e (Pronouns)", description: "\u0938\u0902\u091c\u094d\u091e\u094b\u0902 \u0915\u0947 \u0938\u094d\u0925\u093e\u0928 \u092a\u0930 \u092a\u094d\u0930\u092f\u0941\u0915\u094d\u0924 \u0939\u094b\u0928\u0947 \u0935\u093e\u0932\u0947 \u0936\u092c\u094d\u0926\u0964" },
    { id: "l3", title: "\u0935\u093f\u0936\u0947\u0937\u0923 (Adjectives)", description: "\u0938\u0902\u091c\u094d\u091e\u093e \u092f\u093e \u0938\u0930\u094d\u0935\u0928\u093e\u092e \u0915\u0940 \u0935\u093f\u0936\u0947\u0937\u0924\u093e \u092c\u0924\u093e\u0928\u0947 \u0935\u093e\u0932\u0947 \u0936\u092c\u094d\u0926\u0964" },
    { id: "l4", title: "\u0915\u094d\u0930\u093f\u092f\u093e \u0914\u0930 \u0915\u093e\u0932 (Verbs & Tense)", description: "\u0915\u094d\u0930\u093f\u092f\u093e \u0915\u0947 \u092d\u0947\u0926 \u0914\u0930 \u092d\u0942\u0924, \u0935\u0930\u094d\u0924\u092e\u093e\u0928, \u092d\u0935\u093f\u0937\u094d\u092f \u0915\u093e\u0932\u0964" },
    { id: "l5", title: "\u0935\u093e\u0915\u094d\u092f \u0930\u091a\u0928\u093e (Sentence Formation)", description: "\u0938\u0930\u0932, \u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u0914\u0930 \u092e\u093f\u0936\u094d\u0930 \u0935\u093e\u0915\u094d\u092f\u0964" },
  ],
  "shabd-sagar": [
    { id: "l1", title: "\u092a\u0930\u094d\u092f\u093e\u092f\u0935\u093e\u091a\u0940 \u0936\u092c\u094d\u0926 (Synonyms)", description: "\u090f\u0915 \u0938\u0947 \u0905\u0927\u093f\u0915 \u0938\u092e\u093e\u0928\u093e\u0930\u094d\u0925\u0940 \u0936\u092c\u094d\u0926\u094b\u0902 \u0915\u0940 \u092a\u0939\u091a\u093e\u0928\u0964" },
    { id: "l2", title: "\u0935\u093f\u0932\u094b\u092e \u0936\u092c\u094d\u0926 (Antonyms)", description: "\u0935\u093f\u092a\u0930\u0940\u0924 \u0905\u0930\u094d\u0925 \u0935\u093e\u0932\u0947 \u0936\u092c\u094d\u0926 \u092a\u0939\u091a\u093e\u0928\u0928\u093e\u0964" },
    { id: "l3", title: "\u092e\u0941\u0939\u093e\u0935\u0930\u0947 (Idioms)", description: "\u0938\u093e\u092e\u093e\u0928\u094d\u092f \u0939\u093f\u0902\u0926\u0940 \u092e\u0941\u0939\u093e\u0935\u0930\u094b\u0902 \u0915\u093e \u0905\u0930\u094d\u0925 \u0914\u0930 \u092a\u094d\u0930\u092f\u094b\u0917\u0964" },
    { id: "l4", title: "\u0905\u0928\u0947\u0915\u093e\u0930\u094d\u0925\u0940 \u0936\u092c\u094d\u0926 (Homonyms)", description: "\u090f\u0915 \u091c\u0948\u0938\u0947 \u0926\u093f\u0916\u0928\u0947 \u0935\u093e\u0932\u0947 \u092a\u0930 \u0905\u0932\u0917-\u0905\u0932\u0917 \u0905\u0930\u094d\u0925 \u0935\u093e\u0932\u0947 \u0936\u092c\u094d\u0926\u0964" },
    { id: "l5", title: "\u0909\u092a\u0938\u0930\u094d\u0917 \u0914\u0930 \u092a\u094d\u0930\u0924\u094d\u092f\u092f (Prefixes & Suffixes)", description: "\u0936\u092c\u094d\u0926 \u0915\u0947 \u0906\u0917\u0947 \u092f\u093e \u092a\u0940\u091b\u0947 \u091c\u0941\u0921\u093c\u0928\u0947 \u0935\u093e\u0932\u0947 \u0905\u0902\u0936\u0964" },
  ],
  "vachan-ghati": [
    { id: "l1", title: "\u0917\u0926\u094d\u092f\u093e\u0902\u0936 \u0915\u0940 \u092a\u0939\u091a\u093e\u0928 (Prose Comprehension Basics)", description: "\u0905\u092a\u0920\u093f\u0924 \u0917\u0926\u094d\u092f\u093e\u0902\u0936 \u0915\u094b \u0938\u092e\u091d\u0915\u0930 \u092a\u094d\u0930\u0936\u094d\u0928\u094b\u0902 \u0915\u093e \u0909\u0924\u094d\u0924\u0930 \u0926\u0947\u0928\u093e\u0964" },
    { id: "l2", title: "\u092e\u0941\u0916\u094d\u092f \u0935\u093f\u091a\u093e\u0930 \u092a\u0939\u091a\u093e\u0928\u0928\u093e (Finding the Main Idea)", description: "\u0917\u0926\u094d\u092f\u093e\u0902\u0936 \u0915\u093e \u092e\u0941\u0916\u094d\u092f \u092d\u093e\u0935 \u090f\u0915 \u092a\u0902\u0915\u094d\u0924\u093f \u092e\u0947\u0902 \u092c\u0924\u093e\u0928\u093e\u0964" },
    { id: "l3", title: "\u092a\u0926\u094d\u092f\u093e\u0902\u0936 \u0915\u0940 \u092a\u0939\u091a\u093e\u0928 (Poetry Comprehension)", description: "\u0915\u0935\u093f\u0924\u093e \u0915\u0947 \u0905\u0902\u0936 \u0938\u0947 \u092d\u093e\u0935 \u0914\u0930 \u0905\u0930\u094d\u0925 \u0938\u092e\u091d\u0928\u093e\u0964" },
    { id: "l4", title: "\u0905\u0928\u0941\u092e\u093e\u0928 \u0938\u0947 \u0909\u0924\u094d\u0924\u0930 (Inference Questions)", description: "\u092a\u0902\u0915\u094d\u0924\u093f \u092e\u0947\u0902 \u0938\u0940\u0927\u0947 \u0928 \u0932\u093f\u0916\u0947 \u0917\u090f \u092c\u093f\u0902\u0926\u0941\u0913\u0902 \u0915\u094b \u0938\u092e\u091d\u0928\u093e\u0964" },
    { id: "l5", title: "\u0936\u092c\u094d\u0926\u093e\u0930\u094d\u0925 \u0938\u0902\u0926\u0930\u094d\u092d \u0938\u0947 (Meaning in Context)", description: "\u0938\u0902\u0926\u0930\u094d\u092d \u0915\u0947 \u0906\u0927\u093e\u0930 \u092a\u0930 \u0936\u092c\u094d\u0926\u094b\u0902 \u0915\u093e \u0905\u0930\u094d\u0925 \u0928\u093f\u0915\u093e\u0932\u0928\u093e\u0964" },
  ],
  "lekhan-lok": [
    { id: "l1", title: "\u0905\u0928\u0941\u091a\u094d\u091b\u0947\u0926 \u0932\u0947\u0916\u0928 (Paragraph Writing)", description: "\u090f\u0915 \u0935\u093f\u0937\u092f \u092a\u0930 \u0938\u0902\u0917\u0920\u093f\u0924 \u0905\u0928\u0941\u091a\u094d\u091b\u0947\u0926 \u0932\u093f\u0916\u0928\u093e\u0964" },
    { id: "l2", title: "\u0928\u093f\u092c\u0902\u0927 \u0932\u0947\u0916\u0928 (Essay Writing)", description: "\u0938\u094d\u092a\u0937\u094d\u091f \u0938\u0902\u0930\u091a\u0928\u093e \u0935\u093e\u0932\u093e \u0928\u093f\u092c\u0902\u0927 \u0915\u0948\u0938\u0947 \u0932\u093f\u0916\u0947\u0902\u0964" },
    { id: "l3", title: "\u0914\u092a\u091a\u093e\u0930\u093f\u0915 \u092a\u0924\u094d\u0930 (Formal Letters)", description: "\u0938\u094d\u0915\u0942\u0932, \u092a\u094d\u0930\u0927\u093e\u0928\u093e\u091a\u093e\u0930\u094d\u092f \u0914\u0930 \u0938\u0902\u0938\u094d\u0925\u093e\u0913\u0902 \u0915\u094b \u092a\u0924\u094d\u0930 \u0932\u093f\u0916\u0928\u093e\u0964" },
    { id: "l4", title: "\u0905\u0928\u094c\u092a\u091a\u093e\u0930\u093f\u0915 \u092a\u0924\u094d\u0930 (Informal Letters)", description: "\u092a\u0930\u093f\u0935\u093e\u0930 \u0914\u0930 \u092e\u093f\u0924\u094d\u0930\u094b\u0902 \u0915\u094b \u092a\u0924\u094d\u0930 \u0932\u093f\u0916\u0928\u093e\u0964" },
  ],
  "sahitya-sarovar": [
    { id: "l1", title: "\u0905\u0932\u0902\u0915\u093e\u0930 \u092a\u0930\u093f\u091a\u092f (Introduction to Poetic Devices)", description: "\u0905\u0928\u0941\u092a\u094d\u0930\u093e\u0938, \u092f\u092e\u0915, \u0936\u094d\u0932\u0947\u0937 \u091c\u0948\u0938\u0947 \u0905\u0932\u0902\u0915\u093e\u0930\u0964" },
    { id: "l2", title: "\u0930\u0938 (Ras)", description: "\u0915\u093e\u0935\u094d\u092f \u092e\u0947\u0902 \u0935\u094d\u092f\u0915\u094d\u0924 \u0939\u094b\u0928\u0947 \u0935\u093e\u0932\u0947 \u092e\u0941\u0916\u094d\u092f \u0930\u0938\u0964" },
    { id: "l3", title: "\u0917\u0926\u094d\u092f \u0914\u0930 \u092a\u0926\u094d\u092f \u0915\u093e \u0905\u0902\u0924\u0930 (Prose vs Poetry)", description: "\u0926\u094b\u0928\u094b\u0902 \u0930\u0942\u092a\u094b\u0902 \u0915\u0940 \u0935\u093f\u0936\u0947\u0937\u0924\u093e\u0913\u0902 \u0915\u0940 \u0924\u0941\u0932\u0928\u093e\u0964" },
    { id: "l4", title: "\u092a\u094d\u0930\u092e\u0941\u0916 \u0930\u091a\u0928\u093e\u0915\u093e\u0930 (Famous Authors)", description: "\u092a\u094d\u0930\u092e\u0941\u0916 \u0939\u093f\u0902\u0926\u0940 \u0932\u0947\u0916\u0915\u094b\u0902 \u0914\u0930 \u0909\u0928\u0915\u0940 \u0930\u091a\u0928\u093e\u0913\u0902 \u0915\u0940 \u092d\u0942\u092e\u093f\u0915\u093e\u0964" },
  ],
  "hindi-samman-shikhar": [
    { id: "l1", title: "\u0938\u092e\u094d\u092a\u0942\u0930\u094d\u0923 \u092a\u0941\u0928\u0930\u093e\u0935\u0943\u0924\u094d\u0924\u093f (Comprehensive Review)", description: "\u0938\u092d\u0940 \u0935\u093f\u0937\u092f\u094b\u0902 \u0915\u093e \u092e\u093f\u0936\u094d\u0930\u093f\u0924 \u0905\u092d\u094d\u092f\u093e\u0938\u0964" },
    { id: "l2", title: "\u092e\u093f\u0936\u094d\u0930\u093f\u0924 \u0905\u092d\u094d\u092f\u093e\u0938 (Mixed Practice)", description: "\u092a\u0942\u0930\u0947 \u092a\u093e\u0920\u094d\u092f\u0915\u094d\u0930\u092e \u0938\u0947 \u092a\u094d\u0930\u0936\u094d\u0928\u0964" },
    { id: "l3", title: "\u0917\u0924\u093f \u092a\u094d\u0930\u0924\u093f\u092f\u094b\u0917\u093f\u0924\u093e (Speed Challenge)", description: "\u0938\u092e\u092f \u0938\u0940\u092e\u093e \u0915\u0947 \u0938\u093e\u0925 \u0924\u0947\u091c \u092a\u094d\u0930\u0936\u094d\u0928\u094b\u0902 \u0915\u093e \u0909\u0924\u094d\u0924\u0930\u0964" },
    { id: "l4", title: "\u0905\u0902\u0924\u093f\u092e \u092a\u0930\u0940\u0915\u094d\u0937\u093e (Master Trial)", description: "\u0939\u093f\u0902\u0926\u0940 \u092e\u093e\u0938\u094d\u091f\u0930 \u0915\u0940 \u0909\u092a\u093e\u0927\u093f \u0938\u0947 \u092a\u0939\u0932\u0947 \u0915\u0940 \u0905\u0902\u0924\u093f\u092e \u091a\u0941\u0928\u094c\u0924\u0940\u0964" },
  ],

  // --- Tamil ---------------------------------------------------------------
  "ezhuthu-thittam": [
    { id: "l1", title: "à®‰à®¯à®¿à®°à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ (Vowels)", description: "à®… à®®à¯à®¤à®²à¯ à®” à®µà®°à¯ˆà®¯à®¿à®²à®¾à®© 12 à®‰à®¯à®¿à®°à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯." },
    { id: "l2", title: "à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ (Consonants)", description: "à®• à®®à¯à®¤à®²à¯ à®© à®µà®°à¯ˆà®¯à®¿à®²à®¾à®© 18 à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯." },
    { id: "l3", title: "à®‰à®¯à®¿à®°à¯à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ (Compound Letters)", description: "à®‰à®¯à®¿à®°à¯à®®à¯ à®®à¯†à®¯à¯à®¯à¯à®®à¯ à®‡à®£à¯ˆà®¨à¯à®¤à¯ à®‰à®°à¯à®µà®¾à®•à¯à®®à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯." },
    { id: "l4", title: "à®†à®¯à¯à®¤ à®Žà®´à¯à®¤à¯à®¤à¯ & à®Žà®£à¯à®•à®³à¯ (Aytham & Numerals)", description: "à®†à®¯à¯à®¤ à®Žà®´à¯à®¤à¯à®¤à¯à®®à¯ à®¤à®®à®¿à®´à¯ à®Žà®£à¯ à®µà®Ÿà®¿à®µà®™à¯à®•à®³à¯à®®à¯." },
    { id: "l5", title: "à®Žà®´à¯à®¤à¯à®¤à¯à®ªà¯ à®ªà®¯à®¿à®±à¯à®šà®¿ (Writing Practice)", description: "à®ªà®Ÿà®¿à®¤à¯à®¤à®²à¯ à®®à®±à¯à®±à¯à®®à¯ à®Žà®´à¯à®¤à¯à®¤à®²à¯ à®ªà®¯à®¿à®±à¯à®šà®¿." },
  ],
  "sol-vanam": [
    { id: "l1", title: "à®’à®¤à¯à®¤ à®ªà¯Šà®°à¯à®³à¯ à®šà¯Šà®±à¯à®•à®³à¯ (Synonyms)", description: "à®’à®°à¯‡ à®ªà¯Šà®°à¯à®³à¯ à®¤à®°à¯à®®à¯ à®šà¯Šà®±à¯à®•à®³à¯ˆ à®…à®±à®¿à®¤à®²à¯." },
    { id: "l2", title: "à®Žà®¤à®¿à®°à¯à®šà¯à®šà¯Šà®±à¯à®•à®³à¯ (Antonyms)", description: "à®®à®¾à®±à¯à®ªà®Ÿà¯à®Ÿ à®ªà¯Šà®°à¯à®³à¯ à®¤à®°à¯à®®à¯ à®šà¯Šà®±à¯à®•à®³à¯." },
    { id: "l3", title: "à®ªà®´à®®à¯Šà®´à®¿à®•à®³à¯ (Proverbs)", description: "à®µà®´à®•à¯à®•à®¿à®²à¯ à®‰à®³à¯à®³ à®ªà®´à®®à¯Šà®´à®¿à®•à®³à¯à®®à¯ à®…à®µà®±à¯à®±à®¿à®©à¯ à®ªà¯Šà®°à¯à®³à¯à®®à¯." },
    { id: "l4", title: "à®ªà¯Šà®°à¯à®³à¯ à®µà¯‡à®±à¯à®ªà®¾à®Ÿà¯ (Homonyms)", description: "à®’à®°à¯‡ à®’à®²à®¿, à®µà¯†à®µà¯à®µà¯‡à®±à¯ à®ªà¯Šà®°à¯à®³à¯ à®•à¯Šà®£à¯à®Ÿ à®šà¯Šà®±à¯à®•à®³à¯." },
    { id: "l5", title: "à®ªà¯à®¤à®¿à®¯ à®šà¯Šà®±à¯à®•à®³à¯ (Vocabulary Building)", description: "à®…à®©à¯à®±à®¾à®Ÿà®®à¯ à®ªà®¯à®©à¯à®ªà®Ÿà¯à®®à¯ à®ªà¯à®¤à®¿à®¯ à®šà¯Šà®±à¯à®•à®³à¯ˆà®•à¯ à®•à®±à¯à®±à®²à¯." },
  ],
  "ilakkanam-kunru": [
    { id: "l1", title: "à®ªà¯†à®¯à®°à¯à®šà¯à®šà¯Šà®²à¯ (Nouns)", description: "à®ªà¯Šà®°à¯à®³à¯, à®‡à®Ÿà®®à¯, à®¨à®ªà®°à¯ à®ªà¯†à®¯à®°à¯à®•à®³à¯ˆ à®…à®±à®¿à®¤à®²à¯." },
    { id: "l2", title: "à®µà®¿à®©à¯ˆà®šà¯à®šà¯Šà®²à¯ (Verbs)", description: "à®šà¯†à®¯à®²à¯ˆà®•à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯ à®šà¯Šà®±à¯à®•à®³à¯à®®à¯ à®…à®µà®±à¯à®±à®¿à®©à¯ à®•à®¾à®²à®™à¯à®•à®³à¯à®®à¯." },
    { id: "l3", title: "à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ à®‰à®°à¯à®ªà¯à®•à®³à¯ (Case Markers)", description: "à®¤à®®à®¿à®´à®¿à®©à¯ à®Žà®Ÿà¯à®Ÿà¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ à®‰à®°à¯à®ªà¯à®•à®³à¯." },
    { id: "l4", title: "à®’à®°à¯à®®à¯ˆ & à®ªà®©à¯à®®à¯ˆ (Singular & Plural)", description: "à®Žà®£à¯ à®µà¯‡à®±à¯à®ªà®¾à®Ÿà¯ à®•à®¾à®Ÿà¯à®Ÿà¯à®®à¯ à®µà®¿à®•à¯à®¤à®¿à®•à®³à¯." },
    { id: "l5", title: "à®µà®¾à®•à¯à®•à®¿à®¯ à®…à®®à¯ˆà®ªà¯à®ªà¯ (Sentence Structure)", description: "à®Žà®´à¯à®µà®¾à®¯à¯, à®ªà®¯à®©à®¿à®²à¯ˆ, à®šà¯†à®¯à®ªà¯à®ªà®Ÿà¯à®ªà¯Šà®°à¯à®³à¯ à®…à®®à¯ˆà®ªà¯à®ªà¯." },
  ],
  "padaippu-paguthi": [
    { id: "l1", title: "à®•à®Ÿà¯à®Ÿà¯à®°à¯ˆ à®Žà®´à¯à®¤à¯à®¤à®²à¯ (Essay Writing)", description: "à®®à¯à®©à¯à®©à¯à®°à¯ˆ, à®‰à®³à¯à®³à®Ÿà®•à¯à®•à®®à¯, à®®à¯à®Ÿà®¿à®µà¯à®°à¯ˆ à®…à®®à¯ˆà®ªà¯à®ªà¯." },
    { id: "l2", title: "à®•à®Ÿà®¿à®¤à®®à¯ à®Žà®´à¯à®¤à¯à®¤à®²à¯ (Letter Writing)", description: "à®®à¯à®±à¯ˆà®¯à®¾à®© à®®à®±à¯à®±à¯à®®à¯ à®¤à®©à®¿à®ªà¯à®ªà®Ÿà¯à®Ÿ à®•à®Ÿà®¿à®¤à®™à¯à®•à®³à¯." },
    { id: "l3", title: "à®šà¯à®°à¯à®•à¯à®•à®®à¯ à®Žà®´à¯à®¤à¯à®¤à®²à¯ (Summary Writing)", description: "à®®à¯‚à®²à®ªà¯ à®ªà¯Šà®°à¯à®³à¯ˆ à®•à¯à®±à¯ˆà®¨à¯à®¤ à®šà¯Šà®±à¯à®•à®³à®¿à®²à¯ à®¤à®°à¯à®¤à®²à¯." },
    { id: "l4", title: "à®‰à®°à¯ˆà®¯à®¾à®Ÿà®²à¯ à®Žà®´à¯à®¤à¯à®¤à®²à¯ (Dialogue Writing)", description: "à®¨à¯‡à®°à®Ÿà®¿à®ªà¯ à®ªà¯‡à®šà¯à®šà¯ à®µà®Ÿà®¿à®µà®¿à®²à¯ à®‰à®°à¯ˆà®¯à®¾à®Ÿà®²à¯ à®…à®®à¯ˆà®¤à¯à®¤à®²à¯." },
    { id: "l5", title: "à®µà®¿à®³à®•à¯à®•à®•à¯ à®•à®Ÿà¯à®Ÿà¯à®°à¯ˆ (Descriptive Writing)", description: "à®“à®°à¯ à®‡à®Ÿà®¤à¯à®¤à¯ˆà®¯à¯‹ à®ªà¯Šà®°à¯à®³à¯ˆà®¯à¯‹ à®µà®¿à®°à®¿à®µà®¾à®• à®µà®¿à®³à®•à¯à®•à¯à®¤à®²à¯." },
  ],
  "ilakkiya-thurai": [
    { id: "l1", title: "à®¤à®¿à®°à¯à®•à¯à®•à¯à®±à®³à¯ à®…à®±à®¿à®®à¯à®•à®®à¯ (Introduction to Thirukkural)", description: "à®¤à®¿à®°à¯à®µà®³à¯à®³à¯à®µà®°à¯à®®à¯ à®¤à®¿à®°à¯à®•à¯à®•à¯à®±à®³à®¿à®©à¯ à®…à®®à¯ˆà®ªà¯à®ªà¯à®®à¯." },
    { id: "l2", title: "à®…à®£à®¿à®•à®³à¯ (Poetic Devices)", description: "à®‰à®µà®®à¯ˆà®¯à®£à®¿, à®‡à®¯à¯ˆà®ªà®£à®¿ à®ªà¯‹à®©à¯à®± à®®à¯Šà®´à®¿ à®¨à¯à®Ÿà¯à®ªà®™à¯à®•à®³à¯." },
    { id: "l3", title: "à®šà¯†à®¯à¯à®¯à¯à®³à¯ à®‡à®²à®•à¯à®•à®£à®®à¯ (Meter & Prosody)", description: "à®šà¯†à®¯à¯à®¯à¯à®³à®¿à®©à¯ à®“à®šà¯ˆ à®…à®®à¯ˆà®ªà¯à®ªà¯." },
    { id: "l4", title: "à®ªà¯à®•à®´à¯à®ªà¯†à®±à¯à®± à®•à®µà®¿à®žà®°à¯à®•à®³à¯ (Famous Poets)", description: "à®‡à®³à®™à¯à®•à¯‹ à®…à®Ÿà®¿à®•à®³à¯, à®”à®µà¯ˆà®¯à®¾à®°à¯ à®ªà¯‹à®©à¯à®± à®ªà¯à®²à®µà®°à¯à®•à®³à¯." },
    { id: "l5", title: "à®‡à®²à®•à¯à®•à®¿à®¯ à®µà®•à¯ˆà®•à®³à¯ (Literary Genres)", description: "à®•à®¾à®ªà¯à®ªà®¿à®¯à®®à¯, à®šà®™à¯à®• à®‡à®²à®•à¯à®•à®¿à®¯à®®à¯ à®ªà¯‹à®©à¯à®± à®µà®•à¯ˆà®•à®³à¯." },
  ],
  "tamil-arasu": [
    { id: "l1", title: "à®®à¯à®´à¯à®®à¯ˆà®¯à®¾à®© à®®à®±à¯à®ªà®¾à®°à¯à®µà¯ˆ (Comprehensive Review)", description: "à®…à®©à¯ˆà®¤à¯à®¤à¯à®ªà¯ à®ªà®¾à®Ÿà®™à¯à®•à®³à®¿à®©à¯ à®’à®°à¯à®™à¯à®•à®¿à®£à¯ˆà®¨à¯à®¤ à®ªà®¯à®¿à®±à¯à®šà®¿." },
    { id: "l2", title: "à®•à®²à®ªà¯à®ªà¯à®ªà¯ à®ªà®¯à®¿à®±à¯à®šà®¿ (Mixed Practice)", description: "à®®à¯à®´à¯à®ªà¯ à®ªà®¾à®Ÿà®¤à¯à®¤à®¿à®Ÿà¯à®Ÿà®¤à¯à®¤à®¿à®²à®¿à®°à¯à®¨à¯à®¤à¯à®®à¯ à®•à¯‡à®³à¯à®µà®¿à®•à®³à¯." },
    { id: "l3", title: "à®µà¯‡à®• à®šà®µà®¾à®²à¯ (Speed Challenge)", description: "à®•à¯à®±à¯à®•à®¿à®¯ à®¨à¯‡à®°à®¤à¯à®¤à®¿à®²à¯ à®µà®¿à®°à¯ˆà®µà®¾à®• à®µà®¿à®Ÿà¯ˆà®¯à®³à®¿à®¤à¯à®¤à®²à¯." },
    { id: "l4", title: "à®‡à®±à¯à®¤à®¿ à®šà¯‹à®¤à®©à¯ˆ (Master Trial)", description: "à®¤à®®à®¿à®´à¯ à®®à®¾à®¸à¯à®Ÿà®°à¯ à®ªà®Ÿà¯à®Ÿà®¤à¯à®¤à®¿à®±à¯à®•à¯ à®®à¯à®¨à¯à®¤à¯ˆà®¯ à®‡à®±à¯à®¤à®¿à®šà¯ à®šà®µà®¾à®²à¯." },
  ],
  // --- Social Science -----------------------------------------------------
  "history-highlands": [
    { id: "l1", title: "The Rise of Early Civilizations", description: "How the first cities, farming, and writing systems emerged." },
    { id: "l2", title: "Empires & Dynasties", description: "How great empires rose, expanded, and eventually fell." },
    { id: "l3", title: "Colonialism & Its Impact", description: "How colonial powers reshaped economies and societies." },
    { id: "l4", title: "The Fight for Independence", description: "Movements and leaders that won freedom from colonial rule." },
    { id: "l5", title: "The Modern World Takes Shape", description: "World wars, decolonization, and the world order that followed." },
  ],
  "civics-citadel": [
    { id: "l1", title: "What is Democracy?", description: "Core features that define a democratic system of government." },
    { id: "l2", title: "The Constitution", description: "Why nations need a constitution and what it establishes." },
    { id: "l3", title: "Branches of Government", description: "The legislature, executive, and judiciary, and how they check each other." },
    { id: "l4", title: "Fundamental Rights & Duties", description: "The rights citizens hold and the duties that come with them." },
    { id: "l5", title: "Local Self-Government", description: "How panchayats and municipalities bring governance closer to people." },
  ],
  "geo-garden": [
    { id: "l1", title: "Maps & Map Reading", description: "Scale, direction, symbols, and how to read a map accurately." },
    { id: "l2", title: "Landforms", description: "Mountains, plateaus, and plains, and how they form." },
    { id: "l3", title: "Climate & Weather", description: "What drives climate patterns and how they differ from weather." },
    { id: "l4", title: "Population & Settlement", description: "How and why people settle where they do." },
    { id: "l5", title: "Human-Environment Interaction", description: "How people adapt to, and change, their physical surroundings." },
  ],
  "economy-isles": [
    { id: "l1", title: "What is an Economy?", description: "The basic building blocks of production, consumption, and exchange." },
    { id: "l2", title: "Money & Banking", description: "How money works and what banks do with it." },
    { id: "l3", title: "Markets, Demand & Supply", description: "How prices are set by what buyers want and sellers offer." },
    { id: "l4", title: "Poverty & Development", description: "How development is measured and why poverty persists." },
    { id: "l5", title: "Globalization & Trade", description: "How countries trade with each other and what that changes at home." },
  ],
  "resource-ridge": [
    { id: "l1", title: "Types of Resources", description: "Renewable vs non-renewable, and natural vs human-made resources." },
    { id: "l2", title: "Land & Soil Resources", description: "Why soil quality matters for farming and settlement." },
    { id: "l3", title: "Water Resources", description: "Sources of fresh water and the challenges of managing them." },
    { id: "l4", title: "Agriculture", description: "Major crops, farming methods, and cropping patterns." },
    { id: "l5", title: "Minerals & Energy Resources", description: "Where key minerals and energy sources are found and used." },
  ],
  "final-social-science-senate": [
    { id: "l1", title: "Comprehensive Review", description: "A mixed recap across every world you've cleared." },
    { id: "l2", title: "Mixed Practice", description: "Cross-topic questions pulled from the whole syllabus." },
    { id: "l3", title: "Speed Challenge", description: "Beat the clock on rapid-fire social science questions." },
    { id: "l4", title: "Master Trial", description: "The final gauntlet before the Social Science Master title." },
  ],

  // --- Computer Science ----------------------------------------------------
  "byte-bay": [
    { id: "l1", title: "What is a Computer?", description: "The basic definition and purpose of a computer system." },
    { id: "l2", title: "Hardware vs Software", description: "The physical parts of a computer versus the programs that run on it." },
    { id: "l3", title: "Input & Output Devices", description: "How computers receive data and display or produce results." },
    { id: "l4", title: "Memory & Storage", description: "RAM, ROM, and secondary storage, and how they differ." },
    { id: "l5", title: "The CPU", description: "The 'brain' of the computer and how it processes instructions." },
  ],
  "algorithm-archipelago": [
    { id: "l1", title: "What is an Algorithm?", description: "A step-by-step procedure for solving a problem." },
    { id: "l2", title: "Flowcharts", description: "Representing an algorithm visually with standard symbols." },
    { id: "l3", title: "Sequencing & Decisions", description: "Ordering steps and branching based on conditions." },
    { id: "l4", title: "Loops in Algorithms", description: "Repeating steps until a condition is met." },
    { id: "l5", title: "Efficiency Basics", description: "Why some algorithms solve the same problem faster than others." },
  ],
  "code-canyon": [
    { id: "l1", title: "Variables & Data Types", description: "Storing and labeling different kinds of data in a program." },
    { id: "l2", title: "Operators & Expressions", description: "Arithmetic, comparison, and logical operators." },
    { id: "l3", title: "Conditional Statements", description: "Making decisions in code with if/else logic." },
    { id: "l4", title: "Loops in Code", description: "for and while loops for repeating actions." },
    { id: "l5", title: "Functions", description: "Reusable blocks of code that perform a specific task." },
  ],
  "data-structure-dunes": [
    { id: "l1", title: "Bits, Bytes & Binary", description: "How computers represent data using 0s and 1s." },
    { id: "l2", title: "Number System Conversions", description: "Converting between binary, decimal, and hexadecimal." },
    { id: "l3", title: "Arrays & Lists", description: "Storing collections of related data in order." },
    { id: "l4", title: "Stacks & Queues", description: "Two common ways to organize data access order." },
    { id: "l5", title: "Searching & Sorting Basics", description: "Common approaches to finding and ordering data." },
  ],
  "network-nook": [
    { id: "l1", title: "What is the Internet?", description: "How a global network of connected computers works." },
    { id: "l2", title: "Networks & Topologies", description: "How devices connect to each other in different layouts." },
    { id: "l3", title: "The World Wide Web", description: "Websites, browsers, and how web pages are delivered." },
    { id: "l4", title: "Cybersecurity Basics", description: "Common threats and how to protect data and devices." },
    { id: "l5", title: "Email & Communication Protocols", description: "How digital messages travel between devices." },
  ],
  "final-code-citadel": [
    { id: "l1", title: "Comprehensive Review", description: "A mixed recap across every world you've cleared." },
    { id: "l2", title: "Mixed Practice", description: "Cross-topic questions pulled from the whole syllabus." },
    { id: "l3", title: "Speed Challenge", description: "Beat the clock on rapid-fire computer science questions." },
    { id: "l4", title: "Master Trial", description: "The final gauntlet before the Computer Science Master title." },
  ],
};

// Board-specific curriculum overrides (Section 8/9: Class + Board must
// fully determine content â€” nothing should mix). Most board/world pairs
// intentionally fall back to the shared LESSONS_BY_WORLD/QUESTION_BANK
// template above (Section 41: a configurable shell, not yet hand-authored
// per board), but Tamil Nadu's Acid Base Island is filled in here as a
// real, distinct example to prove the override path actually works end
// to end â€” different lesson titles, different questions, same world
// shell. Add more `"<boardCode>:<worldId>"` entries the same way as real
// board-specific content gets authored; nothing downstream needs to
// change shape-wise.
export const LESSONS_BY_WORLD_BOARD_OVERRIDES = {
  "TN:acid-base-island": [
    { id: "l1", title: "Acids, Bases and Salts", description: "The Tamil Nadu Board's framing of everyday acids and bases, from tamarind to soap." },
    { id: "l2", title: "Indicators in Daily Life", description: "Turmeric, litmus, and other indicators used to test common household liquids." },
    { id: "l3", title: "The pH Scale", description: "Measuring acidity and basicity from 0 to 14, with local examples like curd and lime water." },
    { id: "l4", title: "Neutralisation Reactions", description: "What happens when an acid and a base cancel each other out." },
    { id: "l5", title: "Common Salts", description: "How salts like sodium chloride and washing soda form and where they're used." },
  ],
};

export const QUESTION_BANK_BOARD_OVERRIDES = {
  "TN:acid-base-island": {
    easy: [
      { q: "Which of these is a natural indicator used in Tamil Nadu households?", options: ["Turmeric", "Copper sulfate", "Iron filings", "Sodium chloride"], answer: "Turmeric", explanation: "Turmeric turns red-brown in basic solutions, making it a common natural indicator." },
      { q: "Tamarind (puli) water tastes sour because it contains:", options: ["An acid", "A base", "A salt", "Pure water"], answer: "An acid", explanation: "Tamarind contains tartaric acid, which gives it its sour taste." },
      { q: "A solution with pH 7 is:", options: ["Acidic", "Basic", "Neutral", "Undefined"], answer: "Neutral", explanation: "pH 7 marks the neutral point on the scale â€” neither acidic nor basic." },
      { q: "Which of these commonly found liquids is basic?", options: ["Lime water", "Lemon juice", "Curd", "Vinegar"], answer: "Lime water", explanation: "Lime water (calcium hydroxide solution) is basic, unlike the other acidic examples." },
      { q: "True or False: Litmus paper turns red in an acidic solution.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Blue litmus turns red in acids â€” a classic acid test." },
    ],
    medium: [
      { q: "Curd turning more sour over time is due to the formation of:", options: ["Lactic acid", "Citric acid", "Sulfuric acid", "Carbonic acid"], answer: "Lactic acid", explanation: "Bacteria ferment lactose in milk into lactic acid, souring the curd." },
      { q: "Washing soda is chemically known as:", options: ["Sodium carbonate", "Sodium chloride", "Sodium bicarbonate", "Sodium hydroxide"], answer: "Sodium carbonate", explanation: "Washing soda is hydrated sodium carbonate, Na2CO3\u00b710H2O." },
      { q: "Fill in the blank: An acid reacting with a base to form salt and water is called ___.", type: "fill_blank", answer: "neutralization", explanation: "This acid-base reaction that produces a salt and water is neutralization." },
      { q: "Which salt is produced when hydrochloric acid reacts with sodium hydroxide?", options: ["Sodium chloride", "Sodium sulfate", "Sodium nitrate", "Sodium carbonate"], answer: "Sodium chloride", explanation: "HCl + NaOH \u2192 NaCl + H2O â€” common table salt and water." },
      { q: "A bee sting is acidic and is best relieved by applying a mild:", options: ["Base", "Acid", "Salt solution", "Pure water only"], answer: "Base", explanation: "A mild base neutralizes the acidic sting, easing the pain." },
    ],
    hard: [
      { q: "Numerical: If a solution has a pH of 3, how many times more acidic is it than a solution of pH 5?", type: "numerical", answer: "100", explanation: "Each pH unit is a 10x change; 2 units difference = 10\u00b2 = 100 times more acidic." },
      { q: "Antacid tablets relieve acidity in the stomach because they are:", options: ["Basic", "Acidic", "Neutral salts only", "Pure water"], answer: "Basic", explanation: "Antacids contain mild bases like magnesium hydroxide that neutralize excess stomach acid." },
      { q: "Baking soda used in cooking is chemically:", options: ["Sodium bicarbonate", "Sodium carbonate", "Sodium chloride", "Sodium sulfate"], answer: "Sodium bicarbonate", explanation: "Baking soda is NaHCO3, sodium bicarbonate." },
      { q: "Which gas is released when an acid reacts with a metal carbonate?", options: ["Carbon dioxide", "Oxygen", "Hydrogen", "Nitrogen"], answer: "Carbon dioxide", explanation: "Metal carbonates react with acids to release CO2, water, and a salt." },
      { q: "Chemical Equation: Balance it \u2014 CaCO3 + 2HCl \u2192 CaCl2 + H2O + ___. What's the missing product?", type: "chemical_equation", answer: "CO2", explanation: "Calcium carbonate and hydrochloric acid release carbon dioxide gas, plus calcium chloride and water." },
    ],
    expert: [
      { q: "Rainwater is naturally slightly acidic (around pH 5.6) mainly due to dissolved:", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Argon"], answer: "Carbon dioxide", explanation: "CO2 in air dissolves in rain to form weak carbonic acid, giving rain its mildly acidic pH." },
      { q: "Which of these is NOT a use of sodium hydroxide?", options: ["Making soap", "Souring milk", "Paper manufacturing", "Degreasing metal surfaces"], answer: "Souring milk", explanation: "Sodium hydroxide is a strong base used industrially â€” souring milk is caused by lactic acid, not NaOH." },
      { q: "A strong acid fully dissociates in water, meaning it:", options: ["Releases all its H+ ions", "Releases no ions", "Forms a precipitate", "Turns into a gas"], answer: "Releases all its H+ ions", explanation: "Strong acids ionize completely in solution, releasing the maximum possible H+ ions." },
      { q: "Numerical: A solution has [H+] = 1 \u00d7 10^-4 mol/L. What is its pH?", type: "numerical", answer: "4", explanation: "pH = -log[H+] = -log(10^-4) = 4." },
    ],
  },
};

function boardOverrideKey(board, worldId) {
  return `${board ?? ""}:${worldId}`;
}

// Resolves a world's lesson list for the given board, preferring a
// board-specific override (Section 8) and falling back to the shared
// template (Section 41) when no board-specific content has been
// authored yet.
export function getLessonsForWorld(board, worldId) {
  return (
    LESSONS_BY_WORLD_BOARD_OVERRIDES[boardOverrideKey(board, worldId)] ??
    LESSONS_BY_WORLD[worldId] ??
    []
  );
}

// Resolves a difficulty tier's question pool for the given board,
// preferring a board-specific override and falling back to the shared
// template â€” same precedence as getLessonsForWorld above.
export function getQuestionPool(board, worldId, difficultyId) {
  const overridden = QUESTION_BANK_BOARD_OVERRIDES[boardOverrideKey(board, worldId)];
  if (overridden?.[difficultyId]) return overridden[difficultyId];
  return QUESTION_BANK[worldId]?.[difficultyId] ?? [];
}

// Builds the Course/Chapter screen for one world: the world's own
// lock/progress state (reused from getWorldMap so the two screens never
// disagree) plus a lesson-by-lesson breakdown, and whether the chapter
// boss (Section 21) is unlocked yet.
export function getCourseDetail(grade, board, worldId, subject) {
  const { worlds } = getWorldMap(grade, board, subject);
  const world = worlds.find((w) => w.id === worldId);
  if (!world) return null;

  const lessonDefs = getLessonsForWorld(board, worldId);
  const total = lessonDefs.length;

  // Distribute the world's overall progress across its lessons
  // sequentially â€” lessons unlock and complete in order, same as worlds
  // unlock each other on the map.
  const completedCount =
    world.status === "completed"
      ? total
      : Math.min(total, Math.floor((world.progress / 100) * total));

  const lessons = lessonDefs.map((lesson, i) => {
    const roll = seededRatio(`${grade ?? "9"}-${board ?? "CBSE"}-${worldId}-lesson-${lesson.id}`);

    if (world.status === "locked") {
      return { ...lesson, status: "locked", progress: 0, stars: 0, xp: 0 };
    }
    if (i < completedCount) {
      const score = Math.round(65 + roll * 35);
      return {
        ...lesson,
        status: "completed",
        progress: 100,
        stars: starsForProgress(score),
        xp: Math.round(20 + roll * 40),
      };
    }
    if (i === completedCount) {
      return {
        ...lesson,
        status: "unlocked",
        progress: Math.round(roll * 45),
        stars: 0,
        xp: 0,
      };
    }
    return { ...lesson, status: "locked", progress: 0, stars: 0, xp: 0 };
  });

  const allLessonsCleared = total > 0 && lessons.every((l) => l.status === "completed");
  const bossStatus =
    world.status === "completed" ? "defeated" : allLessonsCleared ? "ready" : "locked";

  return { world, lessons, bossStatus };
}

// Difficulty System (Section 13). Every lesson has these four tiers.
// `unlockThreshold` is the score % a player must hit on *this* tier to
// unlock the next one (Easy 60% â†’ Medium, Medium 70% â†’ Hard, Hard 80% â†’
// Expert) â€” kept here as data so the thresholds stay configurable per the
// brief rather than hard-coded into the unlock logic below.
export const DIFFICULTIES = [
  {
    id: "easy",
    label: "Easy",
    description: "Basic concept questions.",
    xp: 20,
    coins: 10,
    unlockThreshold: 60,
  },
  {
    id: "medium",
    label: "Medium",
    description: "Concept application.",
    xp: 40,
    coins: 20,
    unlockThreshold: 70,
  },
  {
    id: "hard",
    label: "Hard",
    description: "Higher-order thinking.",
    xp: 60,
    coins: 30,
    unlockThreshold: 80,
  },
  {
    id: "expert",
    label: "Expert",
    description: "Advanced challenge.",
    xp: 100,
    coins: 50,
    unlockThreshold: null,
  },
];

export const DIFFICULTY_ACCENTS = {
  easy: "#4ADE80",
  medium: "#38D9F4",
  hard: "#806BFF",
  expert: "#FCD34D",
};

// Builds the difficulty-select screen (Section 13) for one lesson: reuses
// getCourseDetail so lesson lock state agrees with the Course screen, then
// derives per-difficulty status from mock scores. Tiers unlock in order â€”
// a tier is playable once the previous one has been cleared at or above
// its unlockThreshold.
export function getDifficultyProgress(grade, board, worldId, lessonId, subject) {
  const detail = getCourseDetail(grade, board, worldId, subject);
  if (!detail) return null;

  const lesson = detail.lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;

  if (lesson.status === "locked") {
    return {
      world: detail.world,
      lesson,
      difficulties: DIFFICULTIES.map((d) => ({ ...d, status: "locked", bestScore: 0 })),
    };
  }

  // How many tiers this lesson's mock progress has "cleared" â€” mirrors the
  // same progress-to-count distribution getCourseDetail uses for lessons.
  const clearedCount =
    lesson.status === "completed"
      ? DIFFICULTIES.length
      : Math.min(DIFFICULTIES.length, Math.floor((lesson.progress / 100) * DIFFICULTIES.length));

  let previousUnlockedNext = true;

  const difficulties = DIFFICULTIES.map((d, i) => {
    const roll = seededRatio(`${grade ?? "9"}-${board ?? "CBSE"}-${worldId}-${lessonId}-${d.id}`);
    let status = "locked";
    let bestScore = 0;

    if (previousUnlockedNext) {
      if (i < clearedCount) {
        bestScore = Math.round(60 + roll * 40);
        status = "completed";
      } else if (i === clearedCount) {
        status = "unlocked";
      }
    }

    previousUnlockedNext =
      status === "completed" && (d.unlockThreshold == null || bestScore >= d.unlockThreshold);

    return { ...d, status, bestScore };
  });

  return { world: detail.world, lesson, difficulties };
}

// Battle / Gameplay screen (Section 14) question bank. Real content per
// Section 41/15: every question is mapped to class, board, course, lesson,
// and difficulty rather than generated on the fly â€” see Section 41 ("do
// not randomly generate educational content and present it as official
// board syllabus content"). This is a hand-authored starter set scoped to
// one board/class shape; swap in real per-board/per-class question sets
// from GET /api/questions?lesson=&difficulty= once that endpoint exists,
// keeping each question's shape (Section 15) the same. All ten Section 16
// types are wired up: Multiple Choice and True/False render as an
// options grid (True/False is just a two-option MCQ, so it needs no
// component of its own); Fill in the Blank, Numerical, and Chemical
// Equation share components/FillBlankInput.jsx and are graded by
// isFreeTextCorrect() below (which also accepts numeric equivalence, e.g.
// "18" vs "18.0", for Numerical); Match the Following
// (components/MatchPairsInput.jsx, `pairs: [{left, right}]`) and Drag and
// Drop (components/SequenceInput.jsx, ordered `options`) are graded by
// isSpecialCorrect(); and Image-based questions attach an
// `image: "<diagram-key>"` rendered by components/QuestionDiagram.jsx on
// top of any other type (an MCQ can carry an image too â€” see the
// states-of-matter question below). "Chemical Formula" and "Reaction"
// questions don't need dedicated components: they're just MCQ or
// fill_blank questions whose text happens to be about a formula or a
// reaction.
export const QUESTION_BANK = {
  "atom-valley": {
    easy: [
      { q: "Which subatomic particle carries a negative charge?", options: ["Proton", "Neutron", "Electron", "Nucleus"], answer: "Electron", explanation: "Electrons are negatively charged and occupy shells around the nucleus." },
      { q: "What is found inside the nucleus of an atom?", options: ["Electrons only", "Protons and neutrons", "Protons only", "Neutrons only"], answer: "Protons and neutrons", explanation: "The nucleus holds the positively charged protons and neutral neutrons." },
      { q: "The atomic number of an element equals its number of:", options: ["Neutrons", "Protons", "Protons + neutrons", "Electrons + neutrons"], answer: "Protons", explanation: "Atomic number is defined as the count of protons in the nucleus." },
      { q: "An atom is electrically neutral because it has:", options: ["Equal protons and electrons", "Equal protons and neutrons", "More electrons than protons", "No charged particles"], answer: "Equal protons and electrons", explanation: "Equal positive and negative charges cancel out, giving no net charge." },
      { q: "Image-based: Looking at this atom diagram, what do the outer rings represent?", image: "atom-structure", options: ["Electron shells", "Proton pairs", "Isotope layers", "Magnetic fields"], answer: "Electron shells", explanation: "The rings around the nucleus represent the shells (energy levels) electrons occupy." },
    ],
    medium: [
      { q: "An atom with 6 protons and 8 neutrons has a mass number of:", options: ["6", "8", "14", "2"], answer: "14", explanation: "Mass number = protons + neutrons = 6 + 8 = 14." },
      { q: "Which particle has negligible mass compared to protons and neutrons?", options: ["Electron", "Proton", "Neutron", "Nucleus"], answer: "Electron", explanation: "An electron's mass is about 1/1836 of a proton's mass." },
      { q: "Isotopes of an element differ in their number of:", options: ["Protons", "Neutrons", "Electrons", "Charge"], answer: "Neutrons", explanation: "Isotopes share the same proton count but have different neutron counts." },
      { q: "The maximum number of electrons in the second (L) shell is:", options: ["2", "8", "18", "32"], answer: "8", explanation: "Shell capacity follows 2n\u00b2, so the second shell holds up to 8." },
      { q: "Numerical: An atom has 15 protons and 16 neutrons. What is its mass number?", type: "numerical", answer: "31", explanation: "Mass number = protons + neutrons = 15 + 16 = 31." },
    ],
    hard: [
      { q: "An ion with 11 protons and 10 electrons has a charge of:", options: ["+1", "-1", "+2", "0"], answer: "+1", explanation: "One more proton than electrons leaves a net charge of +1." },
      { q: "Which model first proposed a small, dense, positively charged nucleus?", options: ["Dalton", "Thomson", "Rutherford", "Bohr"], answer: "Rutherford", explanation: "Rutherford's gold foil experiment revealed a dense central nucleus." },
      { q: "The electron configuration of an atom with atomic number 12 is:", options: ["2, 8, 2", "2, 8, 1", "2, 8, 3", "2, 10"], answer: "2, 8, 2", explanation: "12 electrons fill as 2 in shell 1, 8 in shell 2, and 2 in shell 3." },
      { q: "Chlorine-35 and chlorine-37 occur in a 3:1 ratio. The average atomic mass is closest to:", options: ["35", "35.5", "36", "37"], answer: "35.5", explanation: "The weighted average of 35 and 37 in a 3:1 ratio comes out near 35.5." },
    ],
    expert: [
      { q: "An atom with mass number 40 and atomic number 19 has how many neutrons?", options: ["19", "21", "40", "59"], answer: "21", explanation: "Neutrons = mass number \u2212 atomic number = 40 \u2212 19 = 21." },
      { q: "Which of these has the same electron count as a Na\u207a ion?", options: ["Ne", "Mg", "Al\u00b3\u207a", "Cl\u207b"], answer: "Ne", explanation: "Na\u207a and neutral neon both have 10 electrons." },
      { q: "Bohr's model struggled to explain multi-electron atom spectra because it ignored:", options: ["Electron\u2013electron repulsion", "Nuclear charge", "Electron mass", "Proton charge"], answer: "Electron\u2013electron repulsion", explanation: "Bohr's model treated electrons independently, missing their mutual repulsion." },
      { q: "An element with configuration 2, 8, 7 most likely forms an ion with charge:", options: ["-1", "+1", "-7", "+7"], answer: "-1", explanation: "Gaining one electron completes the octet in the outer shell." },
    ],
  },
  "molecule-forest": {
    easy: [
      { q: "What is the chemical formula of water?", options: ["CO2", "H2O", "O2", "H2"], answer: "H2O", explanation: "Water is two hydrogen atoms bonded to one oxygen atom." },
      { q: "A compound forms when elements combine in a:", options: ["Physical mixture", "Fixed ratio by chemical bonds", "Random ratio", "Gas-only form"], answer: "Fixed ratio by chemical bonds", explanation: "Compounds have a fixed composition held together by chemical bonds." },
      { q: "Which of these is a mixture, not a compound?", options: ["Water", "Table salt", "Air", "Carbon dioxide"], answer: "Air", explanation: "Air is a blend of gases that keep their own properties, unlike a compound." },
      { q: "The formula NaCl represents:", options: ["An element", "A mixture", "A compound", "A solution"], answer: "A compound", explanation: "NaCl is sodium and chlorine chemically bonded in a fixed ratio." },
    ],
    medium: [
      { q: "The molecular formula C6H12O6 represents:", options: ["Water", "Glucose", "Methane", "Ethanol"], answer: "Glucose", explanation: "C6H12O6 is the formula for glucose, a simple sugar." },
      { q: "The molar mass of water (H2O) is approximately:", options: ["16 g/mol", "18 g/mol", "20 g/mol", "34 g/mol"], answer: "18 g/mol", explanation: "2(1) + 16 = 18 g/mol for H2O." },
      { q: "Which pair are both compounds?", options: ["O2 and N2", "H2O and CO2", "Fe and Cu", "Air and brass"], answer: "H2O and CO2", explanation: "Both are combinations of different elements in fixed ratios." },
      { q: "How many oxygen atoms are in one formula unit of CaCO3?", options: ["1", "2", "3", "4"], answer: "3", explanation: "The carbonate group (CO3) contributes three oxygen atoms." },
    ],
    hard: [
      { q: "Ammonia has the formula NH3. Its molar mass is approximately:", options: ["14", "17", "15", "20"], answer: "17", explanation: "14 (N) + 3(1) (H) = 17 g/mol." },
      { q: "A compound is 40% C, 6.7% H, and 53.3% O by mass. Its empirical formula is:", options: ["CH2O", "C2H4O2", "CH3O", "C6H12O6"], answer: "CH2O", explanation: "Converting mass % to mole ratios gives a 1:2:1 C:H:O ratio." },
      { q: "Which represents a diatomic element, not a compound?", options: ["CO", "NO", "O2", "H2O"], answer: "O2", explanation: "O2 is made of only one element, so it isn't a compound." },
      { q: "How many total atoms are in one molecule of glucose, C6H12O6?", options: ["6", "12", "18", "24"], answer: "24", explanation: "6 + 12 + 6 = 24 atoms in total." },
      { q: "Numerical: What is the molar mass of CO2 in g/mol? (C = 12, O = 16)", type: "numerical", answer: "44", explanation: "12 + 16(2) = 12 + 32 = 44 g/mol." },
    ],
    expert: [
      { q: "How many moles are in a 9 g sample of water?", options: ["0.5", "1", "2", "9"], answer: "0.5", explanation: "9 g \u00f7 18 g/mol = 0.5 mol." },
      { q: "Which of these compounds has the highest molar mass?", options: ["CO2", "H2O", "NH3", "CH4"], answer: "CO2", explanation: "CO2's molar mass (44 g/mol) is the largest of the four." },
      { q: "In the hydrate CuSO4\u00b75H2O, the water makes up roughly what mass percentage?", options: ["20%", "36%", "50%", "10%"], answer: "36%", explanation: "5 water molecules (90 g/mol) out of the hydrate's 250 g/mol total is about 36%." },
      { q: "A sample contains 3.011\u00d710\u00b2\u00b3 molecules of CO2. That is approximately:", options: ["0.5 mol", "1 mol", "2 mol", "0.05 mol"], answer: "0.5 mol", explanation: "3.011\u00d710\u00b2\u00b3 is half of Avogadro's number, so it's 0.5 mol." },
      { q: "Chemical Equation: Balance it by typing the missing coefficient \u2014 CH4 + ___O2 \u2192 CO2 + 2H2O. What number goes in the blank?", type: "chemical_equation", answer: "2", explanation: "CH4 + 2O2 \u2192 CO2 + 2H2O balances 4 oxygen atoms (2 from CO2, 2 from 2H2O) against 2\u00d72 from the O2." },
    ],
  },
  "bonding-cave": {
    easy: [
      { q: "Ionic bonds form when electrons are:", options: ["Shared", "Transferred", "Destroyed", "Never involved"], answer: "Transferred", explanation: "One atom gives up electrons and another accepts them, forming ions." },
      { q: "Covalent bonds form when electrons are:", options: ["Transferred", "Shared", "Lost completely", "Never involved"], answer: "Shared", explanation: "Atoms in a covalent bond share one or more electron pairs." },
      { q: "Table salt (NaCl) is held together by a(n):", options: ["Covalent bond", "Ionic bond", "Metallic bond", "Hydrogen bond"], answer: "Ionic bond", explanation: "Na\u207a and Cl\u207b are held together by electrostatic ionic attraction." },
      { q: "In a metallic bond, electrons are best described as:", options: ["Fixed in place", "Shared between just two atoms", "Free-flowing (a 'sea of electrons')", "Completely transferred"], answer: "Free-flowing (a 'sea of electrons')", explanation: "Metallic bonding involves delocalized electrons that move freely." },
    ],
    medium: [
      { q: "Which type of bond typically forms between two nonmetal atoms?", options: ["Ionic", "Covalent", "Metallic", "None"], answer: "Covalent", explanation: "Nonmetals tend to share electrons rather than transfer them." },
      { q: "A single covalent bond involves the sharing of:", options: ["1 electron pair", "2 electron pairs", "3 electron pairs", "No electrons"], answer: "1 electron pair", explanation: "A single bond is one shared pair of electrons." },
      { q: "Which compound is held together primarily by ionic bonds?", options: ["CH4", "MgO", "O2", "Cl2"], answer: "MgO", explanation: "Magnesium (metal) transfers electrons to oxygen (nonmetal), forming ions." },
      { q: "Metallic bonding explains which property of metals?", options: ["Brittleness", "Electrical conductivity", "Low melting point", "Poor malleability"], answer: "Electrical conductivity", explanation: "Delocalized electrons can flow, carrying an electric current." },
      {
        q: "Match the Following: pair each bond type with how its electrons behave.",
        type: "match_following",
        pairs: [
          { left: "Ionic bond", right: "Electrons transferred between atoms" },
          { left: "Covalent bond", right: "Electrons shared between atoms" },
          { left: "Metallic bond", right: "Electrons flow freely (a 'sea')" },
          { left: "Hydrogen bond", right: "Weak attraction to a nearby polar molecule" },
        ],
        answer: "see pairs",
        explanation: "Ionic = transfer, covalent = shared pair, metallic = a free-flowing sea, hydrogen bond = a weak intermolecular pull.",
      },
    ],
    hard: [
      { q: "Which bond type is generally strongest between comparable atoms?", options: ["Ionic", "Hydrogen bond", "Van der Waals", "London dispersion"], answer: "Ionic", explanation: "Ionic bonds involve strong electrostatic attraction between full charges." },
      { q: "Water molecules are polar mainly because of:", options: ["Their symmetric shape", "An electronegativity difference between O and H plus a bent shape", "Equal electron sharing", "Ionic bonding"], answer: "An electronegativity difference between O and H plus a bent shape", explanation: "Oxygen pulls shared electrons harder, and the bent shape keeps the charges from cancelling." },
      { q: "Which molecule is nonpolar despite having polar bonds?", options: ["H2O", "CO2", "NH3", "HCl"], answer: "CO2", explanation: "CO2 is linear and symmetric, so the bond polarities cancel out." },
      { q: "VSEPR theory predicts molecular shape based on:", options: ["Atomic mass", "Electron pair repulsion around the central atom", "Number of neutrons", "Bond length alone"], answer: "Electron pair repulsion around the central atom", explanation: "Electron pairs arrange to be as far apart as possible, setting the shape." },
    ],
    expert: [
      { q: "VSEPR theory predicts the shape of a methane (CH4) molecule as:", options: ["Linear", "Trigonal planar", "Tetrahedral", "Bent"], answer: "Tetrahedral", explanation: "Four bonding pairs around carbon spread out into a tetrahedral shape." },
      { q: "NaCl has a high melting point mainly because of:", options: ["Weak van der Waals forces", "Strong electrostatic forces in the ionic lattice", "A covalent network", "A metallic sea of electrons"], answer: "Strong electrostatic forces in the ionic lattice", explanation: "Breaking an ionic lattice takes a lot of energy due to strong ion attractions." },
      { q: "NH3 is pyramidal rather than perfectly tetrahedral because of:", options: ["A lone pair on nitrogen repelling the bonding pairs", "An extra proton", "Ionic character", "Double bonds"], answer: "A lone pair on nitrogen repelling the bonding pairs", explanation: "The lone pair pushes the three N\u2013H bonds closer together, distorting the shape." },
      { q: "Which bond is best described as coordinate (dative) covalent?", options: ["One where both shared electrons come from the same atom", "One with equal electron contribution from each atom", "A pure electron transfer", "Delocalized metallic bonding"], answer: "One where both shared electrons come from the same atom", explanation: "In a dative bond, one atom donates both electrons of the shared pair, as in NH4\u207a formation." },
    ],
  },
  "reaction-volcano": {
    easy: [
      { q: "In 2H2 + O2 \u2192 2H2O, which are the reactants?", options: ["H2O", "H2 and O2", "O2 only", "H2 only"], answer: "H2 and O2", explanation: "Reactants sit on the left side of the arrow, before the reaction happens." },
      { q: "A reaction that releases heat is called:", options: ["Endothermic", "Exothermic", "Neutral", "Reversible"], answer: "Exothermic", explanation: "Exothermic reactions release energy, usually as heat, to the surroundings." },
      { q: "Rusting of iron is an example of a:", options: ["Physical change", "Chemical reaction", "Nuclear reaction", "No change at all"], answer: "Chemical reaction", explanation: "Iron reacts with oxygen and moisture to form a new substance, iron oxide." },
      { q: "In a combination reaction, two or more substances:", options: ["Break apart", "Combine to form one product", "Swap places", "Stay unchanged"], answer: "Combine to form one product", explanation: "Combination reactions join reactants into a single new compound." },
      { q: "True or False: Combustion reactions release heat.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Combustion is an exothermic reaction â€” it releases heat and usually light." },
      { q: "Fill in the blank: A reaction that releases heat to its surroundings is called ___.", type: "fill_blank", answer: "exothermic", explanation: "Exothermic reactions release energy, usually as heat." },
      {
        q: "Reaction: Zn + H2SO4 \u2192 ? + H2. What is the missing product?",
        type: "reaction",
        options: ["ZnSO4", "ZnO", "ZnCl2", "Zn(OH)2"],
        answer: "ZnSO4",
        explanation: "Zinc displaces hydrogen from sulfuric acid, forming zinc sulfate and hydrogen gas.",
      },
    ],
    medium: [
      { q: "Balancing chemical equations follows which law?", options: ["Law of conservation of mass", "Law of definite proportions", "Boyle's law", "Newton's law"], answer: "Law of conservation of mass", explanation: "Matter isn't created or destroyed, so atoms must balance on both sides." },
      { q: "In a displacement reaction, a more reactive element:", options: ["Combines with oxygen only", "Displaces a less reactive element from its compound", "Always releases a gas", "Never changes"], answer: "Displaces a less reactive element from its compound", explanation: "The more reactive element takes the place of the less reactive one." },
      { q: "A reaction that absorbs heat from its surroundings is:", options: ["Exothermic", "Endothermic", "Combustion", "Precipitation"], answer: "Endothermic", explanation: "Endothermic reactions take in energy, often cooling their surroundings." },
      { q: "Which factor generally increases the rate of a reaction?", options: ["Lowering temperature", "Increasing temperature", "Removing the catalyst", "Decreasing concentration"], answer: "Increasing temperature", explanation: "Higher temperature gives particles more energy, so they collide more often and harder." },
      {
        q: "Drag and Drop: arrange these metals from most reactive to least reactive.",
        type: "drag_drop",
        options: ["Potassium", "Zinc", "Iron", "Copper"],
        answer: "Potassium|Zinc|Iron|Copper",
        explanation: "The reactivity series runs K > Zn > Fe > Cu â€” more reactive metals displace less reactive ones from their compounds.",
      },
      {
        q: "Reaction: AgNO3 + NaCl \u2192 ? + NaNO3. What is the missing product?",
        type: "reaction",
        options: ["AgCl", "Ag2O", "AgNa", "AgCl2"],
        answer: "AgCl",
        explanation: "Silver and sodium swap partners (double displacement), forming a white AgCl precipitate and sodium nitrate.",
      },
    ],
    hard: [
      { q: "In Zn + CuSO4 \u2192 ZnSO4 + Cu, zinc is:", options: ["Reduced", "Oxidized", "Unchanged", "A catalyst"], answer: "Oxidized", explanation: "Zinc loses electrons to become Zn\u00b2\u207a, which is oxidation." },
      { q: "A catalyst speeds up a reaction by:", options: ["Increasing reactant mass", "Lowering the activation energy", "Permanently raising temperature", "Being consumed in the reaction"], answer: "Lowering the activation energy", explanation: "Catalysts provide an easier pathway with lower activation energy, without being used up." },
      { q: "N2 + 3H2 \u2192 2NH3 is an example of a:", options: ["Decomposition reaction", "Combination reaction", "Displacement reaction", "Double displacement reaction"], answer: "Combination reaction", explanation: "Two substances combine into a single product, ammonia." },
      { q: "Which best describes a double displacement reaction?", options: ["Two compounds exchange ions to form new compounds", "One element replaces another", "A compound breaks into elements", "Two elements combine"], answer: "Two compounds exchange ions to form new compounds", explanation: "The positive and negative ions of two compounds swap partners." },
      { q: "Chemical Equation: Balance it by typing the missing coefficient \u2014 ___Fe + 3O2 \u2192 2Fe2O3. What number goes in the blank?", type: "chemical_equation", answer: "4", explanation: "4Fe + 3O2 \u2192 2Fe2O3 balances 4 iron atoms and 6 oxygen atoms on each side." },
      {
        q: "Reaction: CaCO3 (heated) \u2192 CaO + ?. What is the missing product?",
        type: "reaction",
        options: ["CO2", "O2", "H2O", "CaC2"],
        answer: "CO2",
        explanation: "Heating calcium carbonate (thermal decomposition) gives calcium oxide (quicklime) and carbon dioxide gas.",
      },
    ],
    expert: [
      { q: "2KClO3 \u2192 2KCl + 3O2 is classified as a:", options: ["Combination reaction", "Decomposition reaction", "Displacement reaction", "Neutralization"], answer: "Decomposition reaction", explanation: "One compound breaks down into two simpler products." },
      { q: "In Fe2O3 + 2Al \u2192 Al2O3 + 2Fe, aluminium acts as the:", options: ["Oxidizing agent", "Reducing agent", "Catalyst", "Product"], answer: "Reducing agent", explanation: "Aluminium gives up electrons to iron oxide, reducing the iron while itself being oxidized." },
      { q: "Which of these does NOT generally increase reaction rate?", options: ["Increasing temperature", "Increasing concentration", "Adding a catalyst", "Decreasing surface area"], answer: "Decreasing surface area", explanation: "Less exposed surface area means fewer collisions, slowing the reaction." },
      { q: "Le Chatelier's principle: increasing pressure on a gaseous equilibrium favors the side with:", options: ["More moles of gas", "Fewer moles of gas", "Equal moles of gas", "No gas at all"], answer: "Fewer moles of gas", explanation: "The system shifts to reduce the total number of gas molecules, lowering pressure." },
      {
        q: "Reaction: C3H8 + 5O2 \u2192 3CO2 + ?. What is the missing product, and how many molecules?",
        type: "reaction",
        options: ["4H2O", "3H2O", "5H2O", "2H2O"],
        answer: "4H2O",
        explanation: "Balancing propane combustion: 8 hydrogen atoms on the left need 4 H2O molecules on the right.",
      },
    ],
  },
  "acid-base-island": {
    easy: [
      { q: "A substance with a pH less than 7 is:", options: ["Acidic", "Basic", "Neutral", "A salt"], answer: "Acidic", explanation: "pH values below 7 indicate an acidic solution." },
      { q: "Which of these acids is commonly found in lemons?", options: ["Acetic acid", "Citric acid", "Sulfuric acid", "Hydrochloric acid"], answer: "Citric acid", explanation: "Citric acid gives citrus fruits like lemons their sour taste." },
      { q: "A base turns red litmus paper:", options: ["Red", "Blue", "Colorless", "Green"], answer: "Blue", explanation: "Bases turn red litmus paper blue, a classic test for alkalinity." },
      { q: "The pH of pure water is approximately:", options: ["0", "7", "14", "3"], answer: "7", explanation: "Pure water is neutral, sitting at pH 7." },
      { q: "Image-based: on this pH scale, which end is the most basic?", image: "ph-scale", options: ["Left (0)", "Middle (7)", "Right (14)", "There is no basic end"], answer: "Right (14)", explanation: "The scale runs acidic (0) to basic (14), with 7 as neutral â€” the right end is most basic." },
      { q: "True or False: A base turns red litmus paper blue.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Turning red litmus blue is a classic test for a basic (alkaline) substance." },
      { q: "Fill in the blank: The pH scale ranges from 0 to ___.", type: "fill_blank", answer: "14", explanation: "The pH scale runs from 0 (most acidic) to 14 (most basic), with 7 as neutral." },
    ],
    medium: [
      { q: "Neutralization occurs when an acid reacts with a base to form:", options: ["Only water", "Salt and water", "Only salt", "Gas only"], answer: "Salt and water", explanation: "Acid + base reactions typically produce a salt and water." },
      { q: "Which of these solutions is the most acidic?", options: ["pH 6", "pH 3", "pH 8", "pH 7"], answer: "pH 3", explanation: "The lower the pH, the more acidic the solution." },
      { q: "Which indicator turns pink in a basic solution?", options: ["Litmus", "Phenolphthalein", "Methyl orange", "None of these"], answer: "Phenolphthalein", explanation: "Phenolphthalein is colorless in acid and turns pink/magenta in base." },
      { q: "Common salt (NaCl) forms from the neutralization of:", options: ["HCl and NaOH", "H2SO4 and KOH", "HNO3 and Ca(OH)2", "None of these"], answer: "HCl and NaOH", explanation: "Hydrochloric acid and sodium hydroxide neutralize to form NaCl and water." },
    ],
    hard: [
      { q: "A solution with pH 3 is how much more acidic than one with pH 5?", options: ["2 times", "20 times", "100 times", "1000 times"], answer: "100 times", explanation: "The pH scale is logarithmic, so each unit is a 10x change â€” two units is 100x." },
      { q: "Which salt forms when sulfuric acid reacts with sodium hydroxide?", options: ["Sodium chloride", "Sodium sulfate", "Sodium nitrate", "Sodium carbonate"], answer: "Sodium sulfate", explanation: "H2SO4 + NaOH produces sodium sulfate (Na2SO4) and water." },
      { q: "A strong acid is one that:", options: ["Has a pleasant smell", "Completely ionizes in water", "Never reacts with metals", "Is always concentrated"], answer: "Completely ionizes in water", explanation: "Strong acids dissociate almost completely into ions in solution." },
      { q: "Which gas is released when a metal reacts with a dilute acid?", options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon dioxide"], answer: "Hydrogen", explanation: "Metals react with dilute acids to displace hydrogen gas." },
    ],
    expert: [
      { q: "The conjugate base of HCl is:", options: ["Cl\u207b", "H\u207a", "OH\u207b", "HCl2"], answer: "Cl\u207b", explanation: "After HCl donates a proton, what remains is the chloride ion, Cl\u207b." },
      { q: "A buffer solution resists changes in:", options: ["Volume", "pH", "Temperature", "Color"], answer: "pH", explanation: "Buffers maintain a roughly stable pH when small amounts of acid or base are added." },
      { q: "Which salt, dissolved in water, produces a basic solution?", options: ["NaCl", "Na2CO3", "NH4Cl", "KNO3"], answer: "Na2CO3", explanation: "Sodium carbonate is a salt of a weak acid and strong base, so it hydrolyzes to give a basic solution." },
      { q: "By the Bronsted\u2013Lowry theory, an acid is a substance that:", options: ["Accepts a proton", "Donates a proton", "Accepts an electron pair", "Donates an electron pair"], answer: "Donates a proton", explanation: "Bronsted\u2013Lowry acids are proton (H\u207a) donors." },
    ],
  },
  "final-chemistry-kingdom": {
    easy: [
      { q: "What is the chemical symbol for sodium?", options: ["So", "Na", "S", "Sd"], answer: "Na", explanation: "Sodium's symbol, Na, comes from its Latin name natrium." },
      { q: "Which of these is a noble gas?", options: ["Oxygen", "Neon", "Nitrogen", "Hydrogen"], answer: "Neon", explanation: "Neon sits in Group 18, the noble gases, known for being unreactive." },
      { q: "The smallest unit of an element that retains its properties is a(n):", options: ["Molecule", "Atom", "Compound", "Mixture"], answer: "Atom", explanation: "An atom is the basic building block of an element." },
      { q: "Which process changes a liquid into a gas?", options: ["Condensation", "Evaporation", "Freezing", "Melting"], answer: "Evaporation", explanation: "Evaporation is the change of state from liquid to gas." },
    ],
    medium: [
      { q: "What is the valency of oxygen in most of its compounds?", options: ["1", "2", "3", "4"], answer: "2", explanation: "Oxygen typically forms two bonds, giving it a valency of 2." },
      { q: "Matter can neither be created nor destroyed in a chemical reaction â€” this is the:", options: ["Law of conservation of mass", "Law of multiple proportions", "Avogadro's law", "Boyle's law"], answer: "Law of conservation of mass", explanation: "This law is the reason chemical equations must be balanced." },
      { q: "The pH scale ranges from:", options: ["0 to 7", "0 to 10", "0 to 14", "1 to 14"], answer: "0 to 14", explanation: "pH is typically measured on a 0â€“14 scale, with 7 as neutral." },
      { q: "Which particle determines the chemical identity of an element?", options: ["Number of neutrons", "Number of protons", "Number of electrons only", "Mass number"], answer: "Number of protons", explanation: "The proton count (atomic number) defines which element it is." },
    ],
    hard: [
      { q: "Which of these is an example of an endothermic process?", options: ["Combustion of fuel", "Melting of ice", "Rusting of iron", "Neutralization"], answer: "Melting of ice", explanation: "Melting absorbs heat from the surroundings to break the solid's structure." },
      { q: "In redox reactions, oxidation involves:", options: ["Gain of electrons", "Loss of electrons", "Gain of protons", "Loss of protons"], answer: "Loss of electrons", explanation: "Oxidation is defined as the loss of electrons." },
      { q: "Which bond type best explains the high conductivity of metals?", options: ["Ionic", "Covalent", "Metallic", "Hydrogen"], answer: "Metallic", explanation: "Delocalized electrons in metallic bonding are free to carry charge." },
      { q: "The correctly balanced equation for magnesium burning in oxygen is:", options: ["Mg + O2 \u2192 MgO", "2Mg + O2 \u2192 2MgO", "Mg + 2O2 \u2192 MgO2", "2Mg + 2O2 \u2192 2MgO"], answer: "2Mg + O2 \u2192 2MgO", explanation: "Balancing atoms on both sides requires 2 Mg and 1 O2 to give 2 MgO." },
    ],
    expert: [
      { q: "Ranked weakest to strongest, which order is correct for acetic acid, hydrochloric acid, and carbonic acid?", options: ["HCl < acetic < carbonic", "Carbonic < acetic < HCl", "Acetic < carbonic < HCl", "HCl < carbonic < acetic"], answer: "Carbonic < acetic < HCl", explanation: "HCl is a strong acid, while acetic and carbonic are weak, with carbonic being the weaker of the two." },
      { q: "A strong acid and strong base are mixed in exact stoichiometric amounts. The resulting pH is closest to:", options: ["3", "7", "10", "14"], answer: "7", explanation: "Complete neutralization of a strong acid and strong base gives a neutral salt solution." },
      { q: "Why are noble gases chemically inert?", options: ["They have full outer electron shells", "They have no electrons", "They are radioactive", "They have no protons"], answer: "They have full outer electron shells", explanation: "A full outer shell means little tendency to gain, lose, or share electrons." },
      { q: "CaCO3 \u2192 CaO + CO2 shows the total product mass equalling the reactant mass. This demonstrates the:", options: ["Law of conservation of mass", "Law of definite proportions", "Avogadro's law", "Le Chatelier's principle"], answer: "Law of conservation of mass", explanation: "No atoms are lost, just rearranged, so total mass is conserved." },
    ],
  },

  // --- Mathematics -------------------------------------------------------
  "number-nexus": {
    easy: [
      { q: "Which of these is an irrational number?", options: ["1/2", "0.75", "\u221a2", "5"], answer: "\u221a2", explanation: "\u221a2 cannot be written as a simple fraction and its decimal never repeats." },
      { q: "The HCF of 12 and 18 is:", options: ["6", "36", "3", "12"], answer: "6", explanation: "6 is the largest number that divides both 12 and 18 exactly." },
      { q: "Which of these is a natural number?", options: ["-3", "0", "7", "0.5"], answer: "7", explanation: "Natural numbers are the positive counting numbers 1, 2, 3, ..." },
      { q: "True or False: Every integer is a rational number.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Any integer n can be written as n/1, so it's rational." },
      { q: "Fill in the blank: The LCM of 4 and 6 is ___.", type: "fill_blank", answer: "12", explanation: "12 is the smallest number that both 4 and 6 divide into evenly." },
    ],
    medium: [
      { q: "2^3 \u00d7 2^4 simplifies to:", options: ["2^7", "2^12", "4^7", "2^1"], answer: "2^7", explanation: "When multiplying powers with the same base, add the exponents: 3 + 4 = 7." },
      { q: "The prime factorization of 60 is:", options: ["2\u00b2 \u00d7 3 \u00d7 5", "2 \u00d7 3\u00b2 \u00d7 5", "2\u00b3 \u00d7 5", "2 \u00d7 3 \u00d7 5\u00b2"], answer: "2\u00b2 \u00d7 3 \u00d7 5", explanation: "60 = 4 \u00d7 15 = 2\u00b2 \u00d7 3 \u00d7 5." },
      { q: "Numerical: What is (-3)\u00b2?", type: "numerical", answer: "9", explanation: "A negative number squared becomes positive: (-3) \u00d7 (-3) = 9." },
      { q: "Which of these fractions is equivalent to 0.375?", options: ["3/8", "3/5", "1/3", "5/8"], answer: "3/8", explanation: "3 \u00f7 8 = 0.375." },
      { q: "The square root of 144 is:", options: ["10", "11", "12", "14"], answer: "12", explanation: "12 \u00d7 12 = 144." },
    ],
    hard: [
      { q: "Numerical: Simplify 5^0 + 3^1.", type: "numerical", answer: "4", explanation: "Any nonzero number to the power 0 is 1, so 1 + 3 = 4." },
      { q: "Which of these numbers is rational?", options: ["\u03c0", "\u221a3", "0.333...", "\u221a7"], answer: "0.333...", explanation: "0.333... is the repeating decimal for 1/3, a rational number." },
      { q: "The HCF \u00d7 LCM of two numbers equals:", options: ["Their sum", "Their difference", "Their product", "Their average"], answer: "Their product", explanation: "For any two numbers, HCF \u00d7 LCM = the product of the two numbers." },
      { q: "Simplify: (2^5) \u00f7 (2^2).", options: ["2^3", "2^7", "2^10", "1^3"], answer: "2^3", explanation: "Dividing powers with the same base subtracts exponents: 5 - 2 = 3." },
    ],
    expert: [
      { q: "Numerical: What is the HCF of 48 and 180?", type: "numerical", answer: "12", explanation: "48 = 2\u2074\u00d73 and 180 = 2\u00b2\u00d73\u00b2\u00d75; the shared factors give HCF = 12." },
      { q: "Which best describes an irrational number?", options: ["A terminating decimal", "A repeating decimal", "A non-terminating, non-repeating decimal", "Any negative number"], answer: "A non-terminating, non-repeating decimal", explanation: "Irrational numbers never terminate or settle into a repeating pattern." },
      { q: "Simplify: 3^-2.", options: ["-9", "-6", "1/9", "9"], answer: "1/9", explanation: "A negative exponent means reciprocal: 3^-2 = 1/3\u00b2 = 1/9." },
    ],
  },
  "algebra-atrium": {
    easy: [
      { q: "In the expression 5x + 3, what is the coefficient of x?", options: ["3", "5", "x", "8"], answer: "5", explanation: "The coefficient is the number multiplying the variable, here 5." },
      { q: "Simplify: 3x + 4x.", options: ["7x", "12x", "7x\u00b2", "12"], answer: "7x", explanation: "Like terms combine by adding their coefficients: 3 + 4 = 7." },
      { q: "Solve for x: x + 5 = 12.", options: ["5", "7", "12", "17"], answer: "7", explanation: "Subtract 5 from both sides: x = 12 - 5 = 7." },
      { q: "True or False: 2x and 2x\u00b2 are like terms.", type: "true_false", options: ["True", "False"], answer: "False", explanation: "Like terms must have the same variable raised to the same power." },
      { q: "Fill in the blank: The value of x in 3x = 15 is ___.", type: "fill_blank", answer: "5", explanation: "Dividing both sides by 3 gives x = 5." },
    ],
    medium: [
      { q: "Expand: 2(x + 3).", options: ["2x + 3", "2x + 6", "x + 6", "2x + 5"], answer: "2x + 6", explanation: "Distribute the 2 across both terms: 2\u00d7x + 2\u00d73 = 2x + 6." },
      { q: "Solve: 2x - 4 = 10.", options: ["3", "5", "6", "7"], answer: "7", explanation: "Add 4 to both sides (2x = 14), then divide by 2: x = 7." },
      { q: "Numerical: If x = 3, what is the value of 2x\u00b2?", type: "numerical", answer: "18", explanation: "2 \u00d7 3\u00b2 = 2 \u00d7 9 = 18." },
      { q: "Which pair of values solves x + y = 10 and x - y = 2?", options: ["x=6, y=4", "x=5, y=5", "x=8, y=2", "x=4, y=6"], answer: "x=6, y=4", explanation: "Adding the equations gives 2x = 12, so x = 6, and y = 10 - 6 = 4." },
      { q: "Factorize: x\u00b2 + 5x.", options: ["x(x + 5)", "x\u00b2(x + 5)", "5(x + x)", "x(5x)"], answer: "x(x + 5)", explanation: "x is common to both terms, so factor it out: x(x + 5)." },
    ],
    hard: [
      { q: "Solve simultaneously: x + y = 7 and x - y = 1.", options: ["x=4, y=3", "x=3, y=4", "x=5, y=2", "x=6, y=1"], answer: "x=4, y=3", explanation: "Adding both equations: 2x = 8, so x = 4, and y = 7 - 4 = 3." },
      { q: "Factorize: x\u00b2 - 9.", options: ["(x-3)(x+3)", "(x-9)(x+1)", "(x-3)\u00b2", "(x+3)\u00b2"], answer: "(x-3)(x+3)", explanation: "This is a difference of squares: x\u00b2 - 9 = x\u00b2 - 3\u00b2 = (x-3)(x+3)." },
      { q: "Numerical: Solve for x \u2014 3(x - 2) = 12.", type: "numerical", answer: "6", explanation: "Divide by 3: x - 2 = 4, so x = 6." },
      { q: "Which expression is equivalent to (x + 2)\u00b2?", options: ["x\u00b2 + 4x + 4", "x\u00b2 + 2x + 4", "x\u00b2 + 4", "x\u00b2 + 2x + 2"], answer: "x\u00b2 + 4x + 4", explanation: "(x+2)(x+2) expands to x\u00b2 + 2x + 2x + 4 = x\u00b2 + 4x + 4." },
    ],
    expert: [
      { q: "Numerical: If 2x + 3y = 12 and x = 3, what is y?", type: "numerical", answer: "2", explanation: "2(3) + 3y = 12 \u2192 6 + 3y = 12 \u2192 3y = 6 \u2192 y = 2." },
      { q: "Factorize completely: 2x\u00b2 + 4x.", options: ["2x(x + 2)", "x(2x + 4)", "2(x\u00b2 + 2x)", "4x(x + 1)"], answer: "2x(x + 2)", explanation: "2x is the greatest common factor of both terms." },
      { q: "Solve: x\u00b2 - 5x + 6 = 0. What are the roots?", options: ["x=2, x=3", "x=1, x=6", "x=-2, x=-3", "x=6, x=-1"], answer: "x=2, x=3", explanation: "Factoring gives (x-2)(x-3)=0, so x = 2 or x = 3." },
    ],
  },
  "geometry-grove": {
    easy: [
      { q: "An angle greater than 90\u00b0 but less than 180\u00b0 is called:", options: ["Acute", "Obtuse", "Right", "Reflex"], answer: "Obtuse", explanation: "Obtuse angles fall strictly between 90\u00b0 and 180\u00b0." },
      { q: "The sum of angles in a triangle is always:", options: ["90\u00b0", "180\u00b0", "270\u00b0", "360\u00b0"], answer: "180\u00b0", explanation: "This holds for every triangle, regardless of shape." },
      { q: "A triangle with all three sides equal is called:", options: ["Scalene", "Isosceles", "Equilateral", "Right-angled"], answer: "Equilateral", explanation: "Equilateral triangles have three equal sides and three equal 60\u00b0 angles." },
      { q: "True or False: Vertically opposite angles are always equal.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "When two lines cross, the opposite angles formed are always equal." },
      { q: "Image-based: In this triangle diagram, what type of angle is marked?", image: "angle-types", options: ["Acute", "Obtuse", "Right", "Straight"], answer: "Right", explanation: "A right angle measures exactly 90\u00b0, often marked with a small square." },
    ],
    medium: [
      { q: "In a right-angled triangle, the side opposite the right angle is the:", options: ["Base", "Height", "Hypotenuse", "Median"], answer: "Hypotenuse", explanation: "The hypotenuse is always the longest side, opposite the 90\u00b0 angle." },
      { q: "Two triangles are congruent if they have the same:", options: ["Shape only", "Size only", "Shape and size", "Color"], answer: "Shape and size", explanation: "Congruent triangles are identical in both shape and size." },
      { q: "Numerical: A right triangle has legs of 3 and 4. What is the hypotenuse?", type: "numerical", answer: "5", explanation: "By the Pythagorean theorem, \u221a(3\u00b2+4\u00b2) = \u221a25 = 5." },
      { q: "The angles on a straight line add up to:", options: ["90\u00b0", "180\u00b0", "270\u00b0", "360\u00b0"], answer: "180\u00b0", explanation: "Angles on a straight line are supplementary, summing to 180\u00b0." },
      { q: "A chord that passes through the center of a circle is called the:", options: ["Radius", "Diameter", "Tangent", "Arc"], answer: "Diameter", explanation: "The diameter is the longest chord, passing through the circle's center." },
    ],
    hard: [
      { q: "Numerical: A triangle has angles 50\u00b0 and 70\u00b0. What is the third angle?", type: "numerical", answer: "60", explanation: "Angles in a triangle sum to 180\u00b0: 180 - 50 - 70 = 60." },
      { q: "Which condition proves two triangles congruent using two sides and the included angle?", options: ["SSS", "SAS", "AAA", "RHS"], answer: "SAS", explanation: "Side-Angle-Side congruence uses two sides and the angle between them." },
      { q: "A tangent to a circle touches it at:", options: ["Two points", "No points", "Exactly one point", "Infinite points"], answer: "Exactly one point", explanation: "A tangent line just grazes the circle at a single point." },
      { q: "Numerical: Find the missing side of a right triangle with hypotenuse 13 and one leg 5.", type: "numerical", answer: "12", explanation: "\u221a(13\u00b2 - 5\u00b2) = \u221a(169-25) = \u221a144 = 12." },
    ],
    expert: [
      { q: "In similar triangles, corresponding sides are:", options: ["Equal", "In the same ratio", "Perpendicular", "Parallel"], answer: "In the same ratio", explanation: "Similar triangles have equal angles and proportional (not necessarily equal) sides." },
      { q: "Numerical: A ladder 10m long leans against a wall, its foot 6m from the wall. How high up the wall does it reach?", type: "numerical", answer: "8", explanation: "\u221a(10\u00b2-6\u00b2) = \u221a(100-36) = \u221a64 = 8." },
      { q: "The angle in a semicircle (subtended by the diameter) is always:", options: ["45\u00b0", "60\u00b0", "90\u00b0", "180\u00b0"], answer: "90\u00b0", explanation: "This is a circle theorem: any angle inscribed in a semicircle is a right angle." },
    ],
  },
  "mensuration-mines": {
    easy: [
      { q: "The area of a rectangle with length 8 and width 5 is:", options: ["13", "26", "40", "45"], answer: "40", explanation: "Area of a rectangle = length \u00d7 width = 8 \u00d7 5 = 40." },
      { q: "The perimeter of a square with side 6 is:", options: ["12", "24", "36", "6"], answer: "24", explanation: "Perimeter of a square = 4 \u00d7 side = 4 \u00d7 6 = 24." },
      { q: "Numerical: What is the area of a triangle with base 10 and height 4?", type: "numerical", answer: "20", explanation: "Area = \u00bd \u00d7 base \u00d7 height = \u00bd \u00d7 10 \u00d7 4 = 20." },
      { q: "True or False: A cube has 6 faces.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "A cube has 6 identical square faces." },
      { q: "Fill in the blank: The formula for the area of a circle is \u03c0r___.", type: "fill_blank", answer: "2", explanation: "Area of a circle = \u03c0r\u00b2, where r is the radius." },
    ],
    medium: [
      { q: "The circumference of a circle with radius 7 (use \u03c0 \u2248 22/7) is:", options: ["22", "44", "14", "49"], answer: "44", explanation: "Circumference = 2\u03c0r = 2 \u00d7 22/7 \u00d7 7 = 44." },
      { q: "The area of a parallelogram with base 12 and height 5 is:", options: ["17", "30", "60", "120"], answer: "60", explanation: "Area of a parallelogram = base \u00d7 height = 12 \u00d7 5 = 60." },
      { q: "Numerical: What is the volume of a cube with side 4?", type: "numerical", answer: "64", explanation: "Volume of a cube = side\u00b3 = 4\u00b3 = 64." },
      { q: "The surface area of a cube with side 3 is:", options: ["9", "27", "54", "18"], answer: "54", explanation: "Surface area of a cube = 6 \u00d7 side\u00b2 = 6 \u00d7 9 = 54." },
      { q: "The area of a trapezium is found using:", options: ["\u00bd \u00d7 (sum of parallel sides) \u00d7 height", "base \u00d7 height", "\u00bd \u00d7 base \u00d7 height", "side\u00b2"], answer: "\u00bd \u00d7 (sum of parallel sides) \u00d7 height", explanation: "This formula averages the two parallel sides before multiplying by the height." },
    ],
    hard: [
      { q: "Numerical: A cylinder has radius 3 and height 7 (use \u03c0 \u2248 22/7). What is its volume?", type: "numerical", answer: "198", explanation: "Volume = \u03c0r\u00b2h = 22/7 \u00d7 9 \u00d7 7 = 198." },
      { q: "The total surface area of a cylinder includes:", options: ["Only the curved surface", "Only the two circular ends", "The curved surface plus both circular ends", "Neither the curved surface nor the ends"], answer: "The curved surface plus both circular ends", explanation: "Total surface area = 2\u03c0rh + 2\u03c0r\u00b2, covering the curved side and both circles." },
      { q: "Numerical: Find the area of a circle with radius 14 (use \u03c0 \u2248 22/7).", type: "numerical", answer: "616", explanation: "Area = \u03c0r\u00b2 = 22/7 \u00d7 14\u00b2 = 22/7 \u00d7 196 = 616." },
      { q: "A cone and a cylinder share the same base and height. The cone's volume is what fraction of the cylinder's?", options: ["1/2", "1/3", "2/3", "1/4"], answer: "1/3", explanation: "A cone's volume is exactly one-third of a cylinder with the same base and height." },
    ],
    expert: [
      { q: "Numerical: A cuboid measures 5 \u00d7 4 \u00d7 3. What is its volume?", type: "numerical", answer: "60", explanation: "Volume of a cuboid = length \u00d7 width \u00d7 height = 5 \u00d7 4 \u00d7 3 = 60." },
      { q: "Doubling the radius of a sphere multiplies its volume by:", options: ["2", "4", "6", "8"], answer: "8", explanation: "Volume scales with the cube of the radius, so doubling r multiplies volume by 2\u00b3 = 8." },
      { q: "Numerical: Find the curved surface area of a cone with radius 3 and slant height 5 (use \u03c0 \u2248 3.14).", type: "numerical", answer: "47.1", explanation: "Curved surface area = \u03c0rl = 3.14 \u00d7 3 \u00d7 5 = 47.1." },
    ],
  },
  "data-desert": {
    easy: [
      { q: "The mean of 2, 4, 6, 8 is:", options: ["4", "5", "6", "10"], answer: "5", explanation: "Mean = sum \u00f7 count = 20 \u00f7 4 = 5." },
      { q: "The mode of the data set 3, 3, 5, 7, 3, 9 is:", options: ["3", "5", "7", "9"], answer: "3", explanation: "3 appears most often (three times), making it the mode." },
      { q: "Which graph is best for showing proportions of a whole?", options: ["Line graph", "Pie chart", "Scatter plot", "Histogram"], answer: "Pie chart", explanation: "Pie charts divide a circle into slices representing parts of a whole." },
      { q: "True or False: The median is always the middle value in an ordered data set.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Once sorted, the median sits at the exact middle (or the average of the two middle values)." },
      { q: "Fill in the blank: The probability of an impossible event is ___.", type: "fill_blank", answer: "0", explanation: "An event that cannot happen has a probability of 0." },
    ],
    medium: [
      { q: "Numerical: What is the median of 3, 7, 9, 12, 15?", type: "numerical", answer: "9", explanation: "With 5 ordered values, the median is the middle (3rd) value: 9." },
      { q: "A fair coin is tossed once. The probability of getting heads is:", options: ["0", "1/4", "1/2", "1"], answer: "1/2", explanation: "A fair coin has 2 equally likely outcomes, so P(heads) = 1/2." },
      { q: "Numerical: A die is rolled once. What is the probability of rolling a 4? (as a fraction, e.g. 1/6)", type: "fill_blank", answer: "1/6", explanation: "A die has 6 equally likely faces, and only one shows a 4." },
      { q: "A histogram differs from a bar graph mainly because it:", options: ["Uses only whole numbers", "Shows continuous data with no gaps between bars", "Cannot show frequency", "Only works for probability"], answer: "Shows continuous data with no gaps between bars", explanation: "Histograms represent continuous, grouped data, so bars touch with no gaps." },
      { q: "The range of the data set 4, 9, 2, 15, 7 is:", options: ["9", "11", "13", "15"], answer: "13", explanation: "Range = maximum - minimum = 15 - 2 = 13." },
    ],
    hard: [
      { q: "Numerical: A bag has 3 red and 2 blue balls. What is the probability of picking a blue ball (as a fraction)?", type: "fill_blank", answer: "2/5", explanation: "There are 2 blue balls out of 5 total, so P(blue) = 2/5." },
      { q: "Which measure of central tendency is most affected by extreme outliers?", options: ["Mean", "Median", "Mode", "Range"], answer: "Mean", explanation: "The mean uses every value, so a very large or small outlier pulls it strongly." },
      { q: "Numerical: Two coins are tossed. What is the probability of getting exactly one head (as a fraction, e.g. 1/2)?", type: "fill_blank", answer: "1/2", explanation: "Outcomes are HH, HT, TH, TT; exactly one head occurs in 2 of 4 equally likely outcomes." },
      { q: "If the mean of 5 numbers is 10, their total sum is:", options: ["15", "20", "50", "2"], answer: "50", explanation: "Sum = mean \u00d7 count = 10 \u00d7 5 = 50." },
    ],
    expert: [
      { q: "Numerical: A card is drawn from a standard 52-card deck. What is the probability it's a king (as a fraction)?", type: "fill_blank", answer: "1/13", explanation: "There are 4 kings out of 52 cards, so 4/52 simplifies to 1/13." },
      { q: "Which best describes two mutually exclusive events?", options: ["They can happen at the same time", "They cannot happen at the same time", "One always causes the other", "They have equal probability"], answer: "They cannot happen at the same time", explanation: "Mutually exclusive events share no common outcomes." },
      { q: "Numerical: A survey of 40 students found 25 like tea. What is the probability a random student does NOT like tea (as a decimal)?", type: "numerical", answer: "0.375", explanation: "15 out of 40 don't like tea; 15/40 = 0.375." },
    ],
  },
  "final-math-summit": {
    easy: [
      { q: "What is the value of \u03c0 rounded to two decimal places?", options: ["3.41", "3.14", "3.12", "3.16"], answer: "3.14", explanation: "\u03c0 \u2248 3.14159..., which rounds to 3.14." },
      { q: "Which of these is a prime number?", options: ["9", "15", "17", "21"], answer: "17", explanation: "17 has no divisors other than 1 and itself." },
      { q: "The formula for the area of a rectangle is:", options: ["length + width", "length \u00d7 width", "2(length + width)", "length \u00b2"], answer: "length \u00d7 width", explanation: "Multiplying length by width gives the area of a rectangle." },
      { q: "Solve: 4x = 20.", options: ["4", "5", "16", "24"], answer: "5", explanation: "Dividing both sides by 4: x = 20 \u00f7 4 = 5." },
    ],
    medium: [
      { q: "The sum of the interior angles of a quadrilateral is:", options: ["180\u00b0", "270\u00b0", "360\u00b0", "450\u00b0"], answer: "360\u00b0", explanation: "Any quadrilateral's interior angles sum to 360\u00b0." },
      { q: "Numerical: Simplify 2(x + 3) - 4 when x = 5.", type: "numerical", answer: "12", explanation: "2(5+3) - 4 = 2(8) - 4 = 16 - 4 = 12." },
      { q: "Which value is the mode of 2, 2, 3, 4, 4, 4, 5?", options: ["2", "3", "4", "5"], answer: "4", explanation: "4 appears three times, more than any other value." },
      { q: "The volume of a cylinder depends on:", options: ["Radius only", "Height only", "Radius and height", "Diameter only"], answer: "Radius and height", explanation: "Volume = \u03c0r\u00b2h needs both the radius and the height." },
    ],
    hard: [
      { q: "Numerical: A right triangle has legs 6 and 8. What is its hypotenuse?", type: "numerical", answer: "10", explanation: "\u221a(6\u00b2+8\u00b2) = \u221a100 = 10." },
      { q: "Factorize: x\u00b2 - 4x + 4.", options: ["(x-2)\u00b2", "(x+2)\u00b2", "(x-4)(x+1)", "(x-2)(x+2)"], answer: "(x-2)\u00b2", explanation: "This is a perfect square trinomial: x\u00b2 - 4x + 4 = (x-2)(x-2)." },
      { q: "Numerical: What is the HCF of 24 and 36?", type: "numerical", answer: "12", explanation: "24 = 2\u00b3\u00d73 and 36 = 2\u00b2\u00d73\u00b2; the shared factors give HCF = 12." },
      { q: "A single die is rolled. What is the probability of rolling an even number?", options: ["1/6", "1/3", "1/2", "2/3"], answer: "1/2", explanation: "3 of the 6 faces (2, 4, 6) are even, so P = 3/6 = 1/2." },
    ],
    expert: [
      { q: "Numerical: Solve for x \u2014 2x\u00b2 = 32.", type: "numerical", answer: "4", explanation: "x\u00b2 = 16, so x = 4 (taking the positive root)." },
      { q: "The volume of a sphere with radius 3 (use \u03c0 \u2248 3.14, round to nearest whole number) is closest to:", options: ["38", "75", "113", "150"], answer: "113", explanation: "Volume = 4/3\u03c0r\u00b3 = 4/3 \u00d7 3.14 \u00d7 27 \u2248 113." },
      { q: "In a class of 30, the mean score is 70. If one student's score of 40 is corrected to 70, the new mean is closest to:", options: ["70", "71", "72", "73"], answer: "71", explanation: "The total increases by 30, so the mean increases by 30/30 = 1, giving 71." },
    ],
  },

  // --- Physics -----------------------------------------------------------
  "motion-meadow": {
    easy: [
      { q: "Which quantity is the straight-line distance from start to end, in a given direction?", options: ["Distance", "Displacement", "Speed", "Time"], answer: "Displacement", explanation: "Displacement is the shortest path from start to end point, along with direction." },
      { q: "Speed is defined as:", options: ["Distance \u00f7 time", "Displacement \u00d7 time", "Force \u00d7 mass", "Change in velocity \u00f7 time"], answer: "Distance \u00f7 time", explanation: "Speed measures how much distance is covered per unit of time." },
      { q: "The SI unit of speed is:", options: ["km/h", "m/s", "m/s\u00b2", "N"], answer: "m/s", explanation: "Speed is measured in metres per second in the SI system." },
      { q: "True or False: Distance can never be negative.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Distance is a scalar quantity and is always zero or positive." },
      { q: "Fill in the blank: A car travels 100 m in 20 s. Its average speed is ___ m/s.", type: "fill_blank", answer: "5", explanation: "Average speed = 100 \u00f7 20 = 5 m/s." },
    ],
    medium: [
      { q: "A body moving with uniform velocity has:", options: ["Zero acceleration", "Increasing acceleration", "Decreasing acceleration", "Uniform acceleration"], answer: "Zero acceleration", explanation: "Velocity that never changes means there is no acceleration." },
      { q: "Numerical: A body accelerates uniformly from rest to 20 m/s in 4 s. Find its acceleration in m/s\u00b2.", type: "numerical", answer: "5", explanation: "a = (v - u) \u00f7 t = (20 - 0) \u00f7 4 = 5 m/s\u00b2." },
      { q: "The slope of a distance-time graph gives:", options: ["Acceleration", "Speed", "Displacement", "Force"], answer: "Speed", explanation: "Slope = distance \u00f7 time, which is speed." },
      { q: "The area under a velocity-time graph gives:", options: ["Acceleration", "Distance", "Force", "Momentum"], answer: "Distance", explanation: "Area = velocity \u00d7 time, which is the distance covered." },
      { q: "If a body's velocity changes from 10 m/s to 30 m/s in 5 s, its acceleration is:", options: ["2 m/s\u00b2", "4 m/s\u00b2", "5 m/s\u00b2", "8 m/s\u00b2"], answer: "4 m/s\u00b2", explanation: "a = (30 - 10) \u00f7 5 = 4 m/s\u00b2." },
    ],
    hard: [
      { q: "Numerical: A car decelerates uniformly from 25 m/s to rest in 5 s. Find the distance covered, in metres.", type: "numerical", answer: "62.5", explanation: "s = ut + \u00bdat\u00b2 with u = 25, a = -5, t = 5: s = 125 - 62.5 = 62.5 m." },
      { q: "Two cars start from the same point in the same direction, A at 10 m/s and B at 15 m/s. After 4 s, the distance between them is:", options: ["10 m", "15 m", "20 m", "25 m"], answer: "20 m", explanation: "A covers 40 m, B covers 60 m; the gap is 60 - 40 = 20 m." },
      { q: "Which equation of motion relates displacement, initial velocity, time, and acceleration without needing the final velocity?", options: ["s = ut + \u00bdat\u00b2", "v = u + at", "v\u00b2 = u\u00b2 + 2as", "s = (u+v)/2 \u00d7 t"], answer: "s = ut + \u00bdat\u00b2", explanation: "This equation only needs u, t, and a to find displacement." },
      { q: "Numerical: A ball is thrown upward with initial velocity 20 m/s (g = 10 m/s\u00b2). How many seconds until it reaches maximum height?", type: "numerical", answer: "2", explanation: "At maximum height v = 0: 0 = 20 - 10t, so t = 2 s." },
    ],
    expert: [
      { q: "Numerical: A body travels the first half of a journey at 40 km/h and the second half at 60 km/h. Find its average speed, in km/h, for the whole journey.", type: "numerical", answer: "48", explanation: "For equal distances, average speed = 2\u00d740\u00d760 \u00f7 (40+60) = 4800 \u00f7 100 = 48 km/h." },
      { q: "A stone is dropped from a height and hits the ground after 4 s (g = 10 m/s\u00b2). What is its velocity just before hitting, in m/s?", options: ["20", "30", "40", "45"], answer: "40", explanation: "v = gt = 10 \u00d7 4 = 40 m/s." },
      { q: "A particle moves in a circle at constant speed. Which statement is true?", options: ["Its acceleration is zero", "Its velocity is constant", "It has a centripetal acceleration directed toward the center", "No force acts on it"], answer: "It has a centripetal acceleration directed toward the center", explanation: "Even at constant speed, the changing direction of velocity means there is centripetal acceleration toward the circle's center." },
    ],
  },
  "force-falls": {
    easy: [
      { q: "Newton's First Law is also known as the law of:", options: ["Momentum", "Inertia", "Gravitation", "Action-reaction"], answer: "Inertia", explanation: "It describes an object's tendency to resist changes in its state of motion." },
      { q: "Force is the product of:", options: ["Mass and velocity", "Mass and acceleration", "Mass and distance", "Weight and time"], answer: "Mass and acceleration", explanation: "Newton's second law states F = ma." },
      { q: "The SI unit of force is the:", options: ["Joule", "Watt", "Newton", "Pascal"], answer: "Newton", explanation: "Force is measured in newtons (N), named after Isaac Newton." },
      { q: "True or False: A body in motion stays in motion unless acted on by an external force.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "This is Newton's First Law, the law of inertia." },
      { q: "Fill in the blank: According to Newton's Third Law, every action has an equal and ___ reaction.", type: "fill_blank", answer: "opposite", explanation: "Newton's Third Law states action and reaction are equal in magnitude and opposite in direction." },
    ],
    medium: [
      { q: "Numerical: A force of 20 N acts on a mass of 4 kg. Find the acceleration produced, in m/s\u00b2.", type: "numerical", answer: "5", explanation: "a = F \u00f7 m = 20 \u00f7 4 = 5 m/s\u00b2." },
      { q: "Momentum is the product of:", options: ["Force and time", "Mass and velocity", "Mass and acceleration", "Force and distance"], answer: "Mass and velocity", explanation: "Momentum p = mass \u00d7 velocity." },
      { q: "Friction acting on an object moving over a surface always acts:", options: ["In the direction of motion", "Opposite to the direction of motion", "Perpendicular to motion", "Upward only"], answer: "Opposite to the direction of motion", explanation: "Friction opposes relative motion between surfaces." },
      { q: "Which of these reduces friction?", options: ["Rough surfaces", "Increased normal force", "Lubrication", "Increased contact area"], answer: "Lubrication", explanation: "Lubricants like oil reduce friction by keeping surfaces from directly rubbing together." },
      { q: "In a collision, if no external force acts, the total momentum of the system:", options: ["Increases", "Decreases", "Remains conserved", "Becomes zero"], answer: "Remains conserved", explanation: "This is the law of conservation of momentum." },
    ],
    hard: [
      { q: "Numerical: A 2 kg ball moving at 3 m/s collides with a stationary 1 kg ball and they stick together. Find their common velocity in m/s.", type: "numerical", answer: "2", explanation: "By conservation of momentum: (2\u00d73 + 1\u00d70) \u00f7 (2+1) = 6 \u00f7 3 = 2 m/s." },
      { q: "A rocket accelerates upward by expelling gas downward. This is best explained by:", options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "The law of gravitation"], answer: "Newton's Third Law", explanation: "The rocket pushes gas down (action); the gas pushes the rocket up (reaction)." },
      { q: "Numerical: How much force is needed to bring a 1000 kg car moving at 10 m/s to rest in 5 s?", type: "numerical", answer: "2000", explanation: "a = (0-10)/5 = -2 m/s\u00b2; F = ma = 1000 \u00d7 2 = 2000 N (magnitude)." },
      { q: "A book stays at rest on a table because:", options: ["No forces act on it", "Gravity and the normal force balance", "Friction holds it in place", "It has no mass"], answer: "Gravity and the normal force balance", explanation: "The table's normal force exactly cancels the book's weight, giving zero net force." },
    ],
    expert: [
      { q: "Numerical: A 5 kg object experiences a net force that changes its velocity from 2 m/s to 12 m/s in 2 s. Find the force applied, in newtons.", type: "numerical", answer: "25", explanation: "a = (12-2)/2 = 5 m/s\u00b2; F = ma = 5 \u00d7 5 = 25 N." },
      { q: "Two skaters push off each other from rest. Skater A (60 kg) moves at 2 m/s. If skater B has mass 40 kg, their speed is:", options: ["1 m/s", "2 m/s", "3 m/s", "4 m/s"], answer: "3 m/s", explanation: "Conservation of momentum: 60\u00d72 = 40\u00d7v, so v = 120/40 = 3 m/s." },
      { q: "Why does a passenger lurch forward when a moving bus suddenly stops?", options: ["The bus pushes them forward", "Their body tends to stay in motion due to inertia", "Friction pushes them forward", "Gravity pulls them forward"], answer: "Their body tends to stay in motion due to inertia", explanation: "Newton's First Law: the passenger's body keeps moving forward even as the bus stops." },
    ],
  },
  "energy-expanse": {
    easy: [
      { q: "Work is done when a force:", options: ["Is applied but nothing moves", "Causes a displacement", "Is balanced by another force", "Acts for zero time"], answer: "Causes a displacement", explanation: "Work requires both a force and movement in the direction of that force." },
      { q: "The SI unit of work and energy is the:", options: ["Newton", "Watt", "Joule", "Pascal"], answer: "Joule", explanation: "Work and energy are both measured in joules (J)." },
      { q: "Kinetic energy depends on an object's:", options: ["Mass and height", "Mass and velocity", "Weight and time", "Charge and speed"], answer: "Mass and velocity", explanation: "KE = \u00bdmv\u00b2, so it depends on mass and velocity." },
      { q: "True or False: Potential energy depends on an object's position or height.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Gravitational potential energy = mgh, which depends on height." },
      { q: "Fill in the blank: Power is the rate of doing ___.", type: "fill_blank", answer: "work", explanation: "Power = work done \u00f7 time taken." },
    ],
    medium: [
      { q: "Numerical: A force of 10 N moves an object 5 m in the direction of the force. Find the work done, in joules.", type: "numerical", answer: "50", explanation: "Work = force \u00d7 distance = 10 \u00d7 5 = 50 J." },
      { q: "Numerical: Find the kinetic energy (in joules) of a 2 kg object moving at 3 m/s.", type: "numerical", answer: "9", explanation: "KE = \u00bdmv\u00b2 = 0.5 \u00d7 2 \u00d7 9 = 9 J." },
      { q: "The SI unit of power is the:", options: ["Joule", "Newton", "Watt", "Volt"], answer: "Watt", explanation: "Power is measured in watts, where 1 W = 1 J/s." },
      { q: "As a ball falls, its potential energy converts into:", options: ["Kinetic energy", "Electrical energy", "Chemical energy", "Sound only"], answer: "Kinetic energy", explanation: "Falling converts stored gravitational PE into KE of motion." },
      { q: "1 kWh (kilowatt-hour) equals how many joules?", options: ["3600", "36,000", "360,000", "3,600,000"], answer: "3,600,000", explanation: "1 kWh = 1000 W \u00d7 3600 s = 3,600,000 J." },
    ],
    hard: [
      { q: "Numerical: An electric heater rated 2000 W runs for 3 hours. How many units (kWh) of energy does it use?", type: "numerical", answer: "6", explanation: "Energy = power \u00d7 time = 2 kW \u00d7 3 h = 6 kWh." },
      { q: "Numerical: A machine does 600 J of work in 5 s. Find its power, in watts.", type: "numerical", answer: "120", explanation: "Power = work \u00f7 time = 600 \u00f7 5 = 120 W." },
      { q: "In a frictionless system, if an object's kinetic energy increases by 20 J, its potential energy must:", options: ["Increase by 20 J", "Decrease by 20 J", "Stay the same", "Become zero"], answer: "Decrease by 20 J", explanation: "Total mechanical energy is conserved, so a KE gain equals a PE loss." },
      { q: "Numerical: Find the potential energy (in joules) of a 5 kg object raised 2 m above the ground (g = 10 m/s\u00b2).", type: "numerical", answer: "100", explanation: "PE = mgh = 5 \u00d7 10 \u00d7 2 = 100 J." },
    ],
    expert: [
      { q: "Numerical: A pump lifts 200 kg of water to a height of 10 m in 20 s (g = 10 m/s\u00b2). Find the power delivered, in watts.", type: "numerical", answer: "1000", explanation: "Work = mgh = 200\u00d710\u00d710 = 20,000 J; Power = 20,000 \u00f7 20 = 1000 W." },
      { q: "A ball is dropped from height h and bounces back to a lower height due to energy loss. This lost energy most likely converts into:", options: ["More kinetic energy", "Sound and heat", "Additional potential energy", "Nothing, energy is not lost"], answer: "Sound and heat", explanation: "The 'missing' mechanical energy is dissipated as sound and heat on impact, not destroyed." },
      { q: "If the electricity board charges \u20b96 per unit (kWh), the cost of running a 1000 W appliance for 5 hours is:", options: ["\u20b96", "\u20b930", "\u20b960", "\u20b9300"], answer: "\u20b930", explanation: "Energy used = 1 kW \u00d7 5 h = 5 kWh; cost = 5 \u00d7 6 = \u20b930." },
    ],
  },
  "circuit-caverns": {
    easy: [
      { q: "Electric current is the rate of flow of:", options: ["Voltage", "Charge", "Resistance", "Power"], answer: "Charge", explanation: "Current = charge \u00f7 time, measuring how much charge flows per second." },
      { q: "The SI unit of electric current is the:", options: ["Volt", "Ohm", "Ampere", "Watt"], answer: "Ampere", explanation: "Current is measured in amperes (A)." },
      { q: "Ohm's Law relates voltage, current, and:", options: ["Power", "Resistance", "Energy", "Charge"], answer: "Resistance", explanation: "Ohm's Law: V = I \u00d7 R." },
      { q: "True or False: In a series circuit, the same current flows through every component.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "A series circuit has only one path, so current is the same everywhere in it." },
      { q: "Fill in the blank: The SI unit of resistance is the ___.", type: "fill_blank", answer: "ohm", explanation: "Resistance is measured in ohms (\u03a9)." },
    ],
    medium: [
      { q: "Numerical: A circuit has a voltage of 12 V and resistance of 4 \u03a9. Find the current, in amperes.", type: "numerical", answer: "3", explanation: "I = V \u00f7 R = 12 \u00f7 4 = 3 A." },
      { q: "In a parallel circuit, the voltage across each branch is:", options: ["Different for each branch", "The same across all branches", "Zero", "Equal to total resistance"], answer: "The same across all branches", explanation: "All branches of a parallel circuit share the same two connection points, so voltage is equal across them." },
      { q: "Adding more resistors in series does what to total resistance?", options: ["Decreases it", "Increases it", "No change", "Makes it zero"], answer: "Increases it", explanation: "Series resistances simply add up: R_total = R1 + R2 + ...." },
      { q: "Adding more resistors in parallel does what to total resistance?", options: ["Decreases it", "Increases it", "No change", "Makes it infinite"], answer: "Decreases it", explanation: "Extra parallel paths give current more ways to flow, lowering total resistance." },
      { q: "The heating effect of current is used in:", options: ["Electric fans", "Electric bulbs and heaters", "Transformers only", "Batteries only"], answer: "Electric bulbs and heaters", explanation: "Current flowing through resistance produces heat, used deliberately in heaters and filament bulbs." },
    ],
    hard: [
      { q: "Numerical: Two resistors of 6 \u03a9 and 3 \u03a9 are connected in parallel. Find the equivalent resistance, in ohms.", type: "numerical", answer: "2", explanation: "1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6, so R = 2 \u03a9." },
      { q: "Numerical: Two resistors of 4 \u03a9 and 6 \u03a9 are connected in series with a 20 V battery. Find the current, in amperes.", type: "numerical", answer: "2", explanation: "R_total = 4 + 6 = 10 \u03a9; I = V/R = 20/10 = 2 A." },
      { q: "Which factor does NOT affect a wire's resistance?", options: ["Length", "Cross-sectional area", "Material (resistivity)", "Color of the wire"], answer: "Color of the wire", explanation: "Resistance depends on length, area, and resistivity, not color." },
      { q: "Numerical: Find the power dissipated (in watts) by a resistor carrying 2 A at 10 V.", type: "numerical", answer: "20", explanation: "Power = V \u00d7 I = 10 \u00d7 2 = 20 W." },
    ],
    expert: [
      { q: "Numerical: A 100 \u03a9 resistor carries 0.5 A of current. Find the heat produced in 10 seconds, in joules.", type: "numerical", answer: "250", explanation: "Heat = I\u00b2Rt = 0.25 \u00d7 100 \u00d7 10 = 250 J." },
      { q: "Doubling the length of a wire (keeping area and material the same) does what to its resistance?", options: ["Halves it", "Doubles it", "No change", "Quadruples it"], answer: "Doubles it", explanation: "Resistance is directly proportional to length: R = \u03c1L/A." },
      { q: "Doubling a wire's cross-sectional area (keeping length and material the same) does what to its resistance?", options: ["Halves it", "Doubles it", "No change", "Quadruples it"], answer: "Halves it", explanation: "Resistance is inversely proportional to area: R = \u03c1L/A." },
    ],
  },
  "light-lagoon": {
    easy: [
      { q: "The bouncing back of light from a surface is called:", options: ["Refraction", "Reflection", "Dispersion", "Diffraction"], answer: "Reflection", explanation: "Reflection is when light bounces off a surface rather than passing through it." },
      { q: "According to the laws of reflection, the angle of incidence is:", options: ["Always greater than the angle of reflection", "Always less than the angle of reflection", "Equal to the angle of reflection", "Unrelated to the angle of reflection"], answer: "Equal to the angle of reflection", explanation: "The first law of reflection states these two angles are always equal." },
      { q: "A mirror that curves inward, like the inside of a bowl, is called a:", options: ["Convex mirror", "Concave mirror", "Plane mirror", "Cylindrical mirror"], answer: "Concave mirror", explanation: "A concave mirror's reflecting surface curves inward." },
      { q: "True or False: Light bends when it passes from one transparent medium into another.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "This bending is called refraction, caused by a change in the speed of light." },
      { q: "Fill in the blank: A convex lens is thicker at the ___ than at the edges.", type: "fill_blank", answer: "center", explanation: "A convex lens bulges outward, making it thickest at its center." },
    ],
    medium: [
      { q: "A concave mirror is commonly used in:", options: ["Rear-view mirrors of cars", "Shaving/makeup mirrors", "Security mirrors in shops", "Solar cookers only"], answer: "Shaving/makeup mirrors", explanation: "Concave mirrors form an enlarged, upright image when the object is close, useful for shaving/makeup." },
      { q: "A convex mirror is commonly used as a:", options: ["Vehicle side mirror", "Telescope lens", "Magnifying glass", "Camera lens"], answer: "Vehicle side mirror", explanation: "Convex mirrors give a wider field of view, useful for vehicle side mirrors." },
      { q: "Which lens is used to correct short-sightedness (myopia)?", options: ["Concave lens", "Convex lens", "Bifocal lens only", "No lens is needed"], answer: "Concave lens", explanation: "A concave (diverging) lens spreads out light before it enters the eye, correcting myopia." },
      { q: "Which lens is used to correct long-sightedness (hypermetropia)?", options: ["Concave lens", "Convex lens", "Cylindrical lens", "No lens is needed"], answer: "Convex lens", explanation: "A convex (converging) lens helps focus light correctly for hypermetropia." },
      { q: "The part of the eye that controls how much light enters is the:", options: ["Retina", "Cornea", "Iris/pupil", "Optic nerve"], answer: "Iris/pupil", explanation: "The iris adjusts the pupil's size to control the amount of light entering the eye." },
    ],
    hard: [
      { q: "As light travels from air into glass (a denser medium), it:", options: ["Speeds up and bends away from the normal", "Slows down and bends toward the normal", "Travels at the same speed with no bending", "Reflects completely"], answer: "Slows down and bends toward the normal", explanation: "Light slows down entering a denser medium and bends toward the normal." },
      { q: "Which type of lens always forms a virtual, upright, and diminished image of a distant object?", options: ["Convex lens", "Concave lens", "Plano lens", "None of these"], answer: "Concave lens", explanation: "A diverging (concave) lens always produces a smaller, upright, virtual image." },
      { q: "The image formed by a plane mirror is:", options: ["Real and inverted", "Virtual and upright, same size as object", "Real and magnified", "Virtual and diminished"], answer: "Virtual and upright, same size as object", explanation: "Plane mirrors always form virtual, upright images equal in size to the object." },
      { q: "The eye defect in which distant objects appear blurred but near objects are seen clearly is called:", options: ["Myopia", "Hypermetropia", "Astigmatism only", "Cataract"], answer: "Myopia", explanation: "In myopia (near-sightedness), the eye focuses images in front of the retina, blurring distant objects." },
    ],
    expert: [
      { q: "A concave mirror forms a real, inverted, and same-size image when the object is placed at:", options: ["The focus", "The pole", "The center of curvature", "Infinity"], answer: "The center of curvature", explanation: "At the center of curvature, a concave mirror forms a real, inverted image of the same size as the object." },
      { q: "A ray of light passing through the optical center of a convex lens:", options: ["Bends sharply", "Passes through without any deviation", "Gets reflected back", "Splits into colors"], answer: "Passes through without any deviation", explanation: "Rays through the optical center of a thin lens continue in a straight line, undeviated." },
      { q: "Total internal reflection can occur when light travels from:", options: ["A rarer medium to a denser medium at a small angle", "A denser medium to a rarer medium at an angle greater than the critical angle", "Air to air", "A denser to a denser medium"], answer: "A denser medium to a rarer medium at an angle greater than the critical angle", explanation: "Total internal reflection requires light going from denser to rarer medium beyond the critical angle." },
    ],
  },
  "final-physics-frontier": {
    easy: [
      { q: "The SI unit of force is the:", options: ["Joule", "Newton", "Watt", "Ohm"], answer: "Newton", explanation: "Force is measured in newtons (N)." },
      { q: "Speed is calculated as:", options: ["Distance \u00f7 time", "Time \u00f7 distance", "Mass \u00d7 acceleration", "Force \u00d7 distance"], answer: "Distance \u00f7 time", explanation: "Speed = distance covered \u00f7 time taken." },
      { q: "Ohm's Law states that V equals:", options: ["I \u00f7 R", "I \u00d7 R", "I + R", "I \u00b2R"], answer: "I \u00d7 R", explanation: "Ohm's Law: V = I \u00d7 R." },
      { q: "Which mirror is used in vehicle side mirrors for a wider field of view?", options: ["Concave", "Convex", "Plane", "Cylindrical"], answer: "Convex", explanation: "Convex mirrors always give a wider, diminished view, ideal for vehicle mirrors." },
    ],
    medium: [
      { q: "Numerical: A body accelerates uniformly from rest to 10 m/s in 2 s. Find its acceleration, in m/s\u00b2.", type: "numerical", answer: "5", explanation: "a = (10-0)/2 = 5 m/s\u00b2." },
      { q: "Numerical: A force of 15 N acts on a 3 kg mass. Find the acceleration produced, in m/s\u00b2.", type: "numerical", answer: "5", explanation: "a = F/m = 15/3 = 5 m/s\u00b2." },
      { q: "Numerical: Find the work done (in joules) when a 4 N force moves an object 6 m.", type: "numerical", answer: "24", explanation: "Work = force \u00d7 distance = 4 \u00d7 6 = 24 J." },
      { q: "Which of these correctly converts kinetic energy into electrical energy?", options: ["Electric motor", "Generator", "Transformer", "Battery"], answer: "Generator", explanation: "A generator converts mechanical (kinetic) energy into electrical energy." },
    ],
    hard: [
      { q: "Numerical: Two resistors of 10 \u03a9 each are connected in parallel. Find the equivalent resistance, in ohms.", type: "numerical", answer: "5", explanation: "1/R = 1/10 + 1/10 = 2/10, so R = 5 \u03a9." },
      { q: "Numerical: A 1000 W heater runs for 2 hours. How many units (kWh) does it consume?", type: "numerical", answer: "2", explanation: "Energy = power \u00d7 time = 1 kW \u00d7 2 h = 2 kWh." },
      { q: "A stone dropped from rest hits the ground after 3 s (g = 10 m/s\u00b2). Its final velocity, in m/s, is:", options: ["10", "20", "30", "40"], answer: "30", explanation: "v = gt = 10 \u00d7 3 = 30 m/s." },
      { q: "Which best explains why a seatbelt protects a passenger during sudden braking?", options: ["It increases the car's speed", "It provides the force to counter the passenger's inertia", "It removes friction", "It has nothing to do with motion"], answer: "It provides the force to counter the passenger's inertia", explanation: "Without the seatbelt, the passenger's body would continue moving forward due to inertia (Newton's First Law)." },
    ],
    expert: [
      { q: "Numerical: A machine delivers 500 J of work in 10 s. Find its power output, in watts.", type: "numerical", answer: "50", explanation: "Power = work \u00f7 time = 500 \u00f7 10 = 50 W." },
      { q: "A ray of light passes from water into air. Compared to its path in water, it will:", options: ["Bend toward the normal", "Bend away from the normal", "Travel undeviated", "Be completely absorbed"], answer: "Bend away from the normal", explanation: "Moving from a denser medium (water) to a rarer one (air), light speeds up and bends away from the normal." },
      { q: "In a collision between two objects with no external force, which quantity is always conserved?", options: ["Kinetic energy only", "Momentum", "Speed of each object individually", "Force"], answer: "Momentum", explanation: "Total momentum of an isolated system is always conserved, even if kinetic energy is not (in inelastic collisions)." },
    ],
  },

  // --- English -------------------------------------------------------
  "grammar-grasslands": {
    easy: [
      { q: "Which word in this sentence is a verb? \"The dog barked loudly.\"", options: ["Dog", "Barked", "Loudly", "The"], answer: "Barked", explanation: "A verb shows an action â€” \"barked\" is what the dog did." },
      { q: "Which of these is a proper noun?", options: ["City", "River", "Mumbai", "Teacher"], answer: "Mumbai", explanation: "Proper nouns name specific people, places, or things, and are capitalized." },
      { q: "An adjective is a word that:", options: ["Shows an action", "Describes a noun", "Joins two clauses", "Replaces a noun"], answer: "Describes a noun", explanation: "Adjectives add detail about a noun, like its size, color, or quality." },
      { q: "True or False: \"Quickly\" is an adverb.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "\"Quickly\" describes how an action is done, making it an adverb." },
      { q: "Fill in the blank: A word that takes the place of a noun is called a ___.", type: "fill_blank", answer: "pronoun", explanation: "Pronouns like \"he\", \"she\", and \"it\" stand in for nouns." },
    ],
    medium: [
      { q: "Which sentence uses the past tense correctly?", options: ["She go to school yesterday.", "She goes to school yesterday.", "She went to school yesterday.", "She going to school yesterday."], answer: "She went to school yesterday.", explanation: "\"Went\" is the correct past tense form of \"go\"." },
      { q: "Which sentence shows correct subject-verb agreement?", options: ["The team are winning.", "The dogs barks loudly.", "She write every day.", "The books are on the table."], answer: "The books are on the table.", explanation: "\"Books\" is plural, so it correctly takes the plural verb \"are\"." },
      { q: "Which of these is a compound sentence?", options: ["I like tea.", "I like tea, but he likes coffee.", "Drinking tea.", "The tea is hot."], answer: "I like tea, but he likes coffee.", explanation: "A compound sentence joins two independent clauses, here with \"but\"." },
      { q: "Which punctuation mark ends a question?", options: ["Period", "Comma", "Question mark", "Exclamation mark"], answer: "Question mark", explanation: "A question mark (?) is used at the end of a direct question." },
      { q: "Which sentence uses an apostrophe correctly?", options: ["The dog's bone is missing.", "The dogs' bone is missing.", "The dog bone's is missing.", "The dogs bone is' missing."], answer: "The dog's bone is missing.", explanation: "An apostrophe + s shows possession for a single dog." },
    ],
    hard: [
      { q: "Which sentence is a complex sentence?", options: ["I ran home.", "I ran home because it started raining.", "I ran home and locked the door.", "I ran, I locked the door."], answer: "I ran home because it started raining.", explanation: "A complex sentence has an independent clause plus a dependent clause, here starting with \"because\"." },
      { q: "In \"Although she was tired, she finished her homework,\" the dependent clause is:", options: ["She was tired", "Although she was tired", "She finished her homework", "The whole sentence"], answer: "Although she was tired", explanation: "This clause can't stand alone as a full sentence, making it dependent." },
      { q: "Which sentence correctly uses a semicolon?", options: ["I was tired; so I went to bed.", "I was tired; I went to bed.", "I was tired, I went to bed;", "I was; tired I went to bed."], answer: "I was tired; I went to bed.", explanation: "A semicolon can join two closely related independent clauses without a conjunction." },
      { q: "Which sentence uses the passive voice?", options: ["The chef cooked the meal.", "The meal was cooked by the chef.", "The chef is cooking the meal.", "The chef will cook the meal."], answer: "The meal was cooked by the chef.", explanation: "In passive voice, the subject receives the action rather than performing it." },
    ],
    expert: [
      { q: "Which sentence contains a dangling modifier?", options: ["Walking to school, the rain started falling.", "Walking to school, I saw the rain start falling.", "The rain started falling as I walked to school.", "I walked to school in the rain."], answer: "Walking to school, the rain started falling.", explanation: "The rain wasn't walking to school â€” the modifier has nothing sensible to describe, making it a dangling modifier." },
      { q: "Which of these correctly uses the subjunctive mood?", options: ["If I was rich, I would travel.", "If I were rich, I would travel.", "If I am rich, I would travel.", "If I will be rich, I would travel."], answer: "If I were rich, I would travel.", explanation: "The subjunctive \"were\" is used for hypothetical or unreal situations, regardless of subject." },
      { q: "Which sentence correctly avoids a misplaced modifier?", options: ["She almost drove her kids to school every day.", "She drove her kids to school almost every day.", "Almost she drove her kids to school every day.", "She drove almost her kids to school every day."], answer: "She drove her kids to school almost every day.", explanation: "Placing \"almost\" next to \"every day\" correctly modifies frequency, not the act of driving." },
    ],
  },
  "vocabulary-valley": {
    easy: [
      { q: "Which word is a synonym for \"happy\"?", options: ["Joyful", "Angry", "Tired", "Bored"], answer: "Joyful", explanation: "\"Joyful\" and \"happy\" both describe a positive, cheerful feeling." },
      { q: "Which word is an antonym of \"large\"?", options: ["Huge", "Small", "Wide", "Tall"], answer: "Small", explanation: "\"Small\" means the opposite of \"large\"." },
      { q: "Adding the prefix \"un-\" to \"happy\" creates a word meaning:", options: ["More happy", "Not happy", "Very happy", "About to be happy"], answer: "Not happy", explanation: "The prefix \"un-\" reverses the meaning of the root word." },
      { q: "True or False: \"Enormous\" and \"tiny\" are synonyms.", type: "true_false", options: ["True", "False"], answer: "False", explanation: "\"Enormous\" and \"tiny\" have opposite meanings, making them antonyms." },
      { q: "Fill in the blank: Adding \"-ful\" to \"help\" gives the word ___.", type: "fill_blank", answer: "helpful", explanation: "The suffix \"-ful\" means \"full of\", turning \"help\" into \"helpful\"." },
    ],
    medium: [
      { q: "Which pair of words are homophones?", options: ["Their / there", "Big / small", "Run / walk", "Happy / joyful"], answer: "Their / there", explanation: "Homophones sound the same but have different spellings and meanings." },
      { q: "\"Bark\" (a tree's covering) and \"bark\" (a dog's sound) are examples of:", options: ["Synonyms", "Antonyms", "Homonyms", "Prefixes"], answer: "Homonyms", explanation: "Homonyms are words spelled and pronounced the same but with different meanings." },
      { q: "The idiom \"break the ice\" means to:", options: ["Literally break ice", "Start a conversation to ease tension", "End a friendship", "Cause an accident"], answer: "Start a conversation to ease tension", explanation: "This idiom describes easing an awkward or tense first interaction." },
      { q: "In the sentence \"The arid desert had no rainfall for months,\" the word \"arid\" most likely means:", options: ["Wet", "Cold", "Dry", "Fertile"], answer: "Dry", explanation: "The context (\"no rainfall\") signals that \"arid\" means extremely dry." },
      { q: "Which suffix turns \"act\" into a word meaning \"the process of doing\"?", options: ["-able", "-ion", "-ful", "-less"], answer: "-ion", explanation: "\"-ion\" forms nouns describing an action or process, as in \"action\"." },
    ],
    hard: [
      { q: "The idiom \"once in a blue moon\" means:", options: ["Every night", "Very rarely", "Very often", "Never"], answer: "Very rarely", explanation: "This idiom describes something that happens infrequently." },
      { q: "\"Their\", \"there\", and \"they're\" are best described as:", options: ["Synonyms", "Homophones", "Antonyms", "Prefixes"], answer: "Homophones", explanation: "They sound identical but differ in spelling and meaning." },
      { q: "In \"The critic's scathing review left the author despondent,\" \"despondent\" most likely means:", options: ["Delighted", "Confused", "Deeply discouraged", "Indifferent"], answer: "Deeply discouraged", explanation: "A scathing review would leave someone feeling low or dejected, matching \"despondent\"." },
      { q: "Which word means the opposite of \"benevolent\"?", options: ["Kind", "Malicious", "Generous", "Gentle"], answer: "Malicious", explanation: "\"Benevolent\" means kind and well-meaning; \"malicious\" means the opposite â€” intending harm." },
    ],
    expert: [
      { q: "The word \"ubiquitous\" is best replaced with:", options: ["Rare", "Everywhere", "Ancient", "Hidden"], answer: "Everywhere", explanation: "\"Ubiquitous\" describes something that appears to be present everywhere." },
      { q: "Which pair of words are most nearly synonyms?", options: ["Frugal / wasteful", "Meticulous / careless", "Candid / honest", "Reticent / talkative"], answer: "Candid / honest", explanation: "\"Candid\" and \"honest\" both describe openness and truthfulness." },
      { q: "In \"His diatribe against the policy went on for an hour,\" a \"diatribe\" is best understood as:", options: ["A calm discussion", "A bitter, critical speech", "A short summary", "A formal apology"], answer: "A bitter, critical speech", explanation: "A diatribe is a forceful, critical, and often angry verbal attack." },
    ],
  },
  "comprehension-cliffs": {
    easy: [
      { q: "\"Reading for detail\" mainly means finding:", options: ["The writer's hidden opinion", "Facts stated directly in the text", "A summary in one word", "The reader's own opinion"], answer: "Facts stated directly in the text", explanation: "Reading for detail is about locating information the text states outright." },
      { q: "The \"main idea\" of a passage is:", options: ["Its very last sentence", "What the passage is mostly about", "Every small detail", "The title only"], answer: "What the passage is mostly about", explanation: "The main idea captures the central point the passage is making." },
      { q: "An \"inference\" is a conclusion you reach by:", options: ["Copying a sentence exactly", "Reading between the lines using clues", "Guessing randomly", "Ignoring the text"], answer: "Reading between the lines using clues", explanation: "Inferences combine text clues with reasoning to reach an unstated conclusion." },
      { q: "True or False: An author's \"tone\" reflects their attitude toward the subject.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Tone is the writer's attitude, conveyed through word choice and style." },
      { q: "Fill in the blank: Putting events of a story in the order they happened is called ___.", type: "fill_blank", answer: "sequencing", explanation: "Sequencing is arranging events in their correct chronological order." },
    ],
    medium: [
      { q: "If a passage says, \"Dark clouds rolled in and the wind picked up,\" a reasonable inference is:", options: ["It will rain soon", "It is a sunny day", "Winter has ended", "The story is set indoors"], answer: "It will rain soon", explanation: "Dark clouds and rising wind are common signs that rain is approaching." },
      { q: "A passage that explains how to plant a garden most likely has the purpose to:", options: ["Entertain", "Persuade", "Inform / instruct", "Express sadness"], answer: "Inform / instruct", explanation: "Step-by-step how-to writing is meant to inform or instruct the reader." },
      { q: "Which detail would best support the main idea \"Exercise improves health\"?", options: ["A description of a city skyline", "A study showing exercise lowers heart disease risk", "A recipe for a sandwich", "A list of movie titles"], answer: "A study showing exercise lowers heart disease risk", explanation: "This detail directly supports the claim linking exercise to better health." },
      { q: "A passage written in an angry, urgent tone about pollution most likely aims to:", options: ["Persuade readers to take action", "Simply describe the weather", "Tell a bedtime story", "List unrelated facts"], answer: "Persuade readers to take action", explanation: "An urgent, angry tone about a problem usually signals persuasive intent." },
    ],
    hard: [
      { q: "In a story where a character \"slammed the door and refused to speak,\" the character most likely feels:", options: ["Joyful", "Upset or angry", "Bored", "Relaxed"], answer: "Upset or angry", explanation: "Slamming a door and refusing to talk are common signs of anger or upset." },
      { q: "An author who uses statistics, expert quotes, and logical arguments is most likely writing to:", options: ["Persuade", "Entertain", "Describe a scene", "Narrate a memory"], answer: "Persuade", explanation: "Statistics and expert opinions are classic tools of persuasive writing." },
      { q: "If a passage never states a character's age but says they \"just retired after 40 years of teaching,\" you can reasonably infer they are:", options: ["A young adult", "Likely in their 60s", "A child", "An infant"], answer: "Likely in their 60s", explanation: "Someone retiring after 40 years of work is very likely to be an older adult." },
      { q: "Which is the best summary of a passage's \"theme\"?", options: ["A list of every event in order", "The underlying message or lesson of the text", "The name of the main character", "The setting where the story occurs"], answer: "The underlying message or lesson of the text", explanation: "Theme is the deeper meaning or lesson the text conveys, beyond the plot itself." },
    ],
    expert: [
      { q: "A passage describes a character who \"smiled through gritted teeth\" while accepting an unfair decision. This detail most likely suggests:", options: ["The character is genuinely delighted", "The character is hiding frustration", "The character is asleep", "The character has left the room"], answer: "The character is hiding frustration", explanation: "A forced smile paired with gritted teeth signals suppressed frustration, not real happiness." },
      { q: "An author who repeatedly uses words like \"unfortunately\", \"sadly\", and \"regrettably\" throughout a report is most likely conveying a tone of:", options: ["Excitement", "Regret or disappointment", "Amusement", "Indifference"], answer: "Regret or disappointment", explanation: "Repeated negative, apologetic word choices point to a regretful or disappointed tone." },
      { q: "Two passages describe the same event, but one uses words like \"brave\" and \"heroic\" while the other uses \"reckless\" and \"foolish.\" This shows how word choice can reveal:", options: ["The exact same, neutral facts", "Bias or perspective", "Only grammar differences", "Nothing meaningful"], answer: "Bias or perspective", explanation: "Loaded word choices reveal the writer's underlying attitude or bias toward the same events." },
    ],
  },
  "composition-cove": {
    easy: [
      { q: "A good paragraph usually starts with a:", options: ["Conclusion", "Topic sentence", "Random fact", "Question only"], answer: "Topic sentence", explanation: "A topic sentence introduces the main idea the rest of the paragraph will support." },
      { q: "Descriptive writing focuses mainly on:", options: ["Giving step-by-step instructions", "Using vivid details to paint a picture", "Listing statistics", "Arguing a point"], answer: "Using vivid details to paint a picture", explanation: "Descriptive writing uses sensory, vivid language to help readers visualize something." },
      { q: "A narrative typically has a:", options: ["Beginning, middle, and end", "List of ingredients", "Table of numbers", "Set of grammar rules"], answer: "Beginning, middle, and end", explanation: "Narratives tell a story with a clear structure across its beginning, middle, and end." },
      { q: "True or False: Proofreading means checking a piece of writing for errors before finishing it.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Proofreading is the final check for spelling, grammar, and clarity errors." },
      { q: "Fill in the blank: A formal letter usually ends with a closing like \"Yours ___.\"", type: "fill_blank", answer: "sincerely", explanation: "\"Yours sincerely\" is a standard, polite closing for formal letters." },
    ],
    medium: [
      { q: "Which sentence best fits as a topic sentence for a paragraph about recycling?", options: ["I had cereal for breakfast today.", "Recycling helps reduce waste and protect the environment.", "The sky was blue yesterday.", "My favorite color is green."], answer: "Recycling helps reduce waste and protect the environment.", explanation: "This sentence introduces a clear main idea the paragraph can then support." },
      { q: "Which phrase uses the most vivid, descriptive language?", options: ["The dog was there.", "The dog ran.", "The scruffy dog bounded joyfully across the muddy field.", "A dog exists."], answer: "The scruffy dog bounded joyfully across the muddy field.", explanation: "This sentence uses specific, sensory details rather than plain, generic wording." },
      { q: "In a formal email, which greeting is most appropriate?", options: ["Hey!", "Yo,", "Dear Sir/Madam,", "Sup,"], answer: "Dear Sir/Madam,", explanation: "Formal emails use respectful, professional greetings rather than casual slang." },
      { q: "Which sentence contains a spelling error that proofreading should catch?", options: ["She recieved the package yesterday.", "She received the package yesterday.", "She opened the package.", "The package arrived."], answer: "She recieved the package yesterday.", explanation: "\"Recieved\" breaks the \"i before e\" rule â€” the correct spelling is \"received\"." },
      { q: "A concluding sentence in a paragraph should:", options: ["Introduce a brand-new unrelated topic", "Wrap up or restate the paragraph's main point", "Always ask a question", "Be left out entirely"], answer: "Wrap up or restate the paragraph's main point", explanation: "A concluding sentence ties the paragraph together, often restating its main idea." },
    ],
    hard: [
      { q: "Which revision improves this sentence: \"The thing happened and it was bad.\"", options: ["The thing happened, and it was very bad.", "The factory fire destroyed three buildings overnight.", "It happened, unfortunately, and it was bad indeed.", "The bad thing that happened, happened."], answer: "The factory fire destroyed three buildings overnight.", explanation: "This revision replaces vague words (\"thing\", \"bad\") with specific, concrete details." },
      { q: "Which sentence maintains consistent verb tense throughout?", options: ["She walked to the store and buys some milk.", "She walks to the store and bought some milk.", "She walked to the store and bought some milk.", "She walk to the store and buy some milk."], answer: "She walked to the store and bought some milk.", explanation: "Both verbs are in the past tense, keeping the sentence consistent." },
      { q: "In narrative writing, \"show, don't tell\" means you should generally prefer:", options: ["\"She was sad.\"", "\"Tears rolled down her cheeks as she stared at the floor.\"", "\"She felt an emotion.\"", "\"Sadness occurred.\""], answer: "\"Tears rolled down her cheeks as she stared at the floor.\"", explanation: "Showing through action and imagery lets readers infer emotion, rather than stating it directly." },
      { q: "Which is the clearest, most concise version of this sentence: \"Due to the fact that it was raining, we did not go outside.\"?", options: ["Due to the fact that it was raining, we did not go outside.", "Because it was raining, we stayed inside.", "It was raining, due to the fact, so inside we stayed.", "The fact of the rain caused us to not go outside."], answer: "Because it was raining, we stayed inside.", explanation: "This version cuts the wordy phrase \"due to the fact that\" down to a simple \"because\"." },
    ],
    expert: [
      { q: "Which change best fixes this passage for better flow: \"He ran fast. He was scared. A dog was chasing him.\"?", options: ["He ran fast, scared, and a dog was chasing him.", "Scared, he ran fast because a dog was chasing him.", "He ran fast. He was scared. A dog chased him.", "A dog chased him he ran fast scared."], answer: "Scared, he ran fast because a dog was chasing him.", explanation: "Combining the short, choppy sentences into one varied sentence improves flow and connects the ideas logically." },
      { q: "Which closing paragraph best avoids simply repeating the introduction word-for-word while still reinforcing the essay's main argument?", options: ["Restating the introduction exactly, sentence by sentence.", "Summarizing the key supporting points and reflecting on their broader significance.", "Introducing a completely new, unrelated argument.", "Ending abruptly with no closing thoughts."], answer: "Summarizing the key supporting points and reflecting on their broader significance.", explanation: "An effective conclusion synthesizes the argument's key points and reflects on their importance, rather than repeating the introduction." },
      { q: "In formal writing, which sentence best maintains an appropriately objective tone?", options: ["This policy is obviously a terrible idea that everyone hates.", "The policy has drawn criticism from several economists for its potential costs.", "I can't believe anyone would support this awful policy!", "This policy stinks, honestly."], answer: "The policy has drawn criticism from several economists for its potential costs.", explanation: "This sentence presents the criticism factually and attributes it to a source, avoiding emotional or biased language." },
    ],
  },
  "literary-lagoon": {
    easy: [
      { q: "A poem's \"rhythm\" refers to:", options: ["Its pattern of stressed and unstressed sounds", "Its exact word count", "Its font style", "Its title only"], answer: "Its pattern of stressed and unstressed sounds", explanation: "Rhythm is the beat created by stressed and unstressed syllables in a poem." },
      { q: "A metaphor is a figure of speech that:", options: ["Compares two things using \"like\" or \"as\"", "Directly says one thing is another", "Repeats the same sound", "Gives human traits to animals"], answer: "Directly says one thing is another", explanation: "A metaphor states a direct comparison, such as \"time is a thief\", without using \"like\" or \"as\"." },
      { q: "The \"setting\" of a story refers to:", options: ["The main character's name", "Where and when the story takes place", "The story's final sentence", "The author's real-life job"], answer: "Where and when the story takes place", explanation: "Setting describes the time and place in which a story unfolds." },
      { q: "True or False: A simile uses \"like\" or \"as\" to compare two things.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Similes explicitly compare using \"like\" or \"as\", e.g. \"brave as a lion\"." },
      { q: "Fill in the blank: Writing that flows in ordinary sentences and paragraphs, rather than lines and verses, is called ___.", type: "fill_blank", answer: "prose", explanation: "Prose is ordinary written or spoken language, as opposed to poetry's verse form." },
    ],
    medium: [
      { q: "\"The wind whispered through the trees\" is an example of:", options: ["Simile", "Personification", "Rhyme", "Alliteration"], answer: "Personification", explanation: "Giving the wind the human ability to \"whisper\" is personification." },
      { q: "Which of these is a simile?", options: ["Her smile was sunshine.", "Her smile was as bright as sunshine.", "Sunshine smiled.", "The sun is bright."], answer: "Her smile was as bright as sunshine.", explanation: "This comparison uses \"as ... as\", the classic structure of a simile." },
      { q: "In fiction, \"conflict\" refers to:", options: ["The problem or struggle a character faces", "The story's setting", "A minor side character", "The title of the book"], answer: "The problem or struggle a character faces", explanation: "Conflict is the central struggle that drives a story's plot forward." },
      { q: "\"Peter Piper picked a peck of pickled peppers\" is an example of:", options: ["Alliteration", "Personification", "Metaphor", "Onomatopoeia"], answer: "Alliteration", explanation: "Alliteration repeats the same starting consonant sound across nearby words." },
    ],
    hard: [
      { q: "In a story, \"rising action\" refers to the part where:", options: ["The story's problems are introduced and build tension", "The story ends", "Characters are first introduced calmly", "Nothing happens at all"], answer: "The story's problems are introduced and build tension", explanation: "Rising action builds tension as the central conflict develops toward its climax." },
      { q: "Which line best demonstrates onomatopoeia?", options: ["The bell rang loudly.", "The bell went \"clang, clang, clang.\"", "The bell was old.", "A bell hung on the wall."], answer: "The bell went \"clang, clang, clang.\"", explanation: "Onomatopoeia uses words that imitate the actual sound they describe, like \"clang.\"" },
      { q: "A story told from the \"first-person\" point of view is narrated using:", options: ["\"He\" and \"she\"", "\"I\" and \"we\"", "\"You\" only", "No pronouns at all"], answer: "\"I\" and \"we\"", explanation: "First-person narration is told from inside a character's perspective, using \"I\" or \"we.\"" },
      { q: "Which best distinguishes a novel from a short story?", options: ["A novel is always written in poetry", "A novel is typically much longer with a more complex plot", "A short story always has more characters", "There is no real difference"], answer: "A novel is typically much longer with a more complex plot", explanation: "Novels generally have more length and room for developed subplots than short stories." },
    ],
    expert: [
      { q: "In poetry, an \"extended metaphor\" is best described as:", options: ["A metaphor used only once, briefly", "A metaphor developed and sustained across several lines or the whole poem", "A comparison using \"like\" or \"as\"", "A rhyme scheme"], answer: "A metaphor developed and sustained across several lines or the whole poem", explanation: "An extended metaphor carries a single comparison through an extended stretch of writing." },
      { q: "Dramatic irony occurs when:", options: ["A character says something funny", "The audience knows something a character does not", "Two characters argue", "A story ends happily"], answer: "The audience knows something a character does not", explanation: "Dramatic irony creates tension because the reader or audience has information the character lacks." },
      { q: "An \"unreliable narrator\" is one who:", options: ["Always tells the complete, objective truth", "May distort, omit, or misunderstand the story's events", "Never appears in the story", "Speaks only in rhyme"], answer: "May distort, omit, or misunderstand the story's events", explanation: "An unreliable narrator's account of events can't be fully trusted, whether due to bias, limited knowledge, or deception." },
    ],
  },
  "final-english-empire": {
    easy: [
      { q: "Which word functions as a noun in this sentence? \"The rapid river flowed downstream.\"", options: ["Rapid", "River", "Flowed", "Downstream"], answer: "River", explanation: "\"River\" names a thing, making it the noun in the sentence." },
      { q: "A word that means the same as another word is called a:", options: ["Antonym", "Synonym", "Homophone", "Prefix"], answer: "Synonym", explanation: "Synonyms are words with the same or a very similar meaning." },
      { q: "The main idea of a passage is best described as:", options: ["A minor supporting detail", "What the passage is mostly about", "The last word of the passage", "The author's name"], answer: "What the passage is mostly about", explanation: "The main idea is the central point the whole passage supports." },
      { q: "A paragraph's topic sentence usually:", options: ["Introduces the paragraph's main idea", "Always appears last", "Is unrelated to the rest of the paragraph", "Is always a question"], answer: "Introduces the paragraph's main idea", explanation: "Topic sentences set up what the rest of the paragraph will discuss." },
    ],
    medium: [
      { q: "Which sentence uses correct subject-verb agreement?", options: ["The children plays outside.", "The children play outside.", "The child play outside.", "The children playing outside."], answer: "The children play outside.", explanation: "\"Children\" is plural and correctly takes the plural verb form \"play.\"" },
      { q: "\"The stars danced in the sky\" is an example of:", options: ["Simile", "Personification", "Alliteration", "Rhyme"], answer: "Personification", explanation: "Giving stars the human ability to \"dance\" is personification." },
      { q: "In a story, the \"climax\" is:", options: ["The very beginning", "The turning point or most intense moment", "A minor unrelated detail", "The title of the book"], answer: "The turning point or most intense moment", explanation: "The climax is the peak of tension or the turning point in a story's plot." },
      { q: "Which sentence is written in the passive voice?", options: ["The cat chased the mouse.", "The mouse was chased by the cat.", "The cat is chasing the mouse.", "The cat will chase the mouse."], answer: "The mouse was chased by the cat.", explanation: "In passive voice, the subject (\"the mouse\") receives the action instead of performing it." },
    ],
    hard: [
      { q: "Which sentence best uses vivid, descriptive language rather than vague wording?", options: ["The thing was nice.", "It was good.", "The golden sunset painted the sky in streaks of orange and pink.", "Something happened outside."], answer: "The golden sunset painted the sky in streaks of orange and pink.", explanation: "This sentence uses specific, sensory imagery instead of vague, generic wording." },
      { q: "Which is the best inference based on: \"He packed his bags, bought a one-way ticket, and didn't look back\"?", options: ["He is planning a short weekend trip", "He does not plan on returning soon", "He forgot something important", "He is staying home"], answer: "He does not plan on returning soon", explanation: "A one-way ticket and \"didn't look back\" both suggest he isn't planning to return." },
      { q: "Which revision fixes the dangling modifier in \"Running late, the bus was missed by Tom\"?", options: ["Running late, the bus was missed by Tom.", "Running late, Tom missed the bus.", "The bus, running late, was missed by Tom.", "Tom, the bus running late, missed it."], answer: "Running late, Tom missed the bus.", explanation: "\"Running late\" should describe Tom, not the bus, so Tom must be the subject right after the modifier." },
      { q: "Which sentence correctly maintains parallel structure?", options: ["She likes hiking, to swim, and biking.", "She likes hiking, swimming, and biking.", "She likes to hike, swimming, and to bike.", "She likes hiking, swim, and to bike."], answer: "She likes hiking, swimming, and biking.", explanation: "All three items use the same \"-ing\" form, keeping the structure parallel." },
    ],
    expert: [
      { q: "Which best identifies the tone of a passage that repeatedly uses words like \"crumbling\", \"forgotten\", and \"decayed\" to describe a town?", options: ["Cheerful and hopeful", "Bleak and melancholic", "Playful and humorous", "Neutral and factual"], answer: "Bleak and melancholic", explanation: "Words associated with decline and neglect create a bleak, melancholic tone." },
      { q: "An extended metaphor comparing life to a \"long and winding road\" throughout an entire poem is an example of:", options: ["Alliteration", "An extended metaphor", "A homophone", "A dangling modifier"], answer: "An extended metaphor", explanation: "Sustaining one comparison across an entire piece of writing makes it an extended metaphor." },
      { q: "Which sentence best demonstrates \"show, don't tell\" in narrative writing?", options: ["He was nervous before the exam.", "His hands trembled as he stared at the blank answer sheet.", "The exam made him feel a certain way.", "Nervousness was present in the room."], answer: "His hands trembled as he stared at the blank answer sheet.", explanation: "This sentence conveys nervousness through physical action and detail rather than stating the emotion outright." },
    ],
  },

  // --- Biology -----------------------------------------------------------
  "cell-city": {
    easy: [
      { q: "Who is credited with discovering the cell?", options: ["Robert Hooke", "Charles Darwin", "Gregor Mendel", "Louis Pasteur"], answer: "Robert Hooke", explanation: "Robert Hooke first observed and named \"cells\" while examining cork under a microscope in 1665." },
      { q: "The cell is called the fundamental unit of life because:", options: ["It is the smallest structural and functional unit of an organism", "It is visible to the naked eye", "It never changes shape", "It contains no genetic material"], answer: "It is the smallest structural and functional unit of an organism", explanation: "Every living organism is made of cells, the smallest units capable of carrying out life's functions." },
      { q: "Which structure controls what enters and leaves a cell?", options: ["Cell wall", "Cell membrane", "Nucleus", "Vacuole"], answer: "Cell membrane", explanation: "The cell (plasma) membrane is selectively permeable, controlling the movement of substances in and out." },
      { q: "True or False: All cells contain a cell wall.", type: "true_false", options: ["True", "False"], answer: "False", explanation: "Only plant cells, fungi, and some other organisms have a cell wall; animal cells do not." },
      { q: "Fill in the blank: The jelly-like substance inside a cell, excluding the nucleus, is called the ___.", type: "fill_blank", answer: "cytoplasm", explanation: "The cytoplasm is the gel-like material filling the cell where most cellular activities occur." },
    ],
    medium: [
      { q: "Which organelle is known as the \"powerhouse of the cell\"?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"], answer: "Mitochondria", explanation: "Mitochondria generate ATP, the cell's energy currency, through cellular respiration." },
      { q: "Which organelle is responsible for protein synthesis?", options: ["Ribosome", "Lysosome", "Vacuole", "Chloroplast"], answer: "Ribosome", explanation: "Ribosomes read genetic instructions to assemble proteins." },
      { q: "Compared to animal cells, plant cell vacuoles are typically:", options: ["Much larger and fewer", "Much smaller and more numerous", "Completely absent", "The same size"], answer: "Much larger and fewer", explanation: "Plant cells usually have one large central vacuole for storage and turgor pressure, unlike the small vacuoles in animal cells." },
      { q: "Which organelle is responsible for packaging and dispatching cell products?", options: ["Golgi apparatus", "Mitochondria", "Nucleus", "Chloroplast"], answer: "Golgi apparatus", explanation: "The Golgi apparatus modifies, packages, and ships proteins and lipids to their destinations." },
      { q: "Lysosomes are often nicknamed the cell's:", options: ["Powerhouse", "Suicide bags", "Control center", "Storage tanks"], answer: "Suicide bags", explanation: "Lysosomes contain digestive enzymes that can break down the cell itself if it's damaged, earning them this nickname." },
    ],
    hard: [
      { q: "Which of these is found in a plant cell but NOT in an animal cell?", options: ["Chloroplast", "Mitochondria", "Nucleus", "Ribosome"], answer: "Chloroplast", explanation: "Chloroplasts, the site of photosynthesis, are unique to plant cells and some protists." },
      { q: "The nucleus is separated from the cytoplasm by the:", options: ["Nuclear membrane", "Cell membrane", "Cell wall", "Plasma membrane only"], answer: "Nuclear membrane", explanation: "The nuclear membrane (envelope) encloses the nucleus, separating it from the cytoplasm." },
      { q: "Which structure gives a plant cell its rigid shape?", options: ["Cell wall", "Cell membrane", "Nucleus", "Cytoplasm"], answer: "Cell wall", explanation: "The rigid cell wall, made mainly of cellulose, provides structural support and shape to plant cells." },
      { q: "Osmosis is the movement of:", options: ["Water across a selectively permeable membrane", "Solutes only", "Gases only", "Proteins across a membrane"], answer: "Water across a selectively permeable membrane", explanation: "Osmosis specifically describes water moving from a region of higher to lower water concentration through a selectively permeable membrane." },
    ],
    expert: [
      { q: "If a plant cell is placed in a hypertonic solution, it will most likely undergo:", options: ["Plasmolysis", "Bursting", "No change", "Endocytosis"], answer: "Plasmolysis", explanation: "In a hypertonic solution, water leaves the cell, causing the cell membrane to shrink away from the cell wall \u2014 plasmolysis." },
      { q: "Which of these best explains why the cell membrane is called \"selectively permeable\"?", options: ["It allows only certain substances to pass through", "It allows everything to pass freely", "It blocks all substances", "It only allows gases through"], answer: "It allows only certain substances to pass through", explanation: "Selective permeability means the membrane regulates which molecules can cross, based on size, charge, and other factors." },
      { q: "Endoplasmic reticulum studded with ribosomes is called:", options: ["Rough endoplasmic reticulum", "Smooth endoplasmic reticulum", "Golgi apparatus", "Nuclear envelope"], answer: "Rough endoplasmic reticulum", explanation: "Ribosomes attached to the ER's surface give it a \"rough\" appearance under a microscope." },
      { q: "Which of these organisms is prokaryotic, lacking a true nucleus?", options: ["Bacteria", "Human", "Plant", "Fungus"], answer: "Bacteria", explanation: "Bacteria are prokaryotes \u2014 their genetic material floats freely in the cytoplasm rather than being enclosed in a nucleus." },
    ],
  },
  "tissue-terrace": {
    easy: [
      { q: "A group of cells similar in structure that work together to perform a specific function is called a:", options: ["Organ", "Tissue", "Organism", "Organelle"], answer: "Tissue", explanation: "A tissue is a group of similar cells working together for a common function." },
      { q: "Which plant tissue is responsible for growth by active cell division?", options: ["Meristematic tissue", "Permanent tissue", "Epithelial tissue", "Muscular tissue"], answer: "Meristematic tissue", explanation: "Meristematic tissue consists of actively dividing cells found at growing points like root and shoot tips." },
      { q: "Which of these is an example of connective tissue in animals?", options: ["Blood", "Skin surface layer", "Muscle", "Nerve"], answer: "Blood", explanation: "Blood is a fluid connective tissue that transports substances throughout the body." },
      { q: "True or False: Muscle tissue is responsible for movement in animals.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Muscle tissue contracts and relaxes to produce movement." },
      { q: "Fill in the blank: Tissue that covers the outer surface of the body and lines internal cavities is called ___ tissue.", type: "fill_blank", answer: "epithelial", explanation: "Epithelial tissue forms protective coverings and linings throughout the body." },
    ],
    medium: [
      { q: "Xylem tissue in plants is mainly responsible for:", options: ["Transporting water and minerals", "Transporting food", "Photosynthesis", "Storing starch"], answer: "Transporting water and minerals", explanation: "Xylem conducts water and dissolved minerals from roots to the rest of the plant." },
      { q: "Phloem tissue in plants is mainly responsible for:", options: ["Transporting food", "Transporting water", "Gas exchange", "Support only"], answer: "Transporting food", explanation: "Phloem transports food (mainly sugars) made during photosynthesis to different parts of the plant." },
      { q: "Which type of muscle tissue is found in the heart?", options: ["Cardiac muscle", "Skeletal muscle", "Smooth muscle", "Striated voluntary muscle"], answer: "Cardiac muscle", explanation: "Cardiac muscle is the specialized, involuntary muscle tissue found only in the heart." },
      { q: "Nervous tissue is made up of specialized cells called:", options: ["Neurons", "Osteocytes", "Myocytes", "Adipocytes"], answer: "Neurons", explanation: "Neurons are the functional units of nervous tissue that transmit electrical impulses." },
      { q: "Which meristem is found at the tips of roots and shoots?", options: ["Apical meristem", "Lateral meristem", "Intercalary meristem", "Permanent meristem"], answer: "Apical meristem", explanation: "Apical meristem at root and shoot tips is responsible for increase in length (primary growth)." },
    ],
    hard: [
      { q: "Simple permanent tissue that provides flexibility to plant parts like young stems is:", options: ["Collenchyma", "Sclerenchyma", "Xylem", "Phloem"], answer: "Collenchyma", explanation: "Collenchyma cells have unevenly thickened walls, giving flexibility and mechanical support to growing parts." },
      { q: "Sclerenchyma tissue provides plants with:", options: ["Rigidity and hardness", "Flexibility only", "Water transport", "Food transport"], answer: "Rigidity and hardness", explanation: "Sclerenchyma cells have thick, lignified walls that make plant parts hard and rigid, like in nutshells." },
      { q: "Which tissue allows for rapid response and coordination in animals?", options: ["Nervous tissue", "Connective tissue", "Epithelial tissue", "Adipose tissue"], answer: "Nervous tissue", explanation: "Nervous tissue transmits impulses quickly, enabling fast responses and coordination." },
      { q: "Areolar connective tissue in the body mainly functions to:", options: ["Fill space inside organs and support internal organs", "Transport oxygen", "Contract for movement", "Conduct nerve impulses"], answer: "Fill space inside organs and support internal organs", explanation: "Areolar tissue is a loose connective tissue that fills spaces and supports organs and other tissues." },
    ],
    expert: [
      { q: "Which of these best distinguishes voluntary muscle from involuntary muscle?", options: ["Voluntary muscle is under conscious control, involuntary is not", "Voluntary muscle is found only in the heart", "Involuntary muscle is always striated", "There is no functional difference"], answer: "Voluntary muscle is under conscious control, involuntary is not", explanation: "Skeletal (voluntary) muscle moves under conscious control, while smooth and cardiac (involuntary) muscles act automatically." },
      { q: "Intercalary meristem is found at:", options: ["The base of leaves and nodes of stems", "Only root tips", "Only shoot tips", "The outer bark"], answer: "The base of leaves and nodes of stems", explanation: "Intercalary meristem occurs at the base of leaves or internodes, allowing growth in those regions." },
      { q: "Complex permanent tissues, unlike simple permanent tissues, are made of:", options: ["More than one type of cell working together", "Only one type of cell", "Dead cells only", "No cells at all"], answer: "More than one type of cell working together", explanation: "Complex tissues like xylem and phloem consist of more than one type of cell working together as a unit." },
      { q: "Adipose tissue primarily functions to:", options: ["Store fat", "Transmit nerve impulses", "Contract for movement", "Transport oxygen"], answer: "Store fat", explanation: "Adipose tissue is a connective tissue specialized for storing fat, providing insulation and energy reserves." },
    ],
  },
  "kingdom-canyon": {
    easy: [
      { q: "The process of grouping organisms based on similarities is called:", options: ["Classification", "Reproduction", "Photosynthesis", "Respiration"], answer: "Classification", explanation: "Classification organizes the diversity of living organisms into meaningful groups based on shared characteristics." },
      { q: "Which kingdom includes bacteria?", options: ["Monera", "Protista", "Fungi", "Plantae"], answer: "Monera", explanation: "Kingdom Monera includes all prokaryotic organisms, including bacteria." },
      { q: "Organisms in Kingdom Fungi typically obtain nutrition by:", options: ["Absorbing organic matter from their surroundings", "Photosynthesis", "Consuming other animals only", "Producing their own light"], answer: "Absorbing organic matter from their surroundings", explanation: "Fungi are heterotrophic and absorb nutrients from decaying or living organic matter." },
      { q: "True or False: All members of Kingdom Protista are single-celled.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Kingdom Protista consists mainly of unicellular eukaryotic organisms like Amoeba and Paramecium." },
      { q: "Fill in the blank: Animals without a backbone are called ___.", type: "fill_blank", answer: "invertebrates", explanation: "Invertebrates are animals that lack a vertebral column (backbone)." },
    ],
    medium: [
      { q: "Which of these is an example of an invertebrate?", options: ["Earthworm", "Frog", "Fish", "Human"], answer: "Earthworm", explanation: "Earthworms belong to phylum Annelida and lack a backbone, making them invertebrates." },
      { q: "Amphibians are animals that can typically live:", options: ["Both on land and in water", "Only underwater", "Only in the air", "Only underground"], answer: "Both on land and in water", explanation: "Amphibians like frogs can live both on land and in water, especially during different life stages." },
      { q: "Which vertebrate group is characterized by having mammary glands?", options: ["Mammals", "Reptiles", "Birds", "Fish"], answer: "Mammals", explanation: "Mammary glands, which produce milk to feed young, are a defining feature of mammals." },
      { q: "Reptiles are distinguished from amphibians mainly because reptiles have:", options: ["Dry, scaly skin", "Moist, permeable skin", "Gills throughout life", "No skeleton"], answer: "Dry, scaly skin", explanation: "Reptiles have dry, scaly skin adapted to prevent water loss on land, unlike the moist skin of amphibians." },
      { q: "Which of these belongs to Kingdom Plantae?", options: ["Moss", "Mushroom", "Amoeba", "Bacteria"], answer: "Moss", explanation: "Moss is a simple, non-flowering plant belonging to Kingdom Plantae." },
    ],
    hard: [
      { q: "Arthropods, the largest animal phylum, are characterized by:", options: ["Jointed legs and an exoskeleton", "A backbone and internal skeleton", "No legs at all", "Radial symmetry only"], answer: "Jointed legs and an exoskeleton", explanation: "Arthropods (insects, spiders, crustaceans) have jointed appendages and a hard external skeleton (exoskeleton)." },
      { q: "Which classification level is broader: Phylum or Class?", options: ["Phylum", "Class", "They are equal", "Neither"], answer: "Phylum", explanation: "In the classification hierarchy, Phylum is broader than Class \u2014 Kingdom > Phylum > Class > Order > Family > Genus > Species." },
      { q: "Birds are classified separately from reptiles mainly due to their:", options: ["Feathers and warm-bloodedness", "Cold-bloodedness", "Lack of a skeleton", "Aquatic lifestyle"], answer: "Feathers and warm-bloodedness", explanation: "Feathers and being warm-blooded (endothermic) set birds apart from reptiles, despite shared ancestry." },
      { q: "Which of these correctly orders classification from broadest to narrowest?", options: ["Kingdom, Phylum, Class, Order, Family, Genus, Species", "Species, Genus, Family, Order, Class, Phylum, Kingdom", "Phylum, Kingdom, Class, Order", "Genus, Species, Kingdom, Phylum"], answer: "Kingdom, Phylum, Class, Order, Family, Genus, Species", explanation: "This is the standard biological classification hierarchy from broadest to most specific." },
    ],
    expert: [
      { q: "Which feature is primarily used to distinguish Kingdom Monera from all other kingdoms?", options: ["Absence of a true nucleus (prokaryotic)", "Presence of chlorophyll", "Multicellularity", "Ability to move"], answer: "Absence of a true nucleus (prokaryotic)", explanation: "Monerans are prokaryotic, lacking a membrane-bound nucleus, unlike organisms in all other kingdoms." },
      { q: "Cartilaginous fish, like sharks, differ from bony fish mainly in having a skeleton made of:", options: ["Cartilage instead of bone", "Bone only", "No internal skeleton", "Chitin"], answer: "Cartilage instead of bone", explanation: "Cartilaginous fish (Chondrichthyes) have skeletons made of cartilage rather than true bone." },
      { q: "Which of these is a key criterion Whittaker used to classify organisms into five kingdoms?", options: ["Cell structure, mode of nutrition, and body organization", "Color only", "Size only", "Habitat only"], answer: "Cell structure, mode of nutrition, and body organization", explanation: "Whittaker's five-kingdom classification considered cell structure, nutrition, body organization, and reproduction, among other factors." },
      { q: "Which of these vertebrate classes is exclusively aquatic and breathes through gills throughout its life?", options: ["Fish", "Amphibians", "Reptiles", "Mammals"], answer: "Fish", explanation: "Fish live in water and use gills to extract oxygen throughout their entire life cycle, unlike amphibians." },
    ],
  },
  "wellness-woods": {
    easy: [
      { q: "According to the WHO's broad definition, health is best described as:", options: ["A state of complete physical, mental, and social well-being", "Simply the absence of disease", "Only physical fitness", "Never needing a doctor"], answer: "A state of complete physical, mental, and social well-being", explanation: "Health is more than just not being sick \u2014 it includes physical, mental, and social well-being." },
      { q: "A disease that lasts for a long time, sometimes a lifetime, is called:", options: ["Acute", "Chronic", "Temporary", "Minor"], answer: "Chronic", explanation: "Chronic diseases persist over a long duration, unlike acute diseases which resolve quickly." },
      { q: "Which of these is an infectious disease?", options: ["Common cold", "Diabetes", "Arthritis", "Cancer"], answer: "Common cold", explanation: "The common cold is caused by viruses and can spread from person to person, making it infectious." },
      { q: "True or False: Vaccines help the immune system recognize a disease-causing organism in advance.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Vaccines expose the immune system to a harmless form of a pathogen, so it can respond quickly to a real infection later." },
      { q: "Fill in the blank: Organisms that cause disease are called ___.", type: "fill_blank", answer: "pathogens", explanation: "Pathogens are disease-causing organisms such as bacteria, viruses, and fungi." },
    ],
    medium: [
      { q: "Which of these is a viral disease?", options: ["Influenza (flu)", "Tuberculosis", "Typhoid", "Malaria"], answer: "Influenza (flu)", explanation: "Influenza is caused by the influenza virus, unlike TB and typhoid which are bacterial, or malaria which is caused by a protozoan." },
      { q: "Tuberculosis is caused by which type of pathogen?", options: ["Bacteria", "Virus", "Fungus", "Protozoan"], answer: "Bacteria", explanation: "Tuberculosis is caused by the bacterium Mycobacterium tuberculosis." },
      { q: "Diseases that spread from an infected person to a healthy person are called:", options: ["Communicable diseases", "Non-communicable diseases", "Genetic diseases", "Deficiency diseases"], answer: "Communicable diseases", explanation: "Communicable (infectious) diseases can be transmitted from one person to another." },
      { q: "Malaria is transmitted to humans through the bite of:", options: ["Female Anopheles mosquito", "Housefly", "Tick", "Aedes mosquito only"], answer: "Female Anopheles mosquito", explanation: "Malaria is caused by Plasmodium, transmitted through the bite of an infected female Anopheles mosquito." },
      { q: "Which of these helps prevent the spread of airborne diseases?", options: ["Covering the mouth while coughing or sneezing", "Drinking boiled water", "Wearing gloves only", "Avoiding sunlight"], answer: "Covering the mouth while coughing or sneezing", explanation: "Covering the mouth and nose reduces the spread of droplets carrying airborne pathogens." },
    ],
    hard: [
      { q: "Which of these diseases is caused by a protozoan parasite?", options: ["Malaria", "Chickenpox", "Tetanus", "Measles"], answer: "Malaria", explanation: "Malaria is caused by Plasmodium, a protozoan parasite, unlike the viral diseases chickenpox and measles." },
      { q: "The presence of a disease-causing microbe in the body with no visible symptoms yet is called the disease's:", options: ["Incubation period", "Recovery period", "Chronic phase", "Immunization period"], answer: "Incubation period", explanation: "The incubation period is the time between infection and the appearance of symptoms." },
      { q: "Antibiotics are effective against which type of pathogen?", options: ["Bacteria", "Viruses", "All pathogens equally", "None of these"], answer: "Bacteria", explanation: "Antibiotics target bacterial processes and are not effective against viruses." },
      { q: "Which of these best explains why viral diseases like the common cold don't respond to antibiotics?", options: ["Viruses lack the cellular processes antibiotics target", "Viruses are too large for antibiotics", "Antibiotics only work on plants", "Viruses are immune to all medicine"], answer: "Viruses lack the cellular processes antibiotics target", explanation: "Antibiotics disrupt bacterial cell processes; viruses don't have these same processes, so antibiotics don't affect them." },
    ],
    expert: [
      { q: "Herd immunity in a population primarily works by:", options: ["Reducing the spread of a pathogen when enough people are immune", "Making every individual immune", "Eliminating the pathogen entirely from the environment", "Only protecting vaccinated individuals"], answer: "Reducing the spread of a pathogen when enough people are immune", explanation: "When a large portion of a population is immune, the pathogen has fewer hosts to infect, indirectly protecting even unvaccinated individuals." },
      { q: "Which of these is an example of a non-communicable disease?", options: ["Cancer", "Common cold", "Tuberculosis", "Chickenpox"], answer: "Cancer", explanation: "Cancer isn't transmitted from person to person, making it a non-communicable disease unlike the others listed." },
      { q: "Vaccines work by triggering the body to produce:", options: ["Antibodies specific to a pathogen", "More red blood cells", "Digestive enzymes", "New pathogens"], answer: "Antibodies specific to a pathogen", explanation: "Vaccines stimulate the immune system to produce antibodies that recognize and fight a specific pathogen." },
      { q: "Which of these best explains why overusing antibiotics is a health concern?", options: ["It can lead to antibiotic-resistant bacteria", "It cures diseases too quickly", "It only affects viruses", "It has no long-term effects"], answer: "It can lead to antibiotic-resistant bacteria", explanation: "Overuse of antibiotics can allow resistant bacterial strains to survive and multiply, making future infections harder to treat." },
    ],
  },
  "resource-reef": {
    easy: [
      { q: "Which gas do plants primarily absorb from the air during photosynthesis?", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], answer: "Carbon dioxide", explanation: "Plants absorb carbon dioxide from the air and use it, along with water and sunlight, to make food during photosynthesis." },
      { q: "The continuous movement of water between the atmosphere, land, and oceans is called the:", options: ["Water cycle", "Carbon cycle", "Nitrogen cycle", "Rock cycle"], answer: "Water cycle", explanation: "The water cycle describes water's continuous movement through evaporation, condensation, and precipitation." },
      { q: "Which layer of the atmosphere protects Earth from harmful ultraviolet radiation?", options: ["Ozone layer", "Troposphere", "Ionosphere", "Exosphere"], answer: "Ozone layer", explanation: "The ozone layer absorbs most of the sun's harmful UV radiation, shielding life on Earth." },
      { q: "True or False: Soil formation is a very slow process that can take hundreds of years.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Soil forms gradually through the weathering of rocks over long periods of time." },
      { q: "Fill in the blank: The mixture of gases surrounding the Earth is called the ___.", type: "fill_blank", answer: "atmosphere", explanation: "The atmosphere is the layer of gases surrounding Earth, essential for supporting life." },
    ],
    medium: [
      { q: "Which process directly returns nitrogen from the atmosphere into a form plants can use?", options: ["Nitrogen fixation", "Respiration", "Photosynthesis", "Transpiration"], answer: "Nitrogen fixation", explanation: "Nitrogen fixation converts atmospheric nitrogen gas into compounds like ammonia that plants can absorb and use." },
      { q: "Which of these human activities most directly depletes the ozone layer?", options: ["Release of CFCs (chlorofluorocarbons)", "Planting trees", "Recycling paper", "Composting"], answer: "Release of CFCs (chlorofluorocarbons)", explanation: "CFCs, once common in refrigerants and aerosols, break down ozone molecules in the upper atmosphere." },
      { q: "Weathering of rocks that contributes to soil formation is caused mainly by:", options: ["Wind, water, and temperature changes", "Only earthquakes", "Only volcanic eruptions", "Only human activity"], answer: "Wind, water, and temperature changes", explanation: "Physical and chemical weathering by wind, water, and temperature changes gradually breaks rocks down into soil." },
      { q: "In the carbon cycle, which process removes carbon dioxide from the atmosphere?", options: ["Photosynthesis", "Respiration", "Combustion", "Decomposition"], answer: "Photosynthesis", explanation: "Photosynthesis removes CO2 from the atmosphere, using it to build organic molecules in plants." },
      { q: "Which of these is a major air pollutant released by burning fossil fuels?", options: ["Sulfur dioxide", "Oxygen", "Nitrogen gas", "Water vapor only"], answer: "Sulfur dioxide", explanation: "Burning fossil fuels releases sulfur dioxide, a major air pollutant linked to acid rain and respiratory issues." },
    ],
    hard: [
      { q: "Acid rain forms primarily when which pollutants react with atmospheric water vapor?", options: ["Sulfur dioxide and nitrogen oxides", "Oxygen and nitrogen", "Carbon dioxide and oxygen", "Ozone and hydrogen"], answer: "Sulfur dioxide and nitrogen oxides", explanation: "Sulfur dioxide and nitrogen oxides react with water vapor in the atmosphere to form sulfuric and nitric acids, causing acid rain." },
      { q: "Which of these best describes eutrophication in water bodies?", options: ["Excess nutrients causing algal overgrowth and oxygen depletion", "A natural cooling of water", "The formation of new water bodies", "The evaporation of all water"], answer: "Excess nutrients causing algal overgrowth and oxygen depletion", explanation: "Eutrophication occurs when excess nutrients (like from fertilizers) cause algal blooms that deplete oxygen as they decompose." },
      { q: "Humus, an important component of fertile soil, is formed from:", options: ["Decomposed organic matter", "Pure sand", "Melted rock", "Only minerals"], answer: "Decomposed organic matter", explanation: "Humus forms from the decomposition of dead plants and animals, enriching soil with nutrients." },
      { q: "Which of these is a renewable natural resource?", options: ["Solar energy", "Coal", "Petroleum", "Natural gas"], answer: "Solar energy", explanation: "Solar energy is continuously replenished by the sun, unlike fossil fuels which take millions of years to form." },
    ],
    expert: [
      { q: "The greenhouse effect becomes a concern for climate change mainly because of:", options: ["Excess greenhouse gases trapping more heat than natural levels", "The complete absence of greenhouse gases", "Too much oxygen in the atmosphere", "A thinning atmosphere"], answer: "Excess greenhouse gases trapping more heat than natural levels", explanation: "Human activities have increased greenhouse gas concentrations, trapping more heat and warming the planet beyond natural levels." },
      { q: "Which of these best explains why topsoil erosion is a serious environmental concern?", options: ["Topsoil holds most of the nutrients needed for plant growth", "Topsoil has no role in agriculture", "Only deeper soil layers support plants", "Erosion always improves soil fertility"], answer: "Topsoil holds most of the nutrients needed for plant growth", explanation: "Topsoil is the nutrient-rich layer essential for plant growth; losing it through erosion reduces agricultural productivity." },
      { q: "The Montreal Protocol is an international agreement primarily aimed at:", options: ["Phasing out ozone-depleting substances", "Reducing plastic use", "Managing water resources", "Protecting endangered species"], answer: "Phasing out ozone-depleting substances", explanation: "The Montreal Protocol (1987) is an international treaty to phase out the production of ozone-depleting substances like CFCs." },
      { q: "Which of these best describes the role of decomposers in a biogeochemical cycle?", options: ["Breaking down dead matter to release nutrients back into the ecosystem", "Producing oxygen through photosynthesis", "Consuming only living plants", "Fixing atmospheric nitrogen exclusively"], answer: "Breaking down dead matter to release nutrients back into the ecosystem", explanation: "Decomposers break down dead organic matter, recycling nutrients like carbon and nitrogen back into the ecosystem." },
    ],
  },
  "final-biology-biosphere": {
    easy: [
      { q: "Improving crop yield by growing high-yielding, disease-resistant varieties is called:", options: ["Crop variety improvement", "Crop rotation only", "Organic farming only", "Weeding"], answer: "Crop variety improvement", explanation: "Crop variety improvement uses selective breeding to develop varieties with higher yield, disease resistance, and better quality." },
      { q: "Which of these is an example of animal husbandry?", options: ["Poultry farming", "Mining", "Deforestation", "Fishing in the wild only"], answer: "Poultry farming", explanation: "Animal husbandry includes the scientific management and breeding of animals like poultry, cattle, and fish for human use." },
      { q: "Manures and fertilizers are added to soil mainly to:", options: ["Replenish nutrients for plant growth", "Kill weeds", "Prevent all diseases", "Change soil color"], answer: "Replenish nutrients for plant growth", explanation: "Manures and fertilizers restore nutrients like nitrogen, phosphorus, and potassium that crops remove from the soil." },
      { q: "True or False: Mixed farming means growing crops and raising livestock together on the same farm.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Mixed farming combines crop cultivation and animal husbandry on the same farm." },
    ],
    medium: [
      { q: "Organic manure differs from chemical fertilizers mainly in that organic manure:", options: ["Is derived from plant and animal waste and improves soil structure", "Contains no nutrients at all", "Works faster than fertilizers", "Cannot be used in farming"], answer: "Is derived from plant and animal waste and improves soil structure", explanation: "Organic manure comes from decomposed plant and animal matter and improves soil texture and water-holding capacity, unlike synthetic fertilizers." },
      { q: "Numerical: If the mean crop yield across 5 sample plots is 40 quintals, what is the total yield of all 5 plots combined?", type: "numerical", answer: "200", explanation: "Total = mean \u00d7 number of values = 40 \u00d7 5 = 200 quintals." },
      { q: "Poultry farming primarily aims to produce:", options: ["Eggs and meat", "Wool only", "Milk only", "Honey"], answer: "Eggs and meat", explanation: "Poultry farming raises birds like chickens mainly for egg and meat production." },
      { q: "Bee-keeping (apiculture) is primarily practiced to obtain:", options: ["Honey and wax", "Milk", "Eggs", "Wool"], answer: "Honey and wax", explanation: "Apiculture is the practice of maintaining bee colonies mainly to harvest honey and beeswax." },
    ],
    hard: [
      { q: "Which of these methods directly helps increase a crop variety's resistance to pests?", options: ["Breeding for pest-resistant traits", "Adding more water only", "Reducing sunlight exposure", "Removing all fertilizers"], answer: "Breeding for pest-resistant traits", explanation: "Selective breeding for pest resistance produces crop varieties that survive better against common pests, reducing crop loss." },
      { q: "In fisheries, \"aquaculture\" specifically refers to:", options: ["The farming of fish and other aquatic organisms in controlled conditions", "Fishing only in open oceans", "Growing only land crops near water", "Water purification methods"], answer: "The farming of fish and other aquatic organisms in controlled conditions", explanation: "Aquaculture involves raising fish, prawns, and other aquatic species in ponds, tanks, or enclosures rather than catching them wild." },
      { q: "Excessive use of chemical fertilizers over time can lead to:", options: ["Soil degradation and water pollution", "Permanently better soil quality", "No effect on the environment", "Instant increase in soil biodiversity"], answer: "Soil degradation and water pollution", explanation: "Overuse of chemical fertilizers can degrade soil health, and runoff can pollute nearby water bodies." },
      { q: "Which of these best distinguishes a \"high-yielding variety\" (HYV) of a crop from a traditional variety?", options: ["HYVs are specifically bred to produce more yield per unit area", "HYVs never need water", "HYVs require no care at all", "There is no real difference"], answer: "HYVs are specifically bred to produce more yield per unit area", explanation: "High-yielding varieties are developed through breeding to maximize output per unit area, often needing specific care to reach their potential." },
    ],
    expert: [
      { q: "Which of these is the primary reason cross-breeding is used in animal husbandry?", options: ["To combine desirable traits from two different breeds", "To make animals identical genetically", "To eliminate all genetic variation", "To reduce milk or meat yield"], answer: "To combine desirable traits from two different breeds", explanation: "Cross-breeding combines desirable traits \u2014 like high milk yield and disease resistance \u2014 from two different breeds." },
      { q: "Biofertilizers, unlike chemical fertilizers, primarily work by:", options: ["Using living organisms to naturally enrich soil nutrients", "Instantly killing all soil organisms", "Replacing water entirely", "Preventing plant growth"], answer: "Using living organisms to naturally enrich soil nutrients", explanation: "Biofertilizers contain living microorganisms, like nitrogen-fixing bacteria, that naturally improve soil fertility." },
      { q: "Numerical: A farm's crop yield increased from 50 quintals to 65 quintals after using an improved variety. What is the percentage increase?", type: "numerical", answer: "30", explanation: "Percentage increase = (65 \u2212 50)/50 \u00d7 100 = 30%." },
      { q: "Integrated Pest Management (IPM) is favored over sole reliance on chemical pesticides mainly because IPM:", options: ["Combines multiple methods to control pests while minimizing chemical use", "Uses only one chemical repeatedly", "Eliminates the need for any pest control", "Only works on animals, not crops"], answer: "Combines multiple methods to control pests while minimizing chemical use", explanation: "IPM combines biological, physical, and minimal chemical methods to control pests sustainably, reducing environmental harm." },
    ],
  },

  // --- Hindi ---------------------------------------------------------------
  "vyakaran-vatika": {
    easy: [
      { q: "\"\u0932\u0921\u093c\u0915\u093e\" \u0936\u092c\u094d\u0926 \u0915\u093f\u0938 \u092a\u094d\u0930\u0915\u093e\u0930 \u0915\u0940 \u0938\u0902\u091c\u094d\u091e\u093e \u0939\u0948?", options: ["\u091c\u093e\u0924\u093f\u0935\u093e\u091a\u0915", "\u0935\u094d\u092f\u0915\u094d\u0924\u093f\u0935\u093e\u091a\u0915", "\u092d\u093e\u0935\u0935\u093e\u091a\u0915", "\u0938\u092e\u0942\u0939\u0935\u093e\u091a\u0915"], answer: "\u091c\u093e\u0924\u093f\u0935\u093e\u091a\u0915", explanation: "\"\u0932\u0921\u093c\u0915\u093e\" \u090f\u0915 \u0938\u092e\u093e\u0928 \u0935\u0930\u094d\u0917 \u0915\u0940 \u0938\u092d\u0940 \u0935\u0938\u094d\u0924\u0941\u0913\u0902 \u0915\u093e \u092c\u094b\u0927 \u0915\u0930\u093e\u0924\u093e \u0939\u0948, \u0907\u0938\u0932\u093f\u090f \u092f\u0939 \u091c\u093e\u0924\u093f\u0935\u093e\u091a\u0915 \u0938\u0902\u091c\u094d\u091e\u093e \u0939\u0948\u0964" },
      { q: "\"\u0935\u0939\", \"\u0924\u0942\", \"\u092e\u0948\u0902\" \u0915\u094c\u0928 \u0938\u0940 \u0936\u092c\u094d\u0926-\u0936\u094d\u0930\u0947\u0923\u0940 \u0939\u0948\u0902?", options: ["\u0938\u0902\u091c\u094d\u091e\u093e", "\u0938\u0930\u094d\u0935\u0928\u093e\u092e", "\u0935\u093f\u0936\u0947\u0937\u0923", "\u0915\u094d\u0930\u093f\u092f\u093e"], answer: "\u0938\u0930\u094d\u0935\u0928\u093e\u092e", explanation: "\u0938\u0902\u091c\u094d\u091e\u093e \u0915\u0947 \u0938\u094d\u0925\u093e\u0928 \u092a\u0930 \u092a\u094d\u0930\u092f\u0941\u0915\u094d\u0924 \u0939\u094b\u0928\u0947 \u0935\u093e\u0932\u0947 \u0936\u092c\u094d\u0926 \u0938\u0930\u094d\u0935\u0928\u093e\u092e \u0915\u0939\u0932\u093e\u0924\u0947 \u0939\u0948\u0902\u0964" },
      { q: "\"\u0938\u0941\u0902\u0926\u0930\" \u0936\u092c\u094d\u0926 \u0915\u093f\u0938 \u0935\u093f\u0932\u094b\u092e (\u0938\u0939\u0940/\u0917\u0932\u0924) \u0939\u0948, \u092f\u0939 \u092c\u0924\u093e\u090f\u0902 \u0915\u093f \u0907\u0938\u0947 \u0915\u094d\u092f\u093e \u0915\u0939\u093e \u091c\u093e\u0924\u093e \u0939\u0948?", options: ["\u0938\u0902\u091c\u094d\u091e\u093e", "\u0935\u093f\u0936\u0947\u0937\u0923", "\u0915\u094d\u0930\u093f\u092f\u093e", "\u0938\u0930\u094d\u0935\u0928\u093e\u092e"], answer: "\u0935\u093f\u0936\u0947\u0937\u0923", explanation: "\"\u0938\u0941\u0902\u0926\u0930\" \u0938\u0902\u091c\u094d\u091e\u093e \u0915\u0940 \u0935\u093f\u0936\u0947\u0937\u0924\u093e \u092c\u0924\u093e\u0924\u093e \u0939\u0948, \u0907\u0938\u0932\u093f\u090f \u092f\u0939 \u0935\u093f\u0936\u0947\u0937\u0923 \u0939\u0948\u0964" },
      { q: "True or False: \u201c\u0916\u093e\u0928\u093e\u201d \u090f\u0915 \u0915\u094d\u0930\u093f\u092f\u093e \u0936\u092c\u094d\u0926 \u0939\u0948\u0964", type: "true_false", options: ["True", "False"], answer: "True", explanation: "\"\u0916\u093e\u0928\u093e\" \u0915\u093f\u0938\u0940 \u0915\u093e\u0930\u094d\u092f \u0915\u0947 \u0939\u094b\u0928\u0947 \u092f\u093e \u0915\u093f\u090f \u091c\u093e\u0928\u0947 \u0915\u093e \u092c\u094b\u0927 \u0915\u0930\u093e\u0924\u0940 \u0939\u0948, \u0907\u0938\u0932\u093f\u090f \u092f\u0939 \u0915\u094d\u0930\u093f\u092f\u093e \u0939\u0948\u0964" },
      { q: "\u0930\u093f\u0915\u094d\u0924 \u0938\u094d\u0925\u093e\u0928 \u092d\u0930\u0947\u0902: \"\u0930\u093e\u092e ___ \u091c\u093e\u0924\u093e \u0939\u0948\u0964\" (\u0915\u094d\u0930\u093f\u092f\u093e)", type: "fill_blank", answer: "\u0938\u094d\u0915\u0942\u0932", explanation: "\u092f\u0939\u093e\u0902 \u0915\u094b\u0908 \u092d\u0940 \u0938\u094d\u0925\u093e\u0928-\u0938\u0942\u091a\u0915 \u0936\u092c\u094d\u0926 \u0938\u094d\u0935\u0940\u0915\u093e\u0930\u094d\u092f \u0939\u0948; \u091c\u0948\u0938\u0947 \u201c\u0938\u094d\u0915\u0942\u0932\u201d, \u091c\u094b \u0935\u093e\u0915\u094d\u092f \u0915\u094b \u092a\u0942\u0930\u093e \u0915\u0930\u0924\u093e \u0939\u0948\u0964" },
    ],
    medium: [
      { q: "\"\u0935\u0939 \u0926\u094c\u0921\u093c \u0930\u0939\u093e \u0939\u0948\u0964\" \u0907\u0938 \u0935\u093e\u0915\u094d\u092f \u092e\u0947\u0902 \u0915\u094d\u0930\u093f\u092f\u093e \u0915\u093e \u0915\u093e\u0932 \u0915\u094c\u0928 \u0938\u093e \u0939\u0948?", options: ["\u0935\u0930\u094d\u0924\u092e\u093e\u0928 \u0915\u093e\u0932", "\u092d\u0942\u0924\u0915\u093e\u0932", "\u092d\u0935\u093f\u0937\u094d\u092f\u0915\u093e\u0932", "\u0905\u0938\u092e\u093e\u092a\u0940\u0924"], answer: "\u0935\u0930\u094d\u0924\u092e\u093e\u0928 \u0915\u093e\u0932", explanation: "\"\u0926\u094c\u0921\u093c \u0930\u0939\u093e \u0939\u0948\" \u0938\u0947 \u092a\u0924\u093e \u091a\u0932\u0924\u093e \u0939\u0948 \u0915\u093f \u0915\u093e\u0930\u094d\u092f \u0905\u092d\u0940 \u0939\u094b \u0930\u0939\u093e \u0939\u0948, \u092f\u0939 \u0935\u0930\u094d\u0924\u092e\u093e\u0928 \u0915\u093e\u0932 \u0939\u0948\u0964" },
      { q: "\u0928\u093f\u092e\u094d\u0928\u0932\u093f\u0916\u093f\u0924 \u092e\u0947\u0902 \u0938\u0947 \u0938\u0930\u094d\u0935\u0928\u093e\u092e \u0915\u094c\u0928-\u0938\u093e \u0939\u0948: \u0930\u093e\u092e, \u0935\u0939, \u092e\u0947\u0930\u093e, \u0938\u0941\u0902\u0926\u0930\u0964", options: ["\u0930\u093e\u092e", "\u0935\u0939", "\u092e\u0947\u0930\u093e", "\u0938\u0941\u0902\u0926\u0930"], answer: "\u0935\u0939", explanation: "\"\u0935\u0939\" \u0938\u0902\u091c\u094d\u091e\u093e \u0915\u0947 \u0938\u094d\u0925\u093e\u0928 \u092a\u0930 \u092a\u094d\u0930\u092f\u0941\u0915\u094d\u0924 \u0939\u094b\u0924\u093e \u0939\u0948, \u092c\u093e\u0915\u0940 \u0938\u092c \u0938\u0902\u091c\u094d\u091e\u093e \u092f\u093e \u0935\u093f\u0936\u0947\u0937\u0923 \u0939\u0948\u0902\u0964" },
      { q: "\"\u0935\u0939 \u092c\u093e\u091c\u093e\u0930 \u091c\u093e\u090f\u0917\u093e\u0964\" \u2014 \u092f\u0939\u093e\u0902 \u0915\u094d\u0930\u093f\u092f\u093e \u0915\u093e \u0915\u093e\u0932 \u092c\u0924\u093e\u090f\u0902\u0964", options: ["\u092d\u0942\u0924\u0915\u093e\u0932", "\u0935\u0930\u094d\u0924\u092e\u093e\u0928 \u0915\u093e\u0932", "\u092d\u0935\u093f\u0937\u094d\u092f\u0915\u093e\u0932", "\u0905\u0938\u092e\u093e\u092a\u0940\u0924"], answer: "\u092d\u0935\u093f\u0937\u094d\u092f\u0915\u093e\u0932", explanation: "\"-\u0917\u093e\" \u092a\u094d\u0930\u0924\u094d\u092f\u092f \u092d\u0935\u093f\u0937\u094d\u092f \u092e\u0947\u0902 \u0939\u094b\u0928\u0947 \u0935\u093e\u0932\u0940 \u0915\u094d\u0930\u093f\u092f\u093e \u0915\u094b \u0926\u0930\u094d\u0936\u093e\u0924\u093e \u0939\u0948\u0964" },
      { q: "\"\u0935\u0939 \u0938\u0941\u0902\u0926\u0930 \u0932\u0921\u093c\u0915\u0940 \u0939\u0948\u0964\" \u0907\u0938 \u0935\u093e\u0915\u094d\u092f \u092e\u0947\u0902 \u0935\u093f\u0936\u0947\u0937\u0923 \u0915\u094c\u0928-\u0938\u093e \u0936\u092c\u094d\u0926 \u0939\u0948?", options: ["\u0935\u0939", "\u0938\u0941\u0902\u0926\u0930", "\u0932\u0921\u093c\u0915\u0940", "\u0939\u0948"], answer: "\u0938\u0941\u0902\u0926\u0930", explanation: "\"\u0938\u0941\u0902\u0926\u0930\" \u0936\u092c\u094d\u0926 \"\u0932\u0921\u093c\u0915\u0940\" (\u0938\u0902\u091c\u094d\u091e\u093e) \u0915\u0940 \u0935\u093f\u0936\u0947\u0937\u0924\u093e \u092c\u0924\u093e \u0930\u0939\u093e \u0939\u0948\u0964" },
      { q: "\u0928\u093f\u092e\u094d\u0928\u0932\u093f\u0916\u093f\u0924 \u092e\u0947\u0902 \u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u0935\u093e\u0915\u094d\u092f \u0915\u094c\u0928-\u0938\u093e \u0939\u0948: \u0935\u0939 \u0906\u092f\u093e \u0914\u0930 \u0938\u094b \u0917\u092f\u093e\u0964", options: ["\u0938\u0930\u0932 \u0935\u093e\u0915\u094d\u092f", "\u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u0935\u093e\u0915\u094d\u092f", "\u092e\u093f\u0936\u094d\u0930 \u0935\u093e\u0915\u094d\u092f", "\u0915\u094b\u0908 \u0928\u0939\u0940\u0902"], answer: "\u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u0935\u093e\u0915\u094d\u092f", explanation: "\u0926\u094b \u0938\u094d\u0935\u0924\u0902\u0924\u094d\u0930 \u0938\u0930\u0932 \u0935\u093e\u0915\u094d\u092f \u0938\u092e\u0941\u091a\u094d\u091a\u092f\u092c\u094b\u0927\u0915 \u0905\u0935\u094d\u092f\u092f \u091c\u0948\u0938\u0947 \u201c\u0914\u0930\u201d \u0938\u0947 \u091c\u0941\u0921\u093c\u0947 \u0939\u0948\u0902, \u0907\u0938\u0932\u093f\u090f \u092f\u0939 \u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u0935\u093e\u0915\u094d\u092f \u0939\u0948\u0964" },
    ],
    hard: [
      { q: "\"\u091c\u092c \u092e\u0948\u0902\u0928\u0947 \u092a\u0939\u0941\u0902\u091a\u093e, \u0924\u092c \u0924\u0915 \u0935\u0939 \u091c\u093e \u091a\u0941\u0915\u093e \u0925\u093e\u0964\" \u092f\u0939 \u0915\u093f\u0938 \u092a\u094d\u0930\u0915\u093e\u0930 \u0915\u093e \u0935\u093e\u0915\u094d\u092f \u0939\u0948?", options: ["\u0938\u0930\u0932 \u0935\u093e\u0915\u094d\u092f", "\u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u0935\u093e\u0915\u094d\u092f", "\u092e\u093f\u0936\u094d\u0930 \u0935\u093e\u0915\u094d\u092f", "\u0906\u091c\u094d\u091e\u093e\u0938\u0942\u091a\u0915 \u0935\u093e\u0915\u094d\u092f"], answer: "\u092e\u093f\u0936\u094d\u0930 \u0935\u093e\u0915\u094d\u092f", explanation: "\u092e\u093f\u0936\u094d\u0930 \u0935\u093e\u0915\u094d\u092f \u092e\u0947\u0902 \u090f\u0915 \u092a\u094d\u0930\u092e\u0941\u0916 \u0914\u0930 \u090f\u0915 \u092f\u093e \u0905\u0927\u093f\u0915 \u0906\u0936\u094d\u0930\u093f\u0924 \u0909\u092a\u0935\u093e\u0915\u094d\u092f \u0939\u094b\u0924\u0947 \u0939\u0948\u0902; \u092f\u0939\u093e\u0902 \"\u091c\u092c...\u0924\u092c\" \u0906\u0936\u094d\u0930\u093f\u0924 \u0909\u092a\u0935\u093e\u0915\u094d\u092f \u0939\u0948\u0964" },
      { q: "\"\u0935\u0939 \u0928 \u0915\u0947\u0935\u0932 \u092a\u0922\u093c\u0924\u093e \u0939\u0948 \u092c\u0932\u094d\u0915\u093f \u0916\u0947\u0932\u0924\u093e \u092d\u0940 \u0939\u0948\u0964\" \u0907\u0938\u092e\u0947\u0902 \u0915\u094c\u0928-\u0938\u093e \u0905\u0935\u094d\u092f\u092f \u092a\u094d\u0930\u092f\u0941\u0915\u094d\u0924 \u0939\u0941\u0906 \u0939\u0948?", options: ["\u0914\u0930", "\u092c\u0932\u094d\u0915\u093f", "\u092d\u0940", "\u0915\u094b\u0908 \u0928\u0939\u0940\u0902"], answer: "\u092c\u0932\u094d\u0915\u093f", explanation: "\"\u0928...\u092c\u0932\u094d\u0915\u093f\" \u0935\u093f\u092a\u0930\u0940\u0924\u093e\u0930\u094d\u0925\u0915 \u0938\u092e\u0941\u091a\u094d\u091a\u092f\u092c\u094b\u0927\u0915 \u0905\u0935\u094d\u092f\u092f \u0915\u093e \u0915\u093e\u092e \u0915\u0930\u0924\u093e \u0939\u0948\u0964" },
      { q: "\"\u0909\u0938\u0928\u0947 \u0916\u093e\u0928\u093e \u0916\u093e\u092f\u093e\u0964\" \u2014 \u0907\u0938 \u0935\u093e\u0915\u094d\u092f \u092e\u0947\u0902 \u0915\u094d\u0930\u093f\u092f\u093e \u0915\u093e \u0915\u094c\u0928-\u0938\u093e \u0930\u0942\u092a \u0939\u0948?", options: ["\u092a\u094d\u0930\u0947\u0930\u0923\u093e\u0930\u094d\u0925\u0915 \u0915\u094d\u0930\u093f\u092f\u093e", "\u0938\u0915\u0930\u094d\u092e\u0915 \u0915\u094d\u0930\u093f\u092f\u093e", "\u0905\u0915\u0930\u094d\u092e\u0915 \u0915\u094d\u0930\u093f\u092f\u093e", "\u0938\u0939\u093e\u092f\u0915 \u0915\u094d\u0930\u093f\u092f\u093e"], answer: "\u092a\u094d\u0930\u0947\u0930\u0923\u093e\u0930\u094d\u0925\u0915 \u0915\u094d\u0930\u093f\u092f\u093e", explanation: "\u092f\u0939\u093e\u0902 \u0915\u0930\u094d\u0924\u093e \u0938\u094d\u0935\u092f\u0902 \u0915\u093e\u092e \u0928 \u0915\u0930\u0915\u0947 \u0926\u0942\u0938\u0930\u094b\u0902 \u0938\u0947 \u0915\u0930\u0935\u093e \u0930\u0939\u093e \u0939\u0948, \u0907\u0938\u0932\u093f\u090f \u092f\u0939 \u092a\u094d\u0930\u0947\u0930\u0923\u093e\u0930\u094d\u0925\u0915 \u0915\u094d\u0930\u093f\u092f\u093e \u0939\u0948\u0964" },
      { q: "\"\u0938\u0941\u0902\u0926\u0930\u0924\u093e\" \u0936\u092c\u094d\u0926 \"\u0938\u0941\u0902\u0926\u0930\" \u0938\u0947 \u0915\u093f\u0938 \u092a\u094d\u0930\u0915\u094d\u0930\u093f\u092f\u093e \u0938\u0947 \u092c\u0928\u093e \u0939\u0948?", options: ["\u092a\u094d\u0930\u0924\u094d\u092f\u092f (\u0938\u0941\u092b\u093c\u093c\u093f\u0915\u094d\u0938) \u0932\u0917\u093e\u0915\u0930", "\u0909\u092a\u0938\u0930\u094d\u0917 \u0932\u0917\u093e\u0915\u0930", "\u0938\u092e\u093e\u0938 \u092c\u0928\u093e\u0915\u0930", "\u0938\u0902\u0927\u093f \u0932\u0917\u093e\u0915\u0930"], answer: "\u092a\u094d\u0930\u0924\u094d\u092f\u092f (\u0938\u0941\u092b\u093c\u093c\u093f\u0915\u094d\u0938) \u0932\u0917\u093e\u0915\u0930", explanation: "\"-\u0924\u093e\" \u092a\u094d\u0930\u0924\u094d\u092f\u092f \u091c\u094b\u0921\u093c\u0915\u0930 \u0935\u093f\u0936\u0947\u0937\u0923 \u0938\u0947 \u092d\u093e\u0935\u0935\u093e\u091a\u0915 \u0938\u0902\u091c\u094d\u091e\u093e \u092c\u0928\u093e\u0908 \u091c\u093e\u0924\u0940 \u0939\u0948\u0964" },
    ],
    expert: [
      { q: "\"\u0930\u093e\u092e\u093e\u092f\u0923\" \u0936\u092c\u094d\u0926 \u092e\u0947\u0902 \u0915\u094c\u0928-\u0938\u0940 \u0938\u0902\u091c\u094d\u091e\u093e \u0939\u0948?", options: ["\u0935\u094d\u092f\u0915\u094d\u0924\u093f\u0935\u093e\u091a\u0915 \u0938\u0902\u091c\u094d\u091e\u093e", "\u091c\u093e\u0924\u093f\u0935\u093e\u091a\u0915 \u0938\u0902\u091c\u094d\u091e\u093e", "\u092d\u093e\u0935\u0935\u093e\u091a\u0915 \u0938\u0902\u091c\u094d\u091e\u093e", "\u0938\u092e\u0942\u0939\u0935\u093e\u091a\u0915 \u0938\u0902\u091c\u094d\u091e\u093e"], answer: "\u0935\u094d\u092f\u0915\u094d\u0924\u093f\u0935\u093e\u091a\u0915 \u0938\u0902\u091c\u094d\u091e\u093e", explanation: "\u092f\u0939 \u090f\u0915 \u0935\u093f\u0936\u093f\u0937\u094d\u091f \u0917\u094d\u0930\u0902\u0925 (\u0935\u094d\u092f\u0915\u094d\u0924\u093f/\u0935\u0938\u094d\u0924\u0941) \u0915\u093e \u0928\u093e\u092e \u0939\u0948, \u0907\u0938\u0932\u093f\u090f \u092f\u0939 \u0935\u094d\u092f\u0915\u094d\u0924\u093f\u0935\u093e\u091a\u0915 \u0938\u0902\u091c\u094d\u091e\u093e \u0939\u0948\u0964" },
      { q: "\"\u0935\u0939 \u0906\u0924\u093e \u0924\u094b \u0939\u0948 \u092a\u0930 \u0930\u0941\u0915\u0924\u093e \u0928\u0939\u0940\u0902\u0964\" \u2014 \u0907\u0938\u092e\u0947\u0902 \u0915\u094d\u0930\u093f\u092f\u093e \u0915\u093e \u0915\u094c\u0928-\u0938\u093e \u092d\u0947\u0926 \u0939\u0948?", options: ["\u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u0915\u094d\u0930\u093f\u092f\u093e", "\u0938\u0915\u0930\u094d\u092e\u0915 \u0915\u094d\u0930\u093f\u092f\u093e", "\u092a\u094d\u0930\u0947\u0930\u0923\u093e\u0930\u094d\u0925\u0915 \u0915\u094d\u0930\u093f\u092f\u093e", "\u0905\u0915\u0930\u094d\u092e\u0915 \u0915\u094d\u0930\u093f\u092f\u093e"], answer: "\u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u0915\u094d\u0930\u093f\u092f\u093e", explanation: "\"\u0906\u0924\u093e \u0939\u0948\" \u0914\u0930 \"\u0930\u0941\u0915\u0924\u093e\" \u2014 \u0926\u094b \u0915\u094d\u0930\u093f\u092f\u093e\u090f\u0902 \u092e\u093f\u0932\u0915\u0930 \u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u0915\u094d\u0930\u093f\u092f\u093e \u092c\u0928\u093e\u0924\u0940 \u0939\u0948\u0902\u0964" },
      { q: "\u0928\u093f\u092e\u094d\u0928\u0932\u093f\u0916\u093f\u0924 \u092e\u0947\u0902 \u0938\u0947 \u0915\u093f\u0938 \u0936\u092c\u094d\u0926 \u092e\u0947\u0902 \u0909\u092a\u0938\u0930\u094d\u0917 \u0939\u0948: \u0938\u0941\u092a\u0941\u0924\u094d\u0930, \u0905\u0928\u0941\u091a\u093f\u0924, \u092a\u094d\u0930\u092d\u0941, \u0915\u0932\u092e\u0964", options: ["\u0938\u0941\u092a\u0941\u0924\u094d\u0930", "\u0905\u0928\u0941\u091a\u093f\u0924", "\u092a\u094d\u0930\u092d\u0941", "\u0915\u0932\u092e"], answer: "\u0938\u0941\u092a\u0941\u0924\u094d\u0930", explanation: "\"\u0938\u0941-\" \u090f\u0915 \u0909\u092a\u0938\u0930\u094d\u0917 \u0939\u0948 \u091c\u094b \"\u0905\u091a\u094d\u091b\u093e\" \u0905\u0930\u094d\u0925 \u091c\u094b\u0921\u093c\u0924\u093e \u0939\u0948 (\u0938\u0941 + \u092a\u0941\u0924\u094d\u0930)\u0964" },
    ],
  },
  "shabd-sagar": {
    easy: [
      { q: "\"\u0916\u0941\u0936\u0940\" \u0936\u092c\u094d\u0926 \u0915\u093e \u092a\u0930\u094d\u092f\u093e\u092f\u0935\u093e\u091a\u0940 \u0936\u092c\u094d\u0926 \u0915\u094c\u0928-\u0938\u093e \u0939\u0948?", options: ["\u0906\u0928\u0902\u0926", "\u0926\u0941\u0916", "\u0915\u094d\u0930\u094b\u0927", "\u0921\u0930"], answer: "\u0906\u0928\u0902\u0926", explanation: "\"\u0906\u0928\u0902\u0926\" \u0914\u0930 \"\u0916\u0941\u0936\u0940\" \u0926\u094b\u0928\u094b\u0902 \u0915\u093e \u0905\u0930\u094d\u0925 \u0938\u092e\u093e\u0928 \u0939\u0948\u0964" },
      { q: "\"\u0930\u093e\u0924\" \u0936\u092c\u094d\u0926 \u0915\u093e \u0935\u093f\u0932\u094b\u092e \u0936\u092c\u094d\u0926 \u0915\u094d\u092f\u093e \u0939\u0948?", options: ["\u0926\u093f\u0928", "\u0938\u0902\u0927\u094d\u092f\u093e", "\u0938\u0941\u092c\u0939", "\u0936\u093e\u092e"], answer: "\u0926\u093f\u0928", explanation: "\"\u0926\u093f\u0928\" \u0914\u0930 \"\u0930\u093e\u0924\" \u0935\u093f\u092a\u0930\u0940\u0924\u093e\u0930\u094d\u0925\u0915 \u0936\u092c\u094d\u0926 \u0939\u0948\u0902\u0964" },
      { q: "\"\u0928\u093e\u0915 \u0915\u091f \u091c\u093e\u0928\u093e\" \u092e\u0941\u0939\u093e\u0935\u0930\u0947 \u0915\u093e \u0905\u0930\u094d\u0925 \u0915\u094d\u092f\u093e \u0939\u0948?", options: ["\u0905\u092a\u092e\u093e\u0928\u093f\u0924 \u0939\u094b\u0928\u093e", "\u092c\u0939\u0941\u0924 \u0916\u0941\u0936 \u0939\u094b\u0928\u093e", "\u092c\u0940\u092e\u093e\u0930 \u092a\u0921\u093c\u0928\u093e", "\u0938\u094b \u091c\u093e\u0928\u093e"], answer: "\u0905\u092a\u092e\u093e\u0928\u093f\u0924 \u0939\u094b\u0928\u093e", explanation: "\"\u0928\u093e\u0915 \u0915\u091f\u0928\u093e\" \u0915\u093e \u092a\u094d\u0930\u091a\u0932\u093f\u0924 \u0905\u0930\u094d\u0925 \u0939\u0948 \u2014 \u0905\u092a\u092e\u093e\u0928\u093f\u0924 \u0939\u094b\u0928\u093e\u0964" },
      { q: "True or False: \u201c\u0906\u0938\u092e\u093e\u0928-\u0906\u0938\u092e\u093e\u0928\u201d \u0938\u092e\u093e\u0928\u093e\u0930\u094d\u0925\u0940 \u0936\u092c\u094d\u0926\u094b\u0902 \u0915\u093e \u090f\u0915 \u0909\u0926\u093e\u0939\u0930\u0923 \u0939\u0948\u0964", type: "true_false", options: ["True", "False"], answer: "True", explanation: "\"\u0906\u0938\u093e\u0928\" \u0914\u0930 \"\u0938\u0930\u0932\" \u0926\u094b\u0928\u094b\u0902 \u0915\u093e \u0905\u0930\u094d\u0925 \u0938\u092e\u093e\u0928 \u0939\u0948\u0964" },
      { q: "\u0930\u093f\u0915\u094d\u0924 \u0938\u094d\u0925\u093e\u0928 \u092d\u0930\u0947\u0902: \"\u0905\u0902\u0927\u0947\u0930\u0947\" \u0915\u093e \u0935\u093f\u0932\u094b\u092e \u0936\u092c\u094d\u0926 ___ \u0939\u0948\u0964", type: "fill_blank", answer: "\u0909\u091c\u093f\u092f\u093e\u0932\u093e", explanation: "\"\u0905\u0902\u0927\u0947\u0930\u093e\" \u0914\u0930 \"\u0909\u091c\u093f\u092f\u093e\u0932\u093e\" \u090f\u0915-\u0926\u0942\u0938\u0930\u0947 \u0915\u0947 \u0935\u093f\u092a\u0930\u0940\u0924 \u0939\u0948\u0902\u0964" },
    ],
    medium: [
      { q: "\"\u0905\u0902\u0927\u0947\u0930\u0947 \u092e\u0947\u0902 \u0924\u0940\u0930 \u092e\u093e\u0930\u0928\u093e\" \u092e\u0941\u0939\u093e\u0935\u0930\u0947 \u0915\u093e \u0905\u0930\u094d\u0925 \u0939\u0948:", options: ["\u092c\u093f\u0928\u093e \u0938\u094b\u091a\u0947-\u0938\u092e\u091d\u0947 \u0915\u093e\u092e \u0915\u0930\u0928\u093e", "\u0938\u094b\u091a-\u0938\u092e\u091d\u0915\u0930 \u0915\u093e\u092e \u0915\u0930\u0928\u093e", "\u0930\u094b\u0936\u0928\u0940 \u0915\u0930\u0928\u093e", "\u0906\u0930\u093e\u092e \u0915\u0930\u0928\u093e"], answer: "\u092c\u093f\u0928\u093e \u0938\u094b\u091a\u0947-\u0938\u092e\u091d\u0947 \u0915\u093e\u092e \u0915\u0930\u0928\u093e", explanation: "\u092f\u0939 \u092e\u0941\u0939\u093e\u0935\u0930\u093e \u0905\u0902\u0926\u093e\u091c\u0947 \u0938\u0947 \u0915\u093f\u092f\u093e \u0917\u092f\u093e \u0915\u093e\u0930\u094d\u092f \u092c\u0924\u093e\u0924\u093e \u0939\u0948\u0964" },
      { q: "\u0928\u093f\u092e\u094d\u0928\u0932\u093f\u0916\u093f\u0924 \u092e\u0947\u0902 \u0938\u0947 \u0915\u094c\u0928-\u0938\u093e \u091c\u094b\u0921\u093c\u093e \u0935\u093f\u0932\u094b\u092e\u093e\u0930\u094d\u0925\u0940 \u0936\u092c\u094d\u0926\u094b\u0902 \u0915\u093e \u0928\u0939\u0940\u0902 \u0939\u0948?", options: ["\u091c\u0940\u0924-\u0939\u093e\u0930", "\u0930\u093e\u0924-\u0926\u093f\u0928", "\u0938\u0941\u0916-\u0926\u0941\u0916", "\u0916\u0941\u0936\u0940-\u0906\u0928\u0902\u0926"], answer: "\u0916\u0941\u0936\u0940-\u0906\u0928\u0902\u0926", explanation: "\"\u0916\u0941\u0936\u0940\" \u0914\u0930 \"\u0906\u0928\u0902\u0926\" \u092a\u0930\u094d\u092f\u093e\u092f\u0935\u093e\u091a\u0940 \u0939\u0948\u0902, \u0935\u093f\u0932\u094b\u092e \u0928\u0939\u0940\u0902\u0964" },
      { q: "\"\u091c\u0932\" \u0936\u092c\u094d\u0926 \u0915\u093e \u090f\u0915 \u092a\u0930\u094d\u092f\u093e\u092f\u0935\u093e\u091a\u0940 \u0936\u092c\u094d\u0926 \u0939\u0948:", options: ["\u092a\u093e\u0928\u0940", "\u0906\u0917", "\u0939\u0935\u093e", "\u092e\u093f\u091f\u094d\u091f\u0940"], answer: "\u092a\u093e\u0928\u0940", explanation: "\"\u091c\u0932\" \u0914\u0930 \"\u092a\u093e\u0928\u0940\" \u0926\u094b\u0928\u094b\u0902 \u0915\u093e \u0905\u0930\u094d\u0925 \u090f\u0915 \u0939\u0940 \u0939\u0948\u0964" },
      { q: "\"\u0905\u0928\u094d\u0928\" \u0914\u0930 \"\u0905\u0928\u094d\u092f\" \u0938\u0941\u0928\u0928\u0947 \u092e\u0947\u0902 \u090f\u0915 \u091c\u0948\u0938\u0947 \u092a\u0930 \u0905\u0930\u094d\u0925 \u092e\u0947\u0902 \u0905\u0932\u0917 \u0939\u0948\u0902; \u0907\u0928\u094d\u0939\u0947\u0902 \u0915\u094d\u092f\u093e \u0915\u0939\u0924\u0947 \u0939\u0948\u0902?", options: ["\u0905\u0928\u0947\u0915\u093e\u0930\u094d\u0925\u0940 \u0936\u092c\u094d\u0926", "\u092a\u0930\u094d\u092f\u093e\u092f\u0935\u093e\u091a\u0940 \u0936\u092c\u094d\u0926", "\u0935\u093f\u0932\u094b\u092e \u0936\u092c\u094d\u0926", "\u0938\u092e\u0942\u0939\u0935\u093e\u091a\u0915 \u0936\u092c\u094d\u0926"], answer: "\u0905\u0928\u0947\u0915\u093e\u0930\u094d\u0925\u0940 \u0936\u092c\u094d\u0926", explanation: "\u0905\u0928\u0947\u0915\u093e\u0930\u094d\u0925\u0940 \u0936\u092c\u094d\u0926 \u0938\u092e\u093e\u0928 \u0909\u091a\u094d\u091a\u093e\u0930\u0923 \u0915\u0947 \u092c\u093e\u0935\u091c\u0942\u0926 \u0905\u0932\u0917-\u0905\u0932\u0917 \u0905\u0930\u094d\u0925\u094b\u0902 \u0935\u093e\u0932\u0947 \u0939\u094b\u0924\u0947 \u0939\u0948\u0902\u0964" },
      { q: "\"\u0938\u0941\u0902\u0926\u0930\" \u0936\u092c\u094d\u0926 \u092e\u0947\u0902 \"\u0938\u0941\" \u0909\u092a\u0938\u0930\u094d\u0917 \u091c\u094b\u0921\u093c\u0915\u0930 \u0915\u094c\u0928-\u0938\u093e \u0928\u092f\u093e \u0936\u092c\u094d\u0926 \u092c\u0928\u0947\u0917\u093e?", options: ["\u0938\u0941\u0935\u093f\u091a\u093e\u0930", "\u0905\u0938\u0941\u0902\u0926\u0930", "\u0938\u0941\u0902\u0926\u0930\u0924\u093e", "\u0938\u0942\u0930\u094d\u092f"], answer: "\u0938\u0941\u0935\u093f\u091a\u093e\u0930", explanation: "\"\u0938\u0941-\" \u091c\u094b\u0921\u093c\u0928\u0947 \u0938\u0947 \"\u0905\u091a\u094d\u091b\u093e \u0935\u093f\u091a\u093e\u0930\" \u092c\u0928\u0924\u093e \u0939\u0948\u0964" },
    ],
    hard: [
      { q: "\"\u0905\u0902\u0927\u0947 \u0915\u0940 \u0932\u093e\u0920\u0940, \u092c\u093e\u0930\u0939 \u092c\u093e\u0930\u0939\" \u092e\u0941\u0939\u093e\u0935\u0930\u0947 \u0915\u093e \u0905\u0930\u094d\u0925 \u0939\u0948:", options: ["\u0915\u093f\u0938\u0940 \u0915\u093e \u090f\u0915\u092e\u093e\u0924\u094d\u0930 \u0938\u0939\u093e\u0930\u093e", "\u092c\u0939\u0941\u0924 \u092e\u091c\u092c\u0942\u0924 \u0939\u094b\u0928\u093e", "\u092c\u0939\u0941\u0924 \u0905\u092e\u0940\u0930 \u0939\u094b\u0928\u093e", "\u0928\u0908 \u091a\u0940\u091c\u093c \u0916\u0930\u0940\u0926\u0928\u093e"], answer: "\u0915\u093f\u0938\u0940 \u0915\u093e \u090f\u0915\u092e\u093e\u0924\u094d\u0930 \u0938\u0939\u093e\u0930\u093e", explanation: "\u092f\u0939 \u092e\u0941\u0939\u093e\u0935\u0930\u093e \u0915\u093f\u0938\u0940 \u0928\u093f\u0930\u094d\u092c\u0932 \u0935\u094d\u092f\u0915\u094d\u0924\u093f \u0915\u0947 \u090f\u0915\u092e\u093e\u0924\u094d\u0930 \u0938\u0939\u093e\u0930\u0947 \u0939\u094b\u0928\u0947 \u0938\u0947 \u0938\u0902\u092c\u0902\u0927\u093f\u0924 \u0939\u0948\u0964" },
      { q: "\"\u0917\u0917\u0928\u091a\u0941\u0902\u092c\u0940 \u0939\u094b\u0928\u093e\" \u092e\u0941\u0939\u093e\u0935\u0930\u0947 \u0915\u093e \u0905\u0930\u094d\u0925 \u0939\u0948:", options: ["\u092c\u0939\u0941\u0924 \u0918\u092e\u0902\u0921 \u0939\u094b\u0928\u093e", "\u092c\u0939\u0941\u0924 \u0918\u092e\u0902\u0921\u0940 \u0939\u094b\u0928\u093e", "\u0921\u0930 \u091c\u093e\u0928\u093e", "\u0916\u0941\u0936 \u0939\u094b\u0928\u093e"], answer: "\u092c\u0939\u0941\u0924 \u0918\u092e\u0902\u0921\u0940 \u0939\u094b\u0928\u093e", explanation: "\u092f\u0939 \u092e\u0941\u0939\u093e\u0935\u0930\u093e \u092c\u0939\u0941\u0924 \u091c\u094d\u092f\u093e\u0926\u093e \u0918\u092e\u0902\u0921\u0940 \u0939\u094b\u0928\u0947 \u0915\u093e \u092d\u093e\u0935 \u092a\u094d\u0930\u0915\u091f \u0915\u0930\u0924\u093e \u0939\u0948\u0964" },
      { q: "\"\u0905\u0917\u094d\u0930\" \u0936\u092c\u094d\u0926 \u092e\u0947\u0902 \"\u0905\u0917\u094d\u0930\u091c\" \u091c\u094b\u0921\u093c\u0928\u0947 \u0938\u0947 \u092c\u0928\u0947 \u0936\u092c\u094d\u0926 \u092e\u0947\u0902 \"\u091c\" \u0915\u094d\u092f\u093e \u0939\u0948?", options: ["\u092a\u094d\u0930\u0924\u094d\u092f\u092f", "\u0909\u092a\u0938\u0930\u094d\u0917", "\u092e\u0942\u0932 \u0936\u092c\u094d\u0926", "\u0938\u0902\u092f\u094b\u091c\u0915"], answer: "\u092a\u094d\u0930\u0924\u094d\u092f\u092f", explanation: "\"\u091c\" \u092f\u0939\u093e\u0902 \u0936\u092c\u094d\u0926 \u0915\u0947 \u0905\u0902\u0924 \u092e\u0947\u0902 \u091c\u0941\u0921\u093c\u093e \u092a\u094d\u0930\u0924\u094d\u092f\u092f \u0939\u0948\u0964" },
      { q: "\"\u0928\u093f\u0930\u094d\u092d\u0940\u0915\" \u0936\u092c\u094d\u0926 \u0915\u093e \u0935\u093f\u0932\u094b\u092e \u0915\u094d\u092f\u093e \u0939\u0948?", options: ["\u092d\u0940\u0930\u0941", "\u0938\u093e\u0939\u0938\u0940", "\u0926\u0941\u0930\u094d\u092c\u0932", "\u0916\u0930\u093e\u092c"], answer: "\u092d\u0940\u0930\u0941", explanation: "\"\u0928\u093f\u0930\u094d\u092d\u0940\u0915\" (\u0921\u0930 \u0930\u0939\u093f\u0924) \u0915\u093e \u0935\u093f\u0932\u094b\u092e \"\u092d\u0940\u0930\u0941\" (\u0921\u0930\u092a\u094b\u0915) \u0939\u0948\u0964" },
    ],
    expert: [
      { q: "\"\u0906\u0916\u094b\u0902 \u0938\u0947 \u0913\u091d\u0932 \u091f\u092a\u0915\u0928\u093e\" \u092e\u0941\u0939\u093e\u0935\u0930\u0947 \u0915\u093e \u0905\u0930\u094d\u0925 \u0939\u0948:", options: ["\u091c\u094d\u092f\u094b\u0902 \u0915\u093e \u0924\u094d\u092f\u094b\u0902 \u0932\u0917\u0928\u093e", "\u092c\u0939\u0941\u0924 \u0930\u094b\u0928\u093e", "\u0928\u0940\u0902\u0926 \u0928 \u0906\u0928\u093e", "\u0916\u0941\u0936 \u0939\u094b\u0928\u093e"], answer: "\u091c\u094d\u092f\u094b\u0902 \u0915\u093e \u0924\u094d\u092f\u094b\u0902 \u0932\u0917\u0928\u093e", explanation: "\u092f\u0939 \u092e\u0941\u0939\u093e\u0935\u0930\u093e \u0924\u0940\u0935\u094d\u0930 \u0917\u0941\u0938\u094d\u0938\u0947 \u0915\u093e \u092d\u093e\u0935 \u092a\u094d\u0930\u0915\u091f \u0915\u0930\u0924\u093e \u0939\u0948\u0964" },
      { q: "\"\u0938\u0941\u092a\u0941\u0924\u094d\u0930\" \u0936\u092c\u094d\u0926 \u0915\u093e \u0935\u093f\u0932\u094b\u092e \u0915\u094d\u092f\u093e \u0939\u0948?", options: ["\u0915\u0941\u092a\u0941\u0924\u094d\u0930", "\u092a\u0941\u0924\u094d\u0930\u0940", "\u092a\u093f\u0924\u093e", "\u092e\u093e\u0924\u093e"], answer: "\u0915\u0941\u092a\u0941\u0924\u094d\u0930", explanation: "\"\u0938\u0941-\" (\u0905\u091a\u094d\u091b\u093e) \u0915\u093e \u0935\u093f\u0932\u094b\u092e \"\u0915\u0941-\" (\u092c\u0941\u0930\u093e) \u0939\u0948, \u0907\u0938\u0932\u093f\u090f \u0938\u0941\u092a\u0941\u0924\u094d\u0930 \u0915\u093e \u0935\u093f\u0932\u094b\u092e \u0915\u0941\u092a\u0941\u0924\u094d\u0930 \u0939\u0948\u0964" },
      { q: "\u0928\u093f\u092e\u094d\u0928\u0932\u093f\u0916\u093f\u0924 \u092e\u0947\u0902 \u0938\u0947 \u0915\u094c\u0928-\u0938\u093e \u091c\u094b\u0921\u093c\u093e \u0935\u093f\u092a\u0930\u0940\u0924\u093e\u0930\u094d\u0925\u0915 \u0936\u092c\u094d\u0926\u094b\u0902 \u0915\u093e \u0928\u0939\u0940\u0902 \u0939\u0948: \u0930\u093e\u0924-\u0926\u093f\u0928, \u0938\u0941\u0916-\u0926\u0941\u0916, \u092e\u093f\u0924\u094d\u0930-\u0936\u0924\u094d\u0930\u0941, \u0918\u0930-\u092e\u0915\u093e\u0928\u0964", options: ["\u0930\u093e\u0924-\u0926\u093f\u0928", "\u0938\u0941\u0916-\u0926\u0941\u0916", "\u092e\u093f\u0924\u094d\u0930-\u0936\u0924\u094d\u0930\u0941", "\u0918\u0930-\u092e\u0915\u093e\u0928"], answer: "\u0918\u0930-\u092e\u0915\u093e\u0928", explanation: "\"\u0918\u0930\" \u0914\u0930 \"\u092e\u0915\u093e\u0928\" \u092a\u0930\u094d\u092f\u093e\u092f\u0935\u093e\u091a\u0940 \u0939\u0948\u0902, \u0935\u093f\u092a\u0930\u0940\u0924\u093e\u0930\u094d\u0925\u0915 \u0928\u0939\u0940\u0902\u0964" },
    ],
  },
  "vachan-ghati": {
    easy: [
      { q: "\u0917\u0926\u094d\u092f\u093e\u0902\u0936 \u092e\u0947\u0902 \u092a\u0942\u091b\u0947 \u0917\u090f \u092a\u094d\u0930\u0936\u094d\u0928\u094b\u0902 \u0915\u0947 \u0909\u0924\u094d\u0924\u0930 \u0915\u0939\u093e\u0902 \u0938\u0947 \u0916\u094b\u091c\u0928\u0947 \u091a\u093e\u0939\u093f\u090f?", options: ["\u0926\u093f\u090f \u0917\u090f \u0917\u0926\u094d\u092f\u093e\u0902\u0936 \u092e\u0947\u0902 \u0938\u0947", "\u0915\u093f\u0938\u0940 \u0905\u0928\u094d\u092f \u0915\u093f\u0924\u093e\u092c \u092e\u0947\u0902 \u0938\u0947", "\u0905\u092a\u0928\u0940 \u0915\u0932\u094d\u092a\u0928\u093e \u0938\u0947", "\u092a\u0942\u091b\u0928\u093e \u0939\u0940 \u0928\u0939\u0940\u0902"], answer: "\u0926\u093f\u090f \u0917\u090f \u0917\u0926\u094d\u092f\u093e\u0902\u0936 \u092e\u0947\u0902 \u0938\u0947", explanation: "\u092a\u094d\u0930\u0936\u094d\u0928\u094b\u0902 \u0915\u0947 \u0909\u0924\u094d\u0924\u0930 \u0939\u092e\u0947\u0936\u093e \u0926\u093f\u090f \u0917\u090f \u0905\u0902\u0936 \u092e\u0947\u0902 \u0938\u0947 \u0939\u0940 \u0916\u094b\u091c\u0947 \u091c\u093e\u0924\u0947 \u0939\u0948\u0902\u0964" },
      { q: "\u0915\u0935\u093f\u0924\u093e \u092a\u0922\u093c\u0924\u0947 \u0938\u092e\u092f \u0938\u092c\u0938\u0947 \u092a\u0939\u0932\u0947 \u0915\u093f\u0938 \u092c\u093e\u0924 \u092a\u0930 \u0927\u094d\u092f\u093e\u0928 \u0926\u0947\u0928\u093e \u091a\u093e\u0939\u093f\u090f?", options: ["\u0915\u0935\u093f\u0924\u093e \u0915\u093e \u0938\u093e\u092e\u093e\u0928\u094d\u092f \u092d\u093e\u0935", "\u0915\u0947\u0935\u0932 \u0936\u092c\u094d\u0926\u094b\u0902 \u0915\u0940 \u0938\u0902\u0916\u094d\u092f\u093e", "\u0915\u0935\u093f \u0915\u093e \u091c\u0928\u094d\u092e \u0938\u094d\u0925\u093e\u0928", "\u0915\u0935\u093f\u0924\u093e \u0915\u0940 \u0932\u0902\u092c\u093e\u0908"], answer: "\u0915\u0935\u093f\u0924\u093e \u0915\u093e \u0938\u093e\u092e\u093e\u0928\u094d\u092f \u092d\u093e\u0935", explanation: "\u0938\u092c\u0938\u0947 \u092a\u0939\u0932\u0947 \u0915\u0935\u093f\u0924\u093e \u0915\u093e \u0938\u092e\u0917\u094d\u0930 \u092d\u093e\u0935 \u0938\u092e\u091d\u0928\u093e \u091c\u0930\u0942\u0930\u0940 \u0939\u0948\u0964" },
      { q: "\u0917\u0926\u094d\u092f \u0930\u091a\u0928\u093e \u0915\u094d\u092f\u093e \u0939\u094b\u0924\u0940 \u0939\u0948?", options: ["\u092c\u093f\u0928\u093e \u0924\u0941\u0915\u093e\u0902\u0924 \u0915\u0947 \u0938\u093e\u092e\u093e\u0928\u094d\u092f \u092d\u093e\u0937\u093e \u092e\u0947\u0902 \u0932\u093f\u0916\u093f \u0930\u091a\u0928\u093e", "\u0939\u092e\u0947\u0936\u093e \u0924\u0941\u0915\u093e\u0902\u0924\u092c\u0926\u094d\u0927 \u0930\u091a\u0928\u093e", "\u0915\u0947\u0935\u0932 \u0915\u0939\u093e\u0928\u093f\u092f\u093e\u0902", "\u0915\u0947\u0935\u0932 \u0928\u093e\u091f\u0915"], answer: "\u092c\u093f\u0928\u093e \u0924\u0941\u0915\u093e\u0902\u0924 \u0915\u0947 \u0938\u093e\u092e\u093e\u0928\u094d\u092f \u092d\u093e\u0937\u093e \u092e\u0947\u0902 \u0932\u093f\u0916\u093f \u0930\u091a\u0928\u093e", explanation: "\u0917\u0926\u094d\u092f 'à¤¸à¤¾à¤®à¤¾à¤¨à¥à¤¯ à¤­à¤¾à¤·à¤¾' à¤®à¥‡à¤‚ à¤²à¤¿à¤–à¥€ à¤œà¤¾à¤¤à¥€ à¤¹à¥ˆ, à¤œà¤¬à¤•à¤¿ à¤ªà¤¦à¥à¤¯ à¤®à¥‡à¤‚ à¤¤à¥à¤•à¤¾à¤‚à¤¤ à¤¹à¥‹à¤¤à¤¾ à¤¹à¥ˆà¥¤" },
      { q: "True or False: \u0905\u0928\u0941\u091a\u094d\u091b\u0947\u0926 \u092a\u0922\u093c\u0924\u0947 \u0938\u092e\u092f \u0906\u092a \u0905\u092a\u0928\u0940 \u0915\u0932\u094d\u092a\u0928\u093e \u0938\u0947 \u0909\u0924\u094d\u0924\u0930 \u0926\u0947 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964", type: "true_false", options: ["True", "False"], answer: "False", explanation: "\u0909\u0924\u094d\u0924\u0930 \u0939\u092e\u0947\u0936\u093e \u0926\u093f\u090f \u0917\u090f \u0905\u0902\u0936 \u092a\u0930 \u0906\u0927\u093e\u0930\u093f\u0924 \u0939\u094b\u0928\u093e \u091a\u093e\u0939\u093f\u090f\u0964" },
      { q: "\u0930\u093f\u0915\u094d\u0924 \u0938\u094d\u0925\u093e\u0928 \u092d\u0930\u0947\u0902: \u0905\u0928\u0941\u091a\u094d\u091b\u0947\u0926 \u0915\u093e \u092e\u0941\u0916\u094d\u092f \u092d\u093e\u0935 \u0909\u0938\u0915\u0947 ___ \u092e\u0947\u0902 \u0939\u094b\u0924\u093e \u0939\u0948\u0964", type: "fill_blank", answer: "\u0936\u0940\u0930\u094d\u0937\u0915", explanation: "\u0936\u0940\u0930\u094d\u0937\u0915 \u0938\u0947 \u0905\u0915\u094d\u0938\u0930 \u092e\u0941\u0916\u094d\u092f \u092d\u093e\u0935 \u0915\u093e \u0938\u0902\u0915\u0947\u0924 \u092e\u093f\u0932 \u091c\u093e\u0924\u093e \u0939\u0948\u0964" },
    ],
    medium: [
      { q: "\u0917\u0926\u094d\u092f\u093e\u0902\u0936 \u0915\u093e \u0936\u0940\u0930\u094d\u0937\u0915 \u0926\u0947\u0928\u0947 \u0915\u093e \u0909\u0926\u094d\u0926\u0947\u0936\u094d\u092f \u0939\u0948:", options: ["\u092e\u0941\u0916\u094d\u092f \u092d\u093e\u0935 \u0915\u094b \u0938\u0902\u0915\u094d\u0937\u0947\u092a \u092e\u0947\u0902 \u0926\u0930\u094d\u0936\u093e\u0928\u093e", "\u0936\u092c\u094d\u0926\u094b\u0902 \u0915\u0940 \u0938\u0902\u0916\u094d\u092f\u093e \u092c\u0922\u093c\u093e\u0928\u093e", "\u0932\u0947\u0916\u0915 \u0915\u093e \u0928\u093e\u092e \u092c\u0924\u093e\u0928\u093e", "\u0915\u0935\u093f\u0924\u093e \u0932\u093f\u0916\u0928\u093e"], answer: "\u092e\u0941\u0916\u094d\u092f \u092d\u093e\u0935 \u0915\u094b \u0938\u0902\u0915\u094d\u0937\u0947\u092a \u092e\u0947\u0902 \u0926\u0930\u094d\u0936\u093e\u0928\u093e", explanation: "\u0905\u091a\u094d\u091b\u093e \u0936\u0940\u0930\u094d\u0937\u0915 \u092a\u0942\u0930\u0947 \u0905\u0902\u0936 \u0915\u0947 \u092d\u093e\u0935 \u0915\u094b \u0938\u0902\u0915\u094d\u0937\u0947\u092a \u092e\u0947\u0902 \u092a\u094d\u0930\u0915\u091f \u0915\u0930\u0924\u093e \u0939\u0948\u0964" },
      { q: "\u0915\u0935\u093f\u0924\u093e \u092e\u0947\u0902 \u092c\u093f\u0902\u092c\u094b\u0902 \u0915\u093e \u0905\u0930\u094d\u0925 \u0938\u092e\u091d\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u092e\u0939\u0924\u094d\u0935\u092a\u0942\u0930\u094d\u0923 \u0939\u0948:", options: ["\u092a\u0942\u0930\u0940 \u0915\u0935\u093f\u0924\u093e \u0915\u094b \u0938\u0902\u0926\u0930\u094d\u092d \u092e\u0947\u0902 \u092a\u0922\u093c\u0928\u093e", "\u0915\u0947\u0935\u0932 \u092a\u0939\u0932\u0940 \u092a\u0902\u0915\u094d\u0924\u093f \u092a\u0922\u093c\u0928\u093e", "\u0936\u0940\u0930\u094d\u0937\u0915 \u0926\u0947\u0916\u0928\u093e", "\u0932\u0947\u0916\u0915 \u0915\u093e \u0928\u093e\u092e \u091c\u093e\u0928\u0928\u093e"], answer: "\u092a\u0942\u0930\u0940 \u0915\u0935\u093f\u0924\u093e \u0915\u094b \u0938\u0902\u0926\u0930\u094d\u092d \u092e\u0947\u0902 \u092a\u0922\u093c\u0928\u093e", explanation: "\u0938\u0902\u0926\u0930\u094d\u092d \u0938\u0947 \u0939\u0940 \u092a\u0902\u0915\u094d\u0924\u093f \u0915\u093e \u0938\u0939\u0940 \u0905\u0930\u094d\u0925 \u0938\u094d\u092a\u0937\u094d\u091f \u0939\u094b\u0924\u093e \u0939\u0948\u0964" },
      { q: "\"\u0932\u0947\u0916\u0915 \u0928\u0947 \u092a\u094d\u0930\u0915\u0943\u0924\u093f \u0915\u0940 \u0938\u0941\u0902\u0926\u0930\u0924\u093e \u0915\u093e \u0935\u0930\u094d\u0923\u0928 \u0915\u093f\u092f\u093e\u0964\" \u092f\u0939 \u0935\u093e\u0915\u094d\u092f \u0917\u0926\u094d\u092f\u093e\u0902\u0936 \u092e\u0947\u0902 \u0915\u093f\u0938 \u092a\u094d\u0930\u0915\u093e\u0930 \u0915\u0940 \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0939\u094b\u0917\u0940?", options: ["\u0935\u093f\u0937\u092f \u0938\u0902\u092c\u0902\u0927\u0940 \u092a\u094d\u0930\u092e\u0941\u0916 \u091c\u093e\u0928\u0915\u093e\u0930\u0940", "\u0905\u092a\u094d\u0930\u093e\u0938\u0902\u0917\u093f\u0915 \u0935\u093f\u0935\u0930\u0923", "\u0917\u0932\u0924 \u091c\u093e\u0928\u0915\u093e\u0930\u0940", "\u0915\u094b\u0908 \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0928\u0939\u0940\u0902"], answer: "\u0935\u093f\u0937\u092f \u0938\u0902\u092c\u0902\u0927\u0940 \u092a\u094d\u0930\u092e\u0941\u0916 \u091c\u093e\u0928\u0915\u093e\u0930\u0940", explanation: "\u092f\u0939 \u0935\u093e\u0915\u094d\u092f \u0917\u0926\u094d\u092f\u093e\u0902\u0936 \u0915\u0947 \u092e\u0941\u0916\u094d\u092f \u0935\u093f\u0937\u092f \u0938\u0947 \u0938\u0940\u0927\u0947 \u091c\u0941\u0921\u093c\u093e \u0939\u0948\u0964" },
      { q: "\u092a\u0926\u094d\u092f\u093e\u0902\u0936 \u092e\u0947\u0902 \"\u0930\u0938\" \u0915\u093e \u0905\u0930\u094d\u0925 \u0939\u0948:", options: ["\u0915\u0935\u093f\u0924\u093e \u0938\u0947 \u092e\u093f\u0932\u0928\u0947 \u0935\u093e\u0932\u093e \u0906\u0928\u0902\u0926/\u092d\u093e\u0935", "\u0915\u0935\u093f\u0924\u093e \u0915\u0940 \u0932\u0902\u092c\u093e\u0908", "\u0932\u0947\u0916\u0915 \u0915\u093e \u0928\u093e\u092e", "\u0938\u094d\u0925\u093e\u0928 \u0915\u093e \u0935\u0930\u094d\u0923\u0928"], answer: "\u0915\u0935\u093f\u0924\u093e \u0938\u0947 \u092e\u093f\u0932\u0928\u0947 \u0935\u093e\u0932\u093e \u0906\u0928\u0902\u0926/\u092d\u093e\u0935", explanation: "\u0930\u0938 \u0935\u0939 \u0906\u0928\u0902\u0926\u093e\u0928\u0941\u092d\u0942\u0924\u093f \u0939\u0948 \u091c\u094b \u0915\u093e\u0935\u094d\u092f \u092a\u0922\u093c\u0928\u0947/\u0938\u0941\u0928\u0928\u0947 \u0938\u0947 \u092e\u093f\u0932\u0924\u0940 \u0939\u0948\u0964" },
    ],
    hard: [
      { q: "\u0915\u093f\u0938\u0940 \u092a\u0902\u0915\u094d\u0924\u093f \u0915\u0947 \"\u0906\u0936\u092f\" \u0915\u093e \u0905\u0930\u094d\u0925 \u0939\u0948:", options: ["\u0932\u0947\u0916\u0915 \u0915\u093e \u092e\u0942\u0932 \u0909\u0926\u094d\u0926\u0947\u0936\u094d\u092f \u092f\u093e \u092d\u093e\u0935", "\u092a\u0902\u0915\u094d\u0924\u093f \u0915\u0940 \u0932\u0902\u092c\u093e\u0908", "\u0936\u092c\u094d\u0926\u094b\u0902 \u0915\u0940 \u0938\u0902\u0916\u094d\u092f\u093e", "\u0935\u093f\u0930\u093e\u092e \u091a\u093f\u0939\u094d\u0928"], answer: "\u0932\u0947\u0916\u0915 \u0915\u093e \u092e\u0942\u0932 \u0909\u0926\u094d\u0926\u0947\u0936\u094d\u092f \u092f\u093e \u092d\u093e\u0935", explanation: "\"\u0906\u0936\u092f\" \u0938\u0947 \u0924\u093e\u0924\u094d\u092a\u0930\u094d\u092f \u0939\u0948 \u0932\u0947\u0916\u0915 \u0915\u0947 \u092e\u0942\u0932 \u092d\u093e\u0935 \u0938\u0947\u0964" },
      { q: "\u0915\u093f\u0938\u0940 \u0905\u0928\u0941\u091a\u094d\u091b\u0947\u0926 \u092e\u0947\u0902 \u0938\u0940\u0927\u0947 \u0928 \u0932\u093f\u0916\u0947 \u0917\u090f \u0915\u093f\u0938\u0940 \u092c\u093e\u0924 \u0915\u094b \u0938\u092e\u091d\u0928\u093e \u0915\u0939\u0932\u093e\u0924\u093e \u0939\u0948:", options: ["\u0905\u0928\u0941\u092e\u093e\u0928", "\u092a\u0941\u0928\u0930\u093e\u0935\u0943\u0924\u094d\u0924\u093f", "\u0938\u093e\u0930\u093e\u0902\u0936", "\u0936\u0940\u0930\u094d\u0937\u0915"], answer: "\u0905\u0928\u0941\u092e\u093e\u0928", explanation: "\u0905\u0928\u0941\u092e\u093e\u0928 \u0932\u0917\u093e\u0928\u093e \u092e\u0924\u0932\u092c \u0939\u0948 \u091c\u094b \u0938\u0940\u0927\u0947-\u0938\u0940\u0927\u0947 \u0928\u0939\u0940\u0902 \u0932\u093f\u0916\u093e \u0909\u0938\u0947 \u0938\u092e\u091d \u091c\u093e\u0928\u093e\u0964" },
      { q: "\u092a\u0926\u094d\u092f\u093e\u0902\u0936 \u092e\u0947\u0902 \u091b\u0902\u0926 \u0938\u0947 \u0915\u094d\u092f\u093e \u0928\u093f\u0930\u094d\u0927\u093e\u0930\u093f\u0924 \u0939\u094b\u0924\u093e \u0939\u0948?", options: ["\u092a\u0902\u0915\u094d\u0924\u093f\u092f\u094b\u0902 \u092e\u0947\u0902 \u0935\u0930\u094d\u0923\u094b\u0902/\u092e\u093e\u0924\u094d\u0930\u093e\u0913\u0902 \u0915\u0940 \u0928\u093f\u0936\u094d\u091a\u093f\u0924 \u0938\u0902\u0916\u094d\u092f\u093e \u0914\u0930 \u0917\u0924\u093f", "\u0932\u0947\u0916\u0915 \u0915\u093e \u0928\u093e\u092e", "\u0915\u0935\u093f\u0924\u093e \u0915\u093e \u0936\u0940\u0930\u094d\u0937\u0915", "\u0915\u0947\u0935\u0932 \u091c\u093e\u0928-\u092a\u0939\u091a\u093e\u0928"], answer: "\u092a\u0902\u0915\u094d\u0924\u093f\u092f\u094b\u0902 \u092e\u0947\u0902 \u0935\u0930\u094d\u0923\u094b\u0902/\u092e\u093e\u0924\u094d\u0930\u093e\u0913\u0902 \u0915\u0940 \u0928\u093f\u0936\u094d\u091a\u093f\u0924 \u0938\u0902\u0916\u094d\u092f\u093e \u0914\u0930 \u0917\u0924\u093f", explanation: "\u091b\u0902\u0926 \u0935\u0930\u094d\u0923\u094b\u0902 \u0915\u0940 \u0938\u0902\u0916\u094d\u092f\u093e, \u0915\u094d\u0930\u092e \u0914\u0930 \u0932\u092f \u0938\u0947 \u0928\u093f\u0930\u094d\u0927\u093e\u0930\u093f\u0924 \u0939\u094b\u0924\u093e \u0939\u0948\u0964" },
    ],
    expert: [
      { q: "\u0917\u0926\u094d\u092f\u093e\u0902\u0936 \u092e\u0947\u0902 \u0932\u0947\u0916\u0915 \u0915\u0940 \u0936\u0948\u0932\u0940 (\u0936\u0948\u0932\u0940\u0917\u0924 \u0935\u093f\u0936\u0947\u0937\u0924\u093e) \u0915\u093e \u0905\u0930\u094d\u0925 \u0939\u0948:", options: ["\u0932\u0947\u0916\u0928 \u0915\u093e \u0935\u0939 \u0922\u0902\u0917 \u091c\u094b \u0932\u0947\u0916\u0915 \u0915\u094b \u0926\u0942\u0938\u0930\u094b\u0902 \u0938\u0947 \u0905\u0932\u0917 \u092c\u0928\u093e\u0924\u093e \u0939\u0948", "\u0915\u0947\u0935\u0932 \u0935\u094d\u092f\u093e\u0915\u0930\u0923 \u0915\u0947 \u0928\u093f\u092f\u092e", "\u0936\u092c\u094d\u0926\u094b\u0902 \u0915\u0940 \u0938\u0902\u0916\u094d\u092f\u093e", "\u0928\u093f\u092c\u0902\u0927 \u0915\u093e \u0936\u0940\u0930\u094d\u0937\u0915"], answer: "\u0932\u0947\u0916\u0928 \u0915\u093e \u0935\u0939 \u0922\u0902\u0917 \u091c\u094b \u0932\u0947\u0916\u0915 \u0915\u094b \u0926\u0942\u0938\u0930\u094b\u0902 \u0938\u0947 \u0905\u0932\u0917 \u092c\u0928\u093e\u0924\u093e \u0939\u0948", explanation: "\u0936\u0948\u0932\u0940 \u0932\u0947\u0916\u0915 \u0915\u0940 \u0935\u093f\u0936\u093f\u0937\u094d\u091f \u0905\u092d\u093f\u0935\u094d\u092f\u0915\u094d\u0924\u093f-\u0936\u0948\u0932\u0940 \u0939\u094b\u0924\u0940 \u0939\u0948\u0964" },
      { q: "\u0915\u094d\u0932\u093f\u0937\u094d\u091f (\u0915\u0920\u093f\u0928) \u0936\u092c\u094d\u0926\u093e\u0935\u0932\u0940 \u0935\u093e\u0932\u0947 \u0917\u0926\u094d\u092f\u093e\u0902\u0936 \u0915\u094b \u0938\u092e\u091d\u0928\u0947 \u0915\u0940 \u0938\u092c\u0938\u0947 \u0905\u091a\u094d\u091b\u0940 \u0930\u0923\u0928\u0940\u0924\u093f \u0915\u094c\u0928-\u0938\u0940 \u0939\u0948?", options: ["\u0938\u0902\u0926\u0930\u094d\u092d \u0915\u0947 \u0906\u0927\u093e\u0930 \u092a\u0930 \u0905\u0930\u094d\u0925 \u0928\u093f\u0915\u093e\u0932\u0928\u093e", "\u0939\u0930 \u0936\u092c\u094d\u0926 \u0930\u091f\u0928\u093e", "\u0915\u0947\u0935\u0932 \u091a\u093f\u0924\u094d\u0930\u094b\u0902 \u0915\u094b \u0926\u0947\u0916\u0928\u093e", "\u092a\u0942\u0930\u093e \u0905\u0902\u0936 \u091b\u094b\u0921\u093c\u0928\u093e"], answer: "\u0938\u0902\u0926\u0930\u094d\u092d \u0915\u0947 \u0906\u0927\u093e\u0930 \u092a\u0930 \u0905\u0930\u094d\u0925 \u0928\u093f\u0915\u093e\u0932\u0928\u093e", explanation: "\u0938\u0902\u0926\u0930\u094d\u092d \u0938\u0947 \u0905\u092a\u0930\u093f\u091a\u093f\u0924 \u0936\u092c\u094d\u0926\u094b\u0902 \u0915\u093e \u092d\u0940 \u0905\u0930\u094d\u0925 \u0938\u092e\u091d\u093e \u091c\u093e \u0938\u0915\u0924\u093e \u0939\u0948\u0964" },
    ],
  },
  "lekhan-lok": {
    easy: [
      { q: "\u0905\u0928\u0941\u091a\u094d\u091b\u0947\u0926 \u092e\u0947\u0902 \u0938\u092c\u0938\u0947 \u092e\u0939\u0924\u094d\u0935\u092a\u0942\u0930\u094d\u0923 \u092c\u093e\u0924 \u0915\u094d\u092f\u093e \u0939\u0948?", options: ["\u090f\u0915 \u0938\u094d\u092a\u0937\u094d\u091f \u0935\u093f\u091a\u093e\u0930 \u092a\u0930 \u091f\u093f\u0915\u0947 \u0930\u0939\u0928\u093e", "\u091c\u093f\u0924\u0928\u0940 \u091c\u0932\u094d\u0926\u0940 \u0939\u094b \u0938\u0915\u0947 \u092c\u0921\u093c\u0940 \u0932\u093e\u0907\u0928\u0947\u0902 \u0932\u093f\u0916\u0928\u093e", "\u0939\u0930 \u0932\u093e\u0907\u0928 \u092e\u0947\u0902 \u0928\u092f\u093e \u0935\u093f\u091a\u093e\u0930", "\u0915\u0935\u093f\u0924\u093e \u0915\u0940 \u0924\u0930\u0939 \u0924\u0941\u0915\u093e\u0902\u0924"], answer: "\u090f\u0915 \u0938\u094d\u092a\u0937\u094d\u091f \u0935\u093f\u091a\u093e\u0930 \u092a\u0930 \u091f\u093f\u0915\u0947 \u0930\u0939\u0928\u093e", explanation: "\u0905\u091a\u094d\u091b\u093e \u0905\u0928\u0941\u091a\u094d\u091b\u0947\u0926 \u090f\u0915 \u0939\u0940 \u092e\u0941\u0916\u094d\u092f \u0935\u093f\u091a\u093e\u0930 \u092a\u0930 \u0915\u0947\u0902\u0926\u094d\u0930\u093f\u0924 \u0930\u0939\u0924\u093e \u0939\u0948\u0964" },
      { q: "\u0928\u093f\u092c\u0902\u0927 \u0932\u0947\u0916\u0928 \u092e\u0947\u0902 \u0938\u093e\u092e\u093e\u0928\u094d\u092f\u0924\u0903 \u0915\u093f\u0924\u0928\u0947 \u092d\u093e\u0917 \u0939\u094b\u0924\u0947 \u0939\u0948\u0902?", options: ["\u0908\u0938\u093e\u0908", "\u0926\u094b", "\u091a\u093e\u0930", "\u091b\u0939"], answer: "\u091a\u093e\u0930", explanation: "\u092a\u094d\u0930\u0938\u094d\u0924\u093e\u0935\u0928\u093e, \u092e\u0927\u094d\u092f, \u0914\u0930 \u0909\u092a\u0938\u0902\u0939\u093e\u0930 \u0906\u0926\u093f \u092d\u093e\u0917\u094b\u0902 \u092e\u0947\u0902 \u0928\u093f\u092c\u0902\u0927 \u092c\u0902\u091f\u0924\u093e \u0939\u0948\u0964" },
      { q: "\u0914\u092a\u091a\u093e\u0930\u093f\u0915 \u092a\u0924\u094d\u0930 \u0915\u093f\u0938\u0947 \u0932\u093f\u0916\u093e \u091c\u093e\u0924\u093e \u0939\u0948?", options: ["\u092a\u094d\u0930\u0927\u093e\u0928\u093e\u091a\u093e\u0930\u094d\u092f/\u0938\u0902\u0938\u094d\u0925\u093e \u0915\u094b", "\u092e\u093f\u0924\u094d\u0930 \u0915\u094b", "\u092d\u093e\u0908 \u0915\u094b", "\u092e\u093e\u0924\u093e-\u092a\u093f\u0924\u093e \u0915\u094b"], answer: "\u092a\u094d\u0930\u0927\u093e\u0928\u093e\u091a\u093e\u0930\u094d\u092f/\u0938\u0902\u0938\u094d\u0925\u093e \u0915\u094b", explanation: "\u0914\u092a\u091a\u093e\u0930\u093f\u0915 \u092a\u0924\u094d\u0930 \u0938\u094d\u0915\u0942\u0932, \u0915\u093e\u0930\u094d\u092f\u093e\u0932\u092f \u092f\u093e \u0938\u0902\u0938\u094d\u0925\u093e\u0913\u0902 \u0915\u094b \u0932\u093f\u0916\u0947 \u091c\u093e\u0924\u0947 \u0939\u0948\u0902\u0964" },
      { q: "True or False: \u0905\u0928\u094c\u092a\u091a\u093e\u0930\u093f\u0915 \u092a\u0924\u094d\u0930 \u092a\u0930\u093f\u0935\u093e\u0930/\u092e\u093f\u0924\u094d\u0930\u094b\u0902 \u0915\u094b \u0932\u093f\u0916\u093e \u091c\u093e\u0924\u093e \u0939\u0948\u0964", type: "true_false", options: ["True", "False"], answer: "True", explanation: "\u0905\u0928\u094c\u092a\u091a\u093e\u0930\u093f\u0915 \u092a\u0924\u094d\u0930 \u0928\u093f\u091c\u0940 \u0938\u0902\u092c\u0902\u0927\u094b\u0902 \u092e\u0947\u0902 \u0932\u093f\u0916\u0947 \u091c\u093e\u0924\u0947 \u0939\u0948\u0902\u0964" },
    ],
    medium: [
      { q: "\u0914\u092a\u091a\u093e\u0930\u093f\u0915 \u092a\u0924\u094d\u0930 \u0914\u0930 \u0905\u0928\u094c\u092a\u091a\u093e\u0930\u093f\u0915 \u092a\u0924\u094d\u0930 \u092e\u0947\u0902 \u092e\u0941\u0916\u094d\u092f \u0905\u0902\u0924\u0930 \u0915\u094d\u092f\u093e \u0939\u0948?", options: ["\u092d\u093e\u0937\u093e \u0914\u0930 \u0938\u0902\u092c\u094b\u0927\u0928 \u0915\u093e \u0938\u094d\u0924\u0930", "\u0932\u0902\u092c\u093e\u0908", "\u0932\u093f\u0916\u0928\u0947 \u0915\u0940 \u0938\u094d\u092f\u093e\u0939\u0940", "\u0915\u094b\u0908 \u0905\u0902\u0924\u0930 \u0928\u0939\u0940\u0902"], answer: "\u092d\u093e\u0937\u093e \u0914\u0930 \u0938\u0902\u092c\u094b\u0927\u0928 \u0915\u093e \u0938\u094d\u0924\u0930", explanation: "\u0914\u092a\u091a\u093e\u0930\u093f\u0915 \u092a\u0924\u094d\u0930 \u092e\u0947\u0902 \u0936\u093f\u0937\u094d\u091f\u093e\u091a\u093e\u0930, \u091c\u092c\u0915\u093f \u0905\u0928\u094c\u092a\u091a\u093e\u0930\u093f\u0915 \u092e\u0947\u0902 \u0906\u0924\u094d\u092e\u0940\u092f\u0924\u093e \u0939\u094b\u0924\u0940 \u0939\u0948\u0964" },
      { q: "\u090f\u0915 \u0905\u091a\u094d\u091b\u0947 \u0928\u093f\u092c\u0902\u0927 \u0915\u0940 \u0938\u092c\u0938\u0947 \u0906\u0935\u0936\u094d\u092f\u0915 \u0935\u093f\u0936\u0947\u0937\u0924\u093e \u0915\u094d\u092f\u093e \u0939\u0948?", options: ["\u0935\u093f\u091a\u093e\u0930\u094b\u0902 \u092e\u0947\u0902 \u0938\u094d\u092a\u0937\u094d\u091f\u0924\u093e \u0914\u0930 \u0915\u094d\u0930\u092e\u092c\u0926\u094d\u0927\u0924\u093e", "\u0932\u092e\u094d\u092c\u0940 \u0935\u093e\u0915\u094d\u092f", "\u0915\u0920\u093f\u0928 \u0936\u092c\u094d\u0926\u093e\u0935\u0932\u0940", "\u091a\u093f\u0924\u094d\u0930 \u0915\u093e \u0909\u092a\u092f\u094b\u0917"], answer: "\u0935\u093f\u091a\u093e\u0930\u094b\u0902 \u092e\u0947\u0902 \u0938\u094d\u092a\u0937\u094d\u091f\u0924\u093e \u0914\u0930 \u0915\u094d\u0930\u092e\u092c\u0926\u094d\u0927\u0924\u093e", explanation: "\u092a\u093e\u0920\u0915 \u0915\u094b \u0935\u093f\u091a\u093e\u0930 \u0938\u0930\u0932\u0924\u093e \u0938\u0947 \u0938\u092e\u091d \u092e\u0947\u0902 \u0906\u0924\u093e \u0939\u0948\u0964" },
    ],
    hard: [
      { q: "\u0936\u093f\u0915\u093e\u092f\u0924 \u092a\u0924\u094d\u0930 (\u0914\u092a\u091a\u093e\u0930\u093f\u0915) \u092e\u0947\u0902 \u0938\u092c\u0938\u0947 \u092a\u0939\u0932\u0947 \u0915\u094d\u092f\u093e \u0932\u093f\u0916\u093e \u091c\u093e\u0924\u093e \u0939\u0948?", options: ["\u0938\u092e\u0938\u094d\u092f\u093e \u0915\u093e \u0938\u094d\u092a\u0937\u094d\u091f \u0935\u093f\u0935\u0930\u0923", "\u0927\u0928\u094d\u092f\u0935\u093e\u0926", "\u092d\u0935\u0926\u0940\u092f", "\u092a\u0924\u093e"], answer: "\u0938\u092e\u0938\u094d\u092f\u093e \u0915\u093e \u0938\u094d\u092a\u0937\u094d\u091f \u0935\u093f\u0935\u0930\u0923", explanation: "\u0938\u092e\u0938\u094d\u092f\u093e \u0915\u094b \u0938\u094d\u092a\u0937\u094d\u091f\u0924\u093e \u0938\u0947 \u092c\u0924\u093e\u0928\u093e \u092a\u0924\u094d\u0930 \u0915\u093e \u092e\u0942\u0932 \u0909\u0926\u094d\u0926\u0947\u0936\u094d\u092f \u0939\u0948\u0964" },
    ],
    expert: [
      { q: "\u0928\u093f\u092c\u0902\u0927 \u092e\u0947\u0902 \u0909\u092a\u0938\u0902\u0939\u093e\u0930 \u0932\u093f\u0916\u0924\u0947 \u0938\u092e\u092f \u0938\u092c\u0938\u0947 \u092c\u0921\u093c\u0940 \u092d\u0942\u0932 \u0915\u094c\u0928-\u0938\u0940 \u0939\u0948?", options: ["\u0928\u092f\u093e \u0935\u093f\u0937\u092f \u091c\u094b\u0921\u093c \u0926\u0947\u0928\u093e", "\u0938\u0902\u0915\u094d\u0937\u0947\u092a \u092e\u0947\u0902 \u0938\u092e\u0947\u091f\u0928\u093e", "\u0938\u094d\u092a\u0937\u094d\u091f \u0938\u092e\u093e\u092a\u0928 \u0926\u0947\u0928\u093e", "\u0915\u0941\u091b \u0928\u0939\u0940\u0902 \u0932\u093f\u0916\u0928\u093e"], answer: "\u0928\u092f\u093e \u0935\u093f\u0937\u092f \u091c\u094b\u0921\u093c \u0926\u0947\u0928\u093e", explanation: "\u0909\u092a\u0938\u0902\u0939\u093e\u0930 \u092e\u0947\u0902 \u0928\u092f\u093e \u0935\u093f\u0937\u092f \u091c\u094b\u0921\u093c\u0928\u093e \u0928\u093f\u092c\u0902\u0927 \u0915\u0940 \u090f\u0915\u0924\u093e \u0915\u094b \u0924\u094b\u0921\u093c\u0924\u093e \u0939\u0948\u0964" },
    ],
  },
  "sahitya-sarovar": {
    easy: [
      { q: "\"\u0930\u0935\u093f\u0915\u0930 \u0930\u0938\u094d\u0938\u0940 \u091c\u0948\u0938\u0947 \u091a\u092e\u0915\u0924\u0940 \u0926\u0941\u0928\u093f\u092f\u093e\u0964\" \u092f\u0939\u093e\u0902 \u0915\u094c\u0928-\u0938\u093e \u0905\u0932\u0902\u0915\u093e\u0930 \u0939\u0948?", options: ["\u0909\u092a\u092e\u093e", "\u0905\u0928\u0941\u092a\u094d\u0930\u093e\u0938", "\u092f\u092e\u0915", "\u0936\u094d\u0932\u0947\u0937"], answer: "\u0909\u092a\u092e\u093e", explanation: "\u092f\u0939\u093e\u0902 \u090f\u0915 \u0935\u0938\u094d\u0924\u0941 \u0915\u0940 \u0926\u0942\u0938\u0930\u0940 \u0938\u0947 \u0924\u0941\u0932\u0928\u093e \u0915\u0940 \u091c\u093e \u0930\u0939\u0940 \u0939\u0948 (\"\u091c\u0948\u0938\u0947\"), \u091c\u094b \u0909\u092a\u092e\u093e \u0905\u0932\u0902\u0915\u093e\u0930 \u0939\u0948\u0964" },
      { q: "\"\u0915\u0932-\u0915\u0932 \u0915\u0949\u0932\u0947\u091c \u0915\u0940 \u0915\u094b\u092e\u0932 \u0915\u0932\u093f\u092f\u093e\u0902\u0964\" \u092e\u0947\u0902 \u0915\u094c\u0928-\u0938\u093e \u0905\u0932\u0902\u0915\u093e\u0930 \u0939\u0948?", options: ["\u0905\u0928\u0941\u092a\u094d\u0930\u093e\u0938", "\u0909\u092a\u092e\u093e", "\u0930\u0942\u092a\u0915", "\u0935\u093f\u0930\u094b\u0927\u093e\u092d\u093e\u0938"], answer: "\u0905\u0928\u0941\u092a\u094d\u0930\u093e\u0938", explanation: "\u090f\u0915 \u0939\u0940 \u0935\u094d\u092f\u0902\u091c\u0928 \u0915\u0940 \u092c\u093e\u0930-\u092c\u093e\u0930 \u0906\u0935\u0943\u0924\u094d\u0924\u093f \u0905\u0928\u0941\u092a\u094d\u0930\u093e\u0938 \u0905\u0932\u0902\u0915\u093e\u0930 \u0915\u0939\u0932\u093e\u0924\u0940 \u0939\u0948\u0964" },
      { q: "\"\u0938\u094d\u0925\u093e\u092f\u0940 \u092d\u093e\u0935\" \u0938\u0947 \u0915\u094d\u092f\u093e \u0906\u0936\u092f \u0939\u0948?", options: ["\u091c\u094b \u092a\u0942\u0930\u0947 \u0915\u093e\u0935\u094d\u092f \u092e\u0947\u0902 \u092c\u0928\u093e \u0930\u0939\u0924\u093e \u0939\u0948 (\u091c\u0948\u0938\u0947 \u0930\u0924\u093f, \u0939\u093e\u0938\u094d\u092f)", "\u091c\u094b \u0915\u0941\u091b \u092a\u0932 \u0915\u0947 \u0932\u093f\u090f \u0906\u0924\u093e \u0939\u0948", "\u0915\u0935\u093f \u0915\u093e \u0928\u093e\u092e", "\u0938\u094d\u0925\u093e\u0928 \u0915\u093e \u0935\u0930\u094d\u0923\u0928"], answer: "\u091c\u094b \u092a\u0942\u0930\u0947 \u0915\u093e\u0935\u094d\u092f \u092e\u0947\u0902 \u092c\u0928\u093e \u0930\u0939\u0924\u093e \u0939\u0948 (\u091c\u0948\u0938\u0947 \u0930\u0924\u093f, \u0939\u093e\u0938\u094d\u092f)", explanation: "\u0938\u094d\u0925\u093e\u092f\u0940 \u092d\u093e\u0935 \u0938\u094d\u0925\u093f\u0930 \u0930\u0942\u092a \u0938\u0947 \u092c\u0928\u093e \u0930\u0939\u0924\u093e \u0939\u0948, \u091c\u0948\u0938\u0947 \u0930\u0924\u093f, \u0939\u093e\u0938\u094d\u092f, \u0936\u094b\u0915\u0964" },
    ],
    medium: [
      { q: "\u0917\u0926\u094d\u092f 'à¤¸à¤¾à¤®à¤¾à¤¨à¥à¤¯ à¤­à¤¾à¤·à¤¾' à¤®à¥‡à¤‚ à¤²à¤¿à¤–à¤¾ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆ, à¤œà¤¬à¤•à¤¿ à¤ªà¤¦à¥à¤¯ à¤®à¥‡à¤‚ à¤•à¥à¤¯à¤¾ à¤¹à¥‹à¤¤à¤¾ à¤¹à¥ˆ?", options: ["\u0924\u0941\u0915 \u0914\u0930 \u0932\u092f", "\u0915\u0947\u0935\u0932 \u0932\u0902\u092c\u093e\u0908", "\u0915\u0925\u093e\u0928\u0915", "\u0915\u094b\u0908 \u0905\u0902\u0924\u0930 \u0928\u0939\u0940\u0902"], answer: "\u0924\u0941\u0915 \u0914\u0930 \u0932\u092f", explanation: "\u092a\u0926\u094d\u092f (\u0915\u0935\u093f\u0924\u093e) \u092e\u0947\u0902 \u0924\u0941\u0915 \u0914\u0930 \u0932\u092f \u092a\u094d\u0930\u092e\u0941\u0916 \u0939\u094b\u0924\u0947 \u0939\u0948\u0902\u0964" },
      { q: "\"\u0935\u0940\u0930 \u0930\u0938\" \u0915\u093f\u0938 \u092d\u093e\u0935 \u0938\u0947 \u091c\u0941\u0921\u093c\u093e \u0939\u0948?", options: ["\u0935\u0940\u0930\u0924\u093e \u0914\u0930 \u0938\u093e\u0939\u0938 \u0915\u0947 \u0935\u0930\u094d\u0923\u0928 \u0938\u0947", "\u0915\u0930\u0941\u0923\u093e \u0938\u0947", "\u0939\u093e\u0938\u094d\u092f \u0938\u0947", "\u092d\u092f \u0938\u0947"], answer: "\u0935\u0940\u0930\u0924\u093e \u0914\u0930 \u0938\u093e\u0939\u0938 \u0915\u0947 \u0935\u0930\u094d\u0923\u0928 \u0938\u0947", explanation: "\u0935\u0940\u0930 \u0930\u0938 \u092a\u0930\u093e\u0915\u094d\u0930\u092e, \u0938\u093e\u0939\u0938 \u0914\u0930 \u092c\u0932 \u0915\u0947 \u0935\u0930\u094d\u0923\u0928 \u0938\u0947 \u0909\u0924\u094d\u092a\u0928\u094d\u0928 \u0939\u094b\u0924\u093e \u0939\u0948\u0964" },
    ],
    hard: [
      { q: "\u0915\u093f\u0938\u0940 \u0915\u0935\u093f\u0924\u093e \u092e\u0947\u0902 \u092c\u093e\u0930-\u092c\u093e\u0930 \u090f\u0915 \u0939\u0940 \u0935\u094d\u092f\u0902\u091c\u0928 \u0915\u0940 \u0906\u0935\u0943\u0924\u094d\u0924\u093f \u0915\u094b \u0915\u094d\u092f\u093e \u0915\u0939\u093e \u091c\u093e\u0924\u093e \u0939\u0948?", options: ["\u0905\u0928\u0941\u092a\u094d\u0930\u093e\u0938 \u0905\u0932\u0902\u0915\u093e\u0930", "\u0909\u092a\u092e\u093e \u0905\u0932\u0902\u0915\u093e\u0930", "\u0930\u0942\u092a\u0915 \u0905\u0932\u0902\u0915\u093e\u0930", "\u0938\u094d\u0925\u093e\u092f\u0940 \u092d\u093e\u0935"], answer: "\u0905\u0928\u0941\u092a\u094d\u0930\u093e\u0938 \u0905\u0932\u0902\u0915\u093e\u0930", explanation: "\u0935\u094d\u092f\u0902\u091c\u0928\u094b\u0902 \u0915\u0940 \u092c\u093e\u0930-\u092c\u093e\u0930 \u0906\u0935\u0943\u0924\u094d\u0924\u093f \u0938\u0947 \u092c\u0928\u0928\u0947 \u0935\u093e\u0932\u093e \u0905\u0932\u0902\u0915\u093e\u0930 \u0905\u0928\u0941\u092a\u094d\u0930\u093e\u0938 \u0915\u0939\u0932\u093e\u0924\u093e \u0939\u0948\u0964" },
    ],
    expert: [
      { q: "\"\u092e\u0941\u0916 \u091a\u0902\u0926\u094d\u0930\u092e\u093e \u0938\u093e \u0939\u0948\u0964\" \u2014 \u092f\u0939\u093e\u0902 \"\u091a\u0902\u0926\u094d\u0930\u092e\u093e\" \u0915\u094d\u092f\u093e \u0939\u094b \u0917\u092f\u093e, \u092c\u0924\u093e\u090f\u0902\u0964", options: ["\u0930\u0942\u092a\u0915 (\u0909\u092a\u092e\u0947\u092f \u0915\u094b \u0938\u0940\u0927\u0947 \u0909\u092a\u092e\u093e\u0928 \u092c\u0924\u093e\u092f\u093e)", "\u0909\u092a\u092e\u093e", "\u0905\u0928\u0941\u092a\u094d\u0930\u093e\u0938", "\u092f\u092e\u0915"], answer: "\u0930\u0942\u092a\u0915 (\u0909\u092a\u092e\u0947\u092f \u0915\u094b \u0938\u0940\u0927\u0947 \u0909\u092a\u092e\u093e\u0928 \u092c\u0924\u093e\u092f\u093e)", explanation: "\u0930\u0942\u092a\u0915 \u092e\u0947\u0902 \"\u091c\u0948\u0938\u0947\"/\"\u092e\u093e\u0928\u094b\" \u0915\u093e \u092a\u094d\u0930\u092f\u094b\u0917 \u0928 \u0915\u0930\u0915\u0947 \u0938\u0940\u0927\u0947 \u0909\u092a\u092e\u093e\u0928 \u0932\u093f\u092f\u093e \u091c\u093e\u0924\u093e \u0939\u0948\u0964" },
    ],
  },
  "hindi-samman-shikhar": {
    easy: [
      { q: "\u0939\u093f\u0902\u0926\u0940 \u0935\u0930\u094d\u0923\u092e\u093e\u0932\u093e \u092e\u0947\u0902 \u0938\u094d\u0935\u0930\u094b\u0902 \u0915\u0940 \u0938\u0902\u0916\u094d\u092f\u093e \u0915\u093f\u0924\u0928\u0940 \u0939\u094b\u0924\u0940 \u0939\u0948?", options: ["11", "13", "10", "16"], answer: "11", explanation: "\u092e\u093e\u0928\u0915 \u0939\u093f\u0902\u0926\u0940 \u0935\u0930\u094d\u0923\u092e\u093e\u0932\u093e \u092e\u0947\u0902 11 \u0938\u094d\u0935\u0930 \u092e\u093e\u0928\u0947 \u091c\u093e\u0924\u0947 \u0939\u0948\u0902\u0964" },
      { q: "\"\u092a\u0941\u0938\u094d\u0924\u0915\" \u0936\u092c\u094d\u0926 \u092e\u0947\u0902 \u0915\u094c\u0928-\u0938\u0940 \u0938\u0902\u091c\u094d\u091e\u093e \u0939\u0948?", options: ["\u091c\u093e\u0924\u093f\u0935\u093e\u091a\u0915", "\u0935\u094d\u092f\u0915\u094d\u0924\u093f\u0935\u093e\u091a\u0915", "\u092d\u093e\u0935\u0935\u093e\u091a\u0915", "\u0938\u092e\u0942\u0939\u0935\u093e\u091a\u0915"], answer: "\u091c\u093e\u0924\u093f\u0935\u093e\u091a\u0915", explanation: "\u092f\u0939 \u090f\u0915 \u0938\u093e\u092e\u093e\u0928\u094d\u092f \u0935\u0938\u094d\u0924\u0941 (\u0915\u093f\u0924\u093e\u092c) \u0915\u093e \u0928\u093e\u092e \u0939\u0948, \u0907\u0938\u0932\u093f\u090f \u091c\u093e\u0924\u093f\u0935\u093e\u091a\u0915 \u0938\u0902\u091c\u094d\u091e\u093e \u0939\u0948\u0964" },
      { q: "\"\u0938\u0941\u0902\u0926\u0930\" \u0936\u092c\u094d\u0926 \u0915\u093e \u0935\u093f\u0932\u094b\u092e \u0915\u094d\u092f\u093e \u0939\u0948?", options: ["\u0915\u0941\u0930\u0942\u092a", "\u0938\u093e\u0925\u0940", "\u0932\u0902\u092c\u093e", "\u091b\u094b\u091f\u093e"], answer: "\u0915\u0941\u0930\u0942\u092a", explanation: "\"\u0938\u0941\u0902\u0926\u0930\" \u0914\u0930 \"\u0915\u0941\u0930\u0942\u092a\" \u090f\u0915-\u0926\u0942\u0938\u0930\u0947 \u0915\u0947 \u0935\u093f\u092a\u0930\u0940\u0924 \u0939\u0948\u0902\u0964" },
      { q: "\"\u0935\u0939 \u0938\u094d\u0915\u0942\u0932 \u091c\u093e\u090f\u0917\u093e\u0964\" \u092e\u0947\u0902 \u0915\u094d\u0930\u093f\u092f\u093e \u0915\u093e \u0915\u093e\u0932 \u0915\u094c\u0928-\u0938\u093e \u0939\u0948?", options: ["\u092d\u0942\u0924\u0915\u093e\u0932", "\u0935\u0930\u094d\u0924\u092e\u093e\u0928 \u0915\u093e\u0932", "\u092d\u0935\u093f\u0937\u094d\u092f\u0915\u093e\u0932", "\u0905\u0938\u092e\u093e\u092a\u0940\u0924"], answer: "\u092d\u0935\u093f\u0937\u094d\u092f\u0915\u093e\u0932", explanation: "\"-\u0917\u093e\" \u092d\u0935\u093f\u0937\u094d\u092f\u0915\u093e\u0932 \u0915\u0940 \u0915\u094d\u0930\u093f\u092f\u093e \u092c\u0928\u093e\u0924\u093e \u0939\u0948\u0964" },
    ],
    medium: [
      { q: "\"\u0906\u0902\u0916\u094b\u0902 \u092e\u0947\u0902 \u0927\u0942\u0932 \u091d\u094b\u0902\u0915\u0928\u093e\" \u092e\u0941\u0939\u093e\u0935\u0930\u0947 \u0915\u093e \u0905\u0930\u094d\u0925 \u0939\u0948:", options: ["\u0927\u094b\u0916\u093e \u0926\u0947\u0928\u093e", "\u0938\u091a \u092c\u094b\u0932\u0928\u093e", "\u0916\u0941\u0936 \u0915\u0930\u0928\u093e", "\u0938\u094b \u091c\u093e\u0928\u093e"], answer: "\u0927\u094b\u0916\u093e \u0926\u0947\u0928\u093e", explanation: "\u092f\u0939 \u092e\u0941\u0939\u093e\u0935\u0930\u093e \u0915\u093f\u0938\u0940 \u0915\u094b \u0927\u094b\u0916\u093e \u0926\u0947\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0909\u092a\u092f\u094b\u0917 \u0939\u094b\u0924\u093e \u0939\u0948\u0964" },
      { q: "\"\u0930\u093e\u092e \u0914\u0930 \u0936\u094d\u092f\u093e\u092e \u0926\u094b\u0928\u094b\u0902 \u0926\u094b\u0938\u094d\u0924 \u0939\u0948\u0902\u0964\" \u2014 \u0930\u0947\u0916\u093e\u0902\u0915\u093f\u0924 \u0936\u092c\u094d\u0926 \u0915\u093e \u092a\u094d\u0930\u0915\u093e\u0930 \u092c\u0924\u093e\u090f\u0902\u0964", options: ["\u091c\u093e\u0924\u093f\u0935\u093e\u091a\u0915 \u0938\u0902\u091c\u094d\u091e\u093e", "\u0935\u093f\u0936\u0947\u0937\u0923", "\u0915\u094d\u0930\u093f\u092f\u093e", "\u0938\u0902\u092f\u094b\u091c\u0915"], answer: "\u0938\u0902\u092f\u094b\u091c\u0915", explanation: "\"\u0914\u0930\" \u0926\u094b \u0936\u092c\u094d\u0926\u094b\u0902/\u0935\u093e\u0915\u094d\u092f\u094b\u0902 \u0915\u094b \u091c\u094b\u0921\u093c\u0928\u0947 \u0935\u093e\u0932\u093e \u0938\u0902\u092f\u094b\u091c\u0915 \u0939\u0948\u0964" },
    ],
    hard: [
      { q: "\"\u091c\u094b \u0938\u094b\u0947\u0917\u093e, \u0938\u094b \u0916\u094b\u090f\u0917\u093e\u0964\" \u092f\u0939 \u0928\u093f\u092e\u094d\u0928\u0932\u093f\u0916\u093f\u0924 \u092e\u0947\u0902 \u0938\u0947 \u0915\u093f\u0938 \u092a\u094d\u0930\u0915\u093e\u0930 \u0915\u093e \u0935\u093e\u0915\u094d\u092f \u0939\u0948?", options: ["\u0938\u0930\u0932 \u0935\u093e\u0915\u094d\u092f", "\u092e\u093f\u0936\u094d\u0930 \u0935\u093e\u0915\u094d\u092f", "\u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u0935\u093e\u0915\u094d\u092f", "\u0928\u093f\u0937\u0947\u0927\u0935\u093e\u091a\u0915 \u0935\u093e\u0915\u094d\u092f"], answer: "\u092e\u093f\u0936\u094d\u0930 \u0935\u093e\u0915\u094d\u092f", explanation: "\u092f\u0939\u093e\u0902 \u090f\u0915 \u0906\u0936\u094d\u0930\u093f\u0924 \u0909\u092a\u0935\u093e\u0915\u094d\u092f (\"\u091c\u094b...\u0938\u094b\") \u092e\u0941\u0916\u094d\u092f \u0935\u093e\u0915\u094d\u092f \u092a\u0930 \u0928\u093f\u0930\u094d\u092d\u0930 \u0939\u0948, \u0907\u0938\u0932\u093f\u090f \u092f\u0939 \u092e\u093f\u0936\u094d\u0930 \u0935\u093e\u0915\u094d\u092f \u0939\u0948\u0964" },
      { q: "\"\u0906\u0938\u092e\u093e\u0928\" \u0936\u092c\u094d\u0926 \u0915\u093e \u0935\u093f\u0932\u094b\u092e \u0915\u094d\u092f\u093e \u0939\u0948?", options: ["\u0915\u0920\u093f\u0928", "\u0938\u0930\u0932", "\u0938\u0941\u0902\u0926\u0930", "\u0924\u0947\u091c"], answer: "\u0915\u0920\u093f\u0928", explanation: "\"\u0906\u0938\u093e\u0928\" \u0914\u0930 \"\u0915\u0920\u093f\u0928\" \u0935\u093f\u092a\u0930\u0940\u0924\u093e\u0930\u094d\u0925\u0940 \u0936\u092c\u094d\u0926 \u0939\u0948\u0902\u0964" },
    ],
    expert: [
      { q: "\u0928\u093f\u092e\u094d\u0928\u0932\u093f\u0916\u093f\u0924 \u092e\u0947\u0902 \u0938\u0947 \u0915\u094c\u0928-\u0938\u093e \u0936\u092c\u094d\u0926 \u0924\u0924\u094d\u0938\u092e \u0938\u094d\u0930\u094b\u0924 (\u0938\u0902\u0938\u094d\u0915\u0943\u0924 \u0938\u0947 \u091c\u094d\u092f\u094b\u0902 \u0915\u093e \u0924\u094d\u092f\u094b\u0902 \u0906\u092f\u093e) \u0939\u0948?", options: ["\u0938\u0942\u0930\u094d\u092f", "\u0938\u0942\u0930\u091c", "\u091a\u093e\u0902\u0926", "\u0930\u093e\u0924"], answer: "\u0938\u0942\u0930\u094d\u092f", explanation: "\"\u0938\u0942\u0930\u094d\u092f\" \u0938\u0902\u0938\u094d\u0915\u0943\u0924 \u0938\u0947 \u091c\u094d\u092f\u094b\u0902 \u0915\u093e \u0924\u094d\u092f\u094b\u0902 \u0906\u092f\u093e \u0924\u0924\u094d\u0938\u092e \u0936\u092c\u094d\u0926 \u0939\u0948, \u091c\u092c\u0915\u093f \"\u0938\u0942\u0930\u091c\" \u0924\u0926\u094d\u092d\u0935 (\u092c\u0926\u0932\u093e \u0939\u0941\u0906 \u0930\u0942\u092a) \u0939\u0948\u0964" },
    ],
  },

  // --- Tamil -----------------------------------------------------------
  "ezhuthu-thittam": {
    easy: [
      { q: "à®¤à®®à®¿à®´à¯ à®®à¯Šà®´à®¿à®¯à®¿à®²à¯ à®‰à®¯à®¿à®°à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ à®Žà®¤à¯à®¤à®©à¯ˆ?", options: ["10", "12", "18", "247"], answer: "12", explanation: "à®¤à®®à®¿à®´à®¿à®²à¯ à®…,à®†,à®‡,à®ˆ,à®‰,à®Š,à®Ž,à®,à®,à®’,à®“,à®” à®Žà®© 12 à®‰à®¯à®¿à®°à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ à®‰à®³à¯à®³à®©." },
      { q: "à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à®¿à®©à¯ à®Žà®£à¯à®£à®¿à®•à¯à®•à¯ˆ à®Žà®¤à¯à®¤à®©à¯ˆ?", options: ["12", "18", "216", "247"], answer: "18", explanation: "à®¤à®®à®¿à®´à®¿à®²à¯ à®®à¯Šà®¤à¯à®¤à®®à¯ 18 à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ à®‰à®³à¯à®³à®©." },
      { q: "'à®•à¯' à®Žà®©à¯à®ªà®¤à¯ à®Žà®¨à¯à®¤ à®µà®•à¯ˆ à®Žà®´à¯à®¤à¯à®¤à¯?", options: ["à®‰à®¯à®¿à®°à¯ à®Žà®´à¯à®¤à¯à®¤à¯", "à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯", "à®‰à®¯à®¿à®°à¯à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯", "à®†à®¯à¯à®¤ à®Žà®´à¯à®¤à¯à®¤à¯"], answer: "à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯", explanation: "à®ªà¯à®³à¯à®³à®¿à®¯à¯à®Ÿà®©à¯ à®¤à®©à®¿à®¤à¯à®¤à¯ à®¨à®¿à®±à¯à®•à¯à®®à¯ à®Žà®´à¯à®¤à¯à®¤à¯ à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯ à®Žà®©à®ªà¯à®ªà®Ÿà¯à®®à¯." },
      { q: "True or False: à®¤à®®à®¿à®´à®¿à®²à¯ à®®à¯Šà®¤à¯à®¤ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à®¿à®©à¯ à®Žà®£à¯à®£à®¿à®•à¯à®•à¯ˆ 247.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "12 à®‰à®¯à®¿à®°à¯ + 18 à®®à¯†à®¯à¯ + 216 à®‰à®¯à®¿à®°à¯à®®à¯†à®¯à¯ + 1 à®†à®¯à¯à®¤à®®à¯ = 247." },
    ],
    medium: [
      { q: "'à®•' à®Žà®©à¯à®ªà®¤à¯ à®Žà®¨à¯à®¤ à®Žà®´à¯à®¤à¯à®¤à¯ à®µà®•à¯ˆ?", options: ["à®‰à®¯à®¿à®°à¯ à®Žà®´à¯à®¤à¯à®¤à¯", "à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯", "à®‰à®¯à®¿à®°à¯à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯", "à®†à®¯à¯à®¤ à®Žà®´à¯à®¤à¯à®¤à¯"], answer: "à®‰à®¯à®¿à®°à¯à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯", explanation: "à®®à¯†à®¯à¯à®¯à¯à®®à¯ à®‰à®¯à®¿à®°à¯à®®à¯ à®šà¯‡à®°à¯à®¨à¯à®¤à¯ à®µà®°à¯à®®à¯ à®Žà®´à¯à®¤à¯à®¤à¯ à®‰à®¯à®¿à®°à¯à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯ à®Žà®©à®ªà¯à®ªà®Ÿà¯à®®à¯ (à®•à¯ + à®… = à®•)." },
      { q: "à®‰à®¯à®¿à®°à¯à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à®¿à®©à¯ à®®à¯Šà®¤à¯à®¤ à®Žà®£à¯à®£à®¿à®•à¯à®•à¯ˆ?", options: ["108", "216", "144", "192"], answer: "216", explanation: "18 à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ x 12 à®‰à®¯à®¿à®°à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ = 216 à®‰à®¯à®¿à®°à¯à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯." },
      { q: "à®†à®¯à¯à®¤ à®Žà®´à¯à®¤à¯à®¤à®¿à®©à¯ à®•à¯à®±à®¿à®¯à¯€à®Ÿà¯ à®Žà®¤à¯?", options: ["à®ƒ", "à®¸à¯à®°à¯€", "à®•à¯à®·", "à®œ"], answer: "à®ƒ", explanation: "à®ƒ (à®†à®¯à¯à®¤à®®à¯) à®¤à®®à®¿à®´à®¿à®©à¯ à®¤à®©à®¿à®šà¯ à®šà®¿à®±à®ªà¯à®ªà¯ à®Žà®´à¯à®¤à¯à®¤à®¾à®•à¯à®®à¯." },
      { q: "___ + à®… = à®• (à®Žà®´à¯à®¤à¯à®¤à¯ à®šà¯‡à®°à¯à®•à¯à®•à¯ˆ)", type: "fill_blank", answer: "à®•à¯", explanation: "à®®à¯†à®¯à¯à®¯à¯†à®´à¯à®¤à¯à®¤à¯ 'à®•à¯' à®‰à®Ÿà®©à¯ à®‰à®¯à®¿à®°à¯ 'à®…' à®šà¯‡à®°à¯à®¨à¯à®¤à¯ 'à®•' à®‰à®¯à®¿à®°à¯à®®à¯†à®¯à¯ à®Žà®´à¯à®¤à¯à®¤à¯ à®‰à®°à¯à®µà®¾à®•à®¿à®±à®¤à¯." },
    ],
    hard: [
      { q: "'à®¸à¯, à®œà¯, à®·à¯, à®¹à¯, à®•à¯à®·' à®ªà¯‹à®©à¯à®± à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ à®Žà®© à®…à®´à¯ˆà®•à¯à®•à®ªà¯à®ªà®Ÿà¯à®•à®¿à®©à¯à®±à®©?", options: ["à®µà®Ÿà®®à¯Šà®´à®¿ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯", "à®•à®¿à®°à®¨à¯à®¤ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯", "à®¤à®®à®¿à®´à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯", "à®†à®¯à¯à®¤ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯"], answer: "à®•à®¿à®°à®¨à¯à®¤ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯", explanation: "à®ªà®¿à®± à®®à¯Šà®´à®¿à®šà¯ à®šà¯Šà®±à¯à®•à®³à¯ˆ à®Žà®´à¯à®¤ à®ªà®¯à®©à¯à®ªà®Ÿà¯à®®à¯ à®‡à®¨à¯à®¤ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ à®•à®¿à®°à®¨à¯à®¤ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ à®Žà®©à®ªà¯à®ªà®Ÿà¯à®®à¯." },
      { q: "'à®”' à®Žà®©à¯à®± à®‰à®¯à®¿à®°à¯ à®Žà®´à¯à®¤à¯à®¤à®¿à®©à¯ à®µà®°à®¿à®šà¯ˆ à®Žà®£à¯ à®Žà®¤à¯?", options: ["10", "11", "12", "9"], answer: "12", explanation: "à®…,à®†,à®‡,à®ˆ,à®‰,à®Š,à®Ž,à®,à®,à®’,à®“,à®” à®µà®°à®¿à®šà¯ˆà®¯à®¿à®²à¯ à®” 12-à®†à®µà®¤à¯ à®Žà®´à¯à®¤à¯à®¤à¯." },
    ],
    expert: [
      { q: "à®®à¯Šà®¤à¯à®¤ à®¤à®®à®¿à®´à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à®¿à®©à¯ à®Žà®£à¯à®£à®¿à®•à¯à®•à¯ˆà®¯à®¿à®²à¯ à®•à®¿à®°à®¨à¯à®¤ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ˆà®¯à¯à®®à¯ à®šà¯‡à®°à¯à®¤à¯à®¤à®¾à®²à¯ à®Žà®©à¯à®© à®†à®•à¯à®®à¯?", options: ["247", "253", "260", "258"], answer: "253", explanation: "247 à®¤à®®à®¿à®´à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯à®Ÿà®©à¯ 6 à®•à®¿à®°à®¨à¯à®¤ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ (à®œ,à®·,à®¸,à®¹,à®•à¯à®·,à®¸à¯à®°à¯€) à®šà¯‡à®°à¯à®•à¯à®•à¯à®®à¯à®ªà¯‹à®¤à¯ 253 à®†à®•à¯à®®à¯." },
    ],
  },
  "sol-vanam": {
    easy: [
      { q: "'à®‡à®©à¯à®ªà®®à¯' à®Žà®©à¯à®ªà®¤à®©à¯ à®’à®¤à¯à®¤ à®ªà¯Šà®°à¯à®³à¯ à®šà¯Šà®²à¯ à®Žà®¤à¯?", options: ["à®®à®•à®¿à®´à¯à®šà¯à®šà®¿", "à®¤à¯à®©à¯à®ªà®®à¯", "à®•à¯‹à®ªà®®à¯", "à®šà¯‹à®•à®®à¯"], answer: "à®®à®•à®¿à®´à¯à®šà¯à®šà®¿", explanation: "'à®‡à®©à¯à®ªà®®à¯' à®®à®±à¯à®±à¯à®®à¯ 'à®®à®•à®¿à®´à¯à®šà¯à®šà®¿' à®’à®°à¯‡ à®ªà¯Šà®°à¯à®³à¯ à®¤à®°à¯à®®à¯ à®šà¯Šà®±à¯à®•à®³à¯." },
      { q: "'à®¨à®²à¯à®²à®¤à¯' à®Žà®©à¯à®ªà®¤à®©à¯ à®Žà®¤à®¿à®°à¯à®šà¯à®šà¯Šà®²à¯ à®Žà®¤à¯?", options: ["à®•à¯†à®Ÿà¯à®Ÿà®¤à¯", "à®ªà¯†à®°à®¿à®¯à®¤à¯", "à®šà®¿à®±à®¿à®¯à®¤à¯", "à®ªà¯à®¤à®¿à®¯à®¤à¯"], answer: "à®•à¯†à®Ÿà¯à®Ÿà®¤à¯", explanation: "'à®¨à®²à¯à®²à®¤à¯' - 'à®•à¯†à®Ÿà¯à®Ÿà®¤à¯' à®Žà®©à¯à®ªà®© à®Žà®¤à®¿à®°à¯à®šà¯à®šà¯Šà®±à¯à®•à®³à¯." },
      { q: "à®¤à¯Šà®Ÿà®°à¯à®ªà¯à®Ÿà¯ˆà®¯ à®‡à®°à¯ à®ªà¯†à®¯à®°à¯à®šà¯à®šà¯Šà®±à¯à®•à®³à¯ à®‡à®£à¯ˆà®¨à¯à®¤à¯ à®’à®°à¯ à®ªà¯à®¤à®¿à®¯ à®ªà¯Šà®°à¯à®³à¯ à®¤à®°à¯à®µà®¤à¯ à®Žà®šà¯à®šà¯Šà®²à¯ à®Žà®©à®ªà¯à®ªà®Ÿà¯à®®à¯?", options: ["à®‡à®£à¯ˆà®šà¯à®šà¯Šà®²à¯", "à®Žà®¤à®¿à®°à¯à®šà¯à®šà¯Šà®²à¯", "à®µà®¿à®©à¯ˆà®šà¯à®šà¯Šà®²à¯", "à®ªà¯†à®¯à®°à®Ÿà¯ˆ"], answer: "à®‡à®£à¯ˆà®šà¯à®šà¯Šà®²à¯", explanation: "'à®†à®Ÿà¯ à®®à®¾à®Ÿà¯' à®ªà¯‹à®©à¯à®± à®¤à¯Šà®Ÿà®°à¯à®ªà¯à®Ÿà¯ˆà®¯ à®‡à®°à¯ à®šà¯Šà®±à¯à®•à®³à®¿à®©à¯ à®‡à®£à¯ˆà®µà¯ à®‡à®£à¯ˆà®šà¯à®šà¯Šà®²à¯ à®Žà®©à®ªà¯à®ªà®Ÿà¯à®®à¯." },
      { q: "True or False: 'à®•à¯à®±à¯ˆ' à®®à®±à¯à®±à¯à®®à¯ 'à®¨à®¿à®±à¯ˆ' à®’à®¤à¯à®¤ à®ªà¯Šà®°à¯à®³à¯ à®šà¯Šà®±à¯à®•à®³à¯.", type: "true_false", options: ["True", "False"], answer: "False", explanation: "'à®•à¯à®±à¯ˆ' à®®à®±à¯à®±à¯à®®à¯ 'à®¨à®¿à®±à¯ˆ' à®Žà®¤à®¿à®°à¯à®šà¯à®šà¯Šà®±à¯à®•à®³à¯, à®’à®¤à¯à®¤ à®ªà¯Šà®°à¯à®³à¯ à®šà¯Šà®±à¯à®•à®³à¯ à®…à®²à¯à®²." },
    ],
    medium: [
      { q: "'à®†à®Ÿà¯ à®®à¯‡à®¯à¯à®šà¯à®šà®²à¯' à®Žà®©à¯à®ªà®¤à®¿à®²à¯à®³à¯à®³ 'à®†à®Ÿà¯'à®µà¯à®•à¯à®•à¯à®®à¯ 'à®†à®Ÿà¯ (à®¨à®Ÿà®©à®®à®¾à®Ÿà¯)' à®Žà®©à¯à®ªà®¤à®±à¯à®•à¯à®®à¯ à®‰à®³à¯à®³ à®¤à¯Šà®Ÿà®°à¯à®ªà¯?", options: ["à®¨à®¾à®©à®¾à®°à¯à®¤à¯à®¤à®šà¯ à®šà¯Šà®²à¯", "à®’à®¤à¯à®¤ à®ªà¯Šà®°à¯à®³à¯ à®šà¯Šà®²à¯", "à®Žà®¤à®¿à®°à¯à®šà¯à®šà¯Šà®²à¯", "à®‡à®£à¯ˆà®šà¯à®šà¯Šà®²à¯"], answer: "à®¨à®¾à®©à®¾à®°à¯à®¤à¯à®¤à®šà¯ à®šà¯Šà®²à¯", explanation: "à®’à®°à¯‡ à®Žà®´à¯à®¤à¯à®¤à¯ à®µà®Ÿà®¿à®µà®¿à®²à¯ à®µà¯†à®µà¯à®µà¯‡à®±à¯ à®ªà¯Šà®°à¯à®³à¯ à®¤à®°à¯à®®à¯ à®šà¯Šà®±à¯à®•à®³à¯ à®¨à®¾à®©à®¾à®°à¯à®¤à¯à®¤à®šà¯ à®šà¯Šà®±à¯à®•à®³à¯ à®Žà®©à®ªà¯à®ªà®Ÿà¯à®®à¯." },
      { q: "'à®…à®£à®¿à®²à¯ à®µà®¿à®´à¯à®¨à¯à®¤à®¾à®²à¯à®®à¯ à®®à®°à®¤à¯à®¤à®¿à®²à¯à®¤à®¾à®©à¯' à®Žà®©à¯à®± à®ªà®´à®®à¯Šà®´à®¿à®¯à®¿à®©à¯ à®ªà¯Šà®°à¯à®³à¯?", options: ["à®¤à®¿à®±à®®à¯ˆà®¯à¯à®³à¯à®³à®µà®°à¯ à®¤à®µà®±à®¿à®©à®¾à®²à¯à®®à¯ à®¤à®©à¯ à®¤à®¿à®±à®®à¯ˆà®¯à¯ˆ à®‡à®´à®•à¯à®• à®®à®¾à®Ÿà¯à®Ÿà®¾à®°à¯", "à®…à®£à®¿à®²à¯ à®®à®°à®¤à¯à®¤à®¿à®²à¯ à®µà®¾à®´à¯à®®à¯", "à®µà®¿à®´à¯à®µà®¤à¯ à®¤à®µà®±à¯", "à®®à®°à®®à¯ à®®à¯à®•à¯à®•à®¿à®¯à®®à¯"], answer: "à®¤à®¿à®±à®®à¯ˆà®¯à¯à®³à¯à®³à®µà®°à¯ à®¤à®µà®±à®¿à®©à®¾à®²à¯à®®à¯ à®¤à®©à¯ à®¤à®¿à®±à®®à¯ˆà®¯à¯ˆ à®‡à®´à®•à¯à®• à®®à®¾à®Ÿà¯à®Ÿà®¾à®°à¯", explanation: "à®‡à®¨à¯à®¤à®ªà¯ à®ªà®´à®®à¯Šà®´à®¿ à®¤à®¿à®±à®®à¯ˆà®¯à®¾à®©à®µà®°à®¿à®©à¯ à®‡à®¯à®²à¯à®ªà®¾à®© à®¤à®¿à®±à®©à¯ˆà®•à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯." },
      { q: "'à®•à®£à¯à®£à®¿à®²à¯ à®®à®£à¯ à®…à®³à¯à®³à®¿à®ªà¯ à®ªà¯‹à®Ÿà¯à®¤à®²à¯' à®®à¯à®¤à®²à®¿à®¯ à®¤à¯Šà®Ÿà®°à¯à®•à®³à¯ à®Žà®µà¯ˆ à®Žà®©à®ªà¯à®ªà®Ÿà¯à®®à¯?", options: ["à®®à®°à®ªà¯à®¤à¯à®¤à¯Šà®Ÿà®°à¯", "à®ªà®´à®®à¯Šà®´à®¿", "à®’à®ªà¯à®ªà¯€à®Ÿà¯", "à®…à®£à®¿"], answer: "à®®à®°à®ªà¯à®¤à¯à®¤à¯Šà®Ÿà®°à¯", explanation: "à®µà®´à®•à¯à®•à®¾à®±à®¾à®• à®ªà®¯à®©à¯à®ªà®Ÿà¯à®®à¯ à®‡à®¤à¯à®¤à®•à¯ˆà®¯ à®šà¯Šà®±à¯à®±à¯Šà®Ÿà®°à¯à®•à®³à¯ à®®à®°à®ªà¯à®¤à¯à®¤à¯Šà®Ÿà®°à¯ à®Žà®©à®ªà¯à®ªà®Ÿà¯à®®à¯." },
      { q: "'à®•à®²à¯' à®Žà®©à¯à®± à®šà¯Šà®²à¯à®²à¯à®•à¯à®•à¯ à®Žà®¤à®¿à®°à¯à®šà¯à®šà¯Šà®²à¯ ___ (à®ªà®žà¯à®šà¯ à®ªà¯‹à®©à¯à®±à¯ à®®à¯†à®©à¯à®®à¯ˆà®¯à®¾à®©à®¤à¯).", type: "fill_blank", answer: "à®ªà®žà¯à®šà¯", explanation: "'à®•à®²à¯' à®•à®Ÿà®¿à®©à®¤à¯à®¤à®©à¯à®®à¯ˆà®¯à¯ˆà®¯à¯à®®à¯ 'à®ªà®žà¯à®šà¯' à®®à¯†à®©à¯à®®à¯ˆà®¯à¯ˆà®¯à¯à®®à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯ à®Žà®¤à®¿à®°à¯†à®¤à®¿à®°à¯à®šà¯ à®šà¯Šà®±à¯à®•à®³à¯." },
    ],
    hard: [
      { q: "'à®†à®©à¯ˆ à®µà®°à¯à®®à¯ à®ªà®¿à®©à¯à®©à¯‡, à®®à®£à®¿à®¯à¯‹à®šà¯ˆ à®µà®°à¯à®®à¯ à®®à¯à®©à¯à®©à¯‡' à®ªà®´à®®à¯Šà®´à®¿à®¯à®¿à®©à¯ à®•à®°à¯à®¤à¯à®¤à¯?", options: ["à®ªà¯†à®°à®¿à®¯ à®šà¯†à®¯à®²à¯à®•à¯à®•à¯ à®®à¯à®©à¯ à®…à®±à®¿à®•à¯à®±à®¿ à®¤à¯†à®°à®¿à®¯à¯à®®à¯", "à®¯à®¾à®©à¯ˆ à®ªà¯†à®°à®¿à®¯à®¤à¯", "à®®à®£à®¿ à®’à®²à®¿à®•à¯à®•à¯à®®à¯", "à®Žà®¤à¯à®µà¯à®®à¯ à®‡à®²à¯à®²à¯ˆ"], answer: "à®ªà¯†à®°à®¿à®¯ à®šà¯†à®¯à®²à¯à®•à¯à®•à¯ à®®à¯à®©à¯ à®…à®±à®¿à®•à¯à®±à®¿ à®¤à¯†à®°à®¿à®¯à¯à®®à¯", explanation: "à®®à¯à®•à¯à®•à®¿à®¯à®®à®¾à®© à®’à®©à¯à®±à¯ à®¨à®¿à®•à®´à¯à®®à¯ à®®à¯à®©à¯ à®…à®¤à®±à¯à®•à®¾à®© à®…à®±à®¿à®•à¯à®±à®¿ à®¤à¯†à®©à¯à®ªà®Ÿà¯à®®à¯ à®Žà®©à¯à®ªà®¤à¯ˆà®•à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯." },
      { q: "'à®•à¯ˆ à®¨à¯€à®Ÿà¯à®Ÿà¯à®¤à®²à¯' à®Žà®©à¯à®± à®®à®°à®ªà¯à®¤à¯à®¤à¯Šà®Ÿà®°à®¿à®©à¯ à®ªà¯Šà®°à¯à®³à¯?", options: ["à®‰à®¤à®µà®¿ à®•à¯‡à®Ÿà¯à®Ÿà®²à¯", "à®•à¯ˆà®¯à¯ˆ à®¨à¯€à®Ÿà¯à®Ÿà¯à®¤à®²à¯", "à®•à¯‹à®ªà®ªà¯à®ªà®Ÿà¯à®¤à®²à¯", "à®šà®£à¯à®Ÿà¯ˆà®¯à®¿à®Ÿà¯à®¤à®²à¯"], answer: "à®‰à®¤à®µà®¿ à®•à¯‡à®Ÿà¯à®Ÿà®²à¯", explanation: "à®‡à®¤à¯ à®’à®°à¯à®µà®°à®¿à®Ÿà®®à¯ à®‰à®¤à®µà®¿ à®µà¯‡à®£à¯à®Ÿà¯à®¤à®²à¯ˆà®•à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯ à®µà®´à®•à¯à®•à¯à®šà¯ à®šà¯Šà®²à¯." },
    ],
    expert: [
      { q: "'à®“à®°à¯†à®´à¯à®¤à¯à®¤à¯ à®’à®°à¯ à®®à¯Šà®´à®¿' à®Žà®©à¯à®ªà®¤à®±à¯à®•à¯ à®¤à®®à®¿à®´à®¿à®²à¯ à®šà®¿à®±à®¨à¯à®¤ à®Žà®Ÿà¯à®¤à¯à®¤à¯à®•à¯à®•à®¾à®Ÿà¯à®Ÿà¯ à®Žà®¤à¯?", options: ["à®† (à®ªà®šà¯)", "à®®à®°à®®à¯", "à®ªà¯à®¤à¯à®¤à®•à®®à¯", "à®µà¯€à®Ÿà¯"], answer: "à®† (à®ªà®šà¯)", explanation: "à®’à®±à¯à®±à¯ˆ à®Žà®´à¯à®¤à¯à®¤à¯‡ à®’à®°à¯ à®®à¯à®´à¯à®®à¯ˆà®¯à®¾à®© à®šà¯Šà®²à¯à®²à®¾à®• à®ªà¯Šà®°à¯à®³à¯ à®¤à®°à¯à®®à¯ à®¨à®¿à®²à¯ˆà®•à¯à®•à¯ 'à®†' (à®ªà®šà¯) à®šà®¿à®±à®¨à¯à®¤ à®Žà®Ÿà¯à®¤à¯à®¤à¯à®•à¯à®•à®¾à®Ÿà¯à®Ÿà¯." },
    ],
  },
  "ilakkanam-kunru": {
    easy: [
      { q: "'à®®à®°à®®à¯' à®Žà®©à¯à®ªà®¤à¯ à®Žà®¨à¯à®¤ à®µà®•à¯ˆà®šà¯ à®šà¯Šà®²à¯?", options: ["à®ªà¯†à®¯à®°à¯à®šà¯à®šà¯Šà®²à¯", "à®µà®¿à®©à¯ˆà®šà¯à®šà¯Šà®²à¯", "à®‡à®Ÿà¯ˆà®šà¯à®šà¯Šà®²à¯", "à®‰à®°à®¿à®šà¯à®šà¯Šà®²à¯"], answer: "à®ªà¯†à®¯à®°à¯à®šà¯à®šà¯Šà®²à¯", explanation: "à®ªà¯Šà®°à¯à®³à®¿à®©à¯ à®ªà¯†à®¯à®°à¯ˆà®•à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯ à®šà¯Šà®²à¯ à®ªà¯†à®¯à®°à¯à®šà¯à®šà¯Šà®²à¯ à®Žà®©à®ªà¯à®ªà®Ÿà¯à®®à¯." },
      { q: "'à®“à®Ÿà¯à®•à®¿à®±à®¾à®©à¯' à®Žà®©à¯à®ªà®¤à¯ à®Žà®¨à¯à®¤ à®µà®•à¯ˆà®šà¯ à®šà¯Šà®²à¯?", options: ["à®ªà¯†à®¯à®°à¯à®šà¯à®šà¯Šà®²à¯", "à®µà®¿à®©à¯ˆà®šà¯à®šà¯Šà®²à¯", "à®‰à®°à®¿à®šà¯à®šà¯Šà®²à¯", "à®‡à®Ÿà¯ˆà®šà¯à®šà¯Šà®²à¯"], answer: "à®µà®¿à®©à¯ˆà®šà¯à®šà¯Šà®²à¯", explanation: "à®šà¯†à®¯à®²à¯ˆà®•à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯ à®šà¯Šà®²à¯ à®µà®¿à®©à¯ˆà®šà¯à®šà¯Šà®²à¯ à®Žà®©à®ªà¯à®ªà®Ÿà¯à®®à¯." },
      { q: "à®¤à®®à®¿à®´à®¿à®²à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ à®‰à®°à¯à®ªà¯à®•à®³à¯ à®Žà®¤à¯à®¤à®©à¯ˆ?", options: ["6", "7", "8", "5"], answer: "8", explanation: "à®¤à®®à®¿à®´à¯ à®‡à®²à®•à¯à®•à®£à®¤à¯à®¤à®¿à®²à¯ à®Žà®Ÿà¯à®Ÿà¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆà®•à®³à¯ à®‰à®³à¯à®³à®©." },
      { q: "True or False: 'à®¨à®¾à®©à¯, à®¨à¯€, à®…à®µà®©à¯' à®†à®•à®¿à®¯à®µà¯ˆ à®ªà¯†à®¯à®°à¯à®šà¯à®šà¯Šà®±à¯à®•à®³à¯.", type: "true_false", options: ["True", "False"], answer: "False", explanation: "à®‡à®µà¯ˆ à®šà¯à®Ÿà¯à®Ÿà¯à®ªà¯à®ªà¯†à®¯à®°à¯à®•à®³à¯ (à®ªà®¿à®°à®¤à®¿à®ªà¯à®ªà¯†à®¯à®°à¯à®•à®³à¯), à®¤à®©à®¿à®ªà¯ à®ªà¯†à®¯à®°à¯à®šà¯à®šà¯Šà®±à¯à®•à®³à¯ à®…à®²à¯à®²." },
    ],
    medium: [
      { q: "'à®®à®°à®¤à¯à®¤à¯ˆ' à®Žà®©à¯à®± à®šà¯Šà®²à¯à®²à®¿à®²à¯ à®‰à®³à¯à®³ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ à®‰à®°à¯à®ªà¯ à®Žà®¤à¯?", options: ["à® (à®‡à®°à®£à¯à®Ÿà®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ)", "à®•à¯ (à®¨à®¾à®©à¯à®•à®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ)", "à®‡à®©à¯ (à®†à®±à®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ)", "à®’à®Ÿà¯ (à®®à¯‚à®©à¯à®±à®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ)"], answer: "à® (à®‡à®°à®£à¯à®Ÿà®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ)", explanation: "'à®' à®µà®¿à®•à¯à®¤à®¿ à®šà¯†à®¯à®ªà¯à®ªà®Ÿà¯à®ªà¯Šà®°à¯à®³à¯ˆà®•à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯ à®‡à®°à®£à¯à®Ÿà®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ à®‰à®°à¯à®ªà¯." },
      { q: "'à®ªà¯ˆà®¯à®©à¯à®•à®³à¯' à®Žà®©à¯à®ªà®¤à®¿à®²à¯ à®ªà®©à¯à®®à¯ˆ à®µà®¿à®•à¯à®¤à®¿ à®Žà®¤à¯?", options: ["à®•à®³à¯", "à®…à®°à¯", "à®°à¯", "à®†à®²à¯"], answer: "à®•à®³à¯", explanation: "'à®•à®³à¯' à®Žà®©à¯à®± à®µà®¿à®•à¯à®¤à®¿ à®ªà®©à¯à®®à¯ˆà®¯à¯ˆà®•à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯." },
      { q: "'à®ªà®Ÿà®¿à®¤à¯à®¤à®¾à®©à¯' à®Žà®©à¯à®± à®µà®¿à®©à¯ˆà®šà¯à®šà¯Šà®²à¯à®²à®¿à®©à¯ à®•à®¾à®²à®®à¯ à®Žà®¤à¯?", options: ["à®‡à®±à®¨à¯à®¤ à®•à®¾à®²à®®à¯", "à®¨à®¿à®•à®´à¯ à®•à®¾à®²à®®à¯", "à®Žà®¤à®¿à®°à¯ à®•à®¾à®²à®®à¯", "à®ªà¯Šà®¤à¯à®•à¯ à®•à®¾à®²à®®à¯"], answer: "à®‡à®±à®¨à¯à®¤ à®•à®¾à®²à®®à¯", explanation: "'-à®¤à¯-' à®‡à®±à®¨à¯à®¤à®•à®¾à®² à®‡à®Ÿà¯ˆà®¨à®¿à®²à¯ˆ à®†à®•à¯à®®à¯." },
      { q: "'à®°à®¾à®®à®©à¯ ___ à®ªà¯à®¤à¯à®¤à®•à®®à¯ à®•à¯Šà®Ÿà¯à®¤à¯à®¤à®¾à®©à¯' (à®¨à®¾à®©à¯à®•à®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ à®‰à®°à¯à®ªà¯).", type: "fill_blank", answer: "à®•à¯à®•à¯", explanation: "'à®•à¯à®•à¯' à®•à¯Šà®Ÿà¯ˆ à®ªà¯Šà®°à¯à®³à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯ à®¨à®¾à®©à¯à®•à®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ à®‰à®°à¯à®ªà¯." },
    ],
    hard: [
      { q: "'à®®à®´à¯ˆà®¯à®¾à®²à¯ à®ªà®¯à®¿à®°à¯ à®µà®³à®°à¯à®¨à¯à®¤à®¤à¯' - à®‡à®¤à®¿à®²à¯ 'à®®à®´à¯ˆà®¯à®¾à®²à¯' à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ?", options: ["à®®à¯‚à®©à¯à®±à®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ (à®•à®°à¯à®µà®¿)", "à®‡à®°à®£à¯à®Ÿà®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ", "à®à®´à®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ", "à®†à®±à®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ"], answer: "à®®à¯‚à®©à¯à®±à®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ (à®•à®°à¯à®µà®¿)", explanation: "'à®†à®²à¯' à®•à®°à¯à®µà®¿à®ªà¯ à®ªà¯Šà®°à¯à®³à¯ à®¤à®°à¯à®®à¯ à®®à¯‚à®©à¯à®±à®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ à®‰à®°à¯à®ªà¯." },
      { q: "à®šà¯†à®¯à®ªà¯à®ªà®Ÿà¯à®ªà¯Šà®°à¯à®³à¯à®Ÿà®©à¯ à®•à¯‚à®Ÿà®¿à®¯ à®µà®¾à®•à¯à®•à®¿à®¯ à®…à®®à¯ˆà®ªà¯à®ªà¯ à®Žà®¤à¯ˆà®•à¯ à®•à®¾à®Ÿà¯à®Ÿà¯à®®à¯?", options: ["à®¤à®©à¯à®µà®¿à®©à¯ˆ/à®ªà®¿à®±à®µà®¿à®©à¯ˆ à®µà¯‡à®±à¯à®ªà®¾à®Ÿà¯", "à®Žà®£à¯ à®…à®®à¯ˆà®ªà¯à®ªà¯", "à®•à®¾à®²à®®à¯ à®µà¯‡à®±à¯à®ªà®¾à®Ÿà¯", "à®‡à®Ÿà¯ˆà®šà¯à®šà¯Šà®²à¯ à®…à®®à¯ˆà®ªà¯à®ªà¯"], answer: "à®¤à®©à¯à®µà®¿à®©à¯ˆ/à®ªà®¿à®±à®µà®¿à®©à¯ˆ à®µà¯‡à®±à¯à®ªà®¾à®Ÿà¯", explanation: "à®šà¯†à®¯à®ªà¯à®ªà®Ÿà¯à®ªà¯Šà®°à¯à®³à®¿à®©à¯ à®‡à®°à¯à®ªà¯à®ªà¯ à®¤à®©à¯à®µà®¿à®©à¯ˆ/à®ªà®¿à®±à®µà®¿à®©à¯ˆ à®µà¯‡à®±à¯à®ªà®¾à®Ÿà¯à®Ÿà¯ˆà®•à¯ à®•à®¾à®Ÿà¯à®Ÿà¯à®®à¯." },
    ],
    expert: [
      { q: "'à®šà®¾à®¤à¯à®¤à®©à¯ à®•à®²à¯à®²à¯ˆà®ªà¯ à®ªà®³à¯à®³à®¿à®¯à¯ˆ à®…à®Ÿà¯ˆà®¨à¯à®¤à®¾à®©à¯' à®¤à¯Šà®Ÿà®°à®¿à®²à¯ à®•à®¾à®£à®ªà¯à®ªà®Ÿà¯à®®à¯ à®‡à®²à®•à¯à®•à®£à®ªà¯ à®ªà®¿à®´à¯ˆ à®Žà®¤à¯?", options: ["à®‡à®°à¯ à®šà¯†à®¯à®ªà¯à®ªà®Ÿà¯à®ªà¯Šà®°à¯à®³à¯à®•à®³à¯ à®’à®°à¯‡ à®µà®¾à®•à¯à®•à®¿à®¯à®¤à¯à®¤à®¿à®²à¯ à®µà®°à¯à®¤à®²à¯", "à®Žà®´à¯à®µà®¾à®¯à¯ à®‡à®²à¯à®²à®¾à®®à¯ˆ", "à®ªà®¯à®©à®¿à®²à¯ˆ à®‡à®²à¯à®²à®¾à®®à¯ˆ", "à®ªà®¿à®´à¯ˆ à®‡à®²à¯à®²à¯ˆ"], answer: "à®‡à®°à¯ à®šà¯†à®¯à®ªà¯à®ªà®Ÿà¯à®ªà¯Šà®°à¯à®³à¯à®•à®³à¯ à®’à®°à¯‡ à®µà®¾à®•à¯à®•à®¿à®¯à®¤à¯à®¤à®¿à®²à¯ à®µà®°à¯à®¤à®²à¯", explanation: "à®’à®°à¯ à®¤à®©à¯à®µà®¿à®©à¯ˆ à®µà®¾à®•à¯à®•à®¿à®¯à®¤à¯à®¤à®¿à®²à¯ à®’à®°à¯‡ à®’à®°à¯ à®šà¯†à®¯à®ªà¯à®ªà®Ÿà¯à®ªà¯Šà®°à¯à®³à¯ à®®à®Ÿà¯à®Ÿà¯à®®à¯‡ à®‡à®°à¯à®•à¯à®• à®µà¯‡à®£à¯à®Ÿà¯à®®à¯." },
    ],
  },
  "padaippu-paguthi": {
    easy: [
      { q: "à®•à®Ÿà¯à®Ÿà¯à®°à¯ˆ à®Žà®´à¯à®¤à¯à®®à¯à®ªà¯‹à®¤à¯ à®®à¯à®¤à®²à®¿à®²à¯ à®…à®®à¯ˆà®¯ à®µà¯‡à®£à¯à®Ÿà®¿à®¯à®¤à¯ à®Žà®¤à¯?", options: ["à®®à¯à®©à¯à®©à¯à®°à¯ˆ", "à®®à¯à®Ÿà®¿à®µà¯à®°à¯ˆ", "à®‰à®³à¯à®³à®Ÿà®•à¯à®•à®®à¯", "à®¤à®²à¯ˆà®ªà¯à®ªà¯ à®®à®Ÿà¯à®Ÿà¯à®®à¯"], answer: "à®®à¯à®©à¯à®©à¯à®°à¯ˆ", explanation: "à®•à®Ÿà¯à®Ÿà¯à®°à¯ˆà®¯à®¿à®©à¯ à®¤à¯Šà®Ÿà®•à¯à®•à®¤à¯à®¤à®¿à®²à¯ à®ªà¯Šà®°à¯à®³à¯ˆ à®…à®±à®¿à®®à¯à®•à®ªà¯à®ªà®Ÿà¯à®¤à¯à®¤à¯à®®à¯ à®®à¯à®©à¯à®©à¯à®°à¯ˆ à®…à®®à¯ˆà®¯ à®µà¯‡à®£à¯à®Ÿà¯à®®à¯." },
      { q: "à®•à®Ÿà®¿à®¤à®®à¯ à®Žà®´à¯à®¤à¯à®®à¯à®ªà¯‹à®¤à¯ à®‡à®±à¯à®¤à®¿à®¯à®¿à®²à¯ à®‡à®Ÿà®®à¯à®ªà¯†à®±à¯à®µà®¤à¯ à®Žà®¤à¯?", options: ["à®®à¯à®•à®µà®°à®¿", "à®•à¯ˆà®¯à¯Šà®ªà¯à®ªà®®à¯", "à®¤à¯‡à®¤à®¿", "à®µà®¾à®´à¯à®¤à¯à®¤à¯"], answer: "à®•à¯ˆà®¯à¯Šà®ªà¯à®ªà®®à¯", explanation: "à®•à®Ÿà®¿à®¤à®¤à¯à®¤à®¿à®©à¯ à®‡à®±à¯à®¤à®¿à®¯à®¿à®²à¯ à®Žà®´à¯à®¤à¯à®ªà®µà®°à®¿à®©à¯ à®•à¯ˆà®¯à¯Šà®ªà¯à®ªà®®à¯ à®‡à®Ÿà®®à¯à®ªà¯†à®±à¯à®®à¯." },
      { q: "à®…à®´à¯ˆà®ªà¯à®ªà®¿à®¤à®´à¯ à®Žà®´à¯à®¤à¯à®µà®¤à¯ à®Žà®¨à¯à®¤ à®µà®•à¯ˆ à®ªà®Ÿà¯ˆà®ªà¯à®ªà¯à®•à¯à®•à¯ à®Žà®Ÿà¯à®¤à¯à®¤à¯à®•à¯à®•à®¾à®Ÿà¯à®Ÿà¯?", options: ["à®®à¯à®±à¯ˆà®¯à®¾à®© à®µà®°à¯ˆà®µà¯", "à®šà¯à®¯à®šà®°à®¿à®¤à¯ˆ", "à®•à®Ÿà¯à®Ÿà¯à®°à¯ˆ", "à®•à®µà®¿à®¤à¯ˆ"], answer: "à®®à¯à®±à¯ˆà®¯à®¾à®© à®µà®°à¯ˆà®µà¯", explanation: "à®…à®´à¯ˆà®ªà¯à®ªà®¿à®¤à®´à¯ à®’à®°à¯ à®•à¯à®±à®¿à®ªà¯à®ªà®¿à®Ÿà¯à®Ÿ à®µà®Ÿà®¿à®µà®®à¯ˆà®ªà¯à®ªà¯à®Ÿà®©à¯ à®•à¯‚à®Ÿà®¿à®¯ à®®à¯à®±à¯ˆà®¯à®¾à®© à®µà®°à¯ˆà®µà®¾à®•à¯à®®à¯." },
      { q: "True or False: à®šà¯à®°à¯à®•à¯à®•à®®à¯ à®Žà®´à¯à®¤à¯à®®à¯à®ªà¯‹à®¤à¯ à®®à¯‚à®²à®ªà¯ à®ªà¯Šà®°à¯à®³à®¿à®©à¯ à®®à¯à®•à¯à®•à®¿à®¯ à®•à®°à¯à®¤à¯à®¤à¯à®•à®³à¯ à®®à®Ÿà¯à®Ÿà¯à®®à¯ à®‡à®Ÿà®®à¯à®ªà¯†à®± à®µà¯‡à®£à¯à®Ÿà¯à®®à¯.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "à®šà¯à®°à¯à®•à¯à®•à®®à¯ à®®à¯‚à®²à®•à¯ à®•à®°à¯à®¤à¯à®¤à¯ˆ à®•à¯à®±à¯ˆà®¨à¯à®¤ à®šà¯Šà®±à¯à®•à®³à®¿à®²à¯ à®¤à®°à¯à®µà®¤à®¾à®•à¯à®®à¯." },
    ],
    medium: [
      { q: "à®‰à®°à¯ˆà®¯à®¾à®Ÿà®²à¯ à®Žà®´à¯à®¤à¯à®®à¯à®ªà¯‹à®¤à¯ à®•à®Ÿà¯ˆà®ªà®¿à®Ÿà®¿à®•à¯à®• à®µà¯‡à®£à¯à®Ÿà®¿à®¯à®¤à¯ à®Žà®¤à¯?", options: ["à®ªà¯‡à®šà¯à®ªà®µà®°à¯ à®ªà¯†à®¯à®°à¯à®Ÿà®©à¯ à®¨à¯‡à®°à®Ÿà®¿à®ªà¯ à®ªà¯‡à®šà¯à®šà¯", "à®®à®±à¯ˆà®®à¯à®•à®ªà¯ à®ªà¯‡à®šà¯à®šà¯ à®®à®Ÿà¯à®Ÿà¯à®®à¯", "à®µà®¿à®µà®°à®£à¯ˆ à®®à®Ÿà¯à®Ÿà¯à®®à¯", "à®•à®µà®¿à®¤à¯ˆ à®¨à®Ÿà¯ˆ"], answer: "à®ªà¯‡à®šà¯à®ªà®µà®°à¯ à®ªà¯†à®¯à®°à¯à®Ÿà®©à¯ à®¨à¯‡à®°à®Ÿà®¿à®ªà¯ à®ªà¯‡à®šà¯à®šà¯", explanation: "à®‰à®°à¯ˆà®¯à®¾à®Ÿà®²à¯ à®µà®Ÿà®¿à®µà®®à¯ à®ªà¯‡à®šà¯à®ªà®µà®°à¯ à®ªà¯†à®¯à®°à¯à®Ÿà®©à¯ à®…à®µà®°à¯à®•à®³à®¿à®©à¯ à®¨à¯‡à®°à®Ÿà®¿à®šà¯ à®šà¯Šà®±à¯à®•à®³à¯ˆà®•à¯ à®•à®¾à®Ÿà¯à®Ÿ à®µà¯‡à®£à¯à®Ÿà¯à®®à¯." },
      { q: "à®µà®¿à®³à®•à¯à®•à®•à¯ à®•à®Ÿà¯à®Ÿà¯à®°à¯ˆà®¯à®¿à®©à¯ à®¨à¯‹à®•à¯à®•à®®à¯ à®Žà®©à¯à®©?", options: ["à®’à®°à¯ à®ªà¯Šà®°à¯à®³à¯/à®‡à®Ÿà®¤à¯à®¤à¯ˆ à®µà®¿à®°à®¿à®µà®¾à®• à®µà®¿à®³à®•à¯à®•à¯à®¤à®²à¯", "à®•à®°à¯à®¤à¯à®¤à¯ˆ à®µà®¾à®¤à®¿à®Ÿà¯à®¤à®²à¯", "à®•à®¤à¯ˆ à®šà¯Šà®²à¯à®²à¯à®¤à®²à¯", "à®•à®Ÿà®¿à®¤à®®à¯ à®Žà®´à¯à®¤à¯à®¤à®²à¯"], answer: "à®’à®°à¯ à®ªà¯Šà®°à¯à®³à¯/à®‡à®Ÿà®¤à¯à®¤à¯ˆ à®µà®¿à®°à®¿à®µà®¾à®• à®µà®¿à®³à®•à¯à®•à¯à®¤à®²à¯", explanation: "à®µà®¿à®³à®•à¯à®•à®•à¯ à®•à®Ÿà¯à®Ÿà¯à®°à¯ˆ à®’à®°à¯ à®ªà¯Šà®°à¯à®³à¯ˆà®¯à¯‹ à®‡à®Ÿà®¤à¯à®¤à¯ˆà®¯à¯‹ à®ªà®Ÿà®¿à®ªà¯à®ªà®Ÿà®¿à®¯à®¾à®• à®µà®¿à®³à®•à¯à®•à¯à®®à¯." },
      { q: "à®®à¯à®±à¯ˆà®¯à®¾à®© à®•à®Ÿà®¿à®¤à®¤à¯à®¤à®¿à®²à¯ à®ªà¯†à®±à¯à®¨à®°à¯ à®®à¯à®•à®µà®°à®¿à®•à¯à®•à¯à®ªà¯ à®ªà®¿à®©à¯ ___ à®Žà®´à¯à®¤à®ªà¯à®ªà®Ÿà¯à®®à¯ (à®µà®£à®•à¯à®•à®šà¯ à®šà¯Šà®²à¯).", type: "fill_blank", answer: "à®µà®£à®•à¯à®•à®®à¯", explanation: "à®®à¯à®•à®µà®°à®¿à®•à¯à®•à¯à®ªà¯ à®ªà®¿à®©à¯ 'à®…à®©à¯à®ªà¯à®³à¯à®³/à®®à®¤à®¿à®ªà¯à®ªà®¿à®±à¯à®•à¯à®°à®¿à®¯' à®ªà¯‹à®©à¯à®± à®µà®£à®•à¯à®•à®šà¯ à®šà¯Šà®²à¯ à®µà®°à¯à®®à¯." },
      { q: "à®•à®Ÿà¯à®Ÿà¯à®°à¯ˆà®¯à®¿à®©à¯ à®®à¯à®Ÿà®¿à®µà¯à®°à¯ˆà®¯à®¿à®²à¯ à®Žà®©à¯à®© à®‡à®Ÿà®®à¯à®ªà¯†à®± à®µà¯‡à®£à¯à®Ÿà¯à®®à¯?", options: ["à®¤à¯Šà®•à¯à®ªà¯à®ªà¯à®°à¯ˆ / à®®à¯à®Ÿà®¿à®µà®¾à®© à®•à®°à¯à®¤à¯à®¤à¯", "à®ªà¯à®¤à®¿à®¯ à®¤à®•à®µà®²à¯", "à®•à¯‡à®³à¯à®µà®¿à®•à®³à¯ à®®à®Ÿà¯à®Ÿà¯à®®à¯", "à®®à¯à®•à®µà®°à®¿"], answer: "à®¤à¯Šà®•à¯à®ªà¯à®ªà¯à®°à¯ˆ / à®®à¯à®Ÿà®¿à®µà®¾à®© à®•à®°à¯à®¤à¯à®¤à¯", explanation: "à®®à¯à®Ÿà®¿à®µà¯à®°à¯ˆà®¯à®¿à®²à¯ à®•à®Ÿà¯à®Ÿà¯à®°à¯ˆà®¯à®¿à®©à¯ à®®à¯à®•à¯à®•à®¿à®¯à®•à¯ à®•à®°à¯à®¤à¯à®¤à¯à®•à®³à¯ˆà®¤à¯ à®¤à¯Šà®•à¯à®¤à¯à®¤à¯à®•à¯ à®•à¯‚à®±à®µà¯‡à®£à¯à®Ÿà¯à®®à¯." },
    ],
    hard: [
      { q: "à®®à¯à®±à¯ˆà®¯à®¾à®© à®•à®Ÿà®¿à®¤à®¤à¯à®¤à®¿à®±à¯à®•à¯à®®à¯ à®¤à®©à®¿à®ªà¯à®ªà®Ÿà¯à®Ÿ à®•à®Ÿà®¿à®¤à®¤à¯à®¤à®¿à®±à¯à®•à¯à®®à¯ à®‰à®³à¯à®³ à®®à¯à®¤à®©à¯à®®à¯ˆ à®µà¯‡à®±à¯à®ªà®¾à®Ÿà¯?", options: ["à®®à¯Šà®´à®¿à®¨à®Ÿà¯ˆà®¯à¯à®®à¯ à®šà®®à¯à®ªà®¿à®°à®¤à®¾à®¯à®®à¯à®®à¯", "à®¨à¯€à®³à®®à¯ à®®à®Ÿà¯à®Ÿà¯à®®à¯", "à®¤à¯‡à®¤à®¿ à®‡à®°à¯à®¤à¯à®¤à®²à¯", "à®•à¯ˆà®¯à¯Šà®ªà¯à®ªà®®à¯ à®‡à®²à¯à®²à®¾à®®à¯ˆ"], answer: "à®®à¯Šà®´à®¿à®¨à®Ÿà¯ˆà®¯à¯à®®à¯ à®šà®®à¯à®ªà®¿à®°à®¤à®¾à®¯à®®à¯à®®à¯", explanation: "à®®à¯à®±à¯ˆà®¯à®¾à®© à®•à®Ÿà®¿à®¤à®®à¯ à®šà®®à¯à®ªà®¿à®°à®¤à®¾à®¯ à®®à¯Šà®´à®¿à®¨à®Ÿà¯ˆà®¯à¯ˆà®ªà¯ à®ªà®¯à®©à¯à®ªà®Ÿà¯à®¤à¯à®¤à¯à®®à¯; à®¤à®©à®¿à®ªà¯à®ªà®Ÿà¯à®Ÿ à®•à®Ÿà®¿à®¤à®®à¯ à®¨à®Ÿà¯à®ªà¯ à®¨à®Ÿà¯ˆà®¯à¯ˆà®ªà¯ à®ªà®¯à®©à¯à®ªà®Ÿà¯à®¤à¯à®¤à¯à®®à¯." },
      { q: "à®•à®Ÿà¯à®Ÿà¯à®°à¯ˆà®¯à®¿à®²à¯ à®ªà®¤à¯à®¤à®¿à®ªà¯ à®ªà®¿à®°à®¿à®ªà¯à®ªà¯ à®à®©à¯ à®…à®µà®šà®¿à®¯à®®à¯?", options: ["à®’à®µà¯à®µà¯Šà®°à¯ à®•à®°à¯à®¤à¯à®¤à¯à®®à¯ à®¤à¯†à®³à®¿à®µà®¾à®•à®ªà¯ à®ªà®¿à®°à®¿à®•à¯à®•à®ªà¯à®ªà®Ÿ à®µà¯‡à®£à¯à®Ÿà¯à®®à¯", "à®ªà®•à¯à®•à®¤à¯à®¤à¯ˆ à®¨à®¿à®°à®ªà¯à®ª", "à®…à®´à®•à¯à®•à¯à®•à®¾à®• à®®à®Ÿà¯à®Ÿà¯à®®à¯", "à®…à®µà®šà®¿à®¯à®®à®¿à®²à¯à®²à¯ˆ"], answer: "à®’à®µà¯à®µà¯Šà®°à¯ à®•à®°à¯à®¤à¯à®¤à¯à®®à¯ à®¤à¯†à®³à®¿à®µà®¾à®•à®ªà¯ à®ªà®¿à®°à®¿à®•à¯à®•à®ªà¯à®ªà®Ÿ à®µà¯‡à®£à¯à®Ÿà¯à®®à¯", explanation: "à®ªà®¤à¯à®¤à®¿à®ªà¯ à®ªà®¿à®°à®¿à®ªà¯à®ªà¯ à®µà®¾à®šà®¿à®ªà¯à®ªà®µà®°à¯à®•à¯à®•à¯à®•à¯ à®•à®°à¯à®¤à¯à®¤à¯à®•à®³à¯ˆà®¤à¯ à®¤à¯†à®³à®¿à®µà®¾à®•à®ªà¯ à®ªà¯à®°à®¿à®¨à¯à®¤à¯à®•à¯Šà®³à¯à®³ à®‰à®¤à®µà¯à®®à¯." },
    ],
    expert: [
      { q: "à®šà¯†à®¯à¯à®¤à®¿ à®…à®±à®¿à®•à¯à®•à¯ˆ à®Žà®´à¯à®¤à¯à®µà®¤à®±à¯à®•à¯à®®à¯ à®•à®Ÿà¯à®Ÿà¯à®°à¯ˆ à®Žà®´à¯à®¤à¯à®µà®¤à®±à¯à®•à¯à®®à¯ à®‰à®³à¯à®³ à®®à¯à®•à¯à®•à®¿à®¯ à®µà¯‡à®±à¯à®ªà®¾à®Ÿà¯?", options: ["à®…à®±à®¿à®•à¯à®•à¯ˆ à®¨à®Ÿà®ªà¯à®ªà®¾à®© à®‰à®£à¯à®®à¯ˆà®¤à¯ à®¤à®•à®µà®²à¯à®•à®³à¯ˆ à®…à®Ÿà®¿à®ªà¯à®ªà®Ÿà¯ˆà®¯à®¾à®•à®•à¯ à®•à¯Šà®£à¯à®Ÿà®¤à¯", "à®…à®±à®¿à®•à¯à®•à¯ˆ à®•à®±à¯à®ªà®©à¯ˆà®¯à®¾à®©à®¤à¯", "à®•à®Ÿà¯à®Ÿà¯à®°à¯ˆ à®‰à®£à¯à®®à¯ˆà®¤à¯ à®¤à®•à®µà®²à¯ à®®à®Ÿà¯à®Ÿà¯à®®à¯‡ à®•à¯Šà®£à¯à®Ÿà®¤à¯", "à®µà¯‡à®±à¯à®ªà®¾à®Ÿà¯ à®‡à®²à¯à®²à¯ˆ"], answer: "à®…à®±à®¿à®•à¯à®•à¯ˆ à®¨à®Ÿà®ªà¯à®ªà®¾à®© à®‰à®£à¯à®®à¯ˆà®¤à¯ à®¤à®•à®µà®²à¯à®•à®³à¯ˆ à®…à®Ÿà®¿à®ªà¯à®ªà®Ÿà¯ˆà®¯à®¾à®•à®•à¯ à®•à¯Šà®£à¯à®Ÿà®¤à¯", explanation: "à®…à®±à®¿à®•à¯à®•à¯ˆ à®’à®°à¯ à®¨à®¿à®•à®´à¯à®µà¯ à®ªà®±à¯à®±à®¿à®¯ à®‰à®£à¯à®®à¯ˆà®¤à¯ à®¤à®•à®µà®²à¯à®•à®³à¯ˆ à®’à®´à¯à®™à¯à®•à®¾à®• à®µà®´à®™à¯à®•à¯à®µà®¤à®¾à®•à¯à®®à¯." },
    ],
  },
  "ilakkiya-thurai": {
    easy: [
      { q: "à®¤à®¿à®°à¯à®•à¯à®•à¯à®±à®³à¯ˆ à®‡à®¯à®±à¯à®±à®¿à®¯à®µà®°à¯ à®¯à®¾à®°à¯?", options: ["à®¤à®¿à®°à¯à®µà®³à¯à®³à¯à®µà®°à¯", "à®•à®®à¯à®ªà®°à¯", "à®‡à®³à®™à¯à®•à¯‹ à®…à®Ÿà®¿à®•à®³à¯", "à®”à®µà¯ˆà®¯à®¾à®°à¯"], answer: "à®¤à®¿à®°à¯à®µà®³à¯à®³à¯à®µà®°à¯", explanation: "à®¤à®¿à®°à¯à®•à¯à®•à¯à®±à®³à¯ à®¤à®¿à®°à¯à®µà®³à¯à®³à¯à®µà®°à®¾à®²à¯ à®‡à®¯à®±à¯à®±à®ªà¯à®ªà®Ÿà¯à®Ÿà®¤à¯." },
      { q: "à®¤à®¿à®°à¯à®•à¯à®•à¯à®±à®³à®¿à®²à¯ à®®à¯Šà®¤à¯à®¤à®®à¯ à®Žà®¤à¯à®¤à®©à¯ˆ à®•à¯à®±à®Ÿà¯à®ªà®¾à®•à¯à®•à®³à¯ à®‰à®³à¯à®³à®©?", options: ["1000", "1330", "1500", "2000"], answer: "1330", explanation: "à®¤à®¿à®°à¯à®•à¯à®•à¯à®±à®³à®¿à®²à¯ 133 à®…à®¤à®¿à®•à®¾à®°à®™à¯à®•à®³à®¿à®²à¯ 1330 à®•à¯à®±à®Ÿà¯à®ªà®¾à®•à¯à®•à®³à¯ à®‰à®³à¯à®³à®©." },
      { q: "'à®…à®£à®¿' à®Žà®©à¯à®ªà®¤à¯ à®‡à®²à®•à¯à®•à®¿à®¯à®¤à¯à®¤à®¿à®²à¯ à®Žà®¤à¯ˆà®•à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯?", options: ["à®®à¯Šà®´à®¿ à®…à®´à®•à¯ à®¨à¯à®Ÿà¯à®ªà®®à¯", "à®Žà®´à¯à®¤à¯à®¤à¯ à®µà®Ÿà®¿à®µà®®à¯", "à®‡à®²à®•à¯à®•à®£à®®à¯", "à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ"], answer: "à®®à¯Šà®´à®¿ à®…à®´à®•à¯ à®¨à¯à®Ÿà¯à®ªà®®à¯", explanation: "à®•à®°à¯à®¤à¯à®¤à¯ˆ à®…à®´à®•à¯à®ªà®Ÿà¯à®¤à¯à®¤à¯à®®à¯ à®®à¯Šà®´à®¿ à®¨à¯à®Ÿà¯à®ªà®™à¯à®•à®³à¯ à®…à®£à®¿à®•à®³à¯ à®Žà®©à®ªà¯à®ªà®Ÿà¯à®®à¯." },
      { q: "True or False: à®šà®¿à®²à®ªà¯à®ªà®¤à®¿à®•à®¾à®°à®¤à¯à®¤à¯ˆ à®‡à®¯à®±à¯à®±à®¿à®¯à®µà®°à¯ à®‡à®³à®™à¯à®•à¯‹ à®…à®Ÿà®¿à®•à®³à¯.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "à®šà®¿à®²à®ªà¯à®ªà®¤à®¿à®•à®¾à®°à®®à¯ à®‡à®³à®™à¯à®•à¯‹ à®…à®Ÿà®¿à®•à®³à®¾à®²à¯ à®‡à®¯à®±à¯à®±à®ªà¯à®ªà®Ÿà¯à®Ÿ à®•à®¾à®ªà¯à®ªà®¿à®¯à®®à®¾à®•à¯à®®à¯." },
    ],
    medium: [
      { q: "'à®‰à®µà®®à¯ˆà®¯à®£à®¿' à®Žà®©à¯à®±à®¾à®²à¯ à®Žà®©à¯à®©?", options: ["à®‡à®°à¯ à®ªà¯Šà®°à¯à®³à¯à®•à®³à¯ˆ à®’à®ªà¯à®ªà®¿à®Ÿà¯à®Ÿà¯à®•à¯ à®•à¯‚à®±à¯à®¤à®²à¯", "à®Žà®¤à®¿à®°à¯à®®à®±à¯ˆ à®•à¯‚à®±à¯à®¤à®²à¯", "à®®à®¿à®•à¯ˆà®ªà¯à®ªà®Ÿà¯à®¤à¯à®¤à®¿à®•à¯ à®•à¯‚à®±à¯à®¤à®²à¯", "à®®à®±à¯ˆà®®à¯à®•à®®à®¾à®•à®•à¯ à®•à¯‚à®±à¯à®¤à®²à¯"], answer: "à®‡à®°à¯ à®ªà¯Šà®°à¯à®³à¯à®•à®³à¯ˆ à®’à®ªà¯à®ªà®¿à®Ÿà¯à®Ÿà¯à®•à¯ à®•à¯‚à®±à¯à®¤à®²à¯", explanation: "à®’à®°à¯ à®ªà¯Šà®°à¯à®³à¯ˆ à®‡à®©à¯à®©à¯Šà®°à¯ à®ªà¯Šà®°à¯à®³à¯à®Ÿà®©à¯ à®’à®ªà¯à®ªà®¿à®Ÿà¯à®Ÿà¯à®•à¯ à®•à¯‚à®±à¯à®µà®¤à¯ à®‰à®µà®®à¯ˆà®¯à®£à®¿." },
      { q: "'à®®à¯à®¤à¯à®¤à®®à®¿à®´à¯' à®Žà®©à¯à®ªà®¤à¯ à®Žà®µà®±à¯à®±à¯ˆà®•à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯?", options: ["à®‡à®¯à®²à¯, à®‡à®šà¯ˆ, à®¨à®¾à®Ÿà®•à®®à¯", "à®‡à®²à®•à¯à®•à®£à®®à¯, à®‡à®²à®•à¯à®•à®¿à®¯à®®à¯, à®šà¯Šà®²à¯", "à®Žà®´à¯à®¤à¯à®¤à¯, à®šà¯Šà®²à¯, à®ªà¯Šà®°à¯à®³à¯", "à®µà®°à®²à®¾à®±à¯, à®®à¯Šà®´à®¿, à®ªà®£à¯à®ªà®¾à®Ÿà¯"], answer: "à®‡à®¯à®²à¯, à®‡à®šà¯ˆ, à®¨à®¾à®Ÿà®•à®®à¯", explanation: "à®¤à®®à®¿à®´à®¿à®©à¯ à®®à¯‚à®©à¯à®±à¯ à®ªà®¿à®°à®¿à®µà¯à®•à®³à¯ à®‡à®¯à®²à¯ (à®‡à®²à®•à¯à®•à®¿à®¯à®®à¯), à®‡à®šà¯ˆ, à®¨à®¾à®Ÿà®•à®®à¯ à®Žà®©à¯à®ªà®©à®µà®¾à®•à¯à®®à¯." },
      { q: "à®à®®à¯à®ªà¯†à®°à¯à®™à¯à®•à®¾à®ªà¯à®ªà®¿à®¯à®™à¯à®•à®³à¯à®³à¯ à®’à®©à¯à®±à¯ à®Žà®¤à¯?", options: ["à®šà®¿à®²à®ªà¯à®ªà®¤à®¿à®•à®¾à®°à®®à¯", "à®¤à®¿à®°à¯à®•à¯à®•à¯à®±à®³à¯", "à®¨à®¾à®²à®Ÿà®¿à®¯à®¾à®°à¯", "à®ªà¯à®±à®¨à®¾à®©à¯‚à®±à¯"], answer: "à®šà®¿à®²à®ªà¯à®ªà®¤à®¿à®•à®¾à®°à®®à¯", explanation: "à®šà®¿à®²à®ªà¯à®ªà®¤à®¿à®•à®¾à®°à®®à¯, à®®à®£à®¿à®®à¯‡à®•à®²à¯ˆ, à®šà¯€à®µà®• à®šà®¿à®¨à¯à®¤à®¾à®®à®£à®¿, à®µà®³à¯ˆà®¯à®¾à®ªà®¤à®¿, à®•à¯à®£à¯à®Ÿà®²à®•à¯‡à®šà®¿ à®†à®•à®¿à®¯à®µà¯ˆ à®à®®à¯à®ªà¯†à®°à¯à®™à¯à®•à®¾à®ªà¯à®ªà®¿à®¯à®™à¯à®•à®³à¯." },
      { q: "'à®¯à®¾à®¤à¯à®®à¯ à®Šà®°à¯‡ à®¯à®¾à®µà®°à¯à®®à¯ à®•à¯‡à®³à®¿à®°à¯' à®Žà®©à®ªà¯ à®ªà®¾à®Ÿà®¿à®¯à®µà®°à¯ ___.", type: "fill_blank", answer: "à®•à®£à®¿à®¯à®©à¯ à®ªà¯‚à®™à¯à®•à¯à®©à¯à®±à®©à®¾à®°à¯", explanation: "à®‡à®ªà¯à®ªà®¾à®Ÿà®²à¯ à®ªà¯à®±à®¨à®¾à®©à¯‚à®±à¯à®±à®¿à®²à¯ à®•à®£à®¿à®¯à®©à¯ à®ªà¯‚à®™à¯à®•à¯à®©à¯à®±à®©à®¾à®°à®¾à®²à¯ à®ªà®¾à®Ÿà®ªà¯à®ªà®Ÿà¯à®Ÿà®¤à¯." },
    ],
    hard: [
      { q: "'à®‡à®¯à¯ˆà®ªà¯ à®…à®£à®¿' à®Žà®¤à¯ˆà®•à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯?", options: ["à®“à®šà¯ˆ à®¨à®¯à®®à¯ à®•à¯Šà®£à¯à®Ÿ à®šà¯Šà®±à¯à®•à®³à®¿à®©à¯ à®¤à¯Šà®Ÿà®°à¯à®šà¯à®šà®¿", "à®Žà®¤à®¿à®°à¯†à®¤à®¿à®°à¯à®ªà¯ à®ªà¯Šà®°à¯à®³à¯ à®•à¯‚à®±à¯à®¤à®²à¯", "à®®à®¿à®•à¯ˆà®ªà¯à®ªà®Ÿà¯à®¤à¯à®¤à®¿à®•à¯ à®•à¯‚à®±à¯à®¤à®²à¯", "à®•à¯‡à®³à¯à®µà®¿ à®•à¯‡à®Ÿà¯à®Ÿà®²à¯"], answer: "à®“à®šà¯ˆ à®¨à®¯à®®à¯ à®•à¯Šà®£à¯à®Ÿ à®šà¯Šà®±à¯à®•à®³à®¿à®©à¯ à®¤à¯Šà®Ÿà®°à¯à®šà¯à®šà®¿", explanation: "à®“à®šà¯ˆ à®’à®±à¯à®±à¯à®®à¯ˆ à®•à¯Šà®£à¯à®Ÿ à®šà¯€à®°à®¾à®© à®šà¯Šà®±à¯à®±à¯Šà®Ÿà®°à¯ à®‡à®¯à¯ˆà®ªà¯ à®…à®£à®¿ à®Žà®©à®ªà¯à®ªà®Ÿà¯à®®à¯." },
      { q: "à®šà®™à¯à®• à®‡à®²à®•à¯à®•à®¿à®¯à®®à¯ à®Žà®¤à¯à®¤à®©à¯ˆ à®µà®•à¯ˆà®•à®³à®¾à®•à®ªà¯ à®ªà®¿à®°à®¿à®•à¯à®•à®ªà¯à®ªà®Ÿà¯à®•à®¿à®±à®¤à¯?", options: ["à®‡à®°à®£à¯à®Ÿà¯ (à®…à®•à®®à¯, à®ªà¯à®±à®®à¯)", "à®®à¯‚à®©à¯à®±à¯", "à®¨à®¾à®©à¯à®•à¯", "à®à®¨à¯à®¤à¯"], answer: "à®‡à®°à®£à¯à®Ÿà¯ (à®…à®•à®®à¯, à®ªà¯à®±à®®à¯)", explanation: "à®šà®™à¯à®• à®‡à®²à®•à¯à®•à®¿à®¯à®®à¯ à®…à®•à®ªà¯à®ªà¯Šà®°à¯à®³à¯ à®®à®±à¯à®±à¯à®®à¯ à®ªà¯à®±à®ªà¯à®ªà¯Šà®°à¯à®³à¯ à®Žà®© à®‡à®°à¯ à®µà®•à¯ˆà®ªà¯à®ªà®Ÿà¯à®®à¯." },
    ],
    expert: [
      { q: "'à®¤à¯Šà®²à¯à®•à®¾à®ªà¯à®ªà®¿à®¯à®®à¯' à®Žà®¨à¯à®¤à®¤à¯ à®¤à¯à®±à¯ˆ à®šà®¾à®°à¯à®¨à¯à®¤ à®¨à¯‚à®²à¯?", options: ["à®‡à®²à®•à¯à®•à®£à®®à¯", "à®•à®¾à®ªà¯à®ªà®¿à®¯à®®à¯", "à®…à®•à®°à®¾à®¤à®¿", "à®¨à®¾à®Ÿà®•à®®à¯"], answer: "à®‡à®²à®•à¯à®•à®£à®®à¯", explanation: "à®¤à¯Šà®²à¯à®•à®¾à®ªà¯à®ªà®¿à®¯à®®à¯ à®¤à®®à®¿à®´à®¿à®©à¯ à®®à®¿à®•à®ªà¯ à®ªà®´à®®à¯ˆà®¯à®¾à®© à®‡à®²à®•à¯à®•à®£ à®¨à¯‚à®²à®¾à®•à¯à®®à¯." },
    ],
  },
  "tamil-arasu": {
    easy: [
      { q: "à®¤à®®à®¿à®´à®¿à®©à¯ à®®à¯à®¤à®²à¯ à®Žà®´à¯à®¤à¯à®¤à¯ à®Žà®¤à¯?", options: ["à®…", "à®•", "à®†", "à®‡"], answer: "à®…", explanation: "à®¤à®®à®¿à®´à¯ à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à®¿à®²à¯ à®®à¯à®¤à®²à®¾à®µà®¤à®¾à®• à®µà®°à¯à®µà®¤à¯ 'à®…' à®Žà®©à¯à®± à®‰à®¯à®¿à®°à¯ à®Žà®´à¯à®¤à¯à®¤à¯." },
      { q: "'à®¨à®²à¯à®²à®¤à¯' à®Žà®©à¯à®ªà®¤à®©à¯ à®Žà®¤à®¿à®°à¯à®šà¯à®šà¯Šà®²à¯ à®Žà®¤à¯?", options: ["à®•à¯†à®Ÿà¯à®Ÿà®¤à¯", "à®ªà¯†à®°à®¿à®¯à®¤à¯", "à®ªà¯à®¤à®¿à®¯à®¤à¯", "à®…à®´à®•à¯"], answer: "à®•à¯†à®Ÿà¯à®Ÿà®¤à¯", explanation: "à®‡à®¤à¯ à®®à¯à®©à¯à®ªà¯ à®•à®±à¯à®± à®Žà®¤à®¿à®°à¯à®šà¯à®šà¯Šà®²à¯ à®ªà®¯à®¿à®±à¯à®šà®¿à®¯à®¿à®©à¯ à®®à¯€à®³à¯à®ªà®¾à®°à¯à®µà¯ˆ." },
    ],
    medium: [
      { q: "'à®®à®°à®¤à¯à®¤à¯ˆ' à®Žà®©à¯à®ªà®¤à®¿à®²à¯ à®‰à®³à¯à®³ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ à®‰à®°à¯à®ªà¯ à®Žà®¤à¯?", options: ["à®", "à®•à¯", "à®†à®²à¯", "à®‡à®²à¯"], answer: "à®", explanation: "'à®' à®‡à®°à®£à¯à®Ÿà®¾à®®à¯ à®µà¯‡à®±à¯à®±à¯à®®à¯ˆ à®‰à®°à¯à®ªà¯, à®šà¯†à®¯à®ªà¯à®ªà®Ÿà¯à®ªà¯Šà®°à¯à®³à¯ˆà®•à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯." },
      { q: "à®¤à®¿à®°à¯à®•à¯à®•à¯à®±à®³à¯ˆ à®‡à®¯à®±à¯à®±à®¿à®¯à®µà®°à¯ à®¯à®¾à®°à¯?", options: ["à®¤à®¿à®°à¯à®µà®³à¯à®³à¯à®µà®°à¯", "à®•à®®à¯à®ªà®°à¯", "à®ªà®¾à®°à®¤à®¿à®¯à®¾à®°à¯", "à®‡à®³à®™à¯à®•à¯‹ à®…à®Ÿà®¿à®•à®³à¯"], answer: "à®¤à®¿à®°à¯à®µà®³à¯à®³à¯à®µà®°à¯", explanation: "à®‡à®¤à¯ à®®à¯à®¨à¯à®¤à¯ˆà®¯ à®ªà®¾à®Ÿà®¤à¯à®¤à®¿à®©à¯ à®®à¯à®•à¯à®•à®¿à®¯à®•à¯ à®•à®°à¯à®¤à¯à®¤à®¿à®©à¯ à®®à¯€à®³à¯à®ªà®¾à®°à¯à®µà¯ˆ." },
    ],
    hard: [
      { q: "'à®†à®©à¯ˆ à®µà®°à¯à®®à¯ à®ªà®¿à®©à¯à®©à¯‡, à®®à®£à®¿à®¯à¯‹à®šà¯ˆ à®µà®°à¯à®®à¯ à®®à¯à®©à¯à®©à¯‡' à®ªà®´à®®à¯Šà®´à®¿à®¯à®¿à®©à¯ à®•à®°à¯à®¤à¯à®¤à¯ à®¯à®¾à®¤à¯?", options: ["à®ªà¯†à®°à®¿à®¯ à®šà¯†à®¯à®²à¯à®•à¯à®•à¯ à®®à¯à®©à¯ à®…à®±à®¿à®•à¯à®±à®¿ à®¤à¯†à®°à®¿à®¯à¯à®®à¯", "à®¯à®¾à®©à¯ˆ à®ªà¯†à®°à®¿à®¯à®¤à¯", "à®’à®²à®¿ à®®à¯à®•à¯à®•à®¿à®¯à®®à¯", "à®…à®°à¯à®¤à¯à®¤à®®à®¿à®²à¯à®²à¯ˆ"], answer: "à®ªà¯†à®°à®¿à®¯ à®šà¯†à®¯à®²à¯à®•à¯à®•à¯ à®®à¯à®©à¯ à®…à®±à®¿à®•à¯à®±à®¿ à®¤à¯†à®°à®¿à®¯à¯à®®à¯", explanation: "à®‡à®±à¯à®¤à®¿ à®®à®±à¯à®ªà®¾à®°à¯à®µà¯ˆà®¯à®¾à®•, à®®à¯à®¨à¯à®¤à¯ˆà®¯ à®ªà®¾à®Ÿà®¤à¯à®¤à®¿à®²à¯ à®•à®±à¯à®± à®ªà®´à®®à¯Šà®´à®¿à®¯à®¿à®©à¯ à®•à®°à¯à®¤à¯à®¤à¯ˆ à®‰à®±à¯à®¤à®¿à®ªà¯à®ªà®Ÿà¯à®¤à¯à®¤à®¿à®•à¯ à®•à¯Šà®³à¯à®³à¯à®™à¯à®•à®³à¯." },
    ],
  },
  // --- Social Science ------------------------------------------------------
  "history-highlands": {
    easy: [
      { q: "The earliest human civilizations typically developed near:", options: ["Rivers", "Deserts", "Mountain peaks", "Deep forests"], answer: "Rivers", explanation: "Rivers provided fresh water, fertile soil, and transport, making them ideal for early settlement." },
      { q: "An empire that expands and controls many different regions is best described as:", options: ["A single small village", "A large territory under one central authority", "A trading company only", "A religious gathering"], answer: "A large territory under one central authority", explanation: "Empires unite diverse regions and peoples under one central ruling power." },
      { q: "Colonialism generally refers to:", options: ["One country controlling and exploiting another for its resources", "Two countries trading as equals", "Countries sharing a common language", "A alliance of equal partners"], answer: "One country controlling and exploiting another for its resources", explanation: "Colonial powers took political control of other territories, often extracting resources and labor." },
      { q: "True or False: Independence movements were often led by people demanding self-rule.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Independence movements were driven by the demand for self-governance, free from colonial control." },
      { q: "Fill in the blank: The period after World War II saw many colonies gain ___.", type: "fill_blank", answer: "independence", explanation: "Decolonization accelerated after WWII as colonies across Asia and Africa won independence." },
    ],
    medium: [
      { q: "Which of these best describes a key cause of the fall of many ancient empires?", options: ["Overextension and internal instability", "Too much peace", "Excess of resources", "Lack of any trade at all"], answer: "Overextension and internal instability", explanation: "Empires often collapsed when they grew too large to govern effectively or faced internal conflict." },
      { q: "Which of these was a common economic effect of colonial rule on colonies?", options: ["Resources were often extracted to benefit the colonizing country", "Colonies became wealthier than the colonizers", "Local industries were always strengthened", "Trade was banned entirely"], answer: "Resources were often extracted to benefit the colonizing country", explanation: "Colonial economies were typically structured to serve the interests of the ruling power, not the colony." },
      { q: "Nonviolent resistance as a strategy for independence is most associated with:", options: ["Mahatma Gandhi's movement in India", "Building larger armies", "Signing trade treaties only", "Ignoring colonial rule entirely"], answer: "Mahatma Gandhi's movement in India", explanation: "Gandhi's campaigns of nonviolent civil disobedience became a model for independence movements worldwide." },
      { q: "Numerical: If a colony's independence movement began in 1920 and independence was achieved in 1947, how many years did the movement span?", type: "numerical", answer: "27", explanation: "1947 \u2212 1920 = 27 years." },
      { q: "The term \"decolonization\" refers to:", options: ["The process by which colonies became independent nations", "The founding of new colonies", "A trade agreement", "A type of currency"], answer: "The process by which colonies became independent nations", explanation: "Decolonization describes former colonies gaining sovereignty and self-governance." },
    ],
    hard: [
      { q: "Which of these best explains why many newly independent nations after WWII faced economic challenges?", options: ["Colonial economies were often structured around exporting raw materials, not building diverse industries", "They had too many factories already", "They inherited too much gold", "Independence caused no economic change at all"], answer: "Colonial economies were often structured around exporting raw materials, not building diverse industries", explanation: "Many colonies were left with economies dependent on a narrow set of exports, making diversification difficult after independence." },
      { q: "The \"Non-Aligned Movement\" that emerged during the Cold War refers to countries that:", options: ["Chose not to formally align with either major Cold War power bloc", "Joined both superpowers' alliances", "Refused all international relations", "Were former colonies of a single empire only"], answer: "Chose not to formally align with either major Cold War power bloc", explanation: "Non-aligned nations sought an independent path rather than siding with the US or Soviet bloc during the Cold War." },
      { q: "Which best describes the long-term significance of written record-keeping in early civilizations?", options: ["It allowed laws, trade, and history to be preserved and organized at scale", "It had no lasting importance", "It replaced the need for farming", "It ended all wars"], answer: "It allowed laws, trade, and history to be preserved and organized at scale", explanation: "Writing enabled record-keeping for governance, trade, and history, a foundation for complex societies." },
    ],
    expert: [
      { q: "Which factor most distinguishes a \"formal empire\" from \"informal\" economic influence over a region?", options: ["Formal empires exercise direct political control, informal influence relies mainly on economic leverage", "There is no real difference", "Informal influence always involves the military", "Formal empires never involve trade"], answer: "Formal empires exercise direct political control, informal influence relies mainly on economic leverage", explanation: "Formal empires directly govern territories, while informal influence shapes a region mainly through trade and economic pressure without full political control." },
      { q: "Numerical: A nation's independence movement had 3 major uprisings spaced 8 years apart, starting in 1900. In what year did the third uprising occur?", type: "numerical", answer: "1916", explanation: "1900 + 8 + 8 = 1916 (first in 1900, second in 1908, third in 1916)." },
    ],
  },
  "civics-citadel": {
    easy: [
      { q: "In a democracy, ultimate political power rests with:", options: ["The people, through elections", "A single unelected ruler", "Only the wealthy", "The military alone"], answer: "The people, through elections", explanation: "Democracy is defined by rule of the people, typically exercised through free and fair elections." },
      { q: "A country's constitution mainly serves to:", options: ["Establish the basic laws, structure, and principles of government", "Set the national currency", "List the country's exports", "Define national holidays only"], answer: "Establish the basic laws, structure, and principles of government", explanation: "The constitution is the foundational legal document defining how a government is organized and limited." },
      { q: "Which of the three branches of government is primarily responsible for making laws?", options: ["Legislature", "Executive", "Judiciary", "Military"], answer: "Legislature", explanation: "The legislature (like a parliament or congress) is the branch responsible for drafting and passing laws." },
      { q: "True or False: Fundamental rights come with corresponding duties for citizens.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Rights and duties go hand in hand â€” citizens enjoy rights while also being expected to fulfill certain responsibilities." },
      { q: "Fill in the blank: Local self-government bodies in villages are called ___.", type: "fill_blank", answer: "panchayats", explanation: "Panchayats are elected local governing bodies at the village level in India." },
    ],
    medium: [
      { q: "The \"separation of powers\" between branches of government mainly exists to:", options: ["Prevent any one branch from gaining too much power", "Make government slower for no reason", "Ensure only one person controls everything", "Eliminate the need for courts"], answer: "Prevent any one branch from gaining too much power", explanation: "Dividing power among branches creates checks and balances that limit the concentration of authority." },
      { q: "The judiciary's main role in a democracy is to:", options: ["Interpret laws and ensure justice, including checking the other branches", "Write new laws", "Enforce day-to-day administration", "Collect taxes"], answer: "Interpret laws and ensure justice, including checking the other branches", explanation: "Courts interpret and apply the law, and can check whether laws or executive actions are constitutional." },
      { q: "Which best describes a \"fundamental right\"?", options: ["A basic freedom guaranteed and protected by the constitution", "A privilege only the government can revoke at will with no process", "A right only for government officials", "A temporary rule that expires yearly"], answer: "A basic freedom guaranteed and protected by the constitution", explanation: "Fundamental rights are core freedoms enshrined in the constitution, protected against arbitrary removal." },
      { q: "Numerical: A local council has 15 elected members. If 9 belong to one party, what fraction of the council does that represent (in lowest terms)?", type: "numerical", answer: "3/5", explanation: "9/15 simplifies to 3/5." },
    ],
    hard: [
      { q: "Which of these best illustrates a \"check and balance\" between government branches?", options: ["A court ruling a law passed by the legislature unconstitutional", "The legislature ignoring the executive completely", "All three branches being run by the same person", "The judiciary writing new laws directly"], answer: "A court ruling a law passed by the legislature unconstitutional", explanation: "Judicial review â€” courts striking down unconstitutional laws â€” is a classic check on legislative power." },
      { q: "Decentralization of power to local governments is primarily meant to:", options: ["Bring decision-making closer to the people it affects", "Remove all national government authority", "Eliminate elections at the local level", "Concentrate power in one city"], answer: "Bring decision-making closer to the people it affects", explanation: "Decentralization empowers local bodies to make decisions suited to local needs, closer to citizens." },
    ],
    expert: [
      { q: "Which scenario best reflects a constitutional \"amendment\" process functioning as intended?", options: ["A supermajority of the legislature (or a special process) formally changes the constitution's text", "A single official changes the constitution overnight", "The constitution is ignored by mutual agreement", "Courts rewrite the constitution without any legislative involvement"], answer: "A supermajority of the legislature (or a special process) formally changes the constitution's text", explanation: "Amendments typically require a defined, often difficult, formal process â€” such as a supermajority vote â€” to change foundational law." },
    ],
  },
  "geo-garden": {
    easy: [
      { q: "On a map, the scale tells you:", options: ["The relationship between distance on the map and actual distance on the ground", "The map's color scheme", "The country's population", "The direction of north"], answer: "The relationship between distance on the map and actual distance on the ground", explanation: "Scale converts map distances into real-world distances." },
      { q: "A plateau is best described as:", options: ["A raised flatland with steep sides", "A narrow valley", "A body of water", "A type of desert only"], answer: "A raised flatland with steep sides", explanation: "Plateaus are elevated, relatively flat areas that rise sharply from surrounding land." },
      { q: "The main difference between climate and weather is:", options: ["Climate is the long-term pattern; weather is day-to-day conditions", "They mean exactly the same thing", "Weather only applies to deserts", "Climate changes every hour"], answer: "Climate is the long-term pattern; weather is day-to-day conditions", explanation: "Weather is short-term atmospheric conditions, while climate describes long-term average patterns." },
      { q: "True or False: Population density measures how many people live per unit area.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Population density is population divided by land area." },
      { q: "Fill in the blank: A compass points toward magnetic ___.", type: "fill_blank", answer: "north", explanation: "A compass needle aligns with Earth's magnetic field, pointing toward magnetic north." },
    ],
    medium: [
      { q: "Which factor most directly affects a region's climate?", options: ["Latitude and distance from the equator", "The color of local buildings", "The number of roads", "The national language"], answer: "Latitude and distance from the equator", explanation: "Latitude strongly determines how much direct sunlight a region receives, shaping its climate." },
      { q: "Numerical: A map has a scale of 1:50,000. A distance of 4 cm on the map represents how many kilometers in reality?", type: "numerical", answer: "2", explanation: "4 cm \u00d7 50,000 = 200,000 cm = 2,000 m = 2 km." },
      { q: "Human settlement patterns are most strongly influenced by:", options: ["Access to water, fertile land, and favorable climate", "The alphabet used locally", "Random chance only", "The size of the national flag"], answer: "Access to water, fertile land, and favorable climate", explanation: "People historically settle where resources like water and fertile soil support life and agriculture." },
      { q: "Which best describes \"human-environment interaction\"?", options: ["How people adapt to and modify their surroundings", "A type of map projection", "A form of government", "A weather pattern"], answer: "How people adapt to and modify their surroundings", explanation: "This geographic theme covers how humans both adapt to and reshape their physical environment." },
    ],
    hard: [
      { q: "Which best explains why river deltas are often densely populated despite flood risk?", options: ["Fertile soil and water access outweigh the risk for many communities", "Deltas have no flood risk at all", "People are unaware of any risk", "Deltas are always desert regions"], answer: "Fertile soil and water access outweigh the risk for many communities", explanation: "Deltas offer highly fertile soil and easy water access, which historically has drawn dense settlement despite flood risk." },
      { q: "Numerical: A region has a population of 2,400,000 over an area of 800 km\u00b2. What is its population density (people per km\u00b2)?", type: "numerical", answer: "3000", explanation: "2,400,000 \u00f7 800 = 3,000 people per km\u00b2." },
    ],
    expert: [
      { q: "Which best explains why rain shadow deserts form on the leeward side of mountain ranges?", options: ["Moist air drops its moisture on the windward side before crossing, leaving the leeward side dry", "Mountains block all wind entirely", "Deserts always form near mountains regardless of wind", "Leeward sides receive more direct sunlight only"], answer: "Moist air drops its moisture on the windward side before crossing, leaving the leeward side dry", explanation: "As air rises over a mountain it cools and releases moisture as precipitation; the descending air on the far side is dry, creating a rain shadow." },
    ],
  },
  "economy-isles": {
    easy: [
      { q: "An economy is best described as a system for:", options: ["Producing, distributing, and consuming goods and services", "Only printing money", "Only collecting taxes", "Only building roads"], answer: "Producing, distributing, and consuming goods and services", explanation: "An economy encompasses how a society produces, allocates, and uses its goods and services." },
      { q: "The primary role of a bank is to:", options: ["Accept deposits and provide loans", "Print government currency", "Set all product prices", "Build public roads"], answer: "Accept deposits and provide loans", explanation: "Banks are financial intermediaries that take deposits and lend money, facilitating economic activity." },
      { q: "When demand for a product increases while supply stays the same, price typically:", options: ["Rises", "Falls", "Stays exactly the same", "Becomes zero"], answer: "Rises", explanation: "Higher demand relative to a fixed supply generally pushes prices upward." },
      { q: "True or False: A country's development is measured only by its total wealth, with nothing else considered.", type: "true_false", options: ["True", "False"], answer: "False", explanation: "Development is measured using multiple factors, including health, education, and income, not wealth alone." },
      { q: "Fill in the blank: Buying and selling goods between countries is called ___ trade.", type: "fill_blank", answer: "international", explanation: "International trade refers to the exchange of goods and services across national borders." },
    ],
    medium: [
      { q: "Which of these best illustrates \"globalization\"?", options: ["A smartphone assembled with parts sourced from multiple countries", "A farmer selling vegetables only in their own village", "A law that applies only in one town", "A recipe passed within one family"], answer: "A smartphone assembled with parts sourced from multiple countries", explanation: "Globalization connects production and markets across countries, exactly as seen in global supply chains." },
      { q: "The Human Development Index (HDI) considers factors beyond income, such as:", options: ["Health and education", "Only military strength", "Only land area", "Only population size"], answer: "Health and education", explanation: "HDI combines income with life expectancy and education levels to measure development more broadly." },
      { q: "Numerical: If a country's GDP grows from $200 billion to $220 billion in a year, what is the percentage growth rate?", type: "numerical", answer: "10", explanation: "Growth = (220-200)/200 \u00d7 100 = 10%." },
    ],
    hard: [
      { q: "Which best explains why poverty can persist even as a country's overall GDP grows?", options: ["Growth's benefits may be unevenly distributed across the population", "GDP growth always eliminates poverty automatically", "Poverty and GDP are entirely unrelated", "GDP measures poverty directly"], answer: "Growth's benefits may be unevenly distributed across the population", explanation: "Aggregate growth doesn't guarantee that income gains reach everyone; inequality can leave some groups behind." },
      { q: "A trade deficit occurs when a country:", options: ["Imports more than it exports", "Exports more than it imports", "Has zero trade with other nations", "Only trades in gold"], answer: "Imports more than it exports", explanation: "A trade deficit means the value of imports exceeds the value of exports." },
    ],
    expert: [
      { q: "Numerical: A country's exports total $50 billion and imports total $65 billion. What is its trade deficit?", type: "numerical", answer: "15", explanation: "Trade deficit = imports \u2212 exports = 65 \u2212 50 = $15 billion." },
    ],
  },
  "resource-ridge": {
    easy: [
      { q: "A renewable resource is one that:", options: ["Can replenish naturally over time", "Is used up permanently once consumed", "Only exists underground", "Cannot be used by humans"], answer: "Can replenish naturally over time", explanation: "Renewable resources, like sunlight and wind, regenerate naturally, unlike finite resources such as coal." },
      { q: "Fertile soil is especially important for:", options: ["Agriculture", "Mining only", "Manufacturing only", "Banking"], answer: "Agriculture", explanation: "Fertile soil supports plant growth, making it essential for crop farming." },
      { q: "Which of these is a non-renewable resource?", options: ["Coal", "Sunlight", "Wind", "Fresh rainfall"], answer: "Coal", explanation: "Coal takes millions of years to form and is not replenished on a human timescale." },
      { q: "True or False: Overusing water resources can lead to shortages for future generations.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Unsustainable water use can deplete resources faster than they can be naturally replenished." },
      { q: "Fill in the blank: Growing the same crop repeatedly without variation can deplete ___ nutrients.", type: "fill_blank", answer: "soil", explanation: "Continuous single-crop farming can exhaust specific nutrients in the soil over time." },
    ],
    medium: [
      { q: "Crop rotation is primarily used to:", options: ["Maintain soil fertility by alternating different crops", "Increase the number of crops planted at once", "Eliminate the need for water", "Reduce the number of farmers needed"], answer: "Maintain soil fertility by alternating different crops", explanation: "Rotating crops helps replenish soil nutrients that a single crop would otherwise deplete." },
      { q: "Which of these best describes sustainable resource use?", options: ["Using resources at a rate that allows them to be replenished or preserved for the future", "Using as much as possible right now regardless of future supply", "Never using any natural resources", "Only using resources found underground"], answer: "Using resources at a rate that allows them to be replenished or preserved for the future", explanation: "Sustainability balances present needs with preserving resources for future generations." },
      { q: "Numerical: A region's forest cover shrank from 4,000 km\u00b2 to 3,200 km\u00b2. What percentage of the forest was lost?", type: "numerical", answer: "20", explanation: "Loss = (4000-3200)/4000 \u00d7 100 = 20%." },
    ],
    hard: [
      { q: "Which best explains why deforestation can worsen soil erosion?", options: ["Tree roots that once held soil in place are removed, leaving soil exposed to wind and rain", "Trees have no effect on soil at all", "Deforestation always improves soil quality", "Soil erosion only happens in deserts"], answer: "Tree roots that once held soil in place are removed, leaving soil exposed to wind and rain", explanation: "Tree roots stabilize soil; removing them leaves land vulnerable to erosion from rain and wind." },
    ],
    expert: [
      { q: "Numerical: A mineral reserve of 60,000 tonnes is extracted at 4,000 tonnes per year. After how many years will the reserve be exhausted, assuming a constant rate?", type: "numerical", answer: "15", explanation: "60,000 \u00f7 4,000 = 15 years." },
    ],
  },
  "final-social-science-senate": {
    easy: [
      { q: "The three branches of government are the legislature, the executive, and the:", options: ["Judiciary", "Military", "Media", "Civil service"], answer: "Judiciary", explanation: "The judiciary interprets laws, alongside the law-making legislature and the law-enforcing executive." },
      { q: "A map's legend (or key) is used to:", options: ["Explain what symbols on the map represent", "Show the map's exact age", "List the mapmaker's name only", "Show only country borders"], answer: "Explain what symbols on the map represent", explanation: "A legend decodes the symbols and colors used on a map." },
      { q: "Which resource type includes coal, oil, and natural gas?", options: ["Non-renewable", "Renewable", "Unlimited", "Human-made only"], answer: "Non-renewable", explanation: "Fossil fuels like coal, oil, and gas form over millions of years and are not replenished quickly." },
      { q: "A democracy is defined by rule by:", options: ["The people", "A single monarch only", "A small unelected group", "Foreign powers"], answer: "The people", explanation: "Democracy means governance derived from the will of the people, typically via elections." },
    ],
    medium: [
      { q: "Which best describes the relationship between climate and agriculture?", options: ["Climate strongly shapes which crops can be grown in a region", "Climate has no effect on farming", "Agriculture only depends on soil color", "Crops grow identically in every climate"], answer: "Climate strongly shapes which crops can be grown in a region", explanation: "Temperature and rainfall patterns determine which crops thrive in a given region." },
      { q: "Numerical: A country's population grew from 40 million to 44 million in a decade. What is the percentage growth?", type: "numerical", answer: "10", explanation: "(44-40)/40 \u00d7 100 = 10%." },
      { q: "The primary purpose of fundamental rights in a constitution is to:", options: ["Protect individual freedoms from being taken away arbitrarily", "Give unlimited power to the government", "Apply only to government officials", "Replace the need for courts"], answer: "Protect individual freedoms from being taken away arbitrarily", explanation: "Fundamental rights safeguard core freedoms against arbitrary infringement, including by the state." },
    ],
    hard: [
      { q: "Which best explains why colonial-era trade patterns often persisted even after independence?", options: ["Infrastructure and trade relationships built for colonial extraction are difficult and slow to restructure", "Trade patterns reset instantly at independence", "Colonies had no trade relationships to begin with", "New nations always immediately diversified their economies"], answer: "Infrastructure and trade relationships built for colonial extraction are difficult and slow to restructure", explanation: "Ports, railways, and trade ties built for colonial-era resource extraction don't disappear overnight, shaping post-independence economies for years." },
      { q: "Numerical: A region has 500,000 hectares of farmland, and crop rotation is applied to 60% of it. How many hectares use crop rotation?", type: "numerical", answer: "300000", explanation: "500,000 \u00d7 0.6 = 300,000 hectares." },
    ],
    expert: [
      { q: "Which scenario best demonstrates \"separation of powers\" working as a check on government?", options: ["The judiciary strikes down a law it finds unconstitutional", "The executive personally writes and passes all laws", "The legislature controls all court rulings", "One person leads all three branches"], answer: "The judiciary strikes down a law it finds unconstitutional", explanation: "Judicial review is a clear example of one branch checking another's power." },
    ],
  },

  // --- Computer Science ------------------------------------------------------
  "byte-bay": {
    easy: [
      { q: "A computer is best described as a device that:", options: ["Processes data according to a set of instructions", "Only stores paper documents", "Only displays pictures", "Can think exactly like a human"], answer: "Processes data according to a set of instructions", explanation: "Computers take input, process it following instructions (programs), and produce output." },
      { q: "Which of these is an example of hardware?", options: ["Keyboard", "Web browser", "Operating system", "A spreadsheet file"], answer: "Keyboard", explanation: "Hardware refers to physical, touchable components, like a keyboard, monitor, or mouse." },
      { q: "Which of these is an input device?", options: ["Mouse", "Monitor", "Printer", "Speaker"], answer: "Mouse", explanation: "A mouse sends data (movement and clicks) into the computer, making it an input device." },
      { q: "True or False: RAM stores data permanently, even when the computer is turned off.", type: "true_false", options: ["True", "False"], answer: "False", explanation: "RAM is volatile memory â€” its contents are lost when power is turned off, unlike storage like a hard drive." },
      { q: "Fill in the blank: The ___ is often called the 'brain' of the computer.", type: "fill_blank", answer: "CPU", explanation: "The Central Processing Unit (CPU) carries out instructions and performs calculations." },
    ],
    medium: [
      { q: "Software differs from hardware in that software is:", options: ["A set of instructions/programs, not a physical object", "Always more expensive than hardware", "Only used for gaming", "The same thing as hardware"], answer: "A set of instructions/programs, not a physical object", explanation: "Software is intangible â€” programs and instructions â€” while hardware is the physical machinery that runs it." },
      { q: "Which of these best describes the role of an operating system?", options: ["It manages hardware resources and lets other programs run", "It is a type of printer", "It only stores photos", "It is a physical circuit board"], answer: "It manages hardware resources and lets other programs run", explanation: "An OS (like Windows or Android) manages hardware and provides a platform for other software to run on." },
      { q: "Numerical: A computer has 8 GB of RAM. If an operating system uses 2 GB, how many GB remain available?", type: "numerical", answer: "6", explanation: "8 GB \u2212 2 GB = 6 GB remaining." },
      { q: "Secondary storage (like a hard drive) differs from RAM mainly because it:", options: ["Retains data even without power", "Is always faster than RAM", "Cannot store any files", "Is a type of input device"], answer: "Retains data even without power", explanation: "Secondary storage is non-volatile, meaning data persists after the computer is switched off, unlike RAM." },
    ],
    hard: [
      { q: "Which best explains why a computer with more RAM can often multitask more smoothly?", options: ["More RAM lets more programs' active data be held in fast memory at once", "RAM has no effect on multitasking", "More RAM always makes the CPU faster", "RAM only affects storage capacity"], answer: "More RAM lets more programs' active data be held in fast memory at once", explanation: "RAM holds actively used data; more of it means more programs can run without needing to swap data to slower storage." },
      { q: "Which best distinguishes a CPU's \"clock speed\" from its number of \"cores\"?", options: ["Clock speed measures how fast one core executes instructions; cores measure how many tasks can run in parallel", "They mean exactly the same thing", "Clock speed only matters for storage", "Cores measure RAM capacity"], answer: "Clock speed measures how fast one core executes instructions; cores measure how many tasks can run in parallel", explanation: "Clock speed is the rate of instruction execution per core; multiple cores allow parallel processing of separate tasks." },
    ],
    expert: [
      { q: "Numerical: A file is 4,000 MB. How many GB is that (1 GB = 1,000 MB)?", type: "numerical", answer: "4", explanation: "4,000 MB \u00f7 1,000 = 4 GB." },
    ],
  },
  "algorithm-archipelago": {
    easy: [
      { q: "An algorithm is best described as:", options: ["A step-by-step procedure to solve a problem", "A type of computer hardware", "A programming language", "A picture on the screen"], answer: "A step-by-step procedure to solve a problem", explanation: "An algorithm is an ordered set of steps designed to accomplish a specific task." },
      { q: "A flowchart uses shapes to represent:", options: ["The steps and logic of a process", "The colors of a website", "The price of software", "The size of a hard drive"], answer: "The steps and logic of a process", explanation: "Flowcharts visually map out the steps, decisions, and flow of an algorithm using standard symbols." },
      { q: "In a flowchart, a diamond shape typically represents:", options: ["A decision point", "The start of the process", "An input/output step", "The end of the process"], answer: "A decision point", explanation: "Diamonds in flowcharts represent yes/no decision points that branch the flow." },
      { q: "True or False: An algorithm can be written in plain language before being turned into code.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Algorithms are often written as pseudocode or plain steps first, then translated into a programming language." },
      { q: "Fill in the blank: Repeating a set of steps until a condition is met is called a ___.", type: "fill_blank", answer: "loop", explanation: "Loops repeat a block of steps until a stopping condition is reached." },
    ],
    medium: [
      { q: "Which best describes \"sequencing\" in an algorithm?", options: ["Carrying out steps in a specific, defined order", "Repeating a step randomly", "Skipping steps at will", "Running two algorithms at once"], answer: "Carrying out steps in a specific, defined order", explanation: "Sequencing means executing instructions one after another in the order they're written." },
      { q: "An algorithm that checks a condition and does one thing if true, another if false, is using:", options: ["Selection (decision-making)", "Sequencing only", "A loop only", "No logic at all"], answer: "Selection (decision-making)", explanation: "Selection structures (if/else) let an algorithm choose between different paths based on a condition." },
      { q: "Numerical: An algorithm processes 5 items per loop cycle. How many cycles are needed to process 45 items?", type: "numerical", answer: "9", explanation: "45 \u00f7 5 = 9 cycles." },
      { q: "Which of these is a key reason to test an algorithm with different inputs?", options: ["To check it works correctly across various scenarios, including edge cases", "To make the algorithm run slower on purpose", "Testing is never necessary once it's written", "To change the algorithm's purpose"], answer: "To check it works correctly across various scenarios, including edge cases", explanation: "Testing with varied inputs reveals bugs and edge cases that a single test wouldn't catch." },
    ],
    hard: [
      { q: "Which best explains why algorithm efficiency matters for large inputs?", options: ["A less efficient algorithm can take dramatically longer as input size grows", "Efficiency never matters regardless of input size", "All algorithms run in the same amount of time", "Efficiency only matters for small inputs"], answer: "A less efficient algorithm can take dramatically longer as input size grows", explanation: "Inefficient algorithms can scale poorly, becoming impractically slow as the amount of data increases." },
      { q: "Which best describes the purpose of an algorithm's \"stopping condition\" in a loop?", options: ["It prevents the loop from running forever", "It starts the loop", "It has no real purpose", "It only affects flowchart shapes"], answer: "It prevents the loop from running forever", explanation: "A stopping (termination) condition ensures a loop ends once its goal is achieved, avoiding an infinite loop." },
    ],
    expert: [
      { q: "Numerical: A sorting algorithm compares pairs of 10 items, one pass at a time, doing 9 comparisons per pass. How many comparisons happen in 3 full passes?", type: "numerical", answer: "27", explanation: "9 comparisons \u00d7 3 passes = 27 comparisons." },
    ],
  },
  "code-canyon": {
    easy: [
      { q: "A variable in programming is used to:", options: ["Store a value that can be used or changed later", "Permanently fix a value that can never change", "Only store images", "Delete data from the computer"], answer: "Store a value that can be used or changed later", explanation: "Variables act as labeled containers for data that a program can read or update." },
      { q: "Which of these is a common data type for whole numbers?", options: ["Integer", "String", "Boolean only", "Array only"], answer: "Integer", explanation: "Integers represent whole numbers, positive or negative, without decimals." },
      { q: "An \"if\" statement in code is used to:", options: ["Make a decision based on a condition", "Repeat code forever", "Store a variable", "Connect to the internet"], answer: "Make a decision based on a condition", explanation: "If statements let a program choose different actions depending on whether a condition is true or false." },
      { q: "True or False: A loop can be used to repeat a block of code multiple times.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Loops (like for and while) repeat a set of instructions until a condition changes." },
      { q: "Fill in the blank: A reusable block of code that performs a specific task is called a ___.", type: "fill_blank", answer: "function", explanation: "Functions package code so it can be reused without rewriting it each time." },
    ],
    medium: [
      { q: "Which operator would you use to check if two values are equal in most programming languages?", options: ["==", "=", "+", "!"], answer: "==", explanation: "A single '=' typically assigns a value, while '==' compares two values for equality." },
      { q: "Numerical: If x = 5 and y = 3, what is the value of x + y * 2 (following standard operator precedence)?", type: "numerical", answer: "11", explanation: "Multiplication happens first: y * 2 = 6, then x + 6 = 11." },
      { q: "A \"for\" loop is most useful when you:", options: ["Know in advance how many times to repeat something", "Never want to repeat anything", "Want to store a single value only", "Want to connect to a network"], answer: "Know in advance how many times to repeat something", explanation: "For loops are ideal when the number of repetitions is known ahead of time, like looping through a fixed list." },
      { q: "Which best describes a function's \"parameter\"?", options: ["A value passed into the function to be used inside it", "The function's final result only", "A type of loop", "A hardware component"], answer: "A value passed into the function to be used inside it", explanation: "Parameters let a function receive input values it can use to perform its task." },
    ],
    hard: [
      { q: "Which best explains why using functions makes code easier to maintain?", options: ["Logic is written once and reused, so fixing a bug only requires one change", "Functions make code run on any device automatically", "Functions eliminate the need for variables", "Functions always make code slower"], answer: "Logic is written once and reused, so fixing a bug only requires one change", explanation: "Reusable functions centralize logic â€” a fix in one place applies everywhere the function is called." },
      { q: "In nested loops (a loop inside another loop), the inner loop:", options: ["Completes all its iterations for each single iteration of the outer loop", "Runs only once regardless of the outer loop", "Always runs before the outer loop starts", "Has no relationship to the outer loop"], answer: "Completes all its iterations for each single iteration of the outer loop", explanation: "For every single pass of the outer loop, the inner loop runs through its full set of iterations." },
    ],
    expert: [
      { q: "Numerical: A nested loop has an outer loop running 4 times and an inner loop running 5 times per outer iteration. How many total inner-loop executions occur?", type: "numerical", answer: "20", explanation: "4 \u00d7 5 = 20 total executions." },
    ],
  },
  "data-structure-dunes": {
    easy: [
      { q: "Computers store all data ultimately using:", options: ["Binary digits (0s and 1s)", "Decimal numbers only", "Letters of the alphabet only", "Colors"], answer: "Binary digits (0s and 1s)", explanation: "At the lowest level, computers represent all data as sequences of binary digits (bits)." },
      { q: "The binary number 101 is equal to which decimal number?", options: ["5", "3", "6", "10"], answer: "5", explanation: "101 in binary = (1\u00d74) + (0\u00d72) + (1\u00d71) = 5." },
      { q: "An array is best described as:", options: ["A collection of items stored in order under one name", "A single value that never changes", "A type of loop", "A network cable"], answer: "A collection of items stored in order under one name", explanation: "Arrays group related values together, accessed by their position (index)." },
      { q: "True or False: A queue follows \"First In, First Out\" (FIFO) order.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "In a queue, the first item added is the first one removed, just like a line at a store." },
      { q: "Fill in the blank: A stack follows a \"Last In, First ___\" order.", type: "fill_blank", answer: "Out", explanation: "Stacks are LIFO: the last item added is the first one removed." },
    ],
    medium: [
      { q: "Numerical: Convert the binary number 1010 to decimal.", type: "numerical", answer: "10", explanation: "1010 = (1\u00d78)+(0\u00d74)+(1\u00d72)+(0\u00d71) = 10." },
      { q: "Which best describes the difference between a stack and a queue?", options: ["A stack is LIFO; a queue is FIFO", "They are exactly the same structure", "A stack can only hold numbers", "A queue can only hold text"], answer: "A stack is LIFO; a queue is FIFO", explanation: "Stacks remove the most recently added item first (LIFO); queues remove the oldest item first (FIFO)." },
      { q: "Which of these is an example of a real-world queue?", options: ["People lining up at a ticket counter", "A stack of plates", "A single light switch", "A pair of scissors"], answer: "People lining up at a ticket counter", explanation: "A line of people is served in the order they arrived â€” first in, first out, like a queue." },
    ],
    hard: [
      { q: "Numerical: Convert the decimal number 13 to binary.", type: "fill_blank", answer: "1101", explanation: "13 = 8+4+0+1 = 1101 in binary." },
      { q: "Which best explains why binary search requires sorted data?", options: ["It repeatedly halves the search range based on comparisons, which only works if order is guaranteed", "Binary search works equally well on unsorted data", "Sorting has nothing to do with binary search", "Binary search only works on strings"], answer: "It repeatedly halves the search range based on comparisons, which only works if order is guaranteed", explanation: "Binary search eliminates half the remaining data each step by comparing against the middle â€” which only makes sense if the data is ordered." },
    ],
    expert: [
      { q: "Numerical: Convert the hexadecimal number 1A to decimal.", type: "numerical", answer: "26", explanation: "1A in hex = (1\u00d716) + (10\u00d71) = 26 (A = 10 in hex)." },
    ],
  },
  "network-nook": {
    easy: [
      { q: "The Internet is best described as:", options: ["A global network of interconnected computers", "A single giant computer", "A type of software application", "A physical storage device"], answer: "A global network of interconnected computers", explanation: "The Internet links millions of computers and networks worldwide so they can exchange data." },
      { q: "A web browser is used to:", options: ["View and navigate websites", "Print documents", "Store files permanently", "Power the computer"], answer: "View and navigate websites", explanation: "Browsers like Chrome or Firefox let users access and view content on the World Wide Web." },
      { q: "Which of these is an example of a network topology?", options: ["Star topology", "Binary topology", "Loop function", "Data type"], answer: "Star topology", explanation: "Star, bus, and ring are common ways devices can be physically or logically connected in a network." },
      { q: "True or False: A firewall helps protect a network from unauthorized access.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Firewalls monitor and control incoming/outgoing network traffic based on security rules." },
      { q: "Fill in the blank: An email address typically includes a username and a ___ name.", type: "fill_blank", answer: "domain", explanation: "An email address is structured as username@domain, where the domain identifies the mail server/provider." },
    ],
    medium: [
      { q: "In a star network topology, all devices connect to:", options: ["A central hub or switch", "Each other directly, with no central point", "The internet directly, bypassing local devices", "Nothing; they operate independently"], answer: "A central hub or switch", explanation: "In a star topology, every device connects to one central hub, which relays data between them." },
      { q: "Which of these best describes \"phishing\" as a cybersecurity threat?", options: ["Tricking someone into revealing sensitive information via fake messages or sites", "A type of computer hardware failure", "A method of encrypting files", "A network cable standard"], answer: "Tricking someone into revealing sensitive information via fake messages or sites", explanation: "Phishing uses deceptive emails or websites to trick users into giving up passwords or personal data." },
      { q: "Which protocol is commonly used to load web pages in a browser?", options: ["HTTP/HTTPS", "SMTP", "FTP only", "USB"], answer: "HTTP/HTTPS", explanation: "HTTP and its secure version HTTPS are the protocols browsers use to request and receive web page content." },
    ],
    hard: [
      { q: "Which best explains why HTTPS is more secure than plain HTTP?", options: ["HTTPS encrypts data in transit between browser and server", "HTTPS is simply a faster version of HTTP", "HTTPS only works on mobile devices", "There is no real difference"], answer: "HTTPS encrypts data in transit between browser and server", explanation: "The 'S' in HTTPS stands for secure â€” it encrypts communication, protecting data from interception." },
      { q: "A strong password policy typically recommends:", options: ["A mix of letters, numbers, and symbols, avoiding common words", "Reusing the same short password everywhere", "Using only your name", "Sharing passwords with friends for backup"], answer: "A mix of letters, numbers, and symbols, avoiding common words", explanation: "Complex, unique passwords are much harder for attackers to guess or crack than simple, reused ones." },
    ],
    expert: [
      { q: "Which best explains the role of DNS (Domain Name System) on the internet?", options: ["It translates human-readable domain names into IP addresses computers use to locate each other", "It encrypts all internet traffic", "It stores website content permanently", "It is a type of firewall"], answer: "It translates human-readable domain names into IP addresses computers use to locate each other", explanation: "DNS acts like an address book, converting names like 'example.com' into the numeric IP addresses computers actually use." },
    ],
  },
  "final-code-citadel": {
    easy: [
      { q: "The CPU is often called the:", options: ["Brain of the computer", "Storage of the computer", "Screen of the computer", "Keyboard of the computer"], answer: "Brain of the computer", explanation: "The CPU processes instructions and performs the core computations of a computer." },
      { q: "A loop is used in programming to:", options: ["Repeat a set of instructions", "Store a single value permanently", "Connect to a printer", "Delete a variable"], answer: "Repeat a set of instructions", explanation: "Loops let a program execute the same block of code multiple times." },
      { q: "Which number system uses only 0s and 1s?", options: ["Binary", "Decimal", "Hexadecimal", "Roman numerals"], answer: "Binary", explanation: "Binary is a base-2 number system using only the digits 0 and 1." },
      { q: "The World Wide Web is accessed using a:", options: ["Web browser", "Word processor", "Spreadsheet program", "Operating system installer"], answer: "Web browser", explanation: "Browsers retrieve and display web pages from servers over the internet." },
    ],
    medium: [
      { q: "Numerical: Convert the binary number 1100 to decimal.", type: "numerical", answer: "12", explanation: "1100 = (1\u00d78)+(1\u00d74)+(0\u00d72)+(0\u00d71) = 12." },
      { q: "Which best describes the purpose of an \"if-else\" statement?", options: ["To choose between two different actions based on a condition", "To repeat an action forever", "To store multiple values", "To connect to a network"], answer: "To choose between two different actions based on a condition", explanation: "If-else lets a program branch between two paths depending on whether a condition is true or false." },
      { q: "A firewall is best described as a tool that:", options: ["Filters network traffic to block unauthorized access", "Speeds up your internet connection", "Stores your files in the cloud", "Prints documents wirelessly"], answer: "Filters network traffic to block unauthorized access", explanation: "Firewalls inspect traffic against security rules, blocking potentially harmful connections." },
    ],
    hard: [
      { q: "Which best explains why algorithms are tested before being deployed in real systems?", options: ["To catch bugs and edge cases that could cause incorrect results or failures", "Testing is never necessary for working code", "To make the algorithm slower on purpose", "To change what the algorithm is meant to do"], answer: "To catch bugs and edge cases that could cause incorrect results or failures", explanation: "Thorough testing helps reveal errors before an algorithm is relied upon in production." },
      { q: "Numerical: A queue starts empty. 7 items are added, then 3 are removed. How many items remain?", type: "numerical", answer: "4", explanation: "7 added \u2212 3 removed = 4 remaining." },
    ],
    expert: [
      { q: "Which best explains why HTTPS uses encryption while plain HTTP does not?", options: ["HTTPS is designed to protect sensitive data from being intercepted in transit", "HTTPS and HTTP are functionally identical", "Encryption is unrelated to web security", "HTTP is always faster and safer"], answer: "HTTPS is designed to protect sensitive data from being intercepted in transit", explanation: "HTTPS adds a layer of encryption (via TLS/SSL) specifically to keep data secure as it travels across the network." },
    ],
  },
};

// Deterministic "monster" naming for the regular (non-boss) battle enemy â€”
// themed to the world so Atom Valley fights feel different from Acid Base
// Island fights, without needing a hand-authored enemy per lesson.
const MONSTER_TYPES = ["Slime", "Wisp", "Golem", "Sprite", "Fiend", "Serpent"];
const WORLD_MONSTER_PREFIX = {
  "atom-valley": "Proton",
  "molecule-forest": "Molecule",
  "bonding-cave": "Bond",
  "reaction-volcano": "Reactant",
  "acid-base-island": "Acid",
  "final-chemistry-kingdom": "Alchemy",
  "number-nexus": "Numeric",
  "algebra-atrium": "Variable",
  "geometry-grove": "Angular",
  "mensuration-mines": "Volumetric",
  "data-desert": "Probability",
  "final-math-summit": "Theorem",
  "motion-meadow": "Velocity",
  "force-falls": "Inertia",
  "energy-expanse": "Kinetic",
  "circuit-caverns": "Circuit",
  "light-lagoon": "Photon",
  "final-physics-frontier": "Force",
  "grammar-grasslands": "Syntax",
  "vocabulary-valley": "Lexicon",
  "comprehension-cliffs": "Riddle",
  "composition-cove": "Prose",
  "literary-lagoon": "Metaphor",
  "final-english-empire": "Grammar",
  "cell-city": "Membrane",
  "tissue-terrace": "Cellular",
  "kingdom-canyon": "Taxonomic",
  "wellness-woods": "Pathogen",
  "resource-reef": "Ecological",
  "final-biology-biosphere": "Evolution",
  "vyakaran-vatika": "Vyakaran",
  "shabd-sagar": "Shabd",
  "vachan-ghati": "Vachan",
  "lekhan-lok": "Lekhan",
  "sahitya-sarovar": "Alankar",
  "hindi-samman-shikhar": "Bhasha",
  "ezhuthu-thittam": "Ezhuthu",
  "sol-vanam": "Sol",
  "ilakkanam-kunru": "Ilakkanam",
  "padaippu-paguthi": "Padaippu",
  "ilakkiya-thurai": "Ani",
  "tamil-arasu": "Mozhi",
  "history-highlands": "Chronicle",
  "civics-citadel": "Bureaucracy",
  "geo-garden": "Cartography",
  "economy-isles": "Inflation",
  "resource-ridge": "Deforestation",
  "final-social-science-senate": "Constitution",
  "byte-bay": "Hardware",
  "algorithm-archipelago": "Logic",
  "code-canyon": "Syntax Error",
  "data-structure-dunes": "Array",
  "network-nook": "Firewall",
  "final-code-citadel": "Compiler",
};

// Builds one battle (Section 14) for a given class/board/world/lesson/
// difficulty. Pulls the matching question pool from QUESTION_BANK, splits
// the difficulty tier's total XP/coin reward (Sections 13 & 19) evenly
// across questions so a full clear pays out exactly the tier's listed
// reward, and names an enemy themed to the world.
export function getBattleData(grade, board, worldId, lessonId, difficultyId, subject) {
  const detail = getCourseDetail(grade, board, worldId, subject);
  if (!detail) return null;
  const lesson = detail.lessons.find((l) => l.id === lessonId);
  if (!lesson || lesson.status === "locked") return null;

  const difficulty = DIFFICULTIES.find((d) => d.id === difficultyId);
  if (!difficulty) return null;

  const pool = getQuestionPool(board, worldId, difficultyId);
  if (pool.length === 0) return null;

  const roll = seededRatio(`${grade ?? "9"}-${board ?? "CBSE"}-${worldId}-${lessonId}-${difficultyId}-enemy`);
  const monster = MONSTER_TYPES[Math.floor(roll * MONSTER_TYPES.length)];
  const enemyName = `${WORLD_MONSTER_PREFIX[worldId] ?? "Chemistry"} ${monster}`;

  const count = pool.length;
  const baseXp = Math.floor(difficulty.xp / count);
  const baseCoins = Math.floor(difficulty.coins / count);
  const questions = pool.map((item, i) => ({
    id: `${worldId}-${lessonId}-${difficultyId}-${i}`,
    class: grade ?? null,
    board: board ?? null,
    course: detail.world.name,
    lesson: lesson.title,
    difficulty: difficultyId,
    question: item.q,
    type: item.type ?? "mcq",
    options: item.options ?? null,
    pairs: item.pairs ?? null,
    image: item.image ?? null,
    correctAnswer: item.answer,
    explanation: item.explanation,
    // last question absorbs any rounding remainder so the sum always
    // equals the tier's full listed reward on a perfect clear.
    xp: i === count - 1 ? difficulty.xp - baseXp * (count - 1) : baseXp,
    coins: i === count - 1 ? difficulty.coins - baseCoins * (count - 1) : baseCoins,
    timer: { easy: 30, medium: 25, hard: 20, expert: 15 }[difficultyId] ?? 25,
  }));

  return {
    world: detail.world,
    lesson,
    difficulty,
    enemyName,
    questions,
  };
}

// Chapter Boss Battle (Section 21). Unlocks once every lesson in a world
// is cleared (bossStatus from getCourseDetail: "locked" | "ready" |
// "defeated"). Ten questions pulled across all four difficulty tiers of
// the same world â€” weighted toward the harder tiers near the end, per
// the brief's "the final questions should be harder" â€” rather than one
// fixed tier's pool like a regular lesson battle.
const BOSS_DIFFICULTY_MIX = ["easy", "easy", "medium", "medium", "medium", "hard", "hard", "hard", "expert", "expert"];
export const BOSS_REWARD = { xp: 500, coins: 250 };

export function getBossBattleData(grade, board, worldId, subject) {
  const detail = getCourseDetail(grade, board, worldId, subject);
  if (!detail) return null;
  const { world, bossStatus } = detail;
  if (bossStatus === "locked") return { world, bossStatus, questions: null };

  // Board-aware pools (Section 8) â€” same override-then-fallback precedence
  // as the regular lesson battle above, so a Boss fight uses the same
  // board-specific content the player has been studying all chapter.
  const pools = {
    easy: getQuestionPool(board, worldId, "easy"),
    medium: getQuestionPool(board, worldId, "medium"),
    hard: getQuestionPool(board, worldId, "hard"),
    expert: getQuestionPool(board, worldId, "expert"),
  };
  if (Object.values(pools).every((p) => p.length === 0)) return null;

  // Walk each difficulty's pool with its own cursor so a world with a
  // shallow bank still cycles through what it has rather than repeating
  // the same question back-to-back.
  const cursors = { easy: 0, medium: 0, hard: 0, expert: 0 };
  const questions = BOSS_DIFFICULTY_MIX.map((difficultyId, i) => {
    const pool = pools[difficultyId] ?? [];
    const item = pool.length > 0 ? pool[cursors[difficultyId] % pool.length] : null;
    cursors[difficultyId] += 1;
    if (!item) return null;
    const tier = DIFFICULTIES.find((d) => d.id === difficultyId);
    return {
      id: `${worldId}-boss-${difficultyId}-${i}`,
      class: grade ?? null,
      board: board ?? null,
      course: world.name,
      lesson: `${world.boss} (Boss)`,
      difficulty: difficultyId,
      question: item.q,
      type: item.type ?? "mcq",
      options: item.options ?? null,
      pairs: item.pairs ?? null,
      image: item.image ?? null,
      correctAnswer: item.answer,
      explanation: item.explanation,
      xp: tier?.xp ?? 20,
      coins: tier?.coins ?? 10,
      timer: { easy: 25, medium: 20, hard: 18, expert: 15 }[difficultyId] ?? 20,
    };
  }).filter(Boolean);

  if (questions.length === 0) return null;

  const template = worldTemplateFor(subject);
  const worldIndex = template.findIndex((w) => w.id === worldId);
  const nextWorld = worldIndex >= 0 && worldIndex + 1 < template.length ? template[worldIndex + 1] : null;

  return { world, bossStatus, questions, nextWorld, reward: BOSS_REWARD };
}

export const HOW_IT_WORKS = [
  {
    icon: "GraduationCap",
    title: "Choose Class",
    description: "Pick Class 9 through 12 to set your starting point.",
  },
  {
    icon: "Landmark",
    title: "Choose Board",
    description: "CBSE, ICSE, state, or international â€” your syllabus, exactly.",
  },
  {
    icon: "Globe",
    title: "Explore Chemistry World",
    description: "Land on your map: a world for every chapter in your curriculum.",
  },
  {
    icon: "BookOpen",
    title: "Choose Lesson",
    description: "Each lesson is a level, sized to one focused idea.",
  },
  {
    icon: "Swords",
    title: "Play & Battle",
    description: "Answer questions to attack. Miss one, and the enemy strikes back.",
  },
  {
    icon: "Gem",
    title: "Earn Rewards",
    description: "Collect XP, coins, and stars for every level you clear.",
  },
  {
    icon: "LockKeyholeOpen",
    title: "Unlock New Worlds",
    description: "Clear a chapter, defeat its boss, and the next world opens.",
  },
];

// Landing page "Game Features" strip (Section 36 #8) â€” concrete mechanics,
// distinct from the more experiential WhyLearnQuest cards above.
export const GAME_MECHANICS = [
  {
    icon: "Heart",
    title: "Lives System",
    description: "Start each level with 3 lives. A wrong answer costs one â€” run out and it's game over.",
    color: "#F87171",
  },
  {
    icon: "Layers",
    title: "4 Difficulty Tiers",
    description: "Easy, Medium, Hard, and Expert unlock progressively as you clear each tier's threshold.",
    color: "#38D9F4",
  },
  {
    icon: "FlaskConical",
    title: "Power-Ups",
    description: "Hint Potions, Double XP, Shields, and Time Freeze â€” bought with coins, used in battle.",
    color: "#4ADE80",
  },
  {
    icon: "Swords",
    title: "Chapter Boss Battles",
    description: "Clear every lesson in a world to unlock a 10-question boss fight with mixed difficulty.",
    color: "#806BFF",
  },
  {
    icon: "Puzzle",
    title: "10 Question Types",
    description: "MCQ, true/false, fill-in-the-blank, drag & drop, equations, numericals, and more.",
    color: "#FCD34D",
  },
  {
    icon: "Timer",
    title: "Timed Battles",
    description: "Every question runs on a clock â€” answer fast for the cleanest hits on the enemy.",
    color: "#38D9F4",
  },
];

// Gameplay Preview mock (Section 36 #9) â€” a static snapshot of the battle
// screen used purely for landing-page illustration.
export const GAMEPLAY_PREVIEW = {
  world: "Reaction Volcano",
  enemy: "Acid Slime",
  enemyHp: 60,
  enemyHpMax: 100,
  playerHp: 80,
  playerHpMax: 100,
  lives: 2,
  xp: 340,
  coins: 120,
  timer: 12,
  question: "What is the chemical formula of water?",
  options: ["CO\u2082", "H\u2082O", "O\u2082", "H\u2082"],
  correctIndex: 1,
};

export const FAQ_ITEMS = [
  {
    question: "Is LearnQuest based on my actual school syllabus?",
    answer: "Yes. Every question is mapped to your Class, Board, Course, and Lesson â€” so a Class 10 CBSE player only ever sees Class 10 CBSE content, never mixed with another board or grade.",
  },
  {
    question: "Which boards and classes are supported?",
    answer: "Classes 9 through 12 across CBSE, ICSE, Tamil Nadu State Board, and other configurable state boards, plus international boards like IB and IGCSE. More boards and classes can be added without rebuilding the app.",
  },
  {
    question: "Can I change my class or board later?",
    answer: "Yes, from your Profile page. Switching curriculum opens a new world map for that class/board, and your progress on every previous class/board combination is saved separately, never overwritten.",
  },
  {
    question: "Do I need to pay real money to play?",
    answer: "No. LearnQuest uses only virtual coins earned by playing. The in-game shop sells avatars, skins, frames, and power-ups for coins â€” there are no real-money purchases.",
  },
  {
    question: "What happens if I run out of lives in a level?",
    answer: "You'll see a Game Over screen with your score, accuracy, and XP earned so far, plus options to retry the level or jump into Practice Mode for your weakest topic.",
  },
  {
    question: "Is LearnQuest available on mobile?",
    answer: "The web app is fully responsive with touch-friendly controls and bottom navigation on mobile, and it's built to convert cleanly into Android and iOS apps.",
  },
];
