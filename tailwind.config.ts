import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617', // slate-950
        surface: '#0f172a', // slate-900
        primary: {
          DEFAULT: '#34d399', // emerald-400
          400: '#34d399'
        },
        secondary: {
          DEFAULT: '#a78bfa', // violet-400
          400: '#a78bfa'
        }
      },
      boxShadow: {
        neon: '0 0 10px rgba(52, 211, 153, 0.5)',
        violet: '0 0 12px rgba(167, 139, 250, 0.45)'
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(52, 211, 153, 0)' },
          '50%': { boxShadow: '0 0 20px rgba(52, 211, 153, 0.6)' }
        }
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite'
      }
    }
  },
  plugins: []
}

export default config
