import { useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  GraduationCap,
  ClipboardCheck,
  ShieldCheck,
  Swords,
  Trophy,
  BarChart3,
  Users,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getSelectedSubject, clearSelectedSubject } from "../store/selectedSubject.js";
import { ApiError } from "../api/client.js";

// Role-tabbed sign-in: same /api/auth/login call as before (there's
// no separate "log in as X" endpoint - the account's real role always
// comes back from the server and ProtectedRoute enforces it regardless of
// which tab was selected here). The tabs exist for wayfinding - three very
// different audiences share one login screen, so let each recognize their
// destination before they even type - not for granting access.
const ROLE_ORDER = ["STUDENT", "TEACHER", "ADMIN"];

const ROLES = {
  STUDENT: {
    tab: "Student",
    tabIcon: GraduationCap,
    title: "Student Portal",
    subtitle: "Sign in to continue your Learning Adventure.",
    cta: "Sign In as Student",
    panelIcon: Swords,
    panelHeadline: "Your Next Battle Awaits",
    panelBody: "Track your XP, unlock new worlds, and climb the leaderboard.",
    perks: [
      { icon: Trophy, text: "Leaderboards across every world" },
      { icon: GraduationCap, text: "Boss battles that test what you've learned" },
    ],
    accentText: "text-neon-green",
    accentBorder: "border-neon-green",
    accentBg: "bg-neon-green",
    accentSoftBg: "bg-neon-green/10",
    buttonText: "text-void",
    glow: "shadow-glow-green",
    focusRing: "focus:border-neon-green",
    hud: "#4ADE80",
  },
  TEACHER: {
    tab: "Teacher",
    tabIcon: ClipboardCheck,
    title: "Teacher Portal",
    subtitle: "Sign in to manage your classes and track progress.",
    cta: "Sign In as Teacher",
    panelIcon: BarChart3,
    panelHeadline: "See Every Class at a Glance",
    panelBody: "Assign lessons, grade quizzes, and spot who needs a nudge.",
    perks: [
      { icon: Users, text: "Roster and progress for every class" },
      { icon: ClipboardCheck, text: "Auto-graded quizzes, ready to review" },
    ],
    accentText: "text-neon-cyan",
    accentBorder: "border-neon-cyan",
    accentBg: "bg-neon-cyan",
    accentSoftBg: "bg-neon-cyan/10",
    buttonText: "text-void",
    glow: "shadow-glow-cyan",
    focusRing: "focus:border-neon-cyan",
    hud: "#38D9F4",
  },
  ADMIN: {
    tab: "Admin",
    tabIcon: ShieldCheck,
    title: "Admin Portal",
    subtitle: "Sign in to manage the platform.",
    cta: "Sign In as Admin",
    panelIcon: ShieldCheck,
    panelHeadline: "Command the Platform",
    panelBody: "Manage schools, curriculum, and every account from one console.",
    perks: [
      { icon: Users, text: "Schools, teachers, and students in one place" },
      { icon: BarChart3, text: "Platform-wide analytics and reports" },
    ],
    accentText: "text-arcane-purple",
    accentBorder: "border-arcane-purple",
    accentBg: "bg-arcane-purple",
    accentSoftBg: "bg-arcane-purple/10",
    buttonText: "text-white",
    glow: "shadow-glow-purple",
    focusRing: "focus:border-arcane-purple",
    hud: "#806BFF",
  },
};

function roleFromParam(param) {
  const key = (param || "").toUpperCase();
  return ROLE_ORDER.includes(key) ? key : "STUDENT";
}

function destinationFor(user) {
  if (user.role === "ADMIN") return "/admin";
  if (user.role === "TEACHER") return "/teacher";
  // Students land on their own curriculum (saved at signup / admin edit),
  // not a hardcoded CBSE Class 9 - otherwise every content page defaults
  // to CBSE and the chosen class/board is silently lost on login.
  return `/dashboard?class=${user.grade ?? PENDING_SUBJECT_GRADE}&board=${user.board ?? PENDING_SUBJECT_BOARD}`;
}

// A pending subject picked on the public /subjects screen is routed straight
// to that subject's world map after a successful sign-in (the world map is
// sign-in gated, so auth is never bypassed â€” this just picks the landing
// page). Defaults match server/src/lib/gameLogic.js DEFAULT_GRADE/DEFAULT_BOARD.
const PENDING_SUBJECT_GRADE = "9";
const PENDING_SUBJECT_BOARD = "CBSE";

const REMEMBER_KEY = "chemquest_remembered_identifier";

