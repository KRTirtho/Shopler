export const CLEAR_CART = "CLEAR_CART";
export const MARK_ALL_READ = "MARK_ALL_READ";

export const ADDED_TO_CART = "ADDED_TO_CART";
export const ERROR_CART = "ERROR_CART";
export const REMOVED_FROM_CART = "REMOVED_FROM_CART";

export const GOT_ALL_CART = "GOT_ALL_CART";
export const LOADING_CART = "LOADING_CART"


export const cartAddOrRemove = ({productId, type}) => dispatch=> {
  const headers = new Headers()
  headers.append("Content-Type", "application/json")

  const options = {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify({productId: productId}),
    redirect: "follow"
  }

  const URL = `/api/user/cart?${type==="add"?"add=true": "remove=true"}`
  
  return fetch(URL, options)
    .then(res=>{
      dispatch({
        type: LOADING_CART
      })
      if(res.ok){
        return res.json()
      }
      else if(!res.ok){
        dispatch({
          type: ERROR_CART
        })
      }
    })
    .then(json=>{
      if(json){
        return dispatch({
          type: type==="add"?ADDED_TO_CART: REMOVED_FROM_CART,
          payload: json
        })
      }
    })
    .catch(err=>{
      console.error({Failed: err})
      dispatch({
        type: ERROR_CART
      })
    })
};

export const getCart = ()=>dispatch=>{
  return fetch("/api/user/cart")
          .then(res=>{
            dispatch({
              type: LOADING_CART
            })
            if(res.ok){
              return res.json()
            }
            else if(!res.ok){
              return dispatch({
                type: ERROR_CART
              })
            }
          })
          .then(json=>{
            if(json){
              return dispatch({
                type: GOT_ALL_CART,
                payload: json
              })
            }
          })
          .catch(err=>{
            console.error("Failed to get cart product: ",err)
            return dispatch({
              type: ERROR_CART
            })
          })
}

export const clearCart = () => dispatch=> {
  return  { type: CLEAR_CART };
};

export const markAllRead = ()=>{
  return {type: MARK_ALL_READ}
}