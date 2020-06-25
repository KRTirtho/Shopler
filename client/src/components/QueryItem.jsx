import React from 'react'
import {connect} from "react-redux"
import uuid from "uuid"
import { BodyDiv } from "./Body"
import ProductLoader from '../Loaders/ProductLoader'

function QueryItem({productState, queryProduct}) {
    const {query_product,
        query_product_loading,
        query_product_error,
        no_query_product} = productState



    return (
      
        <div className="display-flex width-full flex-wrap justify-content-center position-absolute">
          {query_product.result && !query_product_loading && !query_product_error?query_product.result.map(d=>(
            <BodyDiv
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
const mapStateToProps = state=>({
    productState: state.productState
  })
  
export default connect(mapStateToProps, {})(QueryItem)
