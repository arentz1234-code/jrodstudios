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
        // Light cream background (matching logo)
        cream: {
          DEFAULT: "#f2f0eb",
          light: "#f8f7f4",
          dark: "#e8e6e1",
        },
        // Dark forest green (matching logo)
        forest: {
          DEFAULT: "#2d5a47",
          light: "#3d7a5f",
          dark: "#1e3d30",
        },
        // Sage green accent
        sage: {
          light: "#8faa9d",
          DEFAULT: "#6b8f7a",
          dark: "#4a6b56",
        },
        // Dark sections
        charcoal: {
          DEFAULT: "#1e3d30",
          light: "#2d5a47",
          dark: "#152a22",
        },
        // Tan/beige accents
        tan: {
          light: "#d6ccc2",
          DEFAULT: "#c4b5a5",
          dark: "#a89f91",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "forest-glow": "linear-gradient(135deg, rgba(45,90,71,0.08) 0%, rgba(107,143,122,0.04) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "fade-in-down": "fadeInDown 0.6s ease-out forwards",
        "slide-in-left": "slideInLeft 0.8s ease-out forwards",
        "slide-in-right": "slideInRight 0.8s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
