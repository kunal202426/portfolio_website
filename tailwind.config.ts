import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0E27',
          secondary: '#111827',
          card: '#1F2937',
          glass: 'rgba(255, 255, 255, 0.05)',
        },
        accent: {
          primary: '#6366F1',
          glow: '#818CF8',
          gold: '#F59E0B',
          cyan: '#06B6D4',
          rose: '#EC4899',
        },
        text: {
          primary: '#F9FAFB',
          secondary: '#D1D5DB',
          tertiary: '#9CA3AF',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.1)',
          glow: 'rgba(99, 102, 241, 0.5)',
        },
      },
      fontFamily: {
        display: ['"Clash Display"', '"Syne"', 'sans-serif'],
        sans: ['"DM Sans"', '"Satoshi"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        accent: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee 30s linear infinite reverse',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108,99,255,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(108,99,255,0.7)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      lineClamp: {
        7: '7',
        8: '8',
        9: '9',
        10: '10',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config
