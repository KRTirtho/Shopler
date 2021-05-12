import React, { useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import { useSelector, useDispatch } from "react-redux";
import "../libs/Tiny.utility.css";
import "../libs/Tiny.Style.css";
import "../libs/Tiny.components.css";
import uuid from "uuid";
import {
  getProducts,
  setPaginating,
} from "../Features/actions/productActions";
import "./scss/Body.scss";
import ProductLoader from "../Loaders/ProductLoader";
import InfiniteScroll from "react-infinite-scroll-component";
// eslint-disable-next-line
import { cartAddOrRemove } from "../Features/actions/cartActions";
import ProductCard from "../UI/ProductCard"

const Body = React.memo(() => {
    // Redux State
    const {productState, theme} = useSelector(state=>state)
    // Redux Dispatch
    const dispatch = useDispatch()

    const { products, loading, error, hasMoreProduct } = productState; //*Redux State
    const [skip, setSkip] = useState(1);
    const [pagination, setPagination] = useState(false);
    const {darkMode} = theme;
    const [mode, setMode] = useState("");
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
        dispatch(cartAddOrRemove({type: 'add', productId: payload}))
     } 

    /**
     * @fetching data through useEffect
     */

    const finalProduct = products;
    useEffect(() => {
      //%Using a ignore flag for React un-intended warning
      let ignore = false;
      const abortController = new AbortController();
      const signal = abortController.signal;

      dispatch(getProducts(skip, signal))
      document.addEventListener("scroll", () => setPagination(true));
      if (pagination===true) dispatch(setPaginating(true))
      //% If the {ignore} is true then the component is un-mounting 
      if(ignore===true)abortController.abort()
      if(darkMode===true){
        setMode("dark")
      }
      if(darkMode===false){
        setMode("")
      }
      return () => {
        //% Setting ignore true while component un-mounts
        ignore=true
        document.removeEventListener("scroll", () => setPagination(true))
        dispatch(setPaginating(false))
      };
      // eslint-disable-next-line
    }, [skip, darkMode]);

    return (
      //?Main container Div for Products page!!!
      <div data-mode={mode} className="margin-adjust main-product-wrapper">
          <InfiniteScroll
            dataLength={products.length}
            next={()=>setSkip(prev=>prev+1)}
            loading={<ProductLoader/>}
            hasMore={hasMoreProduct}
            className="body-infinite-scroll-skeleton"
          >

          { products ? (
            finalProduct.map((d, i) =>{ 
              return (<LazyLoad
              key={uuid.v4()}
              height={400}
              offset={500}
              placeholder={
                <ProductCard mode={mode} noChilds={true} loader={true}>
                    <ProductLoader />
                  </ProductCard>
                }
                >
                {/**
                 * @Observers_Reference_Logic
                 */}
                  <ProductCard
                  mode={mode}
                  key={uuid.v4()}
                  _id={d._id}
                  imgSrc={d.imgSrc}
                  title={d.title}
                  details={d.details}
                  description={d.description}
                  addToCart={()=>concatToCart(d._id)}
                  />
              </LazyLoad>)
            })
          ):
          /**
          * @Loading_State_Placeholder
           */
          loading && !error && !pagination && (!products || products.length===0) ? (
            Loader.map((d, i) => (
              <div key={uuid.v4()}>
                <ProductCard mode={mode} noChilds={true} loader={true} key={i}>
                  <ProductLoader />
                </ProductCard>
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
              <ProductCard mode={mode} noChilds={true} loader={true} key={i}>
                  <ProductLoader />
                </ProductCard>
            ))}
            </>
          )}
        </InfiniteScroll>
        </div>
    );
  }
);

export default Body;
