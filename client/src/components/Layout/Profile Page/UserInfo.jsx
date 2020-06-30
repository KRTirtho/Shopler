import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line
import library from "../../../fontawesome";
import CompletionPopUp  from "../../../UI/CompletionPopUp"


function UserInfo({ userId, loggedIn, mode }) {
  /** 
  * @State management
  * @UseState
  */
  const [userInfo, setUserInfo] = useState([]);
  const [userUpdated, setUserUpdated] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [popUpActive, setPopUpActive] = useState(false);
  const [successContent, setSuccessContent] = useState("");
  const [failContent, setFailContent] = useState("");
  const [imgSrc, setImgSrc] = useState([]);
  const [imgPrev, setImgPrev] = useState('')
  const [imgEditState, setImgEditState] = useState(false);
  const [inputState, setInputState] = useState({
    username: "",
    age: "",
    companyName: "",
    businessEmail: "",
    address: "",
    country: "",
    zipCode: "",
    region: "",
  });
  const [inputEditState, setInputEditState] = useState(false);
  /** 
   * @Handle Input_Changes
   * @Managing EditState
   * @Managing Img_File
   */  
  const handleImgChange = (e) => {
    if (loggedIn) {
      setImgSrc(e.target.files[0]);
      setImgPrev(URL.createObjectURL(e.target.files[0]))
    }
  };
  const handleInputChange = (e) => {
    setInputState({
      ...inputState,
      [e.target.name]: e.target.value,
    });
  };
  const handleInputEdit = (e) => {
    setInputEditState(true);
    setInputState({
      ...inputState,
      username: userInfo.username,
      age: userInfo.age,
      companyName: userInfo.companyName,
      businessEmail: userInfo.businessEmail,
      address: userInfo.address,
      country: userInfo.country,
      zipCode: userInfo.zipCode,
      region: userInfo.region,
    });
  };
  const handleInputEditCancel = (e) => {
    if (userUpdated || updateError) {
      setUserUpdated(false);
      setUpdateError(false);
    }
    setInputEditState(false);
    setInputState({
      ...inputState,
      username: userInfo.username,
      age: userInfo.age,
      companyName: userInfo.companyName,
      businessEmail: userInfo.businessEmail,
      address: userInfo.address,
      country: userInfo.country,
      zipCode: userInfo.zipCode,
      region: userInfo.region,
    });
  };

  /**
   * @Making_Api_To _-_"/api/users"<GET>_-_Call_For_User_Info
   * @Making_Api_Call _To_-_"/api/user/"<POST>_-_For_Posting_User_Credential's_Updates
   * @Making_Api_call_To _-_"/api/user/image"<POST>_-_Far_Posting_Img
   */
  const getUserInfo = (userId) => {
    return fetch("/api/users/" + userId)
      .then((res) => res.json())
      .then((json) => setUserInfo(json))
      .catch((err) => console.log("Failed to load user data"));
  };

  const updateUserInfo = () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const raw = {
      userId: userId, //* From Props
      username: inputState.username,
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
    if (loggedIn) {
      return fetch("/api/users/", options)
        .then((res) => {
          if (res.ok) {
            setUserUpdated(true);
            setUpdateError(false);
            setInputEditState(false);
            setPopUpActive(true);
            setSuccessContent("Credentials updated! 😘");
          } else if (!res.ok) {
            setUserUpdated(false);
            setUpdateError(true);
            setPopUpActive(true);
            setFailContent("Credential update fail! 😭");
          }
        })
        .catch((err) => {
          setUserUpdated(false);
          setUpdateError(true);
          setPopUpActive(true);
          setFailContent("Credential update fail! 😭");
          console.error("Failed to update credentials: " + err);
        });
    }
  };

  const handleUserImgSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("imgSrc", imgSrc);
    formData.append("prevImgSrc", userInfo.imgSrc);
    const options = {
      method: "POST",
      body: formData,
    };
    return fetch("/api/users/image", options)
      .then((res) => {
        if (res.ok) {
          setUserUpdated(true);
          setUpdateError(false);
          setPopUpActive(true);
          setSuccessContent("Profile Picture Updated");
          setImgEditState(false);
        } else if (!res.ok) {
          setUserUpdated(false);
          setUpdateError(true);
          setPopUpActive(true);
          setFailContent("Failed to Upload Picture");
        }
      })
      .catch((err) => {
        setUserUpdated(false);
        setUpdateError(true);
        setPopUpActive(true);
        setFailContent("Failed to Upload Picture");
        console.error("Failed to update picture: " + err);
      });
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    if (loggedIn) getUserInfo(userId, signal);
    if (popUpActive) setTimeout(() => setPopUpActive(false), 3000);
    return ()=>{
      abortController.abort();
    }
  }, [loggedIn, inputEditState, popUpActive, userId]);
  
  return (
    <div data-mode={mode} className="user-info-container">
      {/* Pop Up Dialog*/}
      <CompletionPopUp 
        mode={mode}
        success={userUpdated}
        fail={updateError}
        successContent={successContent}
        failContent={failContent}
        active={popUpActive}
        onClick={()=>setPopUpActive(false)}
      />
      {/* Greeting Message */}
      <h3 className="text-align-center welcome-text">
        Hello{" "}
        <span>
          {loggedIn && userInfo && userInfo.username && userInfo.username}
        </span>
      </h3>
      {/** 
        * @Main_Container for Company Info
        * @Edit_State Button
       */}
      <div className="">
        <div className="display-flex justify-content-center">
          <h3 className="text-align-center">Company Info</h3>
          {!inputEditState && (
            // eslint-disable-next-line
            <a onClick={handleInputEdit} className="m-1 user-select-none">
              <FontAwesomeIcon icon={["fas", "pencil-alt"]} />
            </a>
          )}
        </div>
        {/**
         * @Container for_Input_Elements that holds user data  
          */}
        <div className="display-flex flex-col tiny-padding">
          {/**
           * @Container for -
           * @Name
           * @Email
           * @Age
           * @UserImage
           */}
          <div className="display-flex flex-row justify-content-between position-relative">
            <div className="display-flex flex-col">
              <div className="display-flex md-margin-top">
                <label htmlFor="username">Name: </label>
                <input
                  type="text"
                  className="user-info-input tiny-margin-left"
                  id="username"
                  name="username"
                  readOnly={!inputEditState}
                  onChange={
                    inputEditState
                      ? handleInputChange
                      : () => {
                          return;
                        }
                  }
                  value={
                    inputEditState
                      ? inputState.username
                      : !inputEditState && userInfo && userInfo.email
                      ? userInfo.username
                      : ""
                  }
                  disabled={!inputEditState}
                />
              </div>
              <div className="display-flex md-margin-top">
                <label htmlFor="email">Email: </label>
                <input
                  type="email"
                  className="user-info-input tiny-margin-left"
                  id="email"
                  name="email"
                  readOnly={true}
                  value={userInfo && userInfo.email ? userInfo.email : ""}
                  disabled={true}
                />
              </div>
              <div className="display-flex md-margin-top">
                <label htmlFor="age">Age: </label>
                <input
                  type="number"
                  className="user-info-input tiny-margin-left"
                  id="age"
                  name="age"
                  readOnly={!inputEditState}
                  onChange={
                    inputEditState
                      ? handleInputChange
                      : () => {
                          return;
                        }
                  }
                  value={
                    inputEditState
                      ? inputState.age
                      : !inputEditState && userInfo && userInfo.age
                      ? userInfo.age
                      : ""
                  }
                  disabled={!inputEditState}
                />
              </div>
            </div>

            {/**
             * @img uploading
             * @uploading to /api/users/image
             */}
            <div className="position-relative">
              <img
                className="user-profile-image border-rounded"
                src={imgEditState && imgPrev ? imgPrev : userInfo && userInfo.imgSrc && userInfo.imgSrc}
                alt="User Profile"
              />
              <label
                onClick={() => setImgEditState(true)}
                htmlFor="userImg"
                className="user-info-edit-img-btn position-absolute right-0"
              >
                <FontAwesomeIcon icon={["fas", "pencil-alt"]} />
              </label>
            </div>
          </div>
          {/**
           * @Container for
           * @BusinessEmail
           * @Country
           * @Also Some attention tag
           */}
          <div className="display-flex flex-col">
            <div className="display-flex md-margin-top">
              <label htmlFor="businessEmail">Business Email: </label>
              <input
                type="text"
                className="user-info-input flex-grow tiny-margin-left"
                name="businessEmail"
                id="businessEmail"
                readOnly={true}
                value={
                  userInfo && userInfo.businessEmail
                    ? userInfo.businessEmail
                    : ""
                }
                disabled={true}
              />
            </div>
            <div className="position-relative md-padding-y display-flex md-margin-top">
              <label htmlFor="address">Address: </label>
              <input
                type="text"
                className="user-info-input flex-grow tiny-margin-left"
                name="address"
                id="address"
                readOnly={!inputEditState}
                onChange={
                  inputEditState
                    ? handleInputChange
                    : () => {
                        return;
                      }
                }
                value={
                  inputEditState
                    ? inputState.address
                    : !inputEditState && userInfo && userInfo.address
                    ? userInfo.address
                    : ""
                }
                disabled={!inputEditState}
              />
              <p className="attention-tag">
                {inputEditState && "* Needs official migration document"}
              </p>
            </div>
          </div>

          {/**
           * @includes___
           * @Container for
           * @Region
           * @Country
           * @ZipCode
           */}
          <div className="display-flex flex-col">
            <div className="display-flex position-relative md-margin-top">
              <label htmlFor="country">Country: </label>
              <input
                type="text"
                className="user-info-input tiny-margin-left"
                name="country"
                id="country"
                readOnly={!inputEditState}
                onChange={
                  inputEditState
                    ? handleInputChange
                    : () => {
                        return;
                      }
                }
                value={
                  inputEditState
                    ? inputState.country
                    : !inputEditState && userInfo && userInfo.country
                    ? userInfo.country
                    : ""
                }
                disabled={!inputEditState}
              />
              <p className="attention-tag">
                {inputEditState && "* Needs official migration document"}
              </p>
            </div>
            <div className="display-flex position-relative md-margin-top">
              <label htmlFor="region">Region: </label>
              <input
                type="text"
                className="user-info-input tiny-margin-left"
                name="region"
                id="region"
                readOnly={!inputEditState}
                onChange={
                  inputEditState
                    ? handleInputChange
                    : () => {
                        return;
                      }
                }
                value={
                  inputEditState
                    ? inputState.region
                    : !inputEditState && userInfo && userInfo.region
                    ? userInfo.region
                    : ""
                }
                disabled={!inputEditState}
              />
              <p className="attention-tag">
                {inputEditState && "* Needs official migration document"}
              </p>
            </div>
            <div className="display-flex position-relative md-margin-top">
              <label htmlFor="phone">Zip Code: </label>
              <input
                type="text"
                className="user-info-input tiny-margin-left"
                name="zipCode"
                id="zipCode"
                readOnly={!inputEditState}
                onChange={
                  inputEditState
                    ? handleInputChange
                    : () => {
                        return;
                      }
                }
                value={
                  inputEditState
                    ? inputState.zipCode
                    : !inputEditState && userInfo && userInfo.zipCode
                    ? userInfo.zipCode
                    : ""
                }
                disabled={!inputEditState}
              />
              <p className="attention-tag">
                {inputEditState && "* Needs official migration document"}
              </p>
            </div>
          </div>

          {/**
           * @Container for
           * @UpdateButton
           * @CancelButton
           * @UpdateImageButton
           * @CancelImageButton
           * @Includes input:file Form for Image Uploading
           */}
          <div className="display-flex lg-margin-top">
            {inputEditState && (
              <>
                <button
                  onClick={updateUserInfo}
                  className="btn btn-success tiny-shadow"
                >
                  Update
                </button>
                <button
                  onClick={handleInputEditCancel}
                  className="btn btn-light tiny-margin-left tiny-shadow"
                >
                  Cancel
                </button>
              </>
            )}
            <form onSubmit={handleUserImgSubmit}>
              <input
                type="file"
                onChange={handleImgChange}
                name="imgSrc"
                className="display-none"
                id="userImg"
              />
              {imgEditState && (
                <>
                  <input
                    type="submit"
                    className="btn btn-success tiny-shadow"
                    value="Update"
                  />
                  <button
                    onClick={(e)=>{
                      setImgSrc([])
                      setImgEditState(false)}}
                    className={"btn tiny-margin-left tiny-shadow"}
                  >
                    Cancel
                  </button>
                </>
              )}
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}

export default UserInfo;
