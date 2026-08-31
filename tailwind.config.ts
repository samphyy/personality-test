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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#1abc9c", // ysamphy signature teal
          600: "#16a085",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        ocean: {
          openness: "#8B5CF6", // Purple
          conscientiousness: "#0284C7", // Sky/Blue
          extraversion: "#F59E0B", // Amber
          agreeableness: "#1abc9c", // Teal/Emerald
          neuroticism: "#E11D48", // Rose
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-cal)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(26, 188, 156, 0.3)",
        'glow-lg': "0 0 45px -10px rgba(26, 188, 156, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
