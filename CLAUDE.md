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
# Read by lib/getProjects.tsx — feeds the homepage carousel and /projects
title, start, end, summary, coverImage, tags (string[]), rank (sort order)

# Read straight off matter() in app/projects/[slug]/page.tsx — feature layout only
layout: "feature"   # opt-in. Without it the page renders heading-first, as before
heroImage           # banner image; falls back to coverImage
heroAlt
heroPosition        # object-position for the banner crop, e.g. "68% 58%"
heroScale           # scale() on the banner image; last resort, see below
tagline             # one line under the banner title; falls back to summary
facts               # [{ label, value }] — becomes the Specifications table
```

`rank` orders three things and they have to agree: the homepage carousel,
`/projects`, and the "Next project" link at the foot of a detail page (which
wraps from the last project back to the first).

`summary` and `tagline` are two different sentences about the same project and
appear within one screen of each other on a feature page. Write them so they do
not echo — the card summary sells it, the tagline names what it is.

`heroScale` zooms the banner and therefore crops differently at every viewport;
it leaked a fragment of a CAD annotation into view on mobile once. Prefer
cutting a dedicated hero crop into `public/images/` over reaching for it.

**Experience frontmatter schema:**
```yaml
company, position, start, end
```

### Project detail pages

`layout: "feature"` composes the page from three pieces around the MDX body:

- `lib/ProjectHero.tsx` — full-bleed banner with the title over its foot, then
  a status dot (`/present/i.test(end)`, the same convention
  `ExperienceTimeline` uses), the dates, and the tags. `heroImage` is a
  separate field from `coverImage` on purpose: a card cover is often a light
  product shot that dies under the banner scrim. The scrim itself
  (`.project-hero-scrim` in `app/globals.css`) darkens both ends, not one: the
  fixed header sits over the top of the banner and the title over its foot, so
  both need cover whatever the photograph does in between.
- `lib/ProjectFacts.tsx` — the Specifications `<dl>`. Renders nothing when
  `facts` is absent.
- `lib/ProjectNextLink.tsx` — the cross-nav card at the foot. It sits on the
  opaque `card-background` token, **not** a translucent wash: the Mach plume
  rises behind it and shows straight through anything see-through.

The MDX body of a feature project carries neither an H1 nor the hero image —
both are page chrome now. Start the file at the first real section.

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

- Below `md` the header carries no section navigation at all. It collapses to the wordmark alone — plus the Back link on a project page — rather than to a hamburger. Deliberate, not a missing feature: both headers paint through a `-webkit-mask-image` that fades to transparent at their bottom edge, and because a mask applies to the whole subtree, any panel hung below the header renders invisible *and* drops out of hit testing.
- `lib/carousel/EmblaCarousel.jsx` + `lib/ProjectCard.jsx` — the homepage
  project carousel. The card has no fixed width. A `ResizeObserver` measures
  the track and `fit()` picks the fewest cards that keep each one under
  `MAX_CARD`, bounded by the most that keep each one over `MIN_CARD`, capped at
  four — one card on a phone, two on a tablet, three on a laptop, four at
  1920. Slides are sized as a **fraction** of the track (`100/perView`%), never
  in pixels, so the row always adds up to exactly the width available; sizing
  them in pixels is what used to leave a stray margin and push the cards
  off-centre. The resulting slot width is handed to the card as `--card-w`,
  and the card sets its own `font-size` from it and expresses everything else
  — padding, type, tags, cover height, radius — against that. So the card is a
  true scale of itself at any size rather than a fixed card that has to be
  cropped to fit. The scale is anchored to the card as it was before it could
  scale: at 379px wide it draws 16px type over a 320px cover, which is where
  the `/23.7` divisor and the `0.845` cover ratio come from. Two things there
  are load-bearing:
  - The cover ratio is a share of the card's **width**, so its aspect — and
    therefore how much of the photograph `object-cover` keeps — is identical at
    every size. Give it a fixed pixel height and narrow cards silently crop
    tighter than wide ones.
  - The `reInit()` effect (rAF + `document.fonts.ready` + on every `perView`
    change) is not redundant. Embla builds its snap list once at init, and in a
    production build that measurement comes out wide enough that it decides
    there is nothing to scroll — the carousel renders stuck on slide 1 with the
    Next arrow disabled.

  The counter's denominator is `scrollSnapList().length`, not the slide count:
  Embla trims the snaps that would scroll past the end, so seven slides give
  five stops at three-up.

  The arrows moved below the track to give the heading its own row, which put
  them under the experience section's `-mt-32` overlap. Both sections are
  positioned and neither paints a background, so the overlap was invisible but
  still won hit testing and the arrows went dead. `#projects` carries
  `relative z-10` for that reason — do not remove it.
- `lib/Tag.jsx` — sized in `em`, not px, so a tag scales with whatever sets its
  font size (the project card does). The ratios are calibrated so a tag in a
  16px context — the project banner, the `/projects` index — is pixel-identical
  to the old fixed values.
- `app/icon.svg` — the favicon, on Next's file convention, so no `<link>` tag
  anywhere. One rounded square in the accent purple with the initial as a
  single stroked path. Fontless on purpose (favicons render without webfonts,
  so `font-family` is a coin flip) and free of anything under ~4px on the 64
  grid, because the working size is a 16px tab.
- `lib/ExperienceTimeline.jsx` — the experience section. Orders entries by an optional frontmatter `rank`, otherwise ongoing roles first then by `end` date descending (the order a resume uses); a role whose `end` is "Present" gets a filled timeline node. From `xl` entries alternate sides and the rail steps with them — offset `DELTA` right on a left-hand entry, `DELTA` left on a right-hand one, joined by a horizontal jog in the gap between the two, so each card gains `DELTA` over an even split. Below `xl` it collapses to a single left-rail column, because half a container is too narrow to read in. Plain React + framer-motion, no component library.

### Mach diamond plume

`lib/MachDiamonds.jsx` with `.mach-diamonds*` in `app/globals.css`. Six rows of
SVG `<pattern>` diamonds, biggest and brightest at the base and tapering in
size and opacity upward, in a purple ramp sampled off the hero's `DarkVeil`
canvas so it reads as the same light source. Ported from the Duke LPD site.

Two rules it was corrected into and should keep:

- It goes **behind** what is already on the page and adds no height of its own.
  On a project page that is `absolute inset-x-0 bottom-full` on the `<footer>`,
  which puts the field's cut edge exactly on the footer's top border — anchored
  to the footer rather than the article, whose height varies per project.
  `<main>` carries `z-10` so the plume stays behind the content it reaches up
  over. Never give a section extra padding to make room for it.
- It is on every project page and deliberately **not** on the homepage.

The mobile cap (`max-height` under 640px) has to sit on `.mach-diamonds-stack`,
the `column-reverse` element: that is what puts main-start at the bottom, so the
overflow trims the faint top rows instead of eating the bright base row.

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
