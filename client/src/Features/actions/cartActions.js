export const CLEAR_CART = "CLEAR_CART";
export const MARK_ALL_READ = "MARK_ALL_READ";

export const ADDED_TO_CART = "ADDED_TO_CART";
export const ERROR_CART = "ERROR_CART";
export const REMOVED_FROM_CART = "REMOVED_FROM_CART";

export const GOT_ALL_CART = "GOT_ALL_CART";
export const LOADING_CART = "LOADING_CART"

export const QUANTITY_UPDATED="QUANTITY_UPDATED";

export const NO_PRODUCT_AVAILABLE = "NO_PRODUCT_AVAILABLE";


export const cartAddOrRemove = ({productId, type, quantity}) => dispatch=> {
  const headers = new Headers()
  headers.append("Content-Type", "application/json")

  const raw = {productId: productId}

  if(type==="quantity"){
    raw.quantity=quantity
  }

  const options = {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(raw),
    redirect: "follow"
  }

  if(type==="clear"){
    options.body=null
  }


  const params = ()=>{
    switch (type){
    case "add":
      return "add=true"
    case "remove":
      return "remove=true"
    case "quantity":
      return "quantity=true"
    case "clear":
      return "clear=true"
    default:
      return  ""
  }}

  const URL = `/api/user/cart?${params()}`
  
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
          type: type==="add"?ADDED_TO_CART: type==="remove"? REMOVED_FROM_CART: type==="quantity"? QUANTITY_UPDATED: CLEAR_CART,
          payload: json
        })
      }
      else if(json.length===0){
        return dispatch({
          type: NO_PRODUCT_AVAILABLE
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

export const getCart = (signal)=>dispatch=>{
  return fetch("/api/user/cart", {signal: signal})
          .then(res=>{
            dispatch({
              type: LOADING_CART
            })
            if(res.ok){
              return res.json()
            }
            else if(res.status(204)){
              return dispatch({
                type: NO_PRODUCT_AVAILABLE
              })
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