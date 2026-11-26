import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1c1410",
        bark: "#2a211c",
        wood: "#6b3e26",
        brass: "#a68449",
        cream: "#f4efe6",
        paper: "#faf7f2",
        moss: "#3f5344",
        line: "#e4d9c8",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 40px -28px rgba(42, 33, 28, 0.55)",
      },
    },
  },
  plugins: [],
};

export default config;
