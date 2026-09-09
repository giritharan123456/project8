import { useEffect, useState } from "react";
import { Save, Check, Mail, BookMarked, Layers, Landmark } from "lucide-react";
import { useTeacherData } from "../TeacherContext.jsx";
import * as profileApi from "../../api/profile.js";

export default function ProfilePage() {
  const { currentTeacher, data } = useTeacherData();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    profileApi
      .getProfile()
      .then((res) => {
        if (cancelled) return;
        setProfile(res);
        setName(res.name ?? "");
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2200);
    return () => clearTimeout(t);
  }, [saved]);

  async function handleSave(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await profileApi.updateProfile({ name });
      setProfile((prev) => ({ ...prev, ...res }));
      setSaved(true);
    } catch (err) {
      setError(err.message ?? "Couldn't save changes.");
    }
  }

  if (loading) return <p className="text-sm text-ink-faint">Loading your profile…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">Profile</h2>
        <p className="mt-1 text-sm text-ink-muted">Your account details and school.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSave} className="space-y-4 rounded-2xl border border-panel-line bg-panel/60 p-5 lg:col-span-2">
          <h3 className="font-display text-base font-bold text-ink-primary">Account Details</h3>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <input
                type="email"
                value={profile?.email ?? ""}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-panel-line bg-void/60 py-2 pl-9 pr-3 text-sm text-ink-faint outline-none"
              />
            </div>
            <span className="mt-1 block text-xs text-ink-faint">Email is your sign-in credential and can't be changed here.</span>
          </label>
          {error && <p className="text-xs text-red-300">{error}</p>}
          <div className="flex items-center gap-3 border-t border-panel-line pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-arcane-purple px-4 py-2.5 font-display text-sm font-semibold text-white shadow-glow-purple transition-colors hover:bg-arcane-violet"
            >
              <Save className="h-4 w-4" strokeWidth={2} />
              Save Changes
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 font-mono text-xs text-neon-green">
                <Check className="h-4 w-4" /> Saved
              </span>
            )}
          </div>
        </form>

        <div className="space-y-4 rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">Status</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-muted">Role</span>
            <span className="font-mono text-xs text-ink-primary">{currentTeacher?.role}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-muted">Teaching Class</span>
            <span className="font-mono text-xs text-ink-primary">{profile?.grade ?? "\u2014"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-muted">Board</span>
            <span className="font-mono text-xs text-ink-primary">{profile?.board ?? "\u2014"}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
        <h3 className="font-display text-base font-bold text-ink-primary">Your School &amp; Subjects</h3>
        <p className="mt-1 text-xs text-ink-muted">Collected at registration - contact an admin to change your school.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <AssignmentBlock icon={Landmark} label="School" items={data.school ? [data.school.name] : []} />
          <AssignmentBlock icon={Layers} label="Grade / Board" items={profile ? [`${profile.grade} · ${profile.board}`] : []} />
          <AssignmentBlock icon={BookMarked} label="Subjects" items={data.subjects} />
        </div>
      </div>
    </div>
  );
}

function AssignmentBlock({ icon: Icon, label, items }) {
  return (
    <div className="rounded-xl border border-panel-line bg-void/60 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-neon-cyan" strokeWidth={1.8} />
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">{label}</span>
      </div>
      <p className="mt-2 text-sm text-ink-primary">{items.length ? items.join(", ") : "None assigned"}</p>
    </div>
  );
}
