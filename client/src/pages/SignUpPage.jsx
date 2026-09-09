import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, Swords, Check, X as XIcon, Loader2, Users } from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { ApiError } from "../api/client.js";
import { CLASSES, BOARD_CATEGORIES } from "../data/content.js";
import { SUBJECT_OPTIONS } from "../data/subjects.js";
import { getSelectedSubject, clearSelectedSubject } from "../store/selectedSubject.js";

// Lightweight, non-blocking password strength read-out. Signup is the one
// moment a strength hint earns its keep â€” sign-in never needs this.
function passwordChecks(pw) {
  return [
    { label: "8+ characters", pass: pw.length >= 8 },
    { label: "A number", pass: /\d/.test(pw) },
    { label: "Upper & lowercase", pass: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
  ];
}

// Role selection, handled securely: this is a plain two-way toggle
// between STUDENT and TEACHER only. There is deliberately no ADMIN
// option here, and no hidden way to reach one - POST /api/auth/signup
// re-checks the role server-side against the same allowlist regardless
// of what this form sends (see server/src/routes/auth.js). Admin accounts
// are created out-of-band (server/src/scripts/createAdmin.js) or by an
// existing admin promoting an account, never through this page.
const ROLE_OPTIONS = [
  { value: "STUDENT", label: "Student", icon: GraduationCap },
  { value: "TEACHER", label: "Teacher", icon: Users },
];

const FIELD_LABEL = "mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint";
const FIELD_INPUT =
  "w-full rounded-xl border border-panel-line bg-void/60 px-4 py-3 font-body text-sm text-ink-primary placeholder:text-ink-faint focus:border-neon-green focus:outline-none";

// Where each role lands right after registering. Board/Class are already
// collected on this form (unlike the old student-only flow), so there's
// no need to route through /select-class or /select-board afterwards.
// Students land on their chosen class+board so content pages don't fall
// back to the CBSE Class 9 default.
function destinationFor(user) {
  if (user.role === "TEACHER") return "/teacher";
  return `/dashboard?class=${user.grade ?? "9"}&board=${user.board ?? "CBSE"}`;
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [role, setRole] = useState("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [board, setBoard] = useState("");
  const [grade, setGrade] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTeacher = role === "TEACHER";
  const checks = passwordChecks(password);
  const allChecksPass = checks.every((c) => c.pass);
  const confirmMismatch = touched && confirm.length > 0 && confirm !== password;
  const formValid =
    name.trim() &&
    email.trim() &&
    schoolName.trim() &&
    board &&
    grade &&
    (!isTeacher || subjects.length > 0) &&
    allChecksPass &&
    !confirmMismatch;

  function toggleSubject(subject) {
    setSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!formValid) return;
    setError("");
    setIsSubmitting(true);
    try {
      const user = await signup(name.trim(), email.trim(), password, {
        confirmPassword: confirm,
        role,
        schoolName: schoolName.trim(),
        board,
        grade,
        subjects,
      });
      // Subject flow: a subject picked on /subjects before signing up wins,
      // so the new student lands straight on that subject's world map (using
      // the board/class just collected on this form). Consumed on redirect.
      const pendingSubject = getSelectedSubject();
      if (pendingSubject) {
        clearSelectedSubject();
        navigate(
          `/world?class=${grade || "9"}&board=${board || "CBSE"}&subject=${encodeURIComponent(pendingSubject)}`
        );
        return;
      }
      navigate(destinationFor(user));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-6 py-16">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={34} />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(74,222,128,0.18), transparent 45%), radial-gradient(circle at 85% 80%, rgba(34,229,255,0.18), transparent 45%)",
        }}
      />

      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <GraduationCap className="h-7 w-7 text-neon-cyan" strokeWidth={2.2} />
          <span className="font-wordmark text-xl tracking-wide text-ink-primary">
            Learn<span className="text-neon-cyan">Quest</span>
          </span>
        </Link>

        <div
          className="hud-frame scanlines relative rounded-2xl border border-panel-line bg-panel/70 p-8 shadow-glow-green backdrop-blur-sm sm:p-10"
          style={{ "--hud-color": "#4ADE80" }}
        >
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink-primary sm:text-[1.9rem]">
              Create Your <span className="text-neon-green">Learner Profile</span>
            </h1>
            <p className="mt-2 font-body text-sm text-ink-muted">
              Your adventure starts the moment you sign up.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {/* Role toggle - STUDENT / TEACHER only, see ROLE_OPTIONS above. */}
            <div>
              <span className={FIELD_LABEL}>I am a</span>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Account type">
                {ROLE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = role === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setRole(opt.value)}
                      className={`flex items-center justify-center gap-2 rounded-xl border py-3 font-display text-sm font-semibold uppercase tracking-wide transition-colors ${
                        active
                          ? "border-neon-green bg-neon-green/10 text-neon-green"
                          : "border-panel-line bg-void/60 text-ink-muted hover:border-panel-line/80 hover:text-ink-primary"
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="name" className={FIELD_LABEL}>
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Ash Ketchum"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={FIELD_INPUT}
              />
            </div>

            <div>
              <label htmlFor="email" className={FIELD_LABEL}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="ash.ketchum@learnquest.gg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={FIELD_INPUT}
              />
            </div>

            <div>
              <label htmlFor="schoolName" className={FIELD_LABEL}>
                School Name
              </label>
              <input
                id="schoolName"
                type="text"
                required
                autoComplete="organization"
                placeholder="Pallet Town High School"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className={FIELD_INPUT}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="board" className={FIELD_LABEL}>
                  Board
                </label>
                <select
                  id="board"
                  required
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className={`${FIELD_INPUT} appearance-none`}
                >
                  <option value="" disabled>
                    Select board
                  </option>
                  {BOARD_CATEGORIES.map((cat) => (
                    <optgroup key={cat.category} label={cat.category}>
                      {cat.boards.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="grade" className={FIELD_LABEL}>
                  {isTeacher ? "Teaching Class" : "Class / Standard"}
                </label>
                <select
                  id="grade"
                  required
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className={`${FIELD_INPUT} appearance-none`}
                >
                  <option value="" disabled>
                    Select class
                  </option>
                  {CLASSES.map((c) => (
                    <option key={c.grade} value={c.grade}>
                      Class {c.grade}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isTeacher && (
              <div>
                <span className={FIELD_LABEL}>Teaching Subjects</span>
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_OPTIONS.map((subject) => {
                    const active = subjects.includes(subject);
                    return (
                      <button
                        key={subject}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleSubject(subject)}
                        className={`rounded-full border px-3.5 py-1.5 font-body text-xs font-medium transition-colors ${
                          active
                            ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                            : "border-panel-line bg-void/60 text-ink-muted hover:border-panel-line/80 hover:text-ink-primary"
                        }`}
                      >
                        {subject}
                      </button>
                    );
                  })}
                </div>
                {touched && subjects.length === 0 && (
                  <p className="mt-1.5 font-body text-xs text-red-400">Select at least one subject.</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="password" className={FIELD_LABEL}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(true)}
                  className={`${FIELD_INPUT} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-neon-green"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>

              {password.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {checks.map((c) => (
                    <li
                      key={c.label}
                      className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide ${
                        c.pass ? "text-neon-green" : "text-ink-faint"
                      }`}
                    >
                      {c.pass ? (
                        <Check className="h-3 w-3" strokeWidth={3} />
                      ) : (
                        <XIcon className="h-3 w-3" strokeWidth={3} />
                      )}
                      {c.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label htmlFor="confirm" className={FIELD_LABEL}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onBlur={() => setTouched(true)}
                  className={`w-full rounded-xl border bg-void/60 px-4 py-3 pr-11 font-body text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none ${
                    confirmMismatch
                      ? "border-red-500/70 focus:border-red-500"
                      : "border-panel-line focus:border-neon-green"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-neon-green"
                >
                  {showConfirm ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {confirmMismatch && (
                <p className="mt-1.5 font-body text-xs text-red-400">Passwords don't match.</p>
              )}
            </div>

            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 font-body text-xs text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-neon-green/90 py-3.5 font-display text-base font-bold uppercase tracking-wider text-void shadow-glow-green transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Swords className="h-5 w-5 transition-transform group-hover:-rotate-12" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center font-body text-sm text-ink-muted">
            Already a Learner?{" "}
            <Link to="/login" className="font-semibold text-neon-cyan hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
