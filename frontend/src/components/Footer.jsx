import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-3 gap-14 my-10 mt-40 text-sm'>
            {/*---left side section --*/}
            <div className='flex flex-col items-center'>
                <img className='mb-2 w-50' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>MediBook Pro is your trusted partner in health management, offering seamless appointment scheduling, secure access to medical records, and personalized health insights. We connect patients with top-tier healthcare professionals, making wellness accessible and efficient. Experience a new era of healthcare convenience with MediBook Pro</p>
            </div>

            {/*---middle side section --*/}
            <div className='py-17 px-5'>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy policy</li>
                </ul> 
            </div>

            {/*---right side section --*/}
            <div className='py-17 px-5 items-end'>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>0760609159</li>
                    <li>medibookpro@eng.pdn.ac.lk</li>
                </ul>
            </div>
        </div>
                    {/*---Copyright section --*/}
            <div>
                <hr />
                <p className='py-5 text-sm text-center text-gray-900'>Copyright 2025@ Medi-Book-Pro - All Right Reserved.</p>
            </div>
    </div>
  )
}

export default Footer