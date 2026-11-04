import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0B",
        panel: "#141414",
        paper: "#F4F3EF",
        line: { DEFAULT: "#E4E2DC", dark: "#2A2A2A", strong: "#3A3A3A" },
        mute: "#918E87",
        soft: "#A3A099",
        body: "#4A4843",
        red: { DEFAULT: "#E31E24", deep: "#B5161B", hot: "#F0383E" },
        green: { DEFAULT: "#1E9A4B" },
      },
      fontFamily: {
        sans: ["var(--font-inter-tight)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out": "cubic-bezier(0.77, 0, 0.175, 1)",
      },
      letterSpacing: { label: "0.08em" },
    },
  },
  plugins: [],
} satisfies Config;
