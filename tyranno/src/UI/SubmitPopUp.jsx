import React from "react";
import "./css/SubmitPopUp.css";
import PropTypes from "prop-types"


const SubmitPopUp = (props) => {

  return (
      <div
        className={
          props.success && !props.fail
            ? `pop-up ${props.active} success`
            : !props.success && props.fail
            ? `pop-up ${props.active} fail`
            : "pop-up inactive"
        }
      >
        {props.success && !props.fail
          ? props.successContent
          : !props.success && props.fail
          ? props.failContent
          : ""}
        <button onClick={props.hideControl} className="pop-up-btn hover-filter active-filter">&times;</button>  
      </div>
 );
};

SubmitPopUp.propTypes = {
  success: PropTypes.bool.isRequired,
  fail: PropTypes.bool.isRequired,
  successContent: PropTypes.string.isRequired,
  failContent: PropTypes.string.isRequired,
  active: PropTypes.string.isRequired
}

export default SubmitPopUp;
