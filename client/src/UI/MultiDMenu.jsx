import React, { useState, useRef, useEffect } from "react";
import "./css/MultiDMenu.css";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logOutUser } from "../Features/actions/userActions";
import library from "../fontawesome";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import useOnClickOutside from "../Hooks/useOnClickOutSide"

function MultiDMenu({
  userDataState,
  logOutUser,
}) {
  const [activeMenu, setActiveMenu] = useState("main");//menu names
  const [menuHeight, setMenuHeight] = useState(0);//For the menu height
  const { loggedIn, userData } = userDataState;//menu toggler
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    //For dynamic & animated menu height
    setMenuHeight(
      parseFloat(dropdownRef.current?.firstChild.offsetHeight+10)
    );
    if(!loggedIn)setOpen(false)
    // Clean Up
    return ()=>{
      setActiveMenu("main")
    }
  }, [loggedIn, open]);

  /* Special hook as anti-click for MultiDMenu */
  useOnClickOutside(["click", "scroll", "touchstart"] ,dropdownRef, ()=>{
    setOpen(false)
  })

  //Calculating height & setting height for animated height
  function calcHeight(el) {
    const height = el.offsetHeight + 10;
    setMenuHeight(height);
  }

  //Each & Individual item
  const Item = (props) => {
    const { content, leftIcon, rightIcon, goToMenu, className } = props;
    //For multiple onClick handler
    const handler = () => {
      if (props.goToMenu && !props.onClick) {
        setActiveMenu(goToMenu);
      } else if (props.goToMenu && props.onClick) {
        setActiveMenu(goToMenu);
        props.onClick();
      } else if (props.onClick && !props.goToMenu) {
        props.onClick();
      }
    };

    return (
      <div
        onClick={handler}
        className={"item hover-filter active-filter " + className}>
        <span className="left" role="img" aria-label="open">
          {leftIcon && leftIcon}
        </span>
        <button>{content}</button>
        <span className="right" role="img" aria-label="open">
          {rightIcon && rightIcon}
        </span>
      </div>
    );
  };

  // Special type of Item with extra goBack functionality
  const GoBack = (props) => {
    const { content } = props;
    return (
      <div
        {...props}
        onClick={() =>
          props.goto ? setActiveMenu(props.goto) : setActiveMenu("main")
        }
        className="item go-back hover-filter active-filter">
        <span role="img" aria-label="open">
          <FontAwesomeIcon icon={["fas", "arrow-circle-left"]} />
        </span>
        <button>{content || "Go Back"}</button>
      </div>
    );
  };

  //For Opening the dropdown & prevent openState of cartMenu if MultiDMEnu is Open
  const toggleDropdown = () => {
  setOpen(!open)
  }

  return (
    <section className="dropdown-skeleton">{/* Main Container */}
      {/* Toggle button for dropdown */}
      <div
        onClick={toggleDropdown}
        className="border-none align-self-center dropdown-btn">
        <FontAwesomeIcon
          onClick={toggleDropdown}
          className={`dropdown-caret ${open ? "dropdown-caret-active" : ""}`}
          color={open ? "lightskyblue" : "black"}
          icon={["fas", "caret-up"]}
        />
      </div>

      {/* DropDown itself */}
      <CSSTransition in={open} timeout={0} unmountOnExit>
        {/* First Dimension {activeMenu("main")} */}
        <div
          className="main-wrapper"
          style={{ height: menuHeight }}
          ref={dropdownRef}>

          <CSSTransition
            in={activeMenu === "main"}
            classNames="first-menu"
            timeout={500}
            unmountOnExit
            onEnter={calcHeight} /* Calculating height on each Enter of the different dimension */
            >
              {/* Menu itself */}
            <div className="menu-skeleton">
              <Item
                goToMenu="profile"
                leftIcon="😍"
                content="Profile"
                rightIcon={
                  <FontAwesomeIcon
                    icon={["fas", "arrow-left"]}
                    flip="horizontal"
                  />
                }
              />
              <Item
                rightIcon={
                  <FontAwesomeIcon
                    icon={["fas", "arrow-left"]}
                    flip="horizontal"
                  />
                }
                leftIcon="😍"
                content="Settings"
                goToMenu="settings"
              />
              <Item leftIcon="😍" content="FAQ?" />
              <Item leftIcon="😍" content="About" />
            </div>

          </CSSTransition>

          {/* Second dimension {activeMenu("profile")} */}
          <CSSTransition
            in={activeMenu === "profile"}
            classNames="second-menu"
            timeout={500}
            unmountOnExit
            onEnter={calcHeight}>
              {/* Profile menu itself */}
            <div className="menu-skeleton">
                {/* Item for going to the ProfilePage wrapped in a Link */}
              <Link to={`/${userData.username}/profile`}>
                <Item
                  leftIcon={
                    loggedIn && userData.imgSrc ? (
                      <img
                        className="img-sm border-circle"
                        src={userData.imgSrc}
                        alt={userData?.username}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={["fas", "user-circle"]}
                        size="2x"
                      />
                    )
                  }
                  content={
                    <span className="">
                      {loggedIn && userData && userData.username
                        ? userData.username
                        : ""}
                    </span>
                  }
                />
              </Link>

              <Item leftIcon="😍" content="Events" />
              <Item leftIcon="😍" content="Likes" />
              <Item
                onClick={() => logOutUser()}
                leftIcon={
                  <FontAwesomeIcon
                    className="tiny-margin-left"
                    color="#ff6689"
                    icon={["fas", "sign-out-alt"]}
                  />
                }
                content="Log Out"
              />
              <GoBack />
            </div>
          </CSSTransition>

          {/* Second Dimension {activeMenu("settings")} */}
          <CSSTransition
            in={activeMenu === "settings"}
            timeout={500}
            classNames="second-menu"
            unmountOnExit
            onEnter={calcHeight}>
            <div className="menu-skeleton">
              <Item leftIcon={"😎"} content="HTML" />
              <Item leftIcon={"😎"} content="CSS" />
              <Item leftIcon={"😎"} content="JavaScript" />
              <Item leftIcon={"😎"} content="Awesome" />
              <GoBack />
            </div>
          </CSSTransition>

        </div>
      </CSSTransition>
      
    </section>
  );
}

const mapStateToProps = (state) => ({
  userDataState: state.userDataState,
});

export default connect(mapStateToProps, { logOutUser })(MultiDMenu);
