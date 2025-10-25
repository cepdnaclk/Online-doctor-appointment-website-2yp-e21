import React from 'react';
import { assets } from '../assets/assets';
import { FaCalendarCheck, FaLaptopMedical, FaHeartbeat } from 'react-icons/fa'; // Using react-icons for modern icons

const About = () => {
  const features = [
    {
      icon: <FaCalendarCheck size={40} className="text-primary-300" />,
      title: "Effortless Booking",
      description: "Find available slots and book appointments in real-time, 24/7, without a single phone call."
    },
    {
      icon: <FaLaptopMedical size={40} className="text-primary-300" />,
      title: "Comprehensive Access",
      description: "Connect with specialists for both in-person visits and virtual telehealth consultations."
    },
    {
      icon: <FaHeartbeat size={40} className="text-primary-300" />,
      title: "Smart Health Tracking",
      description: "Get intelligent reminders for follow-ups, medication, and preventive check-ups tailored to you."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <div className="relative bg-primary-700 text-white text-center py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10" 
          style={{ backgroundImage: `url(${assets.about_image})` }}
        ></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight">About MediBookPro</h1>
          <p className="mt-4 text-lg text-primary-50 max-w-2xl mx-auto">
            Your trusted partner for managing healthcare with convenience and efficiency.
          </p>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              className='w-full rounded-lg shadow-2xl' 
              src={assets.about_image} 
              alt="Our Team" 
            />
          </div>
          <div className='md:w-1/2 flex flex-col gap-6 text-base text-gray-600'>
            <h2 className="text-3xl font-bold text-gray-900">
              Simplifying Your <span className="text-primary-500">Healthcare Journey</span>
            </h2>
            <p>Welcome to MediBookPro. We understand the challenges of scheduling doctor appointments and organizing health records. That's why we've designed a platform dedicated to putting you in complete control.</p>
            <p>MediBookPro is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to deliver superior service.</p>
            <div>
              <b className='text-xl font-semibold text-gray-800'>Our Vision</b>
              <p className="mt-2">To create a seamless healthcare experience for every user, bridging the gap between patients and providers, and making it easier to access the care you need, when you need it.</p>
            </div>
          </div>
        </div>
      </div>

      {/* "Why Choose Us" Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className='mb-12 text-4xl font-extrabold leading-none tracking-tight text-gray-900'>
            Why <mark className='px-2 text-white bg-primary-300 rounded-sm'>Choose Us</mark>?
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <div key={index} className='doc-card cursor-pointer transition-transform duration-300 hover:-translate-y-2'>
                <div className='doc-card-inner p-8 flex flex-col items-center text-center'>
                  <div className="mb-6">{feature.icon}</div>
                  <h3 className='text-xl font-bold text-gray-900 mb-3'>{feature.title}</h3>
                  <p className='text-gray-600'>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;