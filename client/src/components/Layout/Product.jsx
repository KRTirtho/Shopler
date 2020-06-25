import React, { useEffect } from "react";
import { connect } from "react-redux";
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
import library from "../../fontawesome"
import { useRouteMatch } from "react-router-dom";

function Product({
  match,
  getProductById,
  productState,
  clearSingleProductCache,
}) {
  const { params } = useRouteMatch()
  const {
    single_product,
    single_product_loading,
    single_product_error,
  } = productState;
  useEffect(() => {
    getProductById(params.productId);
    return () => clearSingleProductCache();
  }, [params.productId]);

  return (
    <TransitionGroup>
      <CSSTransition key={single_product._id} classNames="fade" timeout={200}>
        <div className="position-absolute main-container display-flex border-rounded vertical-center">
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
                <h2 className="color-darkgray">{single_product.title}</h2>
                <h5 className="color-darkblue">{single_product.details}</h5>
                <div className="width-full md-margin-right vertical-center md-margin-top">
                  <p className="color-midgray">{single_product.description}</p>
                </div>

                <div className="display-flex width-full justify-content-between md-margin-right">

                  <div className="display-flex flex-col">
                    
                    <div className="display-flex flex-col container-div border-rounded">
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
                    <p className="tiny-margin-left text-align-right">
                      on: {new Date(single_product.date).toDateString()}
                    </p>
                  </div>

                  <div>
                    <img src="../assets/CIMG0884.JPG" alt={single_product.username} className="img-md border-circle"/>
                  </div>
                  </div>

                </div>

                  <div className="display-flex lg-margin-top">
                    <button className="btn bg-color-middarkgray color-chillyellow border-radius-top-right-0 border-radius-bottom-right-0">Add to Cart<FontAwesomeIcon className="tiny-margin-left" color="white" icon={["fas", "shopping-cart"]}/></button>
                    <button className="btn bg-color-middarkgray border-radius-top-left-0 border-radius-bottom-left-0 xs-margin-left"><FontAwesomeIcon color="#F13737" icon={["fas", "heart"]}/></button>
                  </div>

              </div>
            </>
          ) : single_product_loading ? (
            <ViewProductLoader />
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

const mapStateToProps = (state) => ({
  productState: state.productState,
});

export default connect(mapStateToProps, {
  getProductById,
  clearSingleProductCache,
})(Product);
