import React from "react"
import ContentLoader from "react-content-loader"

const ViewProductLoader = (props) => (
  <ContentLoader 
    speed={1}
    width={1024}
    height={240}
    viewBox="0 0 1024 240"
    backgroundColor="wheat"
    foregroundColor="#ffc352"
    {...props}
  >
    <rect x="10" y="7" rx="10" ry="10" width="334" height="225" /> 
    <rect x="542" y="15" rx="5" ry="5" width="313" height="28" /> 
    <rect x="397" y="61" rx="5" ry="5" width="583" height="17" /> 
    <rect x="379" y="113" rx="5" ry="5" width="215" height="10" /> 
    <rect x="611" y="113" rx="5" ry="5" width="241" height="10" /> 
    <rect x="381" y="138" rx="5" ry="5" width="248" height="10" /> 
    <rect x="639" y="138" rx="5" ry="5" width="248" height="10" /> 
    <rect x="382" y="162" rx="5" ry="5" width="342" height="10" /> 
    <rect x="739" y="162" rx="5" ry="5" width="248" height="10" /> 
    <rect x="382" y="182" rx="5" ry="5" width="248" height="10" /> 
    <rect x="866" y="112" rx="5" ry="5" width="138" height="10" /> 
    <rect x="650" y="182" rx="5" ry="5" width="138" height="10" /> 
    <rect x="795" y="182" rx="5" ry="5" width="215" height="10" /> 
    <rect x="382" y="202" rx="5" ry="5" width="215" height="10" /> 
    <rect x="621" y="202" rx="5" ry="5" width="241" height="10" /> 
    <rect x="875" y="202" rx="5" ry="5" width="125" height="10" />
  </ContentLoader>
)

export default ViewProductLoader