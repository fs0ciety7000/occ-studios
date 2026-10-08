<script lang="ts">
	import { statusLabel, type ProjectStatus } from '#lib/data/projects.ts';

	let { status }: { status: ProjectStatus } = $props();
</script>

<span class="status {status}">{statusLabel[status]}</span>

<style>
	.status {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 5px 12px;
		border-radius: 999px;
		border: 1px solid var(--color-seam);
		background: color-mix(in srgb, var(--color-void) 70%, transparent);
		backdrop-filter: blur(6px);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.status::before {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
		box-shadow: 0 0 10px currentColor;
	}
	.live {
		color: var(--color-ember);
	}
	.beta {
		color: var(--color-wyrm);
	}
	.dev {
		color: var(--color-ash);
	}
</style>
