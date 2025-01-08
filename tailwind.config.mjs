/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "slide-in": "slideIn 1min ease-in-out forwards", // Custom animation using the extended 1min duration
      },
      transitionDuration: {
        "1min": "120000ms", // Add a custom duration of 1 minute
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(100%)", opacity: "0" }, // Start off-screen to the right
          "100%": { transform: "translateX(0)", opacity: "1" },  // End at its original position
        },
      },
    },
  },
  plugins: [],
};
