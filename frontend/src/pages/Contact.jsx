import React from 'react'
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div>
        <div className='text-center text-2xl pt-10 text-gray-500'>
          <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
        </div>

        <div className='my-10 flex flex-col md:flex-row justify-center gap-10 mb-28 text-sm'>
          <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />

          <div className='flex flex-col justify-center items-start gap-6'>
            <p className='font-semibold text-lg text-gray-600'>Our Main OFFICE</p>
            <p className='text-gray-500'>No.017 , <br /> Peradeniya road, <br /> Kandy</p>
            <p className='text-gray-500'>Tel:- (+94) 000 000 00 <br /> Email: medibookpro@eng.pdn.ac.lk</p>
            <p className='font-semibold text-lg text-gray-600'>Careers at MediBook-Pro</p>
            <p className='text-gray-600'>Learn more about our team and job openings.</p>
            <button className='border border-primary-500 px-8 py-4 text-sm hover:bg-primary-200 hover:text-white transition-all duration-500 '>Explore Jobs</button>
          </div>
        </div>
    </div>
  )
}

export default Contact