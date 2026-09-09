// A quiet, mostly-static ambient texture â€” a handful of faint molecule
// "dots" scattered on a canvas. Replaces the old continuously-animated
// particle system: nothing drifts or loops here, so it reads as a subtle
// backdrop instead of a moving visual effect. Kept as a component (rather
// than deleted outright) in case a page wants a very light ambient touch,
// but it is no longer used as a full-screen animated background anywhere
// in the app by default.
import { useEffect, useRef } from "react";

const COLORS = ["#806BFF", "#38D9F4", "#4ADE80"];

function makeDot(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: 1.2 + Math.random() * 1.6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: 0.1 + Math.random() * 0.14,
  };
}

export default function ParticleField({ density = 18 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function draw() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const dots = Array.from({ length: Math.min(density, 24) }, () =>
        makeDot(width, height)
      );
      for (const d of dots) {
        ctx.globalAlpha = d.opacity;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full pointer-events-none"
    />
  );
}
