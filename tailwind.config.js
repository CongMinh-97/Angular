/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  // Ant Design ships its own reset; Tailwind's preflight would fight it.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        ink: { 950: 'var(--ink-950)', 900: 'var(--ink-900)', 800: 'var(--ink-800)', 700: 'var(--ink-700)', 500: 'var(--ink-500)' },
        jade: { 50: 'var(--jade-50)', 100: 'var(--jade-100)', 300: 'var(--jade-300)', 500: 'var(--jade-500)', 600: 'var(--jade-600)', 700: 'var(--jade-700)' },
        coral: { 100: 'var(--coral-100)', 500: 'var(--coral-500)', 600: 'var(--coral-600)' },
        violet: { 100: 'var(--violet-100)', 500: 'var(--violet-500)' },
        amber: { 100: 'var(--amber-100)', 500: 'var(--amber-500)' },
        surface: 'var(--surface)',
        canvas: 'var(--bg)',
        line: 'var(--border)',
        fg: { DEFAULT: 'var(--text)', 2: 'var(--text-2)', 3: 'var(--text-3)' },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: { card: 'var(--radius-lg)' },
      boxShadow: { card: 'var(--shadow-xs)', pop: 'var(--shadow-md)' },
    },
  },
  plugins: [],
};
