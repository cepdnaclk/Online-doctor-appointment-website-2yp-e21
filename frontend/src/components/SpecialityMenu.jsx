import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
        <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='speciality'>
                <h1 className='mb-2 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl text-center'>
                    What <mark className='px-2 text-white bg-primary-600 rounded-sm dark:bg-primary-200'>speciality</mark> are you looking for?
                </h1>
                <p className='sm:w-2/5 text-center text-gray-500 text-base md:text-lg lg:text-xl'>
                    Explore our network of specialists and schedule your visit in just a few clicks.
                </p>
        <div className='flex justify-center gap-8 pt-5 w-full overflow-x-auto px-4 pb-4'>
            {specialityData.map((item,index)=>(
                <Link onClick={()=>scrollTo(0,0)} key={index} to={`/doctors/${item.speciality}`}>
                    <div className="card">
                        <div className="card-inner relative z-10 flex flex-col items-center justify-center gap-3">
                            <img src={item.image} alt={item.speciality} className="w-35 h-35 rounded-full object-cover shadow-md" />
                            <p className="text-white text-m font-semibold">{item.speciality}</p>
                            <p className="text-white/60 text-xs">Specialist</p>
                        </div>
                    </div>
                </Link>
            )
        )}
        </div>
    </div>
  )
}

export default SpecialityMenu