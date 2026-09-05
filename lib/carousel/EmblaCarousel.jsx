import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// A card narrower than MIN_CARD reads as a thumbnail; wider than MAX_CARD the
// cover image starts to dominate the section. Everything between is reachable
// by scaling, so the track picks the smallest number of cards that keeps each
// one inside that band and then divides the width evenly between them.
const MIN_CARD = 300;
const MAX_CARD = 440;
const MAX_PER_VIEW = 4;

// The ceiling only has to hold a card back from its neighbours. A card with no
// neighbours can take the whole track, which is how the phone case works, and
// the track is under 630px wherever a second card would not fit — so this is a
// backstop for the degenerate case of a single project, not a second design.
const MAX_CARD_ALONE = 620;

// Room between two cards. A lone card gets a narrower gutter: on a phone the
// full track is the budget, and 28px of it spent on air the visitor never sees
// (there is no neighbouring card to separate from) is 28px off the card.
const GAP = 32;
const GAP_SINGLE = 16;

/**
 * How many cards to show, and how wide each one ends up, for a track of
 * `track` px. Returns the geometry the slides and the card itself are sized
 * from — the caller feeds `card` to the card as its scale unit.
 */
function fit(track, slideCount) {
  if (!track) return null;

  // The most cards that still leaves each one legible, and the fewest that
  // keeps each one under the ceiling. The second wins where they disagree:
  // two 470px cards is a worse answer than three 300px ones.
  const most = Math.floor((track + GAP) / (MIN_CARD + GAP));
  const fewest = Math.ceil((track + GAP) / (MAX_CARD + GAP));
  const perView = Math.min(
    Math.max(fewest, 1),
    Math.max(most, 1),
    MAX_PER_VIEW,
    slideCount
  );

  const gap = perView === 1 ? GAP_SINGLE : GAP;
  // Slides are sized as a fraction of the track rather than in pixels, so the
  // row always adds up to exactly the space available and the cards stay
  // centred in it. The gutter is padding inside each slide.
  const slide = track / perView;
  const ceiling = perView === 1 ? MAX_CARD_ALONE : MAX_CARD;
  return { perView, gap, card: Math.min(slide - gap, ceiling) };
}

/**
 * Builds carousel of cards using EmblaCarousel.
 *
 * Slides are measured, not fixed: the track is divided into one, two, three or
 * four equal slots depending on how much width there is, and the card scales
 * to whatever slot it lands in. `--card-w` carries that width into the card,
 * which sizes its type, padding and cover image from it — so a phone card is
 * the same design as a desktop card, drawn smaller, rather than a desktop card
 * with its right half hanging off the screen.
 */
const EmblaCarousel = ({ header, slides, options }) => {
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [selected, setSelected] = React.useState(0);
  // How many positions the track can actually stop at. Embla trims the snaps
  // that would scroll past the last slide, so this is the slide count only
  // when one slide fills the view — on a wide track showing three cards, seven
  // slides give five stops. Counting slides instead advertised a 7 the arrows
  // could never reach.
  const [snapCount, setSnapCount] = React.useState(0);
  const [geometry, setGeometry] = React.useState(null);

  // Card behaviors
  const defaultOptions = {
    loop: false,
    align: 'start',
    dragFree: false,
    draggable: true,
    watchDrag: true
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...defaultOptions,
    ...options
  });

  const viewportRef = React.useRef(null);
  const slideCount = slides?.length ?? 0;

  // Embla owns the viewport node through a callback ref; measuring it needs the
  // same node, so both refs are set from one callback.
  const setViewport = React.useCallback(
    (node) => {
      viewportRef.current = node;
      emblaRef(node);
    },
    [emblaRef]
  );

  React.useLayoutEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const measure = () => {
      const next = fit(node.clientWidth, slideCount);
      if (!next) return;
      setGeometry((prev) =>
        prev &&
        prev.perView === next.perView &&
        prev.gap === next.gap &&
        Math.abs(prev.card - next.card) < 0.5
          ? prev
          : next
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [slideCount]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelected(emblaApi.selectedScrollSnap());
    setSnapCount(emblaApi.scrollSnapList().length);
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Embla measures the viewport and builds its snap list exactly once, at
  // init, and that measurement does not match the final layout here: it comes
  // out wide enough that Embla decides there is nothing to scroll. Remove this
  // and a production build renders the carousel stuck on slide 1 with the Next
  // arrow disabled. Re-measuring after the first paint — and again once
  // webfonts have swapped, and on every change to how many cards are on
  // screen — rebuilds the snaps against the real layout.
  React.useEffect(() => {
    if (!emblaApi) return;
    const reInit = () => emblaApi.reInit();
    const raf = requestAnimationFrame(reInit);
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) reInit();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [emblaApi, geometry?.perView]);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi && canScrollPrev) emblaApi.scrollPrev();
  }, [emblaApi, canScrollPrev]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi && canScrollNext) emblaApi.scrollNext();
  }, [emblaApi, canScrollNext]);

  if (!slides || slides.length === 0) return null;

  const arrow = (enabled) =>
    `p-2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
      enabled ? 'bg-white hover:bg-white/85' : 'bg-white/20 cursor-not-allowed'
    }`;
  const chevron = (enabled) => `w-5 h-5 ${enabled ? 'text-black' : 'text-white/40'}`;

  const gutter = (geometry?.gap ?? GAP) / 2;

  return (
    <div className="py-2 overflow-hidden">
      {/* The heading gets the whole row. Sharing it with the controls meant
          they landed on top of the second line once the title wrapped. It is
          indented by the slide's own gutter so it starts on the same vertical
          as the first card's left edge at every width. */}
      <h2
        className="mb-2 text-3xl sm:text-4xl font-bold text-white text-left"
        style={{ paddingInline: `${gutter}px` }}
      >
        {header}
      </h2>

      <div className="rounded-lg" ref={setViewport}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex min-w-0 shrink-0 grow-0 py-6 sm:py-10"
              style={{
                width: geometry ? `${100 / geometry.perView}%` : '100%',
                paddingInline: `${gutter}px`,
                // Everything inside the card is sized from this.
                '--card-w': `${geometry?.card ?? MIN_CARD}px`
              }}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Controls sit under the track so the heading keeps the full width above. */}
      <div className="flex items-center justify-center gap-5 px-4">
        <button
          className={arrow(canScrollPrev)}
          onClick={scrollPrev}
          aria-label="Previous project"
          disabled={!canScrollPrev}
          type="button"
        >
          <ChevronLeft className={chevron(canScrollPrev)} />
        </button>

        <p className="text-sm tabular-nums text-white/60" aria-live="polite">
          {selected + 1}
          <span className="text-white/30"> / </span>
          {snapCount || slides.length}
        </p>

        <button
          className={arrow(canScrollNext)}
          onClick={scrollNext}
          aria-label="Next project"
          disabled={!canScrollNext}
          type="button"
        >
          <ChevronRight className={chevron(canScrollNext)} />
        </button>
      </div>
    </div>
  );
};

export default EmblaCarousel;
