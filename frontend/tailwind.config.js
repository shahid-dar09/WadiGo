/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Light Mode (Royal Indigo scheme)
          primary:    '#1E1B4B',   // Deep Indigo
          secondary:  '#7C3AED',   // Vibrant Violet
          accent:     '#EAB308',   // Gold / Amber
          success:    '#22C55E',
          background: '#F5F3FF',   // Soft lavender tint
          surface:    '#FFFFFF',
          // Dark Mode (Dark Rose scheme)
          darkBg:     '#0A0A0F',   // Near black
          darkSurface:'#16161F',   // Dark surface
          rose:       '#F43F5E',   // Vibrant Rose
          violet:     '#8B5CF6',   // Rich Violet
          teal:       '#22D3EE',   // Neon Teal
        },
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        glass:        '0 8px 32px 0 rgba(30, 27, 75, 0.08)',
        'glass-hover':'0 12px 40px 0 rgba(124, 58, 237, 0.18)',
        'glow-violet':'0 0 24px rgba(124, 58, 237, 0.4)',
        'glow-rose':  '0 0 24px rgba(244, 63, 94, 0.35)',
        'glow-teal':  '0 0 20px rgba(34, 211, 238, 0.3)',
        'card-dark':  '0 8px 32px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gradient-indigo': 'linear-gradient(135deg, #1E1B4B 0%, #4C1D95 50%, #7C3AED 100%)',
        'gradient-rose':   'linear-gradient(135deg, #F43F5E 0%, #A855F7 50%, #8B5CF6 100%)',
        'gradient-gold':   'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
        'mesh-light':      'radial-gradient(at 40% 20%, #ede9fe 0px, transparent 50%), radial-gradient(at 80% 0%, #f5f3ff 0px, transparent 50%), radial-gradient(at 0% 50%, #faf5ff 0px, transparent 50%)',
        'mesh-dark':       'radial-gradient(at 40% 20%, rgba(244,63,94,0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139,92,246,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(34,211,238,0.06) 0px, transparent 50%)',
      },
      animation: {
        'fade-up':       'fadeUp 0.6s ease-out forwards',
        'fade-in':       'fadeIn 0.5s ease-out forwards',
        'float':         'float 6s ease-in-out infinite',
        'pulse-glow':    'pulseGlow 2.5s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(124, 58, 237, 0.3)' },
          '50%':      { boxShadow: '0 0 35px rgba(124, 58, 237, 0.6)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
};
