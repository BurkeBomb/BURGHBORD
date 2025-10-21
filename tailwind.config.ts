
import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#1b1b1d',
        metallicPurple: '#7b2cbf',
        complianceGold: '#d4af37',
      },
    },
  },
  plugins: [],
} satisfies Config
