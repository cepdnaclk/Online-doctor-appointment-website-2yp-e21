import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import assets from '../../assets/assets'

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
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {
          (appointments || []).map((item, index) => (
            <div key={item?._id || index} className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50'>
              <p>{index + 1}</p>

              <div className='flex items-center gap-2'>
                <img className='w-9 h-9 rounded-full object-cover' src={item?.userData?.image || ''} alt='' />
                <p>{item?.userData?.name || '—'}</p>
              </div>

              <div>
                <p>{item?.payment ? 'Online' : 'CASH'}</p>
              </div>

              <p>{calculateAge(item?.userData?.dob)}</p>
              <p>{slotDateFormat(item?.slotDate)}, {item?.slotTime}</p>
              <p>{currency(item?.amount)}</p>

              {
                item.cancelled ? <p className='text-red-500'>Cancelled</p>
                  : item.isCompleted ? <p className='text-green-500'>Completed</p>
                    : <div className='flex gap-2'>
                      <img onClick={() => cancelAppointment(item._id)} className='w-8 cursor-pointer' src={assets.cancel_icon} alt='cancel' />
                      <img onClick={() => completeAppointment(item._id)} className='w-8 cursor-pointer' src={assets.tick_icon} alt='done' />
                    </div>
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorAppointments