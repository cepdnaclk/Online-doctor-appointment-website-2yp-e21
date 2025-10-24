import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import MockPayment from './pages/MockPayment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
// eslint-disable-next-line no-unused-vars
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  //to see the Navigation bar all over the pages add the tag above
  return (
    <div className='min-h-screen'>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/doctors' element={<Doctors/>}/>
        <Route path='/doctors/:speciality' element={<Doctors/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/my-profile' element={<MyProfile/>}/>
        <Route path='/my-appointments' element={<MyAppointments/>}/>
        <Route path='/appointment/:docId' element={<Appointment/>}/>
        <Route path='/mock-payment/:appointmentId' element={<MockPayment/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
