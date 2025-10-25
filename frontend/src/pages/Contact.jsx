import React from 'react';
import { assets } from '../assets/assets';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <div className="relative text-white text-center py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${assets.medical_equipment})` }}
        ></div>
        <div className="absolute inset-0 bg-primary-700/80"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight">Get in Touch</h1>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
            We're here to help. Contact us with your questions or feedback.
          </p>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-xl overflow-hidden">
          
          {/* Image Section */}
          <div className="lg:w-1/2 flex items-center justify-center">
            <img src={assets.contact_image} alt="Contact Us" className="w-full h-auto max-h-[600px] object-cover rounded-lg" />
          </div>

          {/* Contact Info */}
          <div className="lg:w-1/2 bg-primary-800 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
            <div className="space-y-6 text-gray-200">
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt size={20} className="text-primary-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Our Main Office</h3>
                  <p>No.017, Peradeniya road, Kandy</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaPhoneAlt size={20} className="text-primary-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p>(+94) 000 000 00</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaEnvelope size={20} className="text-primary-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p>medibookpro@eng.pdn.ac.lk</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaClock size={20} className="text-primary-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Working Hours</h3>
                  <p>Mon - Fri: 08:00 - 17:00</p>
                  <p>Sat - Sun: Closed</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
                <p className='font-semibold text-lg text-gray-100'>Careers at MediBook-Pro</p>
                <p className='text-gray-200 mt-2'>Learn more about our team and job openings.</p>
                <button className='mt-4 border text-white border-primary-200 px-8 py-3 text-sm hover:bg-primary-200 hover:text-white transition-all duration-500 rounded-lg'>Explore Jobs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;