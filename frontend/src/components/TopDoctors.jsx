import React, { useContext } from 'react'
// import { doctors } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {

    // to navigate the respected doctor
    const navigate = useNavigate()
    const {doctors} = useContext(AppContext)
    
    // Debug: Check if doctors data is loaded
    console.log('Doctors data:', doctors)

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
        <h1 className='mb-2 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl text-center'>
            Explore Our <mark className='px-2 text-white bg-primary-300 rounded-sm dark:bg-primary-200'>Top Doctors</mark>
        </h1>
        <p className='sm:w-2/5 text-center text-gray-500 text-base md:text-lg lg:text-l'>
            Find your ideal doctor from our trusted network.
        </p>

        <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-6 sm:px:0'> 
            {doctors.slice(0,10).map((item,index)=>(
                <div
                    onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}}
                    key={index}
                    className='doc-card cursor-pointer transition-transform duration-300 hover:-translate-y-2'
                >
                    <div className='doc-card-inner rounded-2xl overflow-hidden'>
                        <img className='w-full h-70 bg-primary-200 object-cover object-center' src={item.image} alt="" />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${ item.available ? "text-green-500" : "text-gray-500"}`}>
                                <p className={`w-2 h-2 ${item.available ? 'bg-green-600' : 'bg-gray-500'} bg-green-600 rounded-full`}></p><p>{item.available ? "Available" : "Not Available"}</p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                            <p className='text-gray-700 text-base'>{item.speciality}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <button onClick={()=> {navigate('/doctors'); scrollTo(0,0)}} className='bg-primary-50 text-gray-700 px-12 py-3 rounded-full mt-10 cursor-pointer'>more</button>
    </div>
  )
}

export default TopDoctors