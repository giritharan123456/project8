import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, Chrome, Facebook, Apple, Swords, Loader2 } from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { ApiError } from "../api/client.js";

// Where each role lands after sign-in. A `from` location (set by
// ProtectedRoute when it redirects an unauthenticated visit) wins over
// this for ADMIN/TEACHER, so e.g. hitting /admin/students while signed
// out and then signing in as an admin returns you to /admin/students
// instead of just /admin.
function destinationFor(role) {
  if (role === "ADMIN") return "/admin";
  if (role === "TEACHER") return "/teacher";
  return "/dashboard";
}

function SocialButton({ icon: Icon, label, onClick, busy }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-panel-line bg-panel/60 px-4 py-3 font-display text-sm font-semibold text-ink-primary backdrop-blur transition-colors hover:border-neon-cyan/60 hover:text-neon-cyan disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon className="h-4 w-4" strokeWidth={1.8} />
      {label}
    </button>
  );
}

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real sign-in: POST /api/auth/login, then route by the account's role
  // (ADMIN -> /admin, TEACHER -> /teacher, STUDENT -> /dashboard or wherever
  // ProtectedRoute bounced them from). DashboardPage already defaults to
  // Class 9 / CBSE when no ?class=&board= is present, so a returning
  // student without a stored curriculum still lands somewhere sensible.
  async function handleSubmit(e) {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Enter your email/username and password to continue.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const user = await login(identifier.trim(), password);
      const from = location.state?.from;
      navigate(from && (user.role === "ADMIN" || user.role === "TEACHER") ? from : destinationFor(user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  // The social buttons are presentational only (no OAuth wired up) -
  // separate from the real email/password path above, so they intentionally
  // don't set a role-bearing session.
  function handleSocialSignIn() {
    setError("Social sign-in isn't available yet - please use email and password.");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-6 py-16">
      {/* ambient lab / molecule background, matches hero language */}
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={34} />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(128,107,255,0.25), transparent 45%), radial-gradient(circle at 85% 80%, rgba(34,229,255,0.18), transparent 45%)",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* wordmark */}
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <GraduationCap className="h-7 w-7 text-neon-cyan" strokeWidth={2.2} />
          <span className="font-wordmark text-xl tracking-wide text-ink-primary">
            LEARN<span className="text-neon-cyan">QUEST</span>
          </span>
        </Link>

        {/* glowing gaming card */}
        <div
          className="hud-frame scanlines relative rounded-2xl border border-panel-line bg-panel/70 p-8 shadow-glow-purple backdrop-blur-sm sm:p-10"
          style={{ "--hud-color": "#806BFF" }}
        >
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink-primary sm:text-[2rem]">
              Welcome Back, <span className="text-neon-green">Chemist!</span>
            </h1>
            <p className="mt-2 font-body text-sm text-ink-muted">
              Continue your Learning Adventure.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="identifier"
                className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint"
              >
                Email / Username
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder="ash.ketchum@learnquest.gg"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full rounded-xl border border-panel-line bg-void/60 px-4 py-3 font-body text-sm text-ink-primary placeholder:text-ink-faint focus:border-neon-cyan focus:outline-none"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="font-mono text-[11px] uppercase tracking-widest text-ink-faint"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="font-body text-xs text-neon-cyan hover:underline"
                >
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
                  className="w-full rounded-xl border border-panel-line bg-void/60 px-4 py-3 pr-11 font-body text-sm text-ink-primary placeholder:text-ink-faint focus:border-neon-cyan focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-neon-cyan"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 font-body text-xs text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-arcane-purple py-3.5 font-display text-base font-bold uppercase tracking-wider text-white shadow-glow-purple transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Swords className="h-5 w-5 transition-transform group-hover:-rotate-12" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-panel-line" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-panel-line" />
          </div>

          <div className="space-y-3">
            <SocialButton icon={Chrome} label="Continue with Google" onClick={handleSocialSignIn} busy={isSubmitting} />
            <SocialButton icon={Facebook} label="Continue with Facebook" onClick={handleSocialSignIn} busy={isSubmitting} />
            <SocialButton icon={Apple} label="Continue with Apple" onClick={handleSocialSignIn} busy={isSubmitting} />
          </div>

          <p className="mt-8 text-center font-body text-sm text-ink-muted">
            New to LearnQuest?{" "}
            <Link
              to="/sign-up"
              className="font-semibold text-neon-cyan hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
