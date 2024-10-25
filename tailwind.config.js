/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        customColor: '#123456', // Add your custom color here
      },
    },
  },
  plugins: [],
};
