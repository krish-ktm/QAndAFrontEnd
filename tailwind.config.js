/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      utilities: {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.perspective-1000': {
          perspective: '1000px'
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden'
        },
        '.animate-in': {
          animation: 'animateIn 0.3s ease-out'
        },
        '.slide-in-from-top-2': {
          'animation-name': 'slideInFromTop2'
        }
      },
      keyframes: {
        animateIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        slideInFromTop2: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-8px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        'animate-in': 'animateIn 0.3s ease-out',
        'slide-in-from-top-2': 'slideInFromTop2 0.3s ease-out'
      }
    },
  },
  plugins: [],
};
