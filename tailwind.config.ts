import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx,json}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#f5f0ff",
          100: "#ede4ff",
          200: "#d7c2ff",
          300: "#bf99ff",
          400: "#a373ff",
          500: "#854cff",
          600: "#6b32e6",
          700: "#5326b3",
          800: "#3c1b80",
          900: "#27124d"
        },
        surface: {
          900: "#0b0d17",
          800: "#0f1424",
          700: "#141a2f",
          600: "#1b2338",
          500: "#222c45"
        }
      },
      boxShadow: {
        glass: "0 10px 40px rgba(0,0,0,0.35)",
        card: "0 8px 24px rgba(0,0,0,0.28)"
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(133, 76, 255, 0.25), transparent 25%), radial-gradient(circle at 80% 0%, rgba(0, 255, 255, 0.18), transparent 22%), radial-gradient(circle at 50% 80%, rgba(255, 122, 122, 0.2), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;
