import plugin from 'tailwindcss/plugin';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          50: 'oklch(0.93 0.01 270)',
          100: 'oklch(0.82 0.015 270)',
          200: 'oklch(0.62 0.02 270)',
          300: 'oklch(0.36 0.015 270)',
          400: 'oklch(0.18 0.01 270)',
          500: 'oklch(0.09 0.008 270)',
          600: 'oklch(0.055 0.008 270)',
          700: 'oklch(0.035 0.006 270)',
          800: 'oklch(0.02 0.004 270)',
          900: 'oklch(0.01 0.003 270)',
        },
        ember: {
          50: 'oklch(0.98 0.08 60)',
          100: 'oklch(0.92 0.14 50)',
          200: 'oklch(0.85 0.18 45)',
          300: 'oklch(0.72 0.16 45)',
          400: 'oklch(0.60 0.14 40)',
          500: 'oklch(0.45 0.12 38)',
          600: 'oklch(0.30 0.10 35)',
        },
        depth: {
          50: 'oklch(0.95 0.06 240)',
          300: 'oklch(0.70 0.10 235)',
          500: 'oklch(0.62 0.10 235)',
          700: 'oklch(0.40 0.08 235)',
        },
        ink: 'oklch(0.20 0.005 270)',
        ash: 'oklch(0.13 0.01 270)',
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        body: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['clamp(2.5rem, 7vw, 7.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-xl': ['clamp(2rem, 5vw, 4.5rem)', { lineHeight: '1.0', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(1.5rem, 3.5vw, 2.75rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        'prose': '65ch',
      },
      animation: {
        'drift': 'drift 18s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 6s ease-in-out infinite',
        'breathe': 'breathe 8s ease-in-out infinite',
        'lightSweep': 'lightSweep 3s ease-in-out',
        'nameReveal': 'nameReveal 1.2s ease-out',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-1.5%,0)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.85' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        lightSweep: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '50%': { opacity: '0.6', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-100%)' },
        },
        nameReveal: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      // `@custom-variant`-free: allow stateful variants via data attributes
      addVariant('peer-checked', '[data-state="checked"] &');
      addVariant('group-aria', '[aria-expanded="true"] &');
    }),
  ],
};