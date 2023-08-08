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
  SIGNUP_USER_REQUEST,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAIL,
} from "../constants/userConstants";

// export const userReducer = ((state = null, action) => {
//     switch (action.type) {
//         case USER_REQUEST:
//             return null;
//         case USER_SUCCESS:
//             return action.payload.user;
//         case USER_FAIL:
//             return {
//                 userLoading: false,
//                 userError: action.payload
//             };
//         default:
//             return state;
//     }
// });

export const gigUserReducer = (state = {user: {}}, action) => {
  switch (action.type) {
    case GIG_USER_REQUEST:
      return {
        userLoading: true,
      }
    case GIG_USER_SUCCESS:
      return {
        ...state,
        userLoading: false,
        user: action.payload,
      };
    case GIG_USER_FAIL:
      return {
        userLoading: false,
        userError: action.payload,
        user: null,
      };
    default:
      return state;
  }
};

const LOGIN_USER_INITIAL_STATE = {
  isAuthenticated: false,
  userLoading: false,
  user: JSON.parse(localStorage.getItem("loggedInUser")) || null,
  userError: null,
};

export const loginUserReducer = (state = LOGIN_USER_INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
      return {
        user: null,
        userLoading: true,
        isAuthenticated: false,
        userError: null,
      };
    case LOGIN_USER_SUCCESS:
      return {
        user: action.payload,
        userLoading: false,
        isAuthenticated: true,
        userError: null,
      };
    case LOGIN_USER_FAIL:
      return {
        userLoading: false,
        isAuthenticated: false,
        user: null,
        userError: action.payload,
      };
    default:
      return state;
  }
};

export const userReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_REQUEST:
    case LOAD_USER_REQUEST:
    case SIGNUP_USER_REQUEST:
      return {
        userLoading: true,
        isAuthenticated: false,
      };
    case USER_SUCCESS:
    case LOAD_USER_SUCCESS:
    case SIGNUP_USER_SUCCESS:
      return {
        ...state,
        userLoading: false,
        isAuthenticated: true,
        user: action.payload,
      };

    case USER_FAIL:
    case SIGNUP_USER_FAIL:
      return {
        ...state,
        userLoading: false,
        isAuthenticated: false,
        user: null,
        userError: action.payload,
      };

    case LOAD_USER_FAIL:
      return {
        userLoading: false,
        isAuthenticated: false,
        user: null,
        userError: action.payload,
      };

    case LOGOUT_USER_REQUEST:
      return {
        ...state,
        userLoading: true,
      };

    case LOGOUT_USER_SUCCESS:
      return {
        userLoading: false,
        isAuthenticated: false,
        user: {},
      };

    case LOGOUT_USER_FAIL:
      return {
        ...state,
        userLoading: false,
        userError: action.payload,
      };

    default: {
      return state;
    }
  }
};
