import React from "react"
import ContentLoader from "react-content-loader"

const ProductLoader = (props) => (
  <ContentLoader 
    speed={1}
    width={295}
    height={550}
    viewBox="0 0 295 550"
    backgroundColor="#f5f5f5"
    foregroundColor="#dfdfdf"
    {...props}
  >
    <rect x="0" y="5" rx="10" ry="10" width="273" height="194" /> 
    <rect x="0" y="250" rx="5" ry="5" width="272" height="17" /> 
    <rect x="33" y="210" rx="5" ry="5" width="199" height="27" /> 
    <rect x="0" y="299" rx="5" ry="5" width="268" height="12" /> 
    <rect x="0" y="318" rx="5" ry="5" width="268" height="12" /> 
    <rect x="0" y="336" rx="5" ry="5" width="268" height="12" /> 
    <rect x="0" y="353" rx="5" ry="5" width="268" height="12" /> 
    <rect x="0" y="372" rx="5" ry="5" width="268" height="12" /> 
    <rect x="0" y="390" rx="5" ry="5" width="268" height="12" />
    <rect x="0" y="408" rx="5" ry="5" width="268" height="12" />
    <rect x="0" y="426" rx="5" ry="5" width="268" height="12" />
    <rect x="0" y="444" rx="5" ry="5" width="268" height="12" />
    <rect x="0" y="462" rx="5" ry="5" width="268" height="12" />
  </ContentLoader>
)

export default ProductLoader