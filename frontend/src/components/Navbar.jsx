import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const {token,setToken,userData} = useContext(AppContext)

    const logout = ()=>{
        setToken(false)
        localStorage.removeItem('token')
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


return (
    // Wrapper becomes fixed only after scrolling; at top it behaves like the old, full-width bar
    <div className={`${isScrolled ? 'fixed inset-x-0 top-0 z-50 flex justify-center' : ''}`}>
        <div
            className={`flex justify-between items-center transition-all duration-200 ${
                isScrolled
                    ? 'pointer-events-auto mx-auto w-[94%] max-w-5xl bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] mt-3 px-6 py-2'
                    : 'mx-4 sm:mx-[10%] py-4'
            }`}
        >
            <Link to='/'><img src={assets.logo} alt="" className={`w-50 cursor-pointer transition-all duration-300 ${isScrolled ? 'w-40' : 'w-50'}`}/></Link>
            <ul className='hidden md:flex gap-8 items-center'>
                <NavLink to='/' className='group'>
                    {({isActive}) => (
                        <>
                            <li className={`transition-all duration-300 ${
                                isActive
                                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-semibold drop-shadow-[0_0_10px_rgba(216,0,255,0.55)]'
                                    : 'text-gray-700'
                            } hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 hover:drop-shadow-[0_0_10px_rgba(216,0,255,0.65)]`}> HOME </li>
                            <hr className={`border-none outline-none h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 w-full m-auto drop-shadow-[0_0_8px_rgba(216,0,255,0.6)] ${isActive ? 'block' : 'hidden'}`}/>
                        </>
                    )}
                </NavLink>
                <NavLink to='/doctors' className='group'>
                    {({isActive}) => (
                        <>
                            <li className={`transition-all duration-300 ${
                                isActive
                                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-semibold drop-shadow-[0_0_10px_rgba(216,0,255,0.55)]'
                                    : 'text-gray-700'
                            } hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 hover:drop-shadow-[0_0_10px_rgba(216,0,255,0.65)]`}>DOCTORS</li>
                            <hr className={`border-none outline-none h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 w-full m-auto drop-shadow-[0_0_8px_rgba(216,0,255,0.6)] ${isActive ? 'block' : 'hidden'}`}/>
                        </>
                    )}
                </NavLink>
                <NavLink to='/about' className='group'>
                    {({isActive}) => (
                        <>
                            <li className={`transition-all duration-300 ${
                                isActive
                                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-semibold drop-shadow-[0_0_10px_rgba(216,0,255,0.55)]'
                                    : 'text-gray-700'
                            } hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 hover:drop-shadow-[0_0_10px_rgba(216,0,255,0.65)]`}>ABOUT</li>
                            <hr className={`border-none outline-none h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 w-full m-auto drop-shadow-[0_0_8px_rgba(216,0,255,0.6)] ${isActive ? 'block' : 'hidden'}`}/>
                        </>
                    )}
                </NavLink>
                <NavLink to='/contact' className='group'>
                    {({isActive}) => (
                        <>
                            <li className={`transition-all duration-300 ${
                                isActive
                                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-semibold drop-shadow-[0_0_10px_rgba(216,0,255,0.55)]'
                                    : 'text-gray-700'
                            } hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 hover:drop-shadow-[0_0_10px_rgba(216,0,255,0.65)]`}>CONTACT</li>
                            <hr className={`border-none outline-none h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 w-full m-auto drop-shadow-[0_0_8px_rgba(216,0,255,0.6)] ${isActive ? 'block' : 'hidden'}`}/>
                        </>
                    )}
                </NavLink>
            </ul>
            <div className='hidden md:flex items-center gap-4 '>{
                // show logged-in UI as soon as we have a token to avoid flicker; use placeholder avatar until userData loads
                token
                ? <div className='flex items-center gap-2 cursor-pointer group relative select-none'> 
                        <img className='w-8 h-8 rounded-full ring-2 ring-purple-400/50 group-hover:ring-pink-500/70 shadow-[0_0_15px_rgba(216,0,255,0.25)] transition-all duration-300' src={(userData && userData.image) ? userData.image : assets.profile_pic} alt='' />
                        <img className='w-2-5 transition-transform duration-300 group-hover:rotate-180 drop-shadow-[0_0_8px_rgba(216,0,255,0.45)]' src={assets.dropdown_icon} alt="" />

                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-700 z-50 hidden group-hover:block'>
                            <div className='min-w-52 bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur rounded-xl border border-white/30 shadow-[0_20px_40px_rgba(0,0,0,0.12)] flex flex-col gap-2 p-4'>
                                <p onClick ={()=> navigate('my-profile')} className='px-4 py-2 rounded-md cursor-pointer transition-all duration-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 hover:drop-shadow-[0_0_10px_rgba(216,0,255,0.5)] hover:bg-white/40'>My Profile</p>
                                <p onClick ={()=> navigate('my-appointments')} className='px-4 py-2 rounded-md cursor-pointer transition-all duration-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 hover:drop-shadow-[0_0_10px_rgba(216,0,255,0.5)] hover:bg-white/40'>My Appointments</p>
                                <p onClick={logout} className='px-4 py-2 rounded-md cursor-pointer transition-all duration-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 hover:drop-shadow-[0_0_10px_rgba(216,0,255,0.5)] hover:bg-white/40'>Logout</p>
                            </div>
                        </div>
                </div>
                :<NavLink
                    to='/login'
                    className='relative overflow-hidden rounded-full px-6 py-2 font-medium text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-[0_0_20px_rgba(216,0,255,0.35)] hover:shadow-[0_0_35px_rgba(216,0,255,0.6)] transition-all duration-300 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-purple-300'
                >
                    Create account
                </NavLink>
}
            </div>
            <img onClick={()=> setShowMenu(true)} src={assets.menu_icon} alt="" className='w-6 md:hidden' />
            {/* ----Mobile menu (overlay + sliding panel)----*/}
            <div className={`fixed inset-0 z-50 md:hidden ${showMenu ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    onClick={()=> setShowMenu(false)}
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${showMenu ? 'opacity-100' : 'opacity-0'}`}
                />
                {/* Panel */}
                <div className={`absolute right-0 top-0 h-full w-[82%] max-w-[22rem] bg-white/85 supports-[backdrop-filter]:bg-white/65 backdrop-blur-xl border-l border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-transform duration-500 ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className='flex items-center justify-between px-5 py-5 border-b border-white/30'>
                        <img className='w-32' src={assets.logo} alt='' />
                        <img className='w-7 active:scale-95 transition' onClick={()=> setShowMenu(false)} src={assets.cross_icon} alt='' />
                    </div>

                    {/* User quick section */}
                    <div className='px-5 py-4'>
                        {token ? (
                            <div className='flex items-center gap-3'>
                                <img className='w-10 h-10 rounded-full ring-2 ring-purple-400/50 shadow-[0_0_12px_rgba(216,0,255,0.25)]' src={(userData && userData.image) ? userData.image : assets.profile_pic} alt='' />
                                <div className='text-sm text-gray-700'>
                                    <p className='font-medium'>Welcome</p>
                                    <div className='flex gap-3 mt-2'>
                                        <button onClick={()=> {setShowMenu(false); navigate('my-profile')}} className='text-xs px-3 py-1 rounded-full bg-white/60 border border-white/30 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition'>Profile</button>
                                        <button onClick={()=> {setShowMenu(false); navigate('my-appointments')}} className='text-xs px-3 py-1 rounded-full bg-white/60 border border-white/30 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition'>Appointments</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <NavLink
                                to='/login'
                                onClick={()=> setShowMenu(false)}
                                className='inline-block w-full text-center mt-1 rounded-full px-5 py-2.5 font-medium text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-[0_0_18px_rgba(216,0,255,0.35)] hover:shadow-[0_0_30px_rgba(216,0,255,0.55)] transition-all duration-300 hover:scale-[1.02]'
                            >
                                Create account
                            </NavLink>
                        )}
                    </div>

                    <div className='h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent mx-5' />

                    <ul className='flex flex-col gap-1 mt-4 px-5 text-lg font-medium'>
                        <NavLink onClick={()=> setShowMenu(false)} to='/' className='block'>
                            {({isActive}) => (
                                <p className={`px-2 py-3 rounded-md transition-all duration-300 ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500' : 'text-gray-700'} hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500`}>HOME</p>
                            )}
                        </NavLink>
                        <NavLink onClick={()=> setShowMenu(false)} to='/doctors' className='block'>
                            {({isActive}) => (
                                <p className={`px-2 py-3 rounded-md transition-all duration-300 ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500' : 'text-gray-700'} hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500`}>ALL DOCTORS</p>
                            )}
                        </NavLink>
                        <NavLink onClick={()=> setShowMenu(false)} to='/about' className='block'>
                            {({isActive}) => (
                                <p className={`px-2 py-3 rounded-md transition-all duration-300 ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500' : 'text-gray-700'} hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500`}>ABOUT</p>
                            )}
                        </NavLink>
                        <NavLink onClick={()=> setShowMenu(false)} to='/contact' className='block'>
                            {({isActive}) => (
                                <p className={`px-2 py-3 rounded-md transition-all duration-300 ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500' : 'text-gray-700'} hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500`}>CONTACT</p>
                            )}
                        </NavLink>
                    </ul>

                    {token && (
                        <div className='mt-6 px-5'>
                            <button onClick={()=> {setShowMenu(false); logout();}} className='w-full text-center rounded-full px-5 py-2.5 font-medium text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-[0_0_18px_rgba(216,0,255,0.35)] hover:shadow-[0_0_30px_rgba(216,0,255,0.55)] transition-all duration-300 active:scale-[0.98]'>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </div> 
    </div>
)
}

export default Navbar