/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'
import { FaUserMd, FaGraduationCap, FaBriefcaseMedical, FaInfoCircle, FaDollarSign } from 'react-icons/fa'


const Appointment = () => {

  const { id:docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0) // times for the 


  const [slotTime, setSlotTime] = useState('')
  const navigate = useNavigate()

  const fetchDocInfo = async () => {
    const foundDoc = doctors.find(doc => doc._id === docId)
    setDocInfo(foundDoc)
    //console.log(foundDoc)
  }

  const getAvailableSlots = async () => {
    setDocSlots([])

    // Check if docInfo exists
    if (!docInfo) {
      return
    }

    //getting current date
    let today = new Date()

    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      //setting end time of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0) // දිනය සඳහා appointments අවසන් වන වේලාව රාත්‍රී 9:00 (21:00) ලෙස endTime මඟින් සකසයි.

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const slotTime = formattedTime

        const slotsForDate = docInfo.slots_booked[slotDate] || []
        const isSlotAvailable = !slotsForDate.includes(slotTime)
        if (isSlotAvailable) {
          // add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }



        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    try {
      const date = docSlots[slotIndex][0].datetime
      let day = date.getDate()
      let month = date.getMonth() + 1 // to be 1 as january
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

  useEffect(() => {
    console.log(docSlots)
  }, [docSlots])




  // &&  using conditional rendernig is cruial otherwise the system try to find null.image ...

  return docInfo && (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* --- Doctor Details Card --- */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl shadow-2xl shadow-primary-300/40 p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative p-1 group">
              <img className='w-full max-w-[200px] md:max-w-full rounded-full object-cover aspect-square border-4 border-white/80 shadow-lg group-hover:scale-105 transition-transform duration-300' src={docInfo.image} alt={docInfo.name} />
              <div className="absolute inset-0 rounded-full border-4 border-primary-400 animate-pulse"></div>
            </div>
          </div>

          <div className='flex-1 text-center md:text-left'>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className='text-3xl md:text-4xl font-bold'>{docInfo.name}</h1>
              <div className="relative w-8 h-8">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="11" fill="#42A5F5" stroke="white" strokeWidth="1"/>
                  <path d="M8 12.3l2.7 2.7L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="0" y="0" width="24" height="24" rx="12" fill="url(#shine)" />
                  <defs>
                    <linearGradient id="shine" x1="-100%" y1="50%" x2="0%" y2="50%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                      <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      <animate attributeName="x1" from="-100%" to="200%" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="x2" from="0%" to="300%" dur="2s" repeatCount="indefinite" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            
            <div className='flex flex-col md:flex-row items-center justify-center md:justify-start gap-x-4 gap-y-2 text-md mt-3 text-primary-200'>
              <span className="flex items-center gap-2 text-white"><FaGraduationCap /> {docInfo.degree}</span>
              <span className="flex items-center gap-2 text-white"><FaUserMd /> {docInfo.speciality}</span>
              <span className="flex items-center gap-2 text-white"><FaBriefcaseMedical /> {docInfo.experience} years exp.</span>
            </div>

            <div className='mt-5'>
              <h2 className='flex items-center justify-center md:justify-start gap-2 text-xl font-semibold text-white'>
                <FaInfoCircle />
                About
              </h2>
              <p className='text-sm text-gray-200 max-w-2xl mt-2 leading-relaxed'>{docInfo.about}</p>
            </div>
            
            <p className='text-white font-semibold text-lg mt-5 flex items-center justify-center md:justify-start gap-2'>
              <FaDollarSign className="text-green-300"/>
              Appointment Fee: <span className='text-green-300 font-bold'>{currencySymbol}{docInfo.fees}</span>
            </p>
          </div>
        </div>

        {/* --- Booking Section --- */}
        <div className='bg-white rounded-2xl shadow-xl p-6 md:p-8 mt-10'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>Book an Appointment</h2>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Select a Date</h3>
            <div className='flex gap-4 items-center w-full overflow-x-auto pb-4'>
              {docSlots.length > 0 ? docSlots.map((item, index) => (
                item.length > 0 && (
                  <div 
                    onClick={() => setSlotIndex(index)} 
                    className={`text-center py-4 px-5 min-w-[80px] rounded-xl cursor-pointer transition-all duration-300 border-2 ${slotIndex === index ? 'bg-primary-500 text-white border-primary-500 shadow-lg' : 'bg-gray-100 border-gray-200 hover:border-primary-100'}`} 
                    key={index}
                  >
                    <p className="font-semibold text-sm">{item[0] && dayOfWeek[item[0].datetime.getDay()]}</p>
                    <p className="font-bold text-2xl">{item[0] && item[0].datetime.getDate()}</p>
                  </div>
                )
              )) : <p className="text-gray-500">Loading available dates...</p>}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Select a Time Slot</h3>
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4'>
              {docSlots.length > 0 && docSlots[slotIndex].length > 0 ? docSlots[slotIndex].map((item, index) => (
                <button 
                  onClick={() => setSlotTime(item.time)} 
                  className={`text-sm font-medium px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 border ${item.time === slotTime ? 'bg-primary-500 text-white scale-105 shadow-md' : 'text-gray-700 bg-gray-100 border-gray-200 hover:border-primary-100'}`} 
                  key={index}
                >
                  {item.time.toLowerCase()}
                </button>
              )) : <p className="text-gray-500 col-span-full">No available slots for this day. Please select another date.</p>}
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button 
              onClick={bookAppointment} 
              className='bg-green-500 hover:bg-green-600 text-white font-bold rounded-full px-12 py-4 text-lg cursor-pointer transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed'
              disabled={!slotTime}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Listing the Related Doctors as a another component */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment


/*useParams(): වෙබ් ලිපිනයෙන් (URL) එන docId එක, එනම් වෛද්‍යවරයාගේ හඳුනාගැනීමේ අංකය (ID) ලබා ගනී.

useContext(AppContext): යෙදුම පුරාම බෙදාගෙන ඇති දත්ත (AppContext) වෙතින් සියලුම වෛද්‍යවරුන්ගේ ලැයිස්තුව (doctors) සහ මුදල් ඒකකයේ සංකේතය (currencySymbol) ලබා ගනී.

useState: මෙම component එකේ තත්ත්වයන් (states) කිහිපයක් නිර්මාණය කරයි:

docInfo: තෝරාගත් වෛද්‍යවරයාගේ සම්පූර්ණ තොරතුරු ගබඩා කිරීමට. මුලින්ම එහි අගයක් නැත (null).

docSlots: වෛද්‍යවරයා හමුවීමට ඇති සියලුම වේලාවන් (slots) ගබඩා කිරීමට. මෙය array (ලැයිස්තු) එකතුවකින් සමන්විත වේ. එක් එක් අභ්‍යන්තර array එකකින් එක් දවසකට අදාළ slots නිරූපණය වේ.

slotIndex: පරිශීලකයා බලමින් සිටින්නේ කුමන දිනයට අදාළ slots ද යන්න හඳුනාගැනීමට (උදා: 0 = අද, 1 = හෙට).

slotTime: පරිශීලකයා තෝරාගත් නිශ්චිත වේලාව ගබඩා කිරීමට.

*/