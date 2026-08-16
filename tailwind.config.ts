import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        monsoon: {
          ink: "#0c0a09",
          slate: "#1e293b",
          fog: "#64748b",
          cream: "#f5e9d6",
          amber: "#d97706",
          brass: "#e0a13a",
          teal: "#0d9488",
          rain: "#38bdf8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-cinzel)", "serif"],
        devanagari: ["var(--font-rozha)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        steam: {
          "0%": { transform: "translateY(0) scaleX(1) scaleY(1)", opacity: "0" },
          "15%": { opacity: "0.6" },
          "50%": { transform: "translateY(-20px) scaleX(1.4) scaleY(1.2)", opacity: "0.4" },
          "100%": { transform: "translateY(-45px) scaleX(2) scaleY(1.5)", opacity: "0" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "41.99%": { opacity: "1" },
          "42%": { opacity: "0.7" },
          "43%": { opacity: "1" },
          "45%": { opacity: "0.3" },
          "46%": { opacity: "1" },
        },
        curtainSway: {
          "0%, 100%": { transform: "rotate(0deg) skewX(0deg)" },
          "50%": { transform: "rotate(1.5deg) skewX(-1.5deg)" },
        },
      },
      animation: {
        steam: "steam 3.5s ease-out infinite",
        "steam-delayed": "steam 3.5s 1.5s ease-out infinite",
        flicker: "flicker 6s infinite",
        sway: "curtainSway 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
