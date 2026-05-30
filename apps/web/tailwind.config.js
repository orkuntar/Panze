export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    fontFamily: {
      sans: ['Plus Jakarta Sans', 'DM Sans', 'Inter', 'system-ui', 'sans-serif']
    },
    extend: {
      colors: {
        'gradient-from': 'var(--gradient-from)',
        'gradient-mid': 'var(--gradient-mid)',
        'gradient-to': 'var(--gradient-to)',
        'panel': 'var(--panel)',
        'card': 'var(--card)',
        'ink': 'var(--ink)',
        'muted': 'var(--muted)',
        'line': 'var(--line)',
        'accent-orange': 'var(--accent-orange)',
        'accent-blue': 'var(--accent-blue)',
        'neutral-200': 'var(--neutral-200)',
        'task-peach': 'var(--task-peach)',
        'task-blue': 'var(--task-blue)',
        'brand-red': '#E23B2E',
        'purple': '#7C4DFF',
        'dot-red': '#FF4D4F',

        /* Monday board replica tokens */
        'md-green': '#00C875',
        'md-orange': '#FDAB3D',
        'md-red': '#E2445C',
        'md-gray': '#C4C4C4',
        'prio-low': '#579BFC',
        'prio-mid': '#5559DF',
        'prio-high': '#401694',
        'md-primary': '#0073EA',
        'md-ink': '#323338',
        'md-muted': '#676879',
        'md-line': '#E6E9EF',
        'md-hover': '#F5F6F8',
        'md-sel': '#D7E9FF',
        'group-teal': '#00C9C9',
        'group-green': '#00C875',
        'md-sidebar': '#F6F7FB'
      },
      borderRadius: {
        'none': '0',
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '40px',
        'full': '9999px'
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.05)'
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'pop': {
          '0%': { transform: 'scale(0.92)' },
          '60%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease both',
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scale-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-right': 'slide-in-right 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pop': 'pop 0.3s ease both'
      }
    }
  },
  plugins: []
};
