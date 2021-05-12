import React, { useState } from "react"
import "./dashboardCart.style.css/DashboardCartProducts.css"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom"
// eslint-disable-next-line
import fontawesome from "../../../../fontawesome"
import { cartAddOrRemove } from "../../../../Features/actions/cartActions"
import { useDispatch } from "react-redux"
import PropTypes from "prop-types";

const DashboardCartProducts = (props)=>{
    const [quantity, setQuantity] = useState('')
    const [editing, setEditing] = useState(false)
    const dispatch = useDispatch();
    const {_id, title, category, description, productQuantity, imgSrc} = props

    const quantityHandler = e=>{
        setEditing(true)
        if(e.target.value>0){

            setQuantity(e.target.value)
            dispatch(cartAddOrRemove({type: "quantity", productId: _id, quantity: quantity}))

        }

        /* Has to call to API */
    }
    
    /* Calling API to DELETE The full Product from CART */
    const removeProduct = ()=>{
        dispatch(cartAddOrRemove({type: "remove", productId: _id}))
    }

    return (
        <section data-mode={props.mode} className="dashboard-cart-product-skelton">
            {/* Img container */}
            <div className="cart-product-img-skeleton">
                <img src={imgSrc} alt={title}/>
            </div>

            {/* Product Info */}
            <div className="cart-product-info-skeleton">
                <Link to={`/products/${_id}`}>
                <h3 title={title}>{title.length > 25 ? title.split("").slice(0, 25).join("")+"...": title}</h3>
                </Link>

                {/* Category Label */}
                <div className="product-category-skelton">
                    <span className="category-label">Category</span>
                    <span>{category}</span>
                </div>
                
                {/* Description Label & Container */}
                <div className="product-description-skeleton">
                    <span className="description-label">Description</span>
                    <p>{description}</p>
                </div>
                
                {/* Price Container */}
                <div className="product-price">
                    <span>Price: </span> <span>{"$20"}</span>
                </div>

                {/* Quantity & Remove  */}

                <Controllers 
                    quantityHandler={quantityHandler}
                    editing={editing}
                    productQuantity={productQuantity}
                    removeProduct={removeProduct}
                    quantity={parseInt(quantity)}
                />
                
            </div>

        </section>
    )
}

const Controllers = (props)=>{
    const {quantityHandler,
        editing,
        productQuantity,
        removeProduct, quantity} = props
    
    return (
        <div className="product-controllers">
            {/* Quantity */}
            <div className="quantity-skeleton">
            <span>Quantity: </span>
            <input type="number" onChange={quantityHandler} value={editing ? quantity: productQuantity}/>
            </div>

            <button onClick={removeProduct} className="hover-filter active-filter">
                Remove
                <FontAwesomeIcon icon={["fas", "trash"]}/>
            </button>
        </div>
    )
}

DashboardCartProducts.propTypes = {
    _id: PropTypes.string.isRequired, 
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.string, //Caution For now Price is optional, later be required 
    productQuantity: PropTypes.number.isRequired, 
    imgSrc: PropTypes.string.isRequired
}

Controllers.propTypes = {
    quantityHandler: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired,
    productQuantity: PropTypes.number.isRequired,
    removeProduct: PropTypes.func.isRequired,
    quantity: PropTypes.number.isRequired,
}

export default DashboardCartProducts;