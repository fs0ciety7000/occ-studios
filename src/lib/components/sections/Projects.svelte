<script lang="ts">
	import ProjectFeature from './ProjectFeature.svelte';
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
			Un jeu de stratégie spatiale, une application pour le foyer, un outil d'exploitation
			ferroviaire. Trois projets en ligne, conçus et développés par le studio.
		</SectionHead>

		{#each projects as project, i (project.slug)}
			<ProjectFeature {project} index={i} total={projects.length} />
		{/each}

		<div class="next" use:reveal>
			<span class="label">Prochain monde</span>
			<p class="font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-tight font-bold">
				Déjà <span class="text-forge">en forge</span>.
			</p>
			<p class="max-w-[52ch] text-ash">
				De nouveaux projets rejoindront bientôt cette galerie. Chaque monde publié par le studio est
				présenté ici dès sa mise en ligne.
			</p>
		</div>
	</div>
</section>

<style>
	.next {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
		padding: clamp(48px, 8vw, 96px) 24px;
		text-align: center;
		border: 1px dashed var(--color-seam);
		border-radius: var(--radius-xs);
	}
</style>
