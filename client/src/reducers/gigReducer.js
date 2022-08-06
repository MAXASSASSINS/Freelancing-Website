import {
    ALL_GIG_FAIL, ALL_GIG_REQUEST, ALL_GIG_SUCCESS,
    USER_GIGS_REQUEST, USER_GIGS_SUCCESS, USER_GIGS_FAIL,
    GIG_DETAIL_REQUEST, GIG_DETAIL_SUCCESS, GIG_DETAIL_FAIL,
    CLEAR_ERRORS
} from "../constants/gigConstants.js";

export const gigReducer = ((state = { gigs: null }, action) => {
    switch (action.type) {
        case ALL_GIG_REQUEST:
            return {
                loading: true,
                gigs: null,
            };
        case ALL_GIG_SUCCESS:
            return {
                loading: false,
                gigs: action.payload.gigs,
                gigsCount: action.payload.gigsCount,
            };
        case ALL_GIG_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
});


export const userGigsDetailsReducer = ((state = { userGigs: [] }, action) => {
    switch (action.type) {
        case USER_GIGS_REQUEST:
            return {
                loading: true,
                userGigs: null,
            };
        case USER_GIGS_SUCCESS:
            return {
                loading: false,
                userGigs: action.payload.userGigs,
            };
        case USER_GIGS_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
});

export const gigDetailReducer = ((state = { gigDetail: null }, action) => {
    switch (action.type) {
        case GIG_DETAIL_REQUEST:
            return {
                loading: true,
                gigDetail: null,
            };
        case GIG_DETAIL_SUCCESS:
            return {
                loading: false,
                gigDetail: action.payload.gig,
            };
        case GIG_DETAIL_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
});