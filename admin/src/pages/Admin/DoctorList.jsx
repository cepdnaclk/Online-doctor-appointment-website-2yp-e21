import React, { useContext, useEffect, useState, useMemo } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { FiUsers } from 'react-icons/fi'

const DoctorList = () => {

  const {doctors, aToken, getAllDoctors ,changeAvailability} = useContext(AdminContext)
  useEffect(()=>{
    if(aToken){
      getAllDoctors()
    }
  },[aToken, getAllDoctors])

  const [visibleCount, setVisibleCount] = useState(8)

  const visibleDoctors = useMemo(() => {
    if (!Array.isArray(doctors)) return []
    return doctors.slice(0, Math.max(0, visibleCount))
  }, [doctors, visibleCount])

  const canLoadMore = (doctors?.length || 0) > visibleCount

  return (
    <div className="m-5 space-y-4">
      {/* Title bar */}
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiUsers className="text-primary-600" size={20} />
          <h1 className="text-lg font-semibold text-gray-800">All Doctors</h1>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700 ring-1 ring-primary-200/60">{doctors?.length || 0}</span>
      </div>

      {/* Grid of cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleDoctors.map((item, index) => (
          <div key={index} className="rounded-2xl p-[1.5px] bg-gradient-to-tr from-primary-200/50 via-primary-300/40 to-primary-500/40 shadow-md hover:shadow-lg transition">
            <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-black/5">
              <img
                className="w-full h-44 sm:h-48 object-cover object-top bg-gray-100"
                src={item.image}
                alt={item.name}
                loading="lazy"
                decoding="async"
              />

              <div className="p-4">
                <p className="text-gray-800 text-base font-semibold truncate" title={item.name}>{item.name}</p>
                <div className="mt-1">
                  <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 ring-1 ring-primary-200/60">{item.speciality}</span>
                </div>

                {/* Availability toggle */}
                <label className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                  <input
                    onChange={() => changeAvailability(item._id)}
                    type="checkbox"
                    checked={item.available}
                    className="peer sr-only"
                  />
                  <span className="w-10 h-6 rounded-full bg-gray-200 relative ring-1 ring-black/5 transition-all duration-200 peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow after:transition-all after:duration-200 peer-checked:after:translate-x-4"></span>
                  <span className="text-gray-700">{item.available ? 'Available' : 'Unavailable'}</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      {canLoadMore && (
        <div className="max-w-6xl mx-auto pt-1">
          <button
            onClick={() => setVisibleCount((v) => Math.min(v + 8, doctors.length))}
            className="mx-auto block px-5 py-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:shadow-lg hover:-translate-y-[1px] hover:from-primary-500 hover:to-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  )
}

export default DoctorList