/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9B6B9E",
        secondary: "#D4A5D4",
        accent: "#FF6B9D",
        surface: "#FFFFFF",
        background: "#FAF8FC",
        success: "#7BC67E",
        warning: "#FFB366",
        error: "#FF6B6B",
        info: "#6B9BFF",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};