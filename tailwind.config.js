/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm off-white page background + soft sections
        cream: { DEFAULT: '#FAF5EC', dark: '#F3E9D6' },
        // Sand / beige — flat panels and PhotoSlot surfaces
        sand: { light: '#F6EEDE', DEFAULT: '#EFE3CD', dark: '#E3D3B4' },
        // Espresso — dark bands, footer, deep text
        espresso: {
          DEFAULT: '#2B1C10',
          950: '#150C05',
          900: '#1E130A',
          800: '#2B1C10',
          700: '#3C2917',
          600: '#523B23',
        },
        // Walnut — brown headings / hover states on espresso
        walnut: { DEFAULT: '#5B3E24', light: '#7C5734' },
        // Gold / caramel — rationed accent: index numbers, hovers, small marks
        gold: {
          DEFAULT: '#B4813A',
          bright: '#CAA15C',
          deep: '#9A6828',
          dark: '#835820',
          50: '#F6E9CF',
        },
        // Muted warm grey-brown — captions and labels (AA on cream)
        taupe: { DEFAULT: '#6E5E4A', light: '#8C7B65' },
        // Primary body text
        ink: '#2E2016',
        line: { DEFAULT: '#E7D9C1', dark: 'rgba(250,245,236,0.12)' },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Space Grotesk Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: { container: '1280px' },
      letterSpacing: { tightish: '-0.01em' },
    },
  },
  plugins: [],
}
