import { USER_REQUEST, USER_SUCCESS, USER_FAIL, GIG_USER_FAIL, GIG_USER_REQUEST, GIG_USER_SUCCESS } from "../constants/userConstants";

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