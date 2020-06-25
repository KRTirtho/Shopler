import React from "react"
import ContentLoader from "react-content-loader"

const ProductImageLoader = (props) => (
    <ContentLoader 
    speed={2}
    width={275}
    height={170}
    viewBox="0 0 275 170"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="6" y="0" rx="10" ry="10" width="260" height="170" /> 
    <rect x="189" y="109" rx="0" ry="0" width="8" height="3" />
  </ContentLoader>
)

export default ProductImageLoader