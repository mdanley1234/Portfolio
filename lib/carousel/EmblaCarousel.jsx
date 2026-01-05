import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Builds carousel of cards using EmblaCarousel
 * @param cardWidth Set width of card in px
 * @param cardHeight Set height of card in px
 */
const EmblaCarousel = ({ header, slides, options, cardWidth }) => {
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const containerRef = React.useRef(null);

  // Scaling constants
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [scale, setScale] = React.useState(1);
  const [scaledWidth, setScaledWidth] = React.useState(cardWidth);

  // Calculate scaling
  React.useEffect(() => {
    const calculate = () => {
      if (!containerRef.current) return;

      // Store container width
      const w = containerRef.current.offsetWidth;
      setContainerWidth(w);

      // Calculate and store scaling values
      const s = Math.min(1, w / cardWidth);
      setScale(s);
      setScaledWidth(Math.max(1, Math.floor(cardWidth * s)));
    };

    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, [cardWidth]);

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

  const scrollPrev = React.useCallback(() => {
    if (emblaApi && canScrollPrev) emblaApi.scrollPrev();
  }, [emblaApi, canScrollPrev]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi && canScrollNext) emblaApi.scrollNext();
  }, [emblaApi, canScrollNext]);

  if (!slides || slides.length === 0) return null;

  return (
    <div ref={containerRef} className="py-2 overflow-hidden">
      <div className="flex items-center justify-between px-4 mb-2">

        {/* Left Side - Section Title */}
        <h2 className="text-4xl font-bold text-white text-left">
          {header}
        </h2>

        {/* Navigation buttons - top right */}
        <div className="flex gap-4">
          <button
            className={`p-2 rounded-full transition-all ${canScrollPrev
              ? 'bg-white hover:bg-white/85'
              : 'bg-gray-500 cursor-not-allowed'
              }`}
            onClick={scrollPrev}
            aria-label="Previous slide"
            type="button"
          >
            <ChevronLeft className={`w-5 h-5 ${canScrollPrev ? 'text-black' : 'text-gray-700'}`} />
          </button>
          <button
            className={`p-2 rounded-full transition-all ${canScrollNext
              ? 'bg-white hover:bg-white/85'
              : 'bg-gray-500 cursor-not-allowed'
              }`}
            onClick={scrollNext}
            aria-label="Next slide"
            type="button"
          >
            <ChevronRight className={`w-5 h-5 ${canScrollNext ? 'text-black' : 'text-gray-700'}`} />
          </button>
        </div>
      </div>

      <div className="rounded-lg" ref={emblaRef}>
        <div className="flex">

          {/* {slides.map((slide, idx) => (
          // wrapper has the visual (scaled) size so layout matches visuals
          <div
            key={idx}
            style={{ width: `${effectiveSlideWidth}px`, flex: `0 0 ${effectiveSlideWidth}px` }}
            className="min-w-0 px-4 py-10"
          >
            <div
              style={{
                width: `${cardWidth}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                // set transform-style if necessary
              }}
            >
              {slide}
            </div>
          </div>
        ))} */}

          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-0 px-4 py-10 scale-[var(--card-scale)]"
              style={{ flex: `0 0 ${cardWidth}px`,
                        '--card-scale': scale }}
            >
              {slide}
            </div>
          ))}


        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;