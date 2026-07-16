/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FF4D2E',
          dark: '#E03A1C',
          light: '#FF7A63',
          muted: '#FFE8E3',
        },
        harbor: {
          DEFAULT: '#0A1628',
          soft: '#132337',
          mist: '#1C334F',
        },
        steel: {
          DEFAULT: '#1B6EF3',
          muted: '#E8F0FE',
        },
        ink: {
          DEFAULT: '#0A1628',
          soft: '#243447',
          muted: '#5A6B7D',
        },
        surface: {
          DEFAULT: '#E8EEF5',
          card: '#FFFFFF',
          dark: '#0A1628',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px rgba(10, 22, 40, 0.06)',
        lift: '0 12px 32px rgba(255, 77, 46, 0.18)',
      },
      backgroundImage: {
        'harbor-grid':
          'linear-gradient(rgba(10,22,40,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,22,40,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '28px 28px',
      },
    },
  },
  plugins: [],
}
