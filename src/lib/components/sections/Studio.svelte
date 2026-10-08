<script lang="ts">
	import { onMount } from 'svelte';
	import Picture from '#lib/components/ui/Picture.svelte';
	import SectionHead from '#lib/components/ui/SectionHead.svelte';
	import { reveal, tilt } from '#lib/motion/actions.ts';
	import { gsap, prefersReducedMotion, setupGsap } from '#lib/motion/gsap.ts';

	const manifesto: { text: string; hot?: boolean }[] = [
		{ text: "Nous croyons qu'un site se" },
		{ text: 'joue', hot: true },
		{ text: "et qu'un jeu se" },
		{ text: 'visite.', hot: true },
		{ text: 'Entre le code et le récit, nous forgeons des mondes qui tiennent debout.' }
	];
	const words = manifesto.flatMap((part) =>
		part.text.split(' ').map((w) => ({ w, hot: part.hot ?? false }))
	);

	const disciplines = [
		{
			label: 'Discipline I',
			title: 'Jeux vidéo',
			text: "Jeux de stratégie persistants, jouables directement dans le navigateur. Nous concevons l'économie, l'équilibrage, le multijoueur en temps réel et la direction artistique.",
			tags: ['Game design', 'Temps réel', 'Équilibrage', 'Direction artistique'],
			image: 'games',
			alt: 'Table de guerre sombre : tours sculptées et dragon de bronze sur une carte lumineuse'
		},
		{
			label: 'Discipline II',
			title: 'Web & applications',
			text: 'Sites vitrines, applications métier et applications mobiles. Rapides, accessibles et simples à faire évoluer, du prototype à la production.',
			tags: ['SvelteKit', 'Next.js', 'Android natif', 'Accessibilité'],
			image: 'web',
			alt: 'Métal en fusion coulé dans une forge, avec des lignes de code en hologramme'
		}
	];

	const steps = [
		{
			name: 'Esquisse',
			text: "Cadrer le besoin, le public et l'univers. Maquettes et prototypes jouables."
		},
		{
			name: 'Forge',
			text: 'Développer par itérations courtes, testées, versionnées et déployées en continu.'
		},
		{
			name: 'Trempe',
			text: 'Éprouver : tests, audits de performance et d’accessibilité, essais sur appareils réels.'
		},
		{
			name: 'Lancement',
			text: 'Mettre en production, surveiller, publier les notes de version et faire évoluer.'
		}
	];

	let manifestoEl: HTMLElement;
	let methodEl: HTMLElement;

	onMount(() => {
		const spans = Array.from(manifestoEl.querySelectorAll<HTMLElement>('.w'));
		if (prefersReducedMotion()) {
			spans.forEach((s) => s.classList.add('lit'));
			return;
		}
		setupGsap();
		const ctx = gsap.context(() => {
			gsap.to(
				{},
				{
					scrollTrigger: {
						trigger: manifestoEl,
						start: 'top 80%',
						end: 'bottom 45%',
						scrub: true,
						onUpdate: (self) => {
							const n = Math.round(self.progress * spans.length);
							spans.forEach((s, i) => s.classList.toggle('lit', i < n));
						}
					}
				}
			);
			// Method timeline: the forge line fills as you scroll through the steps.
			gsap.from(methodEl.querySelector('.rail-fill'), {
				scaleX: 0,
				ease: 'none',
				scrollTrigger: { trigger: methodEl, start: 'top 75%', end: 'bottom 60%', scrub: true }
			});
		});
		return () => ctx.revert();
	});
</script>

<section
	id="studio"
	class="studio relative border-t border-seam py-28 md:py-40"
	aria-labelledby="studio-title"
