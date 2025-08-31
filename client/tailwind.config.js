/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        facebook: {
          blue: "#1877f2",
          lightBlue: "#42a5f5",
          darkBlue: "#166fe5",
          gray: "#f0f2f5",
          darkGray: "#65676b",
          lightGray: "#e4e6ea",
          green: "#42b883",
          red: "#f56565",
        },
      },
    },
  },
  plugins: [],
}