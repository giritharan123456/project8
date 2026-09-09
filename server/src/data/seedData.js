// Curriculum content ported from chemquest-landing/src/data/content.js
// (WORLD_TEMPLATE, LESSONS_BY_WORLD(+overrides), QUESTION_BANK(+overrides),
// DIFFICULTIES, BOARD_CATEGORIES, CLASSES, SHOP_ITEMS, MOCK_ACHIEVEMENTS,
// MOCK_DAILY_QUESTS) so `npm run seed` can load the same content into MySQL.
// Question/lesson *shape* matches Section 15/41 exactly; swap/add rows here
// (or seed straight into MySQL Workbench) as real per-board content is
// authored - nothing in src/routes or src/lib/gameLogic needs to change.

// Subject Selection screen, ahead of Board/Class selection. 'active'
// subjects have real worlds/lessons/questions below; 'coming_soon' ones are
// listed on the roadmap but have no content yet - add their WORLD_TEMPLATE/
// LESSONS_BY_WORLD/QUESTION_BANK entries the same way Mathematics was added
// below, then flip status to 'active' and re-run `npm run seed`.
const SUBJECTS = [
  { code: "chemistry", name: "Chemistry", icon: "FlaskConical", description: "Atoms, bonding, reactions, and acids & bases.", status: "active" },
  { code: "mathematics", name: "Mathematics", icon: "Sigma", description: "Algebra, geometry, fractions, statistics, and real-world math.", status: "active" },
  { code: "physics", name: "Physics", icon: "Zap", description: "Motion, force, energy, and electricity.", status: "active" },
  { code: "biology", name: "Biology", icon: "Dna", description: "Cells, the human body, plants, genetics, and ecology.", status: "coming_soon" },
  { code: "english", name: "English", icon: "BookOpen", description: "Grammar, vocabulary, reading, writing, and communication.", status: "active" },
  { code: "tamil", name: "Tamil", icon: "Languages", description: "Grammar, literature, vocabulary, reading, and writing.", status: "coming_soon" },
  { code: "social-science", name: "Social Science", icon: "Globe2", description: "History, geography, civics, and economics.", status: "coming_soon" },
  { code: "computer-science", name: "Computer Science", icon: "Cpu", description: "Programming, algorithms, databases, and networking.", status: "coming_soon" },
  { code: "accountancy", name: "Accountancy", icon: "BookText", description: "Journal, ledger, trial balance, and financial statements.", status: "coming_soon" },
  { code: "commerce", name: "Commerce", icon: "Store", description: "Trade, marketing, banking, and entrepreneurship.", status: "coming_soon" },
  { code: "economics", name: "Economics", icon: "TrendingUp", description: "Microeconomics, macroeconomics, and markets.", status: "coming_soon" },
  { code: "botany", name: "Botany", icon: "Sprout", description: "Plant structure, physiology, reproduction, and agriculture.", status: "coming_soon" },
  { code: "zoology", name: "Zoology", icon: "PawPrint", description: "Animal biology, human physiology, evolution, and biodiversity.", status: "coming_soon" },
];

const DIFFICULTIES = [
  { id: "easy", label: "Easy", description: "Basic concept questions.", xp: 20, coins: 10, unlockThreshold: 60 },
  { id: "medium", label: "Medium", description: "Concept application.", xp: 40, coins: 20, unlockThreshold: 70 },
  { id: "hard", label: "Hard", description: "Higher-order thinking.", xp: 60, coins: 30, unlockThreshold: 80 },
  { id: "expert", label: "Expert", description: "Advanced challenge.", xp: 100, coins: 50, unlockThreshold: null },
];

const CLASSES = [
  { grade: 4, icon: "Sprout", courses: 6, lessons: 28, questions: 180, difficulty: "Foundation" },
  { grade: 5, icon: "Leaf", courses: 7, lessons: 34, questions: 220, difficulty: "Foundation" },
  { grade: 6, icon: "Beaker", courses: 8, lessons: 42, questions: 300, difficulty: "Foundation \u2192 Beginner" },
  { grade: 7, icon: "TestTube", courses: 9, lessons: 48, questions: 360, difficulty: "Beginner" },
  { grade: 8, icon: "Microscope", courses: 10, lessons: 55, questions: 430, difficulty: "Beginner \u2192 Intermediate" },
  { grade: 9, icon: "FlaskConical", courses: 12, lessons: 65, questions: 520, difficulty: "Beginner \u2192 Intermediate" },
  { grade: 10, icon: "TestTubes", courses: 14, lessons: 78, questions: 640, difficulty: "Intermediate" },
  { grade: 11, icon: "Atom", courses: 16, lessons: 92, questions: 810, difficulty: "Intermediate \u2192 Advanced" },
  { grade: 12, icon: "Orbit", courses: 18, lessons: 104, questions: 940, difficulty: "Advanced" },
];

const BOARD_CATEGORIES = [
  {
    category: "Central Boards",
    boards: [
      { code: "CBSE", name: "CBSE", type: "Central Board", description: "NCERT-aligned curriculum, followed nationwide.", courses: 14, lessons: 78, icon: "Landmark" },
      { code: "ICSE", name: "ICSE", type: "Central Board", description: "In-depth, application-focused curriculum.", courses: 15, lessons: 82, icon: "ScrollText" },
    ],
  },
  {
    category: "State Boards",
    boards: [
      { code: "TN", name: "Tamil Nadu State Board", type: "State Board", description: "Curriculum set by the Tamil Nadu board.", courses: 13, lessons: 70, icon: "MapPinned" },
      { code: "MH", name: "Maharashtra State Board", type: "State Board", description: "Curriculum set by the Maharashtra board.", courses: 13, lessons: 68, icon: "MapPinned" },
    ],
  },
  {
    category: "International Boards",
    boards: [
      { code: "IB", name: "IB", type: "International Board", description: "Inquiry-based learning for the IB Diploma pathway.", courses: 16, lessons: 90, icon: "Globe2" },
      { code: "IGCSE", name: "IGCSE", type: "International Board", description: "Cambridge-aligned curriculum for IGCSE students.", courses: 15, lessons: 84, icon: "Globe2" },
    ],
  },
];

