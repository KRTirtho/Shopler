import React, { useState, useEffect } from 'react'
import {useSelector} from "react-redux"
import uuid from "uuid"
import BodyDiv from "../UI/ProductCard"
import ProductLoader from '../Loaders/ProductLoader'

function QueryItem() {
  const {productState, theme} = useSelector(state=>state)
  
  const {query_product,
        query_product_loading,
        query_product_error,
        no_query_product} = productState
  const {darkMode} = theme
  const [mode, setMode] = useState("")

  useEffect(()=>{
    if(darkMode)setMode("dark")
    else if(!darkMode)setMode("")
  }, [darkMode])


    return (
      
        <div className="display-flex width-full flex-wrap justify-content-center position-absolute">
          {query_product.result && !query_product_loading && !query_product_error?query_product.result.map(d=>(
            <BodyDiv
            mode={mode}
            key={uuid.v4()}
            _id = {d._id}
            imgSrc={d.imgSrc}
            title={d.title}
            details={d.details}
            description={d.description}
          />))
          : query_product_loading && !query_product_error && !no_query_product
          ? (<ProductLoader/>)
          : query_product_error && !query_product_loading
          ? <p className="text-center">Error no internet! or server error</p>
          : no_query_product && !query_product_loading && !query_product_error
          ? <p className="text-center">No product found with your provided information. Try searching again with more accurate information</p>
          : ''
          }
        </div>
    )
}
  
export default QueryItem
