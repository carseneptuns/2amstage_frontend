/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Apple (España) style-reference palette. Token NAMES kept the same
        // as before (void, surface, stage, dst) so every component that
        // already references them re-themes automatically — only the
        // underlying hex values changed.
        void: "#ffffff",       // was #0B0A10 — Apple "Paper", primary page canvas
        surface: "#f5f5f7",    // was #16141E — Apple "Canvas", alternating gray band
        surface2: "#f5f5f7",   // was #201D2B — card / input surfaces
        surface3: "#e8e8ed",   // was #2A2637 — hover wash / elevated surfaces
        stage: "#0071e3",      // was #FF2E63 — Apple "Electric Blue", primary CTA
        amber: "#b64400",      // was #FFC93C — Apple "Ember", badges/status accent
        violet: "#0066cc",     // was #8C6FFF — Apple "Link Blue", secondary accent
        hi: "#1d1d1f",         // was #F7F5FB — Apple "Primary Ink", primary text
        mid: "#707070",        // was #B4AFC7 — Apple "Mid Gray", secondary text
        dim: "#86868b",        // was #716C87 — muted/tertiary text
      },
      fontFamily: {
        // SF Pro Display/Text aren't web-licensable — Inter is Apple's own
        // documented substitute for both, so display & body now share it.
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      backgroundImage: {
        // Apple's system uses flat color, never decorative UI gradients —
        // neutralized rather than deleted so existing class usages don't break.
        spotlight: "radial-gradient(60% 60% at 50% 0%, rgba(0,0,0,0.03) 0%, rgba(255,255,255,0) 70%)",
        "stage-gradient": "linear-gradient(135deg, #0071e3 0%, #0071e3 100%)",
        "amber-gradient": "linear-gradient(135deg, #b64400 0%, #b64400 100%)",
      },
      boxShadow: {
        // "Don't use shadows or elevation" — Apple style guide. Kept as
        // no-ops so hover:shadow-glow etc. stop glowing without erroring.
        glow: "none",
        "glow-violet": "none",
        "glow-amber": "none",
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
