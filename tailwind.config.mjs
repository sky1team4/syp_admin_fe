/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Added to include all relevant component files
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {},
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        }
      },
      animation: {
        'pulse-slow': 'pulse-slow 8s ease-in-out infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};