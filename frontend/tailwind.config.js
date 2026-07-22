/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        surface: '#15151d',
        surfaceAlt: '#1c1c26',
        border: '#2a2a35',
        text: '#f2f2f5',
        muted: '#9096a3',
        accent: '#6366f1',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      borderRadius: {
        xl: '0.75rem'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
