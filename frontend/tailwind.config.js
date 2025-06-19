/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        background:                 "#0A0A0A",
        "grad-purp-start":          "#7C82FF",
        "grad-purp-end":            "#C355F5",
      },
    },
  },
  plugins: [],
};