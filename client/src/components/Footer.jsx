import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-panel-line bg-void px-6 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-neon-cyan" />
          <span className="font-wordmark text-sm tracking-wide text-ink-primary">
            Learn<span className="text-neon-cyan">Quest</span>
          </span>
        </div>
        <p className="font-body text-xs text-ink-faint">
          © {new Date().getFullYear()} LearnQuest. Built for students, class 9
          through 12.
        </p>
      </div>
    </footer>
  );
}
