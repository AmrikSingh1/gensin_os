/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'cyber-black': '#0a0a0f',
        'cyber-dark': '#12141f',
        'cyber-blue': '#0ff4f4',
        'cyber-pink': '#ff2a6d',
        'cyber-purple': '#7d56f4',
        'cyber-yellow': '#f9f871',
        'cyber-red': '#ff3366',
      },
      fontFamily: {
        'cyber': ['Rajdhani', 'sans-serif'],
        'mono': ['Share Tech Mono', 'monospace'],
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(15, 244, 244, 0.15), 0 0 3px rgba(15, 244, 244, 0.3)',
        'neon-pink': '0 0 15px rgba(255, 42, 109, 0.15), 0 0 3px rgba(255, 42, 109, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
        'scan-line': 'scan-line 8s linear infinite',
        'glitch': 'glitch 0.5s infinite',
      },
    },
  },
  plugins: [],
} 