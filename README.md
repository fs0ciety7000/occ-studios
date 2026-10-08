# OCC MONS Studios

Site vitrine du studio : https://studios.fs0ciety.org

SvelteKit 3 (prerender statique) · Svelte 5 · Tailwind CSS v4 · GSAP (ScrollTrigger, SplitText) · Lenis · Caddy.

## Développement

```bash
npm install
npm run dev       # http://localhost:5173
npm run check     # svelte-check / TypeScript
npm run build     # génère build/ (HTML prérendu + .br/.gz)
npm run preview
```

## Structure

```
src/lib/data/projects.ts   projets affichés (source unique)
src/lib/data/site.ts       nom, URL, coordonnées, e-mail de contact (null = masqué)
src/lib/motion/            setup GSAP, Lenis, actions Svelte (reveal, splitReveal, parallax, magnetic, tilt, wipe)
src/lib/components/        layout/ (Header, Footer, Seo) · sections/ (Hero, Studio, Projects) · ui/
static/projects/<slug>/    images des projets en .avif + .webp
```

Les imports internes passent par `#lib/...` (subpath imports, SvelteKit 3), avec l'extension `.ts` pour les modules TypeScript.

## Ajouter un projet

1. Exporter les images dans `static/projects/<slug>/` sous la forme `<nom>-<largeur>.avif` et `<nom>-<largeur>.webp`
   (couverture en 16:10, par exemple `cover-800` et `cover-1600`).
2. Ajouter une entrée au tableau `projects` dans `src/lib/data/projects.ts`.

La section Projets, le footer et les données structurées se mettent à jour automatiquement.

## Déploiement (Coolify)

1. Nouvelle ressource → dépôt Git → **Build Pack : Dockerfile**.
2. Port exposé : **80**. Domaine : `https://studios.fs0ciety.org`.
3. Healthcheck : `GET /healthz` (déjà déclaré dans le Dockerfile).

Le Dockerfile construit le site avec Node 22, puis le sert avec Caddy. Caddy sert les fichiers précompressés (brotli/gzip), met en cache immuable les ressources hashées et renvoie `404.html` pour les pages inconnues. Coolify (Traefik) gère le HTTPS.
