/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      boxShadow: {
        glow: "0 16px 60px rgba(143, 100, 204, 0.16)",
        soft: "0 16px 50px rgba(117, 89, 150, 0.12)",
      },
    },
  },
  plugins: [],
};