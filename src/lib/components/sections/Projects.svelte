<script lang="ts">
	import ProjectFeature from './ProjectFeature.svelte';
	import ProjectIndex from './ProjectIndex.svelte';
	import SectionHead from '#lib/components/ui/SectionHead.svelte';
	import { projects } from '#lib/data/projects.ts';
	import { reveal } from '#lib/motion/actions.ts';
</script>

<section
	id="projets"
	class="border-t border-seam bg-crypt/40 py-28 md:py-40"
	aria-labelledby="projets-title"
>
	<div class="wrap flex flex-col gap-28 md:gap-44">
		<SectionHead label="02 — Projets" title="Les mondes que nous avons forgés" id="projets-title">
			Des jeux pour le navigateur, des applications pour le quotidien et des outils métier. Chaque
			projet est conçu, développé et mis en ligne par le studio.
		</SectionHead>

		<ProjectIndex />

		<div class="flex items-center gap-4" aria-hidden="true">
			<span class="label">Showcase</span>
			<span class="h-px flex-1 bg-seam"></span>
		</div>

		{#each projects as project, i (project.slug)}
			<ProjectFeature {project} index={i} total={projects.length} />
		{/each}

		<div class="next" use:reveal>
			<picture class="next-bg" aria-hidden="true">
				<source
					type="image/avif"
					srcset="/brand/next-world-960.avif 960w, /brand/next-world-1680.avif 1680w"
					sizes="100vw"
				/>
				<img
					src="/brand/next-world-1680.webp"
					srcset="/brand/next-world-960.webp 960w, /brand/next-world-1680.webp 1680w"
					sizes="100vw"
					alt=""
					width="1680"
					height="720"
					loading="lazy"
				/>
			</picture>
			<span class="label text-bone">Prochain monde</span>
			<p class="font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-tight font-bold">
				Déjà <span class="text-forge">en forge</span>.
			</p>
			<p class="max-w-[52ch] text-bone/80">
				De nouveaux projets rejoindront bientôt cette galerie. Chaque monde publié par le studio est
				présenté ici dès sa mise en ligne.
			</p>
		</div>
	</div>
</section>

<style>
	.next {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		min-height: clamp(320px, 38vw, 520px);
		justify-content: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
		padding: clamp(48px, 8vw, 96px) 24px;
		text-align: center;
		border: 1px solid var(--color-seam);
		border-radius: var(--radius-xs);
	}
	.next-bg {
		position: absolute;
		inset: 0;
		z-index: -1;
	}
	.next-bg img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 2s var(--ease-forge);
	}
	.next:hover .next-bg img {
		transform: scale(1.04);
	}
	.next-bg::after {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse at center,
			color-mix(in srgb, var(--color-void) 72%, transparent),
			color-mix(in srgb, var(--color-void) 35%, transparent)
		);
	}
	.next p {
		text-shadow: 0 2px 24px var(--color-void);
	}
</style>
