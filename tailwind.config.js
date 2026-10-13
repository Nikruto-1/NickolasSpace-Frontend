/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: Object.fromEntries(["ink", "ink2", "paper", "mist", "accent", "accent-hover", "muted-dark", "line", "control"].map((name) => [name, `rgb(var(--${name}-rgb) / <alpha-value>)`])),
    },
  },
  plugins: [],
};
