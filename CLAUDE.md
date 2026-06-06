# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
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

### Custom MDX Components

Registered in `mdx-components/` and injected at render time for project detail pages:
- `CADViewer.jsx` — 3D GLB model viewer (React Three Fiber + useGLTF); models live in `public/models/`
- `ImageSlideshow.jsx` — Embla carousel for project images
- `DemoBanner.tsx` — Demo/link banner

### Key Libraries

| Purpose | Library |
|---|---|
| MDX parsing | `next-mdx-remote`, `gray-matter` |
| Animation | `framer-motion` |
| 3D rendering | `three`, `@react-three/fiber`, `@react-three/drei` |
| UI components | `@mui/material` (accordion only) |
| Carousels | `embla-carousel-react` |
| Styling | Tailwind CSS 4 (via PostCSS, no tailwind.config.ts) |

### Path Aliases

`@/*` maps to the repo root (configured in `tsconfig.json`).
