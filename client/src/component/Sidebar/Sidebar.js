import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import "./sidebar.css";
import { Avatar } from "../Avatar/Avatar";

export const Sidebar = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => {
    setSidebar(true);
  };

  const hideSidebar = () => {
    setSidebar(false);
  };

  return (
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
            {isAuthenticated ? (
              <Avatar
                avatarUrl={user.avatar.url}
                userName={user.name}
                width="2.5rem"
                alt="user profile"
                onlineStatus={true}
                onlineStatusWidth="0.75rem"
                fontSize="1.125rem"
              />
            ) : (
              <div>
                <i className="fa-regular fa-circle-user sidebar-profile-icon"></i>
              </div>
            )}

            <div className="user-name">{user?.name || "Profile"}</div>
          </section>
          <section className="sidebar-menu">
            <a href="/" className="sidebar-menu-item">
              Home
            </a>
            <a href="/get/all/messages/for/current/user" className="sidebar-menu-item">
              Inbox
            </a>
            <a href="/orders" className="sidebar-menu-item">
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
  );
};
