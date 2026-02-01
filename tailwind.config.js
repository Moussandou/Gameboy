export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gb-screen': '#9bbc0f',
        'gb-screen-dark': '#8bac0f',
        'gb-screen-light': '#306230',
        'gb-screen-darkest': '#0f380f',
      },
      fontFamily: {
        'jersey': ['"Jersey 10"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
