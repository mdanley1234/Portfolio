'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const MONTHS = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
};

/**
 * Timeline geometry, all in px so the connector SVG can be drawn 1:1 without
 * scaling (which would distort the corner radii).
 *
 * The rail always steps *away* from the card it serves, so whichever side an
 * entry sits on gains DELTA over an even split.
 */
const DELTA = 280;        // how far the rail sits off centre
const GUTTER = 40;        // clear space between the rail and the card — the one
                          // value that governs both axes
const CARD = 680;         // card width in the split layout; fixed, so widening
                          // DELTA slides the cards inward instead of stretching
const RADIUS = 24;        // corner radius where the rail turns
const NODE_CENTER = 32;   // node centre, measured from the top of its card

/**
 * Half the step above the turn and half below, each equal to GUTTER, so a card
 * sits the same distance from the rail whichever way it is measured.
 */
const HALF_STEP = GUTTER;
const STEP = HALF_STEP * 2;

/**
 * The connector between two entries: down, round the corner, across, round the
 * corner, down. Drawn as one path so the curves stay continuous with the
 * straight runs above and below.
 */
function connectorPath(fromRight) {
  const span = DELTA * 2;
  const x1 = fromRight ? span : 0;
  const x2 = fromRight ? 0 : span;
  const inward = fromRight ? -RADIUS : RADIUS;
  return [
    `M ${x1} 0`,
    `V ${HALF_STEP - RADIUS}`,
    `A ${RADIUS} ${RADIUS} 0 0 ${fromRight ? 1 : 0} ${x1 + inward} ${HALF_STEP}`,
    `H ${x2 - inward}`,
    `A ${RADIUS} ${RADIUS} 0 0 ${fromRight ? 0 : 1} ${x2} ${HALF_STEP + RADIUS}`,
    `V ${STEP}`,
  ].join(' ');
}

/** "August 2025" → "Aug 2025". Anything unrecognised is passed through. */
function shortenDate(value) {
  if (!value) return '';
  const [month, year] = String(value).split(' ');
  return month in MONTHS && year ? `${month.slice(0, 3)} ${year}` : value;
}

/** Milliseconds for a "Month YYYY" string; unparseable values sink to the bottom. */
function toTime(value) {
  const [month, year] = String(value ?? '').split(' ');
  if (!(month in MONTHS) || !year) return -Infinity;
  return new Date(Number(year), MONTHS[month]).getTime();
}

/** Ongoing roles sort above everything finished. */
function endedAt(experience) {
  return /present|current/i.test(experience.end ?? '') ? Infinity : toTime(experience.end);
}

/**
 * Relevant experience as a vertical timeline.
 *
 * Deliberately a different shape from the projects carousel: projects are
 * browsed sideways and led by imagery, whereas roles are read top-down and led
 * by chronology.
 *
 * From xl the entries alternate sides and the rail steps with them — offset
 * right on a left-hand entry, left on a right-hand one, joined by a horizontal
 * jog in the gap between the two. Each card therefore gets DELTA more width
 * than an even split would give it. Below xl none of that fits, so it collapses
 * to a single column with one straight rail down the left.
 *
 * @param {{ experiences: Array<{
 *   slug: string, company: string, position: string,
 *   start: string, end: string, rank?: number,
 *   content: React.ReactNode
 * }> }} props
 */
