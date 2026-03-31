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
          50: '#eef9f1',
          100: '#d8f0de',
          200: '#b6e3c2',
          300: '#8fd3a3',
          400: '#62bd7f',
          500: '#3e9f5f',
          600: '#2f814d',
          700: '#28663f',
          800: '#245134',
          900: '#1f432d',
          950: '#0d2618',
        },
        accent: {
          50: '#f3fbf4',
          100: '#dff6e4',
          200: '#c2ebcb',
          300: '#95d8a6',
          400: '#63bc78',
          500: '#3d9d59',
          600: '#2f7f47',
          700: '#28643a',
          800: '#255032',
          900: '#21422b',
          950: '#0f2518',
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
        'ambient-shift': 'ambientShift 12s ease-in-out infinite',
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
        ambientShift: {
          '0%, 100%': { transform: 'translate3d(0px, 0px, 0px) scale(1)' },
          '50%': { transform: 'translate3d(10px, -6px, 0px) scale(1.05)' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(62, 159, 95, 0.35)',
        'glow-yellow': '0 0 20px rgba(143, 211, 163, 0.45)',
        'card-hover': '0 24px 54px rgba(16, 49, 31, 0.16)',
        'button-hover': '0 12px 28px rgba(62, 159, 95, 0.3)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
};
