import React, { useState, useEffect } from "react";
import "./dashboard.static.style.css/SideBar.css";
import { Link, useRouteMatch } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fontawesome from "../../../../fontawesome";
import { useSelector } from "react-redux";

/**
 *! @Caution Here I'm using the same CSSTransition Classnames of <MultiDMenu/> for less code timesaving....
 */

function SideBar() {
  //Active Menu State
  const [activeMenu, setActiveMenu] = useState("Main");

    //Redux State
  const {darkMode} = useSelector(state => state.theme)

  //DarkMode state
  const [mode, setMode] = useState("")

  useEffect(()=>{
    if(darkMode)setMode("dark");
    else if(!darkMode)setMode("");
  }, [darkMode])

  //Router Url for matching
  const {url} = useRouteMatch();

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
    <div data-mode={mode} className="sidebar-skeleton">
      {/* Routing Component */}
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
  );
}

const RouteLink = (props) => {
  return (
    <Link className="route-link hover-filter active-filter" to={props.to}>
      <div>{props.children}</div>
    </Link>
  );
};

export default SideBar;
