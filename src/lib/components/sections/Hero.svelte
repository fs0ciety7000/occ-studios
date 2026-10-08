<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import EmberField from '#lib/components/ui/EmberField.svelte';
	import { site } from '#lib/data/site.ts';
	import { gsap, SplitText, prefersReducedMotion, setupGsap } from '#lib/motion/gsap.ts';

	let root: HTMLElement;

	const disciplines = [
		'Jeux vidéo',
		'Sites web',
		'Applications',
		'Outils métier',
		'Direction artistique'
	];

	onMount(() => {
		if (prefersReducedMotion()) return;
		setupGsap();
		let splits: SplitText[] = [];

		const ctx = gsap.context(() => {
			const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, paused: true });
			const lines = gsap.utils.toArray<HTMLElement>('[data-split]', root);
			splits = lines.map((el) => SplitText.create(el, { type: 'chars', charsClass: 'char' }));
			// Spread the forge gradient across the split characters so it reads as one sweep.
			splits.forEach((s) => {
				if (!(s.elements[0] as HTMLElement).classList.contains('text-forge')) return;
				const n = Math.max(s.chars.length - 1, 1);
				s.chars.forEach((c, i) => {
					const el = c as HTMLElement;
					el.style.backgroundSize = `${(n + 1) * 100}% 100%`;
					el.style.backgroundPosition = `${(i / n) * 100}% 0`;
				});
			});

			splits.forEach((s, i) => {
				intro.from(
					s.chars,
					{ yPercent: 115, rotate: 6, duration: 1.4, stagger: 0.035 },
					0.15 + i * 0.15
				);
			});
			intro
				.from('[data-hero="eyebrow"]', { autoAlpha: 0, x: -24, duration: 1 }, 0.1)
				.from('[data-hero="fade"]', { autoAlpha: 0, y: 28, duration: 1, stagger: 0.1 }, 0.65)
				.from(
					'[data-hero="emblem"]',
					{ autoAlpha: 0, scale: 0.9, filter: 'blur(14px)', duration: 1.8, clearProps: 'filter' },
					0.2
				)
				.from('[data-hero="cue"]', { autoAlpha: 0, duration: 1 }, 1.3);

			document.fonts.ready.then(() => intro.play());

			// Scroll-out: emblem drifts, copy recedes.
			gsap.to('[data-hero="emblem-img"]', {
				yPercent: 14,
				ease: 'none',
				scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true }
			});
			gsap.to('[data-hero="copy"]', {
				yPercent: -12,
				autoAlpha: 0.2,
				ease: 'none',
				scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true }
			});
		}, root);

		return () => {
			ctx.revert();
			splits.forEach((s) => s.revert());
		};
	});
</script>

<section
	bind:this={root}
	class="hero relative flex min-h-svh flex-col overflow-hidden"
	aria-labelledby="hero-title"
>
	<EmberField />
	<div class="halo" aria-hidden="true"></div>

	<div
		class="wrap relative grid flex-1 items-center gap-10 pt-32 pb-16 lg:grid-cols-[1.15fr_0.85fr]"
	>
		<div class="min-w-0" data-hero="copy">
			<p class="label mb-8 flex items-center gap-4" data-hero="eyebrow">
				<span class="bg-forge h-px w-10" aria-hidden="true"></span>
				{site.coords} — Mons
			</p>
			<h1 id="hero-title" class="font-display leading-[0.9] font-black tracking-[0.02em]">
				<span class="line text-hero" data-split>OCC</span>
				<span class="line text-hero"><span class="text-forge" data-split>MONS</span></span>
				<span class="line studios" data-split>Studios</span>
			</h1>
			<p class="mt-9 max-w-[46ch] text-lg text-ash md:text-xl" data-hero="fade">
				Nous forgeons des <strong class="font-semibold text-bone">mondes jouables</strong> et des
				<strong class="font-semibold text-bone">expériences web</strong> taillées pour durer. Un studio,
				deux métiers, la même exigence.
			</p>
			<div class="mt-10 flex flex-wrap gap-4" data-hero="fade">
				<Button href="#projets" arrow>Voir nos projets</Button>
				<Button href="#studio" variant="ghost">Le studio</Button>
			</div>
		</div>

		<div class="emblem relative mx-auto w-full max-w-[300px] lg:max-w-[440px]" data-hero="emblem">
			<picture data-hero="emblem-img" class="relative block">
				<source
					type="image/avif"
					srcset="/brand/emblem-520.avif 520w, /brand/emblem-1040.avif 1040w"
					sizes="(min-width: 1024px) 440px, 300px"
				/>
				<img
					src="/brand/emblem-520.webp"
					srcset="/brand/emblem-520.webp 520w, /brand/emblem-1040.webp 1040w"
					sizes="(min-width: 1024px) 440px, 300px"
					alt="Emblème OCC MONS : une tour enlacée par un dragon"
					width="520"
					height="864"
					fetchpriority="high"
					class="w-full"
				/>
			</picture>
		</div>
	</div>

	<div class="relative border-t border-seam" data-hero="cue">
		<div class="marquee" aria-hidden="true">
			{#each [0, 1] as copy (copy)}
				<div class="marquee-track">
					{#each disciplines as d (d)}
						<span class="label text-bone">{d}</span><span class="text-forge">✦</span>
					{/each}
				</div>
			{/each}
		</div>
		<p class="sr-only">Expertises : {disciplines.join(', ')}.</p>
	</div>
</section>

<style>
	.line {
		display: block;
	}
	.hero :global(.char) {
		will-change: transform;
	}
	.line:not(.studios) {
		overflow: hidden;
		padding-bottom: 0.04em;
	}
	/* SplitText chars inside a gradient span need their own clip */
	.hero :global(.text-forge .char) {
		background: var(--forge);
		background-size: 300% 100%;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.studios {
		margin-top: 0.6em;
		font-size: clamp(1.1rem, 2.6vw, 2.3rem);
		font-weight: 500;
		letter-spacing: 0.62em;
		color: var(--color-ash);
		overflow: hidden;
	}
	.halo {
		position: absolute;
		right: -10%;
		top: 10%;
		width: 70vmax;
		height: 70vmax;
		max-width: 1000px;
		max-height: 1000px;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--color-wyrm) 16%, transparent),
			color-mix(in srgb, var(--color-ember) 6%, transparent) 40%,
			transparent 70%
		);
		filter: blur(40px);
		pointer-events: none;
	}
	.emblem::before {
		content: '';
		position: absolute;
		inset: 20%;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--color-wyrm) 32%, transparent),
			transparent 70%
		);
		filter: blur(40px);
		animation: breathe 5s ease-in-out infinite;
	}
	@keyframes breathe {
		50% {
			opacity: 0.55;
			transform: scale(1.08);
		}
	}
	.marquee {
		display: flex;
		overflow: hidden;
		padding-block: 18px;
		mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
	}
	.marquee-track {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: 40px;
		padding-right: 40px;
		animation: marquee 32s linear infinite;
	}
	@keyframes marquee {
		to {
			transform: translateX(-100%);
		}
	}
</style>
