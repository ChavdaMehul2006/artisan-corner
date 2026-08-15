/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        artisan: {
          50: '#FDFBF7',
          100: '#F5F2EB',
          200: '#EAE4D6',
          300: '#D8CEB9',
          400: '#BDB094',
          500: '#A49574',
          600: '#877858',
          700: '#685C42',
          800: '#4A4130',
          900: '#2D281E',
        },
        terracotta: {
          50: '#FDF6F2',
          100: '#FBEDE6',
          200: '#F6D7C8',
          300: '#EEB79E',
          400: '#E38F6E',
          500: '#C85A32',
          600: '#B44722',
          700: '#963619',
          800: '#7B2C17',
          900: '#642617',
        },
        amberGold: {
          400: '#FBBF24',
          500: '#D97706',
          600: '#B45309',
        },
        forest: {
          500: '#2D5A43',
          600: '#244835',
          700: '#1B3728',
        },
        charcoal: {
          800: '#22201D',
          900: '#171513',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        '2xs': '0 1px 2px rgba(45, 40, 30, 0.04)',
        xs: '0 1px 3px rgba(45, 40, 30, 0.06)',
        artisan: '0 4px 20px -2px rgba(45, 40, 30, 0.07), 0 2px 6px -2px rgba(45, 40, 30, 0.04)',
        'artisan-hover': '0 14px 34px -4px rgba(45, 40, 30, 0.12), 0 6px 14px -2px rgba(45, 40, 30, 0.06)',
        'artisan-float': '0 24px 48px -12px rgba(45, 40, 30, 0.18)',
      }
    },
  },
  plugins: [],
}
