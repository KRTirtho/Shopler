import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  MARK_ALL_READ,
} from "../actions/cartActions";

const initialState = {
  products: [],
  count: 0,
  notification: 0,
};

const cartReducer = (state = initialState, action) => {
   switch (action.type) {
    case ADD_TO_CART:
      const existingItem = state.products.find(
        (product) => product._id === action.payload._id
      );
      if (existingItem && existingItem.length !== 0) {
        existingItem.quantity = existingItem.quantity + 1;
        return {
          ...state,
          count: state.count + 1,
        };
      } else {
        return {
          ...state,
          products: state.products.concat({ ...action.payload, quantity: 1 }),
          count: state.count + 1,
          notification: state.notification + 1,
        };
      }
    case REMOVE_FROM_CART:
      const existingItemToDelete = state.products.find(
        (product) => product._id === action.payload
      );

      if (existingItemToDelete.quantity > 1) {
        existingItemToDelete.quantity = existingItemToDelete.quantity - 1;
        return {
          ...state,
          count: state.count > 0 ? state.count - 1 : 0,
        };
      } else {
        return {
          ...state,
          products: state.products.filter(
            (product) => product._id !== action.payload
          ),
          count: state.count >= 0 ? state.count - 1 : 0,
          notification : state.notification >= 0? state.notification - 1 : 0
        };
      }
    case CLEAR_CART:
      return {
        ...state,
        products: [],
        count: 0,
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
