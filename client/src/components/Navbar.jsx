import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";

const LINKS = [
  { label: "Why LearnQuest", href: "#why" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Worlds", href: "#worlds" },
  { label: "Rewards", href: "#rewards" },
  { label: "Leaderboard", href: "#leaderboard" },
  { label: "FAQ", href: "#faq" },
];

const SUBJECTS_PATH = "/subjects";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-void/90 backdrop-blur-md border-b border-panel-line shadow-soft"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="tap-feedback flex items-center gap-2 py-1">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-arcane-purple/40 bg-gradient-to-br from-arcane-purple/20 to-neon-cyan/10 shadow-glow-purple">
            <GraduationCap className="h-5 w-5 text-neon-cyan" strokeWidth={2.2} />
          </span>
          <span className="font-wordmark text-lg tracking-wide text-ink-primary">
            Learn<span className="text-neon-cyan">Quest</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-[15px] font-medium text-ink-muted transition-colors hover:text-ink-primary py-2"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/login"
            className="font-display text-[15px] font-medium text-ink-muted transition-colors hover:text-ink-primary py-2"
          >
            Sign In
          </Link>
          <Link
            to={SUBJECTS_PATH}
            className="font-display text-[15px] font-medium text-ink-muted transition-colors hover:text-ink-primary py-2"
          >
            Subjects
          </Link>
          <Link
            to="/login"
            className="tap-bounce rounded-xl bg-arcane-purple px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wider text-white shadow-glow-purple transition-transform hover:scale-[1.03]"
          >
            Start Adventure
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="tap-bounce flex h-10 w-10 items-center justify-center rounded-xl border border-panel-line bg-panel/60"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-panel-line bg-void/95 px-4 py-4 shadow-soft backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="tap-feedback rounded-xl px-3 py-3 font-display text-base text-ink-muted transition-colors hover:bg-panel/60 hover:text-ink-primary"
              >
                {link.label}
              </a>
            ))}
            <Link
              to={SUBJECTS_PATH}
              onClick={() => setOpen(false)}
              className="tap-feedback rounded-xl px-3 py-3 font-display text-base text-ink-muted transition-colors hover:bg-panel/60 hover:text-ink-primary"
            >
              Subjects
            </Link>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="tap-feedback rounded-xl px-3 py-3 font-display text-base text-ink-muted transition-colors hover:bg-panel/60 hover:text-ink-primary"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="tap-bounce mt-2 rounded-xl bg-arcane-purple px-4 py-3.5 text-center font-display text-sm font-semibold uppercase tracking-wider text-white shadow-glow-purple"
            >
              Start Adventure
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}