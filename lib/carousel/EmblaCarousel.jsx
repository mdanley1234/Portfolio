import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EmblaCarousel = ({ slides, options, minCardWidth = 300 }) => {
  const [slidesPerView, setSlidesPerView] = React.useState(1);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const calculateSlides = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const calculatedSlides = Math.floor(containerWidth / minCardWidth) || 1;
        setSlidesPerView(calculatedSlides);
      }
    };

    calculateSlides();
    window.addEventListener('resize', calculateSlides);
    return () => window.removeEventListener('resize', calculateSlides);
  }, [minCardWidth]);

  const slideWidth = `${100 / slidesPerView}%`;

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
      <div className="rounded-lg" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className="min-w-0 px-4 py-12"
              style={{ flex: `0 0 ${slideWidth}` }}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons on the left */}
      <div className="flex gap-4 mt-12 ml-4">
        <button
          className={`p-3 rounded-full transition-all ${
            canScrollPrev 
              ? 'bg-white hover:bg-white/80' 
              : 'bg-gray-500 cursor-not-allowed'
          }`}
          onClick={scrollPrev}
          aria-label="Previous slide"
          type="button"
        >
          <ChevronLeft className={`w-6 h-6 ${canScrollPrev ? 'text-black' : 'text-gray-700'}`} />
        </button>
        <button
          className={`p-3 rounded-full transition-all ${
            canScrollNext 
              ? 'bg-white hover:bg-white/80' 
              : 'bg-gray-500 cursor-not-allowed'
          }`}
          onClick={scrollNext}
          aria-label="Next slide"
          type="button"
        >
          <ChevronRight className={`w-6 h-6 ${canScrollNext ? 'text-black' : 'text-gray-700'}`} />
        </button>
      </div>
    </div>
  );
};

export default EmblaCarousel;