<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Footer from '#lib/components/layout/Footer.svelte';
	import Header from '#lib/components/layout/Header.svelte';
	import { setupGsap, ScrollTrigger } from '#lib/motion/gsap.ts';
	import { initSmoothScroll } from '#lib/motion/smooth-scroll.ts';

	let { children } = $props();

	onMount(() => {
		setupGsap();
		const stop = initSmoothScroll();
		// Fonts change line heights; recompute trigger positions once they are in.
		document.fonts.ready.then(() => ScrollTrigger.refresh());
		return stop;
	});
</script>

<a href="#contenu" class="skip">Aller au contenu</a>
<Header />
<main id="contenu">
	{@render children()}
</main>
<Footer />
<div class="grain" aria-hidden="true"></div>

<style>
	.skip {
		position: fixed;
		left: 16px;
		top: 16px;
		z-index: 100;
		padding: 10px 16px;
		background: var(--color-bone);
		color: var(--color-void);
		transform: translateY(-200%);
		transition: transform 0.3s;
	}
	.skip:focus {
		transform: none;
	}
</style>
