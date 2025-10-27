import { createContext,useEffect } from "react";
// import { doctors } from "../assets/assets";
import { useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const AppContextProvier = (props) =>{

    const currencySymbol = 'Rs.'
    // Normalize backend URL (remove trailing slashes) to avoid invalid URLs like http://host:4000api/...
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([])
    
    //when refreshing the page if you have token it should be get as 1st state 
    const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    
    // user profile state
    const [userData, setUserData] = useState(false)


    const getDoctorsData = async ()=>{
        try{
            const {data} = await axios.get(backendUrl+'/api/doctor/list')
            if (data.success){
                setDoctors(data.doctors)
            }else{
                toast.error(data.message)
            }
        }catch(error){
            console.log(error)
            toast.error(error.message)
        }
    }
    
    // load current user's profile when token is available
    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
                headers: { token }
            })
            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {doctors ,currencySymbol,getDoctorsData,token,setToken,backendUrl, userData, setUserData, loadUserProfileData}

    useEffect(()=>{
        getDoctorsData()
    },[]) // to run the api in the start of the page

    // refetch profile whenever token changes
    useEffect(()=>{
        if (token){
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    },[token])

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvier;



// import { AppContext } from "./AppContextContext";

/* 
සරලවම කිව්වොත්:

AppContext කියන නමින් හිස් භාජනයක් හැදුවා.

AppContextProvier කියලා component එකක් හැදුවා.

ඒ component එකට කිව්වා, "ඔබ ඇතුළට එන ඕනෑම කෙනෙකුට 
(props.children) මම දෙන doctors data එක (value) ලබාගන්න ඉඩ දෙන්න" කියලා.

*/

