import {combineReducers} from "redux"
import productReducer from "./productReducer"
import userReducer from "./userReducer"
import cartReducer from "./cartReducer"
import { themeReducer } from "./themeReducer"

export default combineReducers({
    productState: productReducer,
    userDataState: userReducer,
    cartState: cartReducer,
    theme: themeReducer
})
