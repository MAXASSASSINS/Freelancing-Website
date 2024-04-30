import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loggedUser } from "../../actions/userAction";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { getRedirectUrl } from "../../utility/util";
import { axiosInstance } from "../../utility/axiosInstance";
import { IoClose } from "react-icons/io5";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
  const [forgotLoginEmail, setForgotLoginEmail] = useState("");

  const { user, userLoading, isAuthenticated, userError } = useSelector(
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if(!forgotLoginEmail) {
      toast.error("Please enter email");
      return;
    }
    try {
      const res = await axiosInstance.post("/forgotPassword", { email: forgotLoginEmail });
      toast.success(res.data.message, { autoClose: 10000 });
      setForgotLoginEmail("");
      setOpenForgotPasswordModal(false);
    }
    catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = getRedirectUrl();
      navigate(redirectUrl);
    }
  }, [dispatch, isAuthenticated]);

  // useEffect(() => {
  //   if (userError) {
  //     toast.error(userError.message);
  //   }
  // }, [userError]);

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
            required
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
            required
          />
        </div>

        <p
          onClick={() => setOpenForgotPasswordModal(true)}
          className="ml-auto cursor-pointer text-sm text-light_heading -mt-4 hover:underline"
        >
          Forgot Password?
        </p>
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
      {openForgotPasswordModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-white relative p-8 min-w-[max(80%,20rem)] sm:min-w-[30rem] rounded-md">
            <h2 className="text-2xl text-dark_grey">Forgot Password</h2>
            <p onClick={() => setOpenForgotPasswordModal(false)} className="absolute cursor-pointer top-4 right-4"> <IoClose /> </p>
            <form onSubmit={handleForgotPassword} className="mt-4 ">
              <div className="flex flex-col text-light_heading gap-1">
                <label className="mb-2" for="email">
                  Email
                </label>
                <input
                  onChange={(e) => setForgotLoginEmail(e.target.value)}
                  type="email"
                  class="form-control text-light_heading"
                  required
                  value={forgotLoginEmail}
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-primary px-4 py-2 rounded mt-4 text-white hover:bg-primary_hover hover:cursor-pointer">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
