import React from "react"
import ContentLoader from "react-content-loader"
import { useSelector } from "react-redux"

const ViewProductLoader = (props) => {
  const {darkMode} = useSelector(state=>state.theme)

  return(
  <ContentLoader 
    className={props.className}
    speed={1}
    width={1280}
    height={550}
    viewBox="0 0 1280 550"
    backgroundColor={!darkMode?"#f0f0f0": "#666"}
    foregroundColor={!darkMode?"#fcfcfe":"#333"}
    {...props}
  >
    <rect x="10" y="7" rx="10" ry="10" width="570" height="540" /> 
    <rect x={542+250} y="15" rx="5" ry="5" width="313" height="28" /> 
    <rect x={397+250} y="61" rx="5" ry="5" width="583" height="17" /> 
    <rect x={379+250} y="113" rx="5" ry="5" width="215" height="10" /> 
    <rect x={611+250} y="113" rx="5" ry="5" width="241" height="10" /> 
    <rect x={381+250} y="138" rx="5" ry="5" width="248" height="10" /> 
    <rect x={639+250} y="138" rx="5" ry="5" width="248" height="10" /> 
    <rect x={382+250} y="162" rx="5" ry="5" width="342" height="10" /> 
    <rect x={739+250} y="162" rx="5" ry="5" width="248" height="10" /> 
    <rect x={382+250} y="182" rx="5" ry="5" width="248" height="10" /> 
    <rect x={866+250} y="112" rx="5" ry="5" width="138" height="10" /> 
    <rect x={650+250} y="182" rx="5" ry="5" width="138" height="10" /> 
    <rect x={795+250} y="182" rx="5" ry="5" width="215" height="10" /> 
    <rect x={382+250} y="202" rx="5" ry="5" width="215" height="10" /> 
    <rect x={621+250} y="202" rx="5" ry="5" width="241" height="10" /> 
    <rect x={875+250} y="202" rx="5" ry="5" width="125" height="10" />

    <rect x={739+250} y={162+150} rx="5" ry="5" width="248" height="10" /> 
    <rect x={382+250} y={182+150} rx="5" ry="5" width="248" height="10" /> 
    <rect x={866+250} y={112+150} rx="5" ry="5" width="138" height="10" /> 
    <rect x={650+250} y={182+150} rx="5" ry="5" width="138" height="10" /> 
    <rect x={795+250} y={182+150} rx="5" ry="5" width="215" height="10" /> 
    <rect x={382+250} y={202+150} rx="5" ry="5" width="215" height="10" /> 
    <rect x={621+250} y={202+150} rx="5" ry="5" width="241" height="10" /> 
    <rect x={875+250} y={202+150} rx="5" ry="5" width="125" height="10" />
  </ContentLoader>
)}

export default ViewProductLoader