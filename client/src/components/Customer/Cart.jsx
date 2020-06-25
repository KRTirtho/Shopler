import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./customer.style.css/Cart.css";
import { CSSTransition } from "react-transition-group";
import {
  addToCart,
  removeFromCart,
  clearCart,
  markAllRead,
} from "../../Features/actions/cartActions";
import useOnClickOutSide from "../../Hooks/useOnClickOutSide";


const Cart = ({
  userDataState,
  cartState,
  clearCart,
  addToCart,
  removeFromCart,
  markAllRead
}) => {
  const cartRef = useRef();
  const { userData } = userDataState;
  const { products, count, notification } = cartState;
  const [open, setOpen] = useState(false);

  /*
    ? Place for API Calls
  */

  useOnClickOutSide(["mousedown", "scroll", "touchstart"], cartRef, ()=>setOpen(false))

  const toggleCart = (e) => {
    setOpen(!open);
  };

  return (
    <section>
      <div
        onClick={toggleCart}
        className="user-select-none cursor-pointer hover-filter active-scale position-relative">
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
        <div
          style={
            products.length > 5
              ? { overflowY: "scroll" }
              : { overflowY: "initial" }
          }
          ref={cartRef}
          className="cart-skeleton">
          <h3 className="md-margin-bottom">Your Selected Products</h3>
          {/* mark all read button */}
          {notification>0&&<button onClick={markAllRead} className="btn btn-block btn-secondary tiny-margin-bottom">Mark as all read</button>}

          <h6>Total: {count}</h6>

          <div className="product-skeleton">
            {products.length === 0 &&
              "You haven't yet added anything to cart 😊. Try adding something right now!"}
            {products.map((product, index) => (
              <CartProduct
                key={(index % Math.random()) / Date.now()}
                title={product.title}
                imgSrc={product.imgSrc}
                add={()=>addToCart(product)}
                remove={() => removeFromCart(product._id)}
                quantity={product.quantity?product.quantity : 1}
              />
            ))}
          </div>

          <div className="display-flex position-relative bottom-0 md-margin-bottom tiny-margin-left">
            <button onClick={clearCart} className="btn btn-close border-danger">
              Clear All
            </button>
            <button className="btn btn-chill tiny-margin-left border-dark">
              Check Out
            </button>
          </div>
        </div>
      </CSSTransition>
    </section>
  );
};

const mapStateToProps = (state) => ({
  userDataState: state.userDataState,
  cartState: state.cartState,
});

export default connect(mapStateToProps, { addToCart ,clearCart, removeFromCart, markAllRead })(Cart);

const CartProduct = (props) => {
  return (
    <div className="product-skeleton display-flex tiny-padding-bottom tiny-padding-top tiny-margin-left border-black border-bottom">
      <div className="display-flex align-items-center">
        <img
          className="img-sm border-circle hover-filter"
          src={props.imgSrc}
          alt={props.title}
        />
        <h5 className="xs-margin-left">{props.title}</h5>
      </div>

      <div className="controller-container tiny-margin-left display-flex align-items-center">
        <button onClick={props.add} className="hover-filter active-scale">
          +{/* Add to cart quantity */}
        </button>
        <span className="tiny-padding">
          {props.quantity} {/* number of quantity */}
          <FontAwesomeIcon icon={["fas", "shopping-cart"]} />
        </span>
        <button onClick={props.remove} className="hover-filter active-scale">
          -{/* Remove from cart quantity */}
        </button>
      </div>
    </div>
  );
};
