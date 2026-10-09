<script lang="ts">
	import { tick } from 'svelte';
	import Picture from './Picture.svelte';
	import { lightbox } from './lightbox.svelte.ts';
	import { gsap, prefersReducedMotion, setupGsap } from '#lib/motion/gsap.ts';
	import { lockScroll } from '#lib/motion/smooth-scroll.ts';

	let dialog: HTMLDialogElement;
	let stage = $state<HTMLDivElement>();
	let closing = false;
	let swipeX: number | null = null;

	const current = $derived(lightbox.images[lightbox.index]);
	const many = $derived(lightbox.images.length > 1);

	const frame = () => stage?.querySelector('img') as HTMLImageElement | null;

	/** Transform that makes the large image sit exactly on top of a thumbnail. */
	function fromThumb(el: HTMLElement | null | undefined, img: HTMLImageElement) {
		if (!el) return null;
		const o = el.getBoundingClientRect();
		const t = img.getBoundingClientRect();
		if (!o.width || !t.width || o.bottom < 0 || o.top > innerHeight) return null;
		return { x: o.left - t.left, y: o.top - t.top, scale: o.width / t.width };
	}

	$effect(() => {
		if (lightbox.open && dialog && !dialog.open) void show();
	});

	async function show() {
		setupGsap();
		lockScroll(true);
		dialog.showModal();
		await tick();
		const img = frame();
		if (!img) return;
		if (!img.complete) await img.decode().catch(() => {});
		if (prefersReducedMotion()) return;
		gsap.fromTo(dialog, { '--veil': 0 }, { '--veil': 1, duration: 0.5, ease: 'power2.out' });
		gsap.from('[data-lb-ui]', { autoAlpha: 0, y: 12, duration: 0.5, delay: 0.25, stagger: 0.05 });
		const from = fromThumb(lightbox.origins[lightbox.index], img);
		if (from)
			gsap.fromTo(
				img,
				{ ...from, transformOrigin: '0 0' },
				{ x: 0, y: 0, scale: 1, duration: 0.8, ease: 'expo.out' }
			);
		else
			gsap.fromTo(
				img,
				{ autoAlpha: 0, scale: 0.94 },
				{ autoAlpha: 1, scale: 1, duration: 0.6, ease: 'expo.out' }
			);
	}

	async function close() {
		if (closing || !dialog?.open) return;
		closing = true;
		const img = frame();
		const done = () => {
			dialog.close();
			lightbox.open = false;
			lockScroll(false);
			closing = false;
			if (img) gsap.set(img, { clearProps: 'all' });
		};
		if (!img || prefersReducedMotion()) return done();
		const to = fromThumb(lightbox.origins[lightbox.index], img);
		gsap.to('[data-lb-ui]', { autoAlpha: 0, duration: 0.2 });
		gsap.to(dialog, { '--veil': 0, duration: 0.45, ease: 'power2.in' });
		if (to)
			gsap.to(img, {
				...to,
				transformOrigin: '0 0',
				duration: 0.55,
				ease: 'power3.inOut',
				onComplete: done
			});
		else gsap.to(img, { autoAlpha: 0, scale: 0.94, duration: 0.35, onComplete: done });
	}

	async function go(dir: 1 | -1) {
		if (!many) return;
		const n = lightbox.images.length;
		lightbox.index = (lightbox.index + dir + n) % n;
		await tick();
		const img = frame();
		if (img && !prefersReducedMotion())
			gsap.fromTo(
				img,
				{ autoAlpha: 0, x: dir * 60 },
				{ autoAlpha: 1, x: 0, duration: 0.6, ease: 'expo.out' }
			);
	}

	function onKey(e: KeyboardEvent) {
		if (!lightbox.open) return;
		if (e.key === 'ArrowRight') go(1);
		else if (e.key === 'ArrowLeft') go(-1);
	}
</script>

<svelte:window onkeydown={onKey} />

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	class="lb"
	aria-label="Capture de {lightbox.title} en grand"
	oncancel={(e) => {
		e.preventDefault();
		close();
	}}
	onclick={(e) => {
		if (e.target === e.currentTarget || e.target === stage) close();
	}}
