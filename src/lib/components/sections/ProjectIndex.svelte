<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Picture from '#lib/components/ui/Picture.svelte';
	import Status from '#lib/components/ui/Status.svelte';
	import { projects, type Project } from '#lib/data/projects.ts';
	import { reveal } from '#lib/motion/actions.ts';
	import { Flip, gsap, hasFinePointer, prefersReducedMotion, setupGsap } from '#lib/motion/gsap.ts';

	type Filter = 'all' | 'game' | 'apps';
	const filters: { id: Filter; label: string; match: (p: Project) => boolean }[] = [
		{ id: 'all', label: 'Tous', match: () => true },
		{ id: 'game', label: 'Jeux', match: (p) => p.kind === 'game' },
		{ id: 'apps', label: 'Web & apps', match: (p) => p.kind !== 'game' }
	];

	let active = $state<Filter>('all');
	let hovered = $state<string | null>(null);
	let list: HTMLUListElement;
	let wrap: HTMLDivElement;
	let preview: HTMLDivElement;
	let moveX: ((v: number) => void) | undefined;
	let moveY: ((v: number) => void) | undefined;

	const domain = (url: string) => url.replace(/^https?:\/\//, '');
	const visible = (p: Project) => filters.find((f) => f.id === active)!.match(p);
	const count = (f: (typeof filters)[number]) => projects.filter(f.match).length;

	async function select(id: Filter) {
		if (id === active) return;
		const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-row]'));
		if (prefersReducedMotion()) {
			active = id;
			return;
		}
		// Flip keeps rows in place while the list re-flows, then animates every row to its new slot.
		const state = Flip.getState(rows);
		active = id;
		await tick();
		Flip.from(state, {
			duration: 0.7,
			ease: 'power3.inOut',
			absolute: true,
			stagger: 0.03,
			onEnter: (els) =>
				gsap.fromTo(
					els,
					{ autoAlpha: 0, y: 24 },
					{ autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05 }
				),
			onLeave: (els) => gsap.to(els, { autoAlpha: 0, y: -16, duration: 0.35 })
		});
	}

	function onMove(e: PointerEvent) {
		if (!moveX || !moveY) return;
		const r = wrap.getBoundingClientRect();
		moveX(e.clientX - r.left);
		moveY(e.clientY - r.top);
	}

	onMount(() => {
		setupGsap();
		if (!hasFinePointer() || prefersReducedMotion()) return;
		moveX = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3.out' });
		moveY = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3.out' });
	});

	$effect(() => {
		if (!preview || !moveX) return;
		gsap.to(preview, {
			autoAlpha: hovered ? 1 : 0,
			scale: hovered ? 1 : 0.85,
			rotate: hovered ? -3 : 0,
			duration: 0.5,
			ease: 'power3.out'
		});
	});
</script>

