/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Pantone 14-1312 TCX Pale Blush
          DEFAULT: '#E4BFB3',
          dark: '#C9A091',
          light: '#F0D5CC',
          muted: '#F7EBE6',
          ink: '#5C4038',
        },
        harbor: {
          // Dark navy (pastel depth)
          DEFAULT: '#1A2744',
          soft: '#243552',
          mist: '#314563',
        },
        steel: {
          DEFAULT: '#6B7C93',
          muted: '#E8ECF1',
        },
        ink: {
          DEFAULT: '#1A2744',
          soft: '#2F3F5C',
          muted: '#7A8699',
        },
        surface: {
          // Soft sweet gray
          DEFAULT: '#F2F3F5',
          card: '#FFFFFF',
          dark: '#1A2744',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px rgba(26, 39, 68, 0.06)',
        lift: '0 12px 32px rgba(228, 191, 179, 0.45)',
      },
      backgroundImage: {
        'harbor-grid':
          'linear-gradient(rgba(26,39,68,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,39,68,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '28px 28px',
      },
    },
  },
  plugins: [],
}
