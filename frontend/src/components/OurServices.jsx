import React from 'react';
import { assets } from '../assets/assets';

const servicesData = [
    { title: "🦷 Dental Surgery", description: "Our advanced dental unit provides a full spectrum of oral healthcare, from routine check-ups and cleanings to complex surgical procedures. We specialize in dental implants, wisdom tooth removal, and cosmetic dentistry, all in a comfortable and modern environment." },
    { title: "🔬 Pathology", description: "Our state-of-the-art pathology laboratory is critical for accurate diagnosis. We provide precise and timely analysis of blood, tissue, and other bodily samples, giving your doctor the vital information needed to create an effective treatment plan." },
    { title: "💊 Pharmacy", description: "Our on-site pharmacy offers a convenient way to fill your prescriptions right after your appointment. Our knowledgeable pharmacists are available to answer your questions, advise on medication management, and provide over-the-counter solutions." },
    { title: "🦠 Microbiology", description: "The microbiology department identifies bacteria, viruses, and other microorganisms causing infections. This specialized service is essential for pinpointing the exact cause of an illness and selecting the most effective antibiotics or treatments." },
    { title: "❤️ Cardiology (Physiology)", description: "We offer comprehensive care for your heart. Our cardiology department specializes in the prevention, diagnosis, and treatment of heart disease, managing conditions like hypertension, arrhythmias, and coronary artery disease with advanced diagnostics and care." },
    { title: "💧 Urology", description: "Our urology department addresses conditions of the male and female urinary tract and the male reproductive system. We provide compassionate care for issues such as kidney stones, prostate health, incontinence, and urinary tract infections." },
    { title: "🦴 Orthopaedics", description: "From sports injuries and fractures to chronic conditions like arthritis, our orthopaedic specialists are here to help you move pain-free. We offer advanced surgical and non-surgical treatments, including joint replacements and physical therapy." },
    { title: "🧠 Neurology", description: "Our neurology team diagnoses and treats disorders of the nervous system, including the brain, spinal cord, and nerves. We manage complex conditions such as strokes, epilepsy, migraines, and multiple sclerosis with expert care." },
    { title: "🧑‍⚕️ Compassionate Nursing", description: "Our highly skilled and dedicated nursing staff are the heart of our clinic. They provide 24/7 care, manage your treatment plan, and offer the personal support and compassion you need during your recovery." }
];

const OurServices = () => {

    return (
        <div
            className='our-services-container bg-cover bg-fixed bg-center relative py-20'
            style={{ backgroundImage: `url(${assets.services_bg})` }}
        >
            <div className='absolute inset-0 bg-black opacity-50'></div>
            <div className='relative z-10 container mx-auto px-4 text-white'>
                <h2 className='text-4xl font-bold text-center mb-12'>Our Services</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {servicesData.map((service, index) => (
                        <div key={index} className='bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-lg backdrop-blur-sm'>
                            <h3 className='text-2xl font-semibold mb-3'>{service.title}</h3>
                            <p className='text-gray-300'>{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OurServices;
