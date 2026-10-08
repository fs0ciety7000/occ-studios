<script lang="ts">
	import { projects } from '#lib/data/projects.ts';
	import { site } from '#lib/data/site.ts';
	import { reveal } from '#lib/motion/actions.ts';
</script>

<footer class="relative overflow-hidden border-t border-seam bg-crypt">
	<div class="wrap pt-24 pb-10">
		<div class="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]" use:reveal>
			<div class="flex flex-col gap-6">
				<span class="label">Forgé à Mons · {site.coords}</span>
				<p
					class="max-w-[34ch] font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight font-bold"
				>
					Un monde à bâtir&nbsp;? <span class="text-forge">Parlons-en.</span>
				</p>
				{#if site.email}
					<a href="mailto:{site.email}" class="link-rune self-start">{site.email}</a>
				{/if}
			</div>
			<nav aria-label="Projets" class="flex flex-col gap-4">
				<span class="label text-bone">Projets</span>
				{#each projects as p (p.slug)}
					<a href={p.url} target="_blank" rel="noopener" class="group flex flex-col no-underline">
						<span class="font-semibold transition-colors group-hover:text-ember">{p.title}</span>
						<span class="font-mono text-xs text-ash">{p.url.replace(/^https?:\/\//, '')}</span>
					</a>
				{/each}
			</nav>
			<nav aria-label="Studio" class="flex flex-col gap-4">
				<span class="label text-bone">Studio</span>
				<a href="/#studio" class="text-ash no-underline transition-colors hover:text-bone">Vision</a
				>
				<a href="/#expertise" class="text-ash no-underline transition-colors hover:text-bone"
					>Expertise</a
				>
				<a href="/#methode" class="text-ash no-underline transition-colors hover:text-bone"
					>Méthode</a
				>
				<a href="/#projets" class="text-ash no-underline transition-colors hover:text-bone"
					>Projets</a
				>
			</nav>
		</div>

		<p class="giant" aria-hidden="true">OCC MONS</p>

		<div class="flex flex-wrap items-center justify-between gap-4 border-t border-seam pt-6">
			<span class="label">© {site.year} {site.name}</span>
			<span class="label">{site.url.replace('https://', '')}</span>
		</div>
	</div>
</footer>

<style>
	.giant {
		margin: 72px 0 24px;
		font-family: var(--font-display);
		font-weight: 900;
		font-size: min(12.4vw, 10.6rem);
		line-height: 0.85;
		letter-spacing: 0.02em;
		white-space: nowrap;
		color: transparent;
		-webkit-text-stroke: 1px var(--color-seam);
		background: var(--forge) 0 0 / 0% 100% no-repeat;
		-webkit-background-clip: text;
		background-clip: text;
		transition: background-size 1.4s var(--ease-forge);
		user-select: none;
	}
	.giant:hover {
		background-size: 100% 100%;
	}
</style>
