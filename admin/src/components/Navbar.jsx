import React from 'react'
import assets from '../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { FiLogOut } from 'react-icons/fi'


const Navbar = () => {

    const {aToken, setAtoken} = useContext(AdminContext)
    const {dToken, setDToken} = useContext(DoctorContext)
    const navigate = useNavigate()

    const logout =()=>{
        // Clear tokens first
        if(aToken){
            setAtoken('')
            localStorage.removeItem('aToken')
        }
        if(dToken){
            setDToken('')
            localStorage.removeItem('dToken')
        }
        // Then navigate
        navigate('/')
    }

    return (
        <div className='sticky top-0 z-50'>
            <div className='relative flex justify-between items-center px-4 sm:px-8 py-3 bg-white/70 backdrop-blur-xl shadow-sm ring-1 ring-black/5'>
                {/* Brand */}
                <div className='flex items-center gap-3'>
                    <img
                        className='h-10 sm:h-17 w-auto cursor-pointer select-none'
                        src={assets.admin_logo}
                        alt="Home"
                        title="Go to Landing"
                        onClick={() => navigate('/')}
                    />
                    <span className='inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium bg-primary-50/40 text-primary-700 ring-1 ring-primary-200/60 shadow-sm'>
                        <span className='inline-block h-1.5 w-1.5 rounded-full bg-primary-400'></span>
                        {aToken ? 'Admin' : 'Doctor'}
                    </span>
                </div>

                {/* Actions */}
                <button
                    type='button'
                    onClick={logout}
                    className='group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-300 to-primary-500 text-white text-sm px-4 sm:px-5 py-2 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-200/60'
                    aria-label='Logout'
                >
                    <FiLogOut className='text-white/90 group-hover:scale-105 transition-transform' />
                    <span className='pr-0.5'>Logout</span>
                </button>

                {/* Bottom gradient hairline */}
                <div className='pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary-200/60 to-transparent' />
            </div>
        </div>
    )
}

export default Navbar