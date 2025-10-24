import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import assets from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {
  const { aToken } = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  return (
    <div className='min-h-screen bg-white border-r border-primary-50'>
      {
        aToken && <ul className='text-gray-700'>
          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-10 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary-200' : ''}`} to={'/admin-dashboard'}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-10 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary-200' : ''}`} to={'/all-appointments'}>
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'>Appointment</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-10 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary-200' : ''}`} to={'/add-doctor'}>
            <img src={assets.add_icon} alt="" />
            <p className='hidden md:block'>Add Doctor</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-10 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary-200' : ''}`} to={'/doctor-list'}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Doctor List</p>
          </NavLink>
        </ul>
      }

      {
         dToken && <ul className='text-gray-700'>
          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-10 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary-200' : ''}`} to={'/doctor-dashboard'}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-10 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary-200' : ''}`} to={'/doctor-appointments'}>
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-10 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary-200' : ''}`} to={'/doctor-profile'}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Doctor Profile</p>
          </NavLink>
        </ul>
      }
    </div>
  )
}

export default Sidebar