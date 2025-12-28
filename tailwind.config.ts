import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          foreground: "#FFFFFF"
        },
        secondary: {
          DEFAULT: "#F59E0B",
          foreground: "#111827"
        }
      }
    }
  },
  plugins: []
};

export default config;
