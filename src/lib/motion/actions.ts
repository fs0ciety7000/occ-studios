import type { Action } from 'svelte/action';
import {
	gsap,
	ScrollTrigger,
	SplitText,
	hasFinePointer,
	prefersReducedMotion,
	setupGsap
} from './gsap.ts';

/**
 * Fades and lifts direct children (or `[data-reveal]` descendants) into view on scroll.
 * Content is visible in the prerendered HTML; the hidden state only exists once JS runs.
 */
export const reveal: Action<
	HTMLElement,
	{ y?: number; stagger?: number; selector?: string } | undefined
> = (node, opts = {}) => {
	if (prefersReducedMotion()) return;
	setupGsap();
	const targets = opts.selector ? node.querySelectorAll(opts.selector) : node.children;
	const tween = gsap.from(targets, {
		y: opts.y ?? 40,
		autoAlpha: 0,
		duration: 1.1,
		stagger: opts.stagger ?? 0.08,
		scrollTrigger: { trigger: node, start: 'top 85%', once: true }
	});
	return { destroy: () => tween.scrollTrigger?.kill() && tween.kill() };
};

/** Line-by-line masked reveal for headings. */
export const splitReveal: Action<
	HTMLElement,
	{ delay?: number; immediate?: boolean } | undefined
> = (node, opts = {}) => {
	if (prefersReducedMotion()) return;
	setupGsap();
	let split: SplitText | undefined;
	let tween: gsap.core.Tween | undefined;
	document.fonts.ready.then(() => {
		split = SplitText.create(node, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
		tween = gsap.from(split.lines, {
			yPercent: 110,
			duration: 1.3,
			stagger: 0.1,
			delay: opts.delay ?? 0,
			scrollTrigger: opts.immediate ? undefined : { trigger: node, start: 'top 85%', once: true }
		});
	});
	return {
		destroy() {
			tween?.scrollTrigger?.kill();
			tween?.kill();
			split?.revert();
		}
	};
};

/** Moves the element vertically while it crosses the viewport. */
export const parallax: Action<HTMLElement, { amount?: number } | undefined> = (node, opts = {}) => {
	if (prefersReducedMotion()) return;
	setupGsap();
	const amount = opts.amount ?? 12;
	const tween = gsap.fromTo(
		node,
		{ yPercent: -amount },
		{
			yPercent: amount,
			ease: 'none',
			scrollTrigger: {
				trigger: node.parentElement ?? node,
				start: 'top bottom',
				end: 'bottom top',
				scrub: true
			}
		}
	);
	return { destroy: () => (tween.scrollTrigger?.kill(), tween.kill()) };
};

/** Pulls the element toward the cursor (desktop only). */
export const magnetic: Action<HTMLElement, { strength?: number } | undefined> = (
	node,
	opts = {}
) => {
	if (prefersReducedMotion() || !hasFinePointer()) return;
	setupGsap();
	const s = opts.strength ?? 0.3;
	const xTo = gsap.quickTo(node, 'x', { duration: 0.6, ease: 'power3.out' });
	const yTo = gsap.quickTo(node, 'y', { duration: 0.6, ease: 'power3.out' });
	const move = (e: PointerEvent) => {
		const r = node.getBoundingClientRect();
		xTo((e.clientX - r.left - r.width / 2) * s);
		yTo((e.clientY - r.top - r.height / 2) * s * 1.3);
	};
	const leave = () => (xTo(0), yTo(0));
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', leave);
	return {
		destroy() {
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
		}
	};
};

/** 3D tilt + cursor-following light (writes --px / --py for CSS). */
export const tilt: Action<HTMLElement, { max?: number } | undefined> = (node, opts = {}) => {
	if (!hasFinePointer()) return;
	setupGsap();
	const max = prefersReducedMotion() ? 0 : (opts.max ?? 6);
	const rx = gsap.quickTo(node, 'rotationX', { duration: 0.8, ease: 'power3.out' });
	const ry = gsap.quickTo(node, 'rotationY', { duration: 0.8, ease: 'power3.out' });
	gsap.set(node, { transformPerspective: 1200 });
	const move = (e: PointerEvent) => {
		const r = node.getBoundingClientRect();
		const px = (e.clientX - r.left) / r.width;
		const py = (e.clientY - r.top) / r.height;
		ry((px - 0.5) * max * 2);
		rx((0.5 - py) * max * 2);
		node.style.setProperty('--px', `${px * 100}%`);
		node.style.setProperty('--py', `${py * 100}%`);
	};
	const leave = () => (rx(0), ry(0));
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', leave);
	return {
		destroy() {
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
		}
	};
};

/** Clip-path wipe used on large project covers. */
export const wipe: Action<HTMLElement> = (node) => {
	if (prefersReducedMotion()) return;
	setupGsap();
	const tween = gsap.from(node, {
		clipPath: 'inset(12% 8% 12% 8%)',
		duration: 1.6,
		ease: 'power3.inOut',
		scrollTrigger: { trigger: node, start: 'top 80%', once: true }
	});
	return { destroy: () => (tween.scrollTrigger?.kill(), tween.kill()) };
};

export { ScrollTrigger };
