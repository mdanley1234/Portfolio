'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'

export default function ImageSlideshow({ images = [], height = 480 }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [index, setIndex] = useState(0)

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  if (!images.length) return null

  const btnBase = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(0,0,0,0.5)',
    color: '#e2e8f0',
    fontSize: 18,
    cursor: 'pointer',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <figure style={{ margin: '2rem 0', userSelect: 'none' }}>

      <div style={{ position: 'relative' }}>

        {/* Embla viewport */}
        <div ref={emblaRef} style={{ overflow: 'hidden', borderRadius: '8px', height, background: '#0a0a0f' }}>
          <div style={{ display: 'flex', height: '100%' }}>
            {images.map((img, i) => (
              <div
                key={i}
                style={{
                  flex: '0 0 100%',
                  minWidth: 0,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.caption || `Slide ${i + 1}`}
                  draggable={false}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button onClick={prev} style={{ ...btnBase, left: 14 }}>←</button>
            <button onClick={next} style={{ ...btnBase, right: 14 }}>→</button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute',
            top: 12,
            right: 14,
            fontSize: '11px',
            fontFamily: "'Courier New', monospace",
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.5)',
            background: 'rgba(0,0,0,0.4)',
            padding: '3px 8px',
            borderRadius: '4px',
            backdropFilter: 'blur(6px)',
          }}>
            {index + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              style={{
                width: i === index ? 20 : 6,
                height: 6,
                borderRadius: '3px',
                border: 'none',
                background: i === index ? '#38bdf8' : '#1e293b',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.2s ease, background 0.2s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* Caption */}
      {images[index]?.caption && (
        <figcaption style={{
          marginTop: '10px',
          fontSize: '12px',
          color: '#475569',
          fontFamily: "'Courier New', monospace",
          letterSpacing: '0.03em',
          textAlign: 'center',
        }}>
          {images[index].caption}
        </figcaption>
      )}
    </figure>
  )
}