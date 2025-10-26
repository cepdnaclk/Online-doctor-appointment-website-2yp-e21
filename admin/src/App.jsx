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

const App = () => {
  const {aToken} = useContext(AdminContext)
  return aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={<></>}/>
          <Route path='/admin-dashboard' element={<Dashboard/>}></Route>
          <Route path='/all-appointments' element={<AllAppointments/>}></Route>
          <Route path='/add-doctor' element={<AddDoctor/>}></Route>
          <Route path='/doctor-list' element={<DoctorList/>}></Route>
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