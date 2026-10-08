import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			// Fully prerendered site, served as static files by Caddy (see Dockerfile).
			adapter: adapter({ precompress: true, fallback: '404.html' }),
			prerender: { handleHttpError: 'warn' },
			inlineStyleThreshold: 4096
		})
	]
});
