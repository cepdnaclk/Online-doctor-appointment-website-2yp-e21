/* eslint-disable no-unused-vars */
import React from 'react'
import Login from './pages/Login.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { AdminContext } from './context/AdminContext.jsx';
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx';
import { Route, Routes } from 'react-router-dom';
import AllAppointments from './pages/Admin/AllAppointments.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import DoctorList from './pages/Admin/DoctorList.jsx';
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx';
import { DoctorContext } from './context/DoctorContext.jsx';
import DoctorAppointments from './pages/Doctor/DoctorAppointments.jsx';
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx';

const App = () => {
  const {aToken} = useContext(AdminContext)
  const{dToken} = useContext(DoctorContext)
  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/* Admin Route */}
          <Route path='/' element={<></>}/>
          <Route path='/admin-dashboard' element={<Dashboard/>}></Route>
          <Route path='/all-appointments' element={<AllAppointments/>}></Route>
          <Route path='/add-doctor' element={<AddDoctor/>}></Route>
          <Route path='/doctor-list' element={<DoctorList/>}></Route>

          {/* Doctor Route */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard/>}></Route>
          <Route path='/doctor-appointments' element={<DoctorAppointments/>}></Route>
          <Route path='/doctor-profile' element={<DoctorProfile/>}></Route>
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login/>
      <ToastContainer/>
    </>
  )
}

export default App