const WORLD_TEMPLATE = [
  // --- Chemistry (subjectCode defaults to "chemistry" below if omitted;
  // written out explicitly here since other subjects now share this list) ---
  { id: "atom-valley", subjectCode: "chemistry", name: "Atom Valley", topic: "Structure of the Atom", icon: "Atom", boss: "Proton Guardian" },
  { id: "molecule-forest", subjectCode: "chemistry", name: "Molecule Forest", topic: "Molecules & Compounds", icon: "Trees", boss: "Molecule Monster" },
  { id: "bonding-cave", subjectCode: "chemistry", name: "Bonding Cave", topic: "Chemical Bonding", icon: "Link2", boss: "Bond Breaker" },
  { id: "reaction-volcano", subjectCode: "chemistry", name: "Reaction Volcano", topic: "Chemical Reactions", icon: "Flame", boss: "Magma Reactant" },
  { id: "acid-base-island", subjectCode: "chemistry", name: "Acid Base Island", topic: "Acids, Bases & Salts", icon: "Waves", boss: "pH Phantom" },
  { id: "final-chemistry-kingdom", subjectCode: "chemistry", name: "Final Chemistry Kingdom", topic: "Final Mastery Challenge", icon: "Castle", boss: "The Alchemist King", isFinal: true },

  // --- Mathematics (pilot subject for the multi-subject redesign) ---
  { id: "algebra-atoll", subjectCode: "mathematics", name: "Algebra Atoll", topic: "Variables & Equations", icon: "Sigma", boss: "Variable Vortex" },
  { id: "geometry-gardens", subjectCode: "mathematics", name: "Geometry Gardens", topic: "Shapes, Angles & Area", icon: "Shapes", boss: "Angle Ogre" },
  { id: "fraction-falls", subjectCode: "mathematics", name: "Fraction Falls", topic: "Fractions, Decimals & Ratios", icon: "PieChart", boss: "Fraction Phantom" },
  { id: "statistics-summit", subjectCode: "mathematics", name: "Statistics Summit", topic: "Data, Averages & Probability", icon: "BarChart3", boss: "Data Dragon" },
  { id: "real-world-math-metropolis", subjectCode: "mathematics", name: "Real-World Math Metropolis", topic: "Money, Measurement & Rates", icon: "Building2", boss: "Metro Mind" },
  { id: "final-mathematics-kingdom", subjectCode: "mathematics", name: "Final Mathematics Kingdom", topic: "Final Mastery Challenge", icon: "Castle", boss: "The Number King", isFinal: true },

  // --- Physics ---
  { id: "motion-meadow", subjectCode: "physics", name: "Motion Meadow", topic: "Distance, Speed & Acceleration", icon: "Gauge", boss: "The Velocity Specter" },
  { id: "force-falls", subjectCode: "physics", name: "Force Falls", topic: "Newton's Laws of Motion", icon: "Anchor", boss: "Inertia Golem" },
  { id: "energy-expanse", subjectCode: "physics", name: "Energy Expanse", topic: "Work, Energy & Power", icon: "Flame", boss: "The Power Wraith" },
  { id: "circuit-caverns", subjectCode: "physics", name: "Circuit Caverns", topic: "Current Electricity", icon: "Zap", boss: "Circuit Sentinel" },
  { id: "light-lagoon", subjectCode: "physics", name: "Light Lagoon", topic: "Reflection, Refraction & Lenses", icon: "Sun", boss: "Refraction Phantom" },
  { id: "final-physics-frontier", subjectCode: "physics", name: "Final Physics Frontier", topic: "Final Mastery Challenge", icon: "Castle", boss: "The Force Sovereign", isFinal: true },

  // --- English ---
  { id: "grammar-grasslands", subjectCode: "english", name: "Grammar Grasslands", topic: "Parts of Speech & Sentence Structure", icon: "BookOpen", boss: "The Syntax Serpent" },
  { id: "vocabulary-valley", subjectCode: "english", name: "Vocabulary Valley", topic: "Synonyms, Antonyms & Word Building", icon: "Library", boss: "The Lexicon Lich" },
  { id: "comprehension-cliffs", subjectCode: "english", name: "Comprehension Cliffs", topic: "Reading Comprehension & Inference", icon: "ScrollText", boss: "The Riddle Sphinx" },
  { id: "composition-cove", subjectCode: "english", name: "Composition Cove", topic: "Paragraph & Essay Writing", icon: "PenTool", boss: "The Blank Page Wraith" },
  { id: "literary-lagoon", subjectCode: "english", name: "Literary Lagoon", topic: "Poetry, Prose & Literary Devices", icon: "Feather", boss: "The Metaphor Mirage" },
  { id: "final-english-empire", subjectCode: "english", name: "Final English Empire", topic: "Final Mastery Challenge", icon: "Castle", boss: "The Grammar Sovereign", isFinal: true },
];

