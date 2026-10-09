<script lang="ts">
	import { onMount } from 'svelte';
	import { nav, site } from '#lib/data/site.ts';

	let hidden = $state(false);
	let scrolled = $state(false);

	onMount(() => {
		let last = scrollY;
		const onScroll = () => {
			const y = scrollY;
			scrolled = y > 24;
			hidden = y > 320 && y > last;
			last = y;
		};
		onScroll();
		addEventListener('scroll', onScroll, { passive: true });
		return () => removeEventListener('scroll', onScroll);
	});
</script>

<header class="bar" class:hidden class:scrolled>
	<div class="wrap flex items-center justify-between gap-6 py-4">
		<a
			href="/"
			class="group flex items-center gap-3 no-underline"
			aria-label="{site.name}, accueil"
		>
			<img src="/brand/mark.webp" alt="" width="40" height="40" class="size-10" />
			<span class="font-display text-[1.05rem] font-bold tracking-[0.12em] whitespace-nowrap max-[420px]:sr-only">
				OCC <span class="text-forge">MONS</span>
			</span>
		</a>
		<nav aria-label="Navigation principale" class="flex items-center gap-4 sm:gap-10">
			{#each nav as item (item.href)}
				<a href={item.href} class="label nav-link">{item.label}</a>
			{/each}
		</nav>
	</div>
</header>

<style>
	.bar {
		position: fixed;
		inset: 0 0 auto;
		z-index: 50;
		padding-top: env(safe-area-inset-top, 0px);
		border-bottom: 1px solid transparent;
		transition:
			transform 0.6s var(--ease-forge),
			background-color 0.4s,
			border-color 0.4s;
	}
	.bar.scrolled {
		background: color-mix(in srgb, var(--color-void) 78%, transparent);
		backdrop-filter: blur(12px);
		border-color: var(--color-seam);
	}
	.bar.hidden {
		transform: translateY(-100%);
	}
	.nav-link {
		position: relative;
		text-decoration: none;
		transition: color 0.3s;
	}
	.nav-link:hover {
		color: var(--color-bone);
	}
	.nav-link::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -6px;
		height: 1px;
		background: var(--forge);
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.5s var(--ease-forge);
	}
	.nav-link:hover::after {
		transform: scaleX(1);
		transform-origin: left;
	}
</style>
