export const FETCHING_USER_DATA = "FETCHING_USER_DATA"
export const ERROR_FETCHING_USER_DATA = "ERROR_FETCHING_USER_DATA"
export const FETCHED_USER_DATA = "FETCHED_USER_DATA"
export const LOGGED_IN = "LOGGED_IN";
export const SET_USER_DATA = "SET_USER_DATA"
export const AUTHORIZED = "AUTHORIZED"
export const UNAUTHORIZED = "UNAUTHORIZED"
export const LOGGED_OUT = "LOGGED_OUT"
export const ERROR_LOG_OUT = "ERROR_LOG_OUT"


export const postAndGetUserData = givenUserData=>dispatch=>{
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"email": givenUserData.emailValue,"password": givenUserData.passValue});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("/api/user/login", requestOptions)
      .then((res) =>{
          //For logging in the user in context also
          if(res.status===200){
            dispatch({
                type: FETCHING_USER_DATA
            })
        }
        else if(!res.ok){
            dispatch({
                type: ERROR_FETCHING_USER_DATA
            })
        }
        return res.json()
    })
    .then((json) => {
          if(!json.Error)dispatch({
              type: FETCHED_USER_DATA,
              payload: json
          })
      })
      .catch((err) =>{
          console.log(err)
          dispatch({
              type: ERROR_FETCHING_USER_DATA
          })
        });
}

export const checkAuthorized = ()=>dispatch=>{
    return fetch("/api/user/is-authorized")
            .then(res=>res.json())
            .then(json=>{
                if(json.Login===true)dispatch({
                    type: AUTHORIZED,
                    payload: json
                })
                else{
                    return dispatch({
                        type: UNAUTHORIZED
                    })
                }
            })
}

export const logOutUser = ()=>dispatch=>{
    return fetch("/api/user/logout")
            .then(res=>{
                if(res.status===200)dispatch({
                    type: LOGGED_OUT
                })
                else if(!res.ok)dispatch({
                    type: ERROR_LOG_OUT
                })
            })
            .catch(err=>dispatch({
                type: ERROR_LOG_OUT
            }))
}

export const setLoggedIn = (val)=>(dispatch)=>{
    dispatch({
        type: LOGGED_IN,
        payload: val
    })
}

export const setUserData = (payload)=>dispatch=>{
    dispatch({
        type: SET_USER_DATA,
        payload: payload
    })
}