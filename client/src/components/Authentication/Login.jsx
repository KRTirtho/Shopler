import React, { useState } from "react";
import {connect} from "react-redux"
import "../../libs/Tiny.utility.css";
import "../../libs/Tiny.Style.css";
import { Link, Redirect } from "react-router-dom";
import SubmitPopUp from "../..//UI/SubmitPopUp"
import { postAndGetUserData, setLoggedIn } from "../../Features/actions/userActions"


function Login({setLoggedIn, userDataState, postAndGetUserData}) {
  const [emailValue, setEmailValue] = useState(""); //Controlled Email input
  const [passValue, setPassValue] = useState(""); //Controlled Pass input
  const [popUpActive, setPopUpActive] = useState('inactive') //Pop-up handling for error or success

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
  postAndGetUserData({emailValue, passValue})
  setPopUpActive('active')//!Pop up active

  if(!userDataError && userData.username){
    setEmailValue('')
    setPassValue('')
  }
  else if(userDataError){
    setLoggedIn(false)
  }
  };
  
//-----------------------------------------------------------
return (
  <>
      {!loggedIn &&
      <div className="width-quarter container-div vertical-center-strict top-30 border-rounded md-padding tiny-shadow">
        {/* Submit Pop Up */}
      <SubmitPopUp
        success={loggedIn}
        fail = {error}
        successContent = "You're now logged in!"
        failContent = "Email or Password is not correct!"
        hideControl={()=>setPopUpActive('inactive')}
        active = {popUpActive}
        />
        <h1 className="text-align-center">Login</h1>
        <form onSubmit={loginSubmit} className="display-flex flex-col">
          <input
            type="email"
            name="userEmail"
            placeholder="Email"
            className="input-custom tiny-margin"
            required
            onChange={handleEmailChange}
            value={emailValue}
            />
          <input
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
    {loggedIn ? <Redirect to="/"/>:''}
      </>
  )
}

const mapStateToProps = (state)=>({
  userDataState: state.userDataState
})

export default connect(mapStateToProps, {setLoggedIn, postAndGetUserData})(Login);
