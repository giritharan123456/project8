import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { BOARD_CATEGORIES } from "../data/content.js";

const CATEGORY_COLORS = {
  "Central Boards": "#38D9F4",
  "State Boards": "#4ADE80",
  "International Boards": "#FCD34D",
};

function BoardCard({ board, color }) {
  const Icon = Icons[board.icon] ?? Icons.BookOpen;

  return (
    <div
      className="hud-frame relative flex flex-col rounded-xl border border-panel-line bg-panel/60 p-5 transition-all duration-300 hover:-translate-y-1"
      style={{ "--hud-color": color }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border"
          style={{ borderColor: `${color}55`, background: `${color}14` }}
        >
          <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.8} />
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold text-ink-primary">
            {board.name}
          </h4>
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
            {board.type}
          </span>
        </div>
      </div>

      <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">
        {board.description}
      </p>

      <div className="mt-4 flex gap-4 font-mono text-xs text-ink-faint">
        <span>{board.courses} courses</span>
        <span>{board.lessons} lessons</span>
      </div>
    </div>
  );
}

export default function BoardsPreview() {
  return (
    <section id="boards" className="relative bg-void px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon-green">
            Step 2
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink-primary sm:text-5xl">
            Choose Your <span className="text-neon-green">Board</span>
          </h2>
          <p className="mt-4 font-body text-ink-muted">
            Central, state, and international boards â€” pick yours and your
            entire journey adapts to its syllabus.
          </p>
        </div>

        <div className="mt-16 space-y-12">
          {BOARD_CATEGORIES.map((cat) => (
            <div key={cat.category}>
              <h3
                className="font-display text-sm font-semibold uppercase tracking-[0.2em]"
                style={{ color: CATEGORY_COLORS[cat.category] }}
              >
                {cat.category}
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {cat.boards.map((board) => (
                  <BoardCard
                    key={board.code}
                    board={board}
                    color={CATEGORY_COLORS[cat.category]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/sign-up"
            className="inline-flex items-center justify-center rounded-xl bg-arcane-purple px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-white shadow-glow-purple transition-transform hover:scale-[1.03]"
          >
            Select Board
          </Link>
        </div>
      </div>
    </section>
  );
}
