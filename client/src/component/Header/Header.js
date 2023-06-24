// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import "../../component/common.css";
import "./header.css";
import { useSelector, useDispatch } from "react-redux";
import {
  showDimBackground,
  hideDimBackground,
} from "../../actions/dimBackgroundAction";
import { getUser } from "../../actions/userAction";
import { loggedUser } from "../../actions/userAction";
import { Outlet, Navigate, Link, useNavigate } from "react-router-dom";
import { Fragment } from "react";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  const show = () => {
    dispatch(showDimBackground());
  };

  const hide = () => {
    dispatch(hideDimBackground());
  };

  // useEffect(() => {
  //     if (isAuthenticated) {
  //         setCurrentUser(user);
  //     }
  // }, [user])

  return (
    <header className="header">
      <div className="header-container">
        <div className="title-wrapper">
          <h1 className="heading" onClick={() => navigate('/')}>FreelanceMe</h1>
        </div>

        <form className="form">
          <input
            className="search-input"
            onFocus={show}
            onBlur={hide}
            placeholder="Find services"
            autoComplete="off"
          ></input>
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
        </form>

        <div className="navigation-icons">
          <Link to="/get/all/messages/for/current/user">
            <i className="fa-regular fa-envelope inbox-icon"></i>
          </Link>
          <i className="fa-regular fa-heart my-list-icon"></i>
          <div className="orders-icon">Orders</div>
          {!user && (
            <Link to="/login">
              <div>
                <i className="fa-regular fa-circle-user profile-icon"></i>
              </div>
            </Link>
          )}
          {isAuthenticated && (
            <div>
              {user.avatar.url ? (
                <Link to={"/user/" + user._id}>
                  <img
                    style={{ maxWidth: "2rem" }}
                    src={user.avatar.url}
                    className="profile-pic"
                    alt="user profile"
                  ></img>
                </Link>
              ) : (
                <Link to={"/user/" + user?._id}>
                  <i
                    className={
                      "fa-solid profile-icon " +
                      (user ? "profile-icon-login " : " ") +
                      "fa-" +
                      (user && user.name[0].toLowerCase())
                    }
                  ></i>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
