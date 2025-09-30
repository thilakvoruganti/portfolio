// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",             // if using Vite
    "./src/**/*.{js,ts,jsx,tsx}" // scan all React component files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
