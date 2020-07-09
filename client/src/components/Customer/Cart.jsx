import React, { useState, useRef, useEffect, memo } from "react";
import {useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./customer.style.css/Cart.css";
import { CSSTransition } from "react-transition-group";
import {Link} from "react-router-dom"
import {
  cartAddOrRemove,
  markAllRead,
} from "../../Features/actions/cartActions";
import useOnClickOutSide from "../../Hooks/useOnClickOutSide";
import PropTypes from "prop-types"

const Cart = memo(() => {
  // Redux State
  const {cartState, theme, userDataState} = useSelector(state=>state)
  /* Redux Dispatch */
  const dispatch = useDispatch()

  // Reference for onClickOutside
  const cartRef = useRef();
  // state from redux cartState
  const { products, notification } = cartState;
  const [open, setOpen] = useState(false);
  const {darkMode} = theme
  const [mode, setMode] = useState("")
  const {userData} = userDataState;

  // Custom onClickOutside Event Handler
  useOnClickOutSide(["mousedown", "scroll", "touchstart"], cartRef, ()=>setOpen(false))

  useEffect(()=>{
    if(darkMode)setMode("dark")
    else if(!darkMode)setMode("")
  }, [darkMode])

  // Cart Toggling function
  const toggleCart = (e) => {
    setOpen(!open);
  };

  return (
    <section>
      {/* Cart Toggle Button */}
      <div
        onClick={toggleCart}
        className={"user-select-none cursor-pointer hover-filter active-scale position-relative"}>
        {notification>0 && <span className="notify-badge">{notification}</span>}
        <FontAwesomeIcon
          onClick={toggleCart}
          color="orangered"
          icon={["fas", "shopping-cart"]}
        />
      </div>

      <CSSTransition
        in={open}
        classNames="fade-height"
        timeout={300}
        mountOnEnter
        unmountOnExit>
          {/* Main container for cart */}
        <div
          data-mode={mode}
          style={
            products.length > 5
              ? { overflowY: "scroll" }
              : { overflowY: "initial" }
          }
          // For onClickOutside Event handler
          ref={cartRef}
          className="cart-skeleton">
          <h3 className="md-margin-bottom">Your Selected Products</h3>
          {/* mark all read button */}
          {notification>0&&<button onClick={()=>dispatch(markAllRead())} className="btn btn-block btn-secondary tiny-margin-bottom">Mark as all read</button>}

          <h6>Total: {products?.length}</h6>

          {/* Main products for cart */}
          <div className="product-skeleton">
            {products.length === 0 &&
              "You haven't yet added anything to cart 😊. Try adding something right now!"}
            {products?.map((product, index) => (
              <CartProduct
                key={(index % Math.random()) / Date.now()}
                _id={product._id}
                title={product.title}
                imgSrc={product.imgSrc}
                add={()=>dispatch(cartAddOrRemove({type: "add", productId: product._id}))}
                remove={() => dispatch(cartAddOrRemove({type: "remove", productId: product._id}))}
                quantity={product.quantity?product.quantity : 1}
              />
            ))}
          </div>
              {/* Clear & Dashboard Cart button for */}
          <div className="display-flex position-relative bottom-0 md-margin-bottom tiny-margin-left">
            <button onClick={()=>{
              dispatch(cartAddOrRemove({type: "clear"}))
            }} className="btn btn-close border-danger">
              Clear All
            </button>
              <Link to={`/${userData._id}/dashboard/cart`}>
            <button className="btn btn-chill tiny-margin-left border-dark">
              GO to Cart
            </button>
              </Link>
          </div>
        </div>
      </CSSTransition>
    </section>
  );
})

export default Cart;

// Cart product for products.map(...)
const CartProduct = (props) => {
  const {imgSrc, title, _id, quantity} = props;
  
  return (
    // Main Container
    <div className="product-skeleton display-flex tiny-padding-bottom tiny-padding-top tiny-margin-left border-black border-bottom">
      <div className="display-flex align-items-center tiny-margin-right">
        {/* Product Image */}
        <img
          className="img-sm border-circle hover-filter"
          src={imgSrc}
          alt={title}
        />
        {/* Title */}
        <Link to={`/products/${_id}`}>
        <h5 className="xs-margin-left">{title}</h5>
        </Link>
      </div>
      {/* Quantity */}
      <div className="controller-container tiny-margin-left display-flex align-items-center">
        <span className="tiny-padding display-flex align-items-center border-rounded">
          <FontAwesomeIcon icon={["fas", "shopping-cart"]} />
          {quantity} 
        </span>
      </div>
    </div>
  );
};

// cart Product PropType Declaration
CartProduct.propTypes = {
  imgSrc: PropTypes.string,
  title: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired
}