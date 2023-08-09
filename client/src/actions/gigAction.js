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

export const getAllGig = (keywords) => async (dispatch) => {
  try {
    dispatch({ type: ALL_GIG_REQUEST });
    if (!keywords) {
      keywords = "";
    }
    const { data } = await axiosInstance.get(`/gig/gigs?keywords=${keywords}`);
    // const data = await fetchedData.json();

    dispatch({
      type: ALL_GIG_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_GIG_FAIL,
      payload: error.response.data.message,
    });
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
  }
};

export const getGigDetail = (id) => async (dispatch) => {
  // console.log(id);
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
