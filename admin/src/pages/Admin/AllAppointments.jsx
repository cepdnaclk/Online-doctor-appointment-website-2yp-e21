import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { FiList, FiXCircle } from 'react-icons/fi'

const AllAppointments = () => {

  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken, getAllAppointments])

  return (
    <div className='w-full max-w-6xl m-5 space-y-4'>
      {/* Card wrapper with gradient hairline */}
      <div className="rounded-2xl p-[1.5px] bg-gradient-to-tr from-primary-200/50 via-primary-300/40 to-primary-500/40 shadow-md">
        <div className='bg-white rounded-2xl overflow-hidden ring-1 ring-black/5 text-sm'>
          {/* Title bar */}
          <div className='flex items-center justify-between px-4 py-4 border-b'>
            <div className='flex items-center gap-2'>
              <FiList className='text-primary-600' size={20} />
              <p className='font-semibold text-gray-800'>All Appointments</p>
            </div>
            <span className='text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700 ring-1 ring-primary-200/60'>
              {(appointments || []).length}
            </span>
          </div>

          {/* Column header */}
          <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b text-gray-600 sticky top-0 bg-white z-10'>
            <p>#</p>
            <p>Patient</p>
            <p>Age</p>
            <p>Date &amp; Time</p>
            <p>Doctor</p>
            <p>Fees</p>
            <p>Actions</p>
          </div>

          {/* Rows */}
          <div className='max-h-[75vh] min-h-[60vh] overflow-y-auto'>
            {(appointments || []).map((item, index) => (
              <div
                className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50'
                key={index}
              >
                <p className='max-sm:hidden'>{index + 1}</p>

                <div className='flex items-center gap-2'>
                  <img className='w-8 h-8 rounded-full object-cover ring-1 ring-black/5' src={item.userData?.image || ''} alt='Patient avatar' />
                  <p className='text-gray-800'>{item.userData?.name}</p>
                </div>

                <p className='max-sm:hidden'>{calculateAge(item.userData?.dob)}</p>

                <p className='text-gray-700'>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

                <div className='flex items-center gap-2'>
                  <img className='w-8 h-8 rounded-full object-cover bg-gray-200 ring-1 ring-black/5' src={item.docData?.image || ''} alt='Doctor avatar' />
                  <p className='text-gray-800'>{item.docData?.name}</p>
                </div>

                <p className='text-gray-800'>{currency(item.amount)}</p>

                {item.cancelled ? (
                  <span className='px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 ring-1 ring-red-200/60'>Cancelled</span>
                ) : item.isCompleted ? (
                  <span className='px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 ring-1 ring-green-200/60'>Completed</span>
                ) : (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    title='Cancel appointment'
                    className='inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-100 ring-1 ring-red-200/60 transition'
                  >
                    <FiXCircle size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllAppointments