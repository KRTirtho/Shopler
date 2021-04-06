import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import "./dashboardCart.style.css/Checkout.css"
import { CSSTransition } from "react-transition-group"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import fontawesome from "../../../../fontawesome"

export const Checkout = (props) => {
    const [activeMenu, setActiveMenu] = useState("main")
    const [menuHeight, setMenuHeight] = useState(0)
    const firstMenuRef = useRef()

    useEffect(()=>{
        setMenuHeight(firstMenuRef.current?.firstChild?.offsetHeight)
    }, [])

    function calcHeight(el) {
        const height = el.offsetHeight;
        setMenuHeight(height);
      }
    
    const GoBack = (props) => {
    return (
      <div className="checkout-go-back-skeleton">
        <button
          onClick={() => setActiveMenu("main")}
          className="checkout-go-back-btn hover-filter active-filter">
          <FontAwesomeIcon icon={["fas", "angle-right"]} flip="horizontal" />
        </button>
        <span>{props.children}</span>
      </div>
    );
  };

    return (
        <div data-mode={props.mode} className="checkout-skeleton"
        
        >
            {/* heading */}
            <h4># Checkout</h4>

            {/* Total Cost */}
            <div className="checkout-total-skeleton">
            <p>Total: {"$66"}</p>
            <span>(TAX included)</span>
            </div>
            
            {/* First Dimension */}
        <div 
        className="ref-for-transition"
            style={
                {
                    height: menuHeight
                }
            }
        ref={firstMenuRef}>
            <CSSTransition
                in={activeMenu==="main"}
                classNames="first-menu"
                timeout={500}
                unmountOnExit
                onEnter={calcHeight}
            >
                <div className="checkout-first-menu">
                    <h5>Choose A Payment Method</h5>
                    {/* Company Icons */}
                    <div className="company-button">
                    <p title="Paypal" onClick={()=>setActiveMenu("paypal")} className="hover-filter active-filter"><FontAwesomeIcon color="#0097FC" icon={["fab", "paypal"]}/></p>
                    <p title="VISA" onClick={()=>setActiveMenu("visa")} className="hover-filter active-filter"><FontAwesomeIcon color="#0065FC" icon={["fab", "cc-visa"]}/></p>
                    <p title="Mastercard" onClick={()=>setActiveMenu("mastercard")} className="hover-filter active-filter"><FontAwesomeIcon color="#fc6500" icon={["fab", "cc-mastercard"]}/></p>
                    </div>
                </div>
            </CSSTransition>

            {/* Second Dimension (Paypal) */}
            <CSSTransition
                in={activeMenu==="paypal"}
                classNames="second-menu"
                timeout={500}
                unmountOnExit
                onEnter={calcHeight}
                >
                <div className="checkout-paypal-skeleton">
                    <GoBack 
                        children="Back"
                        />
                    {/* Header for Paypal */}
                    <div className="payment-header">
                    <FontAwesomeIcon className="tiny-margin-right" color="#0097FC" icon={["fab", "paypal"]}/>
                    <span>Paypal</span>
                    </div>

                    {/* Inputs for Paypal */}
                    <div className="payment-input-skeleton">
                        <input type="text" name="paypal-number" placeholder="Paypal Number +xxxx-xxxx-xxxx-xxxx"/>
                        <input type="number" name="paypal-pin" placeholder="PIN 1234"/>
                        <div>
                        <button className="hover-filter active-filter" type="submit">Check Out <FontAwesomeIcon icon={["fas", "check-circle"]}/></button>
                        </div>
                    </div>
                </div>
            </CSSTransition>

            {/* Second Dimension (VISA) */}
            <CSSTransition
                in={activeMenu==="visa"}
                classNames="second-menu"
                timeout={500}
                unmountOnExit
                onEnter={calcHeight}
                >
                <div className="checkout-visa-skeleton">
                    <GoBack 
                        children="Back"
                        />
                    {/* Header for Paypal */}
                    <div className="payment-header">
                    <FontAwesomeIcon className="tiny-margin-right" color="#0065FC" icon={["fab", "cc-visa"]}/>
                    <span>VISA</span>
                    </div>

                    {/* Inputs for Paypal */}
                    <div className="payment-input-skeleton">
                        <input type="text" name="visa-number" placeholder="Credit Card Number xxxx-xxxx-xxxx-xxxx"/>
                        <input type="number" name="visa-pin" placeholder="PIN 1234"/>
                        <input type="number" name="visa-ccv" placeholder="CCV 123"/>
                        <div>
                        <button className="hover-filter active-filter" type="submit">Check Out <FontAwesomeIcon icon={["fas", "check-circle"]}/></button>
                        </div>
                    </div>
                </div>
            </CSSTransition>

            {/* Second Dimension (MasterCard)*/}
            <CSSTransition
                in={activeMenu==="mastercard"}
                classNames="second-menu"
                timeout={500}
                unmountOnExit
                onEnter={calcHeight}
                >
                <div className="checkout-mastercard-skeleton">
                    <GoBack 
                        children="Back"
                        />
                    {/* Header for Paypal */}
                    <div className="payment-header">
                    <FontAwesomeIcon className="tiny-margin-right" color="#fc6500" icon={["fab", "cc-mastercard"]}/>
                    <span
                        style={{color: "#fc6500"}}
                    >MasterCard</span>
                    </div>

                    {/* Inputs for Paypal */}
                    <div className="payment-input-skeleton">
                        <input type="text" name="mastercard-number" placeholder="Credit Card Number xxxx-xxxx-xxxx-xxxx"/>
                        <input type="number" name="mastercard-pin" placeholder="PIN 1234"/>
                        <input type="number" name="mastercard-ccv" placeholder="CCV 123"/>
                        <div>
                        <button className="hover-filter active-filter" type="submit">Check Out <FontAwesomeIcon icon={["fas", "check-circle"]}/></button>
                        </div>
                    </div>
                </div>
            </CSSTransition>
            
            </div>

            
        </div>
    )
}

Checkout.propTypes = {
    mode: PropTypes.string.isRequired
}

export default (Checkout)
