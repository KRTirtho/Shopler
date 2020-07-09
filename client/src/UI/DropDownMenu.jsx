import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line
import fontawesome from "../fontawesome";
import "./css/DropDownMenu.css";
import { CSSTransition } from "react-transition-group";
import { useSelector } from "react-redux";
import useOnClickOutSide from "../Hooks/useOnClickOutSide";
import PropTypes from "prop-types";

export const DropDownMenu = (props) => {
  const [open, setOpen] = useState(false);
  const { content, children, selectClass, className } = props;
  const { darkMode } = useSelector((state) => state.theme);
  const menuRef = useRef();

  useOnClickOutSide(["click", "scroll", "touchstart"], menuRef, () =>
    setOpen(false)
  );

  return (
    <div className={className + " position-relative"}>
      <button
        style={
          darkMode
            ? {
                backgroundColor: "#4c4c4c",
                color: "#ccc",
                border: "none",
              }
            : {
                backgroundColor: "white",
                color: "#242424",
              }
        }
        onClick={() => setOpen(!open)}
        className={selectClass || "btn"}>
        {content || "Select:"}{" "}
        <FontAwesomeIcon flip="vertical" icon={["fas", "caret-up"]} />
      </button>
      <CSSTransition
        in={open}
        classNames="dropdown-menu"
        timeout={300}
        unmountOnExit>
        <div
          ref={menuRef}
          data-mode={darkMode && "dark"}
          className="option-skeleton">
          {children}
        </div>
      </CSSTransition>
    </div>
  );
};

export const Option = (props) => {
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <div data-mode={darkMode ? "dark" : ""} className="option-wrapper">
      <button className="option hover-filter active-filter" {...props}>
        {props.children}
      </button>
    </div>
  );
};

export const Divider = () => {
  return <div className="dropdown-option-divider"></div>;
};

// DropDownMenu Props
DropDownMenu.propTypes = {
  content: PropTypes.string.isRequired,
  selectClass: PropTypes.string,
  className: PropTypes.string,
};
