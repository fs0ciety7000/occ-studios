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
	galleryKind: 'desktop' | 'phone';
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
	caption?: string
): ProjectImage => ({ src: `/projects/${slug}/${name}`, widths, width, height, alt, caption });

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
		tagline: "L'équilibre parfait pour votre foyer.",
		description:
			'Le gestionnaire des tâches du foyer pour les couples. Tandem répartit les corvées entre deux personnes, gère les répétitions et les tours de rôle, et publie tout dans un calendrier Google partagé. Site web et application Android native, utilisables hors ligne et synchronisés en temps réel.',
		features: [
			'Ajout rapide en langage naturel',
			'Répétitions et tours de rôle',
			'Liste de courses partagée, rangée par rayon',
			'Hors ligne et synchronisé en temps réel',
			'Widgets Android et notifications'
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
		galleryKind: 'phone',
		gallery: [
			img(
				'tandem',
				'phone-today',
				[480],
				480,
				960,
				"Écran Aujourd'hui de Tandem sur Android",
				"Aujourd'hui"
			),
			img(
				'tandem',
				'phone-calendar',
				[480],
				480,
				960,
				'Calendrier mensuel de Tandem',
				'Calendrier'
			),
			img(
				'tandem',
				'phone-dark',
				[480],
				480,
				960,
				'Tandem en mode sombre, hors ligne',
				'Mode sombre, hors ligne'
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
			'shot-dashboard',
			[720, 1440],
			1440,
			900,
			'Tableau de bord de CSM : commandes du jour, raccourcis et commandes à confirmer (données floutées)'
		),
		galleryKind: 'desktop',
		gallery: []
	}
];
