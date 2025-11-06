/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./refactor/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main brand colors
        primary: {
          DEFAULT: '#123FA0',
          hover: '#000C52',
          soft: '#EEF7FF',
        },
        secondary: {
          DEFAULT: '#EEF7FF',
          hover: '#D1E5F7',
        },
        tertiary: {
          DEFAULT: '#18B430',
          hover: '#029117',
        },
        quaternary: {
          DEFAULT: '#F2F7FD',
        },
        
        // Text colors
        text: {
          title: '#292929',
          'title-mobile': '#212121',
          desc: '#67686D',
          list: '#AAAAAD',
          menu: '#AAAAAD',
          search: '#AAAAAD',
          input: '#292929',
          dropdown: '#AAAAAD',
          'user-photo': '#FFFFFF',
        },
        
        // Background colors
        background: {
          main: '#F2F7FD',
          card: '#FFFFFF',
          grey: '#ECECEC',
          'transparent-grey': '#ECECEC',
          disabled: '#B7B7B7',
          'link-element': '#E0EEFF',
          linear1: '#0062E6',
          linear2: '#1340A0',
        },
        
        // Border colors
        border: {
          divider: '#D1E1F4',
          secondary: '#123FA0',
          'input-form': '#DCE0EA',
          'input-error': '#C2272E',
          'show-team': '#123FA0',
        },
        
        // Alert colors
        alert: {
          'red-light': '#FFEEEE',
          'red-dark': '#C2272E',
          'red-hover': '#AA141A',
          expiring: '#C2272E',
        },
        
        // Status colors
        status: {
          'days-left-low': '#C2272E',
          'days-left-high': '#FEB50D',
          'check-icon': '#27CA40',
          'progress-complete': '#27CA40',
          'progress-green': '#19C433',
          'not-confirmed': '#F6AD42',
          overdue: '#C2272E',
        },
        
        // Specific feature colors
        icon: {
          general: '#292929',
          'general-bg': '#ECECEC',
          check: '#27CA40',
          'check-bg': '#18B430',
          'camera-profile': '#123FA0',
          close: '#ECECEC',
        },
        
        // Badges & Labels
        badge: {
          new: '#123FA0',
          'days-left': '#C2272E',
          'head-100': '#E8FBEC',
          'head-not-100': '#FCEEEE',
        },
        
        // Links
        link: {
          DEFAULT: '#0563C1',
          hover: '#0000EE',
          email: '#123FA0',
        },
        
        // Progress bars
        progress: {
          bar: '#123FA0',
          line: '#123FA0',
          circle: '#123FA0',
          green: '#19C433',
          'team-monitoring': '#19C433',
        },
        
        // Special colors
        special: {
          'yellow-star': '#FFC401',
          'white-soft': '#E8FBEC',
          'white-cream': '#FCEEEE',
          'white-more': '#E5E5E6',
          'orange-light': '#F6AD42',
          'warning-orange': '#FEB50D',
          grey: '#DCE5EB',
          'grey-form': '#DCE0EA',
          'nav-swiper': '#ECECEC',
        },
        
        // Table colors
        table: {
          'column-title': '#E7ECEF',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': '10px',
        'sm': '12px',
        'base': '14px',
        'lg': '16px',
        'xl': '18px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'modal': '0 4px 16px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
  // Important for Ant Design compatibility
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts with Ant Design
  },
}
