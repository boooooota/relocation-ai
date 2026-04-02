import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./app/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				display: ['var(--font-syne)', 'sans-serif'],
				body: ['var(--font-plex-sans)', 'sans-serif'],
				mono: ['var(--font-plex-mono)', 'monospace'],
			},
			fontSize: {
				display: ['2.25rem', { lineHeight: '1.1', fontWeight: '800' }],
				h1: ['1.75rem', { lineHeight: '1.2', fontWeight: '700' }],
				h2: ['1.25rem', { lineHeight: '1.3', fontWeight: '700' }],
				body: ['0.9375rem', { lineHeight: '1.65', fontWeight: '400' }],
				'body-sm': ['0.8125rem', { lineHeight: '1.6', fontWeight: '400' }],
				mono: ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }],
				label: [
					'0.625rem',
					{ lineHeight: '1', fontWeight: '500', letterSpacing: '0.1em' },
				],
			},
			colors: {
				bg: {
					DEFAULT: 'var(--color-bg-default)',
					subtle: 'var(--color-bg-subtle)',
				},
				text: {
					primary: 'var(--color-text-primary)',
					secondary: 'var(--color-text-secondary)',
					placeholder: 'var(--color-text-placeholder)',
				},
				border: {
					DEFAULT: 'var(--color-border-default)',
				},
				brand: {
					DEFAULT: 'var(--color-brand-default)',
					hover: 'var(--color-brand-hover)',
					accent: 'var(--color-brand-accent)',
					onBrand: 'var(--color-brand-on-brand)',
				},
				status: {
					success: 'var(--color-status-success)',
					error: 'var(--color-status-error)',
				},
			},
		},
	},
};
export default config;
