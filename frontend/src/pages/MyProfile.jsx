/* eslint-disable no-unused-vars */
import React, { use, useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets.js'
import axios from 'axios'
import { toast } from 'react-toastify'


const MyProfile = () => {

  //  this is for the dummy data when used here to build a frontend , this will  
  // const [userData,setUser Data] = useState({
  //   name:"Harry Potter",
  //   image: assets.profile_pic,
  //   email:'harrypotter@eng.pdn.lk',
  //   phone:'+94 007 007 1717',
  //   address : {
  //     line1:"No 17, peradeniya",
  //     line2:"Kandy"
  //   },
  //   gender:'Male',
  //   dob:'2001-07-07'
  // }) 

  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(true)
  const [image, setImage] = useState(false)

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()

      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      image && formData.append('image', image)

      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, { headers })


      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)

      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  // there is some time to come the user data so this should be conditional rendering
  return userData && (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-blue-500 via-primary-200 to-pink-300 bg-clip-text text-transparent text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">
          My Profile
        </h1>

        <div className='mt-6 items-center flex flex-col gap-3 text-sm'>
          {
            isEdit
              ? <label htmlFor="image">
                  <div className='relative cursor-pointer'>
                    <img
                      className='w-36 h-36 rounded-full object-cover ring-2 ring-primary-100/60 bg-primary-50'
                      src={image ? URL.createObjectURL(image) : userData.image}
                      alt="Profile"
                    />
                    {!image && (
                      <img
                        className='w-8 absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow ring-1 ring-zinc-200'
                        src={assets.upload_icon}
                        alt="Upload"
                      />
                    )}
                  </div>
                  <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden />
                </label>
              : <img className='w-36 h-36 rounded-full object-cover ring-2 ring-primary-100/60 bg-primary-50' src={userData.image} />
          }

          {
            isEdit
              ? <input
                  className='mt-4 text-2xl sm:text-3xl font-semibold text-center bg-gray-100/80 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300 max-w-xs'
                  type="text"
                  value={userData.name}
                  onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                />
              : <p className='font-semibold text-3xl text-neutral-800 mt-4'>{userData.name}</p>
          }
        </div>

        <hr className='my-8 h-px bg-zinc-200 border-0' />

        <div>
          <p className='text-xs font-semibold tracking-wide text-neutral-500 uppercase'>Contact Information</p>
          <div className='grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-y-3 gap-x-4 mt-4 text-neutral-700'>
            <p className='font-medium'>Email id:</p>
            <p className='text-blue-600 break-all'>{userData.email}</p>

            <p className='font-medium'>Phone:</p>
            {
              isEdit
                ? <input
                    className='bg-gray-100 rounded-md px-3 py-1.5 border border-zinc-200 max-w-xs focus:outline-none focus:ring-2 focus:ring-primary-300'
                    type="text"
                    value={userData.phone}
                    onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                : <p className='text-blue-500'>{userData.phone}</p>
            }

            <p className='font-medium'>Address:</p>
            {
              isEdit
                ? <div className='space-y-2'>
                    <input
                      className='bg-gray-100 rounded-md px-3 py-1.5 border border-zinc-200 w-full focus:outline-none focus:ring-2 focus:ring-primary-300'
                      onChange={(e) =>
                        setUserData(prev => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value }
                        }))
                      }
                      type="text"
                      value={userData.address.line1}
                      placeholder='Address line 1'
                    />
                    <input
                      className='bg-gray-100 rounded-md px-3 py-1.5 border border-zinc-200 w-full focus:outline-none focus:ring-2 focus:ring-primary-300'
                      onChange={(e) =>
                        setUserData(prev => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value }
                        }))
                      }
                      type="text"
                      value={userData.address.line2}
                      placeholder='Address line 2'
                    />
                  </div>
                : <p className='text-gray-500 whitespace-pre-line'>
                    {userData.address.line1}
                    {userData.address.line2 ? `\n${userData.address.line2}` : ''}
                  </p>
            }
          </div>
        </div>

        <div className='mt-8'>
          <p className='text-xs font-semibold tracking-wide text-neutral-500 uppercase'>Basic Information</p>
          <div className='grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-y-3 gap-x-4 mt-4 text-neutral-700'>
            <p className='font-medium'>Gender:</p>
            {
              isEdit
                ? <select
                    className='max-w-[8rem] bg-gray-100 rounded-md px-3 py-1.5 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-300'
                    onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                    value={userData.gender}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                : <p className='text-gray-600'>{userData.gender}</p>
            }

            <p className='font-medium'>Birthday</p>
            {
              isEdit
                ? <input
                    className='max-w-[10rem] bg-gray-100 rounded-md px-3 py-1.5 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-300'
                    type="date"
                    onChange={(e) => (setUserData(prev => ({ ...prev, dob: e.target.value })))}
                    value={userData.dob}
                  />
                : <p className='text-gray-600'>{userData.dob}</p>
            }
          </div>
        </div>

        <div className='mt-10 flex justify-center'>
          {
            isEdit
              ? <button
                  className='btn-gradient-shine px-8 py-2 rounded-full text-white bg-gradient-to-r from-primary-300 via-primary-500 to-primary-700 shadow-md hover:shadow-[0_0_26px_rgba(172,59,213,0.55)] focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all cursor-pointer'
                  onClick={updateUserProfileData}
                >
                  Save information
                </button>
              : <button
                  className='btn-gradient-shine px-8 py-2 rounded-full text-white bg-gradient-to-r from-primary-300 via-primary-500 to-primary-700 shadow-md hover:shadow-[0_0_26px_rgba(172,59,213,0.55)] focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all cursor-pointer'
                  onClick={() => setIsEdit(true)}
                >
                  Edit
                </button>
          }
        </div>
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