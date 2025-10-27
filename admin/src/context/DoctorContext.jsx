import { createContext } from "react";
import { useCallback, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

// eslint-disable-next-line react-refresh/only-export-components
export const DoctorContext = createContext()

const DoctorContextProvider = (props) =>{

    // Resolve backend URL: prefer ?api= override in the URL, then env var. Trim trailing slashes.
    const backendUrl = (() => {
        let fromEnv = import.meta.env.VITE_BACKEND_URL || ''
        let override = ''
        try {
            const params = new URLSearchParams(window.location.search)
            override = params.get('api') || ''
        } catch { /* ignore */ }
        const url = (override || fromEnv || '').replace(/\/+$/, '')
        if (typeof window !== 'undefined') {
            const isProdPage = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
            if (isProdPage && /localhost/.test(url)) {
                console.warn('[Doctor] VITE_BACKEND_URL points to localhost while running on', window.location.origin)
            }
        }
        return url
    })()
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [appointments, setAppointments] = useState([])
    const [profileData, setProfileData] = useState(false)
    const [dashData, setDashData] = useState({})

    const getAppointments = useCallback(async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
                headers: { token: dToken }
            })
            if (data.success) {
                setAppointments((data.appointments || []).reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [backendUrl, dToken])

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, {
                headers: { token: dToken }
            })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, {
                headers: { token: dToken }
            })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getProfileData =  async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/profile', {
                headers: { token: dToken }
            })
            if (data.success) {
                setProfileData(data.profileData)
                console.log(data.profileData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const updateDoctorProfile = async (profile) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', profile, {
                headers: { token: dToken }
            })
            if (data.success) {
                toast.success(data.message)
                getProfileData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { token: dToken } })
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const contextValue = {
        dToken,
        setDToken,
        appointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        profileData,
        setProfileData,
        getProfileData,
        updateDoctorProfile,
        getDashData,
        dashData,
        backendUrl
    }

    return(
        <DoctorContext.Provider value={contextValue}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider