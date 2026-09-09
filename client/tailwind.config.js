/** @type {import('tailwindcss').Config} */

function withOpacityValue(varName) {
  return `rgb(var(${varName}) / <alpha-value>)`;
}

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: withOpacityValue("--color-void"),
          soft: withOpacityValue("--color-void-soft"),
        },
        panel: {
          DEFAULT: withOpacityValue("--color-panel"),
          alt: withOpacityValue("--color-panel-alt"),
          line: withOpacityValue("--color-panel-line"),
        },
        surface: {
          DEFAULT: withOpacityValue("--color-surface"),
          elevated: withOpacityValue("--color-surface"),
        },
        overlay: {
          DEFAULT: withOpacityValue("--color-overlay"),
        },
        arcane: {
          purple: withOpacityValue("--color-arcane-purple"),
          violet: withOpacityValue("--color-arcane-violet"),
        },
        neon: {
          cyan: withOpacityValue("--color-neon-cyan"),
          green: withOpacityValue("--color-neon-green"),
        },
        reward: {
          gold: withOpacityValue("--color-reward-gold"),
        },
        danger: {
          DEFAULT: withOpacityValue("--color-danger"),
        },
        success: {
          DEFAULT: withOpacityValue("--color-success"),
        },
        focus: {
          DEFAULT: withOpacityValue("--color-focus"),
        },
        ink: {
          primary: withOpacityValue("--color-ink-primary"),
          muted: withOpacityValue("--color-ink-muted"),
          faint: withOpacityValue("--color-ink-faint"),
        },
      },
      fontFamily: {
        wordmark: ["Orbitron", "sans-serif"],
        display: ["\"Space Grotesk\"", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["\"JetBrains Mono\"", "monospace"],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at 50% 0%, rgba(128,107,255,0.18), transparent 60%)",
      },
      borderRadius: {
        control: "0.625rem",
        card: "1rem",
        "card-lg": "1.5rem",
        "hero-lg": "2rem",
        pill: "9999px",
      },
      boxShadow: {
        "glow-purple": "0 2px 10px rgba(128,107,255,0.32)",
        "glow-cyan": "0 2px 10px rgba(56,217,244,0.28)",
        "glow-green": "0 2px 10px rgba(74,222,128,0.26)",
        "glow-gold": "0 2px 10px rgba(252,211,77,0.26)",
        soft: "0 1px 2px rgba(4,5,14,0.28), 0 4px 16px -6px rgba(4,5,14,0.45)",
        elevated:
          "0 2px 6px rgba(4,5,14,0.25), 0 16px 44px -16px rgba(4,5,14,0.6)",
        "elevated-glow":
          "0 2px 6px rgba(4,5,14,0.25), 0 16px 44px -16px rgba(4,5,14,0.6), 0 0 0 1px rgba(128,107,255,0.18)",
        inner: "inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "pulse-border": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "count-glow": {
          "0%": { textShadow: "0 0 0px rgba(252,211,77,0)" },
          "50%": { textShadow: "0 0 18px rgba(252,211,77,0.65)" },
          "100%": { textShadow: "0 0 0px rgba(252,211,77,0)" },
        },
        "draw-path": {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(5px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(3px)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "60%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "none" },
        },
        "answer-pop": {
          "0%": { transform: "scale(0.95)" },
          "55%": { transform: "scale(1.03)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        "count-pop": {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.18)" },
          "100%": { transform: "scale(1)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(128,107,255,0.35)" },
          "50%": { boxShadow: "0 0 22px rgba(128,107,255,0.65)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "none" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "none" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-border": "pulse-border 2.4s ease-in-out infinite",
        "count-glow": "count-glow 1.2s ease-out",
        shake: "shake 0.4s ease-in-out",
        "pop-in": "pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "answer-pop": "answer-pop 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
        shimmer: "shimmer 1.6s linear infinite",
        "count-pop": "count-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.4s cubic-bezier(0.22,1,0.36,1) both",
        "scale-in": "scale-in 0.35s cubic-bezier(0.22,1,0.36,1) both",
        "gradient-shift": "gradient-shift 4s ease infinite",
      },
    },
  },
  plugins: [],
};