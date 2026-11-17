/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B1E36',
          dark: '#0F294A',
          blue: '#1E40AF',
          primary: '#2563EB',
          light: '#3B82F6',
          sky: '#60A5FA',
          ice: '#EFF6FF',
          accent: '#0D9488',
          emerald: '#10B981',
          teal: '#14B8A6',
          amber: '#F59E0B',
          rose: '#EF4444',
          slate: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

