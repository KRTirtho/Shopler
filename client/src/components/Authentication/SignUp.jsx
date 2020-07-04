import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "../../libs/Tiny.utility.css";
import "../../libs/Tiny.Style.css";
import { NavLink, Redirect } from "react-router-dom";
import CompletionPopUp from "../../UI/CompletionPopUp";
import {
  setLoggedIn,
  setUserData,
  postAndGetUserData,
} from "../../Features/actions/userActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line
import library from "../../fontawesome";
import "./css/SignUp.css";

function SignUp({
  userDataState,
  postAndGetUserData,
  theme
}) {
  const { loggedIn, userDataError } = userDataState;

  // state for all {input(type="text")||(type(_proto_)="text")}
  const [inputState, setInputState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "", //This is for validation
    age: "",
    companyName: "",
    businessEmail: "",
    address: "",
    country: "",
    zipCode: "",
    region: "",
  });

  const {darkMode} = theme;
  const [mode, setMode] = useState("")

  const [signedUp, setSignedUp] = useState(false); //for logging in the use
  const [error, setError] = useState(false);
  const [popUpActive, setPopUpActive] = useState(false); //PopUp toggling state
  const [failContent, setFailContent] = useState("");
  //all {input(type="text")||(type(_proto_)="text")} controlling handler function
  const handleInputChange = (e) => {
    setInputState({
      ...inputState,
      [e.target.name]: e.target.value,
    });
  };

  //Submitter for the signUp form
  const signupSubmit = (e) => {
    e.preventDefault();
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const raw = {
      username: inputState.username,
      newUserEmail: inputState.email,
      newUserPassword: inputState.password,
      age: inputState.age,
      companyName: inputState.companyName,
      businessEmail: inputState.businessEmail,
      address: inputState.address,
      country: inputState.country,
      zipCode: inputState.zipCode,
      region: inputState.region,
    };

    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(raw),
      redirect: "follow",
    };
    /**
     * @checking
     * isLoggedIn? ,
     * confirm password & password match,
     * if there any json data or not
     */
    if (inputState.password === inputState.confirmPassword && !loggedIn) {
      fetch("/api/user/signup", options)
        .then((res) => {
          setPopUpActive(true);
          if (res.status === 200) {
            setSignedUp(true);
            setError(false);

            postAndGetUserData({
              emailValue: inputState.email,
              passValue: inputState.password,
            }).then(() => {
              setInputState({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                age: "",
                companyName: "",
                businessEmail: "",
                address: "",
                country: "",
                zipCode: "",
                region: "",
              });
            });
          } else if (res.status === 400) {
            setSignedUp(false);
            setError(true);
            setFailContent("User Name already taken!");
          } else if (!res.ok) {
            setSignedUp(false);
            setError(true);
            setFailContent("Email already exists!");
          }
        })
        //!because the json obj is in userData.result if not given then profilePage &  profile will break!
        .catch((err) => {
          console.log("Failed to SignUp: " + err);
          setSignedUp(false);
          setError(true);
        });
    } else if (inputState.password !== inputState.confirmPassword) {
      setError(true);
      setFailContent("Passwords doesn't match");
      setPopUpActive(true);
    } else if (loggedIn) {
      setError(true);
      setFailContent("You're already logged in");
      setPopUpActive(true);
    }
  };

  useEffect(() => {
    if (userDataError) {
      setError(true);
      setFailContent(
        "You are signed up but not able login. Please manually Login"
      );
    }
    if(darkMode){
      setMode("dark")
    }
    else if(!darkMode){
      setMode("")
    }
  }, [userDataError, darkMode]);

  return (
    <>
      {!loggedIn && (
        <>
          <CompletionPopUp
            mode={mode}
            success={signedUp}
            fail={error}
            successContent="You're now Signed Up!"
            failContent={failContent}
            onClick={() => setPopUpActive(false)}
            active={popUpActive}
          />
          <div data-shade={mode} className="width-half container-div vertical-center-strict top-10 border-rounded md-padding tiny-shadow">
            {/* Submit PopUp */}
            <h1 className="text-align-center">SignUp</h1>
            {/* Form Element */}
            <form className="display-flex flex-col" onSubmit={signupSubmit}>
              {/* UserName & Email*/}
              <div className="display-flex">
                <input
                  data-shade={mode}
                  type="text"
                  placeholder="Your Name"
                  className="input-custom tiny-margin flex-grow"
                  required
                  name="username"
                  value={inputState.username}
                  onChange={handleInputChange}
                />
                <input
                  data-shade={mode}
                  type="email"
                  placeholder="Your Email"
                  className="input-custom tiny-margin flex-grow"
                  required
                  name="email"
                  value={inputState.email}
                  onChange={handleInputChange}
                />
              </div>
              {/* Company Name & BusinessEmail */}
              <div className="display-flex">
                <input
                  data-shade={mode}
                  type="text"
                  name="companyName"
                  className="input-custom tiny-margin flex-grow"
                  placeholder="Your Company's Name"
                  value={inputState.companyName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  data-shade={mode}
                  type="email"
                  name="businessEmail"
                  className="input-custom tiny-margin flex-grow"
                  placeholder="Business Email"
                  value={inputState.businessEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* Address */}
              <input
                data-shade={mode}
                type="text"
                name="address"
                className="input-custom tiny-margin flex-grow"
                placeholder="Address e.g. Block#22, St.Stephenson Road, New Orleans, New York"
                value={inputState.address}
                onChange={handleInputChange}
                required
              />
              {/* Country & Zip Code */}
              <div className="display-flex">
                <input
                  data-shade={mode}
                  type="text"
                  name="country"
                  className="input-custom tiny-margin flex-grow"
                  placeholder="Your Country"
                  value={inputState.country}
                  onChange={handleInputChange}
                  required
                />
                <input
                  data-shade={mode}
                  type="number"
                  name="zipCode"
                  className="input-custom tiny-margin flex-grow"
                  placeholder="Zip Code e.g. 1400"
                  value={inputState.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* Region & Age */}
              <div className="display-flex">
                <input
                  data-shade={mode}
                  type="text"
                  placeholder="Region"
                  required
                  name="region"
                  className="input-custom tiny-margin flex-grow"
                  value={inputState.region}
                  onChange={handleInputChange}
                />
                <input
                  data-shade={mode}
                  type="number"
                  placeholder="Your Age"
                  required
                  name="age"
                  className="input-custom tiny-margin flex-grow"
                  value={
                    inputState.age >= 0 &&
                    inputState.age <= 100 &&
                    inputState.age
                  }
                  onChange={handleInputChange}
                />
              </div>
              {/* Password & Confirm Password */}
              <div className="display-flex">
                <input
                  data-shade={mode}
                  type="password"
                  placeholder="Password"
                  required
                  name="password"
                  className="input-custom tiny-margin flex-grow"
                  value={inputState.password}
                  onChange={handleInputChange}
                />
                <input
                  data-shade={mode}
                  type="password"
                  placeholder="Confirm Password"
                  required
                  name="confirmPassword"
                  className="input-custom tiny-margin flex-grow"
                  value={inputState.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              {/* Submit Button */}
              <input
                type="submit"
                value="SignUp"
                className="input-custom tiny-margin"
              />

              <div>
                <h5 className="text-center">or</h5>
              </div>

              {/* Social Authentication but currently for showcase */}
              <div className="display-flex flex-col width-half vertical-center justify-content-center">
                <div data-shade={mode} className="social-btn hover-filter active-filter">
                  <a href="/api/auth/google-plus/callback">
                    Sign in with Google{" "}
                  </a>
                  <div className="google">
                    <FontAwesomeIcon icon={["fab", "google"]} />
                  </div>
                </div>

                <div data-shade={mode} className="social-btn hover-filter active-filter">
                  <a href="/api/auth/github/">
                    Sign in with Github{" "}
                  </a>
                  <div className="github">
                    <FontAwesomeIcon icon={["fab", "github"]} />
                  </div>

                </div>
              </div>
            </form>
            {/* End of form */}
            {/* already a member handler */}
            <p className="text-align-center">
              Already an member?{" "}
              <NavLink to="/login">
                <span className="link cursor-pointer">Login</span>
              </NavLink>
            </p>
          </div>
        </>
      )}
      {/* After authorization */}
      {loggedIn && <Redirect to="/" />}
    </>
  );
}

const mapStateToProps = (state) => ({
  userDataState: state.userDataState,
  theme: state.theme
});

export default connect(mapStateToProps, {
  setLoggedIn,
  setUserData,
  postAndGetUserData,
})(SignUp);
