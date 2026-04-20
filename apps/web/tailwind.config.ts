import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          sidebar: "#09090b",
          "sidebar-hover": "#18181b",
          primary: "#4f46e5",
          "primary-light": "#6366f1",
          accent: "#f59e0b",
          bg: "#f8fafc",
          surface: "#ffffff",
          "text-primary": "#0f172a",
          "text-secondary": "#475569",
          border: "#e2e8f0",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
        },
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        sidebar: {
          DEFAULT: "#09090b",
          hover: "#18181b",
          active: "#27272a",
          border: "#27272a",
          text: "#a1a1aa",
          "text-active": "#ffffff",
        },
        accent: {
          DEFAULT: "#f59e0b",
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        success: {
          DEFAULT: "#10b981",
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        warning: {
          DEFAULT: "#f59e0b",
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        danger: {
          DEFAULT: "#ef4444",
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      spacing: {
        "18": "4.5rem",
        "68": "17rem",
        "72": "18rem",
        "84": "21rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.03)",
        "card-hover":
          "0 10px 25px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)",
        modal: "0 25px 50px -12px rgba(0,0,0,0.15)",
        glow: "0 0 20px rgba(79,70,229,0.25)",
        "glow-sm": "0 0 12px rgba(79,70,229,0.2)",
        "glow-accent": "0 0 20px rgba(245,158,11,0.3)",
        "inner-glow": "inset 0 0 20px rgba(79,70,229,0.05)",
        sidebar: "4px 0 24px rgba(0,0,0,0.1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-brand":
          "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)",
        "gradient-sidebar": "linear-gradient(180deg, #09090b 0%, #000000 100%)",
        "dot-grid":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23c7d2fe' fill-opacity='0.35'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        pulseOrange: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(249,115,22,0.5)" },
          "50%": { boxShadow: "0 0 0 6px rgba(249,115,22,0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        slideUp: "slideUp 0.4s ease-out",
        slideRight: "slideRight 0.3s ease-out",
        slideLeft: "slideLeft 0.3s ease-out",
        scaleIn: "scaleIn 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "pulse-orange": "pulseOrange 2s ease-in-out infinite",
        shake: "shake 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
