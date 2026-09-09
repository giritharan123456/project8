// Stylised knight-vs-monster illustration for the Hero section, built to
// mirror the character artwork in the product mockup (01. Landing Page):
// a chemist-knight with a glowing blue sword facing off against a purple
// horned slime, with floating potion vials in the background.
export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 420 460"
      className="h-auto w-full drop-shadow-[0_0_40px_rgba(128,107,255,0.25)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="groundGlow" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="#806BFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#806BFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="swordGlow" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#38D9F4" />
          <stop offset="100%" stopColor="#e6fbff" />
        </linearGradient>
        <linearGradient id="capeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c0392b" />
          <stop offset="100%" stopColor="#7a1f18" />
        </linearGradient>
        <radialGradient id="slimeGrad" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#5b21b6" />
        </radialGradient>
      </defs>

      {/* ground shadow / glow */}
      <ellipse cx="210" cy="420" rx="170" ry="26" fill="url(#groundGlow)" />

      {/* floating potion vials */}
      <g opacity="0.9">
        <g transform="translate(48,70)">
          <rect x="-10" y="0" width="20" height="26" rx="6" fill="#39D67A" opacity="0.85" />
          <rect x="-4" y="-10" width="8" height="12" rx="2" fill="#2a2f45" />
        </g>
        <g transform="translate(368,120)">
          <rect x="-9" y="0" width="18" height="24" rx="6" fill="#806BFF" opacity="0.85" />
          <rect x="-3.5" y="-9" width="7" height="11" rx="2" fill="#2a2f45" />
        </g>
      </g>

      {/* --- MONSTER (right) --- */}
      <g transform="translate(300,300)">
        {/* horns */}
        <path d="M-30,-58 L-46,-90 L-16,-70 Z" fill="#5b21b6" />
        <path d="M30,-58 L46,-90 L16,-70 Z" fill="#5b21b6" />
        {/* body */}
        <path
          d="M0,-60 C46,-60 62,-10 54,34 C48,66 22,86 0,86 C-22,86 -48,66 -54,34 C-62,-10 -46,-60 0,-60 Z"
          fill="url(#slimeGrad)"
          stroke="#3b0f80"
          strokeWidth="3"
        />
        {/* belly highlight */}
        <ellipse cx="0" cy="18" rx="26" ry="34" fill="#c4b5fd" opacity="0.25" />
        {/* eyes */}
        <ellipse cx="-16" cy="-6" rx="9" ry="12" fill="#0d0f1a" />
        <ellipse cx="16" cy="-6" rx="9" ry="12" fill="#0d0f1a" />
        <circle cx="-13" cy="-9" r="3" fill="#FCD34D" />
        <circle cx="19" cy="-9" r="3" fill="#FCD34D" />
        {/* mouth */}
        <path d="M-14,20 Q0,32 14,20" stroke="#0d0f1a" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* claws */}
        <path d="M-52,40 L-70,54 M-52,48 L-72,64" stroke="#3b0f80" strokeWidth="5" strokeLinecap="round" />
        <path d="M52,40 L70,54 M52,48 L72,64" stroke="#3b0f80" strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* --- KNIGHT (left) --- */}
      <g transform="translate(140,300)">
        {/* cape */}
        <path
          d="M-6,-70 C-40,-58 -46,20 -30,74 C-14,60 8,58 22,72 C34,10 24,-56 -6,-70 Z"
          fill="url(#capeGrad)"
        />
        {/* legs */}
        <rect x="-22" y="40" width="16" height="46" rx="7" fill="#232842" />
        <rect x="6" y="40" width="16" height="46" rx="7" fill="#232842" />
        <rect x="-24" y="82" width="20" height="10" rx="3" fill="#12141f" />
        <rect x="4" y="82" width="20" height="10" rx="3" fill="#12141f" />
        {/* torso / armor */}
        <path
          d="M-24,-16 C-24,-34 -10,-46 0,-46 C10,-46 24,-34 24,-16 L22,40 L-22,40 Z"
          fill="#2b3050"
          stroke="#3d3555"
          strokeWidth="2"
        />
        <path d="M0,-40 L0,36" stroke="#38D9F4" strokeWidth="2" opacity="0.6" />
        {/* shoulder plates */}
        <circle cx="-24" cy="-18" r="10" fill="#3d3555" />
        <circle cx="24" cy="-18" r="10" fill="#3d3555" />
        {/* head */}
        <circle cx="0" cy="-58" r="16" fill="#f0c39e" />
        <path d="M-16,-62 C-16,-78 16,-78 16,-62 C16,-70 8,-76 0,-76 C-8,-76 -16,-70 -16,-62 Z" fill="#1c1c28" />
        <path d="M-16,-60 Q-20,-46 -12,-38" stroke="#1c1c28" strokeWidth="6" fill="none" strokeLinecap="round" />

        {/* shield arm (left) */}
        <ellipse cx="-30" cy="4" rx="10" ry="16" fill="#3d3555" stroke="#38D9F4" strokeWidth="1.5" />

        {/* sword arm + glowing sword (right, raised toward monster) */}
        <g transform="rotate(-18)">
          <rect x="18" y="-30" width="10" height="34" rx="4" fill="#2b3050" />
          <rect x="20" y="-84" width="6" height="58" rx="3" fill="url(#swordGlow)" />
          <rect x="12" y="-30" width="22" height="8" rx="3" fill="#8a6d3b" />
          <circle cx="23" cy="-22" r="6" fill="#FCD34D" />
        </g>
      </g>

      {/* clash spark between them */}
      <g transform="translate(232,214)" opacity="0.9">
        <path
          d="M0,-14 L4,-2 L16,0 L4,2 L0,14 L-4,2 L-16,0 L-4,-2 Z"
          fill="#e6fbff"
        />
      </g>
    </svg>
  );
}
