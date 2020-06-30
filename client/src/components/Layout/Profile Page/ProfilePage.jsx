import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import UserProductLoader from "../../../Loaders/UserProductLoader";
import "./css/ProfilePage.css";
import UserInfo from "./UserInfo";
import useFetchGet from "../../../Hooks/useFetchGet";
import {DropDownMenu, Option, Divider} from "../../../UI/DropDownMenu";

const ProfilePage = React.memo(() => {
  const {userDataState, theme} = useSelector(state=>state)
  const {darkMode} = theme;
  const [sort, setSort] = useState("");
  const { loggedIn, userData } = userDataState;
  const [mode, setMode] = useState("")

  const match = useRouteMatch();


  //! Testing @useFetchGet() custom hook

  const url = `/api/user-products?userId=${
    userData && userData._id ? userData._id : undefined
  }${sort && sort.length !== 0 ? "&sort=" + sort : ""}`;

  const [get, products, loading, error] = useFetchGet();


  useEffect(() => {
    if(loggedIn)get(url)
    if(darkMode)setMode("dark")
    else if(!darkMode)setMode("")
    // eslint-disable-next-line
  }, [loggedIn, url, sort, darkMode]);

  const handleSort = (sortVal) => {
      if (loggedIn) {
        setSort(sortVal)
      }
    }

  const uploadedProduct =
    products && products.length > 0
      ? products.map((product, i) => {
          return (
            <div data-mode={mode} key={i%Date.now()/Math.random()} className="product-container position-relative">
              <Link to={`${match.url}/product/${product._id}`}>
                <div>
                  <img
                    src={product.imgSrc}
                    alt={product.title}
                    className="img-sm tiny-margin border-circle hover-filter"
                  />
                  <div className="display-flex">
                    <h5 className="">{product.title}</h5>
                  </div>
                </div>
                </Link>
                    <p className="position-absolute bottom-0 right-0">
                      Uploaded: {new Date(product.date).toDateString()}
                    </p>
              </div>
          );
        })
      : "";

  const loader = ["loading", "loading", "loading", "loading", "loading"];

  return (
    <>
    <div className="display-flex position-absolute width-full">
      <div data-mode={mode} className="display-flex flex-col align-items-center upload-container">
        <h3 className="text-align-center">Uploaded's</h3>
        <div className="display-flex width-full justify-content-end">

          <DropDownMenu className="md-margin-left width-full" selectClass="btn btn-light" content="Sort">
            <Option onClick={()=>handleSort(-1)}>Recent</Option>
            <Divider/>
            <Option onClick={()=>handleSort(1)}>Oldest</Option>
            <Divider/>
            <Option onClick={()=>handleSort("a-z")}>A-Z</Option>
            <Divider/>
            <Option onClick={()=>handleSort("z-a")}>Z-A</Option>
          </DropDownMenu>

        </div>
        <div className={products.length>8 ? "product-wrapper":""}>
          {loading && !error ? (
            loader.map((d, i) => <UserProductLoader key={i} />)
          ) : !loading && !error ? (
            uploadedProduct
          ) : error && !loading ? (
            <pre>Failed to load content!</pre>
          ) : (
            ""
          )}
        </div>
        {products.length === 0 ||
          (products.Message && (
            // eslint-disable-next-line
            <div>
              You haven't uploaded any product yet 😢{" "}
              <Link to="/upload">Upload now</Link> 😀
            </div>
          ))}
      </div>

      <UserInfo
        mode={mode}
        userId={userData && userData._id ? userData._id : ""}
        loggedIn={loggedIn}
      />

    </div>
    </>
  );
})

export default ProfilePage;