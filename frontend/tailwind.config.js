/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#667eea",
        secondary: "#764ba2",
        danger: "#e74c3c",
        success: "#27ae60",
        warning: "#f39c12",
        dark: "#2c3e50",
        light: "#ecf0f1",
      },
    },
  },
  plugins: [],
}