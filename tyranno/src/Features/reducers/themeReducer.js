import {SET_DARK_MODE} from "../actions/themeActions"

const initialState = {
    darkMode: false
}

export const themeReducer = (state=initialState, action)=>{
    const localDark = JSON.parse(localStorage.getItem("dark"))
    if(localDark){
        return {
            ...state,
            darkMode: localDark
        }
    }
    switch (action.type){
        case SET_DARK_MODE:
            return {
                ...state,
                darkMode: action.payload
            }
        default:
            return state
    }
}