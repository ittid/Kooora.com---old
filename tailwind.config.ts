import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kooora: {
          gold: "#d4b544",
          goldDark: "#b89a2e",
          dark: "#272727",
          darkSoft: "#2a2a2a",
          page: "#eee",
          card: "#ffffff",
          border: "#d1d1d1",
          muted: "#6b6b6b",
          live: "#e11d48",
        },
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "Tahoma", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
