import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fontawesome from "../fontawesome";
import "./css/DropDownMenu.css";
import { CSSTransition } from "react-transition-group";

export const DropDownMenu = (props) => {
  const [open, setOpen] = useState(false);
  const {content, children, selectClass, className} = props;


  return (
    <div className={className+" position-relative"}>
      <button onClick={()=>setOpen(!open)} className={selectClass||"btn"}>
        {content||"Select:"} <FontAwesomeIcon flip="vertical" icon={["fas", "caret-up"]} />
      </button>
      <CSSTransition
        in={open}
        classNames="dropdown-menu"
        timeout={300}
        unmountOnExit>
        <div className="option-skeleton">
            {children}
        </div>
      </CSSTransition>
    </div>
  );
};

export const Option = (props) => {
  return (
    <div className="option-wrapper">
      <button className="option hover-filter active-filter" {...props}>{props.children}</button>
    </div>
  );
};

export const Divider = (props)=>{
    return(
        <div className="dropdown-option-divider"></div>
    )
}


