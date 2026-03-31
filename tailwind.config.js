/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f4f8ef',
          100: '#e8f1dd',
          200: '#d2e2bd',
          300: '#b4cb93',
          400: '#95b26a',
          500: '#759946',
          600: '#5f7f35',
          700: '#4c662b',
          800: '#3f5427',
          900: '#344522',
          950: '#1b2614',
        },
        accent: {
          50: '#fff6ef',
          100: '#ffe9d7',
          200: '#ffd1ae',
          300: '#ffb17a',
          400: '#fb8d43',
          500: '#e6742d',
          600: '#c5581f',
          700: '#9f451b',
          800: '#7f391a',
          900: '#673118',
          950: '#37170a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.45s ease-out',
        'slide-up': 'slideUp 0.55s ease-out',
        'slide-down': 'slideDown 0.35s ease-out',
        'bounce-subtle': 'bounceSubtle 2.4s ease-in-out infinite',
        'pulse-slow': 'pulse 2.6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-hover': 'scaleHover 0.2s ease-out',
        'float-soft': 'floatSoft 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        scaleHover: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        floatSoft: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(117, 153, 70, 0.35)',
        'glow-yellow': '0 0 20px rgba(230, 116, 45, 0.35)',
        'card-hover': '0 26px 60px rgba(28, 33, 22, 0.12)',
        'button-hover': '0 12px 30px rgba(117, 153, 70, 0.35)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
};
