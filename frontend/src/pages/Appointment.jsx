import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'

const Appointment = () => {

  const {docId} = useParams()
  const {doctors, currencySymbol} = useContext(AppContext)
  const dayOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT']
  const [docInfo, setDocInfo] = useState(null) // eslint-disable-line no-unused-vars
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0) // times for the 

  
  const [slotTime, setSlotTime] = useState('')
 
  const fetchDocInfo = async () => {
    const foundDoc = doctors.find(doc => doc._id === docId)
    setDocInfo(foundDoc)
    //console.log(foundDoc)
  }

  const getAvailableSlots = async ()=>{
    setDocSlots([])

     //getting current date
    let today = new Date()

    for (let i=0; i<7;i++){
    // getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i )
    
    //setting end time of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21,0,0,0) // දිනය සඳහා appointments අවසන් වන වේලාව රාත්‍රී 9:00 (21:00) ලෙස endTime මඟින් සකසයි.

    // setting hours
      if(today.getDate() === currentDate.getDate()){
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      }else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }
    
      let timeSlots = []

      while(currentDate < endTime){
        let formattedTime = currentDate.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})

      // add slot to array
        timeSlots.push({
          datetime:new Date(currentDate),
          time:formattedTime
        })

      // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes()+30)
      }
      setDocSlots(prev => ([...prev,timeSlots]))
    }
}

  useEffect(()=>{
    fetchDocInfo()
  },[doctors,docId])

  useEffect(()=>{
    getAvailableSlots()
  },[docInfo])

  useEffect(()=>{
    console.log(docSlots)
  },[docSlots])




// &&  using conditional rendernig is cruial otherwise the system try to find null.image ...

  return docInfo && (
    <div>
        {/* --- doctor details --- */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div>
            <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
          </div>

          <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
            {/*---doctor info: name ,degrer , expereince---*/}
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              {docInfo.name}
              <img className='w-5' src={assets.verified_icon} alt="" />
            </p>

            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
            </div>

            {/*---doctor about---*/}
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
            </div>
            <p className='text-gray-500 font-medium mt-4'>
              Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
            </p>
          </div>
        </div>
        {/* --Booking the slots---*/}
        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Booking Slots</p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {
              docSlots.length && docSlots.map((item,index)=>(
                <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' :'border-2 border-primary'}`} key={index}>
                  <p>{item[0] && dayOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
            }
          </div>
          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
              {docSlots.length && docSlots[slotIndex].map((item,index)=>(
                <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white': 'text-gray-400 border border-primary'}`} key={index}>
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
 
            <button className='bg-primary text-white rounded-full px-16 py-3 my-10 text-sm cursor-pointer'>Book the Appointment</button>
        
        </div>
        
        {/* Listing the Related Doctors as a another component */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality}></RelatedDoctors>
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