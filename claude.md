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
| Projets | Cosmic Empires (`empire.fs0ciety.org`), Tandem (`tandem-agenda.app`), CSM (`test-csm.fs0ciety.org`) — extensible via `projects.ts` |
| Contact | Pas de réseaux sociaux. E-mail : non fourni (`site.email = null`, bloc masqué) |
| Déploiement | Coolify → `studios.fs0ciety.org` |

### Identité de marque (logos fournis, dans `brand/`)

- Emblème principal (validé) : `logo-emblem-coil.png` (tour enlacée) → `static/brand/emblem-*.{avif,webp}` (fond rendu transparent).
- Mark compact / favicon (validé) : `logo-emblem-crest.png` → `static/brand/mark.webp`, `static/favicon.png`, `static/apple-touch-icon.png`.
- `logo-wordmark.png` : son lettrage « OCC MONS » est réutilisé dans `static/og-image.jpg`.
- Récit validé : Mons, le Beffroi et le Doudou (tour + dragon). Coordonnées 50.4542° N · 3.9523° E.

### Sources des projets (dépôts GitHub de l'utilisateur)
- Cosmic Empires = `fs0ciety7000/ogame-like` (visuels repris de `public/assets` et `public/bible/shots`). Éviter le terme « OGame » (marque).
- Tandem = `fs0ciety7000/agenda` (visuels de `assets/site` et `docs/screenshots/android`).
- CSM = `fs0ciety7000/baco-svelte`. **Confidentiel** : ne jamais citer l'employeur (opérateur ferroviaire belge), ni ses logos, ni des noms de personnes, de gares ou de codes internes. Présentation générique « outil d'exploitation ferroviaire ». Capture actuelle = tableau de bord fourni par l'utilisateur, zones nominatives floutées.
- Demandes envoyées le 08/10 aux sessions de ces projets : captures + `showcase/README.md` à pousser sur une branche `occ-studios-showcase` de chaque dépôt. À récupérer quand disponibles.

## 3. Choix architecturaux (validés)

### Stack

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | **SvelteKit 3 + Svelte 5 (runes)**, TypeScript | Runtime minuscule, idéal pour un site vitrine. |
| Config | Dans `vite.config.ts` via `sveltekit({...})` | SvelteKit 3 ne lit plus `svelte.config.js`. |
| Alias | `#lib/...` (subpath imports de `package.json`), extension `.ts` explicite pour les modules TS | `$lib` est supprimé dans Kit 3. |
| Rendu | `@sveltejs/adapter-static` (prerender intégral, `precompress`, fallback `404.html`) | HTML pur, 100 % cacheable. |
| Styles | **Tailwind CSS v4** + tokens `@theme` dans `src/app.css` | |
| Animations | **GSAP 3.15** : `ScrollTrigger`, `SplitText` ; **Lenis** synchronisé sur le ticker GSAP | |
| Polices | `@fontsource-variable` (Cinzel, Hanken Grotesk, JetBrains Mono) | Auto-hébergées. |
| Images | Pré-converties en AVIF + WebP (script Python/PIL), composant `Picture.svelte` | Pas de dépendance `sharp`. |
| Qualité | Prettier, `svelte-check` | |
| Déploiement | Dockerfile multi-stage Node 22 → **Caddy 2** alpine, port 80, `/healthz` | Coolify (Traefik) gère le TLS. |

### Structure (en place)

```
src/
  app.css                      # design tokens Tailwind v4
  lib/
    data/projects.ts           # source unique des projets
    data/site.ts               # nom, URL, coordonnées, e-mail (null = masqué)
    motion/gsap.ts             # registre GSAP + helpers reduced-motion / pointer
    motion/smooth-scroll.ts    # Lenis
    motion/actions.ts          # use:reveal, splitReveal, parallax, magnetic, tilt, wipe
    components/layout/         # Header, Footer, Seo
    components/sections/       # Hero, Studio, Projects, ProjectFeature
    components/ui/             # Button, Picture, Status, SectionHead, EmberField
  routes/ +layout(.ts|.svelte), +page.svelte, +error.svelte, sitemap.xml/+server.ts
static/ brand/, projects/<slug>/, favicon, og-image.jpg, robots.txt
moodboard/                     # planche v0.1 (référence, hors build)
docs/midjourney-prompts.md     # étape 4
Dockerfile, Caddyfile          # étape 5
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

- [x] **Étape 1** : `claude.md`.
- [x] **Étape 2** : stack et design system **validés par l'utilisateur** (planche https://claude.ai/artifact/LP8EwUYpAqRiEWMfT3BmtW).
- [x] **Étape 3** : site développé (Header, Hero, Studio, Projets ×3, Footer, 404, SEO). `npm run check` et `npm run build` passent. Pas de débordement horizontal à 400 px ni à 1440 px.
- [x] **Étape 4** : prompts Midjourney dans `docs/midjourney-prompts.md`.
- [x] **Étape 5** : `Dockerfile` + `Caddyfile` + `.dockerignore`. ⚠️ Pas de démon Docker dans l'environnement : image non testée localement.
- [x] **Déployé** le 08/10/2026 sur Coolify (accord de l'utilisateur) : application « OCC MONS Studios », uuid `9xhi3ncrkkffgq1q2a5f8ued`, projet Main Stack / production, serveur `localhost`, branche `ccr-f282907a-41jd8i`, Dockerfile, port 80, healthcheck `/healthz`. Premier déploiement `finished`, conteneur `running:healthy`. API : `$COOLIFY_API_URL` + `$COOLIFY_API_TOKEN`.
- [ ] ⏸️ Retour utilisateur sur le site en ligne.

## 6. Todo

- [ ] Récupérer les branches `occ-studios-showcase` (ogame-like, agenda, baco-svelte) et remplacer ou compléter les visuels et textes.
- [ ] Remplacer la couverture de CSM (capture claire floutée) par l'image Midjourney n° 1.
- [ ] Intégrer les autres images Midjourney si l'utilisateur les génère (fond du hero, textures, disciplines).
- [ ] E-mail de contact : à renseigner dans `site.ts` si l'utilisateur le souhaite.
- [ ] Vérifier le site depuis un navigateur (le proxy de la session cloud bloque studios.fs0ciety.org) ; audit Lighthouse sur studios.fs0ciety.org et vérification de l'aperçu Open Graph.
