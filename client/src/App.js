import React, { useEffect } from "react";
import "./App.css"
import { connect } from "react-redux";
import "./libs/Tiny.utility.css";
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import Upload from "./Pages/Upload";
import AppNavBar from "./UI/AppNavBar";
import Body from "./components/Body";
import "./libs/bootstrap.css";
import Login from "./components/Authentication/Login";
import SignUp from "./components/Authentication/SignUp";
import Product from "./components/Layout/Product";
import ProfilePage from "./components/Layout/Profile Page/ProfilePage";
import QueryItem from "./components/QueryItem";
import Api from "./Pages/Api";
import {
  setLoggedIn,
  setUserData,
  checkAuthorized,
} from "./Features/actions/userActions";
import ProductEdit from "./components/Layout/Profile Page/ProductEdit";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const App = ({
  setLoggedIn,
  userDataState,
  setUserData,
  productState,
  checkAuthorized,
}) => {
  const { products } = productState;
  const { loggedIn } = userDataState;

  if (productState.isAuthenticated === true) {
    setLoggedIn(true);
    setUserData(products.user);
  }
  useEffect(() => {
    checkAuthorized();
    // eslint-disable-next-line
  }, []);

  return( <>
    <Router>
      <AppNavBar />
      {/**
         * All the component's routing
       * @contains_component [Body, Upload, Api, Login, SignUp, Product, ProfilePage, QueryItem, ProductEdit]
       * @Routes {
        "/": Body,
        "/login": Login,
        "/signup": SignUp,
        "/upload": Upload,
        "/api": Api,
        "/products/:productId": Product,
        "/:userId/profile": ProfilePage,
        "/query-found": QueryItem,
        "/:userId/profile/product/:productId": ProductEdit
      }
    */}
      <Route
        render={({ location }) => (
            <TransitionGroup>
              <CSSTransition key={location.key} classNames="fade" timeout={100}>
                <Switch location={location}>
                  {/* Public Routes */}
                  <Route path="/" exact>
                    <Body />
                  </Route>
                  <Route exact path="/api">
                    <Api />
                  </Route>
                  <Route exact path="/products/:productId">
                    <Product />
                  </Route>
                  <Route exact path="/query-found">
                    <QueryItem />
                  </Route>
                  {/* Only Public && !authorized */}
                  <Route exact path="/login">
                    <Login />
                  </Route>
                  )
                  <Route exact path="/signup">
                    <SignUp />
                  </Route>
                  {/* Only authorized && !public */}
                  {loggedIn && (
                    <Route exact path="/upload">
                      <Upload />
                    </Route>
                  )}
                  {loggedIn && (
                    <Route exact path="/:userId/profile">
                      <ProfilePage />
                    </Route>
                  )}
                  {loggedIn && (
                    <Route path="/:userId/profile/product/:productId">
                      <ProductEdit />
                    </Route>
                  )}
                  <Route path="*">
                    <div className="vertical-center-strict top-20">
                      <h1 className="text-align-center">404</h1>
                      <h3>Page doesn't exist</h3>
                      <p>Please give the correct address!</p>
                    </div>
                  </Route>
                </Switch>
              </CSSTransition>
            </TransitionGroup>
        )}
        />
      {/* End of Parent Route */}
    </Router>
        </>
  )
};

const mapStateToProps = (state) => ({
  productState: state.productState,
  userDataState: state.userDataState,
});

export default connect(mapStateToProps, { 
  setUserData,
  setLoggedIn,
  checkAuthorized,
})(App);
