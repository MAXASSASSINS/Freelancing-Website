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
import { Avatar } from "../Avatar/Avatar";
import { FaRegEnvelope } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { numberToCurrency } from "../../utility/util";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userLoading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const show = () => {
    dispatch(showDimBackground());
  };

  const hide = () => {
    dispatch(hideDimBackground());
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="title-wrapper">
          <h1 className="heading" onClick={() => navigate("/")}>
            FreelanceMe
          </h1>
        </div>

        <form className="form">
          <input
            className="search-input"
            onFocus={show}
            onBlur={hide}
            placeholder="Find services"
            autoComplete="off"
          ></input>
          <AiOutlineSearch className="search-icon" />
        </form>

        <div className="navigation-icons">
          <div className="inbox-icon">
            <Link to="/get/all/messages/for/current/user">
              <FaRegEnvelope />
            </Link>
          </div>
          <div className="my-list-icon">
            <FaRegHeart />
          </div>
          <div className="orders-icon" onClick={() => navigate("/orders")}>
            Orders
          </div>
          {!isAuthenticated ? (
            <Link to="/login">
              <div>
                <BiUserCircle className="profile-icon" />
              </div>
            </Link>
          ) : (
            <div className="profile-icon">
              <Link to={"/user/" + user._id}>
                <Avatar
                  avatarUrl={user.avatar.url}
                  userName={user.name}
                  onlineStatus={true}
                  width="2rem"
                  alt="user profile"
                  onlineStatusWidth={"0.8rem"}
                />
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <div className="header-balance">
              <Link to={"/balance/detail"}>
                <p>
                  ₹
                  {numberToCurrency(user.balance)}
                </p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
