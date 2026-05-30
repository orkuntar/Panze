export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Plus Jakarta Sans', 'DM Sans', 'Inter', 'system-ui', 'sans-serif']
    },
    extend: {
      colors: {
        'gradient-from': '#F2C6A0',
        'gradient-mid': '#E9DCD2',
        'gradient-to': '#9DB0C7',
        'panel': '#F4F5F7',
        'card': '#FFFFFF',
        'ink': '#1A1C22',
        'muted': '#8A8F98',
        'line': '#ECEDEF',
        'accent-orange': '#F8852C',
        'accent-blue': '#2F8BFB',
        'neutral-200': '#E6E8EB',
        'task-peach': '#FCE9DB',
        'task-blue': '#E9F1FD',
        'brand-red': '#E23B2E',
        'purple': '#7C4DFF',
        'dot-red': '#FF4D4F'
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
      }
    }
  },
  plugins: []
};
