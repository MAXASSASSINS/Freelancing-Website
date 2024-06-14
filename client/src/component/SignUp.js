import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../actions/userAction";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AiFillQuestionCircle } from "react-icons/ai";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";

export const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user, userLoading, isAuthenticated, userError } = useSelector(
    (state) => state.user
  );

  const [errors, setErrors] = useState({
    signUpEmailError: false,
    signUpPasswordError: false,
    signUpUsernameError: false,
    signUpConfirmPasswordError: false,
  });

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    let error = {
      signUpEmailError: false,
      signUpPasswordError: false,
      signUpUsernameError: false,
      signUpConfirmPasswordError: false,
    };
    if (
      !signUpUsername ||
      signUpUsername.length < 4 ||
      signUpUsername.length > 50
    ) {
      error = { ...error, signUpUsernameError: true };
    }
    if (!signUpEmail) {
      error = { ...error, signUpEmailError: true };
    }
    if (!signUpPassword || signUpPassword.length < 8) {
      error = { ...error, signUpPasswordError: true };
    }
    if (!signUpConfirmPassword || signUpPassword !== signUpConfirmPassword) {
      error = { ...error, signUpConfirmPasswordError: true };
    }
    if (
      error.signUpEmailError ||
      error.signUpPasswordError ||
      error.signUpUsernameError ||
      error.signUpConfirmPasswordError
    ) {
      setErrors(error);
      return;
    }
    dispatch(
      signUpUser(
        signUpUsername,
        signUpEmail,
        signUpPassword,
        signUpConfirmPassword
      )
    )
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   if (isAuthenticated && user.isEmailVerified) {
  //     navigate(-1);
  //   }
  // }, [dispatch, isAuthenticated]);

  return (
    <div className="p-8 mt-20 md:mt-[10vh] col-md-4 offset-md-4">
      <div className="text-center">
        <h2 className="text-5xl">Welcome</h2>
      </div>
      <form className="mt-8 flex flex-col gap-4" onSubmit={handleSignUpSubmit}>
        <div className="form-group">
          <label className="mb-2 flex gap-2 items-center" for="email">
            Username
            <span
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Username must contain 4 - 50 characters"
              data-tooltip-place="right"
            >
              <AiFillQuestionCircle className="text-no_focus" />
            </span>
          </label>
          <input
            onChange={(e) => {
              setSignUpUsername(e.target.value);
              setErrors({ ...errors, signUpUsernameError: false });
            }}
            id="username"
            type="text"
            className={`form-control ${
              errors.signUpUsernameError ? "border border-warning" : ""
            }`}
          />
        </div>
        <div className="form-group">
          <label className="mb-2" for="email">
            Email
          </label>
          <input
            onChange={(e) => {
              setSignUpEmail(e.target.value);
              setErrors({ ...errors, signUpEmailError: false });
            }}
            id="email"
            type="email"
            className={`form-control ${
              errors.signUpEmailError ? "border border-warning" : ""
            }`}
          />
        </div>
        <div className="form-group">
          <label className="mb-2 flex items-center gap-2" for="password">
            Password
            <span
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Password must be of 8 characters minimum"
              data-tooltip-place="right"
            >
              <AiFillQuestionCircle className="text-no_focus" />
            </span>
          </label>
          <div className="relative flex items-center">
            <input
              onChange={(e) => {
                setSignUpPassword(e.target.value);
                setErrors({ ...errors, signUpPasswordError: false });
              }}
              id="password"
              type={showPassword ? "text" : "password"}
              className={`form-control pr-10 ${
                errors.signUpPasswordError ? "border border-warning" : ""
              }`}
            />
            {showPassword ? (
              <FaEyeSlash
                className="absolute right-4 text-light_heading cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <FaRegEye
                className="absolute right-4 text-light_heading cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>
        </div>
        <div className="form-group">
          <label
            className="mb-2 flex items-center gap-2"
            for="confirm_password"
          >
            Confirm Password
            <span
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Confrim Password must match password"
              data-tooltip-place="right"
            >
              <AiFillQuestionCircle className="text-no_focus" />
            </span>
          </label>
          <div className="flex items-center relative">
            <input
              onChange={(e) => {
                setSignUpConfirmPassword(e.target.value);
                setErrors({ ...errors, signUpConfirmPasswordError: false });
              }}
              id="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              className={`form-control ${
                errors.signUpConfirmPasswordError ? "border border-warning" : ""
              }`}
            />
            {showConfirmPassword ? (
              <FaEyeSlash
                className="absolute right-4 text-light_heading cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            ) : (
              <FaRegEye
                className="absolute right-4 text-light_heading cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            )}
          </div>
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
