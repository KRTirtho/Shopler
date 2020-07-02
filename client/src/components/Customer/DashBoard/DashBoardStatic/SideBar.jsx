import React, { useState } from "react";
import "./dashboard.static.style.css/SideBar.css";
import { Link, useRouteMatch } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fontawesome from "../../../../fontawesome";

/**
 *! @Caution Here I'm using the same CSSTransition Classnames of <MultiDMenu/> for less code timesaving....
 */

function SideBar() {
  //Active Menu State
  const [activeMenu, setActiveMenu] = useState("Main");

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
    <div className="sidebar-skeleton">
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
              color="black"
              className="tiny-margin-right"
              icon={["fas", "user"]}
            />
            Profile
          </RouteLink>
          <RouteLink to={`${url}/cart`}>
            <FontAwesomeIcon
              color="black"
              className="tiny-margin-right"
              icon={["fas", "shopping-cart"]}
            />
            Shopping Cart
          </RouteLink>
          <MenuLink to="History">
            <FontAwesomeIcon
              color="black"
              className="tiny-margin-right"
              icon={["fas", "history"]}
            />
            History
            <span className="menu-link-right tiny-margin-right">
              <FontAwesomeIcon color="black" icon={["fas", "angle-right"]} />
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
              color="black"
              className="tiny-margin-right"
              icon={["fas", "comment"]}
            />
            Commented
          </RouteLink>
          <RouteLink to={`${url}/affection`}>
            <FontAwesomeIcon
              color="black"
              className="tiny-margin-right"
              icon={["fas", "heart"]}
            />
            Affectionate
          </RouteLink>
          <RouteLink to={`${url}/checkout`}>
            <FontAwesomeIcon
              color="black"
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
