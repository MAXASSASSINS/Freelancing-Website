import { USER_REQUEST, USER_SUCCESS, USER_FAIL, GIG_USER_FAIL, GIG_USER_REQUEST, GIG_USER_SUCCESS, LOGIN_USER_FAIL, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS } from "../constants/userConstants";

export const userReducer = ((state = null, action) => {
    switch (action.type) {
        case USER_REQUEST:
            return null;
        case USER_SUCCESS:
            return action.payload.user;
        case USER_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
});

export const gigUserReducer = ((state = null, action) => {
    switch (action.type) {
        case GIG_USER_REQUEST:
            return null;
        case GIG_USER_SUCCESS:
            return action.payload.user;
        case GIG_USER_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
});

const LOGIN_USER_INITIAL_STATE = {
    isAutheticated: false,
    loading: false,
    user: JSON.parse(localStorage.getItem("loggedInUser")) || null,
    error: null,
}

export const loginUserReducer = ((state = LOGIN_USER_INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_USER_REQUEST:
            return {
                user: null,
                loading: true,
                isAutheticated: false,
                error: null
            };
        case LOGIN_USER_SUCCESS:
            return {
                user: action.payload,
                loading: false,
                isAutheticated: true,
                error: null,
            };
        case LOGIN_USER_FAIL:
            return {
                loading: false,
                isAutheticated: false,
                user: null,
                error: action.payload
            };
        default:
            return state;
    }
});