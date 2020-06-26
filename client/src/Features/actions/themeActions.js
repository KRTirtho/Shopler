export const SET_DARK_MODE = "SET_DARK_MODE";

export const setDarkMode = (payload)=>dispatch=>{
    JSON.stringify(localStorage.setItem("dark", payload))
    dispatch({
        type: SET_DARK_MODE,
        payload: payload
        })
}