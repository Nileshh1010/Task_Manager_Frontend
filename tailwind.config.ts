import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(221.2 83.2% 53.3%)',  // Changed to blue
					foreground: 'hsl(210 40% 98%)'
				},
				secondary: {
					DEFAULT: 'hsl(217.2 32.6% 17.5%)',
					foreground: 'hsl(210 40% 98%)'
				},
				destructive: {
					DEFAULT: 'hsl(0 62.8% 30.6%)',
					foreground: 'hsl(210 40% 98%)'
				},
				muted: {
					DEFAULT: 'hsl(217.2 32.6% 17.5%)',
					foreground: 'hsl(215 20.2% 65.1%)'
				},
				accent: {
					DEFAULT: 'hsl(217.2 32.6% 17.5%)',
					foreground: 'hsl(210 40% 98%)'
				},
				popover: {
					DEFAULT: 'hsl(222.2 84% 4.9%)',
					foreground: 'hsl(210 40% 98%)'
				},
				card: {
					DEFAULT: 'hsl(222.2 47.4% 11.2%)',
					foreground: 'hsl(210 40% 98%)'
				},
				sidebar: {
					DEFAULT: 'hsl(222.2 47.4% 11.2%)',
					foreground: 'hsl(210 40% 98%)',
					primary: 'hsl(221.2 83.2% 53.3%)',  // Changed to blue
					'primary-foreground': 'hsl(210 40% 98%)',
					accent: 'hsl(217.2 32.6% 17.5%)',
					'accent-foreground': 'hsl(210 40% 98%)',
					border: 'hsl(217.2 32.6% 17.5%)',
					ring: 'hsl(221.2 83.2% 53.3%)'      // Changed to blue
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
