import { USER_REQUEST, USER_SUCCESS, USER_FAIL, GIG_USER_FAIL, GIG_USER_REQUEST, GIG_USER_SUCCESS } from "../constants/userConstants";

export const getUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: USER_REQUEST });
        const user = await fetch(`/user/${id}`);
        const data = await user.json();

        dispatch({
            type: USER_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: USER_FAIL,
            payload: error.response.data.message,
        })
    }
}

export const getGigUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: GIG_USER_REQUEST });
        const user = await fetch(`/user/${id}`);
        const data = await user.json();

        dispatch({
            type: GIG_USER_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: GIG_USER_FAIL,
            payload: error.response.data.message,
        })
    }
}