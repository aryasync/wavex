/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'kodchasan': ['Kodchasan', 'sans-serif'],
        'sans': ['Kodchasan', 'sans-serif'], // Make Kodchasan the default sans font
      },
    },
  },
  plugins: [],
}
