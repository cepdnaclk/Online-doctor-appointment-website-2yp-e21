import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { FaFilter } from "react-icons/fa";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const { doctors } = useContext(AppContext);
  // normalize current speciality from URL (handle spaces/case)
  const activeSpec = speciality ? decodeURIComponent(speciality) : '';

  useEffect(() => {
    const applyFilter = () => {
      if (activeSpec) {
        setFilterDoc(
          doctors.filter(
            (doc) => (doc.speciality || '').toLowerCase() === activeSpec.toLowerCase()
          )
        );
      } else {
        setFilterDoc(doctors);
      }
    };
    applyFilter();
  }, [doctors, activeSpec]);

  const specialities = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center text-white text-center py-24"
        style={{ backgroundImage: `url(${assets.doctor_hero})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative">
          <h1 className="text-5xl font-bold mb-4">Find Your Doctor</h1>
          <p className="text-xl">Search and book appointments with the best doctors.</p>
        </div>
      </div>

      <div className='container mx-auto px-4 py-12'>
        <div className='flex flex-col lg:flex-row items-start gap-8'>
          {/* Filter Section */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className='text-primary-500 text-2xl font-semibold'>Filter by Speciality</h2>
                <button onClick={() => setShowFilter(prev => !prev)} className="lg:hidden text-primary-500">
                  <FaFilter size={24} />
                </button>
              </div>
              <div className={`flex-col gap-3 text-lg text-gray-700 ${showFilter ? 'flex' : 'hidden lg:flex'}`}>
                <p 
                  onClick={() => navigate('/doctors')} 
                  className={`cursor-pointer p-3 rounded-md transition-all border-2 border-transparent hover:border-primary-500 ${!speciality ? "bg-primary-500 text-white font-semibold" : ""}`}
                >
                  All
                </p>
                {specialities.map((spec, index) => {
                  const isActive = activeSpec.toLowerCase() === spec.toLowerCase();
                  return (
                    <p
                      key={index}
                      onClick={() => navigate(`/doctors/${encodeURIComponent(spec)}`)}
                      className={`cursor-pointer p-3 rounded-md transition-all border-2 border-transparent hover:border-primary-500 ${isActive ? "bg-primary-500 text-white font-semibold" : ""}`}
                    >
                      {spec}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Doctors List */}
          <div className='w-full lg:w-3/4'>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
              {
                filterDoc.length > 0 ? filterDoc.map((item, index) => (
                  <div
                    onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}}
                    key={index}
                    className='doc-card cursor-pointer transition-transform duration-300 hover:-translate-y-2'
                  >
                    <div className='doc-card-inner rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white'>
                        <div className='relative'>
                            <img className='w-full h-70 bg-primary-200 object-cover object-center' src={item.image} alt={item.name} />
                            <div className={`absolute top-4 right-4 flex items-center gap-2 text-sm px-3 py-1 rounded-full text-white ${item.available ? "bg-green-500" : "bg-gray-500"}`}>
                                <p className={`w-2.5 h-2.5 ${item.available ? 'bg-white' : 'bg-gray-300'} rounded-full`}></p>
                                <p>{item.available ? "Available" : "Unavailable"}</p>
                            </div>
                        </div>
                        <div className='p-4'>
                            <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                            <p className='text-gray-700 text-base'>{item.speciality}</p>
                            <p className='text-gray-600 text-sm mt-2'>Experience: {item.experience || 'N/A'} years</p>
                        </div>
                    </div>
                  </div>
                )) : <p>No doctors found for this speciality.</p>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Doctors;