import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

let registered = false;

/** Registers GSAP plugins once (client only) and applies the studio defaults. */
export function setupGsap() {
	if (registered || typeof window === 'undefined') return;
	gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
	gsap.defaults({ ease: 'expo.out', duration: 0.9 });
	registered = true;
}

export function prefersReducedMotion() {
	return typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function hasFinePointer() {
	return typeof window !== 'undefined' && matchMedia('(pointer: fine)').matches;
}

export { gsap, ScrollTrigger, SplitText, Flip };
