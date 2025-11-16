/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        bevietnam: ["Be Vietnam Pro", "sans-serif"],
      },
      colors: {
        "blue-primary": "#0795DF",
        "blue-secondary": "#00C0EF",
      }
    }
  },
  plugins: [],
};
