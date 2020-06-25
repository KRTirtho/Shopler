import { FETCHED_USER_DATA, FETCHING_USER_DATA, ERROR_FETCHING_USER_DATA, LOGGED_IN, SET_USER_DATA, AUTHORIZED, UNAUTHORIZED, LOGGED_OUT, ERROR_LOG_OUT } from "../actions/userActions";

const initialState = {
    loggedIn: null,
    userDataLoading: true,
    userDataError: false,
    userData: [],
}

const userReducer = (state=initialState, action)=>{
    switch(action.type){
        case FETCHING_USER_DATA:
            return{
                ...state,
                userData: [],
                userDataLoading: true,
                userDataError: false,
                loggedIn: false
            }
        case ERROR_FETCHING_USER_DATA:
            return{
                ...state,
                userData: [],
                userDataLoading: false,
                loggedIn: false,
                userDataError: true,
            }
        case FETCHED_USER_DATA:
            return{
                ...state,
                userData: action.payload,
                userDataLoading: false,
                userDataError: false,
                loggedIn: true
            }
        case LOGGED_IN:
            return{
                ...state,
                loggedIn: action.payload
            }
        case AUTHORIZED:
            return{
                ...state,
                loggedIn: true,
                userData: action.payload,
                userDataLoading: false,
                userDataError: false
            }
        case UNAUTHORIZED:
            return{
                ...state,
                loggedIn: false
            }
        case LOGGED_OUT:
            return{
                ...state,
                loggedIn: false
            }
        case ERROR_LOG_OUT:
            return state
        case SET_USER_DATA:{
            return{
                ...state,
                userData: action.payload
            }
        }
        default:
            return state;
    }
}

export default userReducer