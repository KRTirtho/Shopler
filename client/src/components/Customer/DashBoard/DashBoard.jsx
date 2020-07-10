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

        /* Swipe track Functions */
        document.addEventListener('touchstart', handleTouchStart, false);        
        document.addEventListener('touchmove', handleTouchMove, false);

        var xDown = null;                                                        
        var yDown = null;

        function getTouches(evt) {
        return evt.touches;
        }                                                     

        function handleTouchStart(evt) {
            const firstTouch = getTouches(evt)[0];                                      
            // Getting the touch start down & setting it toward the client
            xDown = firstTouch.clientX;                                      
            yDown = firstTouch.clientY;                                      
        };                                                

        function handleTouchMove(evt) {
            if ( ! xDown || ! yDown ) {
                return;
            }

            var xUp = evt.touches[0].clientX;                                    
            var yUp = evt.touches[0].clientY;

            var xDiff = xDown - xUp;
            var yDiff = yDown - yUp;

            if ( (Math.abs( xDiff ) > Math.abs( yDiff ) && (xDown > 0 && xDown <100)) ) {/*most significant*/
                if ( xDiff > 0 ) {
                    /* left swipe */ 
                    setSidebarToggle(false)
                } else {
                    /* right swipe */
                    setSidebarToggle(true)
                }                       
            }
            /* reset values */
            xDown = null;
            yDown = null;                                             
        };
        return ()=>{
            document.removeEventListener('touchstart', handleTouchStart, false);        
            document.removeEventListener('touchmove', handleTouchMove, false);
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
