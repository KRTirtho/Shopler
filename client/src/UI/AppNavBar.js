import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../libs/Tiny.utility.css";
import "./css/AppNavBar.css";
import { NavLink, Link } from "react-router-dom";
import { queryProduct } from "../Features/actions/productActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line
import library from "../fontawesome";
import MultiDMenu from "./MultiDMenu";
import Cart from "../components/Customer/Cart";
import PropTypes from "prop-types"
import {getCart} from "../Features/actions/cartActions"

/**
  ** As getCart() redux action creates issue in Cart.jsx as it renders often, that's why calling 
    getCart() from AppNavBar as it is a globally available component  
  */

function AppNavBar() {
  // Redux State
  const {userDataState, theme, cartState} = useSelector(state=>state)
  // Redux Dispatch
  const dispatch = useDispatch();

  const {userData} = userDataState

  const {firstTime, error} = cartState;
  
  const [mode, setMode] = useState("");
  const { darkMode } = theme;
  const { loggedIn } = userDataState;

  useEffect(() => {
    if (darkMode) setMode("dark");
    else if(!darkMode){
      setMode("")
    }
    dispatch(getCart())
  }, [darkMode, dispatch, firstTime]);

  const NavBar = (props) => {
    return (
      <nav
      className="nav-wrapper"
      data-mode={mode}
       >
        {props.children}
      </nav>
    );
  };

  return (
    <NavBar>
        <NavBrand>
          <img className="brand-img" src="/assets/ShoplerIconTransparent.svg" alt="Shopler"/>
          <h2 className="brand-name" style={mode?{color: "#fff"}:{ color: "#333" }}>Shopler</h2>
        </NavBrand>

        <ul className="nav-item-skeleton">
            <NavItemSearch
              mode={mode}
              queryProduct={(value)=>dispatch(queryProduct(value))}
              placeholder="Search"></NavItemSearch>
            <NavLink activeClassName="link" to="/" exact>
              <NavItem title="Home" content={<FontAwesomeIcon size="lg" icon={["fas", "home"]}/>} />
            </NavLink>

            {loggedIn && (
              <NavLink activeClassName="link" to="/upload">
                <NavItem title="Upload Products" content={<FontAwesomeIcon size="lg" icon={["fas", "upload"]}/>} />
              </NavLink>
            )}

            <NavLink activeClassName="link" exact to="/api">
              <NavItem title="Api" content="Api" />
            </NavLink>
            
            {loggedIn &&
            <NavLink activeClassName="link" to={`/${userData._id}/dashboard/profile`}>
                <NavItem title="Dashboard" content={<FontAwesomeIcon size="lg" icon={["fas", "boxes"]}/>}/>
            </NavLink>
            }

            {!loggedIn && (
              <div className="display-flex">
                <NavLink activeClassName="link" to="/login">
                  <NavItem content="Login" />
                </NavLink>
                <NavLink activeClassName="link" to="/signup">
                  <NavItem content="SignUp" />
                </NavLink>
              </div>
            )}
            {loggedIn && (
              <div className="display-flex align-self-center">
                <NavItem>
                  <Cart />
                </NavItem>
                <NavItem>
                  <MultiDMenu />
                </NavItem>
              </div>
            )}
          </ul>
    </NavBar>
  );
}


const NavBrand = (props) => {
  return (
    <div className="navbar-brand-skelton">
    <div>
      {props.children}
    </div>
    </div>
  );
};

const NavItem = (props) => {
  return (
    <li  {...props} className="tiny-margin">
      {props.content}
      {props.children}
    </li>
  );
};

const NavItemSearch = (props) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Props
  const {queryProduct, mode, placeholder} = props;

  const queryBtnHandler = () => {
    if (searchValue) queryProduct(searchValue);
  };

  return (
    <li className="display-flex flex-no-wrap">
        <input
          type="search"
          data-mode={mode}
          className={`search-bar ${
            searchValue.length > 0 && "active"
          }`}
          placeholder={placeholder}
          onChange={handleSearchChange}
          value={searchValue}
        />
        {searchValue ? (
          <Link to="/query-found" onClick={queryBtnHandler}>
            <button
              className="search-btn hover-filter active-filter"
              data-mode={mode}
              >
              <FontAwesomeIcon
                color={mode ? "#fff" : "#000"}
                icon={["fas", "search"]}
              />
            </button>
          </Link>
        ) : (
          <button
            className="search-btn hover-filter active-filter"
            data-mode={mode}
            >
            <FontAwesomeIcon icon={["fas", "search"]} />
          </button>
        )}
    </li>
  );
};
// NavItemSearch propTypes 
NavItemSearch.propTypes = {
  queryProduct: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired

}

export default AppNavBar;