export default function PortalLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [roleKey, setRoleKey] = useState(() => roleFromParam(searchParams.get("role")));
  const role = ROLES[roleKey];

  const [method, setMethod] = useState("email"); // "email" | "phone" - both submit as the same identifier
  const [identifier, setIdentifier] = useState(() => localStorage.getItem(REMEMBER_KEY) || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(() => !!localStorage.getItem(REMEMBER_KEY));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function selectRole(key) {
    setRoleKey(key);
    setError("");
    setSearchParams(key === "STUDENT" ? {} : { role: key.toLowerCase() }, { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError(`Enter your ${method === "phone" ? "phone number" : "email"} and password to continue.`);
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const user = await login(identifier.trim(), password);
      if (remember) localStorage.setItem(REMEMBER_KEY, identifier.trim());
      else localStorage.removeItem(REMEMBER_KEY);
      const from = location.state?.from;
      // Subject flow: a subject picked on /subjects before signing in wins,
      // so the user lands on that subject's world map instead of the default
      // dashboard. The selection is consumed on redirect (forget once used).
      const pendingSubject = getSelectedSubject();
      if (pendingSubject) {
        clearSelectedSubject();
        navigate(
          `/world?class=${PENDING_SUBJECT_GRADE}&board=${PENDING_SUBJECT_BOARD}&subject=${encodeURIComponent(pendingSubject)}`
        );
        return;
      }
      navigate(from && (user.role === "ADMIN" || user.role === "TEACHER") ? from : destinationFor(user));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  const PanelIcon = role.panelIcon;

  return (
    <div className="relative flex min-h-screen flex-col bg-void lg:flex-row">
      {/* form column */}
      <div className="relative flex w-full flex-col justify-center overflow-hidden px-6 py-12 sm:px-10 lg:w-[54%] lg:px-16 xl:px-20">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <ParticleField density={22} />

        <div className="relative mx-auto w-full max-w-md">
          <Link to="/" className="mb-10 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-neon-cyan" strokeWidth={2.2} />
            <span className="font-wordmark text-lg tracking-wide text-ink-primary">
              Learn<span className="text-neon-cyan">Quest</span>
            </span>
          </Link>

          {/* role tabs */}
          <div className="mb-8 grid grid-cols-3 gap-2 rounded-xl border border-panel-line bg-panel/60 p-1.5 backdrop-blur">
            {ROLE_ORDER.map((key) => {
              const r = ROLES[key];
              const Icon = r.tabIcon;
              const active = key === roleKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectRole(key)}
                  aria-pressed={active}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 font-display text-sm font-semibold transition-colors ${
                    active
                      ? `${r.accentSoftBg} ${r.accentText} ${r.accentBorder}`
                      : "border-transparent text-ink-faint hover:text-ink-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  {r.tab}
                </button>
              );
            })}
          </div>

          <h1 className="font-display text-3xl font-bold text-ink-primary">{role.title}</h1>
          <p className="mt-1.5 font-body text-sm text-ink-muted">{role.subtitle}</p>

          {/* email / phone toggle */}
          <div className="mt-7 grid grid-cols-2 gap-2 rounded-lg border border-panel-line bg-panel/40 p-1">
            <button
              type="button"
              onClick={() => setMethod("email")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 font-display text-sm font-semibold transition-colors ${
                method === "email" ? "bg-panel text-ink-primary" : "text-ink-faint hover:text-ink-muted"
              }`}
            >
              <Mail className="h-4 w-4" /> Email
            </button>
            <button
              type="button"
              onClick={() => setMethod("phone")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 font-display text-sm font-semibold transition-colors ${
                method === "phone" ? "bg-panel text-ink-primary" : "text-ink-faint hover:text-ink-muted"
              }`}
            >
              <Phone className="h-4 w-4" /> Phone
            </button>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="identifier"
                className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint"
              >
                {method === "phone" ? "Phone Number" : "Email Address"}
              </label>
              <input
                id="identifier"
                type={method === "phone" ? "tel" : "text"}
                autoComplete={method === "phone" ? "tel" : "username"}
                placeholder={method === "phone" ? "+91 98765 43210" : "you@example.com"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={`w-full rounded-xl border border-panel-line bg-void/60 px-4 py-3 font-body text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none ${role.focusRing}`}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                  Password
                </label>
                <Link to="/forgot-password" className={`font-body text-xs hover:underline ${role.accentText}`}>
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-xl border border-panel-line bg-void/60 px-4 py-3 pr-11 font-body text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none ${role.focusRing}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink-primary"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 font-body text-sm text-ink-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-panel-line accent-arcane-purple"
              />
              Remember me
            </label>

            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 font-body text-xs text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`group flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-display text-base font-bold uppercase tracking-wider transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 ${role.accentBg} ${role.buttonText} ${role.glow}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  {role.cta}
                  <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center font-body text-sm text-ink-muted">
            New to LearnQuest?{" "}
            <Link to="/sign-up" className="font-semibold text-neon-cyan hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* branded panel - recolors and re-copies itself per selected role */}
      <div className="relative hidden overflow-hidden bg-void-soft lg:flex lg:w-[46%] lg:flex-col lg:items-center lg:justify-center lg:px-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-70 transition-[background] duration-500"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${role.hud}33, transparent 55%), radial-gradient(circle at 80% 85%, ${role.hud}22, transparent 50%)`,
          }}
        />
        <ParticleField density={16} />

        <div className="relative w-full max-w-sm text-center">
          <div
            key={roleKey}
            className={`hud-frame mx-auto flex h-28 w-28 animate-pop-in items-center justify-center rounded-2xl border ${role.accentBorder} ${role.accentSoftBg}`}
            style={{ "--hud-color": role.hud }}
          >
            <PanelIcon className={`h-12 w-12 ${role.accentText}`} strokeWidth={1.8} />
          </div>

          <h2 className="mt-8 font-display text-2xl font-bold text-ink-primary">{role.panelHeadline}</h2>
          <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">{role.panelBody}</p>

          <ul className="mt-8 space-y-3 text-left">
            {role.perks.map((perk) => {
              const PerkIcon = perk.icon;
              return (
                <li
                  key={perk.text}
                  className="flex items-center gap-3 rounded-lg border border-panel-line bg-panel/40 px-4 py-3"
                >
                  <PerkIcon className={`h-4.5 w-4.5 flex-none ${role.accentText}`} strokeWidth={2} />
                  <span className="font-body text-sm text-ink-muted">{perk.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
