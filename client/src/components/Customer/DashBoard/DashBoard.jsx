import React from 'react'
import {useSelector, useDispatch} from"react-redux"
import {BrowserRouter as Router, Switch, Route, useRouteMatch, withRouter} from "react-router-dom"
import SideBar from './DashBoardStatic/SideBar'
import CustomerProfilePage from './CustomerProfilePage'

function DashBoard() {
    //Router match for Dynamic URL
    const {path} = useRouteMatch()

    return (
        // <Router>
        <div className="position-absolute width-full">
            {/* SideBar for all component's navigation */}
            <SideBar/>
            <Switch>
                {/* All the pages */}
                <Route path={`${path}/profile`}>
                    <CustomerProfilePage/>
                </Route>
            </Switch>
        </div>
    )
}

export default DashBoard
