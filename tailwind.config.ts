import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: '#0B3C5D',
        burnt: '#A63D40',
        seafoam: '#5FA8A9',
        sand: '#D9C5A0',
        charcoal: '#1F2A36',
        'off-white': '#F8F7F5',
        'off-white-2': '#F2F1EF',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.18em',
        wider: '0.12em',
      },
    },
  },
  plugins: [],
}

export default config