>
	{#if lightbox.open && current}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			bind:this={stage}
			class="stage"
			onpointerdown={(e) => (swipeX = e.clientX)}
			onpointerup={(e) => {
				if (swipeX !== null && Math.abs(e.clientX - swipeX) > 50) go(e.clientX < swipeX ? 1 : -1);
				swipeX = null;
			}}
		>
			{#key current.src}
				<Picture
					image={current}
					sizes="92vw"
					loading="eager"
					class="lb-img {current.device === 'phone' ? 'phone' : ''}"
				/>
			{/key}
		</div>

		<div class="bar" data-lb-ui>
			<p class="min-w-0">
				<span class="label text-bone">{lightbox.title}</span>
				{#if current.caption}<span class="label"> · {current.caption}</span>{/if}
			</p>
			{#if many}
				<span class="font-mono text-sm text-ash tabular-nums">
					<span class="text-ember">{lightbox.index + 1}</span> / {lightbox.images.length}
				</span>
			{/if}
		</div>

		<button type="button" class="ctl close" data-lb-ui onclick={close} aria-label="Fermer">✕</button
		>
		{#if many}
			<button
				type="button"
				class="ctl prev"
				data-lb-ui
				onclick={() => go(-1)}
				aria-label="Capture précédente">←</button
			>
			<button
				type="button"
				class="ctl next"
				data-lb-ui
				onclick={() => go(1)}
				aria-label="Capture suivante">→</button
			>
		{/if}
	{/if}
</dialog>

<style>
	.lb {
		--veil: 1;
		position: fixed;
		inset: 0;
		width: 100%;
		max-width: none;
		height: 100%;
		max-height: none;
		margin: 0;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--color-bone);
		overflow: hidden;
	}
	.lb::backdrop {
		background: transparent;
	}
	/* Veil drawn by the dialog itself so GSAP can fade it through --veil. */
	.lb::before {
		content: '';
		position: fixed;
		inset: 0;
		background: color-mix(in srgb, var(--color-void) 94%, transparent);
		backdrop-filter: blur(10px);
		opacity: var(--veil);
	}
	.stage {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		padding: calc(64px + env(safe-area-inset-top, 0px)) 16px
			calc(72px + env(safe-area-inset-bottom, 0px));
		touch-action: pan-y pinch-zoom;
	}
	.stage :global(.lb-img) {
		display: block;
		width: auto;
		height: auto;
		max-width: min(92vw, 1600px);
		max-height: calc(100svh - 160px);
		border: 1px solid var(--color-seam);
		border-radius: var(--radius-xs);
		box-shadow: 0 40px 120px -30px color-mix(in srgb, var(--color-wyrm) 30%, transparent);
		user-select: none;
		-webkit-user-drag: none;
	}
	.stage :global(.lb-img.phone) {
		border-radius: 22px;
		border: 4px solid var(--color-stone);
	}
	.bar {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 20px var(--gutter) calc(20px + env(safe-area-inset-bottom, 0px));
	}
	.ctl {
		position: absolute;
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		border: 1px solid var(--color-seam);
		border-radius: 50%;
		background: color-mix(in srgb, var(--color-void) 70%, transparent);
		color: var(--color-bone);
		font-size: 1.1rem;
		cursor: pointer;
		transition:
			background-color 0.3s,
			color 0.3s,
			border-color 0.3s,
			transform 0.4s var(--ease-forge);
	}
	.ctl:hover {
		background: var(--color-bone);
		border-color: var(--color-bone);
		color: var(--color-void);
	}
	.close {
		top: calc(16px + env(safe-area-inset-top, 0px));
		right: var(--gutter);
	}
	.close:hover {
		transform: rotate(90deg);
	}
	.prev,
	.next {
		top: 50%;
		translate: 0 -50%;
	}
	.prev {
		left: var(--gutter);
	}
	.next {
		right: var(--gutter);
	}
	@media (max-width: 640px) {
		.prev,
		.next {
			top: auto;
			bottom: calc(68px + env(safe-area-inset-bottom, 0px));
			translate: none;
		}
	}
</style>
