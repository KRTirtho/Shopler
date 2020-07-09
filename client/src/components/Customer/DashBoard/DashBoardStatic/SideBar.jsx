import React, { useState } from "react";
import "./dashboard.static.style.css/SideBar.css";
import { Link, useRouteMatch } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fontawesome from "../../../../fontawesome";
import PropTypes from "prop-types"
/**
 *! @Caution Here I'm using the same CSSTransition Classnames of <MultiDMenu/> for less code timesaving....
 */

function SideBar(props) {
  //Active Menu State
  const [activeMenu, setActiveMenu] = useState("Main");

  //Router Url for matching
  const {url} = useRouteMatch();

  const darkMode = props.mode==="dark"? true: false

  const {open, setOpen, refer} = props
  
  //MenuNavigation Component
  const MenuLink = (props) => {
    return (
      <div
        onClick={() => setActiveMenu(props.to)}
        className="route-link hover-filter active-filter">
        {props.children}
      </div>
    );
  };

  //Go Back Button
  const GoBack = (props) => {
    return (
      <div className="route-go-back-skeleton">
        <button
          onClick={() => setActiveMenu("Main")}
          className="go-back-btn hover-filter active-filter">
          <FontAwesomeIcon icon={["fas", "angle-right"]} flip="horizontal" />
        </button>
        <span>{props.children}</span>
      </div>
    );
  };

  return (
    <CSSTransition
      in={open}
      timeout={200}
      unmountOnExit
      classNames="sidebar-collapse"
    >
    <div
     ref={refer}
     data-mode={props.mode} className="sidebar-skeleton">
      {/* Routing Path Component */}
      <div className="route-history-skeleton">
        <FontAwesomeIcon
          className="tiny-margin-right history-slash"
          icon={["fas", "angle-right"]}
        />
        <h5>Main</h5>
          {activeMenu !== "Main" && (
            <>
              <FontAwesomeIcon
                className="tiny-margin-left tiny-margin-right history-slash"
                icon={["fas", "angle-right"]}
              />
              <h5>{activeMenu}</h5>
            </>
          )}
        {
          window.innerWidth<=650 &&
          <button onClick={()=>setOpen(false)} className="sidebar-cross-button">&times;</button>
        }
      </div>

      {/* All the routing Components */}
      {/* First Dimension */}
      <CSSTransition
        in={activeMenu === "Main"}
        classNames="first-menu"
        timeout={300}
        unmountOnExit>
        <div className="route-link-skeleton">
          <RouteLink to={`${url}/profile`}>
            <FontAwesomeIcon
              color={darkMode?"white":"black"}
              className="tiny-margin-right"
              icon={["fas", "user"]}
            />
            Profile
          </RouteLink>
          <RouteLink to={`${url}/cart`}>
            <FontAwesomeIcon
              color={darkMode?"white":"black"}
              className="tiny-margin-right"
              icon={["fas", "shopping-cart"]}
            />
            Shopping Cart
          </RouteLink>
          <MenuLink to="History">
            <FontAwesomeIcon
              color={darkMode?"white":"black"}
              className="tiny-margin-right"
              icon={["fas", "history"]}
            />
            History
            <span className="menu-link-right tiny-margin-right">
              <FontAwesomeIcon color={darkMode?"white":"black"} icon={["fas", "angle-right"]} />
            </span>
          </MenuLink>
        </div>
      </CSSTransition>

      {/* Second Menu */}
      <CSSTransition
        in={activeMenu === "History"}
        classNames="second-menu"
        timeout={300}
        unmountOnExit>
        <div className="route-link-skeleton">
          <GoBack>Back</GoBack>
          <RouteLink to={`${url}/comment`}>
            <FontAwesomeIcon
              color={darkMode?"white":"black"}
              className="tiny-margin-right"
              icon={["fas", "comment"]}
            />
            Commented
          </RouteLink>
          <RouteLink to={`${url}/affection`}>
            <FontAwesomeIcon
              color={darkMode?"white":"black"}
              className="tiny-margin-right"
              icon={["fas", "heart"]}
            />
            Affectionate
          </RouteLink>
          <RouteLink to={`${url}/checkout`}>
            <FontAwesomeIcon
              color={darkMode?"white":"black"}
              className="tiny-margin-right"
              icon={["fas", "vote-yea"]}
            />
            Checked Out
          </RouteLink>
        </div>
      </CSSTransition>
    </div>
    </CSSTransition>
  );
}

const RouteLink = (props) => {
  return (
    <Link className="route-link hover-filter active-filter" to={props.to}>
      <div>{props.children}</div>
    </Link>
  );
};

RouteLink.propTypes = {
  to: PropTypes.string.isRequired
}

export default SideBar;
