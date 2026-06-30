import type { Config } from "tailwindcss";

/**
 * JXL-Visuals design system.
 * Dark editorial base. Photography carries the colour — the UI stays restrained.
 * Tune the whole brand from this one file.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/data/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        md: "2.5rem",
        lg: "4rem",
        xl: "5rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        // Theme-aware: values come from CSS variables (see globals.css).
        bg: {
          base: "rgb(var(--bg-base) / <alpha-value>)",
          raised: "rgb(var(--bg-raised) / <alpha-value>)",
          sunken: "rgb(var(--bg-sunken) / <alpha-value>)",
        },
        ink: {
          primary: "rgb(var(--ink-primary) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          faint: "rgb(var(--ink-faint) / <alpha-value>)",
        },
        line: {
          hairline: "rgb(var(--line) / 0.08)",
          strong: "rgb(var(--line) / 0.16)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          muted: "rgb(var(--accent-muted) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Fluid editorial scale
        eyebrow: ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.22em" }],
        display: [
          "clamp(3.5rem, 11vw, 8.5rem)",
          { lineHeight: "0.92", letterSpacing: "0.005em" },
        ],
        "display-sm": [
          "clamp(2.5rem, 7vw, 5rem)",
          { lineHeight: "0.95", letterSpacing: "0.01em" },
        ],
      },
      letterSpacing: {
        eyebrow: "0.22em",
        wide: "0.08em",
      },
      maxWidth: {
        measure: "68ch",
        "measure-sm": "54ch",
      },
      spacing: {
        section: "clamp(5rem, 12vw, 11rem)",
        "section-sm": "clamp(3.5rem, 8vw, 7rem)",
      },
      boxShadow: {
        // Theme-aware: resolved from CSS variables (see globals.css).
        book: "var(--shadow-book)",
        "book-hover": "var(--shadow-book-hover)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
