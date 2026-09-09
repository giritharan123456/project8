import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  GraduationCap,
  Coins,
  Flame,
  Star,
  Trophy,
  Target,
  Swords,
  ListChecks,
  Camera,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Globe,
  UserCog,
  LogOut,
  Check,
  Loader2,
  BookOpen,
  Moon,
  Sun,
  Languages,
  RotateCcw,
  Palette,
  Shield,
  Zap,
  Award,
  History,
  Settings,
} from "lucide-react";
import GameNav from "../components/GameNav.jsx";
import SideNav from "../components/SideNav.jsx";
import CornerControls from "../components/CornerControls.jsx";
import { CLASSES, BOARD_CATEGORIES, getProfileData, SHOP_ITEMS, MOCK_ACHIEVEMENTS } from "../data/content.js";
import { subjectDisplayName } from "../data/subjects.js";
import {
  usePlayerState,
  getEquippedAvatarIcon,
  getWorldMapLive,
  getAchievementsLive,
  levelFromXp,
  xpIntoCurrentLevel,
  xpForLevel,
  resetPlayerState,
} from "../store/playerStore.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getProfile, updateProfile, uploadProfilePhoto, deleteProfilePhoto } from "../api/profile.js";
import AvatarPicker from "../components/ui/AvatarPicker.jsx";
import MasteryBadge from "../components/ui/MasteryBadge.jsx";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSION = 480;

const ALL_BOARDS = BOARD_CATEGORIES.flatMap((c) => c.boards);

function fileToCompressedDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not read image."));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function StatTile({ icon: Icon, label, value, colorClass = "text-ink-primary" }) {
  return (
    <div className="rounded-xl border border-panel-line bg-panel/60 p-5">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className={`mt-2 font-display text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

function AvatarPreview({ photo, AvatarIcon, size = "h-24 w-24", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex ${size} items-center justify-center overflow-hidden rounded-full border-2 border-arcane-purple/60 bg-arcane-purple/15 transition-transform hover:scale-105 ${onClick ? "cursor-pointer" : ""}`}
    >
      {photo ? (
        <img src={photo} alt="Profile" className="h-full w-full object-cover" />
      ) : (
        <AvatarIcon className="h-11 w-11 text-arcane-purple" strokeWidth={1.6} />
      )}
    </button>
  );
}

