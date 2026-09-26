/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        retro: ['VT323', 'monospace'],
      },
      colors: {
        arcade: {
          bg: '#0f101d',
          panel: '#1b1d30',
          border: '#3c4266',
          green: '#2ecc71',
          gold: '#f1c40f',
          red: '#e74c3c',
          blue: '#3498db',
          cyan: '#00ffff',
          purple: '#9b59b6',
        }
      },
      boxShadow: {
        'pixel-sm': '2px 2px 0px #000',
        'pixel': '4px 4px 0px #000',
        'pixel-lg': '6px 6px 0px #000',
        'pixel-green': '4px 4px 0px #27ae60',
        'pixel-red': '4px 4px 0px #c0392b',
      }
    },
  },
  plugins: [],
}