<div class="index" id="index">
	<div class="flex flex-wrap items-end justify-between gap-6">
		<div class="flex flex-col gap-2">
			<span class="label">Index</span>
			<h3 class="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-tight font-bold">
				Tous les projets, en un coup d'œil
			</h3>
		</div>
		<div class="filters" role="group" aria-label="Filtrer les projets">
			{#each filters as f (f.id)}
				<button
					type="button"
					class="chip"
					class:on={active === f.id}
					aria-pressed={active === f.id}
					onclick={() => select(f.id)}
				>
					{f.label}<span class="tabular-nums">{count(f)}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={wrap}
		class="list-wrap"
		onpointermove={onMove}
		onpointerleave={() => (hovered = null)}
	>
		<ul bind:this={list} class="rows" use:reveal={{ selector: '[data-row]', stagger: 0.06, y: 24 }}>
			{#each projects as p, i (p.slug)}
				<li
					data-row
					data-flip-id={p.slug}
					class="row group"
					hidden={!visible(p)}
					onpointerenter={() => (hovered = p.slug)}
				>
					<span class="num font-mono text-sm text-ash tabular-nums"
						>{String(i + 1).padStart(2, '0')}</span
					>
					<a href={p.url} target="_blank" rel="noopener" class="title-link">
						<span class="title font-display font-bold">{p.title}</span>
						<span class="sr-only">: ouvrir {domain(p.url)} dans un nouvel onglet</span>
					</a>
					<span class="cat label">{p.category}</span>
					<span class="status"><Status status={p.status} /></span>
					<span class="dom font-mono text-xs text-ash">{domain(p.url)}</span>
					<span class="actions">
						<a href="#projet-{p.slug}" class="detail label" aria-label="Voir la fiche de {p.title}"
							>Fiche</a
						>
						<span class="go" aria-hidden="true">↗</span>
					</span>
				</li>
			{/each}
		</ul>

		<div bind:this={preview} class="preview" aria-hidden="true">
			{#each projects as p (p.slug)}
				<div class="pv" class:show={hovered === p.slug}>
					<Picture image={p.cover} sizes="320px" class="h-full w-full object-cover" />
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.index {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 8px 14px;
		border: 1px solid var(--color-seam);
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ash);
		cursor: pointer;
		transition:
			color 0.3s,
			border-color 0.3s,
			background-color 0.3s;
	}
	.chip span {
		color: var(--color-ember);
	}
	.chip:hover {
		color: var(--color-bone);
		border-color: var(--color-ash);
	}
	.chip.on {
		color: var(--color-void);
		background: var(--color-bone);
		border-color: var(--color-bone);
	}
	.chip.on span {
		color: var(--color-blaze);
	}
	.list-wrap {
		position: relative;
	}
	.rows {
		position: relative;
		margin: 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--color-seam);
	}
	.row {
		position: relative;
		isolation: isolate;
		display: grid;
		grid-template-columns: 40px minmax(0, 1fr) auto;
		align-items: center;
		gap: 8px 20px;
		padding: 20px 4px;
		border-bottom: 1px solid var(--color-seam);
	}
	.row[hidden] {
		display: none;
	}
	/* Forge wash sweeping in from the left on hover. */
	.row::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--color-ember) 12%, transparent),
			transparent 70%
		);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.7s var(--ease-forge);
	}
	.row:hover::before,
	.row:focus-within::before {
		transform: scaleX(1);
	}
	.title-link {
		text-decoration: none;
		min-width: 0;
	}
	/* Stretched link: the whole row opens the project. */
	.title-link::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	.title {
		display: inline-block;
		font-size: clamp(1.4rem, 3.2vw, 2.4rem);
		line-height: 1.1;
		transition:
			transform 0.6s var(--ease-forge),
			color 0.3s;
	}
	.row:hover .title {
		transform: translateX(12px);
		color: var(--color-ember);
	}
	.cat,
	.dom,
	.status {
		display: none;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.detail {
		position: relative;
		z-index: 1;
		text-decoration: none;
		padding: 6px 0;
		transition: color 0.3s;
	}
	.detail:hover {
		color: var(--color-bone);
	}
	.go {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border: 1px solid var(--color-seam);
		border-radius: 50%;
		transition:
			transform 0.6s var(--ease-forge),
			background-color 0.3s,
			color 0.3s,
			border-color 0.3s;
	}
	.row:hover .go {
		transform: rotate(45deg);
		background: var(--color-bone);
		border-color: var(--color-bone);
		color: var(--color-void);
	}
	@media (min-width: 640px) {
		.row {
			grid-template-columns: 48px minmax(0, 1fr) auto auto;
		}
		.status {
			display: block;
		}
	}
	@media (min-width: 1024px) {
		.row {
			grid-template-columns: 48px minmax(0, 1.4fr) minmax(0, 1fr) 120px minmax(0, 0.9fr) auto;
		}
		.cat,
		.dom {
			display: block;
		}
	}
	.preview {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		width: 320px;
		aspect-ratio: 16 / 10;
		margin: -100px 0 0 40px;
		overflow: hidden;
		border: 1px solid var(--color-seam);
		border-radius: var(--radius-xs);
		background: var(--color-crypt);
		box-shadow: 0 30px 80px -20px color-mix(in srgb, var(--color-wyrm) 35%, transparent);
		pointer-events: none;
		visibility: hidden;
		opacity: 0;
	}
	.pv {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 0.35s;
	}
	.pv.show {
		opacity: 1;
	}
	@media (pointer: coarse) {
		.preview {
			display: none;
		}
	}
</style>
