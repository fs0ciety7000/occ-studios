import type { ProjectImage } from '#lib/data/projects.ts';

/** Shared lightbox state: any gallery can open it, the single <Lightbox> in the layout renders it. */
export const lightbox = $state<{
	images: ProjectImage[];
	index: number;
	title: string;
	/** Thumbnails, by index, so open/close can animate from and back to them. */
	origins: (HTMLElement | null)[];
	open: boolean;
}>({ images: [], index: 0, title: '', origins: [], open: false });

export function openLightbox(
	images: ProjectImage[],
	index: number,
	title: string,
	origins: (HTMLElement | null)[]
) {
	lightbox.images = images;
	lightbox.index = index;
	lightbox.title = title;
	lightbox.origins = origins;
	lightbox.open = true;
}
