import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {

    const navigate = useNavigate();

    // Small, dependency-free counter component
    const Counter = ({ end = 50, duration = 1500, suffix = '+', label, as = 'div' }) => {
        const [val, setVal] = useState(0)
        const ref = useRef(null)
        const started = useRef(false)

        useEffect(() => {
            const el = ref.current
            if (!el) return

            const obs = new IntersectionObserver(
                ([e]) => {
                    if (e.isIntersecting && !started.current) {
                        started.current = true
                        const startTs = performance.now()
                        const animate = (now) => {
                            const p = Math.min(1, (now - startTs) / duration)
                            setVal(Math.floor(end * (1 - Math.pow(1 - p, 3)))) // ease-out
                            if (p < 1) requestAnimationFrame(animate)
                        }
                        requestAnimationFrame(animate)
                    }
                },
                { threshold: 0.3 }
            )
            obs.observe(el)
            return () => obs.disconnect()
        }, [end, duration])

        const WrapperEl = as || 'div'

        return React.createElement(
            WrapperEl,
            { ref, className: 'inline-flex flex-col items-start' },
            (
                <span className="inline-flex items-baseline gap-1 tabular-nums text-4xl sm:text-5xl font-extrabold text-white drop-shadow-[0_2px_20px_rgba(216,0,255,0.25)]">
                    <span>{val}</span>
                    <span>{suffix}</span>
                </span>
            ),
            label && (
                <span className="mt-1 inline-flex font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-300 text-sm sm:text-base">
                    {label}
                </span>
            )
        )
    }

  return (
    <div className='flex bg-primary-500 rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
        {/* --- this is for left side --- */}
        <div className='flex-1 py-8 sm:py-10 md:py-16 lg-py-24 lg-pl-5'>
            <div className='text-xl sm:text-2xl md:text-5xl font-semibold text-white px-30'>
                <p>Book Today ,</p>
                <p className='mt-4 flex items-baseline gap-2'>
                    With
                    <span className='inline-flex items-baseline gap-1'>
                        {/* Animated 50+ inline */}
                        <Counter as="span" end={50} duration={1400} suffix='+' />
                    </span>
                    Trusted Doctors
                </p>
            </div>
            <div className='px-30'>
            <button
                onClick={()=>{navigate('/login'); scrollTo(0,0)}}
                className='px-30btn-shine relative overflow-hidden rounded-full mt-6 px-8 py-3 text-sm sm:text-base font-semibold tracking-wide text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-[0_10px_30px_rgba(124,58,237,0.35)] hover:shadow-[0_14px_40px_rgba(124,58,237,0.5)] transition-all duration-300 hover:scale-[1.04] focus:outline-none focus:ring-2 focus:ring-purple-300'
            >
                Create Account
            </button></div>

            {/* Counters row (footer-like stats) */}
            <div className='mt-8 grid grid-cols-2 gap-6 max-w-md px-30'>
                <Counter end={50} duration={1600} suffix='+' label='Doctors' />
                <Counter end={2500} duration={1800} suffix='+' label='Patients' />
            </div>
        </div>

        {/* --- this is for right side --- */}
        <div className='hidden md:block md:w-1/2 lg:w-[700px] relative'>
            <img className='w-full absolute bottom-0 right-0 ' src={assets.appointment_img} alt="" />
        </div>
    </div>
  )
}

export default Banner


/*
This set of Tailwind CSS classes creates a responsive element that changes its visibility and width based on the screen size. It's a classic example of a "mobile-first" design approach.

Here's a breakdown of what each class does:

## Visibility & Layout
hidden: This makes the element hidden by default on small screens (mobile). It sets the CSS property display: none;.

md:block: At the medium breakpoint (768px and wider), this class overrides hidden. It makes the element visible by setting its display property to block (display: block;), which means it will take up its own line.

In summary: The element is invisible on mobile and appears on tablet-sized screens and larger.

## ස්ථානගත කිරීම (Positioning)
Positioning තේරුම් ගන්න හොඳම විදිහ තමයි relative සහ absolute එකට හිතන එක. හිතන්න relative කියන්නේ බිත්තියක්, absolute කියන්නේ ඒ බිත්තියේ ගහන පෝස්ටරයක් කියලා.

relative (සාපේක්ෂ ⚓️)
මේක නැංගුරමක් (anchor) වගේ. මේ class එක දාපු element එක සාමාන්‍ය විදිහටම page එකේ තියෙනවා. හැබැයි, ඒක ඇතුළේ තියෙන absolute element වලට සීමාවක් (boundary) හදනවා. absolute element එකක් ස්ථානගත වෙන්නේ තමන්ට ළඟම තියෙන relative parent එකට සාපේක්ෂවයි.

absolute (නිරපේක්ෂ 📌)
මේක පාවෙන element එකක් වගේ. absolute දාපු ගමන්, ඒ element එක page එකේ සාමාන්‍ය පිළිවෙළෙන් (normal flow) ඉවත් වෙනවා. ඊටපස්සේ top, bottom, left, right class පාවිච්චි කරලා, ඒකේ relative parent එක ඇතුළේ ඕනෑම තැනක නිශ්චිතවම ස්ථානගත කරන්න පුළුවන්.

උදාහරණය:
Card එකක කෙළවරේම "New" badge එකක් දාන්න ඕන නම්,

Card එකට relative class එක දානවා (මේක තමයි බිත්තිය).

"New" badge එකට absolute, top-0, right-0 class දානවා (මේක තමයි පෝස්ටරය).

එතකොට badge එක Card එකේ උඩම දකුණු කෙළවරට යනවා.

## වෙනත් Position ක්‍රම
fixed (ස්ථාවර)
මේ class එක දාපු element එක page එක scroll කළත්, එකම තැන හිරවෙලා (fixed) තියෙනවා. ඒක ස්ථානගත වෙන්නේ browser window එකට (viewport) සාපේක්ෂවයි. උදාහරණයක් විදිහට, සමහර websites වල උඩම තියෙන navigation bar එක.

sticky (ඇලෙන සුළු)
මේක relative සහ fixed වල එකතුවක්. Element එක සාමාන්‍ය විදිහට scroll වෙනවා, හැබැයි අපි දෙන top-0 වගේ තැනකට ආවම, ඒක තිරයේ උඩටම ඇලිලා (sticks) එතන ඉඳන් fixed වගේ හැසිරෙනවා. Section මාතෘකා (headings) වලට මේක ගොඩක් පාවිච්චි කරනවා.












Tools



*/