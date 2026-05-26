import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "arena-bg": "#0b0b14",
        "arena-surface": "#12121f",
        "arena-border": "#1e1e35",
        "arena-muted": "#555570",
        "player-accent": "#a78bfa",
        "ai-accent": "#f87171",
        "neutral-glow": "#60a5fa",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
