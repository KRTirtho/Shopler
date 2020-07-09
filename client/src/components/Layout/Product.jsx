import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../../libs/Tiny.utility.css";
import "../../libs/Tiny.Style.css";
import "../../libs/Tiny.components.css";
import {
  getProductById,
  clearSingleProductCache,
} from "../../Features/actions/productActions";
import "./css/Product.css";
import ViewProductLoader from "../../Loaders/ViewProductLoader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
// eslint-disable-next-line
import library from "../../fontawesome"
import { useRouteMatch } from "react-router-dom";
import { cartAddOrRemove } from "../../Features/actions/cartActions"
import useAffection from "../../Hooks/useAffection";

const  Product = ()=>{
  // Redux State
  const {userDataState, productState, theme} = useSelector(state=>state)
  // redux Dispatch
  const dispatch = useDispatch();

  
  // Dark mode
  const {darkMode} = theme

  const { params } = useRouteMatch()

  
  const {
    single_product,
    single_product_loading,
    single_product_error} = productState;

  const {userData} = userDataState;

  const [affectionate, setAffectionate] = useState(false)


  const [affection, controlAffection] = useAffection()

  useEffect(() => {
    dispatch(getProductById(params.productId))
    const found = ()=>userData.review?.map((review) => {
      if (review.productId === params?.productId) {
        setAffectionate(true);
      }
    });
    found()
    if(affection){
      setAffectionate(true)
    }
    else if(affection===false){
      setAffectionate(false)
    }
    return () => dispatch(clearSingleProductCache())
    // eslint-disable-next-line
  }, [affectionate, affection, params.productId, userData.review]);
  
  return (
    <TransitionGroup>
       <CSSTransition classNames="fade-product" timeout={5000}>
        <div className="position-absolute width-full display-flex border-rounded vertical-center margin-adjust">
          {!single_product_loading && !single_product_error ? (
            <>
              <div className="img-container">
                <img
                  src={
                    single_product && single_product.imgSrc
                      ? single_product.imgSrc
                      : ""
                  }
                  alt={single_product.title}
                  className="width-full height-full border-rounded"
                />
              </div>
              <div className="text-container">
                <h2 className={darkMode?"color-white":"color-darkgray"}>{single_product.title}</h2>
                <h5 className="color-darkblue">{single_product.details}</h5>
                <div className="width-full md-margin-right vertical-center md-margin-top">
                  <p className={darkMode?"color-dimwhite":"color-midgray"}>{single_product.description}</p>
                </div>

                <div className="display-flex width-full justify-content-between md-margin-right">

                  <div className="display-flex flex-col">
                    
                    <div data-shade={darkMode&&"dark"} className="display-flex flex-col container-div border-rounded">
                      <p><span role="img" aria-label="Emojis">🌟🌟🌟🌟⭐</span><span className="tiny-margin-left font-weight-bold color-midyellow">Reviews</span></p>
                      <b className="color-darkorange text-align-center">79% Good | 21% Bad</b>
                    </div>
                    <div className="display-flex justify-content-center">
                      <button className="btn btn-chill color-darkblue md-margin-top font-weight-bold">Give a Review</button>
                    </div>
                  </div>

                  <div className="display-flex align-items-center">

                  <div className="display-flex flex-col xs-margin-right">
                    <h5 className="text-decoration-underline color-darkblue text-align-right">Uploaded by {single_product.username}
                    </h5>
                    <p style={darkMode?{color:"#c3c3c3"}:{color:"black"}} className="tiny-margin-left text-align-right">
                      on: {new Date(single_product.date).toDateString()}
                    </p>
                  </div>

                  <div>
                    {/* Because of no real world user I gave it the user img */}
                    <img src={single_product?.imgSrc} alt={single_product.username} className="img-md border-circle"/>
                  </div>
                  </div>

                </div>

                  <div className="display-flex lg-margin-top">
                    <button onClick={()=>dispatch(cartAddOrRemove({type: "add", productId: single_product._id}))} className="btn bg-color-middarkgray color-chillyellow border-radius-top-right-0 border-radius-bottom-right-0">Add to Cart<FontAwesomeIcon className="tiny-margin-left" color="white" icon={["fas", "shopping-cart"]}/></button>
                    <button onClick={()=>{
                      if(!affectionate){
                        controlAffection({providerId: userData._id, productId: single_product._id, type: "add"})
                      }
                      else if(affectionate){
                        controlAffection({providerId: userData._id,  productId: single_product._id, type: "remove"})
                      }
                      }} className="btn bg-color-middarkgray border-radius-top-left-0 border-radius-bottom-left-0 xs-margin-left"><FontAwesomeIcon color={affectionate?"#F13737": "#554"} icon={["fas", "heart"]}/></button>
                  </div>

              </div>
            </>
          ) : single_product_loading && !single_product_error  ? (
            <div><ViewProductLoader/></div>
          ) : single_product_error ? (
            <div>May be no internet connection or product is deleted!</div>
          ) : (
            ""
          )}
        </div>
       </CSSTransition>
     </TransitionGroup>
  );
}

export default Product
