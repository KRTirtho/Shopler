import React from "react"
import ContentLoader from "react-content-loader"
import { useSelector } from "react-redux"

const UserProductLoader = (props) => {
  const {darkMode} = useSelector(state=>state.theme)

  return (
  <ContentLoader 
    speed={2}
    width={350}
    height={90}
    viewBox="0 0 350 90"
    backgroundColor={!darkMode?"#f5f5f5":"#666"}
    foregroundColor={!darkMode?"#dfdfdf": "#333"}
    {...props}
  >
    <circle cx="34" cy="44" r="24" /> 
    <rect x="81" y="23" rx="5" ry="5" width="250" height="15" /> 
    <rect x="93" y="52" rx="5" ry="5" width="221" height="10" />
  </ContentLoader>
)}

export default UserProductLoader