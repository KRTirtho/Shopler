import React, { useEffect, useState, useRef } from 'react'
// import {useSelector, useDispatch} from"react-redux"
import {BrowserRouter as Router, Switch, Route, useRouteMatch, withRouter} from "react-router-dom"
import SideBar from './DashBoardStatic/SideBar'
import CustomerProfilePage from './CustomerProfilePage'
import { TransitionGroup, CSSTransition } from "react-transition-group"
import DashboardCart from './DashboardCart/DashboardCart'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fontawesome from '../../../fontawesome'
import useOnClickOutside from "../../../Hooks/useOnClickOutSide"


function DashBoard({location}) {
    //Router match for Dynamic URL
    const {path} = useRouteMatch()

    // For Sidebar Toggling
    const [sidebarToggle, setSidebarToggle] = useState(true)
    const sidebarRef = useRef(null);
    
    const {darkMode} = useSelector(state=>state.theme)
    const [mode, setMode] = useState("")
    

    useEffect(()=>{
        if(darkMode)setMode("dark")
        else if(!darkMode)setMode("")
        if(window.innerWidth<=650){
            setSidebarToggle(false)
        }
        
        const swipeToOpen = e=>{
            if(e.touches[0].screenX>0 && e.touches[0].screenX <=480){
                setSidebarToggle(true)
            }
        }
        
        document.addEventListener("touchmove", swipeToOpen)
        return ()=>{
            document.removeEventListener("touchmove", swipeToOpen)
        }
    }, [darkMode])

    useOnClickOutside(["touchstart"], sidebarRef, e=>{
        setSidebarToggle(false)
    })



    return (
        // <Router>
        <div
         className="position-absolute width-full margin-adjust">
            {/* SideBar for all component's navigation */}
            <SideBar
             open={sidebarToggle}
             refer={sidebarRef}
             setOpen={setSidebarToggle}
             mode={mode}/>

             {window.innerWidth <= 650 &&
                <button className="btn btn-dark position-fixed tiny-margin" onClick={()=>setSidebarToggle(!sidebarToggle)}><FontAwesomeIcon icon={["fas", "hamburger"]}/></button>
             }
            
            <TransitionGroup>
                <CSSTransition key={location.key} classNames="fade" timeout={500}>
                    <Switch location={location}>
                        {/* All the pages */}
                        <Route path={`${path}/profile`}>
                        <CustomerProfilePage mode={mode}/>
                        </Route>
                        <Route path={`${path}/cart`}>
                            <DashboardCart mode={mode}/>
                        </Route>
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        </div>
    )
}

export default withRouter(DashBoard)
