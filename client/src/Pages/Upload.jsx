import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import "../libs/Tiny.utility.css";
import CompletionPopUp from "../UI/CompletionPopUp"
import useFetchP3D from "../Hooks/useFetchP3D";

const Upload = ({ userDataState, theme }) => {
  const [error, setError] = useState(false); //executes big img-size, unfulfilled fields & completion errors 
  const [popUpActive, setPopUpActive] = useState(false); //For CompletionPopUp state
  const [failContent, setFailContent] = useState("");
  const { loggedIn, userData } = userDataState;
  const fileInput = useRef(); //for clearing the previously submitted {file[type=image]} 
  const userId = userData && userData._id ? userData._id : ""; //userId for form submitting
  const username = userData && userData.username ? userData.username : ""; //username for form submitting
  const {darkMode} = theme;
  const [mode, setMode] = useState("");

  //state for controlling all inputs
  const [inputState, setInputState] = useState({
    title: "",
    details: "",
    description: "",
    img: "",
    imgPrev: "",
  });

  const { title, details, description, img, imgPrev } = inputState;

  const handleInputState = (e) => {
    setPopUpActive(false);
    //for text _proto_ based inputs
    if (e.target.name !== "img")
      setInputState({
        ...inputState,
        [e.target.name]: e.target.value,
      });
    //for file _proto_ inputs
    else if (e.target.name === "img") {
      setInputState({
        ...inputState,
        img: e.target.files[0],
        imgPrev: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  //Custom hook for fetching data with loading state 
  // eslint-disable-next-line
  const [request, data, success, fetchError] = useFetchP3D({cleanUp: false});

  
  const uploadProduct = (e) => {
    e.preventDefault();//Stops form submit reload

    const formData = new FormData();
  //FormData is special type of deserialized Data which is encoded in {"multipart/form-data"} 
    formData.append("userId", userId);
    formData.append("username", username);
    formData.append("title", title);
    formData.append("details", details);
    formData.append("description", description);
    formData.append("productImg", img);

    /**
     * checking for =>
     * Authorization, 
     * img-size, 
     * file-type (image/jpeg && image/png) 
      */
    if (
      loggedIn &&
      img.size <= 1024 * 1024 * 2 &&
      (img.type === "image/jpeg" || img.type === "image/png")
    ) {
      setPopUpActive(false)
      // request from useFetchP3D hook
      request("/api/product", {
      method: "POST",
      body: formData,
      useFormData: true
    }).then(()=>{
      if (success && !fetchError) {
        setError(false);//error ([error, setError]=useState())
        setPopUpActive(true)
      }
      else if (fetchError && !success) {
        setError(true);
        setFailContent("Can't upload product!");
      }
    })
    } else if (!loggedIn) {
      setError(true);
      setPopUpActive(true)
      setFailContent("Login First!");
    } else if (img.size > 1024 * 1024 * 2) {
      setError(true);
      setPopUpActive(true)
      setFailContent("Image too large at least 2mb");
    } else if (img.type !== "image/jpeg" || img.type !== "image/png") {
      setError(true);
      setPopUpActive(true)
      setFailContent("Only Images (jpg/jpeg/png) is allowed");
    }
  };

  useEffect(()=>{
    /**
     * after { success || !error } setting the inputState to default
     * resetting the {popUpActive && error && imageState} 
     */
    if (success && !fetchError) {
      setInputState({
        ...inputState,
        title: "",
        details: "",
        description: "",
        imgPrev: "",
      });
      setPopUpActive(true)
      setError(false);
      fileInput.current.value = "";
    }
    if(darkMode)setMode("dark")
    else if(!darkMode)setMode("")
    // eslint-disable-next-line
  }, [success, fetchError, darkMode])

  return (
    <>
      {loggedIn && (
        <div className="vertical-center-strict width-full top-30">
          <h1 style={darkMode?{color: "white"}:{color: "inherit"}} className="text-align-center">Upload your Product</h1>
          {/* form container */}
          <form
            className="vertical-center container-div semi-div display-flex flex-col"
            onSubmit={(e) => uploadProduct(e)}
          >
            {/* container for input({type="text"||type(_proto_)=="text"}) */}
            <div className="display-flex">
              {/* {name="title"} */}
              <input
                data-shade={mode}
                className="input-custom tiny-margin-bottom"
                type="text"
                placeholder="Product Title"
                name="title"
                onChange={handleInputState}
                value={title}
                required
                />
                {/* {name="details"} */}
              <input
                data-shade={mode}
                className="input-custom tiny-margin-bottom tiny-margin-left"
                type="text"
                placeholder="Product Details"
                name="details"
                onChange={handleInputState}
                value={details}
                required
                />
            </div>
            {/* {name="description"} */}
            <textarea
              data-shade={mode}
              className="textarea-custom"
              placeholder="Optional, e.g. My Product is the best"
              style={{ height: "10vh" }}
              onChange={handleInputState}
              value={description}
              name="description"
              ></textarea>
            <div className="display-flex flex-col tiny-margin">
              {/* {<img/>} for previewing the files*/}
              {/* eslint-disable-next-line */}
              <img
                src={imgPrev}
                className="img-xl md-margin-bottom"
                alt="Product Image"
                />
                {/* {name="file"} */}
              <input
                data-shade={mode}
                type="file"
                name="img"
                className="input-custom tiny-margin-bottom hover-filter"
                onChange={handleInputState}
                id="image"
                accept="image"
                ref={fileInput}
                required
              />
              {/* Submit button */}
              <input
                className="input-custom align-self-start"
                type="submit"
                value="Upload"
              />
            </div>
          </form>{/* End of form */}
        </div>
      )}
      {/* Completion Pop Up component */}
      <CompletionPopUp
        mode={mode}
        success={success}
        fail={error}
        successContent="Upload Successful"
        failContent={failContent}
        active={popUpActive}
        onClick={()=>setPopUpActive(false)}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  userDataState: state.userDataState,
  theme: state.theme
});

export default connect(mapStateToProps)(Upload);
