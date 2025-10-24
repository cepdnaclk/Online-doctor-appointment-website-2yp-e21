import { createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext()

const AppContextProvider = (props) =>{

    // Calculate age from DOB (YYYY-MM-DD or ISO string)
    const calculateAge = (dob) => {
        if (!dob) return "-"
        const today = new Date()
        const birthDate = new Date(dob)
        // if birthDate is invalid, return placeholder
        if (Number.isNaN(birthDate.getTime())) return "-"
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        // ensure age is a safe number
        if (Number.isNaN(age)) return "-"
        return age
    }

    // Format appointment slotDate like "12_Sep_2025"
    const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    const slotDateFormat = (slotDate) => {
        if (!slotDate) return "-"
        const dateArray = String(slotDate).split("_")
        if (dateArray.length < 3) return String(slotDate)
        return `${dateArray[0]} ${months[Number(dateArray[1])] || dateArray[1]} ${dateArray[2]}`
    }

    // Currency formatter (LKR default)
    const currency = (amount) => {
        const n = Number(amount || 0)
        return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(n)
    }

    const value={
        calculateAge,
        slotDateFormat,
        currency
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider