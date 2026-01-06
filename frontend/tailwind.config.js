/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00D4AA',
          50: '#E6FFF9',
          100: '#B3FFE8',
          200: '#80FFD6',
          300: '#4DFFC5',
          400: '#1AFFB3',
          500: '#00D4AA',
          600: '#00A888',
          700: '#007C66',
          800: '#005044',
          900: '#002422',
        },
        accent: {
          DEFAULT: '#8B5CF6',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        dark: {
          DEFAULT: '#0A0A0F',
          50: '#1E1E28',
          100: '#18181F',
          200: '#141419',
          300: '#101014',
          400: '#0C0C10',
          500: '#0A0A0F',
          600: '#08080C',
          700: '#060609',
          800: '#040406',
          900: '#020203',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        ibm: ['IBM Plex Sans Arabic', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 212, 170, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};
