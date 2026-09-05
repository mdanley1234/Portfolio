import Image from 'next/image';
import Tag from './Tag.jsx';

/**
 * Full-bleed banner at the top of a project detail page.
 *
 * The image runs edge to edge and the title sits over its foot, so the page
 * opens on the artifact rather than on a heading. `heroImage` is a separate
 * field from `coverImage` on purpose: a card cover is cropped to a small
 * square-ish box and can be a light product shot, while a banner is cropped
 * wide and needs a subject that survives a scrim. Falls back to the cover
 * when a project has not picked one.
 */
export default function ProjectHero({
  title,
  tagline,
  start,
  end,
  heroImage,
  heroAlt = '',
  heroPosition,
  heroScale,
  tags = [],
}: {
  title: string;
  /** One short line under the name. Falls back to the card `summary`, which is
   *  written to sell a card and usually runs long for a banner. */
  tagline?: string;
  start?: string;
  end?: string;
  heroImage: string;
  heroAlt?: string;
  /** CSS object-position for the banner crop. Defaults to the middle. */
  heroPosition?: string;
  /** Zoom the banner crop in. Together with `heroPosition` this aims the crop
   *  at part of a picture — the way out of an otherwise good image whose
   *  edges carry baked-in labels that would collide with the title. */
  heroScale?: number;
  tags?: string[];
}) {
  // Same test the experience timeline uses to decide an ongoing role.
  const isOngoing = /present/i.test(end ?? '');
  const dates = [start, end].filter(Boolean).join(' — ');

  return (
    <section className="relative isolate flex min-h-[62svh] flex-col justify-end overflow-hidden md:min-h-[76svh]">
      <Image
        src={heroImage}
        alt={heroAlt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
        style={{
          objectPosition: heroPosition ?? 'center',
          transform: heroScale && heroScale !== 1 ? `scale(${heroScale})` : undefined,
        }}
      />
      {/* Darkened at both ends: the fixed header's wordmark sits over the top,
          the title over the foot, and the last stop is opaque so the banner
          dissolves into the page instead of ending on a seam. */}
      <div aria-hidden className="project-hero-scrim absolute inset-0 -z-10" />

      <div className="hero-rise relative mx-auto w-full max-w-4xl px-6 pb-14 pt-32 md:pb-20 md:pt-40">
        <h1 className="max-w-3xl text-balance text-[clamp(2.25rem,7vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-white">
          {title}
        </h1>

        {tagline && (
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-white/80 md:text-xl">
            {tagline}
          </p>
        )}

        {(dates || isOngoing) && (
          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/60">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className={
                  isOngoing
                    ? 'size-2 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.15)]'
                    : 'size-2 rounded-full border border-white/50'
                }
              />
              {isOngoing ? 'In progress' : 'Completed'}
            </span>
            {dates && (
              <>
                <span aria-hidden className="text-white/25">
                  /
                </span>
                <span>{dates}</span>
              </>
            )}
          </div>
        )}

        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag} name={tag} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
