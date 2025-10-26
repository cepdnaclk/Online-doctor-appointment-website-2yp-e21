import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { FiList, FiXCircle, FiCheckCircle } from 'react-icons/fi'

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    cancelAppointment: cancelAppointmentCtx,
    completeAppointment: completeAppointmentCtx
  } = useContext(DoctorContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  const cancelAppointment = async (id) => {
    if (typeof cancelAppointmentCtx === 'function') {
      try {
        await cancelAppointmentCtx(id)
        if (typeof getAppointments === 'function') getAppointments()
      } catch (err) {
        console.error('cancelAppointment failed', err)
      }
    } else {
      console.warn('cancelAppointment function is not provided by DoctorContext')
    }
  }

  const completeAppointment = async (id) => {
    if (typeof completeAppointmentCtx === 'function') {
      try {
        await completeAppointmentCtx(id)
        if (typeof getAppointments === 'function') getAppointments()
      } catch (err) {
        console.error('completeAppointment failed', err)
      }
    } else {
      console.warn('completeAppointment function is not provided by DoctorContext')
    }
  }

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken, getAppointments])

  return (
    <div className='w-full max-w-6xl m-5 space-y-4'>
      <div className='rounded-2xl p-[1.5px] bg-gradient-to-tr from-primary-200/50 via-primary-300/40 to-primary-500/40 shadow-md'>
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
          <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b text-gray-600 sticky top-0 bg-white z-10'>
            <p>#</p>
            <p>Patient</p>
            <p>Payment</p>
            <p>Age</p>
            <p>Date &amp; Time</p>
            <p>Fees</p>
            <p>Action</p>
          </div>

          {/* Rows */}
          <div className='max-h-[75vh] min-h-[50vh] overflow-y-auto'>
            {(appointments || []).map((item, index) => (
              <div
                key={item?._id || index}
                className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50'
              >
                <p>{index + 1}</p>

                <div className='flex items-center gap-2'>
                  <img className='w-9 h-9 rounded-full object-cover ring-1 ring-black/5' src={item?.userData?.image || ''} alt='Patient avatar' />
                  <p className='text-gray-800'>{item?.userData?.name || '—'}</p>
                </div>

                <div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ring-1 ${item?.payment ? 'bg-green-50 text-green-600 ring-green-200/60' : 'bg-yellow-50 text-yellow-700 ring-yellow-200/60'}`}>
                    {item?.payment ? 'Online' : 'Cash'}
                  </span>
                </div>

                <p>{calculateAge(item?.userData?.dob)}</p>
                <p className='text-gray-700'>{slotDateFormat(item?.slotDate)}, {item?.slotTime}</p>
                <p className='text-gray-800'>{currency(item?.amount)}</p>

                {item.cancelled ? (
                  <span className='px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 ring-1 ring-red-200/60'>Cancelled</span>
                ) : item.isCompleted ? (
                  <span className='px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 ring-1 ring-green-200/60'>Completed</span>
                ) : (
                  <div className='flex gap-2'>
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      title='Cancel appointment'
                      className='inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-100 ring-1 ring-red-200/60 transition'
                    >
                      <FiXCircle size={18} />
                    </button>
                    <button
                      onClick={() => completeAppointment(item._id)}
                      title='Mark completed'
                      className='inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-50 text-green-600 hover:bg-green-100 ring-1 ring-green-200/60 transition'
                    >
                      <FiCheckCircle size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments