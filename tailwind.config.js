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
        // Cores customizadas ADICIONAIS (não substituindo as padrão)
        'custom-blue': '#0047CC',
        'custom-blue-dark': '#003DA6',
        'custom-blue-light': '#EBF2FF',
        'custom-yellow': '#FFDE59',
        'custom-yellow-dark': '#FFD429',
        brand: {
          light: '#EAF4FF',
          yellow: '#FFFBEA',
          blue: '#0A2ADA',
          dark: '#031023'
        },
        text: {
          base: '#0F172A',
          light: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        syne: ['var(--font-syne)', 'sans-serif'],
      },
      boxShadow: {
        'inner-light': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'feature': '0 0 20px -5px rgba(0, 71, 204, 0.15)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
        'button': '0 4px 6px -1px rgba(0, 71, 204, 0.2), 0 2px 4px -1px rgba(0, 71, 204, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },
      screens: {
        '3xl': '1920px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-diagonal': 'linear-gradient(45deg, var(--tw-gradient-stops))',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'scale': 'scale 0.3s ease-out forwards',
        'ping': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scale: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [],
}

