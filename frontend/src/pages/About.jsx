import React from 'react'
import { assets } from '../assets/assets';


const About = () => {
  return (
    <div>
      <div className='text-center text-3xl pt-10 text-gray-600'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'> <img className='w-full md:max-w-[360px] md:max-h-fit' src={assets.about_image} alt="" />
      <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'> 
        <p>Welcome to MediBookPro, your trusted partner for managing your healthcare needs with convenience and efficiency. We understand the challenges you face in scheduling doctor appointments and keeping your health records organized. That's why we've designed a platform dedicated to simplifying your healthcare journey, putting you in complete control.</p>
        <p>MediBookPro is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, MediBookPro is here to support you every step of the way.</p>
        <b className='text-gray-800'>Our Vision</b>
        <p>Our vision at MediBookPro is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
      </div>
    </div>

    <div className='text-xl my-4'>
      <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
    </div>
    <div className='flex flex-col md:flex-row mb-20 gap-2'>
      <div className='border px-10 md:px-16  py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary-200 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>EFFORTLESS BOOKING:</b>
        <p>Find available slots and book appointments in real-time, 24/7, without a single phone call.</p>
      </div>

      <div className='border px-10 md:px-16  py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary-200 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
       <b>COMPREHENSIVE ACCESS:</b>
        <p>Connect with specialists for both in-person visits and virtual telehealth consultations.</p>
      </div>
    
      <div className='border px-10 md:px-16  py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary-200 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>SMART HEALTH TRACKING:</b>
        <p>Get intelligent reminders for follow-ups, medication, and preventive check-ups tailored to you.</p>
      </div>

  </div>

  </div>
  )
}

export default About;