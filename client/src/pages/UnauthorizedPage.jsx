import { Link } from "react-router-dom";
import { ShieldAlert, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import ParticleField from "../components/ParticleField.jsx";

// Shown when a signed-in account tries to reach a route their role doesn't
// allow (e.g. a STUDENT or TEACHER hitting /admin) - see
// ProtectedRoute.jsx. Distinct from /sign-in, which is for the
// not-signed-in-at-all case.
export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-6 py-16">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={24} />

      <div className="relative w-full max-w-md text-center">
        <Link to="/" className="mb-8 inline-flex items-center justify-center gap-2">
          <GraduationCap className="h-7 w-7 text-neon-cyan" strokeWidth={2.2} />
          <span className="font-wordmark text-xl tracking-wide text-ink-primary">
            LEARN<span className="text-neon-cyan">QUEST</span>
          </span>
        </Link>

        <div className="hud-frame scanlines rounded-2xl border border-panel-line bg-panel/70 p-10 backdrop-blur-sm">
          <ShieldAlert className="mx-auto h-12 w-12 text-red-400" strokeWidth={1.8} />
          <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-ink-primary">
            Access Denied
          </h1>
          <p className="mt-2 font-body text-sm text-ink-muted">
            {user
              ? `Your account (${user.role.toLowerCase()}) doesn't have permission to view this page.`
              : "You don't have permission to view this page."}
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-arcane-purple px-5 py-2.5 font-display text-sm font-semibold text-white shadow-glow-purple transition-transform hover:scale-[1.02]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
