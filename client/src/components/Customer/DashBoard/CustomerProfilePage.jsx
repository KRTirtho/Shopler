import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import "./dashboard.style.css/CustomerProfilePage.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

export const CustomerProfilePage = () => {
        //Image editing state
        const [userImagePrev, setUserImgPrev] = useState("")
        const [userImgEdit, setUserImgEdit] = useState(false)

        //Redux Theme state
        const {darkMode} = useSelector(state=>state.theme)
        const [mode, setMode] = useState("")

        useEffect(()=>{
            if(darkMode)setMode("dark")
            else if(!darkMode)setMode("")
        }, [darkMode])

    return (
        <div>
            <div data-mode={mode} className="customer-profile-skeleton">
            {/* user image div */}
            <div className="customer-image-skeleton">
                {/* User Image when img is available */}
                {/* <img src={userImgEdit && userImagePrev?URL.createObjectURL(userImagePrev):"/assets/CIMG0884.JPGs"} alt=""/> */}
                {/* Placholder image for user image */}
                <FontAwesomeIcon color="#3686FF" className="placeholder-customer-image" icon={["fas", "user-circle"]}/>
                {/* Image Uploading button */}
                <label onClick={e=>setUserImgEdit(true)} className="customer-image-edit-btn hover-filter active-filter">
                    <FontAwesomeIcon icon={["fas", "camera"]}/>
                    <input onChange={e=>setUserImgPrev(e.target.files[0])} accept="image/jpeg" type="file" name="" id=""/>
                </label>
            </div>

            {/* Username and bio div */}

            <div className="customer-intro-skeleton">
                <h4>Username</h4>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia, molestias!</p>
            </div>

            {/* Customer Details  */}
            <div className="customer-details-skeleton">
                {/* Details section */}
                <div className="customer-details">
                    <div className="customer-details-value">
                        <p>Signed in with: <span>Github</span></p>
                        <p>Joined: <span>19 Dec,2020</span></p>
                        <p>email: <span>user.email.com</span></p>
                        <p>Country: <span>B.Baria (Previously Noakhali)</span></p>
                        <p>Region: <span>Unknown</span></p>
                        <p>Gender: <span>Male</span></p>
                        <p>website: <span>iloveb.Baria.noakhali.hateBd</span></p>
                    </div>

                    <div className="customer-details-edit-btn">
                        <Link to="">
                            <button className="hover-filter active-filter">Edit <FontAwesomeIcon icon={["fas", "edit"]}/></button>
                        </Link>
                    </div>
                </div>

                {/* Button Sections */}
                <div className="customer-details-btn">
                    <Link to="/">
                     <button className="hover-filter active-filter">Shop More <FontAwesomeIcon icon={["fas", "cart-plus"]}/></button>
                    </Link>

                    <Link>
                     <button className="hover-filter active-filter tiny-margin-left">Check Out <FontAwesomeIcon icon={["fas", "paper-plane"]}/></button>
                    </Link>
                </div>
            </div>
          </div>
        </div>
    )
}

export default CustomerProfilePage
