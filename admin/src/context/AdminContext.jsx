<<<<<<< HEAD
import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
=======
import { useState } from "react";
import { createContext } from "react";
>>>>>>> 42c2ce37f1f08e6ea48824934668dcd844dd3f2b

// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext()

const AdminContextProvider = (props) =>{

    const [aToken, setAtoken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
<<<<<<< HEAD
    const [doctors,setDoctors] = useState([])
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors =  async ()=>{
        try {
            const {data} = await axios.post(backendUrl+'/api/admin/all-doctors',{} , {headers:{aToken}})
            if(data.success){
                setDoctors(data.doctors)
                console.log(data.doctors)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const value={
        aToken,setAtoken,backendUrl,doctors,getAllDoctors
=======
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const value={
        aToken,setAtoken,backendUrl
>>>>>>> 42c2ce37f1f08e6ea48824934668dcd844dd3f2b
    }

    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider