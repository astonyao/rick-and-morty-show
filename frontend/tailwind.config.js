/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rick-green': '#97ce4c',
        'morty-yellow': '#f2d95c',
        'portal-blue': '#00b4d8',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}