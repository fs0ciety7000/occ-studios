<script lang="ts">
	import { projects } from '#lib/data/projects.ts';
	import { site } from '#lib/data/site.ts';

	type Props = { title?: string; description?: string; path?: string };
	let {
		title = `${site.name} — Jeux vidéo & développement web`,
		description = site.description,
		path = '/'
	}: Props = $props();

	const url = $derived(new URL(path, site.url).href);
	const jsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: site.name,
			url: site.url,
			logo: `${site.url}/apple-touch-icon.png`,
			description: site.description,
			address: { '@type': 'PostalAddress', addressLocality: 'Mons', addressCountry: 'BE' },
			makesOffer: projects.map((p) => ({ '@type': 'CreativeWork', name: p.title, url: p.url }))
		}).replace(/</g, '\\u003c')
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content="fr_BE" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content="{site.url}/og-image.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>