export default function ExperienceTimeline({ experiences }) {
  // Ongoing roles first, then finished ones by how recently they ended — the
  // same order a resume uses. An explicit `rank` in the frontmatter overrides
  // it, matching the convention the projects already use.
  const ordered = [...experiences].sort((a, b) => {
    if (a.rank != null || b.rank != null) {
      return (a.rank ?? Infinity) - (b.rank ?? Infinity);
    }
    return endedAt(b) - endedAt(a) || toTime(b.start) - toTime(a.start);
  });

  // The newest role opens on arrival, so the section reads as content rather
  // than as a stack of closed bars.
  const [openSlugs, setOpenSlugs] = useState(() =>
    ordered.length ? [ordered[0].slug] : []
  );

  const toggle = (slug) => {
    setOpenSlugs((previous) => {
      if (previous.includes(slug)) return previous.filter((s) => s !== slug);
      return [...previous, slug];
    });
  };

  if (!ordered.length) return null;

  return (
    <ol className="relative">
      {/* Single straight rail for the stacked layout. */}
      <span
        aria-hidden
        className="absolute top-8 bottom-8 left-[6px] w-px -translate-x-1/2 bg-white/30 xl:hidden"
      />

      {ordered.map((experience, index) => {
        const isOpen = openSlugs.includes(experience.slug);
        const isCurrent = /present/i.test(experience.end ?? '');
        const onLeft = index % 2 === 0;
        const isFirst = index === 0;
        const isLast = index === ordered.length - 1;
        const panelId = `experience-${experience.slug}`;
        const from = shortenDate(experience.start);
        const until = shortenDate(experience.end);

        const offset = onLeft ? DELTA : -DELTA;
        const railX = `calc(50% + ${offset}px)`;
        // First column always ends GUTTER before the rail; the middle column
        // spans the rail so the third starts GUTTER after it.
        const columns = `calc(50% + ${offset - GUTTER}px) ${GUTTER * 2}px minmax(0, 1fr)`;

        // Straight runs stop half a step short at each end; the connector SVG
        // fills that space and carries the curve.
        const vertical = {
          top: isFirst ? `${HALF_STEP + NODE_CENTER}px` : `${HALF_STEP}px`,
          ...(isLast
            ? { height: `${NODE_CENTER}px` }
            : { bottom: `${HALF_STEP}px` }),
        };

        return (
          <li
            key={experience.slug}
            style={{
              '--rail-x': railX,
              '--cols': columns,
              '--node-top': `${HALF_STEP + NODE_CENTER - 6}px`,
              '--tick-top': `${HALF_STEP + NODE_CENTER - 1}px`,
              '--date-top': `${HALF_STEP + 22}px`,
            }}
            className="relative grid grid-cols-[1.75rem_minmax(0,1fr)] pb-4 last:pb-0 xl:py-10 xl:[grid-template-columns:var(--cols)]"
          >
            {/* Stepped rail: vertical run for this entry… */}
            {!(isFirst && isLast) && (
              <span
                aria-hidden
                className="absolute hidden w-px -translate-x-1/2 bg-white/30 xl:block"
                style={{ left: 'var(--rail-x)', ...vertical }}
              />
            )}

            {/* …and the curved connector carrying it across to the next. */}
            {!isLast && (
              <svg
                aria-hidden
                className="absolute hidden text-white/30 xl:block"
                width={DELTA * 2}
                height={STEP}
                viewBox={`0 0 ${DELTA * 2} ${STEP}`}
                fill="none"
                style={{ left: `calc(50% - ${DELTA}px)`, bottom: `-${HALF_STEP}px` }}
              >
                <path d={connectorPath(onLeft)} stroke="currentColor" strokeWidth="1" />
              </svg>
            )}

            {/* Node. A current role is filled and haloed; a finished one is
                hollow, so the timeline shows at a glance what is still live. */}
            <span
              aria-hidden
              className={`absolute top-[26px] left-0 z-10 h-3 w-3 rounded-full transition-colors xl:top-[var(--node-top)] xl:left-[var(--rail-x)] xl:-translate-x-1/2 ${
                isCurrent
                  ? 'bg-white ring-4 ring-white/10'
                  : 'border border-white/50 bg-[#0a0a0a]'
              }`}
            />

            {/* Tick joining the node to its card. */}
            <span
              aria-hidden
              className="absolute top-[31px] hidden h-px bg-white/30 xl:top-[var(--tick-top)] xl:block"
              style={{
                left: onLeft
                  ? `calc(50% + ${DELTA - GUTTER}px)`
                  : `calc(50% - ${DELTA - 6}px)`,
                width: `${GUTTER - 6}px`,
              }}
            />

            {/* Date, opposite its card once the timeline splits. */}
            {(from || until) && (
              <time
                className={`col-span-2 mb-2 pl-8 text-sm text-gray-400 tabular-nums xl:col-span-1 xl:row-start-1 xl:mb-0 xl:flex xl:flex-col xl:pt-[var(--date-top)] xl:pl-0 ${
                  onLeft ? 'xl:col-start-3 xl:items-start' : 'xl:col-start-1 xl:items-end'
                }`}
              >
                <span>{from}</span>
                {until && (
                  <>
                    {' '}
                    <span>{`— ${until}`}</span>
                  </>
                )}
              </time>
            )}

            <div
              style={{ '--card-w': `${CARD}px` }}
              className={`col-start-2 max-w-[46rem] rounded-2xl border backdrop-blur-sm transition-all xl:row-start-1 xl:w-[var(--card-w)] xl:max-w-full ${
                onLeft ? 'xl:col-start-1 xl:ml-auto' : 'xl:col-start-3 xl:mr-auto'
              } ${
                isOpen
                  ? 'border-white/25 bg-white/[0.07]'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(experience.slug)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full cursor-pointer items-start gap-4 rounded-2xl p-5 text-left sm:p-6"
                >
                  <span className="flex flex-1 flex-wrap items-baseline gap-x-4">
                    <span className="text-lg font-semibold text-white sm:text-xl">
                      {experience.company}
                    </span>

                    <span className="mt-1 w-full text-gray-400">
                      {experience.position}
                    </span>
                  </span>

                  <motion.span
                    aria-hidden
                    className="mt-1 shrink-0 text-gray-400"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    key="panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.2 },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/10 px-5 pt-4 pb-5 sm:px-6 sm:pb-6">
                      <div className="prose prose-invert prose-sm max-w-none text-gray-300 sm:prose-base">
                        {experience.content}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
