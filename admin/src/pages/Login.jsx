import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const Login = () => {

  const [state,setState]= useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {setAtoken,backendUrl} = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try{
      if (state === 'Admin'){
        const {data} = await axios.post(backendUrl + '/api/admin/login' , {email, password})
        if(data.success){
          localStorage.setItem('aToken',data.token)
          setAtoken(data.token)
        }
        else{
        // eslint-disable-next-line no-undef
        toast.error(data.message)
       }
      }

    }catch(error){
      console.error('Login error:', error)
      toast.error(error?.response?.data?.message || 'Login failed. Please try again.')
    }
  }



  return (

      <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:w-96 border rounded-xl text-zinc-700 text-sm shadow-lg'>
          <p className='text-2xl font-semibold m-auto'><span className=' text-primary-100'>{state}</span> Login</p>
          <div className='w-full'>
            <p>Email</p>
            <input onChange={(e)=>setEmail(e.target.value )} value={email} className='border border-[#DADADA] rounded w-full' type="email" required />
          </div>
          <div className='w-full'>
            <p>Password</p>
            <input onChange={(e)=>setPassword(e.target.value )} value={password} className='border border-[#DADADA] rounded w-full'  type="password" required />
          </div>
          <button className='bg-primary-100 text-white w-full py-2 rounded-md text-base cursor-pointer'>Login</button>
          {
            state==='Admin'
            ? <p> Doctor Login ? <span onClick={()=>setState('Doctor')} className='text-primary-300 underline cursor-pointer'>Click here</span></p>
            : <p> Admin Login ? <span onClick={()=>setState('Admin')} className='text-primary-300 underline cursor-pointer'>Click here</span></p>
          }
        </div>
      </form>
  )
}

export default Login