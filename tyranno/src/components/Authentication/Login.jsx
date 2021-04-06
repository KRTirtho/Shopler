import React, { useState, useEffect } from "react";
import {useSelector, useDispatch} from "react-redux"
import "../../libs/Tiny.utility.css";
import "../../libs/Tiny.Style.css";
import { Link, useHistory } from "react-router-dom";
import SubmitPopUp from "../..//UI/SubmitPopUp"
import { postAndGetUserData, cleanUserCache } from "../../Features/actions/userActions"


function Login() {
  // Redux State
  const {userDataState, theme} = useSelector(state=>state)
  // Redux mapDispatchToProps
  const dispatch = useDispatch();
  
  const [emailValue, setEmailValue] = useState(""); //Controlled Email input
  const [passValue, setPassValue] = useState(""); //Controlled Pass input
  const [popUpActive, setPopUpActive] = useState('inactive') //Pop-up handling for error or success
  const [mode, setMode] = useState("")
  const {darkMode} = theme;
  const history = useHistory()

  const {userData, userDataError, loggedIn} = userDataState
  const error = userDataError
//Form control handler-------------
  const handleEmailChange = (e) => {
    setEmailValue(e.target.value);
  };
  const handlePassChange = (e) => {
    setPassValue(e.target.value);
  };
//-----------------------------------


//Login Credentials Submitter Func---------------------------------------
const loginSubmit = (e) => {
  e.preventDefault()
  dispatch(postAndGetUserData({emailValue, passValue}))
  setPopUpActive('active')//!Pop up active
  };

  useEffect(()=>{
    if(!userDataError && userData.username){
      setEmailValue("")
      setPassValue("")
    }
    if(darkMode)setMode("dark")
    else if(!darkMode)setMode("")
    if(loggedIn)history.push("/")
  }, [userData.username,darkMode])
  
//-----------------------------------------------------------
return (
  <>
      {!loggedIn &&
      <div data-shade={mode} className="container-div vertical-center-strict top-30 border-rounded md-padding tiny-shadow">
        {/* Submit Pop Up */}
      <SubmitPopUp
        success={loggedIn}
        fail = {error}
        successContent = "You're now logged in!"
        failContent = "Email or Password is not correct!"
        hideControl={()=>{
          setPopUpActive('inactive')
          dispatch(cleanUserCache())
        }}
        active = {popUpActive}
        />
        <h1 className="text-align-center">Login</h1>
        <form onSubmit={loginSubmit} className="display-flex flex-col">
          <input
            data-shade={mode}
            type="email"
            name="userEmail"
            placeholder="Email"
            className="input-custom tiny-margin"
            required
            onChange={handleEmailChange}
            value={emailValue}
            />
          <input
            data-shade={mode}
            type="password"
            name="userPassword"
            placeholder="Password"
            required
            className="input-custom tiny-margin"
            onChange={handlePassChange}
            value={passValue}
            />
          <input
            type="submit"
            value="Login"
            className="input-custom tiny-margin"
            />
        </form>
        <p className="text-align-center">
          Don't have an account?{" "}
          <Link to="/signup">
            <span className="link cursor-pointer">SignUp</span>
          </Link>{" "}
          now
        </p>
      </div>
    }
      </>
  )
}

export default Login;
