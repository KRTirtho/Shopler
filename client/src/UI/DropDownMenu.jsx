import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line
import fontawesome from "../fontawesome";
import "./css/DropDownMenu.css";
import { CSSTransition } from "react-transition-group";
import { useSelector } from "react-redux"

export const DropDownMenu = (props) => {
  const [open, setOpen] = useState(false);
  const {content, children, selectClass, className} = props;
  const {darkMode} = useSelector(state=>state.theme)


  return (
    <div className={className+" position-relative"}>
      <button style={darkMode?{
        backgroundColor:  "#4c4c4c",
        color: "#ccc",
        border: "none"
      }:{
        backgroundColor: "white",
        color: "#242424"
      }} onClick={()=>setOpen(!open)} className={selectClass||"btn"}>
        {content||"Select:"} <FontAwesomeIcon flip="vertical" icon={["fas", "caret-up"]} />
      </button>
      <CSSTransition
        in={open}
        classNames="dropdown-menu"
        timeout={300}
        unmountOnExit>
        <div data-mode={darkMode&&"dark"} className="option-skeleton">
            {children}
        </div>
      </CSSTransition>
    </div>
  );
};

export const Option = (props) => {
  const {darkMode} = useSelector(state=>state.theme)

  return (
    <div data-mode={darkMode?"dark":""} className="option-wrapper">
      <button className="option hover-filter active-filter" {...props}>{props.children}</button>
    </div>
  );
};

export const Divider = (props)=>{
    return(
        <div className="dropdown-option-divider"></div>
    )
}


