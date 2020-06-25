import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "./reducers/index"
import thunk from "redux-thunk"


const middleWare = [thunk]


const store = configureStore({
    reducer: rootReducer,
    middleware: middleWare
})

export default store


