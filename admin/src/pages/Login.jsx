import React from 'react'
import { useContext, useEffect } from 'react'
import { useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'
import assets from '../assets/assets'


const Login = () => {

  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setAtoken, backendUrl } = useContext(AdminContext)
  const {setDToken} = useContext(DoctorContext)

  // Initialize role from URL (e.g., ?role=doctor or #doctor)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const roleParam = params.get('role') || window.location.hash.replace('#','')
      if (roleParam && /doctor/i.test(roleParam)) setState('Doctor')
      if (roleParam && /admin/i.test(roleParam)) setState('Admin')
    } catch {
      // ignore URL parse issues
    }
  }, [])


  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (state === 'Admin') { // to log the admin
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAtoken(data.token)
          console.log(data.token)
        }
        else {
          toast.error(data.message)
        }
      } else {
        // to docotor login
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          console.log(data.token)
        }
        else {
          toast.error(data.message)
        }

      }

    } catch (error) {
      console.error('Login error:', error)
      toast.error(error?.response?.data?.message || 'Login failed. Please try again.')
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-10">
      <div className="bg-gray-800 rounded-3xl shadow-2xl flex flex-col lg:flex-row w-full max-w-4xl overflow-hidden">

        {/* Left side: form (dark theme) */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
          {/* Header */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {state === 'Admin' ? 'Admin Portal' : 'Doctor Portal'}
          </h1>
          <p className="text-gray-400 mb-6">
            Please login with your credentials
          </p>

          {/* Role tabs */}
          <div className='flex w-full rounded-xl border border-gray-700 overflow-hidden mb-4'>
            <button
              type='button'
              onClick={() => setState('Admin')}
              className={`flex-1 py-2 text-center transition ${state==='Admin' ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            >
              Admin
            </button>
            <button
              type='button'
              onClick={() => setState('Doctor')}
              className={`flex-1 py-2 text-center transition ${state==='Doctor' ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            >
              Doctor
            </button>
          </div>

          {/* Auth form */}
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
            <div className='w-full'>
              <p className='mb-1 text-gray-300'>Email</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='w-full h-11 px-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400' type="email" required />
            </div>
            <div className='w-full'>
              <p className='mb-1 text-gray-300'>Password</p>
              <input onChange={(e) => setPassword(e.target.value)} value={password} className='w-full h-11 px-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400' type="password" required />
            </div>

            <button className='py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold shadow-lg hover:from-cyan-500 hover:to-purple-600 transition'>
              Login
            </button>
            {
              state === 'Admin'
                ? <p className='text-center text-sm text-gray-400'> Doctor Login? <span onClick={() => setState('Doctor')} className='text-white underline cursor-pointer'>Switch</span></p>
                : <p className='text-center text-sm text-gray-400'> Admin Login? <span onClick={() => setState('Admin')} className='text-white underline cursor-pointer'>Switch</span></p>
            }
          </form>
        </div>

        {/* Right side: role image (photo) */}
        <div className="lg:w-1/2 hidden lg:block">
          <img
            src={state === 'Admin' ? assets.admin_login : assets.doc_login}
            alt={state === 'Admin' ? 'Admin login' : 'Doctor login'}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

      </div>
    </div>
  )
}

export default Login