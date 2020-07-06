import React, { useState, useRef, useEffect, memo } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./customer.style.css/Cart.css";
import { CSSTransition } from "react-transition-group";
import {
  cartAddOrRemove,
  clearCart,
  markAllRead,
  getCart
} from "../../Features/actions/cartActions";
import useOnClickOutSide from "../../Hooks/useOnClickOutSide";


const Cart = memo(({
  theme,
  cartState,
  cartAddOrRemove,
  clearCart,
  markAllRead,
  getCart
}) => {
  const cartRef = useRef();
  const { products, notification, loading, error, firstTime } = cartState;
  const [open, setOpen] = useState(false);
  const {darkMode} = theme
  const [mode, setMode] = useState("")

  useOnClickOutSide(["mousedown", "scroll", "touchstart"], cartRef, ()=>setOpen(false))

  useEffect(()=>{
    if(darkMode)setMode("dark")
    else if(!darkMode)setMode("")
    if(products.length===0|| !firstTime){
      getCart()
    }
  }, [darkMode])

  const toggleCart = (e) => {
    setOpen(!open);
  };

  return (
    <section>
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
        <div
          data-mode={mode}
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

          <h6>Total: {products?.length}</h6>


          <div className="product-skeleton">
            {products.length === 0 &&
              "You haven't yet added anything to cart 😊. Try adding something right now!"}
            {products?.map((product, index) => (
              <CartProduct
                key={(index % Math.random()) / Date.now()}
                title={product.title}
                imgSrc={product.imgSrc}
                add={()=>cartAddOrRemove({type: "add", productId: product._id})}
                remove={() => cartAddOrRemove({type: "remove", productId: product._id})}
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
})

const mapStateToProps = (state) => ({
  cartState: state.cartState,
  theme: state.theme
});

export default connect(mapStateToProps, {getCart, cartAddOrRemove ,clearCart, markAllRead })(Cart);

const CartProduct = (props) => {
  return (
    <div className="product-skeleton display-flex tiny-padding-bottom tiny-padding-top tiny-margin-left border-black border-bottom">
      <div className="display-flex align-items-center tiny-margin-right">
        <img
          className="img-sm border-circle hover-filter"
          src={props.imgSrc}
          alt={props.title}
        />
        <h5 className="xs-margin-left">{props.title}</h5>
      </div>

      <div className="controller-container tiny-margin-left display-flex align-items-center">
        {/* <button onClick={props.add} className="hover-filter active-scale">
          +
        </button> */}
        <span className="tiny-padding display-flex align-items-center border-rounded">
          <FontAwesomeIcon icon={["fas", "shopping-cart"]} />
          {props.quantity} 
        </span>
        {/* <button onClick={props.remove} className="hover-filter active-scale">
          -
        </button> */}
      </div>
    </div>
  );
};
