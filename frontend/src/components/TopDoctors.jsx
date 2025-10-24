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
        <h1 className='text-3xl font-medium'>Explore Our Top Doctors</h1>
        <p className='sm:w-1/3 text-center text-sm'>Find your ideal doctor from our trusted network</p>

        <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-6 sm:px:0'> 
            {doctors.slice(0,10).map((item,index)=>(
                
                <div onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}} key={index} className='border border-primary-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] duration-300'>
                    <img className='bg-primary-200' src={item.image} alt="" />
                    <div className='p-4'>
                        <div className={`flex items-center gap-2 text-sm text-center ${ item.available ? "text-green-500" : "text-gray-500"}`}>
                            <p className={`w-2 h-2 ${item.available ? 'bg-green-600' : 'bg-gray-500'} bg-green-600 rounded-full`}></p><p>{item.available ? "Available" : "Not Available"}</p>
                        </div>
                        <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                        <p className='text-gray-700 text-base'>{item.speciality}</p>
                    </div>
                </div> 

            ))}
        </div>
        <button onClick={()=> {navigate('/doctors'); scrollTo(0,0)}} className='bg-primary-50 text-gray-700 px-12 py-3 rounded-full mt-10 cursor-pointer'>more</button>
    </div>
  )
}

export default TopDoctors