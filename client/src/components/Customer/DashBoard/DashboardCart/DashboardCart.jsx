import React, { useEffect } from 'react'
import DashboardCartProducts from './DashboardCartProducts'
import "./dashboardCart.style.css/DashboardCart.css"
import { useSelector, useDispatch } from 'react-redux'
import { Checkout } from './Checkout'
import { getCart } from '../../../../Features/actions/cartActions'

const  DashboardCart = (props)=> {
    /* Redux State of Cart */
    const {products, loading} = useSelector(state=>state.cartState)
    /* Redux Dispatch */
    const dispatch = useDispatch()
    
    const {mode} = props
    

    useEffect(()=>{
        dispatch(getCart())
    }, [])

    return (
        <div className="dashboard-cart-skeleton">
            {/* mapping through products & appending them */}
            {products?.map(product=>{
                const { _id, title, details, description, quantity, imgSrc } = product
             return(
                  <DashboardCartProducts
                    key={Math.random()/Date.now()}
                    _id={_id}
                    title={title}
                    category={details}
                    description={description}
                    productQuantity={quantity}
                    imgSrc={imgSrc}
                    mode={mode}
                  />
                  )
            })}

            {/* Checkout Card */}
            <Checkout mode={mode}/>
        </div>
    )
}

export default DashboardCart
