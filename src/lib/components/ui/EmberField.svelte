<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, prefersReducedMotion } from '#lib/motion/gsap.ts';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const css = getComputedStyle(document.documentElement);
		const palette = ['--color-ember', '--color-blaze', '--color-wyrm'].map((v) =>
			css.getPropertyValue(v).trim()
		);
		type P = {
			x: number;
			y: number;
			r: number;
			vy: number;
			vx: number;
			a: number;
			c: string;
			ph: number;
		};
		let w = 0;
		let h = 0;
		let parts: P[] = [];
		let visible = true;

		const spawn = (init: boolean): P => ({
			x: Math.random() * w,
			y: init ? Math.random() * h : h + 10,
			r: Math.random() * 1.6 + 0.4,
			vy: Math.random() * 0.5 + 0.15,
			vx: (Math.random() - 0.5) * 0.2,
			a: Math.random() * 0.6 + 0.2,
			c: palette[(Math.random() * 3) | 0],
			ph: Math.random() * Math.PI * 2
		});
		const resize = () => {
			const r = canvas.getBoundingClientRect();
			const d = Math.min(devicePixelRatio || 1, 2);
			w = r.width;
			h = r.height;
			canvas.width = w * d;
			canvas.height = h * d;
			ctx.setTransform(d, 0, 0, d, 0, 0);
			parts = Array.from({ length: Math.round(w / 16) }, () => spawn(true));
		};
		const draw = () => {
			if (!visible) return;
			const t = performance.now();
			ctx.clearRect(0, 0, w, h);
			for (const p of parts) {
				p.y -= p.vy;
				p.x += p.vx + Math.sin(t / 1400 + p.ph) * 0.15;
				if (p.y < -10) Object.assign(p, spawn(false));
				ctx.globalAlpha = p.a * Math.min(1, p.y / (h * 0.5));
				ctx.fillStyle = p.c;
				ctx.shadowColor = p.c;
				ctx.shadowBlur = 8;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fill();
			}
		};

		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(canvas);
		const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
		io.observe(canvas);

		if (prefersReducedMotion()) {
			draw();
			return () => (ro.disconnect(), io.disconnect());
		}
		gsap.ticker.add(draw);
		return () => {
			gsap.ticker.remove(draw);
			ro.disconnect();
			io.disconnect();
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none absolute inset-0 h-full w-full"
	aria-hidden="true"
></canvas>
