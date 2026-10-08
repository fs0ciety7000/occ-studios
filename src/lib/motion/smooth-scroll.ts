import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap.ts';

let lenis: Lenis | null = null;

/** Inertial scrolling driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function initSmoothScroll() {
	if (prefersReducedMotion()) return () => {};

	lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
	lenis.on('scroll', ScrollTrigger.update);
	const tick = (time: number) => lenis?.raf(time * 1000);
	gsap.ticker.add(tick);
	gsap.ticker.lagSmoothing(0);

	return () => {
		gsap.ticker.remove(tick);
		lenis?.destroy();
		lenis = null;
	};
}

export function scrollToTarget(target: string | HTMLElement) {
	if (lenis) lenis.scrollTo(target, { offset: -72 });
	else {
		const el = typeof target === 'string' ? document.querySelector(target) : target;
		el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
	}
}
