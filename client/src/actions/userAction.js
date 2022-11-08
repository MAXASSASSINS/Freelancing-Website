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
    LOAD_USER_SUCCESS

} from "../constants/userConstants";
import axios from 'axios'


export const getUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: USER_REQUEST });
        const { data } = await axios.get(`/user/${id}`);
        // const data = await user.json();

        dispatch({
            type: USER_SUCCESS,
            payload: data,
        })
    }
    catch (error) {
        dispatch({
            type: USER_FAIL,
            payload: error.response.data.message,
        })
    }
}

export const getGigUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: GIG_USER_REQUEST });
        const { data } = await axios.get(`/user/${id}`);
        // const data = await user.json();

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

export const loggedUser = (email, password) => async (dispatch) => {
    try {
        // dispatch({ type: LOGIN_USER_REQUEST });
        dispatch({ type: USER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
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
        })
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
            payload: error.response.data
            // payload: "failed user login",
        });
        // return false;
    }
}

export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });
        const { data } = await axios.get("/me");

        // console.log(data);

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user,
        })

    } catch (error) {
        // console.log(error.response);
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data
            // payload: "failed user login",
        });
    }
}