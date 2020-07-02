import React from 'react'
import {useSelector, useDispatch} from"react-redux"
import {BrowserRouter as Router, Switch, Route, useRouteMatch, withRouter} from "react-router-dom"
import SideBar from './DashBoardStatic/SideBar'

function DashBoard() {
    //Router match for Dynamic URL
    const {path} = useRouteMatch()
    console.log(useRouteMatch())

    return (
        // <Router>
        <div className="position-absolute">
            {/* SideBar for all component's navigation */}
            <SideBar/>
            <Switch>
                {/* All the pages */}
                <Route path={`${path}/profile`}>
                    <h2 className="vertical-center-fixed">MMAMAMAMAMAMAMA</h2>
                </Route>
            </Switch>
        </div>
    )
}

export default DashBoard
