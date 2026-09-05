/**
 * Rows of shock ("mach") diamonds stacked bottom to top, standing in for a
 * plume running up through the section's own background: biggest, brightest
 * and most tightly packed at the bottom, cooling, shrinking and spreading out
 * row by row until the pattern dissolves into the page. Pure background
 * texture — the content above it needs its own stacking context.
 *
 * Ported from duke-lpd-website's MachDiamonds.astro. The one substantive
 * change is the palette: that site runs its plume in its own orange, this one
 * is keyed to the hero's DarkVeil, whose core samples to #6111dd at ~262°.
 * The ramp climbs in lightness along that hue rather than shifting off it.
 */
const TILE = 130;

const ROWS = [
  { height: 80, color: '#6111dd', opacity: 0.6 },
  { height: 66, color: '#7c3df0', opacity: 0.45 },
  { height: 54, color: '#a982f7', opacity: 0.32 },
  { height: 44, color: '#cdb6fb', opacity: 0.2 },
  { height: 36, color: '#f3edfe', opacity: 0.11 },
  { height: 30, color: '#f3edfe', opacity: 0.05 },
].map((row, i) => ({
  ...row,
  id: `mach-row-${i}`,
  tile: TILE,
  half: +(row.height * 0.45).toFixed(1),
  // One tile width for every row, so the columns actually line up: row 2 sits
  // in the same phase as row 0, like a brick course repeating every other row
  // rather than each row inventing its own spacing.
  offset: i % 2 === 1 ? TILE / 2 : 0,
}));

// Every row stays centred on its own row; the whole stack is pushed down by
// half the bottom row's height instead, so that row's centreline lands on the
// bottom edge of the (clipping) box and only its top half shows, while the
// spacing between every row above it is preserved.
const BOTTOM_SHIFT = ROWS[0].height / 2;

export default function MachDiamonds({ className = '' }) {
  return (
    <div className={`mach-diamonds ${className}`} aria-hidden="true">
      <div
        className="mach-diamonds-stack"
        style={{ '--mach-shift': `${BOTTOM_SHIFT}px` }}
      >
        {ROWS.map((row) => {
          const cx = row.tile / 2;
          const cy = row.height / 2;
          const outer = `${cx},${cy - row.half * 2} ${cx + row.half * 2},${cy} ${cx},${cy + row.half * 2} ${cx - row.half * 2},${cy}`;
          const inner = `${cx},${cy - row.half} ${cx + row.half},${cy} ${cx},${cy + row.half} ${cx - row.half},${cy}`;
          return (
            <div
              key={row.id}
              className="mach-diamonds-row"
              style={{ height: `${row.height}px` }}
            >
              <svg width="100%" height="100%" preserveAspectRatio="none">
                <defs>
                  <pattern
                    id={row.id}
                    width={row.tile}
                    height={row.height}
                    patternUnits="userSpaceOnUse"
                    x={row.offset}
                  >
                    <polygon points={outer} fill={row.color} opacity={0.16} />
                    <polygon points={inner} fill={row.color} />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill={`url(#${row.id})`}
                  opacity={row.opacity}
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
