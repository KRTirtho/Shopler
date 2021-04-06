import React, { useState, useRef, useEffect } from "react";
import "./css/MultiDMenu.css";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logOutUser } from "../Features/actions/userActions";
// eslint-disable-next-line
import library from "../fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import useOnClickOutside from "../Hooks/useOnClickOutSide";
import { setDarkMode } from "../Features/actions/themeActions";
import PropTypes from "prop-types"

function MultiDMenu() {
  // Redux State
  const {userDataState, theme} = useSelector(state=>state)
  // Redux Dispatch
  const dispatch = useDispatch()
  
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
    dispatch(setDarkMode(!darkMode))
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

  // Item Props
  Item.propTypes = {
    content: PropTypes.node.isRequired || PropTypes.string.isRequired,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    goToMenu: PropTypes.string,
    className: PropTypes.string

  }

  // Special type of Item with extra goBack functionality
  const GoBack = (props) => {
    const { goto } = props;
    return (
      <div
        data-mode={mode}
        className="item go-back">
          <button className="go-back-btn hover-filter active-filter"
            onClick={() =>
              goto ? setActiveMenu(goto) : setActiveMenu("main")
            }
          >
            <span role="img" aria-label="open">
              <FontAwesomeIcon icon={["fas", "angle-right"]} flip="horizontal" />
            </span>
          </button>
          <h4>{props.menuName}</h4>
      </div>
    );
  };

  // GoBack Props
  GoBack.propTypes = {
    goto: PropTypes.string
  }

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
                goToMenu="Profile"
                leftIcon="😍"
                content="Profile"
                rightIcon={
                  <FontAwesomeIcon
                    icon={["fas", "angle-right"]}
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
                    icon={["fas", "angle-right"]}
                  />
                }
                leftIcon={<FontAwesomeIcon icon={["fas", "wrench"]}/>}
                content="Settings"
                goToMenu="Settings"
              />
              <Item leftIcon={<FontAwesomeIcon size={"xs"} className="xs-margin-left tiny-margin-right" icon={["fas", "question"]}/>} content="FAQ?" />
              <Item leftIcon="😍" content="About" />
            </div>
          </CSSTransition>

          {/* Second dimension {activeMenu("profile")} */}
          <CSSTransition
            in={activeMenu === "Profile"}
            classNames="second-menu"
            timeout={500}
            unmountOnExit
            onEnter={calcHeight}>
            {/* Profile menu itself */}
            <div className="menu-skeleton">
              {/* Item for going to the ProfilePage wrapped in a Link */}
              <GoBack menuName="Profile"/>
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

              <Item leftIcon={<FontAwesomeIcon
                    style={{
                      fontSize: 23
                    }}
                    color="lightblue"
                    icon={["fas", "thumbs-up"]}
                    className="xs-margin-left tiny-margin-right"
                  />} content="Likes" />
              <Item leftIcon="😍" content="Events"/>
              <Item
                onClick={() => dispatch(logOutUser())}
                leftIcon={
                  <FontAwesomeIcon
                    className="tiny-margin-left"
                    color="#ff6689"
                    icon={["fas", "sign-out-alt"]}
                  />
                }
                content="Log Out"
              />
            </div>
          </CSSTransition>

          {/* Second Dimension {activeMenu("settings")} */}
          <CSSTransition
            in={activeMenu === "Settings"}
            timeout={500}
            classNames="second-menu"
            unmountOnExit
            onEnter={calcHeight}>
            <div className="menu-skeleton">
              <GoBack menuName="Settings"/>
              <Item leftIcon={"😎"} content="HTML" />
              <Item leftIcon={"😎"} content="CSS" />
              <Item leftIcon={"😎"} content="JavaScript" />
              <Item leftIcon={"😎"} content="Awesome" />
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
    </section>
  );
}

export default MultiDMenu