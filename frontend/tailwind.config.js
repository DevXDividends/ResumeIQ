/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6fe",
          200: "#bdd1fe",
          300: "#8fb2fc",
          400: "#5a8af8",
          500: "#3566f0",
          600: "#2547e4",
          700: "#2038c4",
          800: "#20329d",
          900: "#1e2f7c",
          950: "#161d4b",
        },
        accent: {
          400: "#34d9b8",
          500: "#14b8a0",
          600: "#0e9484",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(30, 47, 124, 0.25)",
        card: "0 4px 24px -4px rgba(20, 30, 80, 0.12)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
