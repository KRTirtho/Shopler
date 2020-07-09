import React, { useState, memo, useEffect } from "react";
import { useSelector } from "react-redux";
import useFetchP3D from "../../../Hooks/useFetchP3D";
import useFetchGet from "../../../Hooks/useFetchGet";
// eslint-disable-next-line
import fontawesome from "../../../fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouteMatch } from "react-router-dom";
import CompletionPopUp from "../../../UI/CompletionPopUp";

const ProductEdit = memo(({ match }) => {
  const {userDataState, theme} = useSelector(state=>state)
  const {darkMode} = theme;
  const [mode, setMode] = useState("")
  const [popUpActive, setPopUpActive] = useState(false);
  const [inputState, setInputState] = useState({
    title: "",
    details: "",
    description: "",
  });
  const [imgSrc, setImgSrc] = useState("");
  const [imgPrev, setImgPrev] = useState("");
  const [isImgEditing, setIsImgEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { params } = useRouteMatch();
  const { userData, loggedIn } = userDataState;
  //* Special type of value skipping in JS ES7
  const [request, , success, submitError] = useFetchP3D();

  const [get, product] = useFetchGet();

  const handleInputChange = (e) => {
    if (isEditing && loggedIn) {
      setInputState({
        ...inputState,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleImgChange = (e) => {
    if (loggedIn && isImgEditing) {
      setImgSrc(e.target.files[0]);
      setImgPrev(URL.createObjectURL(e.target.files[0]));
    }
  };

  const toggleEditMode = (mode) => {
    setIsEditing(mode);
    setInputState({
      ...inputState,
      title: product.title,
      details: product.details,
      description: product.description,
    });
  };

  const submitProductInfo = () => {
    const raw = {
      _id: params.productId,
      userId: userData._id,
      title: inputState.title,
      description: inputState.description,
      details: inputState.details,
    };
    if (loggedIn && isEditing && !isImgEditing) {
      request("/api/product/update", {
        method: "PATCH",
        body: raw,
        headers: { "Content-Type": "application/json" },
      }).then(() => {
        setPopUpActive(true);
        toggleEditMode(false);
      });
    }
  };

  const submitProductImage = () => {
    var formdata = new FormData();
    formdata.append("imgSrc", imgSrc);
    formdata.append("_id", params.productId);
    formdata.append("userId", userData._id);
    formdata.append("prevImgSrc", product.imgSrc);
    if (loggedIn && isImgEditing && !isEditing) {
      request("/api/product/update/image", {
        method: "PATCH",
        body: formdata,
        useFormData: true,
      }).then(() => {
        setPopUpActive(true);
        setIsImgEditing(false);
      });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (loggedIn){
      get(`/api/product/${userData._id}/${params.productId || ""}`, signal);
    }
    if(darkMode)setMode("dark")
    else if(!darkMode)setMode("")
    return () => {
      controller.abort();
    };
  }, [isImgEditing, isEditing, loggedIn, popUpActive, darkMode]);

  return (
    <div className="margin-adjust">
      <CompletionPopUp
        mode={mode}
        success={success}
        fail={submitError}
        successContent="Updated product info"
        failContent="Failed to update product info"
        active={popUpActive}
        onClick={() => setPopUpActive(false)}
      />
      {/* Main Container */}
      <div className="position-absolute product-top-container width-full">
        <div className="display-flex product-header md-margin-left">
          {/*Heading*/}
          <h3>
            Edit {product && product.title ? product.title : "Product"}'s info
          </h3>
          {/* eslint-disable-next-line */}
          <a
            className="xs-margin-left xs-margin-top"
            onClick={(e) => toggleEditMode(true)}>
            <FontAwesomeIcon color="#0360d3" icon={["fas", "pencil-alt"]} />
          </a>
        </div>
        <div className="display-flex justify-content-evenly md-margin-left flex-wrap">
          {" "}
          {/* Elements +Input & +Img & +Buttons */}
          <div className="display-flex flex-col">
            {" "}
            {/* Input Container */}
            <div className="display-flex">
              <label htmlFor="title">Title: </label> {/* Product Title */}
              <input
                type="text"
                name="title"
                id="title"
                onChange={
                  isEditing
                    ? handleInputChange
                    : () => {
                        return;
                      }
                }
                value={
                  isEditing
                    ? inputState.title
                    : !isEditing && product && product.title
                    ? product.title
                    : ""
                }
                disabled={!isEditing}
                className="user-info-input xs-margin-left tiny-margin-bottom"
              />
            </div>
            <div className="display-flex">
              {" "}
              {/* Details */}
              <label htmlFor="details">Category: </label>
              <input
                type="text"
                name="details"
                id="details"
                onChange={
                  isEditing
                    ? handleInputChange
                    : () => {
                        return;
                      }
                }
                value={
                  isEditing
                    ? inputState.details
                    : !isEditing && product && product.details
                    ? product.details
                    : ""
                }
                disabled={!isEditing}
                className="user-info-input xs-margin-left tiny-margin-bottom"
              />
            </div>
            <div className="display-flex width-full">
              {" "}
              {/* Description */}
              <label htmlFor="description">Description: </label>
              <textarea
                type="text"
                name="description"
                id="description"
                onChange={
                  isEditing
                    ? handleInputChange
                    : () => {
                        return;
                      }
                }
                value={
                  isEditing
                    ? inputState.description
                    : !isEditing && product && product.description
                    ? product.description
                    : ""
                }
                disabled={!isEditing}
                className="input-custom xs-margin-left border-black tiny-margin-bottom"
              />
            </div>
          </div>
          {/* Image Container */}
          <div className="display-flex position-relative">
            <label
              onClick={() => setIsImgEditing(true)}
              htmlFor="imgSrc"
              className="user-info-edit-img-btn position-absolute right-0 bottom-10 border-0">
              <FontAwesomeIcon icon={["fas", "pencil-alt"]} color="#0360d3" />
            </label>
            <img
              style={{
                width: 300,
                height: 250,
              }}
              className="border-rounded"
              src={
                isImgEditing && imgPrev
                  ? imgPrev
                  : product && product.imgSrc && product.imgSrc
              }
              alt="User Profile"></img>
          </div>
        </div>
        <div className="display-flex align-items-center md-margin-left">
          {" "}
          {/* Buttons Container */}
          {isEditing || isImgEditing ? (
            <>
              <button
                onClick={
                  isEditing && !isImgEditing
                    ? submitProductInfo
                    : isImgEditing && !isEditing
                    ? submitProductImage
                    : () => {
                        return;
                      }
                }
                className="btn btn-success tiny-margin-right">
                Update
              </button>
              <button
                onClick={
                  isEditing && !isImgEditing
                    ? (e) => toggleEditMode(false)
                    : isImgEditing && !isEditing
                    ? (e) => setIsImgEditing(false)
                    : ""
                }
                className="btn border-success success">
                Cancel
              </button>
            </>
          ) : (
            ""
          )}
          {/* Image File Input */}
          <input
            type="file"
            onChange={handleImgChange}
            name="imgSrc"
            className="display-none"
            id="imgSrc"
          />
        </div>
      </div>
    </div>
  );
});

export default ProductEdit;
