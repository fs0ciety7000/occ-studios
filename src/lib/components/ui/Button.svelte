<script lang="ts">
	import type { Snippet } from 'svelte';
	import { magnetic } from '#lib/motion/actions.ts';

	type Props = {
		href: string;
		variant?: 'forge' | 'ghost';
		external?: boolean;
		arrow?: boolean;
		children: Snippet;
	};
	let { href, variant = 'forge', external = false, arrow = false, children }: Props = $props();
</script>

<a
	{href}
	class="btn btn-{variant}"
	use:magnetic
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener' : undefined}
>
	<span>{@render children()}</span>
	{#if arrow}<span class="arrow" aria-hidden="true">{external ? '↗' : '→'}</span>{/if}
</a>

<style>
	.btn {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		display: inline-flex;
		align-items: center;
		gap: 12px;
		padding: 16px 28px;
		border: 1px solid transparent;
		border-radius: var(--radius-xs);
		font-weight: 600;
		font-size: 0.95rem;
		letter-spacing: 0.04em;
		text-decoration: none;
		transition:
			color 0.3s,
			border-color 0.3s,
			box-shadow 0.4s;
	}
	.arrow {
		transition: transform 0.4s var(--ease-forge);
	}
	.btn:hover .arrow {
		transform: translateX(5px);
	}
	.btn-forge {
		background: var(--forge);
		color: var(--color-void);
	}
	.btn-forge::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(
			120deg,
			transparent 30%,
			rgb(255 255 255 / 0.45) 50%,
			transparent 70%
		);
		transform: translateX(-120%);
		transition: transform 0.8s var(--ease-forge);
	}
	.btn-forge:hover::after {
		transform: translateX(120%);
	}
	.btn-forge:hover {
		box-shadow: 0 10px 40px -8px color-mix(in srgb, var(--color-wyrm) 60%, transparent);
	}
	.btn-ghost {
		color: var(--color-bone);
		border-color: var(--color-seam);
	}
	.btn-ghost::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: var(--color-bone);
		transform: scaleY(0);
		transform-origin: bottom;
		transition: transform 0.5s var(--ease-forge);
	}
	.btn-ghost:hover {
		color: var(--color-void);
		border-color: var(--color-bone);
	}
	.btn-ghost:hover::before {
		transform: scaleY(1);
	}
</style>
