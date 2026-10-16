import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // BrandsWave palette: deep tide water, sea-glass and bone
        abyss: "#0A1424",
        tide: "#12233B",
        swell: "#1C3556",
        foam: "#EEF3F1",
        glass: "#86D9C6",
        sand: "#D8C7A5",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: { shimmer: "shimmer 1.6s infinite" },
    },
  },
  plugins: [],
};
export default config;
