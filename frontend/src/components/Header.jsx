import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    // Simple slideshow using existing assets; replace or extend with header1..4 when available
    const slides = [
        assets.header_img1,
        assets.header_img2,
        assets.header_img3,
        assets.header_img4
    ]

    const [slideIndex, setSlideIndex] = useState(0)
    const intervalRef = useRef(null)
    const touchStartX = useRef(0)
    const touchEndX = useRef(0)

    const startAuto = () => {
        clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
            setSlideIndex((i) => (i + 1) % slides.length)
        }, 5000)
    }
    const resetAuto = () => {
        clearInterval(intervalRef.current)
        startAuto()
    }
    useEffect(() => {
        startAuto()
        return () => clearInterval(intervalRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const nextSlide = () => {
        setSlideIndex((i) => (i + 1) % slides.length)
        resetAuto()
    }
    const prevSlide = () => {
        setSlideIndex((i) => (i - 1 + slides.length) % slides.length)
        resetAuto()
    }
    const goToSlide = (idx) => {
        setSlideIndex(idx)
        resetAuto()
    }

    // Typewriter effect for the main heading
    const fullText = 'Your Health, Your Schedule'
    const [typed, setTyped] = useState('')
    const [cycle, setCycle] = useState(0) // used just to retrigger typing after a pause
    useEffect(() => {
        let timeout
        if (typed.length < fullText.length) {
            timeout = setTimeout(() => setTyped(fullText.slice(0, typed.length + 1)), 60)
        } else {
            // Pause then reset to retype
            timeout = setTimeout(() => {
                setTyped('')
                setCycle((c) => c + 1)
            }, 2200)
        }
        return () => clearTimeout(timeout)
    }, [typed, cycle])

  return (
    <div className='relative w-full h-[65vh] md:h-[70vh] lg:h-[75vh] overflow-hidden my-2'>
        {/* Carousel CSS helpers based on provided reference */}
        <style>{`
            .carousel-container { perspective: 1000px; touch-action: pan-y pinch-zoom; }
            .carousel-track { transform-style: preserve-3d; transition: transform 0.85s cubic-bezier(0.22, 1, 0.36, 1); }
            .carousel-item { backface-visibility: hidden; will-change: transform, opacity; transition: transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1); }
            .carousel-item.active { opacity: 1; transform: scale(1) translateZ(0); }
            @media (max-width: 640px) {
                .carousel-item.prev { opacity: 0; transform: scale(0.8) translateX(-50%) translateZ(-100px); }
                .carousel-item.next { opacity: 0; transform: scale(0.8) translateX(50%) translateZ(-100px); }
            }
            @media (min-width: 641px) {
                .carousel-item.prev { opacity: 0.7; transform: scale(0.9) translateX(-100%) translateZ(-100px); }
                .carousel-item.next { opacity: 0.7; transform: scale(0.9) translateX(100%) translateZ(-100px); }
            }
            .carousel-item.hidden { opacity: 0; transform: scale(0.8) translateZ(-200px); }
            .nav-button { transition: all 0.35s; background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
            .nav-button:hover { background: rgba(255,255,255,0.2); transform: scale(1.1); }
            .nav-button:active { transform: scale(0.95); }
            .progress-bar { transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
        `}</style>
    {/* Text overlay on top of the carousel (single full-width hero) */}
    {/* Kept outside for code clarity; real overlay is inserted within the carousel container below */}

    {/*--- Full-screen hero carousel with overlayed text ---*/}
    <div className='relative w-full h-full overflow-hidden carousel-container'>
            {/* Progress bar */}
            <div className='absolute top-0 left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden z-20'>
                <div className='progress-bar absolute top-0 left-0 h-full bg-gradient-to-r from-violet-500 to-fuchsia-500'
                     style={{ width: `${((slideIndex + 1) / slides.length) * 100}%` }} />
            </div>

            {/* Navigation buttons */}
            <button
                type='button'
                aria-label='Previous slide'
                className='nav-button absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center z-20 text-white'
                onClick={prevSlide}
            >
                <svg className='w-5 h-5 sm:w-6 sm:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7'></path>
                </svg>
            </button>
            <button
                type='button'
                aria-label='Next slide'
                className='nav-button absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center z-20 text-white'
                onClick={nextSlide}
            >
                <svg className='w-5 h-5 sm:w-6 sm:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7'></path>
                </svg>
            </button>

            {/* Carousel track */}
            <div
                className='carousel-track relative h-full overflow-hidden'
                onTouchStart={(e) => { touchStartX.current = e.changedTouches[0].screenX }}
                onTouchEnd={(e) => { touchEndX.current = e.changedTouches[0].screenX; const diff = touchStartX.current - touchEndX.current; if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide() } }}
            >
                {slides.map((src, idx) => {
                    let stateClass = 'hidden'
                    if (idx === slideIndex) stateClass = 'active'
                    else if (idx === (slideIndex + 1) % slides.length) stateClass = 'next'
                    else if (idx === (slideIndex - 1 + slides.length) % slides.length) stateClass = 'prev'
                    return (
                        <div key={idx} className={`carousel-item ${stateClass} absolute top-0 left-0 w-full h-full`}>
                            <img src={src} alt='' className='absolute inset-0 w-full h-full object-cover' />
                            {/* 70% black overlay for readability */}
                            <div className='absolute inset-0 bg-black/60' />
                        </div>
                    )
                })}
            </div>

            {/* Text content overlay */}
            <div className='absolute inset-0 z-30 flex items-center'>
                <div className='pl-10 pr-6 sm:pl-12 md:pl-16 md:pr-10 lg:pl-24 xl:pl-32 w-full md:max-w-[60%]'>
                    <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                        <span className='whitespace-pre drop-shadow-[0_0_14px_rgba(255,255,255,0.65)]'>{typed}</span>
                        <span className='ml-1 inline-block w-2 h-6 md:h-8 lg:h-10 align-middle bg-white rounded-sm animate-pulse'></span>
                        <br/>
                        <span className='text-2xl drop-shadow-[0_0_14px_rgba(216,0,255,0.65)]'>Book with Verified Healthcare Professionals</span>
                    </p>
                    <div className='flex items-center gap-3 text-white text-sm font-light mt-4'>
                        <div className="flex -space-x-4 rtl:space-x-reverse">
                            <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800 object-cover" src={assets.user1} alt="" />
                            <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800 object-cover" src={assets.user2} alt="" />
                            <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800 object-cover" src={assets.user3} alt="" />
                            <a className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800" href="#">+99</a>
                        </div>
                        <p className='drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]'>Your path to better health starts here. <br/>Discover our expert doctors and easily book your visit.</p>
                    </div>
                    <a href='#speciality' className='relative inline-flex items-center bg-white px-8 py-3 rounded-full text-gray-700 text-sm mt-6 shadow-[0_0_22px_rgba(216,0,255,0.35)] hover:shadow-[0_0_38px_rgba(216,0,255,0.6)] ring-1 ring-white/40 hover:scale-105 transition-all duration-200 pointer-events-auto'>
                        Book your appointment now <img src={assets.arrow_icon} className='w-3 ml-2 drop-shadow-[0_0_8px_rgba(216,0,255,0.5)]' alt='' />
                    </a>
                </div>
            </div>

            {/* Indicators */}
            <div className='absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 z-20'>
                {slides.map((_, i) => (
                    <button
                        key={i}
                        title={`Go to slide ${i+1}`}
                        onClick={() => goToSlide(i)}
                        className={`w-8 sm:w-12 h-1 sm:h-1.5 rounded-full transition-colors ${i === slideIndex ? 'bg-white/60' : 'bg-white/30 hover:bg-white/60'}`}
                        type='button'
                        aria-label={`Go to slide ${i+1}`}
                    />
                ))}
            </div>
    </div>


    </div>
  )
}

export default Header