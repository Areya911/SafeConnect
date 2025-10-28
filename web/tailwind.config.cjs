/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        coral: '#FF6B6B',
        accent: '#EC4899',
        navy: '#111827',
        bgsoft: '#F8FAFF',
        success: '#10B981'
      },
      borderRadius: { xl: '1rem' },
      boxShadow: { soft: '0 10px 30px rgba(2,6,23,0.06)' },
      spacing: { '128': '32rem' }
    }
  },
  plugins: []
};
