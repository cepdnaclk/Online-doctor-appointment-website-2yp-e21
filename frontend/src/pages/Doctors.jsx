import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {

  const {speciality} = useParams()
  const navigate = useNavigate();
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter,setShowFilter] = useState(false)
  const {doctors} = useContext(AppContext)


  useEffect(()=>{
    const applyFilter = () => {
      if (speciality) {
        setFilterDoc(doctors.filter(doc=>doc.speciality===speciality))
      }else{
        setFilterDoc(doctors)
      }
    }
    applyFilter()
  },[doctors, speciality])

  return (
    <div>
    <p className='text-gray-600'>Filter by Speciality</p>
    <button onClick={()=>setShowFilter(prev=>!prev)} className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter?'bg-primary-200 text-white':''}`}>Filter</button>
    <div className='flex flex-col sm:flex-row items-start gap-5 mt-5' >
      <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter?'flex' :'hidden sm:flex'}`}>
        <p onClick={()=>speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded-xl transition-all cursor-pointer ${speciality === "General physician" ? "bg-primary-50 text-black" : ""}`}>General physician</p> {/*conditionally styling here*/}
        <p onClick={()=>speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded-xl transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-primary-50 text-black" : ""}`}>Gynecologist</p>
        <p onClick={()=>speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded-xl transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-primary-50 text-black" : ""}`}>Dermatologist</p>
        <p onClick={()=>speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded-xl transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-primary-50 text-black" : ""}`}>Pediatricians</p>
        <p onClick={()=>speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded-xl transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-primary-50 text-black" : ""}`}>Neurologist</p>
        <p onClick={()=>speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded-xl transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-primary-50 text-black" : ""}`}>Gastroenterologist</p>
      </div>

{/* this is to show the doctors menu like home page*/}
      <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
        {
          filterDoc.map((item,index)=>(
            <div onClick={()=>{navigate(`/appointment/${item._id}`); scrollTo(0,0)}} key={index} className='border border-primary-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] duration-300'>
                    <img className='bg-primary-200' src={item.image} alt="" />
                    <div className='p-4'>
                        <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                            <p className='w-2 h-2 bg-green-600 rounded-full'></p><p>Available</p>
                        </div>
                        <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                        <p className='text-gray-600 text-sm'>{item.speciality}</p>
                    </div>
            </div> 
          ))
        }
      </div>
    </div>
    </div>
  )
}

export default Doctors;