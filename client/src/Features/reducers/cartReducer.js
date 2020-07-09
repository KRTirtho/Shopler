import {
  CLEAR_CART,
  MARK_ALL_READ,
  ADDED_TO_CART,
  REMOVED_FROM_CART,
  GOT_ALL_CART,
  LOADING_CART,
  ERROR_CART,
  QUANTITY_UPDATED,
  NO_PRODUCT_AVAILABLE
} from "../actions/cartActions";

const initialState = {
  products: [],
  firstTime: true,
  error: false,
  loading: false,
  noProducts: false,
  notification: 0,
};

const cartReducer = (state = initialState, action) => {
   switch (action.type) {
    case GOT_ALL_CART:
      return{
        ...state,
        products: action.payload,
        noProducts: false,
        firstTime: true,
        loading: false,
        error: false
      } 
    case LOADING_CART: 
    return {
      ...state,
          loading: true,
          noProducts: false,
          firstTime: true,
          error: false
        }
        case ERROR_CART:
      return {
        ...state,
        error: true,
        noProducts: true,
        firstTime: true,
         loading: false 
        }
    case ADDED_TO_CART:
       return {
         ...state,
         notification: state.notification + 1,
         noProducts: false,
         firstTime: false,
         loading: false,
         error: false
        }
    case REMOVED_FROM_CART: 
    return {
      ...state,
      firstTime: false,
      notification: state.notification>0?state.notification-1:0,
      noProducts: false,
      loading: false,
      error: false
    }
    case QUANTITY_UPDATED: 
       return {
         ...state,
         firstTime: false,
         loading: false,
         error: false,
         noProducts: false
       }
    case CLEAR_CART:
      return {
        ...state,
        firstTime: false,
        loading: false,
        error: false,
        noProducts: true,
        notification: 0
      };
    case NO_PRODUCT_AVAILABLE:
      return {
        ...state,
        noProducts: true,
        firstTime: true,
        loading:false,
        error: false,
        
      }
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
