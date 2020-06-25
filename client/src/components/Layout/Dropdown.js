import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import "../../libs/Tiny.utility.css";
import "../css/Dropdown.css";
import uuid from "uuid";
import { CSSTransition, TransitionGroup } from "react-transition-group";

function Dropdown({ isOpen, onBlur }) {
  const [dummyDataState, setDummyDataState] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const backButtonClick = () => {
    return dummyDataState
      ? setDummyDataState(!dummyDataState)
      : profileOpen
      ? setProfileOpen(!profileOpen)
      : "";
  };

  useEffect(() => {
    if (!isOpen) {
      setProfileOpen(false);
      setDummyDataState(false);
    }
  }, [profileOpen, isOpen, dummyDataState]);

  return (
      <CSSTransition
        in={isOpen}
        classNames="dropdown"
        timeout={300}
        unmountOnExit>
        <div className="dropdown-container user-select-none z-index-4">
          <section>
            {/**first Dimension-----------------------------------------------------------------------*/}
            <div
              style={
                !dummyDataState && !profileOpen
                  ? { display: "block" }
                  : { display: "none" }
              }>
              <div
                className="item-d1 hover-filter active-filter"
                onClick={() => setProfileOpen(!profileOpen)}>
                <span role="img" aria-labelledby="Description">
                  😎
                </span>{" "}
                Profile {">"}
              </div>
              <div
                className="item-d1 hover-filter active-filter"
                onClick={() => setDummyDataState(!dummyDataState)}>
                <span role="img" aria-labelledby="Description">
                  📐
                </span>{" "}
                Settings {">"}
              </div>
              <div className="item-d1 hover-filter active-filter">
                <span role="img" aria-labelledby="Description">
                  😣
                </span>{" "}
                Help ?
              </div>
              <div className="item-d1 hover-filter active-filter">
                <span role="img" aria-labelledby="Description">
                  🆎
                </span>{" "}
                About
              </div>
            </div>
            {/**----------------------------------------------------------------------------------------*/}
            <Profile isOpen={profileOpen} />
            {/**Back Button  */}
            <div
              onClick={backButtonClick}
              className="item-d1 hover-filter active-filter"
              style={
                dummyDataState || profileOpen
                  ? { display: "block" }
                  : { display: "none" }
              }>
              ⬅ Back
            </div>
            {/**----------------*/}
            {/**Settings Menu */}
            <Settings isOpen={dummyDataState} />
            {/**--------------------*/}
          </section>
        </div>
      </CSSTransition>
  );
}

const Settings = ({ isOpen }) => {
  const dummyFetched = [
    ["🤣", "Fix-Yourself"],
    ["🤣", "Fix-Yourself"],
    ["🤣", "Fix-Yourself"],
    ["🤣", "Fix-Yourself"],
    ["🤣", "Fix-Yourself"],
    ["🤣", "Fix-Yourself"],
    ["🤣", "Fix-Yourself"],
    ["🤣", "Fix-Yourself"],
  ];

  return (
    <div style={isOpen ? { display: "block" } : { display: "none" }}>
      {dummyFetched.map((d) => {
        return (
          <div key={uuid.v4()} className="item-d1 hover-filter active-filter">
            <span role="img" aria-label="div">
              {d[0]}
            </span>
            {d[1]}
          </div>
        );
      })}
    </div>
  );
};

export default Dropdown;
