import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {

    const navigate = useNavigate();

  return (
    <div className='flex bg-primary-300 rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
        {/* --- this is for left side --- */}
        <div className='flex-1 py-8 sm:py-10 md:py-16 lg-py-24 lg-pl-5'>
            <div className='text-xl sm:text-2xl md:text-5xl font-semibold text-white'>
                <p>Book Today ,</p>
                <p className='mt-4'>With 50+ Trusted Doctors</p>
            </div>
            <button onClick={()=>{navigate('/login'); scrollTo(0,0)}} className='bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'>create account</button>
        </div>

        {/* --- this is for right side --- */}
        <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
            <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
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