const LESSONS_BY_WORLD = {
  "atom-valley": [
    { id: "l1", title: "Introduction to Atoms", description: "What atoms are and why everything is made of them." },
    { id: "l2", title: "Atomic Structure", description: "Protons, neutrons, and electrons \u2014 the anatomy of an atom." },
    { id: "l3", title: "Electron Configuration", description: "How electrons fill shells and why it matters." },
    { id: "l4", title: "Isotopes", description: "Same element, different mass \u2014 what makes an isotope." },
    { id: "l5", title: "Atomic Models", description: "From Dalton to Bohr \u2014 how our picture of the atom evolved." },
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

  // --- Mathematics ---
  "algebra-atoll": [
    { id: "l1", title: "Variables & Expressions", description: "What variables are and how to build expressions with them." },
    { id: "l2", title: "Linear Equations in One Variable", description: "Solving equations like 3x - 4 = 11 step by step." },
    { id: "l3", title: "Simplifying Expressions", description: "Combining like terms and expanding brackets." },
    { id: "l4", title: "Word Problems with Equations", description: "Turning real situations into equations you can solve." },
    { id: "l5", title: "Inequalities", description: "Solving and reading statements like 3x - 2 < 10." },
  ],
  "geometry-gardens": [
    { id: "l1", title: "Basic Shapes & Angles", description: "Naming polygons and measuring angles." },
    { id: "l2", title: "Triangles & the Angle Sum", description: "Why a triangle's angles always add to 180 degrees." },
    { id: "l3", title: "Perimeter & Area", description: "Finding the perimeter and area of rectangles and triangles." },
    { id: "l4", title: "Circles", description: "Radius, diameter, circumference, and area of a circle." },
    { id: "l5", title: "The Pythagorean Theorem", description: "Finding a missing side of a right triangle." },
  ],
  "fraction-falls": [
    { id: "l1", title: "Understanding Fractions", description: "What a numerator and denominator represent." },
    { id: "l2", title: "Adding & Subtracting Fractions", description: "Working with fractions that have different denominators." },
    { id: "l3", title: "Multiplying & Dividing Fractions", description: "Multiplying fractions and flipping to divide." },
    { id: "l4", title: "Decimals & Percentages", description: "Converting between fractions, decimals, and percentages." },
    { id: "l5", title: "Ratio & Proportion", description: "Comparing quantities and simplifying ratios." },
  ],
  "statistics-summit": [
    { id: "l1", title: "Collecting & Organizing Data", description: "Turning raw data into tables and graphs." },
    { id: "l2", title: "Mean, Median & Mode", description: "Three different ways to describe a 'typical' value." },
    { id: "l3", title: "Bar Graphs & Pie Charts", description: "Choosing the right chart for the data you have." },
    { id: "l4", title: "Probability Basics", description: "Predicting the chance of an event happening." },
    { id: "l5", title: "Interpreting Data", description: "Reading range, outliers, and what a data set is telling you." },
  ],
  "real-world-math-metropolis": [
    { id: "l1", title: "Budgeting & Simple Interest", description: "Managing money and calculating interest earned or owed." },
    { id: "l2", title: "Measurement & Unit Conversion", description: "Converting between units of length, time, and currency." },
    { id: "l3", title: "Speed, Distance & Time", description: "Reading timetables and solving travel problems." },
    { id: "l4", title: "Real-World Geometry", description: "Applying area and perimeter to rooms, gardens, and tanks." },
    { id: "l5", title: "Profit, Loss & Discounts", description: "Working out sale prices, profit percentage, and discounts." },
  ],
  "final-mathematics-kingdom": [
    { id: "l1", title: "Comprehensive Review", description: "A mixed recap across every world you've cleared." },
    { id: "l2", title: "Mixed Practice", description: "Cross-topic questions pulled from the whole syllabus." },
    { id: "l3", title: "Speed Challenge", description: "Beat the clock on rapid-fire math questions." },
    { id: "l4", title: "Master Trial", description: "The final gauntlet before the Mathematics Master title." },
  ],

  // --- Physics ---
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

  // --- English ---
  "grammar-grasslands": [
    { id: "l1", title: "Parts of Speech", description: "Nouns, verbs, adjectives, and the building blocks of every sentence." },
    { id: "l2", title: "Tenses", description: "Past, present, and future \u2014 and the forms in between." },
    { id: "l3", title: "Subject-Verb Agreement", description: "Making sure your subject and verb always match." },
    { id: "l4", title: "Sentence Types", description: "Simple, compound, and complex sentences, and how to build them." },
    { id: "l5", title: "Punctuation", description: "Commas, apostrophes, and full stops \u2014 the marks that shape meaning." },
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
};

// Section 8/9: board-specific override; falls back to LESSONS_BY_WORLD when
// no "<boardCode>:<worldId>" entry exists (see getLessonsForWorld in gameLogic.js).
const LESSONS_BY_WORLD_BOARD_OVERRIDES = {
  "TN:acid-base-island": [
    { id: "l1", title: "Acids, Bases and Salts", description: "The Tamil Nadu Board's framing of everyday acids and bases, from tamarind to soap." },
    { id: "l2", title: "Indicators in Daily Life", description: "Turmeric, litmus, and other indicators used to test common household liquids." },
    { id: "l3", title: "The pH Scale", description: "Measuring acidity and basicity from 0 to 14, with local examples like curd and lime water." },
    { id: "l4", title: "Neutralisation Reactions", description: "What happens when an acid and a base cancel each other out." },
    { id: "l5", title: "Common Salts", description: "How salts like sodium chloride and washing soda form and where they're used." },
  ],
};

const QUESTION_BANK = {
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
      { q: "True or False: Combustion reactions release heat.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Combustion is an exothermic reaction \u2014 it releases heat and usually light." },
      { q: "Fill in the blank: A reaction that releases heat to its surroundings is called ___.", type: "fill_blank", answer: "exothermic", explanation: "Exothermic reactions release energy, usually as heat." },
      { q: "Reaction: Zn + H2SO4 \u2192 ? + H2. What is the missing product?", type: "reaction", options: ["ZnSO4", "ZnO", "ZnCl2", "Zn(OH)2"], answer: "ZnSO4", explanation: "Zinc displaces hydrogen from sulfuric acid, forming zinc sulfate and hydrogen gas." },
    ],
    medium: [
      { q: "Balancing chemical equations follows which law?", options: ["Law of conservation of mass", "Law of definite proportions", "Boyle's law", "Newton's law"], answer: "Law of conservation of mass", explanation: "Matter isn't created or destroyed, so atoms must balance on both sides." },
      { q: "In a displacement reaction, a more reactive element:", options: ["Combines with oxygen only", "Displaces a less reactive element from its compound", "Always releases a gas", "Never changes"], answer: "Displaces a less reactive element from its compound", explanation: "The more reactive element takes the place of the less reactive one." },
      { q: "A reaction that absorbs heat from its surroundings is:", options: ["Exothermic", "Endothermic", "Combustion", "Precipitation"], answer: "Endothermic", explanation: "Endothermic reactions take in energy, often cooling their surroundings." },
      { q: "Which factor generally increases the rate of a reaction?", options: ["Lowering temperature", "Increasing temperature", "Removing the catalyst", "Decreasing concentration"], answer: "Increasing temperature", explanation: "Higher temperature gives particles more energy, so they collide more often and harder." },
      { q: "Drag and Drop: arrange these metals from most reactive to least reactive.", type: "drag_drop", options: ["Potassium", "Zinc", "Iron", "Copper"], answer: "Potassium|Zinc|Iron|Copper", explanation: "The reactivity series runs K > Zn > Fe > Cu \u2014 more reactive metals displace less reactive ones from their compounds." },
      { q: "Reaction: AgNO3 + NaCl \u2192 ? + NaNO3. What is the missing product?", type: "reaction", options: ["AgCl", "Ag2O", "AgNa", "AgCl2"], answer: "AgCl", explanation: "Silver and sodium swap partners (double displacement), forming a white AgCl precipitate and sodium nitrate." },
    ],
    hard: [
      { q: "In Zn + CuSO4 \u2192 ZnSO4 + Cu, zinc is:", options: ["Reduced", "Oxidized", "Unchanged", "A catalyst"], answer: "Oxidized", explanation: "Zinc loses electrons to become Zn\u00b2\u207a, which is oxidation." },
      { q: "A catalyst speeds up a reaction by:", options: ["Increasing reactant mass", "Lowering the activation energy", "Permanently raising temperature", "Being consumed in the reaction"], answer: "Lowering the activation energy", explanation: "Catalysts provide an easier pathway with lower activation energy, without being used up." },
      { q: "N2 + 3H2 \u2192 2NH3 is an example of a:", options: ["Decomposition reaction", "Combination reaction", "Displacement reaction", "Double displacement reaction"], answer: "Combination reaction", explanation: "Two substances combine into a single product, ammonia." },
      { q: "Which best describes a double displacement reaction?", options: ["Two compounds exchange ions to form new compounds", "One element replaces another", "A compound breaks into elements", "Two elements combine"], answer: "Two compounds exchange ions to form new compounds", explanation: "The positive and negative ions of two compounds swap partners." },
      { q: "Chemical Equation: Balance it by typing the missing coefficient \u2014 ___Fe + 3O2 \u2192 2Fe2O3. What number goes in the blank?", type: "chemical_equation", answer: "4", explanation: "4Fe + 3O2 \u2192 2Fe2O3 balances 4 iron atoms and 6 oxygen atoms on each side." },
      { q: "Reaction: CaCO3 (heated) \u2192 CaO + ?. What is the missing product?", type: "reaction", options: ["CO2", "O2", "H2O", "CaC2"], answer: "CO2", explanation: "Heating calcium carbonate (thermal decomposition) gives calcium oxide (quicklime) and carbon dioxide gas." },
    ],
    expert: [
      { q: "2KClO3 \u2192 2KCl + 3O2 is classified as a:", options: ["Combination reaction", "Decomposition reaction", "Displacement reaction", "Neutralization"], answer: "Decomposition reaction", explanation: "One compound breaks down into two simpler products." },
      { q: "In Fe2O3 + 2Al \u2192 Al2O3 + 2Fe, aluminium acts as the:", options: ["Oxidizing agent", "Reducing agent", "Catalyst", "Product"], answer: "Reducing agent", explanation: "Aluminium gives up electrons to iron oxide, reducing the iron while itself being oxidized." },
      { q: "Which of these does NOT generally increase reaction rate?", options: ["Increasing temperature", "Increasing concentration", "Adding a catalyst", "Decreasing surface area"], answer: "Decreasing surface area", explanation: "Less exposed surface area means fewer collisions, slowing the reaction." },
      { q: "Le Chatelier's principle: increasing pressure on a gaseous equilibrium favors the side with:", options: ["More moles of gas", "Fewer moles of gas", "Equal moles of gas", "No gas at all"], answer: "Fewer moles of gas", explanation: "The system shifts to reduce the total number of gas molecules, lowering pressure." },
      { q: "Reaction: C3H8 + 5O2 \u2192 3CO2 + ?. What is the missing product, and how many molecules?", type: "reaction", options: ["4H2O", "3H2O", "5H2O", "2H2O"], answer: "4H2O", explanation: "Balancing propane combustion: 8 hydrogen atoms on the left need 4 H2O molecules on the right." },
    ],
  },
  "acid-base-island": {
    easy: [
      { q: "A substance with a pH less than 7 is:", options: ["Acidic", "Basic", "Neutral", "A salt"], answer: "Acidic", explanation: "pH values below 7 indicate an acidic solution." },
      { q: "Which of these acids is commonly found in lemons?", options: ["Acetic acid", "Citric acid", "Sulfuric acid", "Hydrochloric acid"], answer: "Citric acid", explanation: "Citric acid gives citrus fruits like lemons their sour taste." },
      { q: "A base turns red litmus paper:", options: ["Red", "Blue", "Colorless", "Green"], answer: "Blue", explanation: "Bases turn red litmus paper blue, a classic test for alkalinity." },
      { q: "The pH of pure water is approximately:", options: ["0", "7", "14", "3"], answer: "7", explanation: "Pure water is neutral, sitting at pH 7." },
      { q: "Image-based: on this pH scale, which end is the most basic?", image: "ph-scale", options: ["Left (0)", "Middle (7)", "Right (14)", "There is no basic end"], answer: "Right (14)", explanation: "The scale runs acidic (0) to basic (14), with 7 as neutral \u2014 the right end is most basic." },
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
      { q: "A solution with pH 3 is how much more acidic than one with pH 5?", options: ["2 times", "20 times", "100 times", "1000 times"], answer: "100 times", explanation: "The pH scale is logarithmic, so each unit is a 10x change \u2014 two units is 100x." },
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
      { q: "Matter can neither be created nor destroyed in a chemical reaction \u2014 this is the:", options: ["Law of conservation of mass", "Law of multiple proportions", "Avogadro's law", "Boyle's law"], answer: "Law of conservation of mass", explanation: "This law is the reason chemical equations must be balanced." },
      { q: "The pH scale ranges from:", options: ["0 to 7", "0 to 10", "0 to 14", "1 to 14"], answer: "0 to 14", explanation: "pH is typically measured on a 0\u201314 scale, with 7 as neutral." },
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

  // --- Mathematics ---
  "algebra-atoll": {
    easy: [
      { q: "In the expression 5x + 3, what is the coefficient of x?", options: ["3", "5", "x", "8"], answer: "5", explanation: "The coefficient is the number multiplying the variable \u2014 here it's 5." },
      { q: "What is the value of x in the equation x + 7 = 12?", options: ["3", "4", "5", "19"], answer: "5", explanation: "Subtracting 7 from both sides gives x = 5." },
      { q: "Which of these is a variable?", options: ["7", "x", "+", "="], answer: "x", explanation: "A variable is a letter that stands in for an unknown number." },
      { q: "True or False: In algebra, a variable can represent different values.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Variables are placeholders that can stand for different numbers depending on the equation." },
      { q: "Fill in the blank: An equation with an equals sign shows that both sides are ___.", type: "fill_blank", answer: "equal", explanation: "The equals sign means the expressions on either side have the same value." },
    ],
    medium: [
      { q: "Solve for x: 3x - 4 = 11", options: ["3", "4", "5", "6"], answer: "5", explanation: "Adding 4 gives 3x = 15, so x = 5." },
      { q: "Simplify: 4x + 3x", options: ["7x", "12x", "7x\u00b2", "x"], answer: "7x", explanation: "Like terms combine by adding their coefficients: 4x + 3x = 7x." },
      { q: "Numerical: If 2x = 18, what is x?", type: "numerical", answer: "9", explanation: "Dividing both sides by 2 gives x = 9." },
      { q: "Which expression is equivalent to 2(x + 3)?", options: ["2x + 3", "2x + 6", "x + 6", "2x + 5"], answer: "2x + 6", explanation: "Distributing the 2 gives 2\u00d7x + 2\u00d73 = 2x + 6." },
      { q: "Solve for x: x/4 = 6", options: ["1.5", "10", "24", "2"], answer: "24", explanation: "Multiplying both sides by 4 gives x = 24." },
    ],
    hard: [
      { q: "Solve: 5x + 2 = 3x + 10", options: ["2", "3", "4", "5"], answer: "4", explanation: "Subtracting 3x and 2 from both sides gives 2x = 8, so x = 4." },
      { q: "Numerical: Solve for x: 7(x - 1) = 21", type: "numerical", answer: "4", explanation: "Expanding gives 7x - 7 = 21, so 7x = 28 and x = 4." },
      { q: "Which inequality represents 'twice a number decreased by 5 is at least 9'?", options: ["2x - 5 \u2265 9", "2x - 5 \u2264 9", "2x + 5 \u2265 9", "x - 5 \u2265 9"], answer: "2x - 5 \u2265 9", explanation: "'At least' means greater than or equal to, giving 2x - 5 \u2265 9." },
      { q: "Solve the inequality: 3x - 2 < 10", options: ["x < 4", "x > 4", "x < 12", "x < 3"], answer: "x < 4", explanation: "Adding 2 gives 3x < 12, so dividing by 3 gives x < 4." },
    ],
    expert: [
      { q: "Solve the system: x + y = 10, x - y = 2. What is x?", options: ["4", "5", "6", "8"], answer: "6", explanation: "Adding both equations eliminates y: 2x = 12, so x = 6." },
      { q: "Numerical: If 3(2x - 1) = 4x + 5, what is x?", type: "numerical", answer: "4", explanation: "Expanding gives 6x - 3 = 4x + 5, so 2x = 8 and x = 4." },
      { q: "A number increased by 20% equals 60. What is the number?", options: ["40", "45", "48", "50"], answer: "50", explanation: "1.2 \u00d7 x = 60, so x = 60 \u00f7 1.2 = 50." },
      { q: "Which value of x satisfies both x > 2 and x < 5, and is even?", options: ["2", "3", "4", "5"], answer: "4", explanation: "The only even number strictly between 2 and 5 is 4." },
    ],
  },
  "geometry-gardens": {
    easy: [
      { q: "How many degrees are in a right angle?", options: ["45", "90", "180", "360"], answer: "90", explanation: "A right angle is exactly 90 degrees." },
      { q: "A triangle has how many sides?", options: ["2", "3", "4", "5"], answer: "3", explanation: "A triangle is a polygon with exactly three sides." },
      { q: "What do we call a four-sided polygon?", options: ["Triangle", "Quadrilateral", "Pentagon", "Hexagon"], answer: "Quadrilateral", explanation: "'Quad' means four, so a four-sided shape is a quadrilateral." },
      { q: "True or False: All angles in a square are equal.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Every angle in a square is a 90-degree right angle." },
      { q: "Fill in the blank: The sum of the interior angles of a triangle is always ___ degrees.", type: "fill_blank", answer: "180", explanation: "Every triangle's interior angles add up to 180 degrees." },
    ],
    medium: [
      { q: "A triangle has angles of 60\u00b0 and 70\u00b0. What is the third angle?", options: ["40", "50", "60", "70"], answer: "50", explanation: "180 - 60 - 70 = 50 degrees." },
      { q: "What is the perimeter of a rectangle with length 8 cm and width 5 cm?", options: ["13", "26", "40", "20"], answer: "26", explanation: "Perimeter = 2(length + width) = 2(8 + 5) = 26 cm." },
      { q: "Numerical: Find the area of a rectangle with length 6 cm and width 4 cm, in cm\u00b2.", type: "numerical", answer: "24", explanation: "Area = length \u00d7 width = 6 \u00d7 4 = 24 cm\u00b2." },
      { q: "Which shape has all sides equal and all angles equal at 60\u00b0 each?", options: ["Square", "Equilateral triangle", "Rectangle", "Rhombus"], answer: "Equilateral triangle", explanation: "An equilateral triangle's three equal angles always add to 180\u00b0, so each is 60\u00b0." },
      { q: "The diameter of a circle is 10 cm. What is its radius?", options: ["2.5", "5", "10", "20"], answer: "5", explanation: "Radius is always half the diameter: 10 \u00f7 2 = 5 cm." },
    ],
    hard: [
      { q: "A right triangle has legs of 3 cm and 4 cm. What is the hypotenuse?", options: ["5", "6", "7", "25"], answer: "5", explanation: "By the Pythagorean theorem, \u221a(3\u00b2 + 4\u00b2) = \u221a25 = 5 cm." },
      { q: "Numerical: Find the area of a triangle with base 10 cm and height 6 cm, in cm\u00b2.", type: "numerical", answer: "30", explanation: "Area = \u00bd \u00d7 base \u00d7 height = \u00bd \u00d7 10 \u00d7 6 = 30 cm\u00b2." },
      { q: "A circle has radius 7 cm. What is its circumference? (use \u03c0 \u2248 22/7)", options: ["22", "44", "49", "154"], answer: "44", explanation: "Circumference = 2\u03c0r = 2 \u00d7 22/7 \u00d7 7 = 44 cm." },
      { q: "In a right triangle, if one leg is 6 and the hypotenuse is 10, what is the other leg?", options: ["6", "8", "10", "4"], answer: "8", explanation: "\u221a(10\u00b2 - 6\u00b2) = \u221a64 = 8." },
    ],
    expert: [
      { q: "A rectangular garden is 12 m by 9 m. What is the length of its diagonal?", options: ["13", "15", "17", "21"], answer: "15", explanation: "\u221a(12\u00b2 + 9\u00b2) = \u221a225 = 15 m." },
      { q: "Numerical: Find the area of a circle with radius 7 cm (use \u03c0 \u2248 22/7), in cm\u00b2.", type: "numerical", answer: "154", explanation: "Area = \u03c0r\u00b2 = 22/7 \u00d7 49 = 154 cm\u00b2." },
      { q: "Two similar triangles have a scale factor of 3. If the smaller triangle has area 5 cm\u00b2, what is the area of the larger triangle?", options: ["15", "25", "45", "9"], answer: "45", explanation: "Area scales with the square of the side ratio: 3\u00b2 = 9, so 5 \u00d7 9 = 45 cm\u00b2." },
      { q: "The sum of interior angles of a hexagon is:", options: ["540", "720", "900", "1080"], answer: "720", explanation: "Sum = (n - 2) \u00d7 180 = (6 - 2) \u00d7 180 = 720 degrees." },
    ],
  },
  "fraction-falls": {
    easy: [
      { q: "Which fraction is equivalent to 1/2?", options: ["2/4", "1/3", "3/4", "2/3"], answer: "2/4", explanation: "Multiplying the top and bottom of 1/2 by 2 gives 2/4." },
      { q: "What is 1/4 + 1/4?", options: ["1/8", "1/2", "2/8", "3/4"], answer: "1/2", explanation: "1/4 + 1/4 = 2/4, which simplifies to 1/2." },
      { q: "Which of these fractions is the largest?", options: ["1/2", "1/3", "1/4", "1/5"], answer: "1/2", explanation: "The smaller the denominator (for the same numerator), the larger the fraction." },
      { q: "True or False: 3/6 is equal to 1/2.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Dividing top and bottom of 3/6 by 3 gives 1/2." },
      { q: "Fill in the blank: In the fraction 3/4, the bottom number is called the ___.", type: "fill_blank", answer: "denominator", explanation: "The denominator shows how many equal parts the whole is divided into." },
    ],
    medium: [
      { q: "What is 2/3 + 1/6?", options: ["5/6", "3/9", "1/2", "5/9"], answer: "5/6", explanation: "Using a common denominator of 6: 4/6 + 1/6 = 5/6." },
      { q: "What is 3/4 of 20?", options: ["10", "12", "15", "18"], answer: "15", explanation: "3/4 \u00d7 20 = 60/4 = 15." },
      { q: "What is 3/5 written as a percentage?", options: ["30%", "60%", "35%", "65%"], answer: "60%", explanation: "3/5 = 0.6 = 60%." },
      { q: "What is 5/8 - 1/8?", options: ["1/4", "3/8", "1/2", "5/8"], answer: "1/2", explanation: "5/8 - 1/8 = 4/8, which simplifies to 1/2." },
      { q: "Numerical: Express 3/4 as a decimal.", type: "numerical", answer: "0.75", explanation: "Dividing 3 by 4 gives 0.75." },
    ],
    hard: [
      { q: "What is 2/3 \u00d7 3/4?", options: ["1/2", "2/7", "3/4", "6/12"], answer: "1/2", explanation: "Multiplying gives 6/12, which simplifies to 1/2." },
      { q: "Numerical: Divide 3/4 \u00f7 1/2. Give the answer as a decimal.", type: "numerical", answer: "1.5", explanation: "Dividing by a fraction means multiplying by its reciprocal: 3/4 \u00d7 2 = 1.5." },
      { q: "A recipe needs 2/3 cup of sugar, and you want to make 1.5 times the recipe. How much sugar is needed?", options: ["1/2 cup", "2/3 cup", "1 cup", "1.5 cups"], answer: "1 cup", explanation: "2/3 \u00d7 1.5 = 1 cup." },
      { q: "Which ratio is equivalent to 4:6?", options: ["2:3", "3:4", "1:2", "4:8"], answer: "2:3", explanation: "Dividing both parts of 4:6 by 2 gives 2:3." },
    ],
    expert: [
      { q: "A shirt originally priced at $40 is discounted by 25%. What is the sale price?", options: ["$25", "$30", "$35", "$32"], answer: "$30", explanation: "25% of $40 is $10, so the sale price is $40 - $10 = $30." },
      { q: "Numerical: A class has 30 students, and 3/5 are girls. How many boys are there?", type: "numerical", answer: "12", explanation: "Girls = 3/5 \u00d7 30 = 18, so boys = 30 - 18 = 12." },
      { q: "Express the ratio 15:25 in simplest form.", options: ["3:5", "5:3", "1:2", "15:25"], answer: "3:5", explanation: "Dividing both parts by 5 gives 3:5." },
      { q: "A map has a scale of 1:50000. A distance of 4 cm on the map represents how many km in real life?", options: ["0.5 km", "1 km", "2 km", "4 km"], answer: "2 km", explanation: "4 cm \u00d7 50000 = 200000 cm = 2000 m = 2 km." },
    ],
  },
  "statistics-summit": {
    easy: [
      { q: "What is the mean (average) of 2, 4, 6?", options: ["3", "4", "5", "6"], answer: "4", explanation: "(2 + 4 + 6) \u00f7 3 = 4." },
      { q: "Which graph is best for showing parts of a whole?", options: ["Bar graph", "Pie chart", "Line graph", "Scatter plot"], answer: "Pie chart", explanation: "A pie chart divides a circle into slices that represent parts of a whole." },
      { q: "What is the mode of the data set 2, 3, 3, 5, 7?", options: ["2", "3", "5", "7"], answer: "3", explanation: "The mode is the value that appears most often \u2014 here, 3 appears twice." },
      { q: "True or False: The median is the middle value of an ordered data set.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Once data is sorted, the median is the value that sits in the middle." },
      { q: "Fill in the blank: The difference between the highest and lowest values in a data set is called the ___.", type: "fill_blank", answer: "range", explanation: "Range = highest value - lowest value." },
    ],
    medium: [
      { q: "Find the median of: 5, 1, 9, 3, 7.", options: ["1", "3", "5", "7"], answer: "5", explanation: "Sorted, the data is 1, 3, 5, 7, 9 \u2014 the middle value is 5." },
      { q: "Numerical: Find the range of the data set 12, 7, 15, 9, 20.", type: "numerical", answer: "13", explanation: "Range = 20 - 7 = 13." },
      { q: "A die is rolled once. What is the probability of rolling a 4?", options: ["1/2", "1/3", "1/6", "1/4"], answer: "1/6", explanation: "One of the six equally likely faces shows a 4." },
      { q: "In a bar graph, what does the height of each bar usually represent?", options: ["Category name", "Frequency or value", "Time", "Color"], answer: "Frequency or value", explanation: "Bar height is used to show the size, count, or value of each category." },
      { q: "Find the mean of: 10, 20, 30, 40.", options: ["20", "25", "30", "35"], answer: "25", explanation: "(10 + 20 + 30 + 40) \u00f7 4 = 25." },
    ],
    hard: [
      { q: "A bag has 4 red and 6 blue balls. What is the probability of picking a red ball?", options: ["2/5", "1/2", "3/5", "4/6"], answer: "2/5", explanation: "4 red out of 10 total simplifies to 2/5." },
      { q: "Numerical: The mean of 5 numbers is 12. What is their total sum?", type: "numerical", answer: "60", explanation: "Sum = mean \u00d7 count = 12 \u00d7 5 = 60." },
      { q: "A coin is tossed twice. What is the probability of getting two heads?", options: ["1/2", "1/3", "1/4", "1/8"], answer: "1/4", explanation: "P(head) \u00d7 P(head) = 1/2 \u00d7 1/2 = 1/4." },
      { q: "Which measure of central tendency is most affected by an extreme outlier?", options: ["Mean", "Median", "Mode", "Range"], answer: "Mean", explanation: "A very large or small value pulls the average (mean) toward it more than the median or mode." },
    ],
    expert: [
      { q: "A survey of 50 students found 30 like cricket. If one student is picked at random, what's the probability they do NOT like cricket?", options: ["3/5", "2/5", "1/2", "1/5"], answer: "2/5", explanation: "20 out of 50 don't like cricket, which simplifies to 2/5." },
      { q: "Numerical: The mean of 6 numbers is 15. If one number, 9, is removed, what is the mean of the remaining 5 numbers?", type: "numerical", answer: "16.2", explanation: "Total was 90; removing 9 leaves 81, and 81 \u00f7 5 = 16.2." },
      { q: "Two dice are rolled. What is the probability that their sum equals 7?", options: ["1/6", "1/12", "1/9", "1/4"], answer: "1/6", explanation: "6 of the 36 equally likely outcomes sum to 7, which simplifies to 1/6." },
      { q: "A data set's mean is 20 and its median is 15. This suggests the data is likely:", options: ["Skewed right (toward higher values)", "Perfectly symmetric", "Skewed left (toward lower values)", "Impossible to determine"], answer: "Skewed right (toward higher values)", explanation: "A mean noticeably higher than the median usually signals a few unusually large values pulling it up." },
    ],
  },
  "real-world-math-metropolis": {
    easy: [
      { q: "If a bus ticket costs $3 and you buy 4 tickets, how much do you spend in total?", options: ["$7", "$10", "$12", "$15"], answer: "$12", explanation: "3 \u00d7 4 = 12." },
      { q: "You saved $50 and spend $18. How much do you have left?", options: ["$28", "$30", "$32", "$35"], answer: "$32", explanation: "50 - 18 = 32." },
      { q: "How many minutes are there in 2 hours?", options: ["60", "90", "120", "150"], answer: "120", explanation: "Each hour has 60 minutes, so 2 \u00d7 60 = 120." },
      { q: "True or False: 1 kilometer is equal to 1000 meters.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "'Kilo' means 1000, so 1 km = 1000 m." },
      { q: "Fill in the blank: Simple interest is calculated using the formula I = P \u00d7 R \u00d7 ___ (Principal \u00d7 Rate \u00d7 ...).", type: "fill_blank", answer: "Time", explanation: "Simple interest depends on the principal, the rate, and the time the money is invested for." },
    ],
    medium: [
      { q: "A car travels 240 km in 4 hours. What is its average speed?", options: ["40 km/h", "50 km/h", "60 km/h", "80 km/h"], answer: "60 km/h", explanation: "Speed = distance \u00f7 time = 240 \u00f7 4 = 60 km/h." },
      { q: "Numerical: You deposit $500 in a bank at 4% simple annual interest. How much interest do you earn in 1 year?", type: "numerical", answer: "20", explanation: "Interest = 500 \u00d7 0.04 \u00d7 1 = 20." },
      { q: "A recipe serves 4 people and needs 2 cups of rice. How many cups are needed to serve 10 people?", options: ["4", "5", "6", "8"], answer: "5", explanation: "2 cups \u00f7 4 people \u00d7 10 people = 5 cups." },
      { q: "If 1 US dollar = 83 rupees, how many rupees is $5?", options: ["83", "166", "415", "830"], answer: "415", explanation: "5 \u00d7 83 = 415." },
      { q: "A train leaves at 3:45 PM and arrives at 6:15 PM. How long is the journey?", options: ["2 hours", "2 hours 15 minutes", "2 hours 30 minutes", "3 hours"], answer: "2 hours 30 minutes", explanation: "From 3:45 PM to 6:15 PM is 2 hours and 30 minutes." },
    ],
    hard: [
      { q: "A shopkeeper buys an item for $80 and sells it for $100. What is the profit percentage?", options: ["20%", "25%", "30%", "80%"], answer: "25%", explanation: "Profit is $20 on a cost of $80, and 20/80 = 25%." },
      { q: "Numerical: A loan of $1000 is taken at 5% simple interest per year for 3 years. How much total interest is paid?", type: "numerical", answer: "150", explanation: "Interest = 1000 \u00d7 0.05 \u00d7 3 = 150." },
      { q: "A room is 5 m long and 4 m wide. How many square meters of carpet are needed to cover the floor?", options: ["9", "18", "20", "40"], answer: "20", explanation: "Area = length \u00d7 width = 5 \u00d7 4 = 20 m\u00b2." },
      { q: "Two trains start at the same time from stations 300 km apart, moving toward each other at 50 km/h and 70 km/h. After how many hours will they meet?", options: ["2 hours", "2.5 hours", "3 hours", "3.5 hours"], answer: "2.5 hours", explanation: "Combined speed is 120 km/h, so time = 300 \u00f7 120 = 2.5 hours." },
    ],
    expert: [
      { q: "An amount of $2000 grows to $2200 in 1 year under simple interest. What is the interest rate?", options: ["5%", "8%", "10%", "12%"], answer: "10%", explanation: "Interest earned is $200, and 200/2000 = 10%." },
      { q: "Numerical: A car uses fuel at 12 km per liter. How many liters are needed for a 300 km trip?", type: "numerical", answer: "25", explanation: "300 \u00f7 12 = 25 liters." },
      { q: "A worker is paid $15 per hour and works 7.5 hours a day for 5 days. What is their total pay for the week?", options: ["$525", "$550", "$562.50", "$600"], answer: "$562.50", explanation: "15 \u00d7 7.5 \u00d7 5 = 562.5." },
      { q: "A tank is filled by pipe A in 6 hours and by pipe B in 3 hours. Working together, how long will they take to fill the tank?", options: ["2 hours", "3 hours", "4.5 hours", "9 hours"], answer: "2 hours", explanation: "Combined rate is 1/6 + 1/3 = 1/2 tank per hour, so together they take 2 hours." },
    ],
  },
  "final-mathematics-kingdom": {
    easy: [
      { q: "What is 15 + 27?", options: ["32", "40", "42", "45"], answer: "42", explanation: "15 + 27 = 42." },
      { q: "Which of these numbers is a prime number?", options: ["9", "15", "17", "21"], answer: "17", explanation: "17 has no divisors other than 1 and itself." },
      { q: "What is the value of 6\u00b2?", options: ["12", "18", "36", "64"], answer: "36", explanation: "6\u00b2 means 6 \u00d7 6 = 36." },
      { q: "True or False: Zero is an even number.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Zero is divisible by 2 with no remainder, so it counts as even." },
    ],
    medium: [
      { q: "Solve for x: 2x + 5 = 17", options: ["5", "6", "7", "8"], answer: "6", explanation: "2x = 12, so x = 6." },
      { q: "What is the area of a square with side length 9 cm?", options: ["18", "36", "72", "81"], answer: "81", explanation: "Area = side\u00b2 = 9\u00b2 = 81 cm\u00b2." },
      { q: "Numerical: What is the mean of 4, 8, 12, 16?", type: "numerical", answer: "10", explanation: "(4 + 8 + 12 + 16) \u00f7 4 = 10." },
      { q: "Simplify 3/9 to its lowest terms.", options: ["1/2", "1/3", "2/3", "3/9"], answer: "1/3", explanation: "Dividing top and bottom by 3 gives 1/3." },
    ],
    hard: [
      { q: "A right triangle has legs 5 cm and 12 cm. What is its hypotenuse?", options: ["10", "13", "15", "17"], answer: "13", explanation: "\u221a(5\u00b2 + 12\u00b2) = \u221a169 = 13 cm." },
      { q: "Numerical: Solve for x: 4(x + 2) = 32", type: "numerical", answer: "6", explanation: "Expanding gives 4x + 8 = 32, so 4x = 24 and x = 6." },
      { q: "A shop offers a 20% discount on a $150 item. What is the sale price?", options: ["$100", "$110", "$120", "$130"], answer: "$120", explanation: "20% of $150 is $30, so the sale price is $150 - $30 = $120." },
      { q: "What is the probability of rolling an even number on a standard six-sided die?", options: ["1/6", "1/3", "1/2", "2/3"], answer: "1/2", explanation: "3 of the 6 faces (2, 4, 6) are even, which simplifies to 1/2." },
    ],
    expert: [
      { q: "Solve the system: 2x + y = 11, x - y = 1. What is x?", options: ["3", "4", "5", "6"], answer: "4", explanation: "Adding the equations eliminates y: 3x = 12, so x = 4." },
      { q: "Numerical: A car travels 150 km at 60 km/h, then 100 km at 50 km/h. What is the total time taken, in hours (as a decimal)?", type: "numerical", answer: "4.5", explanation: "150 \u00f7 60 = 2.5 hours, and 100 \u00f7 50 = 2 hours, for a total of 4.5 hours." },
      { q: "The mean of 5 numbers is 18. Four of the numbers are 15, 20, 22, and 10. What is the fifth number?", options: ["20", "21", "23", "25"], answer: "23", explanation: "Total sum = 18 \u00d7 5 = 90; the first four sum to 67, so the fifth is 90 - 67 = 23." },
      { q: "A cylindrical tank has radius 7 m and height 10 m. What is its volume? (use \u03c0 \u2248 22/7)", options: ["1100", "1320", "1540", "1760"], answer: "1540", explanation: "Volume = \u03c0r\u00b2h = 22/7 \u00d7 49 \u00d7 10 = 1540 m\u00b3." },
    ],
  },

  // --- Physics ---
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

  // --- English ---
  "grammar-grasslands": {
    easy: [
      { q: "Which word in this sentence is a verb? \"The dog barked loudly.\"", options: ["Dog", "Barked", "Loudly", "The"], answer: "Barked", explanation: "A verb shows an action \u2014 \"barked\" is what the dog did." },
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
      { q: "Which sentence contains a dangling modifier?", options: ["Walking to school, the rain started falling.", "Walking to school, I saw the rain start falling.", "The rain started falling as I walked to school.", "I walked to school in the rain."], answer: "Walking to school, the rain started falling.", explanation: "The rain wasn't walking to school \u2014 the modifier has nothing sensible to describe, making it a dangling modifier." },
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
      { q: "Which word means the opposite of \"benevolent\"?", options: ["Kind", "Malicious", "Generous", "Gentle"], answer: "Malicious", explanation: "\"Benevolent\" means kind and well-meaning; \"malicious\" means the opposite \u2014 intending harm." },
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
      { q: "Which sentence contains a spelling error that proofreading should catch?", options: ["She recieved the package yesterday.", "She received the package yesterday.", "She opened the package.", "The package arrived."], answer: "She recieved the package yesterday.", explanation: "\"Recieved\" breaks the \"i before e\" rule \u2014 the correct spelling is \"received\"." },
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
};

// Section 8's proof-of-concept board override (see LESSONS_BY_WORLD_BOARD_OVERRIDES above).
const QUESTION_BANK_BOARD_OVERRIDES = {
  "TN:acid-base-island": {
    easy: [
      { q: "Which of these is a natural indicator used in Tamil Nadu households?", options: ["Turmeric", "Copper sulfate", "Iron filings", "Sodium chloride"], answer: "Turmeric", explanation: "Turmeric turns red-brown in basic solutions, making it a common natural indicator." },
      { q: "Tamarind (puli) water tastes sour because it contains:", options: ["An acid", "A base", "A salt", "Pure water"], answer: "An acid", explanation: "Tamarind contains tartaric acid, which gives it its sour taste." },
      { q: "A solution with pH 7 is:", options: ["Acidic", "Basic", "Neutral", "Undefined"], answer: "Neutral", explanation: "pH 7 marks the neutral point on the scale \u2014 neither acidic nor basic." },
      { q: "Which of these commonly found liquids is basic?", options: ["Lime water", "Lemon juice", "Curd", "Vinegar"], answer: "Lime water", explanation: "Lime water (calcium hydroxide solution) is basic, unlike the other acidic examples." },
      { q: "True or False: Litmus paper turns red in an acidic solution.", type: "true_false", options: ["True", "False"], answer: "True", explanation: "Blue litmus turns red in acids \u2014 a classic acid test." },
    ],
    medium: [
      { q: "Curd turning more sour over time is due to the formation of:", options: ["Lactic acid", "Citric acid", "Sulfuric acid", "Carbonic acid"], answer: "Lactic acid", explanation: "Bacteria ferment lactose in milk into lactic acid, souring the curd." },
      { q: "Washing soda is chemically known as:", options: ["Sodium carbonate", "Sodium chloride", "Sodium bicarbonate", "Sodium hydroxide"], answer: "Sodium carbonate", explanation: "Washing soda is hydrated sodium carbonate, Na2CO3\u00b710H2O." },
      { q: "Fill in the blank: An acid reacting with a base to form salt and water is called ___.", type: "fill_blank", answer: "neutralization", explanation: "This acid-base reaction that produces a salt and water is neutralization." },
      { q: "Which salt is produced when hydrochloric acid reacts with sodium hydroxide?", options: ["Sodium chloride", "Sodium sulfate", "Sodium nitrate", "Sodium carbonate"], answer: "Sodium chloride", explanation: "HCl + NaOH \u2192 NaCl + H2O \u2014 common table salt and water." },
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
      { q: "Which of these is NOT a use of sodium hydroxide?", options: ["Making soap", "Souring milk", "Paper manufacturing", "Degreasing metal surfaces"], answer: "Souring milk", explanation: "Sodium hydroxide is a strong base used industrially \u2014 souring milk is caused by lactic acid, not NaOH." },
      { q: "A strong acid fully dissociates in water, meaning it:", options: ["Releases all its H+ ions", "Releases no ions", "Forms a precipitate", "Turns into a gas"], answer: "Releases all its H+ ions", explanation: "Strong acids ionize completely in solution, releasing the maximum possible H+ ions." },
      { q: "Numerical: A solution has [H+] = 1 \u00d7 10^-4 mol/L. What is its pH?", type: "numerical", answer: "4", explanation: "pH = -log[H+] = -log(10^-4) = 4." },
    ],
  },
};

const SHOP_ITEMS = [
  { id: "av-atom", category: "avatars", name: "Atom Adept", icon: "Atom", price: 150 },
  { id: "av-flask", category: "avatars", name: "Flask Fighter", icon: "FlaskConical", price: 150 },
  { id: "av-crystal", category: "avatars", name: "Crystal Sage", icon: "Gem", price: 300 },
  { id: "av-phoenix", category: "avatars", name: "Alchemy Phoenix", icon: "Bird", price: 500 },
  { id: "skin-neon", category: "skins", name: "Neon Circuit Skin", icon: "Sparkle", price: 250 },
  { id: "skin-lava", category: "skins", name: "Molten Lava Skin", icon: "Flame", price: 250 },
  { id: "skin-frost", category: "skins", name: "Frost Lab Skin", icon: "Snowflake", price: 250 },
  { id: "bg-nebula", category: "backgrounds", name: "Nebula Lab", icon: "Sparkles", price: 200 },
  { id: "bg-cave", category: "backgrounds", name: "Crystal Cavern", icon: "Mountain", price: 200 },
  { id: "bg-volcano", category: "backgrounds", name: "Volcanic Ridge", icon: "Flame", price: 200 },
  { id: "pu-hint", category: "powerups", name: "Hint Potion", icon: "FlaskConical", price: 50, description: "Removes one incorrect answer." },
  { id: "pu-doublexp", category: "powerups", name: "Double XP", icon: "Zap", price: 80, description: "Doubles XP earned for one level." },
  { id: "pu-shield", category: "powerups", name: "Shield", icon: "Shield", price: 70, description: "Protects one life." },
  { id: "pu-freeze", category: "powerups", name: "Time Freeze", icon: "Clock", price: 60, description: "Stops the timer temporarily." },
  { id: "pu-chemhint", category: "powerups", name: "Chemistry Hint", icon: "Lightbulb", price: 40, description: "Provides a clue toward the answer." },
  { id: "fr-gold", category: "frames", name: "Gold Ring Frame", icon: "Circle", price: 300 },
  { id: "fr-arcane", category: "frames", name: "Arcane Frame", icon: "Hexagon", price: 300 },
  { id: "fx-sparks", category: "effects", name: "Victory Sparks", icon: "Sparkles", price: 180 },
  { id: "fx-trail", category: "effects", name: "Molecule Trail", icon: "Orbit", price: 180 },
];

// Starter-owned items for a brand new player (mirrors playerStore.js's
// defaultState(): one owned+equipped item per relevant category).
const STARTER_OWNED_ITEM_IDS = ["av-atom", "skin-frost", "fr-arcane"];

// Section 25. Kept subject-agnostic in wording (no "Chemistry" baked in)
// since these defs are now shared across every subject - gameLogic.js
// evaluates "atomic-expert" and "chemistry-legend" generically against
// whichever subject's world template is currently in play (first world /
// every world / every boss), not against hardcoded Chemistry world ids.
const ACHIEVEMENT_DEFS = [
  { id: "first-quest", icon: "Trophy", name: "First Quest", description: "Complete your very first lesson." },
  { id: "streak-7", icon: "Flame", name: "7 Day Streak", description: "Log in and play for 7 days in a row." },
  { id: "atomic-expert", icon: "Atom", name: "First-World Expert", description: "Score 90%+ on every lesson in the first world of a subject." },
  { id: "lab-explorer", icon: "FlaskConical", name: "World Explorer", description: "Visit every world in a subject at least once." },
  { id: "boss-slayer", icon: "Swords", name: "Boss Slayer", description: "Defeat 3 chapter bosses." },
  { id: "50-stars", icon: "Star", name: "50 Stars", description: "Earn 50 stars total across all lessons." },
  { id: "perfect-score", icon: "Target", name: "Perfect Score", description: "Clear a level with 100% accuracy." },
  { id: "chemistry-legend", icon: "Crown", name: "Subject Legend", description: "Defeat every chapter boss across a full curriculum." },
];

const DAILY_QUEST_DEFS = [
  { id: "dq1", title: "Complete 1 Lesson", target: 1, xp: 200, coins: 100 },
  { id: "dq2", title: "Answer 10 Questions", target: 10, xp: 200, coins: 100 },
  { id: "dq3", title: "Earn 100 XP", target: 100, xp: 200, coins: 100 },
  { id: "dq4", title: "Defeat 1 Mini Boss", target: 1, xp: 200, coins: 100 },
];

const BOSS_REWARD = { xp: 500, coins: 250 };
const BOSS_DIFFICULTY_MIX = ["easy", "easy", "medium", "medium", "medium", "hard", "hard", "hard", "expert", "expert"];

module.exports = {
  SUBJECTS,
  DIFFICULTIES,
  CLASSES,
  BOARD_CATEGORIES,
  WORLD_TEMPLATE,
  LESSONS_BY_WORLD,
  LESSONS_BY_WORLD_BOARD_OVERRIDES,
  QUESTION_BANK,
  QUESTION_BANK_BOARD_OVERRIDES,
  SHOP_ITEMS,
  STARTER_OWNED_ITEM_IDS,
  ACHIEVEMENT_DEFS,
  DAILY_QUEST_DEFS,
  BOSS_REWARD,
  BOSS_DIFFICULTY_MIX,
};
