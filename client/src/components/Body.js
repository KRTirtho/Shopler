import React, { useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "../libs/Tiny.utility.css";
import "../libs/Tiny.Style.css";
import "../libs/Tiny.components.css";
import uuid from "uuid";
import {
  getProducts,
  clearProductCache,
  enablePagination,
} from "../Features/actions/productActions";
import "./css/Body.css";
import ProductLoader from "../Loaders/ProductLoader";
import ProductImageLoader from "../Loaders/ProductImageLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import library from "../fontawesome";
import { addToCart } from "../Features/actions/cartActions";

const Body = React.memo(
  ({
    getProducts,
    productState,
    enablePagination,
    addToCart,
  }) => {
    const { products, loading, error, hasMoreProduct } = productState; //*Redux State
    const [skip, setSkip] = useState(1);
    const [pagination, setPagination] = useState(false);
    const Loader = [
      "Loading.....",
      "Loading.....",
      "Loading.....",
      "Loading.....",
      "Loading.....",
      "Loading.....",
      "Loading.....",
      "Loading.....",
    ];

    /**
     * TODO: Cart Functions for adding to cart
      */
     const concatToCart = (payload)=>{
        addToCart(payload)
     }

    /**
     * @Observers_Infinite_Scroll
     * @fetching data through useEffect
     */

    const finalProduct = products;
    useEffect(() => {
      const abortController = new AbortController();
      const signal = abortController.signal;

      if (!pagination) getProducts(skip, signal);
      window.addEventListener("scroll", () => setPagination(true));
      if (pagination) enablePagination(skip);
      return () => {
        abortController.abort();
      };
    }, [skip]);

    return (
      //?Main container Div for Products page!!!
      <div className="display-flex flex-col align-items-center width-full">
          <InfiniteScroll
            dataLength={products.length}
            next={()=>setSkip(prev=>prev+1)}
            loading={<ProductLoader/>}
            hasMore={hasMoreProduct}
            className="display-flex justify-content-center flex-wrap width-full"
          >

          { products && pagination ? (
            finalProduct.map((d, i) => (
              <LazyLoad
              key={uuid.v4()}
              height={400}
              offset={500}
              placeholder={
                <BodyDiv noChilds={true} loader={true}>
                    <ProductLoader />
                  </BodyDiv>
                }
                >
                {/**
                 * @Observers_Reference_Logic
                 */}
                <BodyDiv
                  key={uuid.v4()}
                  _id={d._id}
                  imgSrc={d.imgSrc}
                  title={d.title}
                  details={d.details}
                  description={d.description}
                  addToCart={()=>concatToCart(d)}
                  />
              </LazyLoad>
            ))
          ) : !loading && !error && !pagination
          ? finalProduct.map((d, i) => (
            <LazyLoad
          key={uuid.v4()}
          height={400}
          offset={500}
          placeholder={
            <BodyDiv noChilds={true} loader={true}>
              <ProductLoader />
            </BodyDiv>
          }
          >
          {/**
           * @Observers_Reference_Logic
          */}
          <BodyDiv
            _id={d._id}
            imgSrc={d.imgSrc}
            title={d.title}
            details={d.details}
            description={d.description}
            addToCart={()=>concatToCart(d)}
            />
        </LazyLoad>
          ))
          :/**
          * @Loading_State_Placeholder
           */
          loading && !error && !pagination && (!products || products.length===0) ? (
            Loader.map((d, i) => (
              <div key={uuid.v4()}>
                <BodyDiv noChilds={true} loader={true} key={i}>
                  <ProductLoader />
                </BodyDiv>
              </div>
            ))
            ) : !loading && !pagination && !error ? (
              /**
               * Error handling
               */ <div className="vertical-center-strict horizontal-center-strict">
              No Internet!
            </div>
          ) : (
            <>
              {Loader.map((d, i) => (
              <BodyDiv noChilds={true} loader={true} key={i}>
                  <ProductLoader />
                </BodyDiv>
            ))}
            </>
          )}
        </InfiniteScroll>
        </div>
    );
  }
);

export const BodyDiv = (props) => {
  return (
    <div
      id={props.id}
      className={
        props.loader
          ? "description-container description-container-loader"
          : "description-container"
      }
    >
      {!props.noChilds && (
        <>
          {props.imgSrc ? (
            <Link to={`/products/${props._id}`} className="product-img-link">
              <img
                title={props.title}
                className="hover-filter product-img"
                src={props.imgSrc}
                alt={props.title}
              />
            </Link>
          ) : (
            <ProductImageLoader />
          )}
          <h4 title={props.title} className="text-align-center">
            {props.title && props.title.length > 17
              ? props.title.slice(0, 17) + "..."
              : props.title}
          </h4>

          <h5 title={props.details}>
            Category:
            <span>
              {props.details && props.details.length > 20
                ? props.details.slice(0, 20) + "..."
                : props.details}
            </span>
          </h5>

          <div>
            <div className="color-midgray text-align-justify font-12">
              Description:
              <p className="font-12 description-text">
                {props.description && props.description.slice(0, 80)}
                <span className="font-12 hover-filter active-filter">
                  {props.description &&
                    props.description.length >= 80 &&
                    "....."}
                </span>
              </p>
            </div>
          </div>
          <div className="description-btn-container display-flex justify-content-end">
            {/* Shopping Cart Button */}
            <button
              title="Add to cart"
              onClick={props.addToCart}
              className="description-btn active-filter hover-filter cart"
            >
              <FontAwesomeIcon
                color="#606060"
                icon={["fas", "shopping-cart"]}
              />
            </button>
            <button
              title="Give affection to the seller"
              className="description-btn active-filter hover-filter heart"
            >
              <FontAwesomeIcon color="#606060" icon={["fas", "heart"]} />
            </button>
            <Link to={`/products/${props._id}`}>
            <button
              title="View the product"
              className="description-btn active-filter hover-filter view"
            >
                <FontAwesomeIcon color="#606060" icon={["fas", "eye"]} />
            </button>
              </Link>
            <button
              title="Share with others"
              className="description-btn active-filter hover-filter share"
            >
              <FontAwesomeIcon color="#606060" icon={["fas", "share"]} />
            </button>
          </div>
        </>
      )}
      {props.children}
    </div>
  );
};

const mapStateToProps = (state) => ({
  productState: state.productState,
  userDataState: state.userDataState,
});
const ReduxState = connect(mapStateToProps, {
  getProducts,
  clearProductCache,
  enablePagination,
  addToCart
})(Body);

export default ReduxState;
