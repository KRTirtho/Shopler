import {combineReducers} from "redux"
import productReducer from "./productReducer"
import userReducer from "./userReducer"
import cartReducer from "./cartReducer"

export default combineReducers({
    productState: productReducer,
    userDataState: userReducer,
    cartState: cartReducer
})
