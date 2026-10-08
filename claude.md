# claude.md — Mémoire projet OCC MONS Studios

> Fichier de contexte persistant. À relire au début de chaque session et à mettre à jour à chaque étape franchie.

## 1. Mes instructions (règles de travail)

- Rôles : Dev Full-Stack Senior + Expert UI/UX + Directeur Artistique.
- Procéder **étape par étape**. **Ne jamais enchaîner sur l'étape suivante sans la validation explicite** de l'utilisateur aux points de PAUSE.
- Mettre à jour ce fichier (sections *Statut* et *Todo*) à chaque étape franchie ou décision prise.
- Langue : échanges et contenus du site en **français** ; code, noms de fichiers et commentaires techniques en anglais ; prompts Midjourney en **anglais**.
- Branche de travail : `ccr-f282907a-41jd8i`. Commits clairs et atomiques, push sur cette branche uniquement. Pas de PR sans demande explicite.
- Code modulaire : un composant = une responsabilité ; les données (projets) sont séparées de la présentation.
- Performance d'abord : site prérendu statique, JS minimal, images AVIF/WebP, polices auto-hébergées, `prefers-reduced-motion` respecté partout.
- Accessibilité : contrastes AA minimum, focus visible, navigation clavier, textes alternatifs.

## 2. Contexte du projet

| Élément | Valeur |
|---|---|
| Nom | **OCC MONS Studios** |
| Activité | Studio de jeux vidéo + développement web |
| Type de site | Site vitrine (one-page + pages projets éventuelles) |
| Vibe | Sombre, moderne, premium, très performant, animations fluides |
| Inspirations | Santa Monica Studio (sms.playstation.com), CD Projekt Red (cdprojektred.com) |
| Projets initiaux | `empire.fs0ciety.org`, `test-csm.fs0ciety.org` (système extensible) |
| Déploiement | Coolify → `studios.fs0ciety.org` |

### Identité de marque (logos fournis, dans `brand/`)

- `logo-emblem-coil.png` — tour + dragon enroulé, trait fin, dégradé ambre → magenta. **Candidat emblème principal.**
- `logo-emblem-crest.png` — dragon perché sur une tour crénelée, trait fin. **Candidat favicon / mark compact.**
- `logo-wordmark.png` — dragon + tour en aplats + texte « OCC MONS ». Plus chargé ; candidat pour usages « affiche ».
- Motif commun : **une tour (beffroi) et un dragon** — écho au Beffroi de Mons et au Doudou (combat de saint Georges et du dragon). À confirmer avec l'utilisateur avant d'en faire un axe narratif.

## 3. Choix architecturaux (proposés — en attente de validation)

### Stack

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | **SvelteKit 2 + Svelte 5 (runes)**, TypeScript | Runtime minuscule (pas de VDOM), compile en JS natif, idéal pour un site vitrine ultra-rapide. Next.js est excellent mais embarque React (~45 kB gz) et une infra serveur inutile ici. |
| Rendu | `@sveltejs/adapter-static` (prerender intégral) | HTML pur servi par un serveur statique : TTFB minimal, 100 % cacheable, aucune surface serveur. |
| Styles | **Tailwind CSS v4** (`@tailwindcss/vite`) + tokens via `@theme` | Design tokens = variables CSS natives, zéro config JS, purge automatique. |
| Animations | **GSAP 3.13+** : core, `ScrollTrigger`, `SplitText` (gratuits depuis la 3.13) | Imposé. Timelines d'intro, reveals au scroll, effets de survol magnétiques. |
| Smooth scroll | **Lenis** synchronisé sur le ticker GSAP | Défilement « inertiel » des sites AAA, compatible ScrollTrigger. |
| Polices | `@fontsource` (auto-hébergées, subset latin, `font-display: swap`) | Pas de requête tierce, pas de FOIT. |
| Images | `@sveltejs/enhanced-img` | AVIF/WebP + `srcset` générés au build. |
| Qualité | ESLint, Prettier, `svelte-check` | Code propre et typé. |
| Déploiement | Dockerfile multi-stage : build Node 22 → **Caddy** (ou nginx) alpine | Image légère (~50 Mo), gzip/zstd, cache immutable sur `/_app/immutable`. Coolify détecte le Dockerfile. |

### Structure cible (étape 3)

```
src/
  lib/
    data/projects.ts        # source unique des projets (ajout = 1 objet)
    gsap/                   # setup GSAP + Lenis, actions Svelte (use:reveal, use:magnetic, use:tilt)
    components/
      layout/  Header, Footer
      sections/ Hero, Studio, Projects
      ui/      Button, ProjectCard, SectionLabel, EmberField
  routes/
    +layout.svelte  +page.svelte
    projets/[slug]/+page.svelte   # optionnel, prérendu depuis projects.ts
static/  brand/, favicon, og-image
```

