import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "../libs/Tiny.utility.css";
import "./css/AppNavBar.css";
import { NavLink, Link } from "react-router-dom";
import { queryProduct } from "../Features/actions/productActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line
import library from "../fontawesome";
import Cart from "../components/Customer/Cart";
import MultiDMenu from "./MultiDMenu";

function AppNavBar({ userDataState, queryProduct, theme }) {
  const [mode, setMode] = useState("");
  const { darkMode } = theme;
  const { loggedIn } = userDataState;

  useEffect(() => {
    if (darkMode) setMode("dark");
    else if(!darkMode){
      setMode("")
    }
  }, [darkMode]);

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
      <NavBar>
        <NavBrand>
          <h2 style={mode?{color: "#fff"}:{ color: "#333" }}>Shopler</h2>
        </NavBrand>

        <div className="display-inline-block float-right lg-margin-right">
          <ul className="display-flex  list-style-none">
            <NavItemSearch
              mode={mode}
              queryProduct={queryProduct}
              placeholder="Search"></NavItemSearch>
            <NavLink activeClassName="link" to="/" exact>
              <NavItem content="Home" />
            </NavLink>

            {loggedIn && (
              <NavLink activeClassName="link" to="/upload">
                <NavItem content="Upload" />
              </NavLink>
            )}

            <NavLink exact to="/api">
              <NavItem content="Api" />
            </NavLink>
            <NavLink to="*">
              <NavItem content="Documentation" />
            </NavLink>

            {!loggedIn && (
              <div className="display-flex">
                <NavLink to="/login">
                  <NavItem content="Login" />
                </NavLink>
                <NavLink to="/signup">
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
        </div>
      </NavBar>
    </NavBar>
  );
}


const NavBrand = (props) => {
  return (
    <div className="display-inline-block float-left lg-margin-left">
      {props.children}
    </div>
  );
};

const NavItem = (props) => {
  return (
    <li {...props} className="tiny-margin">
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

  const queryBtnHandler = () => {
    if (searchValue) props.queryProduct(searchValue);
  };

  return (
    <li className="align-self-center lg-margin-left">
      <div>
        <input
          type="search"
          data-mode={props.mode}
          className={`input-custom search-bar ${
            searchValue.length > 0 && "active"
          }`}
          placeholder={props.placeholder}
          onChange={handleSearchChange}
          value={searchValue}
        />
        {searchValue ? (
          <Link to="/query-found" onClick={queryBtnHandler}>
            <button
              className="search-btn hover-filter active-filter"
              data-mode={props.mode}
              >
              <FontAwesomeIcon
                color={props.mode ? "#fff" : "#000"}
                icon={["fas", "search"]}
              />
            </button>
          </Link>
        ) : (
          <button
            className="search-btn hover-filter active-filter"
            data-mode={props.mode}
            >
            <FontAwesomeIcon icon={["fas", "search"]} />
          </button>
        )}
      </div>
    </li>
  );
};

const mapStateToProps = (state) => ({
  userDataState: state.userDataState,
  theme: state.theme
});

export default connect(mapStateToProps, { queryProduct })(AppNavBar);
