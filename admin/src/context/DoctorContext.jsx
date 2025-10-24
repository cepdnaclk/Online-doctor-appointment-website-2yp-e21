import { createContext } from "react";
import { useCallback, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

// eslint-disable-next-line react-refresh/only-export-components
export const DoctorContext = createContext()

const DoctorContextProvider = (props) =>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL
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