export const site = {
	name: 'OCC MONS Studios',
	shortName: 'OCC MONS',
	url: 'https://studios.fs0ciety.org',
	description:
		'Studio de jeux vidéo et de développement web né à Mons. Nous forgeons des mondes jouables et des expériences web taillées pour durer.',
	location: 'Mons, Belgique',
	coords: '50.4542° N · 3.9523° E',
	/** Public contact address. Leave null to hide the contact block. */
	email: null as string | null,
	year: new Date().getFullYear()
};

export const nav = [
	{ href: '/#studio', label: 'Studio' },
	{ href: '/#projets', label: 'Projets' },
	{ href: '/#index', label: 'Index' }
];
