import React, { useState } from 'react'
<<<<<<< HEAD
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useContext } from 'react'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Login = () => {

  const {backendUrl, token, setToken} = useContext(AppContext)
=======

const Login = () => {

>>>>>>> 6071b35f4e03857e9e7c8a2c94841bbfdd101362
  const [state,setState] = useState('Sign Up')
  const [email,setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name,setName] = useState('')
<<<<<<< HEAD
  const navigate = useNavigate() // to redirect to the home after login

  
  const onSubmitHandler = async (event) =>{
    event.preventDefault() // not to refresh the page

    try {
      // try to sign up
      if(state==='Sign Up'){
        const {data} = await axios.post(backendUrl+'/api/user/register',{name,password,email})
        if(data.success){
          localStorage.setItem('token',data.token)
        }
        else{
          toast.error(data.message)
        }
      }else{ // otherwise log in
        const {data} = await axios.post(backendUrl+'/api/user/login', {password,email})
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)
        }else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])

=======
  
  const onSubmitHandler = async (event) =>{
    event.preventDefault() // not to refresh the page
  }

>>>>>>> 6071b35f4e03857e9e7c8a2c94841bbfdd101362
  return (
      <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-100 sm:min-h-96 border rounded-xl text-white text-sm shadow-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:shadow-[0_0_30px_rgba(176,24,231,0.5)] transition-all duration-250'>
          <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
          <p className='text-sm'>Please {state === "Sign Up" ? "sign up" : "login"} to book your appointment</p>
          {state === 'Sign Up' && <div className='w-full'>
            <p>Full Name</p>
            <input className='border border-white rounded w-full p-2 mt-1' type="text" onChange={(e)=>setName(e.target.value)} value={name} required />
            </div>}
            <div className='w-full'>
            <p>Email</p>
            <input className='border border-white rounded w-full p-2 mt-1' type="email" onChange={(e)=>setEmail(e.target.value)} value={email} required />
            </div>
            <div className='w-full'>
            <p>Password</p>
            <input className='border border-white rounded w-full p-2 mt-1' type="password" onChange={(e)=>setPassword(e.target.value)} value={password} required />
            </div>
            <button className='bg-primary-600 text-white w-full my-2 py-2 rounded-md text-base cursor-pointer hover:bg-primary-500' type="submit">{state === 'Sign Up' ? "Create Account" : "Login"}</button>
            {
              state === 'Sign Up'
              ? <p>Already have an account? <span onClick={()=>setState('Login')} className='text-gray-200 underline cursor-pointer'>Login here</span></p>
              : <p>Create an new account? <span onClick={()=>setState('Sign Up')} className='text-gray-200 underline cursor-pointer'>Click here</span></p>
            }
        </div>

      </form>
  )
}

export default Login;
