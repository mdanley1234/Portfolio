import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Builds carousel of cards using EmblaCarousel.
 *
 * @param cardWidth Width of one slide in px on a track wide enough for it.
 *   Narrower than that, a slide takes the full track instead, so a phone shows
 *   exactly one card. This is a width, not a transform: `scale()` does not
 *   change layout, so scaling a fixed-width slide down left the track wider
 *   than its container and pushed every card off to one side.
 */
const EmblaCarousel = ({ header, slides, options, cardWidth }) => {
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [selected, setSelected] = React.useState(0);
  // How many positions the track can actually stop at. Embla trims the snaps
  // that would scroll past the last slide, so this is the slide count only
  // when one slide fills the view — on a wide track showing three cards, seven
  // slides give five stops. Counting slides instead advertised a 7 the arrows
  // could never reach.
  const [snapCount, setSnapCount] = React.useState(0);

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
  // webfonts have swapped — rebuilds the snaps against the real layout.
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
  }, [emblaApi]);

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

  return (
    <div className="py-2 overflow-hidden">
      {/* The heading gets the whole row. Sharing it with the controls meant
          they landed on top of the second line once the title wrapped. */}
      <h2 className="px-4 mb-2 text-3xl sm:text-4xl font-bold text-white text-left">
        {header}
      </h2>

      <div className="rounded-lg" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-0 shrink-0 grow-0 px-4 py-6 sm:py-10"
              style={{ width: `min(${cardWidth}px, 100%)` }}
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
