/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        comic: {
          yellow: "#FFD60A",
          red: "#E63946",
          blue: "#1D3557",
          cyan: "#00B4D8",
          pink: "#FF6B9D",
          green: "#06D6A0",
          orange: "#FF6B35",
          dark: "#1A1A2E",
          cream: "#FFFDF7",
          purple: "#7B2FF7",
        },
        tanmayred: "#ea2e0e",
      },
      fontFamily: {
        comic: ['"Bangers"', "cursive"],
        body: ['"Comic Neue"', "cursive"],
      },
      animation: {
        "pop-in": "popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both",
        "slide-up": "slideUp 0.6s ease-out both",
        "slide-right": "slideRight 0.5s ease-out both",
        wiggle: "wiggle 0.5s ease-in-out",
        float: "float 3s ease-in-out infinite",
        "bounce-slow": "bounce 2s infinite",
        shake: "shake 0.5s ease-in-out",
        "fade-in": "fadeIn 0.8s ease-out both",
        "spin-slow": "spin 3s linear infinite",
        blob: "blob 7s infinite",
      },
      keyframes: {
        popIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-40px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
      boxShadow: {
        comic: "4px 4px 0px 0px #1A1A2E",
        "comic-lg": "6px 6px 0px 0px #1A1A2E",
        "comic-xl": "8px 8px 0px 0px #1A1A2E",
        "comic-yellow": "4px 4px 0px 0px #FFD60A",
        "comic-red": "4px 4px 0px 0px #E63946",
        "comic-cyan": "4px 4px 0px 0px #00B4D8",
        "neon-blue": "0 0 20px rgba(0, 180, 216, 0.4)",
        "neon-pink": "0 0 20px rgba(255, 107, 157, 0.4)",
      },
      borderWidth: {
        3: "3px",
      }
    },
  },
  plugins: [],
};
