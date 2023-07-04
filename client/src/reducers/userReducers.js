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
} from "../constants/userConstants";

// export const userReducer = ((state = null, action) => {
//     switch (action.type) {
//         case USER_REQUEST:
//             return null;
//         case USER_SUCCESS:
//             return action.payload.user;
//         case USER_FAIL:
//             return {
//                 loading: false,
//                 error: action.payload
//             };
//         default:
//             return state;
//     }
// });

export const gigUserReducer = (state = null, action) => {
  switch (action.type) {
    case GIG_USER_REQUEST:
      return null;
    case GIG_USER_SUCCESS:
      return action.payload.user;
    case GIG_USER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const LOGIN_USER_INITIAL_STATE = {
  isAuthenticated: false,
  loading: false,
  user: JSON.parse(localStorage.getItem("loggedInUser")) || null,
  error: null,
};

export const loginUserReducer = (state = LOGIN_USER_INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
      return {
        user: null,
        loading: true,
        isAuthenticated: false,
        error: null,
      };
    case LOGIN_USER_SUCCESS:
      return {
        user: action.payload,
        loading: false,
        isAuthenticated: true,
        error: null,
      };
    case LOGIN_USER_FAIL:
      return {
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const userReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_REQUEST:
    case LOAD_USER_REQUEST:
      return {
        loading: true,
        isAuthenticated: false,
      };
    case USER_SUCCESS:
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };

    case USER_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    case LOAD_USER_FAIL:
      return {
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    case LOGOUT_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case LOGOUT_USER_SUCCESS:
      return {
        loading: false,
        isAuthenticated: false,
        user: {},
      };

    case LOGOUT_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default: {
      return state;
    }
  }
};
