import { toast } from "react-toastify";
import {
  ALL_GIG_FAIL,
  ALL_GIG_REQUEST,
  ALL_GIG_SUCCESS,
  USER_GIGS_REQUEST,
  USER_GIGS_SUCCESS,
  USER_GIGS_FAIL,
  GIG_DETAIL_FAIL,
  GIG_DETAIL_REQUEST,
  GIG_DETAIL_SUCCESS,
  UPDATE_ALL_GIGS_REQUEST,
  UPDATE_ALL_GIGS_SUCCESS,
  UPDATE_ALL_GIGS_FAIL,
  CLEAR_ERRORS,
} from "../constants/gigConstants.js";
import { axiosInstance } from "../utility/axiosInstance.js";

export const getAllGig = (keywords, category) => async (dispatch) => {
  try {
    dispatch({ type: ALL_GIG_REQUEST });
    let payload = {};
    if (keywords) {
      const { data } = await axiosInstance.get(
        `/gig/gigs?keywords=${keywords}`
      );
      payload = data.gigs;
    } else if (category) {
      const { data } = await axiosInstance.get(
        `/gig/gigs?category=${category}`
      );
      payload = data.gigs;
    } else {
      const { data } = await axiosInstance.get(`/gig/gigs`);
      payload = data.gigs;
    }
    dispatch({
      type: ALL_GIG_SUCCESS,
      payload,
    });
  } catch (error) {
    dispatch({
      type: ALL_GIG_FAIL,
      payload: error.response.data,
    });
    toast.error(error.response.data.message ? error.response.data.message : "Oops something went wrong");
  }
};

export const getUserGigs = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_GIGS_REQUEST });

    const { data } = await axiosInstance.get(`/gig/gigs/user/${id}`);
    // const data = await fetchedData.json();

    dispatch({
      type: USER_GIGS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_GIGS_FAIL,
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message ? error.response.data.message : "Oops something went wrong");
  }
};

export const getGigDetail = (id) => async (dispatch) => {
  //
  try {
    dispatch({ type: GIG_DETAIL_REQUEST });

    const { data } = await axiosInstance.get(`/gig/details/${id}`);

    dispatch({
      type: GIG_DETAIL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GIG_DETAIL_FAIL,
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message ? error.response.data.message : "Oops something went wrong");
  }
};

export const getFavoriteGigs = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_GIG_REQUEST });
    const { data } = await axiosInstance.get("/gig/favourite");
    dispatch({
      type: ALL_GIG_SUCCESS,
      payload: data.favouriteGigs,
    });
  } catch (error) {
    dispatch({
      type: ALL_GIG_FAIL,
      payload: error.response,
    });
    toast.error(error.response.data.message ? error.response.data.message : "Oops something went wrong");
  }
};

export const updateAllGigs = (data) => async (dispatch) => {
  dispatch({
    type: UPDATE_ALL_GIGS_SUCCESS,
    payload: data,
  });
};

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
