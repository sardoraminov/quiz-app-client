module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        green: "#9BC53D",
        blue: "#54C6EB",
        gray: "#D7D7D7",
        dark: "#202020",
        red: "#FF7272",
      },
      gridTemplateColumns: {
        auto: "repeat(auto-fit, minmax(220px, 1fr))",
      },
      gridTemplateRows: {
        auto: "repeat(auto-fill, minmax(200px, 1fr))",
      },
    },
  },
  plugins: [],
};