### Système de projets extensible

Un projet = une entrée typée dans `src/lib/data/projects.ts` :

```ts
type Project = {
  slug: string; title: string; url: string;
  kind: 'game' | 'web'; status: 'live' | 'beta' | 'dev';
  tagline: string; description: string; stack: string[];
  cover: string; accent?: string; year: number;
};
```

Les sections et les éventuelles pages détail sont générées à partir de ce tableau.

## 4. Design System (v0.1 — proposé)

Planche de validation : `moodboard/index.html` (aperçu en ligne : https://claude.ai/artifact/LP8EwUYpAqRiEWMfT3BmtW).

### Couleurs (dark-first, dérivées du logo)

| Token | Hex | Usage |
|---|---|---|
| `--void` | `#08070B` | Fond principal (noir légèrement violacé) |
| `--crypt` | `#110E15` | Surfaces, sections alternées |
| `--stone` | `#1C1821` | Cartes, champs |
| `--seam` | `#2E2733` | Bordures, séparateurs |
| `--bone` | `#EFE8E1` | Texte principal (blanc os, chaud) |
| `--ash` | `#9D94A3` | Texte secondaire |
| `--ember` | `#F6A04D` | Accent ambre (haut du dégradé) |
| `--blaze` | `#FF6A3D` | Accent intermédiaire |
| `--wyrm` | `#FF2E8B` | Accent magenta (bas du dégradé) |
| `--grad-forge` | `linear-gradient(120deg, ember → blaze → wyrm)` | CTA, titres clés, liserés, glow |

Règle : le dégradé est **rare** (CTA principal, un mot-clé par section, halos). Le reste vit en bone/ash sur void.

### Typographie

| Rôle | Police | Usage |
|---|---|---|
| Display | **Cinzel** (600–900) | Titres héroïques, capitales lapidaires (filiation God of War / médiéval du beffroi) |
| Texte | **Hanken Grotesk** (400–700) | Corps, UI, boutons |
| Utilitaire | **JetBrains Mono** (400–500) | Labels, métadonnées, statuts, coordonnées |

Échelle fluide (clamp) : `xs 0.75 · sm 0.875 · base 1 · lg 1.25 · xl 1.6 · 2xl 2.2 · 3xl 3.2 · hero clamp(3rem, 9vw, 8.5rem)`. Labels mono en capitales, `letter-spacing: 0.18em`.

### Espacements, rayons, motion

- Grille de 4 px : `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192`.
- Conteneur max 1320 px, gouttière `clamp(16px, 4vw, 48px)`.
- Rayons : quasi nuls (2 px) pour l'aspect « gravé » ; 999 px réservé aux pastilles de statut.
- Motion : easing signature `expo.out` (entrées), `power3.inOut` (transitions) ; durées 0.6 / 0.9 / 1.4 s ; stagger 0.03 s par lettre, 0.08 s par bloc.
- Hover : boutons magnétiques, balayage du dégradé, cartes en tilt 3D léger + halo qui suit le curseur.

## 5. Statut

- [x] **Étape 1** — `claude.md` créé.
- [x] **Étape 2** — Stack proposée, Design System v0.1, planche `moodboard/index.html` générée.
- [ ] ⏸️ **PAUSE** — En attente de la validation de la planche (couleurs, typos, boutons, animations, choix du logo).
- [ ] Étape 3 — Développement des pages.
- [ ] Étape 4 — Prompts Midjourney pour les assets manquants.
- [ ] Étape 5 — Dockerfile / config Coolify pour `studios.fs0ciety.org`.

## 6. Todo

### Questions ouvertes pour l'utilisateur
- [ ] Valider la stack (SvelteKit + Tailwind v4 + GSAP + Lenis, statique + Caddy).
- [ ] Valider la palette et les typos (ou ajustements).
- [ ] Choisir l'emblème principal et le mark compact.
- [ ] Confirmer le lien Mons / Beffroi / Doudou comme fil narratif.
- [ ] Fournir descriptions, stack et visuels des projets empire / test-csm (sinon placeholders + prompts Midjourney).
- [ ] Contact : adresse e-mail, réseaux sociaux à afficher dans le footer.

### Étape 3 (après validation)
- [ ] Init SvelteKit + Tailwind v4 + tokens `@theme`.
- [ ] Setup GSAP (ScrollTrigger, SplitText) + Lenis, actions Svelte réutilisables.
- [ ] Header (nav, état au scroll), Hero (intro motion), Studio, Projets (slider/cartes), Footer.
- [ ] `projects.ts` + génération des cartes.
- [ ] SEO : meta, Open Graph, sitemap, robots.

### Étape 5
- [ ] Dockerfile multi-stage + Caddyfile (headers de cache, compression).
- [ ] Notes Coolify (port, domaine, healthcheck).
