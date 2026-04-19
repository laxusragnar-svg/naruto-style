/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'shine': 'textShine 3s ease-in-out infinite alternate',
        'float': 'idleFloat 4s ease-in-out infinite',
      },
      keyframes: {
        textShine: {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' },
        },
        idleFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0.5deg)' },
          '50%': { transform: 'translateY(-20px) rotate(-0.5deg)' },
        }
      }
    },
  },
  plugins: [],
}