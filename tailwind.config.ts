import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          iris:      '#6B5BA8',
          indigo:    '#3B4FB0',
          lilac:     '#9D7EC8',
          coral:     '#E89B7C',
          amber:     '#E8B86F',
          rose:      '#D86E78',
          cream:     '#FBE7D0',
          night:     '#0E0A1C',
          parchment: '#FBF7EE',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        mono:  ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        widest: '0.4em',
        wider:  '0.25em',
        wide:   '0.18em',
      },
    },
  },
  plugins: [],
}

export default config
