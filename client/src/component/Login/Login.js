import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loggedUser } from "../../actions/userAction";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const { user, userLoading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill all the fields", {});
      return;
    }
    dispatch(loggedUser(loginEmail, loginPassword));
  };

  useEffect(() => {
    // console.log(isAuthenticated);
    // console.log("login is running");
    if (isAuthenticated) {
      navigate(-1);
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="p-8 mt-20 md:mt-40 col-md-4 offset-md-4">
      <div className="text-center">
        <h2 className="text-5xl">Login</h2>
      </div>
      <form className="mt-8 flex flex-col gap-4" onSubmit={handleLoginSubmit}>
        <div className="form-group">
          <label className="mb-2" for="email">
            Email
          </label>
          <input
            onChange={(e) => setLoginEmail(e.target.value)}
            id="email"
            type="email"
            class="form-control"
          />
        </div>
        <div className="form-group">
          <label className="mb-2" for="password">
            Password
          </label>
          <input
            onChange={(e) => setLoginPassword(e.target.value)}
            id="password"
            type="password"
            class="form-control"
          />
        </div>
        <p>
          Don't have an account?{" "}
          <Link
            className="underline text-primary hover:cursor-pointer"
            to={"/signUp"}
          >
            Sign Up
          </Link>
        </p>
        <div className="form-group">
          <button className="btn bg-primary text-white hover:bg-primary_hover hover:cursor-pointer">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
