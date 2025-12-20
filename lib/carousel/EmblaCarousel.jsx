import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EmblaCarousel = ({ slides, options, minCardWidth = 300 }) => {
  const [slidesPerView, setSlidesPerView] = React.useState(1);
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

  const defaultOptions = { loop: true, align: 'start' };
  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...defaultOptions,
    ...options
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!slides || slides.length === 0) return null;

  return (
    <div ref={containerRef}>
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className="min-w-0 px-4"
              style={{ flex: `0 0 ${slideWidth}` }}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons below carousel on the right */}
      <div className="flex gap-4 mt-10 ml-4">
        <button
          className="bg-white p-3 rounded-full hover:bg-white/10 transition-all"
          onClick={scrollPrev}
          aria-label="Previous slide"
          type="button"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        
        <button
          className="bg-white p-3 rounded-full hover:bg-white/10 transition-all"
          onClick={scrollNext}
          aria-label="Next slide"
          type="button"
        >
          <ChevronRight className="w-6 h-6 text-black" />
        </button>
      </div>
    </div>
  );
};

export default EmblaCarousel;