/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}", // Added pages directory
  ],
  theme: {
    extend: {
      colors: {
        brand: '#2563eb',
        'brand-dark': '#1e40af',
      },
      boxShadow: {
        card: '0 10px 25px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};