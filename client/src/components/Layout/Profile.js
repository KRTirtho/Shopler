import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import library from '../../fontawesome'
import ProductEdit from './Profile Page/ProductEdit'
import { logOutUser } from '../../Features/actions/userActions'


function Profile({isOpen, userDataState, logOutUser}) {
    const {loggedIn, userData} = userDataState
 
    const logOut = ()=>{
        logOutUser()
        
    }

    return (
        <div style={isOpen?{display:"block"}: {display: "none"}}>
            <Link to={`/${userData.username}/profile`}>
            <ProfileItem>
                {loggedIn && userData.imgSrc? <img className="img-sm border-circle" src={userData.imgSrc}/>: 
                <FontAwesomeIcon icon={["fas", "user-circle"]} size='2x'/>
                }
            <span className="tiny-margin-left">{loggedIn && userData && userData.username? userData.username:''}</span>
            </ProfileItem>
            </Link>
            <ProfileItem><span role="img" aria-labelledby="Description">🌆</span> Events</ProfileItem>
            <ProfileItem><span role="img" aria-labelledby="Description">👍</span> Liked Pages</ProfileItem>
            <ProfileItem><span role="img" aria-labelledby="Description">🔏</span> Privacy & Security</ProfileItem>
            <ProfileItem onClick={logOut}><span className="xs-margin-left font-weight-bold"><FontAwesomeIcon color="#ff6689" icon={["fas", "sign-out-alt"]}/> Log Out</span></ProfileItem>
        </div>
    )
}

function  ProfileItem(props){
    return(
        <div {...props} className="item-d1 hover-filter active-filter display-flex align-items-center">{props.children}</div>
    )
}

const mapStateToProps = state=>({
    userDataState: state.userDataState
})

export default connect(mapStateToProps, {logOutUser})(Profile)


