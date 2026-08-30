/** @type {import('tailwindcss').Config} */
export default {
  // Without this, a :hover style also fires on a phone tap and then sticks
  // until the visitor taps elsewhere, which reads as a stuck button.
  future: { hoverOnlyWhenSupported: true },
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm greige linen ground, Aveon direction (2026-08-22): deeper than the
        // old near-white cream so photography and espresso bands carry the page.
        cream: { DEFAULT: '#E9E1D3', dark: '#DFD5C3' },
        // The lightest surface, used for admin cards and form controls.
        paper: '#F4EEE4',
        // Sand / beige: flat panels, hover rows, PhotoSlot captions
        sand: { light: '#E0D6C5', DEFAULT: '#D3C6B0', dark: '#BFAE92' },
        // Espresso: dark bands, footer, deep text
        espresso: {
          DEFAULT: '#272019',
          950: '#100D09',
          900: '#1A1510',
          800: '#272019',
          700: '#3B3226',
          600: '#524634',
        },
        // Walnut: brown headings / hover states on espresso
        walnut: { DEFAULT: '#5C4A31', light: '#7D6446' },
        // Gold / brass: rationed accent. Warmer and a shade cleaner than before,
        // so a single gold mark carries the page instead of blending into sand.
        // Lifted 25.08 to clear WCAG on the two places gold carries text:
        // espresso on a gold pill was 4.38:1 and gold-deep on cream 4.30:1,
        // both just under the 4.5 threshold. Now 5.56:1 and 5.22:1.
        gold: {
          DEFAULT: '#C08E5C',
          bright: '#D6A56E',
          deep: '#7A5329',
          dark: '#6F4C28',
          50: '#EFE3D0',
        },
        // Muted warm grey-brown: captions and labels (AA on cream)
        taupe: { DEFAULT: '#6E6150', light: '#8E8069' },
        // Primary body text
        ink: '#221C15',
        line: { DEFAULT: '#D2C6B2', dark: 'rgba(233,225,211,0.13)' },
        // State colours for the admin, tuned warm so they sit beside the brand
        positive: '#356B4C',
        danger: '#9C3B2E',
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
        sans: ['"Space Grotesk Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: { container: '1280px' },
      letterSpacing: { tightish: '-0.01em' },
    },
  },
  plugins: [],
}
