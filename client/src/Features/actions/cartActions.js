export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const CLEAR_CART = "CLEAR_CART";
export const INCREMENT_QUANTITY = "INCREMENT_QUANTITY";
export const MARK_ALL_READ = "MARK_ALL_READ";


export const addToCart = (payload) => {
  return {
    type: ADD_TO_CART,
    payload: payload,
  };
};

export const incrementQuantity = payload=>{
    return{
        type: INCREMENT_QUANTITY,
        payload: payload
    }
}

export const removeFromCart = (payload) => {
  return { type: REMOVE_FROM_CART, payload: payload };
};

export const clearCart = () => {
  return { type: CLEAR_CART };
};

export const markAllRead = ()=>{
  return {type: MARK_ALL_READ}
}