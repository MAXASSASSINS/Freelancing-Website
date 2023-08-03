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
} from "../constants/userConstants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const getUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_REQUEST });
    const { data } = await axios.get(`/user/${id}`);
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
  }
};

export const getGigUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: GIG_USER_REQUEST });
    const { data } = await axios.get(`/user/${id}`);
    // const data = await user.json();

    dispatch({
      type: GIG_USER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GIG_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const loggedUser = (email, password) => async (dispatch) => {
  try {
    // dispatch({ type: LOGIN_USER_REQUEST });
    dispatch({ type: USER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post("/login", { email, password }, config);

    console.log(data);
    // console.log(dispatch);

    // localStorage.setItem("loggedInUser", JSON.stringify(data.user));

    // dispatch({
    //     type: LOGIN_USER_SUCCESS,
    //     payload: data.user,
    // })

    dispatch({
      type: USER_SUCCESS,
      payload: data.user,
    });
    // return true;
  } catch (error) {
    // console.log(error.response);
    // dispatch({
    //     type: LOGIN_USER_FAIL,
    //     payload: error.response.data
    //     // payload: "failed user login",
    // });
    dispatch({
      type: USER_FAIL,
      payload: error.response.data,
      // payload: "failed user login",
    });
    // return false;
  }
};

export const signUpUser = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: SIGNUP_USER_REQUEST });

    const {data} = await axios.post("/register", { name, email, password });

    dispatch({
      type: SIGNUP_USER_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: SIGNUP_USER_FAIL,
      payload: error.response.data,
    });
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });
    const { data } = await axios.get("/me");

    console.log('me', data);

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
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOGOUT_USER_REQUEST });

    const { data } = await axios.get("/logout");

    dispatch({
      type: LOGOUT_USER_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: LOGOUT_USER_FAIL,
      payload: error.response.data,
    });
  }
};
