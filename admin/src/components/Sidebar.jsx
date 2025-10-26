import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { FiHome, FiCalendar, FiUserPlus, FiUsers, FiUser } from 'react-icons/fi'

const Sidebar = () => {
  const { aToken } = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  const itemClass = (isActive) =>
    `group flex items-center gap-3 py-3.5 px-3 md:px-6 md:min-w-64 cursor-pointer transition-colors ${
      isActive
        ? 'bg-primary-700 text-white border-l-4 border-primary-200'
        : 'text-gray-700 hover:bg-primary-700/95 hover:text-white'
    }`

  const iconClass = (isActive) =>
    `${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'} transition-colors`

  return (
    <div className='relative min-h-screen bg-white/80 backdrop-blur border-r ring-1 ring-black/5'>
      {/* Stylish light gradient edge */}
      <div aria-hidden className='pointer-events-none absolute right-0 top-0 h-full w-[2px] bg-gradient-to-b from-primary-50 via-primary-100 to-primary-200' />
      {aToken && (
        <ul className='text-sm py-2'>
          <NavLink to={'/admin-dashboard'} className={({ isActive }) => itemClass(isActive)}>
            {({ isActive }) => (
              <>
                <FiHome className={iconClass(isActive)} size={18} />
                <p className='hidden md:block'>Dashboard</p>
              </>
            )}
          </NavLink>

          <NavLink to={'/all-appointments'} className={({ isActive }) => itemClass(isActive)}>
            {({ isActive }) => (
              <>
                <FiCalendar className={iconClass(isActive)} size={18} />
                <p className='hidden md:block'>Appointments</p>
              </>
            )}
          </NavLink>

          <NavLink to={'/add-doctor'} className={({ isActive }) => itemClass(isActive)}>
            {({ isActive }) => (
              <>
                <FiUserPlus className={iconClass(isActive)} size={18} />
                <p className='hidden md:block'>Add Doctor</p>
              </>
            )}
          </NavLink>

          <NavLink to={'/doctor-list'} className={({ isActive }) => itemClass(isActive)}>
            {({ isActive }) => (
              <>
                <FiUsers className={iconClass(isActive)} size={18} />
                <p className='hidden md:block'>Doctor List</p>
              </>
            )}
          </NavLink>
        </ul>
      )}

      {dToken && (
        <ul className='text-sm py-2'>
          <NavLink to={'/doctor-dashboard'} className={({ isActive }) => itemClass(isActive)}>
            {({ isActive }) => (
              <>
                <FiHome className={iconClass(isActive)} size={18} />
                <p className='hidden md:block'>Dashboard</p>
              </>
            )}
          </NavLink>

          <NavLink to={'/doctor-appointments'} className={({ isActive }) => itemClass(isActive)}>
            {({ isActive }) => (
              <>
                <FiCalendar className={iconClass(isActive)} size={18} />
                <p className='hidden md:block'>Appointments</p>
              </>
            )}
          </NavLink>

          <NavLink to={'/doctor-profile'} className={({ isActive }) => itemClass(isActive)}>
            {({ isActive }) => (
              <>
                <FiUser className={iconClass(isActive)} size={18} />
                <p className='hidden md:block'>Doctor Profile</p>
              </>
            )}
          </NavLink>
        </ul>
      )}
    </div>
  )
}

export default Sidebar