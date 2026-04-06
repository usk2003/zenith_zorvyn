/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        income: '#22c55e', // Green
        expense: '#ef4444', // Red
        accent: '#10b981', // Emerald Green
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
