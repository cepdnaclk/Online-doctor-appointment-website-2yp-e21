import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);

    // const [token, setToken] = useState(true); - used temporary to develop the frontend
    const { token, setToken, userData } = useContext(AppContext)

    const logout = ()=>{
        setToken(false)
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
    // this is the navigation bar
    <div className='flex  justify-between items-center py-1'>
            <Link to='/'><img src={assets.logo} alt="" className='w-50 cursor-pointer'/></Link>
            <ul className='flex gap-8 items-center'>
                <NavLink to='/'>
                    {({isActive}) => (
                        <>
                            <li className={`hover:text-primary hover:drop-shadow-[0_0_8px_rgba(176,24,231,0.6)] transition-all duration-300 ${isActive ? 'text-primary-200 font-semibold' : 'text-gray-700'}`}> HOME </li>
                            <hr className={`border-none outline-none h-0.5 bg-primary-200 w-full m-auto ${isActive ? 'block' : 'hidden'}`}/>
                        </>
                    )}
                </NavLink>
                <NavLink to='/doctors'>
                    {({isActive}) => (
                        <>
                            <li className={`hover:text-primary hover:drop-shadow-[0_0_8px_rgba(176,24,231,0.6)] transition-all duration-300 ${isActive ? 'text-primary-200 font-semibold' : 'text-gray-700'}`}>DOCTORS</li>
                            <hr className={`border-none outline-none h-0.5 bg-primary-200  w-full m-auto ${isActive ? 'block' : 'hidden'}`}/>
                        </>
                    )}
                </NavLink>
                <NavLink to='/about'>
                    {({isActive}) => (
                        <>
                            <li className={`hover:text-primary hover:drop-shadow-[0_0_8px_rgba(176,24,231,0.6)] transition-all duration-300 ${isActive ? 'text-primary-200 font-semibold' : 'text-gray-700'}`}>ABOUT</li>
                            <hr className={`border-none outline-none h-0.5 bg-primary-200 w-full m-auto ${isActive ? 'block' : 'hidden'}`}/>
                        </>
                    )}
                </NavLink>
                <NavLink to='/contact'>
                    {({isActive}) => (
                        <>
                            <li className={`hover:text-primary hover:drop-shadow-[0_0_8px_rgba(176,24,231,0.6)] transition-all duration-300 ${isActive ? 'text-primary-200 font-semibold' : 'text-gray-700'}`}>CONTACT</li>
                            <hr className={`border-none outline-none h-0.5 bg-primary-200 w-full m-auto ${isActive ? 'block' : 'hidden'}`}/>
                        </>
                    )}
                </NavLink>
            </ul>
            <div className='flex items-center gap-4 '>{
                // to visible the dropdown menu of the login user
                    token && userData 
                ? <div className='flex items-center gap-2 cursor-pointer group relative'> 
                        <img className='w-8 rounded-full' src={userData.image} alt=''/>
                        <img className='w-2-5' src={assets.dropdown_icon} alt="" />

                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-48 bg-stone-200 rounded flex flex-col gap-4 p-4'>
                                <p onClick ={()=> navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                <p onClick ={()=> navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        
                        </div>
                </div>
                :<button onClick = {()=>navigate('/login')} className='border border-primary text-primary py-2 px-6 rounded-full hover:bg-primary hover:text-white transition-all duration-20 md:block'>Create account</button>
}
            <img onClick={()=> setShowMenu(true)} src={assets.menu_icon} alt="" className='w-6 md:hidden' />
            {/* ----Mobile menu----*/}
            <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'}  md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all duration-500`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-36' src={assets.logo} alt="" />
                    <img className='w-7' onClick={()=> setShowMenu(false)} src={assets.cross_icon} alt="" />
                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                    <NavLink    onClick={()=> setShowMenu(false)}  to='/'><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
                    <NavLink  onClick={()=> setShowMenu(false)}  to='/doctors'><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
                    <NavLink   onClick={()=> setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
                    <NavLink  onClick={()=> setShowMenu(false)}  to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
                </ul>
            </div>
</div> 

    </div>
)
}

export default Navbar