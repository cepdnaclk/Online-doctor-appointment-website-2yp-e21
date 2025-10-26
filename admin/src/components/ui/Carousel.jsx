import React, { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Lightweight Carousel component (no external deps)
 * Props:
 * - images: string[] (src paths, e.g. "/admin1.jpg")
 * - autoPlay: boolean (default true)
 * - interval: number ms (default 3500)
 * - heightClass: string tailwind height class (e.g. "h-56 md:h-72")
 * - showDots: boolean (default true)
 * - showArrows: boolean (default true)
 */
const Carousel = ({
  images = [],
  autoPlay = true,
  interval = 3500,
  heightClass = 'h-56 md:h-72',
  showDots = true,
  showArrows = true,
  pauseOnHover = true,
  fallbackSrc = '/logo.png',
  overlay = null,
  children
}) => {
  const [index, setIndex] = useState(0)
  const len = images.length
  const timerRef = useRef(null)
  const canSlide = len > 1

  const safeImages = useMemo(() => images.filter(Boolean), [images])

  useEffect(() => {
    if (!autoPlay || !canSlide) return
    timerRef.current && clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % len)
    }, Math.max(2000, interval))
    return () => timerRef.current && clearInterval(timerRef.current)
  }, [autoPlay, interval, len, canSlide])

  const goto = (i) => setIndex(((i % len) + len) % len)
  const next = () => canSlide && goto(index + 1)
  const prev = () => canSlide && goto(index - 1)

  if (!safeImages.length) return null

  const handleMouseEnter = () => {
    if (!pauseOnHover) return
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }
  const handleMouseLeave = () => {
    if (!pauseOnHover || !autoPlay || !canSlide) return
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % len)
    }, Math.max(2000, interval))
  }

  return (
    <div
      className={`relative w-full ${heightClass} overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-1 ring-black/5`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      {safeImages.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={src}
            alt={`slide-${i + 1}`}
            className="w-full h-full object-cover select-none"
            loading={i === index ? 'eager' : 'lazy'}
            decoding="async"
            onError={(e) => {
              if (e.currentTarget.src.endsWith(fallbackSrc)) return
              e.currentTarget.src = fallbackSrc
            }}
          />
          {/* Subtle gradient overlay for better text/readability if needed */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10" />
        </div>
      ))}

      {/* Custom content overlay slot */}
      {(overlay || children) && (
        <div className="absolute inset-0 z-20">
          {overlay || children}
        </div>
      )}

      {/* Arrows */}
      {showArrows && canSlide && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow transition z-30"
          >
            <span className="text-gray-700 text-xl leading-none">‹</span>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow transition z-30"
          >
            <span className="text-gray-700 text-xl leading-none">›</span>
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && canSlide && (
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 z-30">
          {safeImages.map((_, i) => (
            <button
              key={`dot-${i}`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goto(i)}
              className={`h-2.5 rounded-full transition-all ${i === index ? 'bg-white w-6 shadow-md' : 'bg-white/70 w-2.5 hover:bg-white'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Carousel
