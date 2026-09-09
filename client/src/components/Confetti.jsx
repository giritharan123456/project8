import { useEffect, useRef } from "react";

// Confetti burst used on win screens (Level Complete, Boss Defeated).
// Fires once on mount, runs for `durationMs`, then stops and clears itself â€”
// this is a one-shot celebration effect, not an ambient background (that's
// ParticleField's job). Respects prefers-reduced-motion by skipping the
// canvas animation entirely; the reward reveal still plays without it.
const COLORS = ["#806BFF", "#38D9F4", "#4ADE80", "#FCD34D", "#A78BFA"];

function makePiece(width) {
  const isRibbon = Math.random() > 0.55;
  return {
    x: Math.random() * width,
    y: -20 - Math.random() * 200,
    vx: (Math.random() - 0.5) * 2.4,
    vy: 2.2 + Math.random() * 2.6,
    size: isRibbon ? 3 + Math.random() * 3 : 5 + Math.random() * 4,
    ribbon: isRibbon,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.25,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    drag: 0.985 + Math.random() * 0.01,
    wobble: Math.random() * Math.PI * 2,
  };
}

export default function Confetti({ count = 140, durationMs = 3200, active = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height, pieces, raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const start = performance.now();

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    pieces = Array.from({ length: count }, () => makePiece(width));
    window.addEventListener("resize", resize);

    function frame(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, width, height);

      // Taper off spawning influence â€” everything just falls / fades near the end.
      const fadeStart = durationMs * 0.7;
      const globalAlpha = elapsed > fadeStart ? Math.max(0, 1 - (elapsed - fadeStart) / (durationMs - fadeStart)) : 1;

      for (const p of pieces) {
        p.wobble += 0.08;
        p.vx += Math.sin(p.wobble) * 0.02;
        p.vx *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;

        ctx.save();
        ctx.globalAlpha = globalAlpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.ribbon) {
          ctx.fillRect(-p.size / 2, -p.size * 1.6, p.size, p.size * 3.2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        if (p.y - 20 > height) {
          Object.assign(p, makePiece(width));
          p.y = -20 - Math.random() * 60;
        }
      }

      if (elapsed < durationMs) {
        raf = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active, count, durationMs]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
}
