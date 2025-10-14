import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();

    //const [showMenu, setShowMenu] = useState(false);
    const [token, setToken] = useState(true);
    

return (
    // this is the navigation bar
    <div className='flex  justify-between items-center py-1'>
            <Link to='/'><img src={assets.logo} alt="" class='w-30 cursor-pointer'/></Link>
            <ul class='flex gap-8 items-center'>
                <NavLink to='/'>
                    <li> HOME </li>
                    <hr  class='boarder-none outline-none h-0.5 bg-primary w-5/5 m-auto hidden'/>
                </NavLink>
                <NavLink to='/doctors'>
                    <li>DOCTORS</li>
                    <hr  class='boarder-none outline-none h-0.5 bg-primary w-5/5 m-auto hidden'/>
                </NavLink>
                <NavLink to='/about'>
                    <li>ABOUT</li>
                    <hr  class='boarder-none outline-none h-0.5 bg-primary w-5/5 m-auto hidden'/>
                </NavLink>
                <NavLink to='/contact'>
                    <li>CONTACT</li>
                    <hr  class='boarder-none outline-none h-0.5 bg-primary w-5/5 m-auto hidden'/>
                </NavLink>
            </ul>
            <div class='flex items-center gap-4 '>{
                // to visible the dropdown menu of the login user
                token ? <div className='flex items-center gap-2 cursor-pointer group relative'> 
                        <img class='w-8 rounded-full' src={assets.profile_pic} alt=''/>
                        <img class='w-2-5' src={assets.dropdown_icon} alt="" />

                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-48 bg-stone-200 rounded flex flex-col gap-4 p-4'>
                                <p onClick ={()=> navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                <p onClick ={()=> navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                <p onClick={()=>setToken(false)} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        
                        </div>
                </div>
                :<button onClick = {()=>navigate('/login')} class='border border-primary text-primary py-2 px-6 rounded-full hover:bg-primary hover:text-white transition-all duration-20 md:block'>Create account</button>
}</div>

    </div>
)
}

export default Navbar