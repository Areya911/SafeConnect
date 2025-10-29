const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        bgsoft: '#f3f6fb',
        primary: colors.indigo,
      },
    },
  },
  plugins: [],
};
