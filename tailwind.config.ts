import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        accent: '#C8102E',
        textPrimary: '#ffffff',
        textMuted: '#d1d5db'
      },
      boxShadow: {
        glow: '0 0 20px rgba(200,16,46,0.35)'
      }
    }
  },
  plugins: []
};

export default config;
