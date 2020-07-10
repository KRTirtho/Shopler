import {
  CLEAR_CART,
  MARK_ALL_READ,
  ADDED_TO_CART,
  REMOVED_FROM_CART,
  GOT_ALL_CART,
  LOADING_CART,
  ERROR_CART,
  QUANTITY_UPDATED,
} from "../actions/cartActions";
import { fas } from "@fortawesome/free-solid-svg-icons";

const initialState = {
  products: [],
  firstTime: true,
  error: false,
  loading: false,
  notification: 0,
};

const cartReducer = (state = initialState, action) => {
   switch (action.type) {
    case GOT_ALL_CART:
      return{
        ...state,
        products: action.payload,
        firstTime: true,
        loading: false,
        error: false
      } 
    case LOADING_CART: 
    return {
      ...state,
          loading: true,
          firstTime: true,
          error: false
        }
        case ERROR_CART:
      return {
        ...state,
        error: true,
        firstTime: true,
         loading: false 
        }
    case ADDED_TO_CART:
       return {
         ...state,
         notification: state.notification + 1,
         firstTime: false,
         loading: false,
         error: false
        }
    case REMOVED_FROM_CART: 
        return {
          ...state,
          products: state.products.length===1?[]:state.products,
          firstTime: false,
          notification: state.notification>0?state.notification-1:0,
          loading: false,
          error: false
        }
    case QUANTITY_UPDATED: 
       return {
         ...state,
         firstTime: false,
         loading: false,
         error: false,
       }
    case CLEAR_CART:
      return {
        ...state,
        products: [],
        firstTime: false,
        loading: false,
        error: false,
        notification: 0
      };
    case MARK_ALL_READ:
      return {
        ...state,
        notification: 0,
      };
    default:
      return state;
  }
};

export default cartReducer;
