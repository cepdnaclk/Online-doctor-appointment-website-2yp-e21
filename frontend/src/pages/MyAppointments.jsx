import React, { useContext, useEffect, useState, useCallback } from 'react'
import {AppContext} from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {

  const {backendUrl, token, getDoctorsData} = useContext(AppContext)
  const [appointments,setAppointments] = useState([])
  const [sdkLoaded, setSdkLoaded] = useState(false) // added
  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  // Load PayHere SDK dynamically (fallback if not already present)
  useEffect(() => {
    // If already available (from index.html), mark as loaded
    if (typeof window !== 'undefined' && window.payhere) {
      setSdkLoaded(true)
      console.log('PayHere SDK ready (preloaded).')
      return
    }

    const SANDBOX_URL = 'https://sandbox.payhere.lk/lib/payhere.js'
    const LIVE_URL = 'https://www.payhere.lk/lib/payhere.js'

    const findExistingScript = () => {
      const scripts = Array.from(document.getElementsByTagName('script'))
      return scripts.find(s => (s.src.includes('payhere.lk') && s.src.includes('/lib/payhere.js')) )
    }

    const attachListeners = (scriptEl) => {
      if (!scriptEl) return
      scriptEl.addEventListener('load', onLoad)
      scriptEl.addEventListener('error', onError)
    }

    const onLoad = () => {
      if (window.payhere) {
        setSdkLoaded(true)
        console.log('PayHere SDK loaded successfully')
      }
    }
    const onError = () => {
      console.error('Failed to load PayHere SDK script tag')
      toast.error('Failed to load payment system. Please check your internet connection or allow external scripts.')
    }

    const inject = (url) => {
      const script = document.createElement('script')
      script.src = url
      script.type = 'text/javascript'
      script.async = true
      script.onload = onLoad
      script.onerror = onError
      document.head.appendChild(script)
      return script
    }

    let scriptRef = findExistingScript()
    if (scriptRef) {
      attachListeners(scriptRef)
    } else {
      scriptRef = inject(SANDBOX_URL)
    }

    // Fallback: if not ready in 2.5s, try loading from LIVE domain (still uses sandbox mode via payload)
    const fallbackId = setTimeout(() => {
      if (!window.payhere) {
        console.warn('Sandbox SDK not ready, trying LIVE SDK URL as fallback')
        inject(LIVE_URL)
      }
    }, 2500)

    // Safety timeout to notify user if still not ready
    const timeoutId = setTimeout(() => {
      if (!window.payhere) {
        console.warn('PayHere SDK not ready after timeout')
        toast.warning('Payment system is still loading... If this persists, disable ad-blockers and try again.')
      }
    }, 5000)

    return () => {
      clearTimeout(fallbackId)
      clearTimeout(timeoutId)
      const ex = findExistingScript()
      if (ex) {
        ex.removeEventListener('load', onLoad)
        ex.removeEventListener('error', onError)
      }
    }
  }, [])



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

  // handle payment
  // Fallback: submit standard HTML form to PayHere if SDK is unavailable
  const submitStandardCheckout = (payment) => {
    try {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = (payment.sandbox ? 'https://sandbox.payhere.lk/pay/checkout' : 'https://www.payhere.lk/pay/checkout')
      form.target = '_self'

      Object.entries(payment).forEach(([key, value]) => {
        // Only include primitive fields PayHere expects
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = String(value)
          form.appendChild(input)
        }
      })

      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    } catch (e) {
      console.error('Standard checkout submit failed', e)
      toast.error('Unable to start payment. Please try again or disable ad-blockers.')
    }
  }

  const handlePayment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/generate-payment', { appointmentId }, { headers: { token } });
      if (data.success) {
        const payment = data.payment;
        
        // In development, prefer fallback to avoid CORS from localhost
        const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV
        if (isDev) {
          submitStandardCheckout(payment)
          return
        }

        if (window.payhere) {
          // Use window.payhere when available
          window.payhere.onCompleted = function (orderId) {
            console.log("Payment completed. OrderID:" + orderId);
            toast.success("Payment completed");
            getUserAppointments();
          };
          
          window.payhere.onDismissed = function () {
            console.log("Payment dismissed");
            toast.error("Payment dismissed");
          };
          
          window.payhere.onError = function (error) {
            console.log("PayHere SDK Error:", error);
            // Auto-fallback to standard checkout to avoid CORS/extension issues
            toast.warning('Payment encountered an SDK error, switching to fallback checkout...')
            submitStandardCheckout(payment)
          };
          
          window.payhere.startPayment(payment);
        } else {
          // Fallback to standard checkout form post
          toast.info('Starting payment with fallback mode...')
          submitStandardCheckout(payment)
        }
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
                  title={sdkLoaded ? 'Pay with PayHere' : 'Pay with PayHere (fallback)'}
                >
                  {sdkLoaded ? 'Pay Online' : 'Pay Online (fallback)'}
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