>
	<div class="wrap relative flex flex-col gap-24 md:gap-36">
		<SectionHead label="01 — Le studio" title="Forgé à l'ombre du beffroi" id="studio-title">
			OCC MONS Studios est né à Mons. Notre emblème réunit la tour et le dragon du Doudou : la
			ténacité de celui qui bâtit et le feu de celui qui crée. Nous réunissons deux métiers sous le
			même toit, le jeu vidéo et le développement web.
		</SectionHead>

		<p bind:this={manifestoEl} class="manifesto md:ml-[224px]">
			{#each words as { w, hot }, i (i)}<span class="w" class:hot>{w}</span>{' '}{/each}
		</p>

		<div id="expertise" class="grid gap-6 md:grid-cols-2" use:reveal={{ stagger: 0.12 }}>
			{#each disciplines as d (d.title)}
				<article class="discipline group" use:tilt={{ max: 4 }}>
					<div class="media">
						<Picture
							image={{
								src: `/disciplines/${d.image}`,
								widths: [640, 1232],
								width: 1232,
								height: 770,
								alt: d.alt
							}}
							sizes="(min-width: 768px) 45vw, 100vw"
							class="h-full w-full object-cover"
						/>
					</div>
					<span class="label">{d.label}</span>
					<h3 class="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] leading-tight font-bold">
						{d.title}
					</h3>
					<p class="text-ash">{d.text}</p>
					<ul
						class="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-6 font-mono text-[0.78rem] text-bone"
						aria-label="Savoir-faire"
					>
						{#each d.tags as t, i (t)}
							{#if i > 0}<li aria-hidden="true" class="text-ash">·</li>{/if}
							<li>{t}</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>

		<div id="methode" bind:this={methodEl} class="flex flex-col gap-12">
			<div class="grid gap-3 md:grid-cols-[200px_1fr] md:gap-6">
				<span class="label">Méthode</span>
				<h3 class="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight font-bold">
					Du minerai brut au monde en ligne
				</h3>
			</div>
			<div class="relative">
				<div class="rail" aria-hidden="true"><div class="rail-fill"></div></div>
				<ol class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4" use:reveal={{ stagger: 0.1 }}>
					{#each steps as s, i (s.name)}
						<li class="step">
							<span class="font-mono text-sm text-ember">0{i + 1}</span>
							<h4 class="font-display text-2xl font-bold">{s.name}</h4>
							<p class="text-ash">{s.text}</p>
						</li>
					{/each}
				</ol>
			</div>
		</div>
	</div>
</section>

<style>
	.manifesto {
		max-width: 22ch;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(1.8rem, 4.6vw, 3.8rem);
		line-height: 1.16;
		text-wrap: balance;
	}
	.w {
		color: color-mix(in srgb, var(--color-bone) 22%, transparent);
		transition: color 0.25s;
	}
	.w:global(.lit) {
		color: var(--color-bone);
	}
	.w.hot:global(.lit) {
		background: var(--forge);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	/* Forged-stone texture, kept faint and faded at both ends of the section. */
	.studio::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.14;
		background: image-set(
				url('/textures/forge-1344.avif') type('image/avif'),
				url('/textures/forge-1344.webp') type('image/webp')
			)
			center / 900px auto repeat;
		mask-image: linear-gradient(180deg, transparent, #000 20%, #000 70%, transparent);
	}
	.discipline {
		--px: 50%;
		--py: 50%;
		--pad: clamp(28px, 4vw, 48px);
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 18px;
		padding: var(--pad);
		background: var(--color-crypt);
		border: 1px solid var(--color-seam);
		border-radius: var(--radius-xs);
		overflow: hidden;
		transition: border-color 0.4s;
	}
	.discipline::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.4s;
		background: radial-gradient(
			480px circle at var(--px) var(--py),
			color-mix(in srgb, var(--color-ember) 14%, transparent),
			transparent 60%
		);
	}
	.media {
		position: relative;
		margin: calc(-1 * var(--pad)) calc(-1 * var(--pad)) 8px;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-bottom: 1px solid var(--color-seam);
	}
	.media::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 45%, var(--color-crypt));
	}
	.media :global(img) {
		transition: transform 1.4s var(--ease-forge);
	}
	.discipline:hover .media :global(img) {
		transform: scale(1.05);
	}
	.discipline:hover {
		border-color: color-mix(in srgb, var(--color-ember) 40%, var(--color-seam));
	}
	.discipline:hover::after {
		opacity: 1;
	}
	.rail {
		position: absolute;
		inset: 0 0 auto;
		height: 1px;
		background: var(--color-seam);
	}
	.rail-fill {
		height: 100%;
		background: var(--forge);
		transform-origin: left;
	}
	.step {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-top: 28px;
	}
	@media (max-width: 1023px) {
		.rail {
			display: none;
		}
		.step {
			border-top: 1px solid var(--color-seam);
		}
	}
</style>
