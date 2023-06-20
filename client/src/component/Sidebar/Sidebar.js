import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import "./sidebar.css";

export const Sidebar = () => {
  const user = useSelector((state) => state.user);

  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => {
    setSidebar(true);
  };

  const hideSidebar = () => {
    setSidebar(false);
  };

  return (
    user && (
      <>
        <div onClick={showSidebar}>
          <i
            className="fa-solid fa-bars hamburger-icon"
            onClick={showSidebar}
          ></i>
        </div>
        <div className="sidebar">
          <div className={"site-sidebar " + (sidebar ? "menu-shown" : null)}>
            <section className="sidebar-title">
              {user.avatar.url ? (
                <img
                  src={user.avatar.url}
                  className="sidebar-profile-pic"
                  alt="user profile"
                ></img>
              ) : (
                <i className="fa-regular fa-circle-user sidebar-profile-icon"></i>
              )}
              <div className="user-name">mohd_shadab_23</div>
            </section>
            <section className="sidebar-menu">
              <a href="/" className="sidebar-menu-item">
                Home
              </a>
              <a href="/" className="sidebar-menu-item">
                Inbox
              </a>
              <a href="/" className="sidebar-menu-item">
                Manage Orders
              </a>
              <a href="/" className="sidebar-menu-item">
                Lists
              </a>
              <a href="/" className="sidebar-menu-item">
                Logout
              </a>
            </section>
          </div>
          <div
            className={"sidebar-overlay " + (sidebar ? "menu-shown" : null)}
            onClick={hideSidebar}
          ></div>
        </div>
      </>
    )
  );
};
