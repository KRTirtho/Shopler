export const FETCHED_PRODUCTS = "FETCHED_PRODUCTS";
export const ERROR_GET_PRODUCTS = "ERROR_GET_PRODUCTS";
export const FETCHING_PRODUCTS = "FETCHING_PRODUCTS";
export const HAS_NO_MORE_DATA = "HAS_NO_MORE_DATA";
export const ENABLE_PAGINATE = "ENABLE_PAGINATE";

export const PAGINATING = "PAGINATING";

export const FETCHED_SINGLE_PRODUCT = "FETCHED_SINGLE_PRODUCT";
export const ERROR_FETCHING_SINGLE_PRODUCT = "ERROR_FETCHED_SINGLE_PRODUCT";
export const FETCHING_SINGLE_PRODUCT = "FETCHING_SINGLE_PRODUCT";

export const CLEAR_PRODUCT_CACHE = "CLEAR_PRODUCT_CACHE"
export const CLEAR_SINGLE_PRODUCT_CACHE = "CLEAR_SINGLE_PRODUCT_CACHE";

export const FETCHED_QUERY_PRODUCT = "FETCHED_QUERY_PRODUCT";
export const FETCHING_QUERY_PRODUCT = "FETCHING_QUERY_PRODUCT";
export const ERROR_FETCHING_QUERY_PRODUCT = "ERROR_FETCHING_QUERY_PRODUCT";
export const NO_QUERY_PRODUCT_FOUND = "NO_QUERY_PRODUCT_FOUND"

//* Payload is the Data which will be passed as a Argument in React Components while calling it!!
export const getProducts = (page, signal) => (dispatch) => {
  return fetch(`/api/product/all?page=${page}`, {signal: signal})
    .then((res) => {
      dispatch({
        type: FETCHING_PRODUCTS,
      });
      if (!res.ok) {
        dispatch({
          type: ERROR_GET_PRODUCTS,
        });
      }
      return res.json();
    })
    .then((json) => {
      if (json.length>0)dispatch({
          type: FETCHED_PRODUCTS,
          payload: json,
        })
      if(json.length === 0)dispatch({
        type: HAS_NO_MORE_DATA,
      });
    })
    .catch((err) => {
      console.log("Error!! failed to fetch data: " + err);
    });
};

// export const enablePagination = (page)=>dispatch=>{
//   return fetch(`/api/product/all?page=${page}`)
//   .then((res) => {
//     dispatch({
//       type: FETCHING_PRODUCTS,
//     });
//     if (!res.ok) {
//       dispatch({
//         type: ERROR_GET_PRODUCTS,
//       });
//     }
//     return res.json();
//   })
//   .then((json) => {
//     if (json.length>0)dispatch({
//         type: ENABLE_PAGINATE,
//         payload: json,
//       })
//     if(json.length === 0)dispatch({
//       type: HAS_NO_MORE_DATA,
//     });
//   })
//   .catch((err) => {
//     console.log("Error!! failed to fetch data: " + err);
//   });
// }

export const getProductById = (id) => (dispatch) => {
  return fetch("/api/products/" + id)
    .then((res) => {
      dispatch({
        type: FETCHING_SINGLE_PRODUCT,
      });
      if (!res.ok) {
        dispatch({
          type: ERROR_FETCHING_SINGLE_PRODUCT,
        });
      }
      return res.json();
    })
    .then((json) => {
      if (json)
        dispatch({
          type: FETCHED_SINGLE_PRODUCT,
          payload: json,
        });
    })
    .catch((err) => {
      console.log("Error!! failed to fetch data: " + err);
    });
};

export const queryProduct = (value) => (dispatch) => {
  return fetch(`/api/product-query?product=${value}`)
    .then((res) => {
      dispatch({
        type: FETCHING_QUERY_PRODUCT,
      });
      if (!res.ok && res.status !== 404) {
        dispatch({
          type: ERROR_FETCHING_QUERY_PRODUCT,
        });
      }
      return res.json();
    })
    .then((json) => {
      if (json.result){
        return dispatch({
          type: FETCHED_QUERY_PRODUCT,
          payload: json,
        });}
      else if(json.Message==="No product found!"){
        return dispatch({
          type: NO_QUERY_PRODUCT_FOUND
        })
      }
      console.log(json)   
    })
    .catch((err) => {
      console.log("Error!! failed to fetch data: " + err);
    });
};

export const clearProductCache = ()=>dispatch=>{
  dispatch({
    type: CLEAR_PRODUCT_CACHE
  })
}


export const clearSingleProductCache = ()=>dispatch=>{
  dispatch({
    type: CLEAR_SINGLE_PRODUCT_CACHE
  })
}

export const setPaginating = payload=>dispatch=>{
  dispatch({
    type: PAGINATING,
    payload: payload
  })
}