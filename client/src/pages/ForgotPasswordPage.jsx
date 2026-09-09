import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, ChevronLeft, MailCheck, Loader2 } from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  // No auth backend yet (Section 4's Sign In has the same caveat), so this
  // is a mock reset request: validate there's something that looks like an
  // email, show a brief loading state, then flip to a confirmation panel.
  // Deliberately doesn't reveal whether the address actually has an
  // account â€” same "if an account matches" phrasing the sign-in page's inline
  // version used, just as its own screen now that the route exists. Wire
  // to a real `POST /api/auth/forgot-password` (or similar) endpoint when
  // the backend is ready; keep this generic-response behavior since it's
  // standard practice against account enumeration.
  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Enter the email address on your account.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
    }, 600);
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
            "radial-gradient(circle at 15% 20%, rgba(128,107,255,0.25), transparent 45%), radial-gradient(circle at 85% 80%, rgba(34,229,255,0.18), transparent 45%)",
        }}
      />

      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <GraduationCap className="h-7 w-7 text-neon-cyan" strokeWidth={2.2} />
          <span className="font-wordmark text-xl tracking-wide text-ink-primary">
            LEARN<span className="text-neon-cyan">QUEST</span>
          </span>
        </Link>

        <div
          className="hud-frame scanlines relative rounded-2xl border border-panel-line bg-panel/70 p-8 shadow-glow-purple backdrop-blur-sm sm:p-10"
          style={{ "--hud-color": "#806BFF" }}
        >
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-neon-green/40 bg-neon-green/10 shadow-glow-green">
                <MailCheck className="h-7 w-7 text-neon-green" strokeWidth={2} />
              </div>
              <h1 className="mt-5 font-display text-2xl font-bold uppercase tracking-wide text-ink-primary">
                Check Your Inbox
              </h1>
              <p className="mt-2 font-body text-sm text-ink-muted">
                If an account matches <span className="text-ink-primary">{email}</span>, a reset
                link is on its way. It can take a few minutes to arrive.
              </p>
              <Link
                to="/login"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-arcane-purple py-3.5 font-display text-base font-bold uppercase tracking-wider text-white shadow-glow-purple transition-transform hover:scale-[1.02]"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
                Back to Sign In
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                className="mt-4 font-body text-xs text-ink-faint hover:text-neon-cyan hover:underline"
              >
                Didn't get it? Try another address
              </button>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink-primary sm:text-[2rem]">
                  Reset Your <span className="text-neon-green">Password</span>
                </h1>
                <p className="mt-2 font-body text-sm text-ink-muted">
                  We'll send a recovery link to get you back into the adventure.
                </p>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ash.ketchum@learnquest.gg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-panel-line bg-void/60 px-4 py-3 font-body text-sm text-ink-primary placeholder:text-ink-faint focus:border-neon-cyan focus:outline-none"
                  />
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
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              <p className="mt-8 flex items-center justify-center gap-1.5 text-center font-body text-sm text-ink-muted">
                <Link
                  to="/login"
                  className="flex items-center gap-1 font-semibold text-neon-cyan hover:underline"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
