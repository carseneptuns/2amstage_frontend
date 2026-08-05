/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0B0A10",
        surface: "#16141E",
        surface2: "#201D2B",
        surface3: "#2A2637",
        stage: "#FF2E63",
        amber: "#FFC93C",
        violet: "#8C6FFF",
        hi: "#F7F5FB",
        mid: "#B4AFC7",
        dim: "#716C87",
      },
      fontFamily: {
        display: ["Anton", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      backgroundImage: {
        spotlight:
          "radial-gradient(60% 60% at 50% 0%, rgba(255,46,99,0.18) 0%, rgba(11,10,16,0) 70%)",
        "stage-gradient": "linear-gradient(135deg, #FF2E63 0%, #8C6FFF 100%)",
        "amber-gradient": "linear-gradient(135deg, #FFC93C 0%, #FF2E63 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(255,46,99,0.35)",
        "glow-violet": "0 0 40px rgba(140,111,255,0.35)",
        "glow-amber": "0 0 30px rgba(255,201,60,0.3)",
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
