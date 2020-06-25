import React, { useState, useEffect } from "react";
import "./css/CompletionPopUp.css";
import { CSSTransition } from "react-transition-group";

/**
 * @props success : boolean, fail : boolean, successContent : string, failContent : string, active : boolean, onClick : eventHandler.function
  */

function CompletionPopUp(props) {
  const { className, success, fail, successContent, failContent, active, onClick } = props;

  return (
    <CSSTransition
      in={active}
      classNames="fade-y"
      timeout={500}
      unmountOnExit>
      <div className={`pop-up-skeleton ${className}`}>
        <div className="text-wrapper">
          <h6 className={success ? "color-success" : fail ? "color-fail" : ""}>
            {success && successContent
              ? successContent
              : fail && failContent
              ? failContent
              : success && !successContent
              ? "Task was done successfully"
              : fail && !failContent
              ? "Task failed to accomplish"
              : "Error (this is an development error)"}
          </h6>
          <button className="hover-filter active-scale" onClick={onClick}>&times;</button>
        </div>
      </div>
    </CSSTransition>
  );
}

export default CompletionPopUp;
