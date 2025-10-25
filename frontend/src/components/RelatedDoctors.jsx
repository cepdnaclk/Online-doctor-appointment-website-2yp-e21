/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
const RelatedDoctors = ({docId,speciality}) => {
  
    const {doctors} = useContext(AppContext)
    const [relDoc, setRelDocs] = useState([])
    const navigate = useNavigate()


    useEffect(()=>{
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc)=> doc.speciality === speciality && doc._id !== docId)
            setRelDocs(doctorsData)
        }
    },[doctors,speciality,docId])



  return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
        <h1 className='text-3xl font-medium'>Explore Our Top Doctors</h1>
        <p className='sm:w-1/3 text-center text-sm'>Find your ideal doctor from our trusted network</p>

        <div className='w-full grid grid-cols-auto gap-8 pt-5 gap-y-6 px-6 sm:px:0'> 
            {relDoc.slice(0,5).map((item,index)=>(
                
                <div
                    onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}}
                    key={index}
                    className='doc-card cursor-pointer transition-transform duration-300 hover:-translate-y-2'
                  >
                    <div className='doc-card-inner rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white'>
                        <div className='relative'>
                            <img className='w-full h-60 bg-primary-200 object-cover object-center' src={item.image} alt={item.name} />
                            <div className={`absolute bottom-1 right-4 flex items-center gap-2 text-sm px-3 py-1 rounded-full text-white ${item.available ? "bg-green-500" : "bg-gray-500"}`}>
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

            ))}
        </div>
        <button onClick={()=> {navigate('/doctors'); scrollTo(0,0)}} className='bg-primary-50 text-gray-700 px-12 py-3 rounded-full mt-10 cursor-pointer'>more</button>
    </div>

  )
}

export default RelatedDoctors