import axios from "axios";
import { useCallback, useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken, setAtoken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData,setDashdata] = useState(false)
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
                // Helpful warning if a production page is trying to call localhost
                console.warn('[Admin] VITE_BACKEND_URL points to localhost while running on', window.location.origin)
            }
        }
        return url
    })()

    const getAllDoctors = useCallback(async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [aToken, backendUrl])

    const changeAvailability = useCallback(async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [aToken, backendUrl, getAllDoctors])

    const getAllAppointments = useCallback(async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [aToken, backendUrl])

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/cancel-appointment',
                { appointmentId }, //
                { headers: { aToken } }
            )

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // to fetch the dashboard data using the API
    const getDashData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl+'/api/admin/dashboard',{headers:{aToken}})
            if(data.success){
                setDashdata(data.dashData)
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        aToken,
        setAtoken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        getAllAppointments,
        appointments,
        setAppointments,
        cancelAppointment,
        getDashData,
        dashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider