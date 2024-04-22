import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { setRedirectUrl } from "../utility/util";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, userLoading, error } = useSelector(
    (state) => state.user
  );

  const navigate = useNavigate();


  const location = useLocation();



  if (!isAuthenticated) {
    setRedirectUrl(location.pathname)
    navigate('/login')
  }

  return children;
};

export default ProtectedRoute;
