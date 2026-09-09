import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FlaskConical,
  Atom,
  Sigma,
  BookOpen,
  Dna,
  Monitor,
  Swords,
  Trophy,
  Flame,
  Compass,
  Users,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
  Target,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Gift,
  Medal,
  Timer,
  Layers,
  Rocket,
  Globe2,
  ScrollText,
  Feather,
  Brain,
  Calculator,
  Globe,
  Play,
  Check,
  Crown,
  BarChart3,
  Lightbulb,
  RocketIcon,
} from "lucide-react";

const ALL_SUBJECTS = [
  { code: "CHEM", name: "Chemistry", icon: FlaskConical, accent: "text-neon-cyan", bg: "bg-neon-cyan/10", border: "border-neon-cyan/30", gradient: "from-neon-cyan/20 to-arcane-purple/20", tagline: "Explore molecules, reactions & the building blocks of matter", worlds: ["Atom Valley", "Molecule Forest", "Reaction Peak", "Bonding Cave", "Periodic Tower", "Final Lab"] },
  { code: "PHYS", name: "Physics", icon: Atom, accent: "text-arcane-purple", bg: "bg-arcane-purple/10", border: "border-arcane-purple/30", gradient: "from-arcane-purple/20 to-neon-cyan/20", tagline: "Master forces, energy & the laws that govern the universe", worlds: ["Force Field", "Wave Station", "Light Lab", "Gravity Gate", "Quantum Core", "Big Bang Boss"] },
  { code: "MATH", name: "Mathematics", icon: Sigma, accent: "text-reward-gold", bg: "bg-reward-gold/10", border: "border-reward-gold/30", gradient: "from-reward-gold/20 to-neon-green/20", tagline: "Solve equations, conquer geometry & unlock mathematical thinking", worlds: ["Number Nexus", "Algebra Arena", "Geometry Grid", "Trig Tower", "Calculus Keep", "Final Proof"] },
  { code: "BIO", name: "Biology", icon: Dna, accent: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/30", gradient: "from-neon-green/20 to-neon-cyan/20", tagline: "Dive into cells, genetics & the science of life itself", worlds: ["Cell City", "Genetics Garden", "Evolution Edge", "Ecosystem Falls", "Nervous Net", "Life Summit"] },
  { code: "ENG", name: "English", icon: BookOpen, accent: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/30", gradient: "from-sky-400/20 to-neon-cyan/20", tagline: "Sharpen reading, writing & communication skills", worlds: ["Grammar Galaxy", "Vocabulary Vault", "Poetry Peak", "Comprehension Cave", "Writing Wall", "Final Essay"] },
  { code: "CS", name: "Computer Science", icon: Monitor, accent: "text-fuchsia-400", bg: "bg-fuchsia-400/10", border: "border-fuchsia-400/30", gradient: "from-fuchsia-400/20 to-arcane-purple/20", tagline: "Learn programming, algorithms & computational thinking", worlds: ["Logic Lane", "Code Canyon", "Data Den", "Network Node", "Algorithm Arch", "Final Build"] },
];

function SubjectIcon({ name, className = "h-5 w-5" }) {
  const s = ALL_SUBJECTS.find((x) => x.name === name) ?? ALL_SUBJECTS[0];
  return <s.icon className={`${className} ${s.accent}`} strokeWidth={1.8} />;
}

function SectionHeader({ eyebrow, title, copy }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-neon-cyan">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold text-ink-primary sm:text-4xl">{title}</h2>
      {copy && <p className="mt-4 text-base leading-relaxed text-ink-muted">{copy}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. HERO — Multi-subject rotating spotlight
// ---------------------------------------------------------------------------
function HeroSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = ALL_SUBJECTS[activeIdx];
  const Icon = active.icon;

  useEffect(() => {
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % ALL_SUBJECTS.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-arcane-purple/20 blur-[120px]" />
        <div className="absolute top-24 -left-24 h-72 w-72 rounded-full bg-neon-cyan/10 blur-[100px]" />
        <div className="absolute bottom-0 -right-24 h-80 w-80 rounded-full bg-neon-green/10 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.14) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-panel-line bg-panel/60 px-4 py-2">
            <Sparkles className="h-4 w-4 text-reward-gold" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">Quiz-powered RPG learning for every subject</span>
          </div>

          <h1 className="mt-8 font-display text-4xl font-black leading-[1.05] text-ink-primary sm:text-6xl lg:text-7xl">
            Every Subject.{" "}
            <span className="bg-gradient-to-r from-neon-cyan via-arcane-purple to-reward-gold bg-clip-text text-transparent">
              Every Chapter.
            </span>{" "}
            A Game.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            LearnQuest turns Chemistry, Physics, Mathematics, Biology, English & Computer Science into playable worlds.
            Battle bosses, earn XP, climb leaderboards — and ace your board exams.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/sign-up" className="group inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-7 py-3.5 font-display font-bold text-void transition-colors hover:bg-arcane-purple">
              Start Playing Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 rounded-xl border border-panel-line bg-panel/60 px-7 py-3.5 font-display font-semibold text-ink-muted transition-colors hover:border-neon-cyan/50 hover:text-ink-primary">
              <GraduationCap className="h-4 w-4" />
              Teacher / Admin Login
            </Link>
          </div>
        </div>

        {/* Subject selector pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {ALL_SUBJECTS.map((s, i) => (
            <button
              key={s.code}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 font-display text-sm font-semibold transition-all ${
                i === activeIdx
                  ? `${s.border} ${s.bg} ${s.accent} shadow-lg`
                  : "border-panel-line bg-panel/40 text-ink-muted hover:text-ink-primary"
              }`}
            >
              <s.icon className="h-4 w-4" strokeWidth={1.8} />
              {s.name}
            </button>
          ))}
        </div>

        {/* Active subject preview card */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div className={`rounded-3xl border border-panel-line bg-panel/80 p-6 shadow-2xl backdrop-blur transition-all duration-500`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${active.border} ${active.bg}`}>
                  <Icon className={`h-6 w-6 ${active.accent}`} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink-primary">{active.name}</h3>
                  <p className="text-sm text-ink-muted">{active.tagline}</p>
                </div>
              </div>
              <Link to="/sign-up" className={`hidden sm:inline-flex items-center gap-1.5 rounded-lg ${active.bg} ${active.border} border px-3 py-1.5 font-display text-xs font-semibold ${active.accent} transition-colors hover:opacity-80`}>
                <Play className="h-3.5 w-3.5" /> Play Now
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {active.worlds.slice(0, 3).map((w, i) => (
                <div key={w} className="rounded-xl border border-panel-line bg-void/40 p-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`flex h-5 w-5 items-center justify-center rounded ${active.bg} font-mono text-[10px] font-bold ${active.accent}`}>{i + 1}</span>
                    <span className="truncate font-display text-xs font-semibold text-ink-primary">{w}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-panel-line">
                    <div className={`h-full rounded-full ${active.bg.replace("/10", "/60")}`} style={{ width: `${80 - i * 20}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-panel-line bg-void/30 px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-ink-faint">
                <Swords className="h-3.5 w-3.5 text-reward-gold" />
                <span>Boss: {active.worlds[active.worlds.length - 1]}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-ink-faint">
                <span>6 Worlds</span>
                <span>40+ Levels</span>
                <span>200+ Questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4">
          {[
            { value: "6+", label: "Subjects" },
            { value: "40+", label: "Game Worlds" },
            { value: "100%", label: "Board Aligned" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-panel-line bg-panel/40 px-3 py-3 text-center">
              <p className="font-display text-xl font-bold text-ink-primary">{s.value}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-ink-faint">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2. STAT BAND
// ---------------------------------------------------------------------------
function StatsBand() {
  const stats = [
    { icon: Users, value: "25k+", label: "Students playing daily", accent: "text-neon-cyan" },
    { icon: GraduationCap, value: "3,000+", label: "Teachers on board", accent: "text-arcane-purple" },
    { icon: Trophy, value: "2.1M", label: "Bosses defeated", accent: "text-reward-gold" },
    { icon: Star, value: "9.2/10", label: "Student ratings", accent: "text-neon-green" },
  ];
  return (
    <section className="border-y border-panel-line bg-panel/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-10 lg:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-panel-line bg-void/40 ${s.accent}`}>
              <s.icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-display text-2xl font-black text-ink-primary">{s.value}</p>
              <p className="text-xs text-ink-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 3. ALL SUBJECTS GRID — full cards
// ---------------------------------------------------------------------------
function AllSubjectsGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <SectionHeader
        eyebrow="All Subjects"
        title="One app. Six subjects. Infinite adventures."
        copy="Pick any subject and dive into a world of quizzes, challenges and boss battles — all mapped to your board syllabus."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_SUBJECTS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.code} className={`group relative overflow-hidden rounded-2xl border border-panel-line bg-panel/50 p-6 transition-all hover:border-opacity-60 ${s.border}`}>
              <div className="flex items-center justify-between">
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${s.border} ${s.bg}`}>
                  <Icon className={`h-6 w-6 ${s.accent}`} strokeWidth={1.8} />
                </span>
                <span className="flex items-center gap-0.5 text-reward-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-reward-gold" />
                  ))}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-primary">{s.name}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{s.tagline}</p>
              <div className="mt-4 space-y-1.5">
                {s.worlds.slice(0, 3).map((w, i) => (
                  <div key={w} className="flex items-center gap-2 text-xs text-ink-muted">
                    <span className={`flex h-4 w-4 items-center justify-center rounded ${s.bg} font-mono text-[9px] font-bold ${s.accent}`}>{i + 1}</span>
                    <span>{w}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-panel-line pt-4 flex items-center justify-between">
                <span className="text-[10px] text-ink-faint">6 worlds · 40+ levels</span>
                <Link to="/sign-up" className={`font-display text-xs font-semibold ${s.accent} transition-colors hover:underline`}>
                  Start →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 4. QUIZ APP FEATURES
// ---------------------------------------------------------------------------
function QuizFeatures() {
  const features = [
    { icon: Swords, title: "Boss Battles", copy: "Every chapter ends with a boss that uses the hardest questions. Defeat it to unlock the next world.", accent: "text-arcane-purple" },
    { icon: Trophy, title: "Leaderboards", copy: "Class, school and subject-wide rankings. Compete with friends and climb to the top.", accent: "text-reward-gold" },
    { icon: Flame, title: "Streaks & XP", copy: "Daily logins and consecutive correct answers build streaks. XP feeds your level-up.", accent: "text-neon-green" },
    { icon: Compass, title: "Adaptive Quizzes", copy: "Questions scale to your ability — never too easy, never too hard. Stay in the flow.", accent: "text-neon-cyan" },
    { icon: BarChart3, title: "Teacher Reports", copy: "Live analytics per student, per subject. Export PDFs and Excel for parent meetings.", accent: "text-sky-400" },
    { icon: ShieldCheck, title: "School Console", copy: "Multi-school management, role controls, curriculum shaping and audit logs.", accent: "text-fuchsia-400" },
  ];
  return (
    <section className="border-y border-panel-line bg-void/40">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHeader eyebrow="Features" title="Not just another quiz app" copy="A full RPG engine built on top of board-aligned content — designed for classrooms, not just browsers." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-panel-line bg-panel/50 p-6 transition-colors hover:border-neon-cyan/40">
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-panel-line bg-void/40 ${f.accent}`}>
                <f.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-primary">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 5. HOW IT WORKS
// ---------------------------------------------------------------------------
function HowItWorks() {
  const steps = [
    { num: "01", icon: Users, title: "Pick your subject", copy: "Choose from Chemistry, Physics, Math, Biology, English or CS. The game adapts to your board and class." },
    { num: "02", icon: Compass, title: "Enter a world", copy: "Each chapter is a world. Answer questions as encounters — beat enemies to progress through the map." },
    { num: "03", icon: Swords, title: "Face the boss", copy: "Every unit caps with a boss battle using the hardest questions. Clear it to unlock the next world." },
    { num: "04", icon: Trophy, title: "Earn rewards", copy: "XP, coins, badges, streaks and leaderboard rankings. Teachers see everything in live dashboards." },
  ];
  return (
    <section className="border-y border-panel-line bg-panel/20">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHeader eyebrow="How it works" title="Four steps to exam-ready" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.num} className="relative rounded-2xl border border-panel-line bg-panel/50 p-6">
              <p className="font-mono text-xs font-bold text-neon-cyan">{s.num}</p>
              <span className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-panel-line bg-void/40 text-ink-primary">
                <s.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink-primary">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 6. QUIZ PREVIEW — interactive mock
// ---------------------------------------------------------------------------
function QuizPreview() {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const correct = 1;
  const options = ["540\u00b0", "720\u00b0", "900\u00b0", "1080\u00b0"];

  function handleSelect(i) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-neon-cyan">Try it yourself</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink-primary sm:text-4xl">
            A question is a <span className="text-neon-cyan">battle move</span>.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-muted">
            Students answer questions as encounters — answer fast and right to deal damage, protect the streak,
            and bank XP. Timing, accuracy and streaks all matter, keeping practice feeling like a game.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Board-aligned questions with real exam content",
              "Combo multiplier for consecutive correct answers",
              "Timer pressure that mimics exam conditions",
              "XP and coins earned for every correct answer",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-neon-green" strokeWidth={2} />
                <span className="text-sm text-ink-primary">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -m-6 rounded-[2rem] bg-arcane-purple/10 blur-2xl" aria-hidden="true" />
          <div className="relative rounded-3xl border border-panel-line bg-void/80 p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sigma className="h-5 w-5 text-reward-gold" />
                <div>
                  <p className="font-display text-sm font-bold text-ink-primary">Geometry Grid</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">Mathematics · Quiz</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-mono text-xs text-ink-muted">
                  <Timer className="h-3.5 w-3.5 text-neon-cyan" /> 08.4s
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-ink-muted">
                  <Flame className="h-3.5 w-3.5 text-reward-gold" /> x6
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-panel-line bg-panel/60 p-4">
              <p className="font-display text-sm font-semibold text-ink-primary">What is the sum of interior angles in a 6-sided polygon?</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {options.map((opt, i) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(i)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all ${
                      answered && i === correct
                        ? "border-neon-green bg-neon-green/10 text-neon-green"
                        : answered && i === selected
                          ? "border-red-400 bg-red-400/10 text-red-400"
                          : "border-panel-line bg-void/40 text-ink-muted hover:border-neon-cyan/50 hover:text-ink-primary"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-ink-faint">{String.fromCharCode(65 + i)}</span>
                    {opt}
                    {answered && i === correct && <Check className="ml-auto h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-panel-line bg-panel/60 p-4">
              <div className="flex items-center justify-between text-[10px] text-ink-faint">
                <span className="font-mono uppercase tracking-wider">Level 12</span>
                <span className="font-mono">3,140 / 4,000 XP</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-panel-line">
                <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-arcane-purple" style={{ width: "78%" }} />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-reward-gold" />
              <span className="text-[10px] text-ink-faint">+250 XP · +12 Coins · 3 Stars</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 7. ROLE PATHS
// ---------------------------------------------------------------------------
function RolesSection() {
  const roles = [
    { icon: Swords, title: "Students", copy: "Play the syllabus — level up, defeat bosses, keep streaks, top the leaderboard.", cta: "Create your player", to: "/sign-up", accent: "text-neon-cyan" },
    { icon: Monitor, title: "Teachers", copy: "Assign work, track progress, and watch subject-specific analytics per student in real time.", cta: "Open teacher portal", to: "/login", accent: "text-arcane-purple" },
    { icon: ShieldCheck, title: "Admins", copy: "Manage schools, roles and curriculum with a dedicated console and audit trail.", cta: "Open admin portal", to: "/login", accent: "text-reward-gold" },
  ];
  return (
    <section className="border-y border-panel-line bg-panel/20">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHeader eyebrow="Who it's for" title="One platform, every role" />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {roles.map((r) => (
            <div key={r.title} className="group flex flex-col rounded-2xl border border-panel-line bg-panel/50 p-6 transition-colors hover:border-neon-cyan/40">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border border-panel-line bg-void/40 ${r.accent}`}>
                <r.icon className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-ink-primary">{r.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{r.copy}</p>
              <Link to={r.to} className="mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-ink-primary transition-colors group-hover:!text-neon-cyan hover:!text-neon-cyan">
                {r.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 8. REWARDS
// ---------------------------------------------------------------------------
function RewardsSection() {
  const rewards = [
    { icon: Zap, title: "XP & Levels", copy: "Every correct answer feeds a level-up loop.", accent: "text-neon-cyan" },
    { icon: Gift, title: "Coins & Shop", copy: "Spend earned coins on avatars, themes and boosts.", accent: "text-reward-gold" },
    { icon: Medal, title: "Badges", copy: "Milestones for streaks, bosses and perfect runs.", accent: "text-arcane-purple" },
    { icon: Trophy, title: "Leaderboards", copy: "Class, school and subject-wide rank tables.", accent: "text-neon-green" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <SectionHeader eyebrow="Rewards" title="Progress you can see, spend and show off" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {rewards.map((r) => (
          <div key={r.title} className="rounded-2xl border border-panel-line bg-panel/50 p-6">
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-panel-line bg-void/40 ${r.accent}`}>
              <r.icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-ink-primary">{r.title}</h3>
            <p className="mt-1.5 text-sm text-ink-muted">{r.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 9. TESTIMONIALS
// ---------------------------------------------------------------------------
function Testimonials() {
  const quotes = [
    { quote: "My grade 9 class asked to stay 'one more level' at the end of a double period. I've never seen that in Chemistry before.", name: "Ms. Priya Rao", role: "Science teacher, CBSE" },
    { quote: "The boss battles quietly turned revision into a ritual. Their Physics unit scores prove it.", name: "Mr. Arjun Menon", role: "Math coordinator, ICSE" },
    { quote: "As a parent I get a real window into what my daughter is learning — and she asks for it. That says everything.", name: "Mrs. Lakshmi V.", role: "Parent of a grade 10 student" },
  ];
  return (
    <section className="border-y border-panel-line bg-void/40">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHeader eyebrow="Teachers & parents" title="What classrooms say" />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.name} className="flex flex-col rounded-2xl border border-panel-line bg-panel/50 p-6">
              <div className="flex gap-0.5 text-reward-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-reward-gold" />)}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-primary">"{q.quote}"</blockquote>
              <figcaption className="mt-5 border-t border-panel-line pt-4">
                <p className="font-display text-sm font-bold text-ink-primary">{q.name}</p>
                <p className="text-xs text-ink-muted">{q.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 10. FAQ + FINAL CTA
// ---------------------------------------------------------------------------
function FaqSection() {
  const faqs = [
    { q: "Which boards are supported?", a: "CBSE, ICSE, Tamil Nadu, Maharashtra, IB and IGCSE. Content is filtered per grade, board and subject combination." },
    { q: "How many subjects are available?", a: "Chemistry, Physics, Mathematics, Biology, English and Computer Science — all with full world maps, quizzes and boss battles." },
    { q: "Is it aligned to the real syllabus?", a: "Yes. Each world maps to a chapter, each question to a learning outcome. The game layer is on top of real, board-aligned content." },
    { q: "How do teachers track progress?", a: "Live per-student analytics, assignments, quiz results, streaks and exportable reports — all scoped to their subjects." },
    { q: "What does it cost?", a: "Sign up for free. School pricing is per active student and includes teacher and admin consoles." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 lg:px-8">
      <SectionHeader eyebrow="Questions" title="Before your first login" />
      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => (
          <div key={f.q} className="overflow-hidden rounded-2xl border border-panel-line bg-void/40">
            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
              <span className="font-display text-sm font-bold text-ink-primary">{f.q}</span>
              <ChevronDown className={`h-4 w-4 flex-none text-ink-faint transition-transform ${open === i ? "rotate-180 text-neon-cyan" : ""}`} />
            </button>
            {open === i && <p className="border-t border-panel-line px-5 py-4 text-sm leading-relaxed text-ink-muted">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-panel-line">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-72 w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-arcane-purple/25 blur-[110px]" />
      </div>
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-reward-gold/30 bg-reward-gold/10 px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-reward-gold" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-reward-gold">Your first boss is waiting</span>
        </div>
        <h2 className="mt-6 font-display text-4xl font-black text-ink-primary sm:text-5xl">
          Start playing. Start learning.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-muted">
          Create a free account in under two minutes. Pick your subject, enter your first world, and let the game teach.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/sign-up" className="group inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-7 py-3 font-display font-bold text-void transition-colors hover:bg-arcane-purple">
            Get started free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/login" className="inline-flex items-center gap-2 rounded-xl border border-panel-line bg-panel/60 px-7 py-3 font-display font-semibold text-ink-muted transition-colors hover:text-ink-primary">
            Teacher or admin? Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MAIN EXPORT
// ---------------------------------------------------------------------------
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsBand />
      <AllSubjectsGrid />
      <QuizFeatures />
      <HowItWorks />
      <QuizPreview />
      <RolesSection />
      <RewardsSection />
      <Testimonials />
      <FaqSection />
      <FinalCta />
    </>
  );
}
