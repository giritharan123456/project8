// Image-based questions (Section 16). Diagrams are hand-drawn inline SVG
// rather than fetched photos â€” no external image dependency, nothing to
// license, and they scale crisply at any size. `question.image` is a key
// into DIAGRAMS; add more keys here as more image-based questions are
// authored in data/content.js.
import { useMemo } from "react";

function AtomStructureDiagram() {
  return (
    <svg viewBox="0 0 200 140" className="mx-auto h-32 w-auto">
      <circle cx="100" cy="70" r="10" fill="#806BFF" />
      <ellipse cx="100" cy="70" rx="80" ry="28" fill="none" stroke="#38D9F4" strokeWidth="1.5" opacity="0.7" />
      <ellipse
        cx="100"
        cy="70"
        rx="80"
        ry="28"
        fill="none"
        stroke="#4ADE80"
        strokeWidth="1.5"
        opacity="0.7"
        transform="rotate(60 100 70)"
      />
      <ellipse
        cx="100"
        cy="70"
        rx="80"
        ry="28"
        fill="none"
        stroke="#FCD34D"
        strokeWidth="1.5"
        opacity="0.7"
        transform="rotate(120 100 70)"
      />
      <circle cx="180" cy="70" r="5" fill="#38D9F4" />
      <circle cx="60" cy="20" r="5" fill="#4ADE80" />
      <circle cx="140" cy="118" r="5" fill="#FCD34D" />
    </svg>
  );
}

function StatesOfMatterDiagram() {
  const grid = (cols, rows, spread) =>
    Array.from({ length: cols * rows }, (_, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const jitter = spread ? (Math.random() - 0.5) * spread : 0;
      return { x: 10 + c * 12 + jitter, y: 10 + r * 12 + jitter };
    });
  // Computed once per mount (not per render) so the particle jitter for
  // "Liquid"/"Gas" doesn't visibly shift every time a sibling state
  // update (feedback, timer tick) re-renders the battle screen.
  const panels = useMemo(
    () => [
      { label: "Solid", color: "#38D9F4", pts: grid(4, 4, 0) },
      { label: "Liquid", color: "#4ADE80", pts: grid(4, 4, 4) },
      { label: "Gas", color: "#FCD34D", pts: grid(4, 4, 16) },
    ],
    []
  );
  return (
    <svg viewBox="0 0 210 90" className="mx-auto h-24 w-auto">
      {panels.map((panel, i) => (
        <g key={panel.label} transform={`translate(${i * 70}, 0)`}>
          <rect x="2" y="2" width="60" height="60" rx="6" fill="none" stroke="#3A3E68" strokeWidth="1" />
          {panel.pts.map((pt, j) => (
            <circle key={j} cx={pt.x} cy={pt.y} r="2.4" fill={panel.color} />
          ))}
          <text x="31" y="78" textAnchor="middle" fontSize="9" fill="#8A8FB8" fontFamily="monospace">
            {panel.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function PhScaleDiagram() {
  return (
    <svg viewBox="0 0 220 50" className="mx-auto h-16 w-auto">
      <defs>
        <linearGradient id="phGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="50%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#806BFF" />
        </linearGradient>
      </defs>
      <rect x="4" y="16" width="212" height="14" rx="7" fill="url(#phGrad)" />
      {[0, 7, 14].map((v) => (
        <text
          key={v}
          x={4 + (v / 14) * 212}
          y="44"
          textAnchor="middle"
          fontSize="9"
          fill="#8A8FB8"
          fontFamily="monospace"
        >
          {v}
        </text>
      ))}
    </svg>
  );
}

const DIAGRAMS = {
  "atom-structure": AtomStructureDiagram,
  "states-of-matter": StatesOfMatterDiagram,
  "ph-scale": PhScaleDiagram,
};

export default function QuestionDiagram({ image }) {
  const Diagram = DIAGRAMS[image];
  if (!Diagram) return null;
  return (
    <div className="mb-4 flex justify-center rounded-lg border border-panel-line bg-void/30 py-3">
      <Diagram />
    </div>
  );
}
