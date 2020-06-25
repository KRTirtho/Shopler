import React from "react"
import ContentLoader from "react-content-loader"

const UserProductLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={350}
    height={90}
    viewBox="0 0 350 90"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <circle cx="34" cy="44" r="24" /> 
    <rect x="81" y="23" rx="5" ry="5" width="250" height="15" /> 
    <rect x="93" y="52" rx="5" ry="5" width="221" height="10" />
  </ContentLoader>
)

export default UserProductLoader