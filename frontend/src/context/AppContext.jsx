import { createContext } from "react";
import { doctors } from "../assets/assets";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const AppContextProvier = (props) =>{
    const value = {doctors}

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