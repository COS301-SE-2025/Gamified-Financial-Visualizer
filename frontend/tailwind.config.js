/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'lime-brand': '#8BC34A',
      },
      keyframes: {
        'pacman-top': {
          '0%, 100%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '50%': { transform: 'translate(-50%, -50%) rotate(-30deg)' },
        },
        'pacman-bottom': {
          '0%, 100%': { transform: 'translate(-50%, 50%) rotate(0deg)' },
          '50%': { transform: 'translate(-50%, 50%) rotate(30deg)' },
        },
        'coin-move1': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-24px)' },
        },
        'coin-scale': {
          '0%': { transform: 'scale(1)' },
          '5%, 100%': { transform: 'scale(0)' },
        },
      },
      animation: {
        'pacman-top': 'pacman-top 0.5s linear infinite',
        'pacman-bottom': 'pacman-bottom 0.5s linear infinite',
        'coin-move1': 'coin-move1 0.5s infinite',
        'coin-scale': 'coin-scale 0.5s infinite',
      },
    },
  },
  plugins: [],
};
