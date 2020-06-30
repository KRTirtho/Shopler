import React from 'react'
import {useSelector} from "react-redux"
import { Link } from 'react-router-dom';
import ProductImageLoader from '../Loaders/ProductImageLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./css/ProductCard.css"
import useAffection from '../Hooks/useAffection';

export default React.memo((props) => {
  const {userData} = useSelector(state=>state.userDataState)
  const {mode, _id} = props;

  const [affectionate, postAffectionate] = useAffection(_id)

    return (
      <div
        id={props.id}
        data-mode={mode}
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
                onClick={()=>postAffectionate(userData._id)}
              >
                <FontAwesomeIcon color={affectionate?"red":"#606060"} icon={["fas", "heart"]} />
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
  })