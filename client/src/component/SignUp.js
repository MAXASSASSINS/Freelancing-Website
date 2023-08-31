import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../actions/userAction";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AiFillQuestionCircle } from "react-icons/ai";

export const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");

  const { user, userLoading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const [errors, setErrors] = useState({
    signUpEmailError: false,
    signUpPasswordError: false,
    signUpUsernameError: false,
  });

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    let error = {
      signUpEmailError: false,
      signUpPasswordError: false,
      signUpUsernameError: false,
    }
    if(!signUpUsername || signUpUsername.length < 4 || signUpUsername.length > 50) {
      error = {...error, signUpUsernameError: true}
    }
    if(!signUpEmail) {
      error = {...error, signUpEmailError: true}
    }
    if(!signUpPassword || signUpPassword.length < 8) {
      error = {...error, signUpPasswordError: true}
    }
    if(error) {
      setErrors(error);
      return;
    }
    dispatch(signUpUser(signUpUsername, signUpEmail, signUpPassword));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(-1);
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="p-8 mt-20 md:mt-[10vh] col-md-4 offset-md-4">
      <div className="text-center">
        <h2 className="text-5xl">Welcome</h2>
      </div>
      <form className="mt-8 flex flex-col gap-4" onSubmit={handleSignUpSubmit}>
        <div className="form-group">
          <label className="mb-2 flex gap-2 items-center" for="email">
            Username
            <span data-tooltip-id="my-tooltip" data-tooltip-content="Username must contain 4 - 50 characters" data-tooltip-place="right">
              <AiFillQuestionCircle className="text-no_focus" />
            </span>
          </label>
          <input
            onChange={(e) => {setSignUpUsername(e.target.value); setErrors({...errors, signUpUsernameError: false})}}
            id="username"
            type="text"
            className={`form-control ${errors.signUpUsernameError ? "border border-warning" : ""}`}
          />
        </div>
        <div className="form-group">
          <label className="mb-2" for="email">
            Email
          </label>
          <input
            onChange={(e) => {setSignUpEmail(e.target.value); setErrors({...errors, signUpEmailError: false})}}
            id="email"
            type="email"
            className={`form-control ${errors.signUpEmailError ? "border border-warning" : ""}`}

          />
        </div>
        <div className="form-group">
          <label className="mb-2 flex items-center gap-2" for="password">
            Password
            <span data-tooltip-id="my-tooltip" data-tooltip-content="Password must be of 8 characters minimum" data-tooltip-place="right">
              <AiFillQuestionCircle className="text-no_focus" />
            </span>
          </label>
          <input
            onChange={(e) => {setSignUpPassword(e.target.value); setErrors({...errors, signUpPasswordError: false})}}
            id="password"
            type="password"
            className={`form-control ${errors.signUpPasswordError ? "border border-warning" : ""}`}
          />
        </div>
        <p className="text-light_heading">
          Already have an account?{" "}
          <Link
            className="underline text-primary hover:cursor-pointer"
            to={"/login"}
          >
            Sign In
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