const AVATAR_SHOP_ITEMS = SHOP_ITEMS.filter((i) => i.category === "avatars");

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class");
  const board = searchParams.get("board");
  const subject = searchParams.get("subject");
  const { t, language, setLanguage, languages } = useLanguage();

  const profile = useMemo(() => getProfileData(grade, board), [grade, board]);
  const playerState = usePlayerState();
  const [section, setSection] = useState("view");
  const [account, setAccount] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const liveProfile = {
    ...profile,
    name: account?.name ?? profile.name,
    coins: playerState.coins,
    xp: playerState.xp,
    streak: playerState.streak,
  };
  const AvatarIcon = Icons[getEquippedAvatarIcon(playerState)] ?? Icons.UserRound;

  const level = levelFromXp(playerState.xp);
  const xpInto = xpIntoCurrentLevel(playerState.xp);
  const xpNeeded = xpForLevel(level);
  const xpPct = Math.min(100, Math.round((xpInto / xpNeeded) * 100));

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Settings state
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("chemquest-theme") ?? "dark";
    }
    return "dark";
  });
  const [reduceMotion, setReduceMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("chemquest-reduce-motion") === "true";
    }
    return false;
  });

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((data) => {
        if (!cancelled) setAccount(data);
      })
      .finally(() => {
        if (!cancelled) setLoadingAccount(false);
      });
    return () => { cancelled = true; };
  }, []);

  const [form, setForm] = useState({ name: "", grade: "9", board: "CBSE" });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    if (account) {
      setForm({
        name: account.name ?? "",
        grade: String(account.grade ?? "9"),
        board: account.board ?? "CBSE",
      });
    }
  }, [account]);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);
    try {
      const updated = await updateProfile({ name: form.name, grade: form.grade, board: form.board });
      setAccount((prev) => ({ ...prev, ...updated }));
      setSaveStatus("ok");
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 2500);
    }
  }

  const fileInputRef = useRef(null);
  const [photoError, setPhotoError] = useState(null);
  const [photoBusy, setPhotoBusy] = useState(false);

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setPhotoError(t("invalidFileType"));
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setPhotoError(t("fileTooLarge"));
      return;
    }
    setPhotoBusy(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      const result = await uploadProfilePhoto(dataUrl);
      setAccount((prev) => ({ ...prev, profilePhoto: result.profilePhoto ?? dataUrl }));
    } catch {
      setPhotoError(t("invalidFileType"));
    } finally {
      setPhotoBusy(false);
    }
  }

  async function handleRemovePhoto() {
    if (!window.confirm(t("confirmRemovePhoto"))) return;
    setPhotoBusy(true);
    try {
      await deleteProfilePhoto();
      setAccount((prev) => ({ ...prev, profilePhoto: null }));
    } finally {
      setPhotoBusy(false);
    }
  }

  function handleThemeToggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("chemquest-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  function handleReduceMotionToggle() {
    const next = !reduceMotion;
    setReduceMotion(next);
    localStorage.setItem("chemquest-reduce-motion", String(next));
  }

  function handleClearProgress() {
    if (!window.confirm("Are you sure you want to clear ALL progress? This cannot be undone.")) return;
    resetPlayerState();
    window.location.reload();
  }

  const displayPhoto = account?.profilePhoto ?? null;

  // Live stats
  const worldMap = useMemo(() => getWorldMapLive(grade ?? "9", board ?? "CBSE", subject), [grade, board, subject]);
  const achievements = useMemo(() => getAchievementsLive(grade ?? "9", board ?? "CBSE", subject), [grade, board, subject]);
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const enrolledSubjects = useMemo(() => {
    const subjects = new Set();
    if (subject) subjects.add(subjectDisplayName(subject));
    if (account?.subjects?.length) {
      account.subjects.forEach((s) => subjects.add(subjectDisplayName(s)));
    }
    if (subjects.size === 0) subjects.add("Chemistry");
    return Array.from(subjects);
  }, [subject, account?.subjects]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-void pb-24 sm:pl-64">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <SideNav active="profile" grade={grade} board={board} subject={subject} />
      <CornerControls />

      <div className="relative border-b border-panel-line/70 bg-void/70 backdrop-blur-sm sm:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Link to={`/dashboard?class=${profile.currentGrade}&board=${profile.currentBoard}`} className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-neon-cyan" strokeWidth={2.2} />
            <span className="font-wordmark text-sm tracking-wide text-ink-primary">
              Learn<span className="text-neon-cyan">Quest</span>
            </span>
          </Link>
          {section !== "view" && (
            <button
              type="button"
              onClick={() => setSection("view")}
              className="flex items-center gap-1.5 rounded-full border border-panel-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:border-neon-cyan/60 hover:text-neon-cyan"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> {t("myProfile")}
            </button>
          )}
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-3xl px-6 lg:px-8">
        {section === "view" && (
          <ProfileView
            t={t}
            profile={profile}
            liveProfile={liveProfile}
            xpPct={xpPct}
            level={level}
            xpInto={xpInto}
            xpNeeded={xpNeeded}
            AvatarIcon={AvatarIcon}
            displayPhoto={displayPhoto}
            loadingAccount={loadingAccount}
            onEditProfile={() => setSection("edit")}
            onLanguage={() => setSection("language")}
            onSettings={() => setSection("settings")}
            onAvatarPicker={() => setShowAvatarPicker(true)}
            worldMap={worldMap}
            achievements={achievements}
            enrolledSubjects={enrolledSubjects}
            theme={theme}
            reduceMotion={reduceMotion}
            onThemeToggle={handleThemeToggle}
            onReduceMotionToggle={handleReduceMotionToggle}
            onClearProgress={handleClearProgress}
          />
        )}
        {section === "edit" && (
          <EditProfileView
            t={t}
            form={form}
            setForm={setForm}
            onBack={() => setSection("view")}
            onSave={handleSaveProfile}
            saving={saving}
            saveStatus={saveStatus}
            account={account}
            displayPhoto={displayPhoto}
            AvatarIcon={AvatarIcon}
            photoBusy={photoBusy}
            photoError={photoError}
            fileInputRef={fileInputRef}
            onPhotoChange={handlePhotoChange}
            onRemovePhoto={handleRemovePhoto}
            onAvatarPicker={() => setShowAvatarPicker(true)}
          />
        )}
        {section === "language" && (
          <LanguageView t={t} language={language} setLanguage={setLanguage} languages={languages} onBack={() => setSection("view")} />
        )}
        {section === "settings" && (
          <SettingsView
            t={t}
            onBack={() => setSection("view")}
            theme={theme}
            reduceMotion={reduceMotion}
            onThemeToggle={handleThemeToggle}
            onReduceMotionToggle={handleReduceMotionToggle}
            onClearProgress={handleClearProgress}
          />
        )}
      </div>

      <GameNav active="profile" grade={profile.currentGrade} board={profile.currentBoard} subject={subject} />

      <AvatarPicker open={showAvatarPicker} onClose={() => setShowAvatarPicker(false)} />
    </div>
  );
}

