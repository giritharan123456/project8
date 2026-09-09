import { Link } from "react-router-dom";
import { GraduationCap, Users, ShieldCheck, ChevronRight } from "lucide-react";

const ROLES = [
  {
    id: "student",
    icon: GraduationCap,
    name: "Students",
    blurb: "Play through subject worlds, battle bosses, earn XP and climb the leaderboard.",
    cta: "/subjects",
    ctaLabel: "Pick a Subject",
    accent: "#4ADE80",
  },
  {
    id: "teacher",
    icon: Users,
    name: "Teachers",
    blurb: "Track your students, review quiz results, manage courses and export reports.",
    cta: "/sign-up?role=teacher",
    ctaLabel: "Register as Teacher",
    accent: "#38D9F4",
  },
  {
    id: "admin",
    icon: ShieldCheck,
    name: "Admins",
    blurb: "Run the whole LearnQuest school — subjects, boards, classes, users and content.",
    cta: "/admin",
    ctaLabel: "Open Admin Console",
    accent: "#806BFF",
  },
];

export default function RolePaths() {
  return (
    <section id="roles" className="relative bg-void px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-arcane-purple">
            One platform
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink-primary sm:text-5xl">
            Built for <span className="text-neon-cyan">Every Role</span>
          </h2>
          <p className="mt-4 font-body text-ink-muted">
            Students play. Teachers guide. Admins run the school. LearnQuest
            gives each role its own focused console — on the same data.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="hud-frame group flex flex-col rounded-xl border border-panel-line bg-panel/60 p-7 transition-all duration-300 hover:-translate-y-1"
                style={{ "--hud-color": role.accent }}
              >
                <div
                  className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl border"
                  style={{ borderColor: `${role.accent}55`, background: `${role.accent}14` }}
                >
                  <Icon className="h-7 w-7" style={{ color: role.accent }} strokeWidth={1.9} />
                </div>
                <h3 className="font-display text-xl font-bold text-ink-primary">{role.name}</h3>
                <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-ink-muted">{role.blurb}</p>
                <Link
                  to={role.cta}
                  className="mt-6 inline-flex items-center justify-start gap-1.5 rounded-xl border px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-wider transition-colors"
                  style={{ borderColor: `${role.accent}88`, color: role.accent }}
                >
                  {role.ctaLabel}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}