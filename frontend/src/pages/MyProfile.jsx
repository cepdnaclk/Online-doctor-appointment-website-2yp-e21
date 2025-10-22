/* eslint-disable no-unused-vars */
import React, { use, useState } from 'react'
import {assets} from '../assets/assets'

const MyProfile = () => {

  const [userData,setUserData] = useState({
    name:"Harry Potter",
    image: assets.profile_pic,
    email:'harrypotter@eng.pdn.lk',
    phone:'+94 007 007 1717',
    address : {
      line1:"No 17, peradeniya",
      line2:"Kandy"
    },
    gender:'Male',
    dob:'2001-07-07'
  })

  const [isEdit, setIsEdit] = useState(true)
  
  return (
    <div className='mx-w-lg items-center flex flex-col gap-2 text-sm'>
      <img className='w-36 rounded-full' src={userData.image} alt="" />
      {
        isEdit
        ? <input className='bg-gray-200 text-3xl font-medium max-w-60 mt-4' type="text" value={userData.name} onChange={e => setUserData(prev => ({...prev,name:e.target.value}))} />
        : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      }

      <hr className='bg-zinc-400 h-[1px] border-none' />
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
                {
                  isEdit
                    ? <input className='bg-gray-200 max-w-52' type="text" value={userData.phone} onChange={e => setUserData(prev => ({...prev,phone:e.target.value}))} />
                    : <p className='text-blue-400'>{userData.phone}</p>
                }
          <p className='font-medium'>Address:</p>
          {
            isEdit
            ? <p>
              <input className='bg-gray-200' onChange={(e)=>setUserData(prev => ({...prev.address , line1:e.target.validationMessage}))} type="text" value={userData.address.line1}/>
              <br />
              <input className='bg-gray-200' onChange={(e)=>setUserData(prev => ({...prev.address , line2:e.target.validationMessage}))} type="text" value={userData.address.line2} />           
            </p>
            : <p className='text-gray-500'>
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          }
        </div>
      </div>
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p>Gender:</p>
          {
            isEdit
            ? <select className='max-w-20 bg-gray-200' onChange={(e)=> setUserData(prev => ({...prev, gender:e.target.value}))} value={userData.gender} name="" id="">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            : <p className='text-gray-500'>{userData.gender}</p>
          }
          <p>Birthday</p>
          {
            isEdit
            ? <input className='max-w-28 bg-gray-200' type="date" onChange={(e)=>(setUserData(prev=>({...prev , dob:e.target.value})))} value={userData.dob}/>
            : <p>{userData.dob}</p>
          }
        </div>
      </div>
      <div>
        {
          isEdit
          ? <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={()=> setIsEdit(false)}>Save information</button>
          : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'  onClick={()=>setIsEdit(true)}>Edit</button>
        }
      </div>
    </div>
  )
}

export default MyProfile;



/*({...prev, name: e.target.value})
මෙය තමයි වැදගත්ම කොටස. මෙහිදී අලුත් object එකක් සාදා userData state එකට ලබා දීමක් සිදු වේ.

...prev (Spread Syntax):
මෙම ... සලකුණෙන් කියවෙන්නේ, prev object එකේ තිබෙන සියලුම key-value යුගල (properties) ඒ ආකාරයෙන්ම පිටපත් කර (copy) අලුතින් සාදන object එකට දමන්න යන්නයි.

name: e.target.value:
පසුව, පිටපත් කරගත් දත්ත අතරින් name යන property එකේ අගය පමණක්, පරිශීලකයා input කොටුවේ type කළ නව අගයෙන් (e.target.value) ප්‍රතිස්ථාපනය (overwrite) කරන්න යැයි කියයි.*/