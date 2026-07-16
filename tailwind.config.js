/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1f9b8a',
          dark: '#178074',
          light: '#2cb5a3',
          muted: '#e6f6f3',
        },
        ink: {
          DEFAULT: '#1a1d23',
          soft: '#2a2f38',
          muted: '#6b7280',
        },
        surface: {
          DEFAULT: '#f3f4f6',
          card: '#ffffff',
          dark: '#1e2229',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)',
      },
    },
  },
  plugins: [],
}
