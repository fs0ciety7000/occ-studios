<script lang="ts">
	import Picture from '#lib/components/ui/Picture.svelte';
	import Status from '#lib/components/ui/Status.svelte';
	import type { Project } from '#lib/data/projects.ts';
	import { parallax, reveal, splitReveal, tilt, wipe } from '#lib/motion/actions.ts';

	type Props = { project: Project; index: number; total: number };
	let { project, index, total }: Props = $props();

	const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
	const flip = $derived(index % 2 === 1);
	const domain = $derived(project.url.replace(/^https?:\/\//, ''));
</script>

<article class="feature" class:flip aria-labelledby="project-{project.slug}">
	<a
		href={project.url}
		target="_blank"
		rel="noopener"
		class="cover group"
		use:tilt={{ max: 3 }}
		aria-label="{project.title} : ouvrir {domain} dans un nouvel onglet"
	>
		<div class="cover-frame" use:wipe>
			<div class="cover-img" use:parallax={{ amount: 6 }}>
				<Picture
					image={project.cover}
					sizes="(min-width: 1024px) 60vw, 100vw"
					class="h-full w-full object-cover"
				/>
			</div>
			<div class="cover-shade" aria-hidden="true"></div>
			<div class="absolute top-5 left-5"><Status status={project.status} /></div>
			<span class="label absolute bottom-5 left-5 text-bone">{domain} ↗</span>
		</div>
	</a>

	<div class="body" use:reveal={{ selector: '[data-r]' }}>
		<div class="flex items-baseline justify-between gap-4" data-r>
			<span class="label">{project.category}</span>
			<span class="font-mono text-sm whitespace-nowrap text-ash tabular-nums">
				<span class="text-ember">{roman[index]}</span> / {roman[total - 1]}
			</span>
		</div>
		<h3
			id="project-{project.slug}"
			class="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] font-black tracking-[0.01em]"
			use:splitReveal
		>
			{project.title}
		</h3>
		<p class="text-xl leading-snug text-bone" data-r>{project.tagline}</p>
		<p class="text-ash" data-r>{project.description}</p>

		<ul class="features" data-r>
			{#each project.features as f (f)}
				<li>{f}</li>
			{/each}
		</ul>

		<dl class="flex flex-wrap items-end gap-x-12 gap-y-6 border-t border-seam pt-6" data-r>
			<div class="flex min-w-0 flex-col gap-2">
				<dt class="label">Stack</dt>
				<dd class="font-mono text-[0.8rem] text-bone">{project.stack.join(' · ')}</dd>
			</div>
			{#if project.highlight}
				<div class="flex items-baseline gap-3">
					<dt class="sr-only">{project.highlight.label}</dt>
					<dd class="text-forge font-display text-4xl leading-none font-black">
						{project.highlight.value}
					</dd>
					<dd class="label max-w-[16ch]" aria-hidden="true">{project.highlight.label}</dd>
				</div>
			{/if}
		</dl>

		<a href={project.url} target="_blank" rel="noopener" class="link-rune self-start" data-r>
			{project.cta} ↗
		</a>
	</div>

	{#if project.gallery.length}
		<ul
			class="gallery {project.galleryKind}"
			aria-label="Captures de {project.title}"
			use:reveal={{ stagger: 0.12 }}
		>
			{#each project.gallery as shot (shot.src)}
				<li>
					<figure>
						<div class="shot">
							<Picture
								image={shot}
								sizes={project.galleryKind === 'phone' ? '240px' : '(min-width: 1024px) 30vw, 90vw'}
								class="h-full w-full object-cover object-top"
							/>
						</div>
						{#if shot.caption}<figcaption class="label mt-3">{shot.caption}</figcaption>{/if}
					</figure>
				</li>
			{/each}
		</ul>
	{/if}
</article>

<style>
	.feature {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: clamp(32px, 5vw, 72px);
		align-items: center;
	}
	@media (min-width: 1024px) {
		.feature {
			grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
		}
		.feature.flip {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr);
		}
		.feature.flip .cover {
			order: 2;
		}
		.gallery {
			grid-column: 1 / -1;
			order: 3;
		}
	}
	.cover {
		--px: 50%;
		--py: 50%;
		display: block;
		position: relative;
	}
	.cover-frame {
		position: relative;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		border: 1px solid var(--color-seam);
		border-radius: var(--radius-xs);
		background: var(--color-crypt);
		clip-path: inset(0 0 0 0);
		transition: border-color 0.4s;
	}
	.cover:hover .cover-frame {
		border-color: color-mix(in srgb, var(--color-ember) 50%, var(--color-seam));
	}
	.cover-img {
		position: absolute;
		inset: -8% 0;
		transition: transform 1.4s var(--ease-forge);
	}
	.cover:hover .cover-img {
		transform: scale(1.04);
	}
	.cover-shade {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(
				520px circle at var(--px) var(--py),
				color-mix(in srgb, var(--color-ember) 14%, transparent),
				transparent 60%
			),
			linear-gradient(
				180deg,
				transparent 50%,
				color-mix(in srgb, var(--color-void) 85%, transparent)
			);
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: 20px;
		min-width: 0;
	}
	.features {
		display: grid;
		gap: 10px;
		padding: 0;
		margin: 0;
		list-style: none;
	}
	.features li {
		display: grid;
		grid-template-columns: 18px 1fr;
		gap: 10px;
		color: var(--color-bone);
	}
	.features li::before {
		content: '';
		width: 8px;
		height: 8px;
		margin-top: 0.55em;
		transform: rotate(45deg);
		background: var(--forge);
	}
	.gallery {
		display: grid;
		gap: 20px;
		padding: 0;
		margin: 0;
		list-style: none;
	}
	.gallery.desktop {
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
	}
	.gallery.phone {
		grid-template-columns: repeat(3, minmax(0, 220px));
		justify-content: center;
		gap: clamp(12px, 3vw, 40px);
	}
	.shot {
		overflow: hidden;
		border: 1px solid var(--color-seam);
		border-radius: var(--radius-xs);
		background: var(--color-crypt);
	}
	.desktop .shot {
		aspect-ratio: 16 / 10;
	}
	.phone .shot {
		aspect-ratio: 1 / 2;
		border-radius: 18px;
		border-width: 4px;
		border-color: var(--color-stone);
		box-shadow: 0 30px 60px -30px color-mix(in srgb, var(--color-wyrm) 30%, transparent);
	}
	.phone li:nth-child(2) {
		transform: translateY(-24px);
	}
	.shot :global(img) {
		transition: transform 1.2s var(--ease-forge);
	}
	.shot:hover :global(img) {
		transform: scale(1.04);
	}
</style>
