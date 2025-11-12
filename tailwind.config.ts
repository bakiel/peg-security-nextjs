import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#E5D08A',
          DEFAULT: '#D0B96D',
          dark: '#B59F5A',
        },
        onyx: {
          DEFAULT: '#292B2B',
          light: '#3D3F3F',
        },
        offwhite: '#F8F9FA',
        grey: {
          medium: '#666666',
          light: '#999999',
        },
        accent: {
          green: '#2E5A3F',
          orange: '#D2691E',
          blue: '#4ECDC4',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'section-tag': '12px',
        'section-title': 'clamp(2rem, 5vw, 3.5rem)',
        'hero-title': 'clamp(2rem, 5vw, 3.5rem)',
      },
      letterSpacing: {
        tag: '3px',
        nav: '1px',
        hero: '-0.5px',
      },
      lineHeight: {
        body: '1.6',
        heading: '1.2',
        hero: '0.95',
      },
      maxWidth: {
        container: '1200px',
      },
      spacing: {
        'section': '80px',
        'hero-top': '120px',
        'hero-bottom': '40px',
      },
      boxShadow: {
        'sm': '0 2px 10px rgba(0,0,0,0.1)',
        'md': '0 10px 30px rgba(0,0,0,0.15)',
        'lg': '0 20px 60px rgba(0,0,0,0.2)',
        'glow': '0 0 30px rgba(208, 185, 109, 0.4)',
        'gold': '0 5px 15px rgba(208, 185, 109, 0.3)',
        'gold-hover': '0 8px 25px rgba(208, 185, 109, 0.4)',
      },
      borderRadius: {
        'card': '15px',
        'button': '30px',
      },
      backdropBlur: {
        'nav': '20px',
      },
      transitionTimingFunction: {
        'peg': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        glow: {
          '0%': {
            textShadow: '0 0 10px rgba(208, 185, 109, 0.5), 0 0 20px rgba(208, 185, 109, 0.4), 0 0 30px rgba(208, 185, 109, 0.3)',
          },
          '100%': {
            textShadow: '0 0 20px rgba(208, 185, 109, 0.6), 0 0 30px rgba(208, 185, 109, 0.5), 0 0 40px rgba(208, 185, 109, 0.4)',
          },
        },
        pulse: {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(208, 185, 109, 0.7)',
          },
          '70%': {
            boxShadow: '0 0 0 10px rgba(208, 185, 109, 0)',
          },
        },
        kenBurns: {
          '0%': {
            transform: 'scale(1) translate(0, 0)',
          },
          '100%': {
            transform: 'scale(1.15) translate(20px, -10px)',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse': 'pulse 2s infinite',
        'ken-burns': 'kenBurns 8s ease-in-out infinite alternate',
        'slide-in-left': 'slideInLeft 0.8s ease forwards',
        'slide-in-right': 'slideInRight 0.8s ease forwards',
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
      },
    },
  },
  plugins: [],
};
export default config;
