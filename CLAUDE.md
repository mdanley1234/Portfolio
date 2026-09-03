# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build (prebuild regenerates lib/image-manifest.json)
npm run lint     # Run ESLint
npm start        # Start production server
```

There are no test commands configured.

## Architecture

**Next.js 16 App Router** portfolio site with server/client hybrid rendering and MDX-driven content.

### Routing

- `/` — Homepage: `app/page.tsx` (server) fetches data and passes it to `app/pageClient.tsx` (client, `'use client'`)
- `/projects` — Static listing page
- `/projects/[slug]` — Dynamic project detail pages; all slugs pre-rendered at build via `generateStaticParams()`

### Content System

All content lives as MDX files in `content/`:
- `content/projects/` — One file per project; only frontmatter is parsed by `lib/getProjects.tsx`
- `content/experiences/` — One file per experience; full MDX is compiled by `lib/getExperiences.tsx` using `next-mdx-remote`

**Project frontmatter schema:**
```yaml
title, start, end, summary, coverImage, tags (string[]), rank (sort order)
```

**Experience frontmatter schema:**
```yaml
company, position, start, end
```

### Images

`public/images/` is WebP only. `scripts/image-manifest.mjs` records every
intrinsic size into `lib/image-manifest.json` at build time so content images
render through `next/image` with a reserved box and no layout shift.

`lib/remark-mdx-elements.mjs` rewrites literal `<img>` and `<iframe>` tags in
MDX to `MdxImage` / `MdxEmbed` — MDX does not route lowercase JSX through the
`components` map on its own. **Keep writing plain `<img>` in MDX; it is
upgraded automatically.**

After adding images, run `node scripts/image-manifest.mjs` (or just build).

### Prose styling

Project pages render inside `prose prose-invert` from
`@tailwindcss/typography`. Two of its defaults are overridden in
`app/globals.css`: inline `<code>` otherwise ships literal backtick
pseudo-elements, and `<pre>` otherwise sits on a 50%-black panel that is
invisible against this page. `rehype-highlight` emits `hljs` class names but
no theme, so the tokens there are separated by weight and opacity rather than
by hue, to stay inside the site's monochrome palette.

### Performance constraints

Deliberate. Do not undo these.

- `DarkVeil`'s fragment shader is a per-pixel CPPN. Its drawing buffer is
  capped at 1280x720 regardless of viewport, throttled to 30 fps, and
  suspended entirely when off-screen or backgrounded. It must **not** call
  `loseContext()` on unmount — that poisons the canvas for React's development
  remount and throws on the next `createProgram`.
- `three` / `@react-three/drei` (~600 kB) load only when a `CADViewer` scrolls
  within 400 px, via `mdx-components/CADScene.jsx`. Lighting is a local
  three-point rig — never `<Environment preset>`, which fetches a
  multi-megabyte HDR from a third-party CDN.
- `Rubik` is loaded as a variable font (no `weight` array). Listing static
  weights downloads four files and leaves `font-semibold` (600) — which the UI
  uses — to be synthesized by the browser.
- GLB models are meshopt-compressed
  (`npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt`).
  drei's `useGLTF` bundles the meshopt decoder; Draco would pull one from a CDN.

### Custom MDX Components

Registered in `mdx-components/` and injected at render time for project detail pages:
- `CADViewer.jsx` — 3D GLB model viewer shell; mounts `CADScene.jsx` (React Three Fiber + useGLTF) only once scrolled into range. Models live in `public/models/`
- `ImageSlideshow.jsx` — Embla carousel for project images
- `DemoBanner.tsx` — Demo/link banner
- `MdxImage.tsx` / `MdxEmbed.tsx` — automatic `next/image` and lazy iframes for MDX content

### Shared UI

- `lib/MobileNav.jsx` — the header menu below `md`, used by both `app/pageClient.tsx` and `app/projects/[slug]/page.tsx`
- `lib/ExperienceTimeline.jsx` — the experience section. Orders entries by an optional frontmatter `rank`, otherwise ongoing roles first then by `end` date descending (the order a resume uses); a role whose `end` is "Present" gets a filled timeline node. From `xl` entries alternate sides and the rail steps with them — offset `DELTA` right on a left-hand entry, `DELTA` left on a right-hand one, joined by a horizontal jog in the gap between the two, so each card gains `DELTA` over an even split. Below `xl` it collapses to a single left-rail column, because half a container is too narrow to read in. Plain React + framer-motion, no component library.

### Key Libraries

| Purpose | Library |
|---|---|
| MDX parsing | `next-mdx-remote`, `gray-matter` |
| Animation | `framer-motion` |
| 3D rendering | `three`, `@react-three/fiber`, `@react-three/drei` |
| Carousels | `embla-carousel-react` |
| Styling | Tailwind CSS 4 (via PostCSS, no tailwind.config.ts) |
| Image pipeline | `sharp` (dev/build only) |

### Path Aliases

`@/*` maps to the repo root (configured in `tsconfig.json`).
