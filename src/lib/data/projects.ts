/**
 * Single source of truth for the showcased projects.
 * To add a project: drop its images in `static/projects/<slug>/` (see README) and append an entry.
 */

export type ProjectImage = {
	/** Path without the `-<width>.<ext>` suffix, e.g. `/projects/tandem/cover`. */
	src: string;
	/** Widths available on disk, as both `.avif` and `.webp`. */
	widths: number[];
	/** Intrinsic ratio of the exported files. */
	width: number;
	height: number;
	alt: string;
	/** Caption shown in the gallery. */
	caption?: string;
	/** Device frame used in mixed galleries. */
	device?: 'desktop' | 'phone';
};

export type ProjectStatus = 'live' | 'beta' | 'dev';

export type Project = {
	slug: string;
	title: string;
	url: string;
	kind: 'game' | 'web' | 'app';
	category: string;
	status: ProjectStatus;
	year: number;
	tagline: string;
	description: string;
	features: string[];
	stack: string[];
	cta: string;
	/** Optional verified figure shown next to the project. */
	highlight?: { value: string; label: string };
	cover: ProjectImage;
	gallery: ProjectImage[];
	/** Gallery layout: landscape screenshots or phone screens. */
	galleryKind: 'desktop' | 'phone' | 'mixed';
};

export const statusLabel: Record<ProjectStatus, string> = {
	live: 'En ligne',
	beta: 'En test',
	dev: 'En forge'
};

const img = (
	slug: string,
	name: string,
	widths: number[],
	width: number,
	height: number,
	alt: string,
	caption?: string,
	device?: ProjectImage['device']
): ProjectImage => ({
	src: `/projects/${slug}/${name}`,
	widths,
	width,
	height,
	alt,
	caption,
	device
});

export const projects: Project[] = [
	{
		slug: 'cosmic-empires',
		title: 'Cosmic Empires',
		url: 'https://empire.fs0ciety.org',
		kind: 'game',
		category: 'Jeu · Stratégie 4X spatiale',
		status: 'live',
		year: 2026,
		tagline: 'Bâtissez un empire galactique, en temps réel, dans le navigateur.',
		description:
			'Un jeu de stratégie multijoueur persistant. Chaque joueur développe ses planètes, recherche de nouvelles technologies, construit ses flottes et étend son territoire face aux autres joueurs, aux pirates et aux boss de saison. Le serveur fait autorité sur toutes les règles et synchronise la partie en direct sur tous les appareils.',
		features: [
			'Économie, recherche et chantier naval à paliers',
			'Flottes : attaque, espionnage, expéditions, simulateur de combat',
			'Boss de saison, pirates et chasseurs de primes',
			'Alliances, territoires et guerres',
			'Saisons, ligues et passe de saison'
		],
		stack: ['React', 'TypeScript', 'Vite', 'GSAP', 'three.js', 'PocketBase'],
		cta: "Entrer dans l'Empire",
		highlight: { value: '206', label: 'notes de version publiées' },
		cover: img(
			'empire',
			'cover',
			[800, 1600],
			1600,
			1000,
			'Illustration de Cosmic Empires : une flotte de vaisseaux passe devant une planète embrasée'
		),
		galleryKind: 'desktop',
		gallery: [
			img(
				'empire',
				'shot-accueil',
				[720, 1440],
				1440,
				900,
				'Poste de commandement de Cosmic Empires',
				'Poste de commandement'
			),
			img(
				'empire',
				'shot-galaxie',
				[720, 1440],
				1440,
				900,
				'Carte galactique de Cosmic Empires',
				'Carte galactique'
			),
			img(
				'empire',
				'shot-batiments',
				[720, 1440],
				1440,
				900,
				'Écran des bâtiments de Cosmic Empires',
				'Bâtiments'
			)
		]
	},
	{
		slug: 'tandem',
		title: 'Tandem',
		url: 'https://tandem-agenda.app',
		kind: 'app',
		category: 'Application · Web & Android',
		status: 'live',
		year: 2026,
		tagline: "L'agenda partagé du foyer, pour s'organiser à deux.",
		description:
			"Tandem organise le quotidien d'un foyer à deux : tâches, tours de rôle, courses, repas, dépenses et calendrier. On ouvre l'app, on voit ce qu'il y a à faire aujourd'hui, on coche. Tout se synchronise en direct entre le web et Android, fonctionne hors ligne et se connecte à Google Agenda. Disponible en français, en anglais et en néerlandais.",
		features: [
			'Ajout rapide en langage naturel',
			'Répétitions et tours de rôle qui alternent seuls',
			'Courses et menus partagés, rangés par rayon',
			'Dépenses communes, soldes et budget du mois',
			'Calendrier synchronisé avec Google Agenda',
			'Hors ligne, temps réel, widgets Android'
		],
		stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Redis', 'Kotlin', 'Jetpack Compose'],
		cta: 'Découvrir Tandem',
		highlight: { value: 'AA', label: 'WCAG 2.2, audit sans violation' },
		cover: img(
			'tandem',
			'cover',
			[800, 1600],
			1600,
			1000,
			"Page d'accueil de Tandem avec l'application ouverte sur un téléphone"
		),
		galleryKind: 'mixed',
		gallery: [
			img(
				'tandem',
				'shot-accueil',
				[720, 1440],
				1440,
				900,
				"Écran Aujourd'hui de Tandem sur ordinateur, avec un foyer de démonstration",
				"Aujourd'hui",
				'desktop'
			),
			img(
				'tandem',
				'shot-calendrier',
				[720, 1440],
				1440,
				900,
				'Calendrier de Tandem en vue semaine',
				'Calendrier · semaine',
				'desktop'
			),
			img(
				'tandem',
				'phone-accueil',
				[430],
				430,
				930,
				"Écran Aujourd'hui de Tandem sur téléphone",
				'Mobile',
				'phone'
			),
			img(
				'tandem',
				'phone-notes',
				[430],
				430,
				930,
				'Notes partagées dans Tandem sur téléphone',
				'Notes partagées',
				'phone'
			)
		]
	},
	{
		slug: 'csm',
		title: 'CSM',
		url: 'https://test-csm.fs0ciety.org',
		kind: 'web',
		category: 'Outil métier · Exploitation ferroviaire',
		status: 'beta',
		year: 2026,
		tagline: "Le poste de pilotage quotidien d'un centre d'exploitation ferroviaire.",
		description:
			"Une application métier pensée pour les équipes d'exploitation. Elle centralise les commandes de bus et de taxis de remplacement, l'assistance aux voyageurs à mobilité réduite, le suivi des perturbations et une main courante partagée. Les bons de commande sont générés en PDF et par e-mail.",
		features: [
			'Commandes de bus et de taxis de remplacement',
			'Assistance aux voyageurs à mobilité réduite',
			'Main courante collaborative',
			'Tableau de bord personnalisable, en direct',
			'Accès par rôles, PWA, export PDF'
		],
		stack: ['SvelteKit', 'Svelte 5', 'Tailwind', 'Supabase', 'PostgreSQL'],
		cta: 'Accès sur invitation',
		cover: img(
			'csm',
			'cover',
			[800, 1376],
			1376,
			860,
			'Illustration : salle de contrôle ferroviaire de nuit, écrans de schémas de voies face aux quais sous la pluie'
		),
		galleryKind: 'desktop',
		gallery: [
			img(
				'csm',
				'shot-dashboard',
				[720, 1440],
				1440,
				900,
				'Tableau de bord de CSM : commandes du jour, raccourcis et commandes à confirmer (données floutées)',
				'Tableau de bord (données floutées)'
			)
		]
	}
];
