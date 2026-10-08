<script lang="ts">
	import { page } from '$app/state';
	import Button from '#lib/components/ui/Button.svelte';
</script>

<svelte:head><title>{page.status} — OCC MONS Studios</title></svelte:head>

<section class="wrap flex min-h-svh flex-col items-start justify-center gap-8 pt-32 pb-20">
	<span class="label">Erreur {page.status}</span>
	<h1 class="font-display text-display leading-none font-black">
		Ce passage <span class="text-forge">n'existe pas</span>.
	</h1>
	<p class="max-w-[48ch] text-lg text-ash">
		La page demandée a été déplacée ou n'a jamais été forgée. Revenez à l'accueil pour reprendre la
		route.
	</p>
	<Button href="/" arrow>Retour à l'accueil</Button>
</section>
