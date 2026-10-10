<script lang="ts">
	import type { ProjectImage } from '#lib/data/projects.ts';

	type Props = {
		image: ProjectImage;
		sizes?: string;
		class?: string;
		loading?: 'lazy' | 'eager';
		fetchpriority?: 'high' | 'low' | 'auto';
	};
	let {
		image,
		sizes = '100vw',
		class: klass = '',
		loading = 'lazy',
		fetchpriority = 'auto'
	}: Props = $props();

	const srcset = (ext: string) =>
		image.widths.map((w) => `${image.src}-${w}.${ext} ${w}w`).join(', ');
	const fallback = $derived(`${image.src}-${image.widths.at(-1)}.webp`);
</script>

<picture>
	<source type="image/avif" srcset={srcset('avif')} {sizes} />
	<source type="image/webp" srcset={srcset('webp')} {sizes} />
	<img
		src={fallback}
		alt={image.alt}
		width={image.width}
		height={image.height}
		{loading}
		{fetchpriority}
		decoding="async"
		class={klass}
		style:object-position={image.focus}
	/>
</picture>
