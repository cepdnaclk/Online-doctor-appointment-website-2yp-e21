import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10'>
        {/*--- this is the left side----*/}
        <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10  m-auto md:py-[10vw] md:mb-[-30px]'>
            <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                Your Health, Your Schedule  <br/> 
                <span className='text-2xl'>Book with Verified Healthcare Professionals</span>
            </p>
                <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                    <img className='w-28' src={assets.group_profiles} alt="" />
                    <p>Your path to better health starts here. <br/>Discover our expert doctors and easily book your visit.</p>
                </div>
                <a href='#speciality' className='flex items-center bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-200'>
                    Book your appointment now <img src={assets.arrow_icon} className='w-3' alt=""/>
                </a>

        </div>

        {/*--- this is to Right side ---*/}
        <div className='md:w-1/2 relative'>
            <img src={assets.header_img} className='w-full md:absolute bottom-0 h-auto rounded-lg text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300' alt=''/>
        </div>


    </div>
  )
}

export default Header