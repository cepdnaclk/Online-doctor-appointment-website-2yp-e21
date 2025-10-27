import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import loginImg from '../assets/login.jpg'
import createImg from '../assets/create-account.jpg'

const Login = () => {

  const {backendUrl, token, setToken} = useContext(AppContext)
  const [state,setState] = useState('Sign Up')
  const [email,setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name,setName] = useState('')
  const navigate = useNavigate() // to redirect to the home after login

  
  const onSubmitHandler = async (event) =>{
    event.preventDefault() // not to refresh the page

    try {
      // try to sign up
      if(state==='Sign Up'){
        const {data} = await axios.post(backendUrl+'/api/user/register',{name,password,email})
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token) // update AppContext token so profile is fetched
          toast.success('Account created')
        }
        else{
          toast.error(data.message)
        }
      }else{ // otherwise log in
        const {data} = await axios.post(backendUrl+'/api/user/login', {password,email})
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)
          toast.success('Login successful')
        }else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-10">
      <div className="bg-gray-800 rounded-3xl shadow-2xl flex flex-col lg:flex-row w-full max-w-4xl overflow-hidden">

        {/* Left side: image (show different image for Login vs Sign Up) */}
        <div className="lg:w-1/2 hidden lg:block">
          <img
            src={state === 'Sign Up' ? createImg : loginImg}
            alt={state === 'Sign Up' ? 'Create Account' : 'Login'}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side: form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 flex flex-col justify-center">

          {/* Header */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-400 mb-6">
            Please {state === 'Sign Up' ? 'sign up' : 'login'} to book your appointment
          </p>

          {/* Social login buttons (placeholders) */}
          <div className="flex gap-4 mb-6">
              <button type="button" className="flex items-center justify-center w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition">
                <img
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/google.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2 invert"
                />
                <span>Login with Google</span>
              </button>
              <button type="button" className="flex items-center justify-center w-full py-2 px-4 rounded-xl bg-black hover:bg-neutral-900 text-white shadow-lg transition">
                <img
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg"
                  alt="Apple"
                  className="w-5 h-5 mr-2 invert"
                />
                <span>Login with Apple</span>
              </button>
          </div>

          {/* Divider */}
          <div className="flex items-center text-gray-400 mb-6">
            <hr className="flex-1 border-gray-600" />
            <span className="px-2 text-sm">or</span>
            <hr className="flex-1 border-gray-600" />
          </div>

          {/* Auth form */}
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
            {state === 'Sign Up' && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button
              type="submit"
              className="btn-gradient-shine py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold shadow-lg hover:from-cyan-500 hover:to-purple-600 transition"
            >
              {state === 'Sign Up' ? 'Create Account' : 'Login'}
            </button>

            {/* Links */}
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <button type="button" className="hover:text-white transition">Forgot password?</button>
              {state === 'Sign Up' ? (
                <button type="button" onClick={() => setState('Login')} className="hover:text-white transition">Already have an account? Login</button>
              ) : (
                <button type="button" onClick={() => setState('Sign Up')} className="hover:text-white transition">New here? Sign up</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
