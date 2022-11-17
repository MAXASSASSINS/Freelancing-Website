import {
    ALL_GIG_FAIL, ALL_GIG_REQUEST, ALL_GIG_SUCCESS,
    USER_GIGS_REQUEST, USER_GIGS_SUCCESS, USER_GIGS_FAIL,
    GIG_DETAIL_FAIL, GIG_DETAIL_REQUEST, GIG_DETAIL_SUCCESS,
    UPDATE_ALL_GIGS_REQUEST, UPDATE_ALL_GIGS_SUCCESS, UPDATE_ALL_GIGS_FAIL,
    CLEAR_ERRORS
} from "../constants/gigConstants.js";
import axios from 'axios'


export const getAllGig = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_GIG_REQUEST });
        const { data } = await axios.get('/gig/gigs');
        // const data = await fetchedData.json();

        dispatch({
            type: ALL_GIG_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: ALL_GIG_FAIL,
            payload: error.response.data.message,
        })
    }
}

export const getUserGigs = (id) => async (dispatch) => {
    try {
        dispatch({ type: USER_GIGS_REQUEST });

        const { data } = await axios.get(`/gig/gigs/user/${id}`);
        // const data = await fetchedData.json();

        dispatch({
            type: USER_GIGS_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: USER_GIGS_FAIL,
            payload: error.response.data.message,
        })
    }
}

export const getGigDetail = (id) => async (dispatch) => {
    try {
        dispatch({ type: GIG_DETAIL_REQUEST });

        const { data } = await axios.get(`/gig/details/${id}`);
        // const data = await fetchedData.json();

        dispatch({
            type: GIG_DETAIL_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: GIG_DETAIL_FAIL,
            payload: error.response.data.message,
        })
    }
}

export const updateAllGigs = (data) => async dispatch => {
    dispatch({
        type: UPDATE_ALL_GIGS_SUCCESS,
        payload: data
    })
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })

}