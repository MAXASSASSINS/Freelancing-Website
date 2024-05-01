import { toast } from "react-toastify";
import {
  USER_REQUEST,
  USER_SUCCESS,
  USER_FAIL,
  GIG_USER_FAIL,
  GIG_USER_REQUEST,
  GIG_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOGOUT_USER_REQUEST,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
  SIGNUP_USER_FAIL,
  SIGNUP_USER_REQUEST,
  SIGNUP_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
} from "../constants/userConstants";
import { axiosInstance } from "../utility/axiosInstance";
import { useNavigate } from "react-router-dom";

export const getUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_REQUEST });
    const { data } = await axiosInstance.get(`/user/${id}`);
    // const data = await user.json();

    dispatch({
      type: USER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_FAIL,
      payload: error.response.data.message,
    });
    toast.error(
      error.response.data.message
        ? error.response.data.message
        : "Oops something went wrong"
    );
  }
};

export const getGigUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: GIG_USER_REQUEST });
    const { data } = await axiosInstance.get(`/user/${id}`);
    // const data = await user.json();

    dispatch({
      type: GIG_USER_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: GIG_USER_FAIL,
      payload: error.response.data.message,
    });
    toast.error(
      error.response.data.message
        ? error.response.data.message
        : "Oops something went wrong"
    );
  }
};

export const loggedUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axiosInstance.post(
      "/login",
      { email, password },
      config
    );

    dispatch({
      type: USER_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: USER_FAIL,
      payload: error.response.data,
    });
    console.log(window.location.pathname);
    toast.error(
      error.response?.data?.message
        ? error.response.data.message
        : "An error occurred while logging in. Please try again later."
    );
  }
};

export const signUpUser = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: SIGNUP_USER_REQUEST });
    const { data } = await axiosInstance.post("/register", {
      name,
      email,
      password,
    });

    dispatch({
      type: SIGNUP_USER_SUCCESS,
    });
    toast.success(data.message, {
      timeout: 10000,
    });
  } catch (error) {
    dispatch({
      type: SIGNUP_USER_FAIL,
      payload: error.response.data.message,
    });
    toast.error(
      error.response.data.message
        ? error.response.data.message
        : "Oops something went wrong"
    );
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });
    const { data } = await axiosInstance.get("/me");

    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    // console.log(error.response);
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response.data,
      // payload: "failed user login",
    });
    // if(window.location.pathname !== '/')
    //   toast.error(
    //     error.response.data.message
    //       ? error.response.data.message
    //       : "Oops something went wrong"
    //   );
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOGOUT_USER_REQUEST });

    const { data } = await axiosInstance.get("/logout");

    dispatch({
      type: LOGOUT_USER_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: LOGOUT_USER_FAIL,
      payload: error.response.data,
    });
    toast.error(
      error.response.data.message
        ? error.response.data.message
        : "Oops something went wrong"
    );
  }
};

export const updateUser = (user) => async (dispatch) => {
  dispatch({
    type: UPDATE_USER_SUCCESS,
    payload: user,
  });
};
