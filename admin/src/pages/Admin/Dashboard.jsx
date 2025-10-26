import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { FiUsers, FiCalendar, FiUser, FiList, FiXCircle } from 'react-icons/fi'
import assets from '../../assets/assets'

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) getDashData()
  }, [aToken, getDashData])

  if (!dashData) return null

  return (
  <div className="m-5 space-y-8">
    {/* Summary cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {/* Doctors */}
        <div className="group rounded-2xl p-[1.5px] bg-gradient-to-tr from-primary-200/50 via-primary-300/40 to-primary-500/40 shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4 bg-white rounded-2xl p-4 ring-1 ring-black/5">
            <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center ring-1 ring-primary-100">
              <FiUser className="text-primary-600" size={22} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">{dashData.doctors}</p>
              <p className="text-gray-500 text-sm transition-colors group-hover:text-primary-700">Doctors</p>
            </div>
          </div>
        </div>
        {/* Appointments */}
        <div className="group rounded-2xl p-[1.5px] bg-gradient-to-tr from-primary-200/50 via-primary-300/40 to-primary-500/40 shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4 bg-white rounded-2xl p-4 ring-1 ring-black/5">
            <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center ring-1 ring-primary-100">
              <FiCalendar className="text-primary-600" size={22} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">{dashData.appointments}</p>
              <p className="text-gray-500 text-sm transition-colors group-hover:text-primary-700">
                Appointments
                <span className="ml-2 align-middle text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 ring-1 ring-primary-200/60">{dashData.appointments}</span>
              </p>
            </div>
          </div>
        </div>
        {/* Patients */}
        <div className="group rounded-2xl p-[1.5px] bg-gradient-to-tr from-primary-200/50 via-primary-300/40 to-primary-500/40 shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4 bg-white rounded-2xl p-4 ring-1 ring-black/5">
            <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center ring-1 ring-primary-100">
              <FiUsers className="text-primary-600" size={22} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">{dashData.patients}</p>
              <p className="text-gray-500 text-sm transition-colors group-hover:text-primary-700">Patients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Bookings + Right-side image */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Latest Bookings (left, spans 2 cols) */}
        <div className="lg:col-span-2 rounded-2xl p-[1.5px] bg-gradient-to-tr from-primary-200/50 via-primary-300/40 to-primary-500/40 shadow-md">
          <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-black/5">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <div className="flex items-center gap-2">
                <FiList className="text-primary-600" size={20} />
                <p className="font-semibold text-gray-800">Latest Bookings</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700 ring-1 ring-primary-200/60">{dashData.latestAppointments?.length || 0}</span>
            </div>

            <div className="pt-2 pb-1 px-0 max-h-[32rem] overflow-auto">
              {Array.isArray(dashData.latestAppointments) && dashData.latestAppointments.slice(0, 10).map((item, index) => (
                <div key={index} className="flex items-center px-6 py-3 gap-3 hover:bg-gray-50">
                  <img className="rounded-full w-10 h-10 object-cover ring-1 ring-black/5" src={item?.docData?.image || ''} alt="" />
                  <div className="flex-1 text-sm">
                    <p className="text-gray-800 font-medium">{item?.docData?.name || '—'}</p>
                    <p className="text-gray-500">{slotDateFormat(item?.slotDate)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.cancelled ? (
                      <span className='px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 ring-1 ring-red-200/60'>Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className='px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 ring-1 ring-green-200/60'>Completed</span>
                    ) : (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        title='Cancel appointment'
                        className='inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-100 ring-1 ring-red-200/60 transition'
                      >
                        <FiXCircle size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right-side image panel */}
        <div className="hidden lg:block">
          <div className="rounded-2xl p-[1.5px] bg-gradient-to-tr from-primary-200/50 via-primary-300/40 to-primary-500/40 shadow-md h-full">
            <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-black/5 h-full">
              <img src={assets.admin_dash} alt="Admin dashboard" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard