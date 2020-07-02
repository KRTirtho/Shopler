import React, { useState, useRef, useEffect } from "react";
import "./css/MultiDMenu.css";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logOutUser } from "../Features/actions/userActions";
// eslint-disable-next-line
import library from "../fontawesome";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import useOnClickOutside from "../Hooks/useOnClickOutSide";
import { setDarkMode } from "../Features/actions/themeActions";

function MultiDMenu({ userDataState, logOutUser, theme, setDarkMode }) {
  const [activeMenu, setActiveMenu] = useState("main"); //menu names
  const [menuHeight, setMenuHeight] = useState(0); //For the menu height
  const { loggedIn, userData } = userDataState; //menu toggler
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
  const {darkMode} = theme;
  const [mode, setMode] = useState("")
  
  useEffect(() => {
    //For dynamic & animated menu height
    setMenuHeight(
      parseFloat(
        dropdownRef.current && dropdownRef.current.firstChild.offsetHeight
          ? dropdownRef.current.firstChild.offsetHeight + 10
          : 0
      )
    );
    if(darkMode){
      setMode("dark")
    }
    else if(!darkMode){
      setMode("")
    }
    if (!loggedIn) setOpen(false);
    // Clean Up
    return () => {
      setActiveMenu("main");
    };
  }, [loggedIn, open, darkMode]);


  /* Special hook as anti-click for MultiDMenu */
  useOnClickOutside(["mousedown", "scroll", "touchstart"], dropdownRef, () => {
    setOpen(false);
  })

  //Calculating height & setting height for animated height
  function calcHeight(el) {
    const height = el.offsetHeight + 10;
    setMenuHeight(height);
  }

  const handleDarkModeToggle = (e) => {
    setDarkMode(!darkMode);
    };

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
        data-mode={mode}
        className={"item hover-filter active-filter " + className}>
        <span data-mode={mode} className="left" role="img" aria-label="open">
          {leftIcon && leftIcon}
        </span>
        <button data-mode={mode} >{content}</button>
        <span data-mode={mode} className="right" role="img" aria-label="open">
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
        data-mode={mode}
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
    setOpen(!open);
  };

  return (
    <section className="dropdown-skeleton">
      {/* Main Container */}
      {/* Toggle button for dropdown */}
      <div
        onClick={toggleDropdown}
        data-mode={mode}
        className={" border-none align-self-center dropdown-btn "}>
        <FontAwesomeIcon
          onClick={toggleDropdown}
          color={open ? "lightskyblue" : "black"}
          data-mode={mode}
          className={`dropdown-caret ${open ? "dropdown-caret-active" : ""}`}
          icon={["fas", "caret-up"]}
        />
      </div>

      {/* DropDown itself */}
      <CSSTransition in={open} timeout={0} unmountOnExit>
        {/* First Dimension {activeMenu("main")} */}
        <div
          data-mode={mode}
          className="main-wrapper"
          style={{ height: menuHeight }}
          ref={dropdownRef}>
          <CSSTransition
            in={activeMenu === "main"}
            classNames="first-menu"
            timeout={500}
            unmountOnExit
            onEnter={
              calcHeight
            } /* Calculating height on each Enter of the different dimension */
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
              <label htmlFor="switch" className="width-full no-margin">
              <Item
                leftIcon={darkMode ? "🌙" : "☀"}
                className="position-relative"
                content={
                  <label>
                    <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                    <input
                      type="checkbox"
                      id="switch"
                      onChange={handleDarkModeToggle}
                      checked={darkMode}
                      className="input-switch position-absolute right-10"
                    />
                  </label>
                }
              />
              </label>
              <Item
                rightIcon={
                  <FontAwesomeIcon
                    icon={["fas", "arrow-left"]}
                    flip="horizontal"
                  />
                }
                leftIcon={<FontAwesomeIcon icon={["fas", "wrench"]}/>}
                content="Settings"
                goToMenu="settings"
              />
              <Item leftIcon={<FontAwesomeIcon size={"xs"} className="xs-margin-left tiny-margin-right" icon={["fas", "question"]}/>} content="FAQ?" />
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
                        className="xs-margin-left tiny-margin-right"
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
  theme: state.theme
});

export default connect(mapStateToProps, { logOutUser, setDarkMode })(MultiDMenu);
