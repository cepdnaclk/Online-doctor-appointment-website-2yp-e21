import React, { useContext, useEffect, useState, useCallback } from 'react'
import {AppContext} from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {

  const {backendUrl, token, getDoctorsData} = useContext(AppContext)
  const [appointments,setAppointments] = useState([])
  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]



  const slotDateFormat = (slotDate) =>{
    const dateArray = slotDate.split("_")
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }


  // getting the user appointments to display from the backend
  const getUserAppointments = useCallback(async() =>{
    try {
      const {data} = await axios.get(backendUrl+'/api/user/appointments',{headers:{token}})
      if(data.success){
        // Sort appointments by date (latest first)
        const sortedAppointments = data.appointments.sort((a, b) => {
          // Convert slotDate from "DD_MM_YYYY" format to comparable date
          const dateA = new Date(a.slotDate.split('_').reverse().join('-'))
          const dateB = new Date(b.slotDate.split('_').reverse().join('-'))
          
          // If dates are equal, compare by time
          if (dateA.getTime() === dateB.getTime()) {
            // Convert time to 24-hour format for comparison
            const timeA = a.slotTime.includes('pm') && !a.slotTime.includes('12:') 
              ? parseInt(a.slotTime) + 12 
              : parseInt(a.slotTime)
            const timeB = b.slotTime.includes('pm') && !b.slotTime.includes('12:')
              ? parseInt(b.slotTime) + 12
              : parseInt(b.slotTime)
            return timeB - timeA
          }
          
          return dateB - dateA // Latest date first
        })
        setAppointments(sortedAppointments)
        console.log(sortedAppointments)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  },[backendUrl, token])

  const cancelAppointment = async (appointmentId) =>{
    try {
      console.log(appointmentId)
      const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers:{token}})
      if(data.success){
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()

      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const handlePayment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/generate-payment', { appointmentId }, { headers: { token } });
      if (data.success) {
        // Redirect to mock payment page
        window.location.href = data.payment.redirectUrl;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }


  useEffect(()=>{
    if(token){
      getUserAppointments()
    }
  },[token, getUserAppointments])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      {/* Hero section */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-zinc-300 bg-white p-6 sm:p-8 shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary-50/40 via-transparent to-primary-50/40" />
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-primary-500 via-blue-400 to-blue-500 bg-clip-text text-transparent">
            My Appointments
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600">Review upcoming visits, pay online, or cancel when needed.</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {appointments.map((item,index)=>(
          <div
            className="group rounded-2xl border border-zinc-200/70 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
            key={index}
          >
            <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] gap-4 sm:gap-6 items-start">
              {/* Avatar */}
              <div className="shrink-0">
                <img
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-primary-100/60 bg-primary-50"
                  src={item.docData.image}
                  alt="Doctor"
                />
              </div>

              {/* Info */}
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-900 font-semibold text-base sm:text-lg'>{item.docData.name}</p>
                <p className="text-primary-500 font-medium">{item.docData.speciality}</p>

                <div className="mt-2 grid gap-1.5">
                  <p className='text-xs mt-1'>
                    <span className='text-sm text-neutral-700 font-medium'>Date &amp; Time: </span>
                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className='flex flex-col sm:items-end gap-2 justify-end'>
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button 
                    onClick={() => handlePayment(item._id)}
                    className={`text-sm text-center sm:min-w-48 py-2 px-4 border rounded btn-gradient-shine transition-all duration-300 bg-gradient-to-r from-primary-200 to-primary-500 text-white hover:shadow-lg cursor-pointer`}
                    title="Pay Online"
                  >
                    Pay Online
                  </button>
                )}
                {item.payment && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 px-4 border border-green-700/70 rounded text-green-700 bg-green-50'>
                    Paid
                  </button>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button
                    onClick={()=>cancelAppointment(item._id)}
                    className='text-sm text-center sm:min-w-48 py-2 px-4 border rounded bg-red-50 text-red-700 border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300'
                  >
                    Cancel appointments
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 px-4 border border-red-700/70 rounded text-red-700 bg-red-50'>
                    Appointment Cancelled
                  </button>
                )}
                {item.isCompleted && (
                  <button className='sm:min-w-48 py-2 px-4 border border-green-500 rounded text-green-600 bg-emerald-50'>
                    Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
}

export default MyAppointments;