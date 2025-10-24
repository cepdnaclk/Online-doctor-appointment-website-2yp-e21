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
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>MyAppointments</p>
      <div>
        {appointments.map((item,index)=>(
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-primary-200 rounded-full' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-sm' >{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button 
                  onClick={() => handlePayment(item._id)}
                  className={`text-sm text-center sm:min-w-48 py-2 border rounded transition-all duration-300 hover:bg-blue-500 hover:text-white cursor-pointer`}
                  title="Pay Online"
                >
                  Pay Online
                </button>
              )}
              {item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-800 rounded text-green-600'>Paid</button>}
              {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transitin-all duration-300'>Cancel appointments</button>}
              {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-800 rounded text-red-600'>Appointment Cancelled</button>}
              {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button> }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
}

export default MyAppointments;