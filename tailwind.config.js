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
        background: '#E8D5BB',
        paper: '#F5EBD9',
        sidebar: '#F9F2E7',
        text: '#2D1F13',
        mutedText: '#6B5940',
        border: '#D4C4A8',
        accent: '#EC5A3C',
        accentHover: '#D74B2E',
        campfire: '#EC5A3C',
        wood: '#8B6F47',
        cardBg: '#FEFAF5',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        button: '8px',
      },
      boxShadow: {
        card: '0 4px 12px rgba(45, 31, 19, 0.08), 0 2px 4px rgba(45, 31, 19, 0.04)',
        button: '0 2px 8px rgba(236, 90, 60, 0.2)',
      },
    },
  },
  plugins: [],
}
