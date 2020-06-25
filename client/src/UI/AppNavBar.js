import React, { useState, useEffect, useRef } from "react";
import {connect} from "react-redux"
import "../libs/Tiny.utility.css";
import "./css/AppNavBar.css";
import Dropdown from "../components/Layout/Dropdown";
import { NavLink, Link } from "react-router-dom";
import { queryProduct } from "../Features/actions/productActions"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import library from "../fontawesome"
import Cart from "../components/Customer/Cart";
import MultiDMenu from "./MultiDMenu";
import useOnClickOutSide from "../Hooks/useOnClickOutSide";


function AppNavBar({userDataState, queryProduct}) {
  const {loggedIn} = userDataState;

  return (
    <div className="position-sticky top-0 z-index-5 width-full">
      <NavBar>
        <NavBrand>
          <h2 style={{ color: "white" }}>facebook2</h2>
        </NavBrand>

        <div className="display-inline-block float-right lg-margin-right">
          <ul className="display-flex  list-style-none">
            <NavItemSearch queryProduct={queryProduct} placeholder="Search"></NavItemSearch>
            <NavLink activeClassName="link" to="/" exact>
              <NavItem content="Home" />
            </NavLink>

            {loggedIn&&<NavLink activeClassName="link" to="/upload">
              <NavItem content="Upload" />
            </NavLink>}

            <NavLink exact to="/api">
              <NavItem content="Api" />
            </NavLink>
            <NavLink to="*">
              <NavItem content="Documentation" />
            </NavLink>

            {!loggedIn&&(<div className="display-flex">
            <NavLink to="/login">
              <NavItem content="Login" />
            </NavLink>
            <NavLink to="/signup">
              <NavItem content="SignUp" />
            </NavLink>
            </div>)}
            {loggedIn&&
            (
              <div className="display-flex align-self-center">
                <NavItem>
                <Cart/>
                </NavItem>
                <NavItem>
                  <MultiDMenu/>
                </NavItem>
            </div>
            )}
          </ul>
        </div>
      </NavBar>
    </div>
  );
}

const NavBar = (props) => {
  return (
    <nav
      style={{ background: "#333", height: "5vh" }}
      className="position-relative"
    >
      {props.children}
    </nav>
  );
};

const NavBrand = (props) => {
  return (
    <div className="display-inline-block float-left lg-margin-left">
      {props.children}
    </div>
  );
};

const NavItem = (props) => {
  return <li {...props} className="tiny-margin">{props.content}{props.children}</li>;
};

const NavItemButton = (props) => {
  return (
    
      <div {...props} onClick={props.onClick} className="border-none align-self-center dropdown-btn">
      <FontAwesomeIcon className={`dropdown-caret ${props.flip=="true"? "dropdown-caret-active": ''}`} color={props.color} icon={['fas', 'caret-up']}/>
      </div>
    
  );
};

const NavItemSearch = (props) => {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (e)=>{
    setSearchValue(e.target.value)
  }

  const queryBtnHandler = ()=>{
    if(searchValue)props.queryProduct(searchValue)
  }

  return (
    <li className="align-self-center lg-margin-left">
      <div>
        <input
          type="search"
          className=" search-bar input-custom"
          placeholder={props.placeholder}
          onChange={handleSearchChange}
          value={searchValue}
        />
        {searchValue ?
        <Link to="/query-found" onClick={queryBtnHandler}><button className="search-btn hover-filter active-filter"><FontAwesomeIcon icon={['fas', 'search']}/></button></Link>
        :<button className="search-btn hover-filter active-filter"><FontAwesomeIcon icon={['fas', 'search']}/></button>}
      </div>
    </li>
  );
};



const mapStateToProps = state=>({
  userDataState: state.userDataState
})

export default connect(mapStateToProps, {queryProduct})(AppNavBar);
