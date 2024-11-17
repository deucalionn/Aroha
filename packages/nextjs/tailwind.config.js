/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']", "class"],
  theme: {
  	extend: {
  		boxShadow: {
  			center: '0 0 12px -2px rgb(0 0 0 / 0.05)'
  		},
  		colors: {
  			wheat: 'rgb(241, 192, 134)',
  			'color-1': 'hsl(var(--color-1))',
  			'color-2': 'hsl(var(--color-2))',
  			'color-3': 'hsl(var(--color-3))',
  			'color-4': 'hsl(var(--color-4))',
  			'color-5': 'hsl(var(--color-5))'
  		},
  		animation: {
  			'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			rainbow: 'rainbow var(--speed, 2s) infinite linear'
  		},
  		fontFamily: {
  			lexend: ['Lexend"', "sans-serif"]
  		},
  		keyframes: {
  			rainbow: {
  				'0%': {
  					'background-position': '0%'
  				},
  				'100%': {
  					'background-position': '200%'
  				}
  			}
  		}
  	}
  },
};
