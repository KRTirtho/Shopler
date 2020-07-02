import React from 'react'
import {useSelector, useDispatch} from"react-redux"
import {BrowserRouter as Router, Switch, Route, useRouteMatch, withRouter} from "react-router-dom"
import SideBar from './DashBoardStatic/SideBar'
import CustomerProfilePage from './CustomerProfilePage'
import { TransitionGroup, CSSTransition } from "react-transition-group"


function DashBoard({location}) {
    //Router match for Dynamic URL
    const {path} = useRouteMatch()

    console.log(location)

    return (
        // <Router>
        <div className="position-absolute width-full">
            {/* SideBar for all component's navigation */}
            <SideBar/>
            
            <TransitionGroup>
                <CSSTransition key={location.key} classNames="fade" timeout={500}>
                    <Switch location={location}>
                        {/* All the pages */}
                        <Route path={`${path}/profile`}>
                        <CustomerProfilePage/>
                        </Route>
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        </div>
    )
}

export default withRouter(DashBoard)
