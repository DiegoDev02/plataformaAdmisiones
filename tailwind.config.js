/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#581C87',
          light: '#8B5CF6',
          dark: '#4C1D95'
        },
        accent: {
          DEFAULT: '#4338CA',
          light: '#6366F1'
        }
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      },
      animation: {
        gradient: 'gradient 3s ease infinite'
      }
    }
  },
  plugins: [],
};