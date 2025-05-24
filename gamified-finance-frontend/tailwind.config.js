/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {colors: {
        'lime-brand': '#8BC34A', // or your exact green
      },},
  },
  plugins: [],
};
