/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: '#87A987',
        mint: '#A1E2C1',
        accent: '#FCD34D'
      }
    },
  },
  plugins: [],
}
