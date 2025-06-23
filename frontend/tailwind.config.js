/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        "background":                 "#0A0A0A",
        "background-2":             "#121212",
        "border-gray":              "#262626",
        "grad-purp-start":          "#7C82FF",
        "grad-purp-end":            "#C355F5",
        "grad-purp-start-hover":    "rgba(124, 130, 255, 0.2)",
        "grad-purp-end-hover":      "rgba(195, 85, 245, 0.2)",
        "grad-blue-start":          "#0098FF",
        "grad-blue-end":            "#00C5DC",
        "grad-blue-start-hover":    "rgba(0, 152, 255, 0.2)",
        "grad-blue-end-hover":      "rgba(0, 197, 220, 0.2)",
      },
    },
  },
  plugins: [],
};