function ProfileView({
  t,
  profile,
  liveProfile,
  xpPct,
  level,
  xpInto,
  xpNeeded,
  AvatarIcon,
  displayPhoto,
  loadingAccount,
  onEditProfile,
  onLanguage,
  onSettings,
  onAvatarPicker,
  worldMap,
  achievements,
  enrolledSubjects,
  theme,
  reduceMotion,
  onThemeToggle,
  onReduceMotionToggle,
  onClearProgress,
}) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalAccuracy = profile.accuracy ?? 0;
  const masteryCount = achievements.filter((a) => a.unlocked && a.name?.toLowerCase().includes("master")).length;

  return (
    <>
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon-cyan">{t("myProfile")}</span>

      <div className="mt-3 flex flex-wrap items-center gap-6 rounded-xl border border-panel-line bg-panel/60 px-6 py-6">
        <div className="relative">
          <AvatarPreview photo={displayPhoto} AvatarIcon={AvatarIcon} onClick={onAvatarPicker} />
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-void bg-arcane-purple font-display text-xs font-bold text-void">
            {level}
          </div>
        </div>
        <div className="min-w-[200px] flex-1">
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink-primary">{liveProfile.name}</h1>
          <p className="mt-1 font-mono text-xs text-ink-muted">
            {t("class")} {profile.currentGrade} &middot; {profile.currentBoard}
            {profile.currentCourse ? ` \u00b7 ${profile.currentCourse}` : ""}
          </p>
          <div className="mt-3 max-w-xs">
            <div className="flex items-center justify-between font-mono text-[10px] text-ink-faint">
              <span>{t("level").toUpperCase()} {level}</span>
              <span>{xpInto}/{xpNeeded} {t("xp")}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-panel-line">
              <div className="h-full rounded-full bg-arcane-purple" style={{ width: `${xpPct}%` }} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-1.5 font-mono text-sm text-reward-gold">
            <Coins className="h-4 w-4" /> {liveProfile.coins}
          </div>
          <div className="flex items-center gap-1.5 font-mono text-sm text-neon-green">
            <Flame className="h-4 w-4" /> {liveProfile.streak} {t("dayStreak")}
          </div>
          <div className="flex items-center gap-1.5 font-mono text-sm text-neon-cyan">
            <Star className="h-4 w-4" /> {worldMap.totalStars} {t("stars")}
          </div>
        </div>
      </div>

      <h2 className="mt-10 font-display text-lg font-bold uppercase tracking-wide text-ink-primary">
        {t("allTimeStats")}
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile icon={Star} label="Total XP" value={liveProfile.xp.toLocaleString()} colorClass="text-reward-gold" />
        <StatTile icon={Coins} label="Coins" value={liveProfile.coins} colorClass="text-reward-gold" />
        <StatTile icon={ListChecks} label="Quizzes Done" value={worldMap.completedCount} colorClass="text-neon-cyan" />
        <StatTile icon={Target} label={t("accuracy")} value={`${totalAccuracy}%`} colorClass="text-neon-green" />
        <StatTile icon={Trophy} label="Achievements" value={`${unlockedCount}/${achievements.length}`} colorClass="text-reward-gold" />
        <StatTile icon={Flame} label={t("currentStreak")} value={`${liveProfile.streak} ${t("dayStreak")}`} colorClass="text-neon-green" />
      </div>

      <h2 className="mt-10 font-display text-lg font-bold uppercase tracking-wide text-ink-primary">
        Subjects Enrolled
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {enrolledSubjects.map((s) => (
          <div key={s} className="flex items-center gap-3 rounded-xl border border-panel-line bg-panel/50 px-4 py-3">
            <BookOpen className="h-4 w-4 text-arcane-purple" />
            <span className="font-display text-sm font-semibold text-ink-primary">{s}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-lg font-bold uppercase tracking-wide text-ink-primary">
        Badges &amp; Achievements
      </h2>
      <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {achievements.slice(0, 8).map((a) => {
          const Icon = Icons[a.icon] ?? Icons.Award;
          return (
            <div
              key={a.id}
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 ${
                a.unlocked ? "border-reward-gold/40 bg-reward-gold/5" : "border-panel-line bg-panel/40 opacity-50"
              }`}
            >
              <Icon
                className="h-6 w-6"
                strokeWidth={1.7}
                style={{ color: a.unlocked ? "#FCD34D" : "#6B6088" }}
              />
              <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint text-center leading-tight">
                {a.name}
              </span>
            </div>
          );
        })}
      </div>
      <Link
        to={`/achievements?class=${profile.currentGrade}&board=${profile.currentBoard}`}
        className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-panel-line py-2 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:border-neon-cyan/60 hover:text-neon-cyan"
      >
        View All Achievements <ChevronRight className="h-3.5 w-3.5" />
      </Link>

      <h2 className="mt-10 font-display text-lg font-bold uppercase tracking-wide text-ink-primary">
        Recent Quiz Sessions
      </h2>
      <div className="mt-3 space-y-2">
        {worldMap.worlds.filter((w) => w.status === "completed" || w.progress > 0).slice(0, 4).map((w) => (
          <div key={w.id} className="flex items-center justify-between rounded-xl border border-panel-line bg-panel/50 px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                {w.status === "completed" ? "Cleared" : "In Progress"}
              </span>
              <span className="font-display text-sm font-semibold text-ink-primary">{w.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-reward-gold">{w.xp} XP</span>
              <span className="font-mono text-xs text-neon-cyan">{w.stars} Stars</span>
            </div>
          </div>
        ))}
        {worldMap.worlds.filter((w) => w.status === "completed" || w.progress > 0).length === 0 && (
          <p className="rounded-xl border border-dashed border-panel-line bg-panel/40 py-6 text-center font-mono text-xs text-ink-faint">
            No quiz sessions yet â€” start a lesson to see your history here.
          </p>
        )}
      </div>

      <h2 className="mt-10 font-display text-lg font-bold uppercase tracking-wide text-ink-primary">
        {t("currentCurriculum")}
      </h2>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-panel-line bg-panel/60 px-6 py-5">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">{t("class")}</p>
            <p className="font-display text-lg font-bold text-ink-primary">{profile.currentGrade}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">{t("board")}</p>
            <p className="font-display text-lg font-bold text-ink-primary">{profile.currentBoard}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">{t("course")}</p>
            <p className="font-display text-lg font-bold text-ink-primary">{profile.currentCourse ?? "\u2014"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onEditProfile}
          className="rounded-xl border border-panel-line px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:border-neon-cyan/60 hover:text-neon-cyan"
        >
          {t("switchCurriculum")}
        </button>
      </div>

      <h2 className="mt-10 font-display text-lg font-bold uppercase tracking-wide text-ink-primary">
        {t("account")}
      </h2>
      <div className="mt-3 space-y-3">
        <button
          type="button"
          onClick={onEditProfile}
          disabled={loadingAccount}
          className="flex w-full items-center justify-between rounded-xl border border-panel-line bg-panel/50 px-5 py-4 text-left transition-colors hover:border-neon-cyan/50 disabled:opacity-60"
        >
          <span className="flex items-center gap-3">
            <UserCog className="h-4 w-4 text-neon-cyan" />
            <span className="font-display text-sm font-semibold text-ink-primary">{t("editProfile")}</span>
          </span>
          <ChevronRight className="h-4 w-4 text-ink-faint" />
        </button>

        <button
          type="button"
          onClick={onLanguage}
          className="flex w-full items-center justify-between rounded-xl border border-panel-line bg-panel/50 px-5 py-4 text-left transition-colors hover:border-neon-cyan/50"
        >
          <span className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-neon-cyan" />
            <span className="font-display text-sm font-semibold text-ink-primary">{t("language")}</span>
          </span>
          <ChevronRight className="h-4 w-4 text-ink-faint" />
        </button>

        <button
          type="button"
          onClick={onSettings}
          className="flex w-full items-center justify-between rounded-xl border border-panel-line bg-panel/50 px-5 py-4 text-left transition-colors hover:border-neon-cyan/50"
        >
          <span className="flex items-center gap-3">
            <Settings className="h-4 w-4 text-neon-cyan" />
            <span className="font-display text-sm font-semibold text-ink-primary">Settings</span>
          </span>
          <ChevronRight className="h-4 w-4 text-ink-faint" />
        </button>

        <Link
          to="/"
          className="flex w-full items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-4 font-display text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" /> {t("logout")}
        </Link>
      </div>
    </>
  );
}

function EditProfileView({
  t,
  form,
  setForm,
  onBack,
  onSave,
  saving,
  saveStatus,
  account,
  displayPhoto,
  AvatarIcon,
  photoBusy,
  photoError,
  fileInputRef,
  onPhotoChange,
  onRemovePhoto,
  onAvatarPicker,
}) {
  return (
    <>
      <button type="button" onClick={onBack} className="hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:text-neon-cyan sm:flex">
        <ChevronLeft className="h-3.5 w-3.5" /> {t("myProfile")}
      </button>
      <h1 className="mt-2 font-display text-2xl font-bold text-ink-primary">{t("editProfile")}</h1>

      <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-panel-line bg-panel/60 px-6 py-8">
        <div className="relative">
          <AvatarPreview photo={displayPhoto} AvatarIcon={AvatarIcon} size="h-28 w-28" onClick={onAvatarPicker} />
          {photoBusy && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-void/60">
              <Loader2 className="h-6 w-6 animate-spin text-neon-cyan" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={photoBusy} className="flex items-center gap-1.5 rounded-xl border border-panel-line px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:border-neon-cyan/60 hover:text-neon-cyan disabled:opacity-60">
            <Camera className="h-3.5 w-3.5" /> {t("changePhoto")}
          </button>
          {displayPhoto && (
            <button type="button" onClick={onRemovePhoto} disabled={photoBusy} className="flex items-center gap-1.5 rounded-xl border border-red-500/30 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-500/10 disabled:opacity-60">
              <Trash2 className="h-3.5 w-3.5" /> {t("removePhoto")}
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={onPhotoChange} className="hidden" />
        {photoError && <p className="font-mono text-xs text-red-400">{photoError}</p>}
      </div>

      <form onSubmit={onSave} className="mt-6 space-y-5 rounded-xl border border-panel-line bg-panel/60 px-6 py-6">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">{t("name")}</label>
          <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} maxLength={80} required className="mt-1.5 w-full rounded-xl border border-panel-line bg-void-soft px-3 py-2.5 font-body text-sm text-ink-primary focus:border-neon-cyan/60 focus:outline-none" />
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">{t("email")}</label>
          <input type="email" value={account?.email ?? ""} placeholder={t("notSignedInEmail")} disabled className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-panel-line bg-void-soft/50 px-3 py-2.5 font-body text-sm text-ink-faint focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">{t("class")}</label>
            <select value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-panel-line bg-void-soft px-3 py-2.5 font-body text-sm text-ink-primary focus:border-neon-cyan/60 focus:outline-none">
              {CLASSES.map((c) => (<option key={c.grade} value={c.grade}>{t("class")} {c.grade}</option>))}
            </select>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">{t("board")}</label>
            <select value={form.board} onChange={(e) => setForm((f) => ({ ...f, board: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-panel-line bg-void-soft px-3 py-2.5 font-body text-sm text-ink-primary focus:border-neon-cyan/60 focus:outline-none">
              {ALL_BOARDS.map((b) => (<option key={b.code} value={b.code}>{b.name}</option>))}
            </select>
          </div>
        </div>
        <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-arcane-purple py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-glow-purple disabled:opacity-70">
          {saving ? (<><Loader2 className="h-4 w-4 animate-spin" /> {t("saving")}</>) : saveStatus === "ok" ? (<><Check className="h-4 w-4" /> {t("saved")}</>) : t("saveChanges")}
        </button>
        {saveStatus === "error" && (<p className="text-center font-mono text-xs text-red-400">{t("saveChanges")} failed â€” please try again.</p>)}
      </form>
    </>
  );
}

function LanguageView({ t, language, setLanguage, languages, onBack }) {
  return (
    <>
      <button type="button" onClick={onBack} className="hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:text-neon-cyan sm:flex">
        <ChevronLeft className="h-3.5 w-3.5" /> {t("myProfile")}
      </button>
      <h1 className="mt-2 font-display text-2xl font-bold text-ink-primary">{t("language")}</h1>
      <p className="mt-1 font-body text-sm text-ink-muted">{t("chooseLanguage")}</p>
      <div className="mt-6 space-y-3">
        {languages.map((l) => {
          const active = l.code === language;
          return (
            <button key={l.code} type="button" onClick={() => setLanguage(l.code)} className={`flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left transition-colors ${active ? "border-neon-cyan/60 bg-arcane-purple/10" : "border-panel-line bg-panel/50 hover:border-neon-cyan/40"}`}>
              <span className="font-display text-base font-semibold text-ink-primary">{l.nativeLabel}</span>
              {active && <Check className="h-5 w-5 text-neon-cyan" />}
            </button>
          );
        })}
      </div>
    </>
  );
}

function SettingsView({ t, onBack, theme, reduceMotion, onThemeToggle, onReduceMotionToggle, onClearProgress }) {
  return (
    <>
      <button type="button" onClick={onBack} className="hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:text-neon-cyan sm:flex">
        <ChevronLeft className="h-3.5 w-3.5" /> {t("myProfile")}
      </button>
      <h1 className="mt-2 font-display text-2xl font-bold text-ink-primary">Settings</h1>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onThemeToggle}
          className="flex w-full items-center justify-between rounded-xl border border-panel-line bg-panel/50 px-5 py-4 text-left transition-colors hover:border-neon-cyan/50"
        >
          <span className="flex items-center gap-3">
            {theme === "dark" ? <Moon className="h-4 w-4 text-neon-cyan" /> : <Sun className="h-4 w-4 text-reward-gold" />}
            <span className="font-display text-sm font-semibold text-ink-primary">Theme</span>
          </span>
          <span className="font-mono text-xs text-ink-muted">{theme === "dark" ? "Dark" : "Light"}</span>
        </button>

        <button
          type="button"
          onClick={onReduceMotionToggle}
          className="flex w-full items-center justify-between rounded-xl border border-panel-line bg-panel/50 px-5 py-4 text-left transition-colors hover:border-neon-cyan/50"
        >
          <span className="flex items-center gap-3">
            <Zap className="h-4 w-4 text-neon-cyan" />
            <span className="font-display text-sm font-semibold text-ink-primary">Reduce Motion</span>
          </span>
          <span className={`font-mono text-xs ${reduceMotion ? "text-neon-green" : "text-ink-muted"}`}>
            {reduceMotion ? "On" : "Off"}
          </span>
        </button>

        <button
          type="button"
          onClick={onClearProgress}
          className="flex w-full items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-4 text-left transition-colors hover:bg-red-500/10"
        >
          <RotateCcw className="h-4 w-4 text-red-400" />
          <span className="font-display text-sm font-semibold text-red-400">Clear All Progress</span>
        </button>
      </div>
    </>
  );
}
