/** @type {import('tailwindcss').Config} */

// Turns a CSS variable (stored as an "R G B" triplet, e.g. "255 255 255")
// into a Tailwind color that still supports opacity modifiers like
// bg-void/50. This is what lets every token below flip instantly when the
// `dark` class toggles on <html>, without touching component files.
function withOpacity(variable) {
  return ({ opacityValue }) =>
    opacityValue !== undefined
      ? `rgb(var(${variable}) / ${opacityValue})`
      : `rgb(var(${variable}))`;
}

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light = Apple (España) style reference, Dark = Linear style reference.
        // Actual values live in src/index.css as CSS variables (:root vs .dark).
        void: withOpacity("--c-void"),
        surface: withOpacity("--c-surface"),
        surface2: withOpacity("--c-surface2"),
        surface3: withOpacity("--c-surface3"),
        stage: withOpacity("--c-stage"),
        amber: withOpacity("--c-amber"),
        violet: withOpacity("--c-violet"),
        hi: withOpacity("--c-hi"),
        mid: withOpacity("--c-mid"),
        dim: withOpacity("--c-dim"),
        hairline: withOpacity("--c-hairline"),
        "on-stage": withOpacity("--c-on-stage"), // text color that sits ON TOP of the stage/CTA fill
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      backgroundImage: {
        spotlight: "radial-gradient(60% 60% at 50% 0%, rgb(var(--c-hairline) / 0.04) 0%, rgb(var(--c-void) / 0) 70%)",
        "stage-gradient": "linear-gradient(135deg, rgb(var(--c-stage)) 0%, rgb(var(--c-stage)) 100%)",
        "amber-gradient": "linear-gradient(135deg, rgb(var(--c-amber)) 0%, rgb(var(--c-amber)) 100%)",
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        "glow-violet": "var(--shadow-glow)",
        "glow-amber": "var(--shadow-glow)",
      },
      keyframes: {
        pulseGlow: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.5 } },
        floatSlow: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        scan: "scan 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
