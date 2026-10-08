<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal, splitReveal } from '#lib/motion/actions.ts';

	type Props = { label: string; title: string; children?: Snippet; id?: string };
	let { label, title, children, id }: Props = $props();
</script>

<header class="grid gap-3 md:grid-cols-[200px_1fr] md:items-baseline md:gap-6">
	<span class="label">{label}</span>
	<div>
		<h2
			{id}
			class="font-display text-display leading-[1.02] font-bold tracking-[0.01em]"
			use:splitReveal
		>
			{title}
		</h2>
		{#if children}
			<div class="mt-5 max-w-[62ch] text-lg text-ash" use:reveal>
				<p>{@render children()}</p>
			</div>
		{/if}
	</div>
</header>
