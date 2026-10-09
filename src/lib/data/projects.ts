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
		slug: 'tape-taupe',
		title: 'Tape Taupe',
		url: 'https://taupe.fs0ciety.org',
		kind: 'game',
		category: 'Jeu · Arcade rétro',
		status: 'live',
		year: 2026,
		tagline: "Le tape-taupe d'arcade en pixel art, à jouer le temps d'une pause.",
		description:
			"Un jeu d'arcade rétro en 8 bits, jouable sur mobile comme sur ordinateur. Les taupes sortent de neuf trous de plus en plus vite : il faut les taper avant qu'elles ne replongent, éviter les bombes et tenir face aux boss. Les parties sont courtes, on rejoue en un geste et on compare son score au classement.",
		features: [
			'Quatre modes : Arcade, Défi du jour, Rush et Vengeance, plus un duel',
			'Combos, taupe dorée, bombes et bonus',
			'Trois boss, dont un boss final au niveau 12',
			'Classements par mode et par période, avec anti-triche',
			'Album de cartes, vestiaire, trophées et événements saisonniers',
			'Musique 8 bits synthétisée, carte de score à partager, PWA'
		],
		stack: ['Svelte 5', 'TypeScript', 'Vite', 'Bun', 'Hono', 'SQLite'],
		cta: 'Jouer à Tape Taupe',
		cover: img(
			'tape-taupe',
			'cover',
			[800, 1536],
			1536,
			960,
			'Illustration : trois taupes en bonnet tricoté sortent de leurs trous sous un maillet, en pixel art'
		),
		galleryKind: 'desktop',
		gallery: []
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
		slug: 'occ-deliveries',
		title: 'OCC Deliveries',
		url: 'https://eat.fs0ciety.org',
		kind: 'web',
		category: 'Application · Commandes groupées',
		status: 'live',
		year: 2026,
		tagline: "Qu'est-ce qu'on mange ? On vote, on commande, on se rembourse.",
		description:
			"L'outil des commandes de repas groupées au bureau. Un hôte ouvre une commande, l'équipe la rejoint avec un code, vote pour le restaurant puis chacun compose son panier. La commande part vers la plateforme de livraison et chacun rembourse le payeur en un scan.",
		features: [
			'Commande partagée, rejointe par code ou QR',
			'Vote en temps réel pour choisir le restaurant',
			'Paniers individuels avec options de menu',
			'Envoi vers les plateformes de livraison, ou export',
			'Remboursement par QR SEPA, Wero ou Bancontact',
			'Restaurants géolocalisés, menus synchronisés chaque nuit'
		],
		stack: ['React 19', 'Vite', 'Tailwind', 'TanStack Query', 'PocketBase', 'Go'],
		cta: 'Lancer une commande',
		cover: img(
			'occ-deliveries',
			'cover',
			[800, 1536],
			1536,
			960,
			'Illustration : sacs de livraison, boîtes à pizza et bols sur un bureau de nuit, un téléphone affiche un vote'
		),
		galleryKind: 'mixed',
		gallery: [
			img(
				'occ-deliveries',
				'shot-accueil',
				[720, 1440],
				1440,
				900,
				"Page d'accueil d'OCC Deliveries : lancer ou rejoindre une commande",
				'Accueil',
				'desktop'
			),
			img(
				'occ-deliveries',
				'shot-restos',
				[720, 1440],
				1440,
				900,
				'Liste des restaurants à proximité avec filtres par cuisine',
				'Restaurants',
				'desktop'
			),
			img(
				'occ-deliveries',
				'phone-accueil',
				[430],
				430,
				930,
				"Page d'accueil d'OCC Deliveries sur téléphone",
				'Mobile',
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
